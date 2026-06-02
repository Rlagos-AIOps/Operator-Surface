/**
 * scripts/seed.ts — Operator Surface dev seed
 *
 * Populates the v1 Supabase schema with realistic CSM sample data so
 * screens have something to render against during development.
 *
 * Idempotent: clears all public.* tables (preserving auth.users) and
 * re-inserts. Upserts the two placeholder operators by email so their
 * auth.users ids are stable across runs.
 *
 * Usage (from repo root):
 *
 *   SUPABASE_SERVICE_ROLE_KEY=<key from dashboard> npm run db:seed
 *
 * NEXT_PUBLIC_SUPABASE_URL is read from .env.local (already required by
 * the app).
 *
 * SECURITY: The service role key bypasses RLS. This script is the ONLY
 * place in this repo allowed to use it. Do not import this file from
 * anywhere in src/. The key is never written to any file — pass it as a
 * one-shot environment variable on each invocation.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Database } from "../src/lib/supabase/types";

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

function loadEnvLocal() {
  // Tiny .env.local reader so we don't add a `dotenv` dep.
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
    // .env.local optional — fall through and rely on real env.
  }
}

loadEnvLocal();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error("✗ NEXT_PUBLIC_SUPABASE_URL is not set (expected in .env.local).");
  process.exit(1);
}
if (!SERVICE_ROLE) {
  console.error("✗ SUPABASE_SERVICE_ROLE_KEY is required.");
  console.error("  Get it from: Supabase dashboard → Settings → API → service_role.");
  console.error("  Usage:        SUPABASE_SERVICE_ROLE_KEY=<key> npm run db:seed");
  process.exit(1);
}

const sb: SupabaseClient<Database> = createClient<Database>(
  SUPABASE_URL,
  SERVICE_ROLE,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

// ---------------------------------------------------------------------------
// Time helpers (everything anchored to "now" so the data feels fresh)
// ---------------------------------------------------------------------------

const NOW = Date.now();
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

const iso = (offsetMs: number) => new Date(NOW + offsetMs).toISOString();
const isoDate = (offsetDays: number) =>
  new Date(NOW + offsetDays * DAY).toISOString().slice(0, 10);

// ---------------------------------------------------------------------------
// Placeholder operators
// ---------------------------------------------------------------------------

interface SeedOperator {
  email: string;
  fullName: string;
  id?: string;
}

const OPERATORS: SeedOperator[] = [
  { email: "taylor@example-csm.test", fullName: "Taylor Reeves" },
  { email: "morgan@example-csm.test", fullName: "Morgan Patel" },
];

async function ensureOperators(): Promise<Record<string, string>> {
  // Auth Admin list is paginated — for a dev seed two pages is plenty.
  const existing = new Map<string, string>();
  for (let page = 1; page <= 5; page++) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error(`auth.admin.listUsers failed: ${error.message}`);
    for (const u of data.users) if (u.email) existing.set(u.email, u.id);
    if (data.users.length < 200) break;
  }

  const out: Record<string, string> = {};
  for (const op of OPERATORS) {
    if (existing.has(op.email)) {
      out[op.email] = existing.get(op.email)!;
      continue;
    }
    const { data, error } = await sb.auth.admin.createUser({
      email: op.email,
      email_confirm: true,
      user_metadata: { full_name: op.fullName },
    });
    if (error) throw new Error(`createUser(${op.email}) failed: ${error.message}`);
    out[op.email] = data.user.id;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Wipe seeded data — order matters (children first)
// ---------------------------------------------------------------------------

async function clearAll() {
  // NOTE: leaves auth.users intact. delete() needs a filter — use a UUID
  // that no row will ever match.
  const NEVER = "00000000-0000-0000-0000-000000000000";
  const tables = [
    "approvals",
    "decisions",
    "briefs",
    "connections",
    "agent_runs",
    "agents",
  ] as const;

  for (const t of tables) {
    const { error } = await sb.from(t).delete().neq("id", NEVER);
    if (error) throw new Error(`clear ${t}: ${error.message}`);
  }
}

// ---------------------------------------------------------------------------
// Fixture accounts — realistic SMB SaaS portfolio
// ---------------------------------------------------------------------------

const ACCOUNTS = {
  acme:        { id: "0015A00000A1B2cZAA", name: "Cobblestone Realty", segment: "MM",  arr: 84_000 },
  riverside:   { id: "0015A00000A1B3dZAA", name: "Riverside Logistics", segment: "MM",  arr: 52_000 },
  brightline:  { id: "0015A00000A1B4eZAA", name: "Brightline Health",   segment: "Ent", arr: 180_000 },
  compass:     { id: "0015A00000A1B5fZAA", name: "Compass Foods",       segment: "MM",  arr: 68_000 },
  northstar:   { id: "0015A00000A1B6gZAA", name: "Northstar Print",     segment: "SMB", arr: 24_000 },
  lighthouse:  { id: "0015A00000A1B7hZAA", name: "Lighthouse Marketing", segment: "SMB", arr: 28_500 },
  cedar:       { id: "0015A00000A1B8iZAA", name: "Cedar & Co",          segment: "MM",  arr: 96_000 },
  avalon:      { id: "0015A00000A1B9jZAA", name: "Avalon Auto",          segment: "MM",  arr: 72_000 },
  polaris:     { id: "0015A00000A1B0kZAA", name: "Polaris Builders",    segment: "MM",  arr: 48_000 },
  spruce:      { id: "0015A00000A1B1lZAA", name: "Spruce Education",    segment: "Ent", arr: 142_000 },
} as const;

type AccountKey = keyof typeof ACCOUNTS;

// ---------------------------------------------------------------------------
// 1. Agents
// ---------------------------------------------------------------------------

interface SeededAgent {
  slug: string;
  name: string;
  description: string;
  status: "idle" | "running" | "errored";
  metadata: Record<string, unknown>;
}

const AGENTS: SeededAgent[] = [
  {
    slug: "galileo",
    name: "Galileo",
    status: "running",
    description:
      "Orchestrator. Routes work between specialist agents, gates approvals, and assembles the daily brief.",
    metadata: {
      version: "0.3.0",
      owner: "csm-platform",
      runtime: "node-20+claude-sonnet-4.5",
      schedule: "0 7 * * 1-5",
      tags: ["orchestrator", "brief"],
      capabilities: [
        "route_work",
        "aggregate_results",
        "assemble_brief",
        "gate_approvals",
      ],
      example_tasks: [
        "Generate the operator's 7am daily brief",
        "Route a new at-risk signal to hygiene-validator first",
        "Decide whether a draft email needs approval or can auto-send",
      ],
      model: {
        provider: "anthropic",
        name: "claude-sonnet-4.5",
        temperature: 0.2,
        max_tokens: 4000,
      },
    },
  },
  {
    slug: "sop-analyst",
    name: "SOP Analyst",
    status: "idle",
    description:
      "Builds audit checklists from the SOP library. No external system access — pure reasoning over policy docs.",
    metadata: {
      version: "0.2.1",
      owner: "csm-platform",
      runtime: "node-20+claude-sonnet-4.5",
      schedule: null,
      tags: ["sop", "audit", "no-external-access"],
      capabilities: [
        "parse_sop_documents",
        "generate_checklist",
        "compare_account_to_policy",
      ],
      example_tasks: [
        "Build the pre-QBoBR checklist for the SMB segment",
        "Compare an account against the data hygiene SOP section 5",
        "Flag SOP gaps detected during a triage run",
      ],
      model: {
        provider: "anthropic",
        name: "claude-sonnet-4.5",
        temperature: 0.0,
        max_tokens: 6000,
      },
    },
  },
  {
    slug: "sf-reader",
    name: "Salesforce Reader",
    status: "idle",
    description:
      "Read-only Salesforce. Pulls accounts, opportunities, cases, and activity history for other agents.",
    metadata: {
      version: "0.4.2",
      owner: "csm-platform",
      runtime: "node-20",
      schedule: "*/30 * * * *",
      tags: ["salesforce", "read-only", "data"],
      capabilities: [
        "read_account",
        "read_opportunity",
        "read_case",
        "read_activity_history",
      ],
      example_tasks: [
        "Pull last 30d activity for an at-risk account",
        "Fetch all open opportunities for a renewal window",
        "Get case volume for a specific contact over 90 days",
      ],
      model: null,
    },
  },
  {
    slug: "hygiene-validator",
    name: "Hygiene Validator",
    status: "idle",
    description:
      "Compares account data to the data hygiene SOP. Flags missing fields, stale records, and policy gaps. No write access.",
    metadata: {
      version: "0.3.0",
      owner: "csm-platform",
      runtime: "node-20+claude-sonnet-4.5",
      schedule: "0 6 * * *",
      tags: ["hygiene", "audit", "read-only"],
      capabilities: [
        "detect_missing_fields",
        "detect_stale_records",
        "flag_sop_gaps",
        "classify_at_risk",
      ],
      example_tasks: [
        "Audit all SMB accounts for empty save plans",
        "Flag accounts with no activity logged in 30 days",
        "Detect missing CSM ownership on new logos",
      ],
      model: {
        provider: "anthropic",
        name: "claude-sonnet-4.5",
        temperature: 0.1,
        max_tokens: 3000,
      },
    },
  },
  {
    slug: "controlled-executor",
    name: "Controlled Executor",
    status: "idle",
    description:
      "Gated write access to Salesforce, Slack, and Gmail. Every action goes through human approval before executing.",
    metadata: {
      version: "0.2.0",
      owner: "csm-platform",
      runtime: "node-20",
      schedule: null,
      tags: ["executor", "write", "approval-gated"],
      capabilities: [
        "execute_field_update",
        "execute_email_send",
        "execute_task_create",
        "execute_slack_message",
      ],
      example_tasks: [
        "Update a save plan field after operator approval",
        "Send a renewal outreach email after operator review",
        "Post a Slack DM to the AE after operator sign-off",
      ],
      model: null,
    },
  },
];

