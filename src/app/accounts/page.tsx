import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { aggregateBook, bookTotals } from "@/lib/book-data";
import { VerdictBadge } from "@/app/decisions/_components/VerdictBadge";
import { StatusDot } from "@/components/ui/accents";
import { PANEL, METRIC_CHIP } from "@/components/ui/surfaces";
import { AccountLink } from "@/app/_components/AccountLink";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Book — Operator Surface",
};

function fmtArr(n: number): string {
  if (!n) return "—";
  return n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 ? 1 : 0)}k` : `$${n}`;
}

export default async function AccountsPage() {
  const sb = createSupabaseAdminClient();
  const [decs, apps] = await Promise.all([
    sb
      .from("decisions")
      .select(
        "label,decision_type,confidence,reasoning,source_record_id,created_at,metadata,agent:agents(slug)",
      )
      .order("created_at", { ascending: false }),
    sb.from("approvals").select("status,target_record_id,metadata"),
  ]);

  const accounts = aggregateBook((decs.data ?? []) as never, (apps.data ?? []) as never);
  const totals = bookTotals(accounts);

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="eyebrow text-muted-foreground">Customer Success · Book of business</p>
        <h1 className="mt-1 font-serif text-h2 text-foreground">The Book</h1>
        <p className="mt-2 max-w-[60ch] text-body text-muted-foreground">
          Every account your agents are watching, ranked by what needs attention. Built live from
          the decisions and approvals the agents have logged.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <span className={METRIC_CHIP}>{totals.count} accounts</span>
          <span className={METRIC_CHIP}>{fmtArr(totals.arr)} ARR</span>
          <span className={METRIC_CHIP}>{totals.atRisk} need attention</span>
          <span className={METRIC_CHIP}>{totals.pending} pending approvals</span>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {accounts.map((a) => (
          <div key={a.name} className={`${PANEL} p-5`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate font-serif text-h4 text-foreground">
                  <AccountLink accountId={a.sfId} accountName={a.name} />
                </h3>
                <p className="mt-0.5 font-mono text-micro text-muted-foreground">
                  {a.segment} · {fmtArr(a.arr)} ARR
                </p>
              </div>
              <StatusDot tone={a.tone} pulse={a.tone === "hot" || a.tone === "bad"} />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {a.latestVerdict && <VerdictBadge label={a.latestVerdict} />}
              {a.pendingApprovals > 0 && (
                <Link
                  href={`/approvals?account=${encodeURIComponent(a.sfId)}`}
                  className="inline-flex items-center rounded-pill border border-pending/50 bg-pending/10 px-s3 py-[3px] text-micro font-bold uppercase tracking-wider text-pending transition-colors duration-fast hover:bg-pending/20"
                >
                  {a.pendingApprovals} pending
                </Link>
              )}
            </div>

            {a.galileoRead && (
              <div className="mt-3 border-l-2 border-volt/50 pl-3">
                <span className="font-mono text-micro uppercase tracking-wider text-volt">
                  Galileo&rsquo;s read
                </span>
                <p className="mt-1 text-small text-muted-foreground">{a.galileoRead}</p>
              </div>
            )}

            <p className="mt-3 font-mono text-micro text-muted-foreground/70">
              {a.decisionCount} decision{a.decisionCount === 1 ? "" : "s"} ·{" "}
              {a.totalApprovals > 0 ? (
                <Link
                  href={`/approvals?account=${encodeURIComponent(a.sfId)}`}
                  className="underline decoration-muted-foreground/40 underline-offset-2 hover:text-foreground hover:decoration-foreground"
                >
                  {a.totalApprovals} approval{a.totalApprovals === 1 ? "" : "s"}
                </Link>
              ) : (
                <>{a.totalApprovals} approvals</>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
