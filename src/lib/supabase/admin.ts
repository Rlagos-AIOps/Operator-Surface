import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Server-only Supabase client using the SERVICE ROLE key.
 *
 * ⚠️ This client BYPASSES Row Level Security. It is a deliberate
 * workaround for the pre-Auth demo phase. When Task 3 (Supabase Auth /
 * Google OAuth) lands, this file gets deleted and reads return to
 * `src/lib/supabase/server.ts` (user-scoped, RLS-respecting).
 *
 * The `import "server-only"` at the top is enforced by Next.js: any
 * client component that transitively imports this module fails the
 * build. The runtime check below is belt + suspenders.
 *
 * Allowed callers:
 *   - Server Components (e.g. src/app/.../page.tsx)
 *   - Server Actions   (files with "use server" directive)
 *   - Route Handlers   (src/app/api/.../route.ts)
 */
if (typeof window !== "undefined") {
  throw new Error(
    "src/lib/supabase/admin.ts was imported on the client. " +
      "This module uses the service role key and must never reach the browser bundle.",
  );
}

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL_) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
}
if (!KEY) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is not set. " +
      "Add it to .env.local for local dev, or to Vercel project env (server-only).",
  );
}

let _client: SupabaseClient<Database> | null = null;

export function createSupabaseAdminClient(): SupabaseClient<Database> {
  if (_client) return _client;
  _client = createClient<Database>(URL_!, KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _client;
}