async function seedAgents(): Promise<Record<string, string>> {
  const rows = AGENTS.map((a) => ({
    slug: a.slug,
    name: a.name,
    description: a.description,
    status: a.status,
    enabled: true,
    metadata: a.metadata,
  }));
  const { data, error } = await sb
    .from("agents")
    // Cast: row payload is valid JSON but TS can't prove it from
    // Record<string, unknown>. Runtime is fine.
    .insert(rows as never)
    .select("id, slug");
  if (error) throw new Error(`insert agents: ${error.message}`);

  return Object.fromEntries(data.map((row) => [row.slug, row.id]));
}

// ---------------------------------------------------------------------------
// 2. agent_runs
// ---------------------------------------------------------------------------

interface RunSpec {
  key: string; // arbitrary handle for cross-reference in this script
  slug: keyof Awaited<ReturnType<typeof seedAgents>>;
  startedOffsetMs: number;
  durationMs: number | null; // null = still running
  status: "running" | "succeeded" | "failed" | "cancelled";
  triggered_by: string;
  items_processed: number;
  input_summary: string;
  output_summary: string | null;
  error?: string;
}

const RUN_SPECS: RunSpec[] = [
  // Today
  {
    key: "galileo-brief-today",
    slug: "galileo",
    startedOffsetMs: -2 * HOUR,
    durationMs: null,
    status: "running",
    triggered_by: "cron",
    items_processed: 0,
    input_summary: "Assemble 7am brief for taylor@",
    output_summary: null,
  },
  {
    key: "hygiene-nightly-today",
    slug: "hygiene-validator",
    startedOffsetMs: -8 * HOUR,
    durationMs: 47_320,
    status: "succeeded",
    triggered_by: "cron",
    items_processed: 42,
    input_summary: "Nightly audit across active book",
    output_summary: "Found 7 gaps: 3 missing save plans, 2 stale activity, 2 SOP gaps",
  },
  {
    key: "sf-reader-acme-today",
    slug: "sf-reader",
    startedOffsetMs: -3 * HOUR,
    durationMs: 1_180,
    status: "succeeded",
    triggered_by: "webhook",
    items_processed: 18,
    input_summary: "Activity pull for Cobblestone Realty (last 60d)",
    output_summary: "18 activity records: 6 emails, 9 calls, 3 meetings",
  },
  {
    key: "executor-batch-today",
    slug: "controlled-executor",
    startedOffsetMs: -90 * MIN,
    durationMs: 4_200,
    status: "succeeded",
    triggered_by: "api",
    items_processed: 3,
    input_summary: "Apply 3 operator-approved field updates",
    output_summary: "3/3 succeeded: Riverside, Polaris, Northstar",
  },
  {
    key: "sf-reader-fail-today",
    slug: "sf-reader",
    startedOffsetMs: -4 * HOUR,
    durationMs: 31_800,
    status: "failed",
    triggered_by: "cron",
    items_processed: 0,
    input_summary: "Scheduled 30-min activity sync across all accounts",
    output_summary: null,
    error: "Salesforce API rate limit hit (REQUEST_LIMIT_EXCEEDED). Retry scheduled.",
  },

  // Yesterday
  {
    key: "galileo-brief-y1",
    slug: "galileo",
    startedOffsetMs: -1 * DAY - 17 * HOUR,
    durationMs: 14_220,
    status: "succeeded",
    triggered_by: "cron",
    items_processed: 1,
    input_summary: "Assemble 7am brief for taylor@",
    output_summary: "Brief 2026-05-27 generated. 5 priorities, 3 pending approvals.",
  },
  {
    key: "sop-analyst-y1",
    slug: "sop-analyst",
    startedOffsetMs: -1 * DAY - 14 * HOUR,
    durationMs: 8_640,
    status: "succeeded",
    triggered_by: "manual",
    items_processed: 1,
    input_summary: "Generate pre-QBoBR checklist for SMB segment",
    output_summary: "Checklist v3 produced: 14 items across hygiene + relationship pillars",
  },
  {
    key: "hygiene-smb-y1",
    slug: "hygiene-validator",
    startedOffsetMs: -1 * DAY - 11 * HOUR,
    durationMs: 22_140,
    status: "succeeded",
    triggered_by: "manual",
    items_processed: 23,
    input_summary: "Audit SMB segment for save plan presence",
    output_summary: "Found 8/23 missing save plans",
  },
  {
    key: "executor-emails-y1",
    slug: "controlled-executor",
    startedOffsetMs: -1 * DAY - 6 * HOUR,
    durationMs: 6_840,
    status: "succeeded",
    triggered_by: "api",
    items_processed: 2,
    input_summary: "Send 2 operator-approved renewal outreach emails",
    output_summary: "2/2 sent: Brightline Health, Avalon Auto",
  },

  // Day before
  {
    key: "galileo-brief-y2",
    slug: "galileo",
    startedOffsetMs: -2 * DAY - 17 * HOUR,
    durationMs: 13_980,
    status: "succeeded",
    triggered_by: "cron",
    items_processed: 1,
    input_summary: "Assemble 7am brief for taylor@",
    output_summary: "Brief 2026-05-26 generated. 4 priorities, 2 pending approvals.",
  },
  {
    key: "galileo-brief-morgan-y1",
    slug: "galileo",
    startedOffsetMs: -1 * DAY - 17 * HOUR + 90_000,
    durationMs: 12_440,
    status: "succeeded",
    triggered_by: "cron",
    items_processed: 1,
    input_summary: "Assemble 7am brief for morgan@",
    output_summary: "Brief 2026-05-27 generated. 3 priorities, 1 pending approval.",
  },
  {
    key: "hygiene-ad-hoc-y2",
    slug: "hygiene-validator",
    startedOffsetMs: -2 * DAY - 9 * HOUR,
    durationMs: 19_220,
    status: "succeeded",
    triggered_by: "manual",
    items_processed: 14,
    input_summary: "Ad-hoc: check Cobblestone territory for stale activity",
    output_summary: "5/14 stale (>30d since last logged activity)",
  },
  {
    key: "sf-reader-bulk-y2",
    slug: "sf-reader",
    startedOffsetMs: -2 * DAY - 22 * HOUR,
    durationMs: 4_620,
    status: "succeeded",
    triggered_by: "cron",
    items_processed: 96,
    input_summary: "Scheduled 30-min activity sync across all accounts",
    output_summary: "96 records ingested from 28 accounts",
  },
];

