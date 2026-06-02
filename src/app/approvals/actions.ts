"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Server Action: decide an approval.
 *
 * Demo-mode behaviour: `decided_by` is the UUID of the operator whose
 * email matches DEMO_OPERATOR_EMAIL (default: taylor@example-csm.test).
 * Cached after the first lookup.
 *
 * When Task 3 (Auth) lands, this swaps to `auth.getUser().id`.
 */

let cachedOperatorId: string | null = null;

async function getDemoOperatorId(): Promise<string> {
  if (cachedOperatorId) return cachedOperatorId;

  const email = process.env.DEMO_OPERATOR_EMAIL ?? "taylor@example-csm.test";
  const sb = createSupabaseAdminClient();

  // listUsers is paginated. Two pages is enough for any dev project.
  for (let page = 1; page <= 5; page++) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error(`listUsers failed: ${error.message}`);
    const found = data.users.find((u) => u.email === email);
    if (found) {
      cachedOperatorId = found.id;
      return found.id;
    }
    if (data.users.length < 200) break;
  }
  throw new Error(
    `Demo operator ${email} not found in auth.users. Re-run npm run db:seed.`,
  );
}

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

    revalidatePath("/approvals");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "unknown error",
    };
  }
}
