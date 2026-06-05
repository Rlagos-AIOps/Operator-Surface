"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getDemoOperatorId } from "@/lib/supabase/operator";

/**
 * Server Action: decide an approval.
 *
 * Demo-mode behaviour: `decided_by` is the UUID of the operator whose
 * email matches DEMO_OPERATOR_EMAIL (default: taylor@example-csm.test).
 * Resolved by the shared helper in lib/supabase/operator.ts.
 *
 * When Task 3 (Auth) lands, this swaps to `auth.getUser().id`.
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

    // Hub renders the pending-count chip and Brief shows the priority
    // list — both read the same approvals data live. Revalidate them
    // so the count doesn't visibly stay stale after a decision.
    revalidatePath("/");
    revalidatePath("/brief");
    revalidatePath("/approvals");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "unknown error",
    };
  }
}

/**
 * Server Action: append a steering instruction to an approval.
 *
 * The CSM types a re-prompt ("don't update the save plan to that —
 * update it to X") and we store it in approvals.metadata.steering
 * as an append-only array. Agent-side consumption is Angel's wiring;
 * here we just persist so nothing is black-holed.
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
      .update({ metadata: next })
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