interface SeededRun {
  spec: RunSpec;
  id: string;
}

async function seedRuns(agentIds: Record<string, string>): Promise<Record<string, SeededRun>> {
  const rows = RUN_SPECS.map((r) => {
    const agent_id = agentIds[r.slug as string];
    if (!agent_id) throw new Error(`unknown agent slug: ${r.slug}`);
    const started_at = iso(r.startedOffsetMs);
    const finished_at = r.durationMs == null ? null : iso(r.startedOffsetMs + r.durationMs);
    return {
      agent_id,
      started_at,
      finished_at,
      status: r.status,
      triggered_by: r.triggered_by,
      items_processed: r.items_processed,
      input_summary: r.input_summary,
      output_summary: r.output_summary,
      error: r.error ?? null,
      metadata: {
        seeded: true,
      },
    };
  });

  const { data, error } = await sb
    .from("agent_runs")
    .insert(rows as never)
    .select("id");
  if (error) throw new Error(`insert agent_runs: ${error.message}`);
  if (!data || data.length !== RUN_SPECS.length) {
    throw new Error(
      `expected ${RUN_SPECS.length} agent_runs back, got ${data?.length ?? 0}`,
    );
  }

  // Match by index — Supabase preserves insert order in the returned
  // array. String-matching on `started_at` is unreliable because
  // Postgres timestamptz round-trips with microsecond precision
  // (`.000000+00:00`) while JS toISOString gives millisecond (`.000Z`).
  const out: Record<string, SeededRun> = {};
  for (let i = 0; i < RUN_SPECS.length; i++) {
    out[RUN_SPECS[i].key] = { spec: RUN_SPECS[i], id: data[i].id };
  }
  return out;
}

// ---------------------------------------------------------------------------
// 3. Decisions
// ---------------------------------------------------------------------------

interface DecisionSpec {
  runKey: string;
  agentSlug: string;
  decision_type: string;
  account: AccountKey;
  source_record_type: string;
  label: string;
  confidence: number | null;
  reasoning: string;
  signals: Array<{ name: string; value: unknown; weight: number; note?: string; source?: string }>;
  offsetMs: number;
}

