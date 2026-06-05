import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { MetricTile } from "./_components/MetricTile";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Galileo this week — Operator Surface",
};

/**
 * Galileo-this-week ROI dashboard.
 *
 * Five tiles, one row, fed from existing `agent_runs`, `decisions`, and
 * `approvals` tables — no new schema. The thesis from Roberto's
 * walkthrough: the platform's value compounds, and the CSM needs to
 * SEE the agent's productivity, not infer it from the queue.
 *
 * Each tile is scoped to the last 7 days (created_at >= now() - 7d).
 * Distinct-account counts are computed in JS over the row set rather
 * than via SQL `count(distinct …)` so we don't need an RPC.
 */
export default async function OperatorPage() {
  const sb = createSupabaseAdminClient();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Resolve well-known agent slugs to ids so we can filter agent_runs.
  const { data: agents } = await sb.from("agents").select("id, slug");
  const slugById = new Map<string, string>(
    (agents ?? []).map((a) => [a.id, a.slug]),
  );

  // All queries fan out in parallel — they read disjoint tables.
  const [emailApprovals, runsLastWeek, decisionsLastWeek] = await Promise.all([
    sb
      .from("approvals")
      .select("id", { count: "exact", head: true })
      .eq("action_type", "send_email")
      .eq("status", "approved")
      .gte("created_at", sevenDaysAgo),
    sb
      .from("agent_runs")
      .select("id, agent_id, status, started_at")
      .gte("started_at", sevenDaysAgo),
    sb
      .from("decisions")
      .select("id, agent_id, decision_type, source_record_id, signals")
      .gte("created_at", sevenDaysAgo),
  ]);

  const emailsSent = emailApprovals.count ?? 0;

  const runs = runsLastWeek.data ?? [];
  const tasksCompleted = runs.filter((r) => r.status === "succeeded").length;
  const hygieneAudits = runs.filter(
    (r) => slugById.get(r.agent_id) === "hygiene-validator",
  ).length;

  const decisions = decisionsLastWeek.data ?? [];
  const atRiskTypes = new Set(["classify_at_risk", "classify_renewal_risk"]);
  const upsellTypes = new Set(["classify_upsell_opportunity"]);

  const atRiskAccounts = new Set(
    decisions
      .filter((d) => atRiskTypes.has(d.decision_type))
      .map((d) => d.source_record_id),
  );
  const upsellAccounts = new Set(
    decisions
      .filter((d) => upsellTypes.has(d.decision_type))
      .map((d) => d.source_record_id),
  );

  return (
    <main className="min-h-screen bg-bg-deep">
      <div className="mx-auto max-w-[1200px] px-s5 py-s7">
        {/* Page identity */}
        <header className="mb-s7">
          <p className="mb-s3 font-mono text-small font-bold uppercase tracking-[0.14em] text-lime">
            Operator
          </p>
          <h1
            className="font-serif text-paper text-balance mb-s4 max-w-[24ch]"
            style={{
              fontSize: "clamp(48px, 6vw, 72px)",
              lineHeight: 1.0,
              letterSpacing: "-0.025em",
            }}
          >
            Galileo this week
          </h1>
          <p className="max-w-[60ch] text-body text-paper/80 leading-relaxed">
            Your agent team handled this work autonomously. You reviewed the
            high-stakes calls.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-s4 sm:grid-cols-2 lg:grid-cols-5">
          <MetricTile
            label="Emails sent"
            value={emailsSent}
            caption="Approved by you, sent by Galileo"
          />
          <MetricTile
            label="Tasks completed"
            value={tasksCompleted}
            caption="Successful agent runs"
          />
          <MetricTile
            label="Hygiene audits"
            value={hygieneAudits}
            caption="Data-quality sweeps"
          />
          <MetricTile
            label="At-risk accounts flagged"
            value={atRiskAccounts.size}
            caption="Distinct accounts touched"
          />
          <MetricTile
            label="Upsell signals"
            value={upsellAccounts.size}
            caption="Distinct accounts surfaced"
          />
        </section>

        <p className="mt-s7 max-w-[60ch] text-small text-muted">
          Window: last 7 days. Fed live from{" "}
          <span className="font-mono text-paper">agent_runs</span>,{" "}
          <span className="font-mono text-paper">decisions</span>, and{" "}
          <span className="font-mono text-paper">approvals</span> — no manual
          tracking.
        </p>
      </div>
    </main>
  );
}
