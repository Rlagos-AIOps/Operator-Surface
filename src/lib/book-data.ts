import type { Tone } from "@/components/ui/accents";

/**
 * Aggregates the agent activity already in Supabase (decisions + approvals,
 * which reference our seeded SF accounts) into a per-account "book" view.
 * Pure: takes fetched rows, returns summaries. No Salesforce coupling — the
 * platform stays Supabase-only; SF data reaches here via the agents.
 */
type DecRow = {
  label: string;
  decision_type: string;
  confidence: number | null;
  reasoning?: string | null;
  source_record_id: string;
  created_at?: string;
  metadata: Record<string, unknown> | null;
  agent?: { slug: string } | null;
};
type ApRow = {
  status: string;
  target_record_id: string;
  metadata: Record<string, unknown> | null;
};

export type AccountSummary = {
  name: string;
  sfId: string;
  arr: number;
  segment: string;
  latestVerdict: string | null;
  tone: Tone;
  pendingApprovals: number;
  totalApprovals: number;
  galileoRead: string | null;
  decisionCount: number;
};

const VERDICT_TONE: Record<string, Tone> = {
  at_risk: "bad", red: "bad",
  priority_high: "hot",
  watch: "warm", yellow: "warm", missing_save_plan: "warm",
  stale_activity: "warm", missing_csm_owner: "warm", sop_section_5_gap: "warm",
  upsell_qualified: "good", green: "good", priority_medium: "good",
  route_to_executor: "cold", qbobr_checklist_ready: "cold",
};
const SEVERITY: Record<Tone, number> = {
  hot: 5, bad: 4, warm: 2, cold: 1, good: 1, pending: 0, muted: 0,
};

export function aggregateBook(decisions: DecRow[], approvals: ApRow[]): AccountSummary[] {
  const byAccount = new Map<string, AccountSummary>();

  for (const d of decisions) {
    const m = (d.metadata ?? {}) as Record<string, unknown>;
    const name = (m.account_name as string) ?? d.source_record_id;
    const cur =
      byAccount.get(name) ??
      {
        name,
        sfId: d.source_record_id,
        arr: (m.account_arr_usd as number) ?? 0,
        segment: (m.account_segment as string) ?? "—",
        latestVerdict: null,
        tone: "muted" as Tone,
        pendingApprovals: 0,
        totalApprovals: 0,
        galileoRead: null,
        decisionCount: 0,
      };
    cur.decisionCount += 1;
    if (!cur.arr && m.account_arr_usd) cur.arr = m.account_arr_usd as number;
    // decisions are fetched created_at desc → first seen is the latest
    if (cur.latestVerdict === null) cur.latestVerdict = d.label;
    const t = VERDICT_TONE[d.label] ?? "muted";
    if (SEVERITY[t] > SEVERITY[cur.tone]) cur.tone = t;
    if (d.agent?.slug === "galileo" && !cur.galileoRead && d.reasoning) {
      cur.galileoRead = d.reasoning;
    }
    byAccount.set(name, cur);
  }

  for (const a of approvals) {
    const m = (a.metadata ?? {}) as Record<string, unknown>;
    const name = (m.account_name as string) ?? a.target_record_id;
    const cur = byAccount.get(name);
    if (!cur) continue;
    cur.totalApprovals += 1;
    if (a.status === "pending") cur.pendingApprovals += 1;
  }

  // sort: most attention-worthy first (tone severity), then ARR desc
  return [...byAccount.values()].sort(
    (x, y) => SEVERITY[y.tone] - SEVERITY[x.tone] || y.arr - x.arr,
  );
}

export function bookTotals(accounts: AccountSummary[]) {
  return {
    count: accounts.length,
    arr: accounts.reduce((s, a) => s + a.arr, 0),
    atRisk: accounts.filter((a) => a.tone === "bad" || a.tone === "hot").length,
    pending: accounts.reduce((s, a) => s + a.pendingApprovals, 0),
  };
}