const DECISIONS: DecisionSpec[] = [
  {
    runKey: "hygiene-nightly-today",
    agentSlug: "hygiene-validator",
    decision_type: "classify_at_risk",
    account: "acme",
    source_record_type: "account",
    label: "at_risk",
    confidence: 0.82,
    reasoning:
      "Cobblestone has slipped on three of our standard signals — usage is down, support volume is up, and there is no active save plan on file. The combination matches the 'silent decline' pattern we usually only catch at QBoBR. Recommend operator outreach this week.",
    signals: [
      { name: "days_since_last_login", value: 38, weight: 0.30, source: "salesforce.account.Last_Login__c" },
      { name: "support_tickets_30d", value: 5, weight: 0.25, source: "salesforce.case" },
      { name: "save_plan_present", value: false, weight: 0.25, source: "salesforce.account.CSM_Save_Plan__c" },
      { name: "exec_sponsor_change_60d", value: true, weight: 0.20, note: "VP Ops left in April" },
    ],
    offsetMs: -8 * HOUR + 3_000,
  },
  {
    runKey: "hygiene-nightly-today",
    agentSlug: "hygiene-validator",
    decision_type: "flag_data_gap",
    account: "riverside",
    source_record_type: "account",
    label: "missing_save_plan",
    confidence: null,
    reasoning:
      "Yellow-band account with no save plan entry in the last 60 days. SOP section 5 requires a monthly note for any yellow account.",
    signals: [
      { name: "health_band", value: "yellow", weight: 0.5, source: "computed" },
      { name: "save_plan_last_updated", value: null, weight: 0.5, source: "salesforce.account.CSM_Save_Plan__c" },
    ],
    offsetMs: -8 * HOUR + 6_000,
  },
  {
    runKey: "hygiene-nightly-today",
    agentSlug: "hygiene-validator",
    decision_type: "flag_data_gap",
    account: "brightline",
    source_record_type: "account",
    label: "stale_activity",
    confidence: null,
    reasoning:
      "Enterprise account with no logged activity in 41 days. Renewal is in 73 days. SOP requires monthly engagement minimum.",
    signals: [
      { name: "days_since_last_activity", value: 41, weight: 0.5, source: "salesforce.task" },
      { name: "renewal_in_days", value: 73, weight: 0.3, source: "salesforce.opportunity.CloseDate" },
      { name: "segment", value: "Enterprise", weight: 0.2 },
    ],
    offsetMs: -8 * HOUR + 9_000,
  },
  {
    runKey: "hygiene-nightly-today",
    agentSlug: "hygiene-validator",
    decision_type: "flag_data_gap",
    account: "compass",
    source_record_type: "account",
    label: "missing_csm_owner",
    confidence: null,
    reasoning:
      "Account flipped from new-logo to active 14 days ago and still has no CSM assigned. SOP requires assignment within 5 business days.",
    signals: [
      { name: "csm_owner_id", value: null, weight: 0.7, source: "salesforce.account.OwnerId" },
      { name: "days_since_activation", value: 14, weight: 0.3 },
    ],
    offsetMs: -8 * HOUR + 12_000,
  },
  {
    runKey: "galileo-brief-y1",
    agentSlug: "galileo",
    decision_type: "prioritize",
    account: "acme",
    source_record_type: "account",
    label: "priority_high",
    confidence: 0.91,
    reasoning:
      "Combining hygiene-validator's at-risk flag with the renewal date (94 days) and the $84k ARR puts Cobblestone at the top of today's queue. Touchpoint recommended before EOD.",
    signals: [
      { name: "at_risk_flag", value: true, weight: 0.4, source: "decisions.hygiene-validator" },
      { name: "renewal_in_days", value: 94, weight: 0.3, source: "salesforce.opportunity" },
      { name: "arr_usd", value: 84_000, weight: 0.3, source: "salesforce.account.AnnualRevenue__c" },
    ],
    offsetMs: -1 * DAY - 17 * HOUR + 2_000,
  },
  {
    runKey: "hygiene-nightly-today",
    agentSlug: "hygiene-validator",
    decision_type: "classify_at_risk",
    account: "cedar",
    source_record_type: "account",
    label: "at_risk",
    confidence: 0.74,
    reasoning:
      "Cedar has missed two scheduled QBR meetings and the primary admin contact deactivated their account last week. Engagement signal is dropping — not yet critical, but worth a check-in this week.",
    signals: [
      { name: "missed_qbr_count", value: 2, weight: 0.4, note: "Last two consecutive quarters" },
      { name: "primary_contact_active", value: false, weight: 0.3, source: "salesforce.contact.IsActive" },
      { name: "days_since_last_login", value: 26, weight: 0.3 },
    ],
    offsetMs: -8 * HOUR + 15_000,
  },
  {
    runKey: "hygiene-nightly-today",
    agentSlug: "hygiene-validator",
    decision_type: "classify_at_risk",
    account: "lighthouse",
    source_record_type: "account",
    label: "at_risk",
    confidence: 0.91,
    reasoning:
      "Lighthouse has stopped logging into the product entirely (62 days). Support cases dropped to zero. Combined with their original 12-month commit ending in 38 days, this is the clearest churn-risk signal in the book today.",
    signals: [
      { name: "days_since_last_login", value: 62, weight: 0.5, source: "salesforce.account.Last_Login__c" },
      { name: "renewal_in_days", value: 38, weight: 0.3 },
      { name: "support_tickets_30d", value: 0, weight: 0.2, note: "Silence often precedes churn for SMB" },
    ],
    offsetMs: -8 * HOUR + 18_000,
  },
  {
    runKey: "sop-analyst-y1",
    agentSlug: "sop-analyst",
    decision_type: "flag_sop_gap",
    account: "polaris",
    source_record_type: "account",
    label: "sop_section_5_gap",
    confidence: null,
    reasoning:
      "Polaris hits two of the section 5 hygiene criteria but has no documented save plan, recent QBoBR notes, or scheduled next touchpoint. SOP requires at least one of those for any account 60d into a yellow band.",
    signals: [
      { name: "days_in_yellow_band", value: 71, weight: 0.4 },
      { name: "save_plan_present", value: false, weight: 0.3 },
      { name: "next_touchpoint_scheduled", value: null, weight: 0.3 },
    ],
    offsetMs: -1 * DAY - 14 * HOUR + 4_000,
  },
  {
    runKey: "hygiene-ad-hoc-y2",
    agentSlug: "hygiene-validator",
    decision_type: "flag_data_gap",
    account: "avalon",
    source_record_type: "account",
    label: "stale_activity",
    confidence: null,
    reasoning:
      "Avalon's last logged touchpoint was a single email 47 days ago. AE has been forwarding pricing questions directly — they may not realize there's no CSM follow-up on file.",
    signals: [
      { name: "days_since_last_activity", value: 47, weight: 0.6 },
      { name: "ae_handoffs_30d", value: 3, weight: 0.4, note: "AE asked CSM to follow up 3 times" },
    ],
    offsetMs: -2 * DAY - 9 * HOUR + 5_000,
  },
  {
    runKey: "galileo-brief-y1",
    agentSlug: "galileo",
    decision_type: "classify_renewal_risk",
    account: "brightline",
    source_record_type: "opportunity",
    label: "at_risk",
    confidence: 0.68,
    reasoning:
      "Brightline's renewal forecast is positive but the supporting data is thin — no save plan, no exec sponsor mapped, no scheduled QBR before close. Probability is still above 50% but the operator should pressure-test the forecast.",
    signals: [
      { name: "csm_forecast", value: "Positive Outlook", weight: 0.3, source: "salesforce.opportunity.CSM_Forecast__c" },
      { name: "save_plan_present", value: false, weight: 0.25 },
      { name: "exec_sponsor_mapped", value: false, weight: 0.25 },
      { name: "qbr_before_close", value: false, weight: 0.20 },
    ],
    offsetMs: -1 * DAY - 17 * HOUR + 5_000,
  },
  {
    runKey: "galileo-brief-y2",
    agentSlug: "galileo",
    decision_type: "classify_upsell_opportunity",
    account: "northstar",
    source_record_type: "account",
    label: "upsell_qualified",
    confidence: 0.79,
    reasoning:
      "Northstar's usage has tripled over the past 60 days and they're hitting their seat cap on most weekdays. They've already asked the AE about pricing for 'team' tier twice. Soft check-in from the CSM (not a hard pitch) should land well.",
    signals: [
      { name: "seat_cap_hit_days_30d", value: 19, weight: 0.4, source: "product.usage" },
      { name: "usage_growth_60d_pct", value: 218, weight: 0.3 },
      { name: "ae_pricing_inquiries", value: 2, weight: 0.3 },
    ],
    offsetMs: -2 * DAY - 17 * HOUR + 2_000,
  },
  {
    runKey: "hygiene-smb-y1",
    agentSlug: "hygiene-validator",
    decision_type: "recompute_health_band",
    account: "spruce",
    source_record_type: "account",
    label: "yellow",
    confidence: 0.88,
    reasoning:
      "Spruce dropped 11 points this week (78→67). The biggest mover was engagement: their primary user took parental leave and the secondary contact hasn't logged in. Recommend a check-in to identify the new daily driver.",
    signals: [
      { name: "previous_score", value: 78, weight: 0.2 },
      { name: "current_score", value: 67, weight: 0.4 },
      { name: "engagement_delta", value: -14, weight: 0.4, note: "5-pillar engagement subscore" },
    ],
    offsetMs: -1 * DAY - 11 * HOUR + 3_000,
  },
  {
    runKey: "sop-analyst-y1",
    agentSlug: "sop-analyst",
    decision_type: "generate_checklist",
    account: "cedar",
    source_record_type: "account",
    label: "qbobr_checklist_ready",
    confidence: null,
    reasoning:
      "Pre-QBoBR checklist generated for Cedar & Co. 14 items: 6 must-haves (renewal date, ARR, save plan, etc.), 8 nice-to-haves. Currently 4/6 must-haves complete.",
    signals: [
      { name: "must_haves_total", value: 6, weight: 0.4 },
      { name: "must_haves_complete", value: 4, weight: 0.4 },
      { name: "nice_to_haves_total", value: 8, weight: 0.2 },
    ],
    offsetMs: -1 * DAY - 14 * HOUR + 7_000,
  },
  {
    runKey: "hygiene-nightly-today",
    agentSlug: "hygiene-validator",
    decision_type: "classify_at_risk",
    account: "polaris",
    source_record_type: "account",
    label: "watch",
    confidence: 0.55,
    reasoning:
      "Polaris is borderline. Usage is steady but on the low end of their segment, and they've been quiet on email for three weeks. Not at-risk today, but worth a courtesy check-in.",
    signals: [
      { name: "usage_pct_of_segment_median", value: 38, weight: 0.4 },
      { name: "days_since_last_outbound_email", value: 22, weight: 0.3 },
      { name: "support_tickets_30d", value: 1, weight: 0.3 },
    ],
    offsetMs: -8 * HOUR + 21_000,
  },
  {
    runKey: "galileo-brief-morgan-y1",
    agentSlug: "galileo",
    decision_type: "prioritize",
    account: "riverside",
    source_record_type: "account",
    label: "priority_high",
    confidence: 0.84,
    reasoning:
      "Riverside is morgan@'s top priority today. Yellow band + missing save plan + renewal in 110 days. Worth 15 minutes to log a current-state note.",
    signals: [
      { name: "health_band", value: "yellow", weight: 0.4 },
      { name: "save_plan_present", value: false, weight: 0.3 },
      { name: "renewal_in_days", value: 110, weight: 0.3 },
    ],
    offsetMs: -1 * DAY - 17 * HOUR + 92_000,
  },
  {
    runKey: "hygiene-nightly-today",
    agentSlug: "hygiene-validator",
    decision_type: "flag_data_gap",
    account: "northstar",
    source_record_type: "account",
    label: "missing_save_plan",
    confidence: null,
    reasoning:
      "Green-band account but renewal is 51 days out and there's no save plan or renewal-readiness note. SOP requires both for any renewal inside 60 days.",
    signals: [
      { name: "renewal_in_days", value: 51, weight: 0.5, source: "salesforce.opportunity.CloseDate" },
      { name: "save_plan_present", value: false, weight: 0.3 },
      { name: "renewal_readiness_note_present", value: false, weight: 0.2 },
    ],
    offsetMs: -8 * HOUR + 24_000,
  },
  {
    runKey: "galileo-brief-today",
    agentSlug: "galileo",
    decision_type: "route_work",
    account: "lighthouse",
    source_record_type: "account",
    label: "route_to_executor",
    confidence: 0.92,
    reasoning:
      "Lighthouse is the clearest at-risk signal today (0.91 confidence). Auto-routing the proposed save-plan draft to controlled-executor for operator review.",
    signals: [
      { name: "upstream_confidence", value: 0.91, weight: 0.6 },
      { name: "renewal_in_days", value: 38, weight: 0.4 },
    ],
    offsetMs: -2 * HOUR + 1_000,
  },
];

