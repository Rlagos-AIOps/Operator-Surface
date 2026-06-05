"use server";

import { createHmac } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getDemoOperatorId } from "@/lib/supabase/operator";

/**
 * Server Action: decide an approval.
 *
 * Demo-mode behaviour: `decided_by` is the UUID of the operator whose
 * email matches DEMO_OPERATOR_EMAIL (default: taylor@example-csm.test).
 *
 * Webhook bridge (v1.6.x): after the DB update succeeds, if the decision
 * is "approved" and HERMES_WEBHOOK_URL is configured, fire a webhook to
 * the Hermes droplet so Galileo can dispatch the right worker. The call
 * is fire-and-forget — it does NOT block the UI, and a failure does NOT
 * mark the approval decision as failed (the row IS approved in Supabase
 * regardless).
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

    // Bridge to Hermes — fire-and-forget on approve.
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
 * Fire-and-forget HMAC-signed POST to the Hermes webhook receiver.
 *
 * Receiver lives at `${HERMES_WEBHOOK_URL}/webhook/approval` (typically
 * http://137.184.137.125:8080). It verifies the signature, async-spawns
 * Galileo with the approval id, and returns 202 in <100ms. This function
 * tolerates a slow Hermes side via a 5s timeout.
 *
 * Required env vars (Vercel → Project Settings → Environment Variables):
 *   HERMES_WEBHOOK_URL     base URL, no trailing slash
 *   HERMES_WEBHOOK_SECRET  same secret as ~/.hermes/secrets/webhook.env on the droplet
 *
 * If unset, this is a no-op — the rest of the flow still works.
 */
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
