import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * GET /api/health
 *
 * Verifies the Supabase connection by issuing a HEAD-style count
 * against the `agents` table. Returns:
 *   { ok: true, agents: <count> }
 * on success, or 500 + { ok: false, error } on failure.
 *
 * Used by the local dev smoke test and the Vercel uptime probe.
 */
export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { error, count } = await supabase
    .from("agents")
    .select("*", { count: "exact", head: true });

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, agents: count ?? 0 });
}
