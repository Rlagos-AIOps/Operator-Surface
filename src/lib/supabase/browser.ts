import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Supabase client for browser (client component) usage.
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * Auth state is persisted in cookies via @supabase/ssr's helpers,
 * so server and client see the same session.
 *
 * Service role key MUST NOT be used here — that lives in the Hermes
 * repo, never in this app.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
