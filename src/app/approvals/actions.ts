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