async function seedDecisions(
  agentIds: Record<string, string>,
  runs: Record<string, SeededRun>,
): Promise<Record<string, string>> {
  const rows = DECISIONS.map((d, i) => {
    const run = runs[d.runKey];
    if (!run) throw new Error(`unknown runKey for decision ${i}: ${d.runKey}`);
    const agent_id = agentIds[d.agentSlug];
    if (!agent_id) throw new Error(`unknown agent slug: ${d.agentSlug}`);
    const account = ACCOUNTS[d.account];
    return {
      agent_run_id: run.id,
      agent_id,
      decision_type: d.decision_type,
      source_record_type: d.source_record_type,
      source_record_id: account.id,
      label: d.label,
      confidence: d.confidence,
      reasoning: d.reasoning,
      signals: d.signals,
      metadata: {
        seeded: true,
        account_name: account.name,
        account_segment: account.segment,
        account_arr_usd: account.arr,
      },
      created_at: iso(d.offsetMs),
    };
  });

  const { data, error } = await sb
    .from("decisions")
    .insert(rows as never)
    .select("id");
  if (error) throw new Error(`insert decisions: ${error.message}`);
  if (!data || data.length !== DECISIONS.length) {
    throw new Error(
      `expected ${DECISIONS.length} decisions back, got ${data?.length ?? 0}`,
    );
  }

  // Match by index — same rationale as seedRuns. Approvals reference
  // decisions by a composite logical key.
  const out: Record<string, string> = {};
  for (let i = 0; i < DECISIONS.length; i++) {
    const d = DECISIONS[i];
    out[`${d.runKey}::${d.account}::${d.decision_type}`] = data[i].id;
  }
  return out;
}

// ---------------------------------------------------------------------------
// 4. Approvals
// ---------------------------------------------------------------------------

interface ApprovalSpec {
  runKey: string;
  agentSlug: string;
  decisionKey?: string;
  action_type: string;
  account: AccountKey;
  target_record_type: string;
  current_value: unknown;
  proposed_value: unknown;
  rationale: string;
  status: "pending" | "approved" | "rejected" | "expired";
  decided_by_email?: string;
  decision_note?: string;
  offsetMsCreated: number;
  offsetMsDecided?: number;
  risk_level?: "low" | "med" | "high";
}

