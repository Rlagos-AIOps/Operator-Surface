/**
 * scripts/verify-seed.ts — Independent row-count check
 *
 * Runs a fresh count(*) against each public.* table using the service
 * role key. Use to verify the seed landed without re-running the seed.
 *
 * Usage:
 *
 *   SUPABASE_SERVICE_ROLE_KEY=<key> npm run db:verify
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // optional
  }
}

loadEnvLocal();

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL_ || !KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const sb = createClient(URL_, KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TABLES = [
  "agents",
  "approvals",
  "decisions",
  "agent_runs",
  "briefs",
  "connections",
] as const;

async function main() {
  const out: Record<string, number | string> = {};
  let allOk = true;
  for (const t of TABLES) {
    const { count, error } = await sb
      .from(t)
      .select("*", { head: true, count: "exact" });
    if (error) {
      out[t] = `ERROR: ${error.message}`;
      allOk = false;
    } else {
      out[t] = count ?? 0;
    }
  }

  // Print in SQL-result style
  console.log("\nRow counts (live query against hosted DB):");
  console.log("┌────────────────┬─────────┐");
  console.log("│ table          │   count │");
  console.log("├────────────────┼─────────┤");
  for (const t of TABLES) {
    const v = out[t];
    console.log(`│ ${t.padEnd(14)} │ ${String(v).padStart(7)} │`);
  }
  console.log("└────────────────┴─────────┘");

  if (!allOk) process.exit(1);
}

main().catch((err) => {
  console.error("verify failed:", err);
  process.exit(1);
});
