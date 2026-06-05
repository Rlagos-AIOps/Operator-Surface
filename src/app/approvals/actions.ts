"use server";

import { createHmac } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/types";
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
  editedProposedValue?: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const sb = createSupabaseAdminClient();
    const operatorId = await getDemoOperatorId();

    const trimmed = note?.trim();
    // Build the update payload. proposed_value only gets written when the
    // CSM actually edited the draft AND chose to approve — Reject discards
    // edits because the action isn't going to happen. Bell/Hopper read
    // proposed_value at execute time, so the edit must land BEFORE the
    // webhook fires (which it does — this PATCH is awaited).
    const update: Record<string, unknown> = {
      status: decision,
      decided_by: operatorId,
      decided_at: new Date().toISOString(),
      decision_note: trimmed && trimmed.length > 0 ? trimmed : null,
    };
    if (editedProposedValue !== undefined) {
      update.proposed_value = editedProposedValue as Json;
    }

    const { error } = await sb
      .from("approvals")
      .update(update)
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

// retryHermesWebhook removed 2026-06-05. Manual retry is now handled by the
// server-side auto-retry timer on the droplet (~/hermes-scaled-cs/services/
// auto-retry/auto_retry.py, fires every 60s, exponential schedule
// [2, 5, 10, 20] min). The CSM never needs to think about dispatch failures
// — the system retries, and surfaces "Needs attention" only when retries
// exhaust.

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