const APPROVALS: ApprovalSpec[] = [
  // Pending — needs attention today
  {
    runKey: "galileo-brief-today",
    agentSlug: "controlled-executor",
    decisionKey: "hygiene-nightly-today::acme::classify_at_risk",
    action_type: "update_field",
    account: "acme",
    target_record_type: "salesforce.account",
    current_value: { field: "CSM_Save_Plan__c", value: null },
    proposed_value: {
      field: "CSM_Save_Plan__c",
      value:
        "5/28/26: At-risk flag (0.82). Engagement down (38d since login), 5 support tickets in 30d, VP Ops left in April. Plan to schedule a recovery call with new champion this week.",
    },
    rationale:
      "Hygiene-validator flagged at-risk with 0.82 confidence. Cobblestone is a $84k MM account with renewal in 94 days. A current-state save plan note is required before any further automated action.",
    status: "pending",
    offsetMsCreated: -90 * MIN,
    risk_level: "med",
  },
  {
    runKey: "galileo-brief-today",
    agentSlug: "controlled-executor",
    decisionKey: "hygiene-nightly-today::lighthouse::classify_at_risk",
    action_type: "send_email",
    account: "lighthouse",
    target_record_type: "contact",
    current_value: null,
    proposed_value: {
      channel: "email",
      to: ["chris@lighthouse-marketing.example"],
      cc: [],
      subject: "Checking in — last month before renewal",
      body_md:
        "Hi Chris,\n\nNoticing your team hasn't logged in for a few weeks and we're 38 days out from your renewal. Want to set up a quick 15-minute call this week to walk through where you are and what would make the next year easier?\n\nI also have a few ideas based on what teams at your size have been doing successfully — happy to share them whenever works best.\n\nThanks,\nTaylor",
    },
    rationale:
      "Strongest at-risk signal today (0.91). 62 days no login, 38d to renewal, zero recent support cases. Standard SMB renewal-recovery outreach template, personalized.",
    status: "pending",
    offsetMsCreated: -75 * MIN,
    risk_level: "high",
  },
  {
    runKey: "galileo-brief-today",
    agentSlug: "controlled-executor",
    decisionKey: "hygiene-nightly-today::compass::flag_data_gap",
    action_type: "create_task",
    account: "compass",
    target_record_type: "salesforce.account",
    current_value: null,
    proposed_value: {
      subject: "Assign CSM owner to Compass Foods (new-logo, 14d unassigned)",
      due_date: isoDate(1),
      assigned_to: "ops-manager@example-csm.test",
      related_record: ACCOUNTS.compass.id,
      priority: "High",
    },
    rationale:
      "SOP requires CSM assignment within 5 business days of new-logo activation. Compass is at day 14 — overdue.",
    status: "pending",
    offsetMsCreated: -8 * HOUR + 15_000,
    risk_level: "med",
  },

  // Recently approved — for the timeline
  {
    runKey: "hygiene-smb-y1",
    agentSlug: "controlled-executor",
    decisionKey: "hygiene-smb-y1::spruce::recompute_health_band",
    action_type: "update_field",
    account: "spruce",
    target_record_type: "salesforce.account",
    current_value: { field: "Health_Band__c", value: "green" },
    proposed_value: { field: "Health_Band__c", value: "yellow" },
    rationale:
      "Health score dropped 78→67. Engagement subscore -14 points after primary user went on leave. Recompute confidence 0.88.",
    status: "approved",
    decided_by_email: "taylor@example-csm.test",
    decision_note: "Confirmed — flagged for outreach this Friday.",
    offsetMsCreated: -1 * DAY - 11 * HOUR + 20_000,
    offsetMsDecided: -1 * DAY - 9 * HOUR,
    risk_level: "low",
  },
  {
    runKey: "executor-emails-y1",
    agentSlug: "controlled-executor",
    decisionKey: "galileo-brief-y1::brightline::classify_renewal_risk",
    action_type: "send_email",
    account: "brightline",
    target_record_type: "contact",
    current_value: null,
    proposed_value: {
      channel: "email",
      to: ["meera@brightline-health.example"],
      cc: ["ae@example-csm.test"],
      subject: "Re: prepping for our August check-in",
      body_md:
        "Hi Meera,\n\nWanted to get on your calendar before we wrap Q2. We don't have a save plan or exec-sponsor map on file for the August renewal and I'd rather build that with you than assume.\n\nAre you open to 30 minutes next week? I can come prepared with a draft.\n\nThanks,\nTaylor",
    },
    rationale:
      "Renewal risk classified at 0.68. Save plan + exec sponsor missing. Standard pre-QBoBR readiness outreach.",
    status: "approved",
    decided_by_email: "taylor@example-csm.test",
    decision_note: "Looks right — sending.",
    offsetMsCreated: -1 * DAY - 7 * HOUR,
    offsetMsDecided: -1 * DAY - 6 * HOUR - 30 * MIN,
    risk_level: "med",
  },
  {
    runKey: "executor-batch-today",
    agentSlug: "controlled-executor",
    decisionKey: "hygiene-nightly-today::riverside::flag_data_gap",
    action_type: "update_field",
    account: "riverside",
    target_record_type: "salesforce.account",
    current_value: { field: "CSM_Save_Plan__c", value: null },
    proposed_value: {
      field: "CSM_Save_Plan__c",
      value:
        "5/28/26: Yellow band, no recent save plan. Riverside has been stable but quiet. Plan to log a relationship-state note after our Thursday call.",
    },
    rationale:
      "Yellow account missing save plan per SOP section 5.",
    status: "approved",
    decided_by_email: "taylor@example-csm.test",
    decision_note: "Approved.",
    offsetMsCreated: -3 * HOUR,
    offsetMsDecided: -2 * HOUR - 10 * MIN,
    risk_level: "low",
  },

  // Rejected — operator overrode
  {
    runKey: "hygiene-ad-hoc-y2",
    agentSlug: "controlled-executor",
    decisionKey: "hygiene-ad-hoc-y2::avalon::flag_data_gap",
    action_type: "create_task",
    account: "avalon",
    target_record_type: "salesforce.account",
    current_value: null,
    proposed_value: {
      subject: "Outreach: log a save plan for Avalon (47d silence)",
      due_date: isoDate(2),
      assigned_to: "taylor@example-csm.test",
      related_record: ACCOUNTS.avalon.id,
      priority: "Normal",
    },
    rationale:
      "Avalon last activity 47 days ago. AE has been forwarding pricing — they may not know there's no CSM follow-up.",
    status: "rejected",
    decided_by_email: "taylor@example-csm.test",
    decision_note:
      "Already on it — spoke with AE on Friday. No task needed, will log save plan after Wed call.",
    offsetMsCreated: -2 * DAY - 8 * HOUR,
    offsetMsDecided: -2 * DAY - 7 * HOUR - 20 * MIN,
    risk_level: "low",
  },

  // More pending
  {
    runKey: "galileo-brief-y2",
    agentSlug: "controlled-executor",
    decisionKey: "galileo-brief-y2::northstar::classify_upsell_opportunity",
    action_type: "send_slack",
    account: "northstar",
    target_record_type: "slack.user",
    current_value: null,
    proposed_value: {
      channel: "slack",
      to: ["@kim-ae"],
      body_md:
        ":wave: Northstar (Print) hit their seat cap 19 of the last 30 days and asked you about Team-tier pricing twice. Want me to set up a no-pressure check-in for next week?",
    },
    rationale:
      "Qualified upsell signal (0.79 confidence). Soft touch to the AE first per the Product B 'qualify carefully' SOP — never pitch directly.",
    status: "pending",
    offsetMsCreated: -2 * DAY - 16 * HOUR,
    risk_level: "low",
  },
  {
    runKey: "galileo-brief-today",
    agentSlug: "controlled-executor",
    decisionKey: "hygiene-nightly-today::brightline::flag_data_gap",
    action_type: "update_field",
    account: "brightline",
    target_record_type: "salesforce.account",
    current_value: { field: "CSM_Save_Plan__c", value: "3/12/26: Met with Meera. Renewal looks solid. Will follow up in July." },
    proposed_value: {
      field: "CSM_Save_Plan__c",
      value:
        "3/12/26: Met with Meera. Renewal looks solid. Will follow up in July.\n5/28/26: Renewal now 73d out. No activity in 41d. Forecast still 'Positive Outlook' but signal is thin — need a pressure-test conversation before relying on it.",
    },
    rationale:
      "Renewal inside 90 days and no logged activity in over a month. Existing save plan note is stale; appending current-state, not overwriting.",
    status: "pending",
    offsetMsCreated: -80 * MIN,
    risk_level: "med",
  },
  {
    runKey: "galileo-brief-y1",
    agentSlug: "controlled-executor",
    decisionKey: "galileo-brief-y1::acme::prioritize",
    action_type: "create_task",
    account: "acme",
    target_record_type: "salesforce.account",
    current_value: null,
    proposed_value: {
      subject: "Recovery call: Cobblestone Realty (at-risk 0.82)",
      due_date: isoDate(2),
      assigned_to: "taylor@example-csm.test",
      related_record: ACCOUNTS.acme.id,
      priority: "High",
    },
    rationale:
      "Highest-priority account today. Scheduling a follow-up task so the recovery conversation has a clear home.",
    status: "pending",
    offsetMsCreated: -1 * DAY - 16 * HOUR,
    risk_level: "med",
  },
];

