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
      // Generated typed-update is too strict for a built-at-runtime
      // payload; cast keeps the runtime shape intact.
      .update(update as never)
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
 * Server Action: "Try again" — the only manual recovery affordance.
 *
 * Surfaced ONLY on cards that auto-retry has exhausted (4 attempts
 * failed; metadata.execution_blocker is set). The CSM clicks this when
 * they want to give it one more shot — usually because the failure was
 * probably transient (network blip, rate limit) and one fresh dispatch
 * clears it.
 *
 * What it does:
 *   - resets metadata.retry_attempts to 0 (gives it a full new budget
 *     of auto-retries if this attempt also fails)
 *   - clears execution_blocker and execution_error
 *   - stamps last_retry_at = now so getUiState returns "processing"
 *     immediately and the card moves out of Needs-attention back into
 *     the In-flight section
 *   - fires the Hermes webhook one more time
 *
 * Idempotency: Bell + Hopper both check metadata.executed=true before
 * acting, so re-firing on a row that quietly succeeded after the
 * blocker was set is still a safe no-op.
 */
export async function tryAgainDispatch(
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

    const fresh = { ...(row.metadata as Record<string, unknown>) };
    delete fresh.execution_blocker;
    delete fresh.execution_error;
    fresh.retry_attempts = 0;
    fresh.last_retry_at = new Date().toISOString();
    await sb
      .from("approvals")
      .update({ metadata: fresh as Json })
      .eq("id", approvalId);

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

/**
 * Server Action: append a steering instruction to an approval.
 *
 * The CSM types a re-prompt ("don't update the save plan to that —
 * update it to X") and we store it in approvals.metadata.steering as an
 * append-only array. Agent-side consumption is Angel's wiring; here we
 * just persist so nothing is black-holed.
 *
 * No schema change required — metadata is JSONB.
 */
export async function addSteeringInstruction(
  id: string,
  text: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return { ok: false, error: "empty instruction" };
  }
  try {
    const sb = createSupabaseAdminClient();

    // Read-modify-write the metadata JSONB. Pull the existing record so
    // we don't clobber sibling keys (account_name, risk_level, …).
    const { data: existing, error: readErr } = await sb
      .from("approvals")
      .select("metadata")
      .eq("id", id)
      .single();
    if (readErr) return { ok: false, error: readErr.message };

    const meta = (existing.metadata ?? {}) as Record<string, unknown>;
    const priorSteering = Array.isArray(meta.steering)
      ? (meta.steering as Array<{ text: string; sent_at: string }>)
      : [];

    const next = {
      ...meta,
      steering: [...priorSteering, { text: trimmed, sent_at: new Date().toISOString() }],
    };

    const { error: writeErr } = await sb
      .from("approvals")
      .update({ metadata: next } as never)
      .eq("id", id);
    if (writeErr) return { ok: false, error: writeErr.message };

    // TODO(angel): wire agent-side consumption of metadata.steering so
    // Galileo re-drafts the proposal based on the user's correction.
    revalidatePath("/approvals");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "unknown error",
    };
  }
}
