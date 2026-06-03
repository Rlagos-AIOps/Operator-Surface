import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getDemoOperatorId } from "@/lib/supabase/operator";
import { HubTile } from "./_components/HubTile";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Operator Surface",
};

function formatBriefDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default async function HubPage() {
  const sb = createSupabaseAdminClient();
  const operatorId = await getDemoOperatorId();

  // Run the three count queries in parallel — they're independent and
  // we want the Hub to land fast.
  const [pendingResp, decisionsResp, latestBriefResp] = await Promise.all([
    sb
      .from("approvals")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    sb.from("decisions").select("*", { count: "exact", head: true }),
    sb
      .from("briefs")
      .select("brief_date, viewed_at")
      .eq("operator_id", operatorId)
      .order("brief_date", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const pendingCount = pendingResp.count ?? 0;
  const decisionsCount = decisionsResp.count ?? 0;
  const latestBrief = latestBriefResp.data;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1280px] px-s5 py-s8 md:py-s9">
        {/* Hero */}
        <header className="mb-s9 max-w-[36ch]">
          <p className="eyebrow mb-s4">Operator Surface</p>
          <h1
            className="font-serif text-balance text-foreground"
            style={{
              fontSize: "clamp(56px, 7vw, 96px)",
              lineHeight: 0.96,
              letterSpacing: "-0.035em",
            }}
          >
            See what your agents did.
          </h1>
          <p className="mt-s5 max-w-[48ch] text-body text-foreground/80 leading-relaxed">
            A live view of your CSM agents&rsquo; work — the calls they made,
            the reasoning behind each one, and what&rsquo;s waiting on a human
            decision before it executes.
          </p>
        </header>

        {/* Tiles */}
        <section
          aria-label="Operator Surface launcher"
          className="grid grid-cols-1 gap-s5 md:grid-cols-3"
        >
          <HubTile
            num="01"
            title="Daily Brief"
            description="Your operator's-eye recap of what the agents found overnight. KPIs, priorities, the call."
            meta={
              latestBrief ? (
                <>
                  Latest:{" "}
                  <span className="font-mono text-foreground">
                    {formatBriefDate(latestBrief.brief_date)}
                  </span>
                  {" · "}
                  {latestBrief.viewed_at ? (
                    <span>viewed</span>
                  ) : (
                    <span className="text-primary">not yet viewed</span>
                  )}
                </>
              ) : (
                <span className="text-muted-foreground">No brief yet</span>
              )
            }
            href="/brief"
          />

          <HubTile
            num="02"
            title="Approval Queue"
            description="Review proposed agent actions — save plans, emails, tasks, Slack — before they execute."
            meta={
              <>
                <span className="font-mono text-foreground tabular">
                  {pendingCount}
                </span>{" "}
                pending {pendingCount === 1 ? "approval" : "approvals"}
              </>
            }
            href="/approvals"
          />

          <HubTile
            num="03"
            title="Decision Trace"
            description="See why the agents reached the verdicts they did — signals, weights, source records."
            meta={
              <>
                <span className="font-mono text-foreground tabular">
                  {decisionsCount}
                </span>{" "}
                decisions logged
              </>
            }
            href="/decisions"
          />
        </section>

        <p className="mt-s9 text-micro text-muted-foreground">
          Pre-auth demo. Operator scoped to{" "}
          <span className="font-mono">
            {process.env.DEMO_OPERATOR_EMAIL ?? "taylor@example-csm.test"}
          </span>
          .
        </p>
      </div>
    </main>
  );
}