async function seedApprovals(
  agentIds: Record<string, string>,
  runs: Record<string, SeededRun>,
  decisionIds: Record<string, string>,
  operators: Record<string, string>,
) {
  const rows = APPROVALS.map((a, i) => {
    const run = runs[a.runKey];
    if (!run) throw new Error(`unknown runKey for approval ${i}: ${a.runKey}`);
    const agent_id = agentIds[a.agentSlug];
    if (!agent_id) throw new Error(`unknown agent slug for approval ${i}: ${a.agentSlug}`);
    const decision_id = a.decisionKey ? decisionIds[a.decisionKey] ?? null : null;
    if (a.decisionKey && !decision_id) {
      throw new Error(`unknown decisionKey for approval ${i}: ${a.decisionKey}`);
    }
    const account = ACCOUNTS[a.account];
    const decided_by =
      a.decided_by_email ? operators[a.decided_by_email] ?? null : null;
    if (a.decided_by_email && !decided_by) {
      throw new Error(`unknown decided_by_email for approval ${i}: ${a.decided_by_email}`);
    }
    return {
      agent_run_id: run.id,
      agent_id,
      decision_id,
      action_type: a.action_type,
      target_record_type: a.target_record_type,
      target_record_id: account.id,
      current_value: a.current_value,
      proposed_value: a.proposed_value,
      rationale: a.rationale,
      status: a.status,
      decided_by,
      decided_at: a.offsetMsDecided != null ? iso(a.offsetMsDecided) : null,
      decision_note: a.decision_note ?? null,
      metadata: {
        seeded: true,
        account_name: account.name,
        risk_level: a.risk_level ?? "low",
      },
      created_at: iso(a.offsetMsCreated),
    };
  });

  const { error } = await sb.from("approvals").insert(rows as never);
  if (error) throw new Error(`insert approvals: ${error.message}`);
}

// ---------------------------------------------------------------------------
// 5. Briefs
// ---------------------------------------------------------------------------

async function seedBriefs(
  runs: Record<string, SeededRun>,
  operators: Record<string, string>,
) {
  const taylor = operators["taylor@example-csm.test"];
  const morgan = operators["morgan@example-csm.test"];

  const rows = [
    {
      operator_id: taylor,
      brief_date: isoDate(0),
      headline: "5 priorities today. Lighthouse is the clearest churn risk — start there.",
      body_md:
        "## Today's call\n\nLighthouse Marketing is the strongest at-risk signal in the book (0.91). 62 days no login, renewal in 38. A recovery email is drafted and waiting for your review — soft, no pressure.\n\nCobblestone Realty is your second-biggest mover. The at-risk flag (0.82) lines up with the missing save plan and the exec sponsor change in April. A save plan note is drafted; review and send.\n\n## Standing items\n\n- 3 hygiene gaps from last night's audit (Riverside, Brightline, Compass) — all in the queue.\n- Northstar upsell signal is still warm. Slack draft to Kim (AE) is waiting.\n- Compass Foods has been a new logo for 14 days with no CSM owner — task is drafted.\n\n## What I didn't do\n\nSF Reader hit a rate limit on the 3am sync. I scheduled a retry for 9am; if you need anything pulled urgently, let me know.",
      structured_data: {
        kpis: [
          { label: "At-risk accounts", value: 4, delta: +1, trend: "up" },
          { label: "Pending approvals", value: 6, delta: +2, trend: "up" },
          { label: "Renewals < 90d", value: 3, delta: 0, trend: "flat" },
          { label: "Book ARR", value: "$794k", delta: 0, trend: "flat" },
        ],
        chips: [
          { label: "Lighthouse — 38d to renewal", kind: "danger" },
          { label: "Cobblestone — at-risk 0.82", kind: "warning" },
          { label: "Northstar — upsell", kind: "success" },
        ],
        priorities: [
          { rank: 1, summary: "Review Lighthouse renewal email", account_id: ACCOUNTS.lighthouse.id, action: "approve_email" },
          { rank: 2, summary: "Approve Cobblestone save plan update", account_id: ACCOUNTS.acme.id, action: "approve_update" },
          { rank: 3, summary: "Sign off Compass CSM-owner task", account_id: ACCOUNTS.compass.id, action: "approve_task" },
          { rank: 4, summary: "Brightline save plan refresh", account_id: ACCOUNTS.brightline.id, action: "approve_update" },
          { rank: 5, summary: "Slack Kim about Northstar", account_id: ACCOUNTS.northstar.id, action: "approve_slack" },
        ],
        refs: [
          { type: "salesforce.account", id: ACCOUNTS.lighthouse.id, label: "Lighthouse Marketing" },
          { type: "salesforce.account", id: ACCOUNTS.acme.id, label: "Cobblestone Realty" },
        ],
      },
      generated_by: runs["galileo-brief-today"].id,
      generated_at: iso(-2 * HOUR + 14_000),
    },
    {
      operator_id: taylor,
      brief_date: isoDate(-1),
      headline: "Quieter day. Brightline forecast pressure-test is the call.",
      body_md:
        "## Today's call\n\nBrightline Health's renewal looks positive on paper but the supporting data is thin (no save plan, no exec sponsor map). I drafted a check-in to Meera — it's waiting on you.\n\nSpruce Education dropped 11 health points after their primary user went on leave. Health-band update is drafted (green → yellow).\n\n## Standing items\n\n- 2 pending approvals from yesterday cleared overnight (Riverside save plan, Spruce health band).\n- SOP Analyst produced a fresh pre-QBoBR checklist for Cedar & Co — 4/6 must-haves complete.\n\n## What I didn't do\n\nNothing of note.",
      structured_data: {
        kpis: [
          { label: "At-risk accounts", value: 3, delta: 0, trend: "flat" },
          { label: "Pending approvals", value: 4, delta: -1, trend: "down" },
          { label: "Renewals < 90d", value: 3, delta: 0, trend: "flat" },
          { label: "Book ARR", value: "$794k", delta: 0, trend: "flat" },
        ],
        chips: [
          { label: "Brightline — forecast thin", kind: "warning" },
          { label: "Spruce — yellow band", kind: "warning" },
        ],
        priorities: [
          { rank: 1, summary: "Send Brightline check-in", account_id: ACCOUNTS.brightline.id, action: "approve_email" },
          { rank: 2, summary: "Confirm Spruce health-band update", account_id: ACCOUNTS.spruce.id, action: "approve_update" },
          { rank: 3, summary: "Cedar QBoBR checklist review", account_id: ACCOUNTS.cedar.id, action: "review_checklist" },
        ],
        refs: [
          { type: "salesforce.account", id: ACCOUNTS.brightline.id, label: "Brightline Health" },
          { type: "salesforce.account", id: ACCOUNTS.spruce.id, label: "Spruce Education" },
        ],
      },
      generated_by: runs["galileo-brief-y1"].id,
      generated_at: iso(-1 * DAY - 17 * HOUR + 14_000),
      viewed_at: iso(-1 * DAY - 16 * HOUR),
    },
    {
      operator_id: morgan,
      brief_date: isoDate(-1),
      headline: "Riverside is the move. Save plan note draft is waiting.",
      body_md:
        "## Today's call\n\nRiverside Logistics is your highest-priority account today. Yellow band, no save plan, renewal in 110 days. Galileo flagged it 0.84 confidence.\n\nThere's a save-plan draft from controlled-executor waiting for your review.\n\n## Standing items\n\n- 1 pending approval (Riverside save plan).\n- No other at-risk movement in your book.",
      structured_data: {
        kpis: [
          { label: "At-risk accounts", value: 1, delta: 0, trend: "flat" },
          { label: "Pending approvals", value: 1, delta: 0, trend: "flat" },
          { label: "Renewals < 90d", value: 0, delta: 0, trend: "flat" },
          { label: "Book ARR", value: "$348k", delta: 0, trend: "flat" },
        ],
        chips: [
          { label: "Riverside — yellow + missing save plan", kind: "warning" },
        ],
        priorities: [
          { rank: 1, summary: "Review Riverside save plan draft", account_id: ACCOUNTS.riverside.id, action: "approve_update" },
        ],
        refs: [
          { type: "salesforce.account", id: ACCOUNTS.riverside.id, label: "Riverside Logistics" },
        ],
      },
      generated_by: runs["galileo-brief-morgan-y1"].id,
      generated_at: iso(-1 * DAY - 17 * HOUR + 92_000 + 12_000),
    },
  ];

  const { error } = await sb.from("briefs").insert(rows as never);
  if (error) throw new Error(`insert briefs: ${error.message}`);
}

