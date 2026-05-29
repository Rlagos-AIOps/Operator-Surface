import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

/**
 * Supabase client for server-side (Server Components, Route Handlers,
 * Server Actions) usage.
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY and
 * threads auth cookies through next/headers so the request sees the
 * authenticated user when present.
 *
 * Service role key MUST NOT be used here — that lives in the Hermes
 * repo, never in this app.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // setAll is called from Server Components in some paths;
            // mutating cookies is only allowed in Route Handlers and
            // Server Actions. Middleware refreshes the session on the
            // request side, so this is safe to swallow.
          }
        },
      },
    },
  );
}
