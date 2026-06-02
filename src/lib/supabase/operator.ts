import "server-only";

import { createSupabaseAdminClient } from "./admin";

/**
 * Demo-mode helper: resolve the demo operator's auth.users id by email.
 *
 * Used by server components (brief page, hub) and the approvals
 * Server Action. Cached for the lifetime of the server process.
 *
 * When Task 3 (Auth) lands, this gets replaced with the real
 * `supabase.auth.getUser()` call.
 */
let cachedId: string | null = null;
let cachedFor: string | null = null;

export async function getDemoOperatorId(): Promise<string> {
  const email = process.env.DEMO_OPERATOR_EMAIL ?? "taylor@example-csm.test";
  if (cachedId && cachedFor === email) return cachedId;

  const sb = createSupabaseAdminClient();
  for (let page = 1; page <= 5; page++) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error(`listUsers failed: ${error.message}`);
    const found = data.users.find((u) => u.email === email);
    if (found) {
      cachedId = found.id;
      cachedFor = email;
      return found.id;
    }
    if (data.users.length < 200) break;
  }
  throw new Error(
    `Demo operator ${email} not found in auth.users. Re-run npm run db:seed.`,
  );
}

/** Convenience for components that need to render the email (e.g. EmptyState). */
export function getDemoOperatorEmail(): string {
  return process.env.DEMO_OPERATOR_EMAIL ?? "taylor@example-csm.test";
}