// ---------------------------------------------------------------------------
// 6. Connections
// ---------------------------------------------------------------------------

async function seedConnections(operators: Record<string, string>) {
  const taylor = operators["taylor@example-csm.test"];
  const morgan = operators["morgan@example-csm.test"];

  const rows = [
    {
      operator_id: taylor,
      provider: "salesforce",
      status: "connected" as const,
      external_account_id: "00D5A000000xPmAUAU",
      scopes: ["read.account", "read.opportunity", "read.case", "write.account", "write.task"],
      last_sync_at: iso(-22 * MIN),
      last_error: null,
      metadata: { seeded: true, display_name: "Production org", region: "us-east-1" },
    },
    {
      operator_id: taylor,
      provider: "slack",
      status: "connected" as const,
      external_account_id: "U05ABCD1234",
      scopes: ["chat:write", "im:write", "users:read"],
      last_sync_at: iso(-4 * MIN),
      last_error: null,
      metadata: { seeded: true, display_name: "Operator Surface bot" },
    },
    {
      operator_id: taylor,
      provider: "google",
      status: "connected" as const,
      external_account_id: "taylor@example-csm.test",
      scopes: ["gmail.send", "gmail.modify", "calendar.events"],
      last_sync_at: iso(-11 * MIN),
      last_error: null,
      metadata: { seeded: true, display_name: "Gmail (taylor@)" },
    },
    {
      operator_id: taylor,
      provider: "zoom",
      status: "connected" as const,
      external_account_id: "abc123XYZ",
      scopes: ["meeting:read", "recording:read"],
      last_sync_at: iso(-6 * HOUR),
      last_error: null,
      metadata: { seeded: true, display_name: "Zoom (taylor@)" },
    },

    {
      operator_id: morgan,
      provider: "salesforce",
      status: "connected" as const,
      external_account_id: "00D5A000000xPmAUAU",
      scopes: ["read.account", "read.opportunity", "read.case"],
      last_sync_at: iso(-3 * HOUR),
      last_error: null,
      metadata: { seeded: true, display_name: "Production org" },
    },
    {
      operator_id: morgan,
      provider: "slack",
      status: "error" as const,
      external_account_id: "U05XYZW5678",
      scopes: ["chat:write"],
      last_sync_at: iso(-5 * DAY),
      last_error: "Token expired 2026-05-23. Re-authorize required.",
      metadata: { seeded: true, display_name: "Operator Surface bot" },
    },
  ];

  const { error } = await sb.from("connections").insert(rows as never);
  if (error) throw new Error(`insert connections: ${error.message}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("→ ensuring placeholder operators in auth.users");
  const operators = await ensureOperators();
  for (const [email, id] of Object.entries(operators)) {
    console.log(`  ${email} → ${id}`);
  }

  console.log("→ clearing seeded data from public.*");
  await clearAll();

  console.log("→ inserting agents");
  const agentIds = await seedAgents();
  for (const [slug, id] of Object.entries(agentIds)) {
    console.log(`  ${slug} → ${id}`);
  }

  console.log(`→ inserting ${RUN_SPECS.length} agent_runs`);
  const runs = await seedRuns(agentIds);

  console.log(`→ inserting ${DECISIONS.length} decisions`);
  const decisionIds = await seedDecisions(agentIds, runs);

  console.log(`→ inserting ${APPROVALS.length} approvals`);
  await seedApprovals(agentIds, runs, decisionIds, operators);

  console.log("→ inserting briefs");
  await seedBriefs(runs, operators);

  console.log("→ inserting connections");
  await seedConnections(operators);

  console.log("\n→ verifying row counts (queried from DB)");
  const tables = [
    "agents",
    "agent_runs",
    "decisions",
    "approvals",
    "briefs",
    "connections",
  ] as const;
  let allOk = true;
  for (const t of tables) {
    const { count, error } = await sb
      .from(t)
      .select("*", { head: true, count: "exact" });
    if (error) {
      console.error(`  ✗ ${t}: ${error.message}`);
      allOk = false;
    } else {
      console.log(`  ✓ ${t}: ${count} rows`);
    }
  }

  console.log(allOk ? "\n✓ Seed complete." : "\n✗ Seed had errors — see above.");
  if (!allOk) process.exit(1);
}

main().catch((err) => {
  console.error("\n✗ Seed failed:");
  console.error(err);
  process.exit(1);
});
