"use server";

import { createHmac } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getDemoOperatorId } from "@/lib/supabase/operator";

/**
 * Server Action: decide an approval.
 *
 * Webhook bridge (v1.6.x): on approve, fire a webhook to the Hermes
 * droplet so Galileo can dispatch the right worker. Fire-and-forget —
 * does NOT block the UI, and a failure does NOT mark the approval as
 * failed (the row IS approved in Supabase regardless).
 */

export async function decideApproval(
  id: string,
  decision: "approved" | "rejected",
  note?: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const sb = createSupabaseAdminClient();
    const operatorId = await getDemoOperatorId();

    const trimmed = note?.trim();
    const { error } = await sb
      .from("approvals")
      .update({
        status: decision,
        decided_by: operatorId,
        decided_at: new Date().toISOString(),
        decision_note: trimmed && trimmed.length > 0 ? trimmed : null,
      })
      .eq("id", id);

    if (error) return { ok: false, error: error.message };

    revalidatePath("/");
    revalidatePath("/brief");
    revalidatePath("/approvals");

    if (decision === "approved") {
      void fireHermesWebhook(id, operatorId).catch((err) => {
        console.error(
          "[hermes-webhook] non-fatal failure for approval " + id + ":",
          err instanceof Error ? err.message : String(err),
        );
      });
    }

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "unknown error",
    };
  }
}

/**
 * Server Action: retry the Hermes webhook for a stalled approval.
 *
 * Called from the ApprovalCard's Retry button when an approval has been
 * sitting in "processing" past the stalled threshold. Verifies the row is
 * actually in a retry-eligible state before re-firing (status="approved"
 * AND metadata.executed not true). Clears prior execution_blocker /
 * execution_error so the UI doesn't keep showing a stale message on
 * successful retry.
 *
 * Idempotency safety net: Hermes-side is already idempotent (Hopper's
 * bright-line check refuses if metadata.executed === true), so re-firing
 * for an already-executed approval is a clean no-op downstream.
 */
export async function retryHermesWebhook(
  approvalId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const sb = createSupabaseAdminClient();
    const operatorId = await getDemoOperatorId();

    const { data: row, error: readErr } = await sb
      .from("approvals")
      .select("status,metadata")
      .eq("id", approvalId)
      .single();

    if (readErr || !row) {
      return { ok: false, error: "approval not found: " + (readErr?.message ?? "no row") };
    }
    if (row.status !== "approved") {
      return { ok: false, error: "cannot retry: approval is " + row.status };
    }
    const meta = (row.metadata ?? {}) as { executed?: boolean };
    if (meta.executed === true) {
      return { ok: false, error: "already executed — refresh the page" };
    }

    const cleared = { ...(row.metadata as Record<string, unknown>) };
    delete cleared.execution_blocker;
    delete cleared.execution_error;
    await sb.from("approvals").update({ metadata: cleared }).eq("id", approvalId);

    await fireHermesWebhook(approvalId, operatorId);

    revalidatePath("/approvals");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "unknown error",
    };
  }
}

async function fireHermesWebhook(
  approvalId: string,
  operatorId: string,
): Promise<void> {
  const baseUrl = process.env.HERMES_WEBHOOK_URL;
  const secret = process.env.HERMES_WEBHOOK_SECRET;

  if (!baseUrl || !secret) {
    console.warn(
      "[hermes-webhook] HERMES_WEBHOOK_URL or HERMES_WEBHOOK_SECRET unset — " +
        "skipping webhook for approval " + approvalId,
    );
    return;
  }

  const url = baseUrl.replace(/\/+$/, "") + "/webhook/approval";
  const body = JSON.stringify({
    approval_id: approvalId,
    decision: "approved" as const,
    actor: operatorId,
    metadata: { source: "operator-surface", surface: "decideApproval" },
  });
  const signature =
    "sha256=" + createHmac("sha256", secret).update(body).digest("hex");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Hermes-Signature": signature,
      },
      body,
      signal: controller.signal,
    });
    if (resp.status >= 400) {
      const text = await resp.text().catch(() => "(no body)");
      console.error(
        "[hermes-webhook] receiver returned " + resp.status + " for " +
          approvalId + ": " + text.slice(0, 400),
      );
    } else {
      console.log(
        "[hermes-webhook] dispatched " + approvalId + " (status " + resp.status + ")",
      );
    }
  } finally {
    clearTimeout(timer);
  }
}
