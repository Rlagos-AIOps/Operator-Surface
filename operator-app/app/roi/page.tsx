"use client";

import { Download, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge, StatusDot, type Tone } from "@/components/site/accents";
import { PageHeader } from "@/components/site/page-header";
import { BTN_GHOST, BTN_PRIMARY, PANEL } from "@/components/site/surfaces";

// Neutral financial readouts. "ROI delivered" keeps the page's identity in an
// accounting frame (return vs spend), the rest is straight billing.
const KPIS = [
  { label: "MRR", value: "$42,180", delta: "+8.2% MoM" },
  { label: "Collected · Jun", value: "$38,900", delta: "92% of billed" },
  { label: "Outstanding (AR)", value: "$13,400", delta: "3 open invoices" },
  { label: "ROI delivered", value: "6.4×", delta: "$612K value" },
];

// Collected revenue, last 12 months ($K) — quantitative → green spectrum.
const REVENUE = [22, 28, 26, 31, 34, 33, 38, 36, 41, 39, 42, 43];
const REVENUE_MAX = 48;

// AR aging — status gradient (current → overdue): good → warm → hot → bad.
const AGING: { label: string; amount: string; pct: number; tone: Tone }[] = [
  { label: "Current", amount: "$10,000", pct: 75, tone: "good" },
  { label: "1–30 days", amount: "$3,400", pct: 25, tone: "warm" },
  { label: "31–60 days", amount: "$0", pct: 0, tone: "hot" },
  { label: "60+ days", amount: "$0", pct: 0, tone: "bad" },
];
const BAR: Record<Tone, string> = {
  good: "bg-good", warm: "bg-warm", hot: "bg-hot", cold: "bg-cold", bad: "bg-bad", pending: "bg-pending", muted: "bg-muted-foreground",
};

const INVOICES: { id: string; client: string; issued: string; due: string; amount: string; status: string; tone: Tone }[] = [
  { id: "INV-1042", client: "Northlake Capital", issued: "Jun 1", due: "Jun 15", amount: "$12,400", status: "Paid", tone: "good" },
  { id: "INV-1041", client: "Halcyon Labs", issued: "Jun 1", due: "Jun 15", amount: "$7,480", status: "Paid", tone: "good" },
  { id: "INV-1040", client: "Forge & Co", issued: "May 28", due: "Jun 11", amount: "$8,900", status: "Paid", tone: "good" },
  { id: "INV-1039", client: "Wynn Industries", issued: "Jun 1", due: "Jun 15", amount: "$3,800", status: "Due", tone: "pending" },
  { id: "INV-1038", client: "Mercer Studio", issued: "Jun 3", due: "Jun 17", amount: "$6,200", status: "Due", tone: "pending" },
  { id: "INV-1037", client: "Pier 9 Group", issued: "May 20", due: "Jun 3", amount: "$3,400", status: "Overdue", tone: "bad" },
  { id: "INV-1036", client: "Northlake Capital", issued: "May 1", due: "May 15", amount: "$12,400", status: "Paid", tone: "good" },
  { id: "INV-1035", client: "Halcyon Labs", issued: "May 1", due: "May 15", amount: "$7,480", status: "Paid", tone: "good" },
  { id: "DRAFT-09", client: "Mercer Studio", issued: "—", due: "Jul 3", amount: "$6,200", status: "Draft", tone: "muted" },
];

const UPCOMING: { client: string; date: string; amount: string; plan: string }[] = [
  { client: "Forge & Co", date: "Jun 28", amount: "$8,900", plan: "Growth · auto-charge" },
  { client: "Northlake Capital", date: "Jul 1", amount: "$12,400", plan: "Enterprise · auto-charge" },
  { client: "Halcyon Labs", date: "Jul 1", amount: "$7,480", plan: "Scale · auto-charge" },
  { client: "Mercer Studio", date: "Jul 3", amount: "$6,200", plan: "Growth · auto-charge" },
];

const COL = "grid grid-cols-[0.9fr_1.5fr_0.7fr_0.7fr_0.9fr_0.9fr] items-center gap-3";

export default function RoiPage() {
  return (
    <div className="px-5 py-8 sm:px-7 sm:py-10">
      <PageHeader
        eyebrow="Accounting & billing"
        title="ROI"
        subtitle="Invoices, collections, and the return you've delivered."
        chips={[{ label: "$3.4K overdue", tone: "bad" }]}
        right={
          <>
            <button type="button" onClick={() => toast("Exported ledger.csv")} className={cn(BTN_GHOST, "px-4 py-2 text-sm")}>
              <Download className="size-4" strokeWidth={1.75} />
              Export
            </button>
            <button type="button" onClick={() => toast("New invoice — opening builder")} className={cn(BTN_PRIMARY, "px-4 py-2 text-sm")}>
              <Plus className="size-4" strokeWidth={2} />
              New invoice
            </button>
          </>
        }
      />

      {/* Financial KPIs */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className={cn(PANEL, "p-6")}>
            <p className="eyebrow text-muted-foreground">{k.label}</p>
            <p className="num mt-3 font-display text-4xl leading-none">{k.value}</p>
            <p className="num mt-2 font-mono text-xs text-muted-foreground">{k.delta}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        {/* Revenue trend — quantitative → green spectrum */}
        <div className={cn(PANEL, "p-6")}>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-2xl">Revenue</h2>
            <span className="eyebrow text-muted-foreground">collected · last 12 mo</span>
          </div>
          <div className="mt-5 flex h-40 items-end gap-1.5">
            {REVENUE.map((v, i) => (
              <div key={i} className="flex-1 rounded-t-md bg-good/75" style={{ height: `${(v / REVENUE_MAX) * 100}%` }} />
            ))}
          </div>
          <div className="mt-3 flex items-baseline justify-between border-t border-[color:var(--surface-edge)] pt-3">
            <span className="num font-mono text-xs text-muted-foreground">Jul → Jun</span>
            <span className="num font-display text-xl leading-none">
              $43K <span className="eyebrow text-muted-foreground">this mo</span>
            </span>
          </div>
        </div>

        {/* Accounts receivable — aging */}
        <div className={cn(PANEL, "p-6")}>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-2xl">Receivable</h2>
            <span className="eyebrow text-muted-foreground">$13,400 open</span>
          </div>
          <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-surface-2">
            {AGING.filter((a) => a.pct > 0).map((a) => (
              <div key={a.label} className={BAR[a.tone]} style={{ width: `${a.pct}%` }} />
            ))}
          </div>
          <ul className="mt-4 grid gap-2.5">
            {AGING.map((a) => (
              <li key={a.label} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2">
                  <StatusDot tone={a.tone} />
                  <span className="text-foreground">{a.label}</span>
                </span>
                <span className="num font-medium text-foreground">{a.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Invoices ledger */}
      <div className={cn(PANEL, "mt-3 overflow-hidden")}>
        <div className="flex items-baseline justify-between gap-3 p-6 pb-4">
          <h2 className="font-display text-2xl">Invoices</h2>
          <span className="eyebrow text-muted-foreground">{INVOICES.length} this period</span>
        </div>
        <div className={cn(COL, "eyebrow border-y border-[color:var(--surface-edge)] px-6 py-2.5 text-muted-foreground")}>
          <span>Invoice</span>
          <span>Client</span>
          <span>Issued</span>
          <span>Due</span>
          <span className="text-right">Amount</span>
          <span className="text-right">Status</span>
        </div>
        <ul className="divide-y divide-[color:var(--surface-edge)]">
          {INVOICES.map((inv) => (
            <li key={inv.id} className={cn(COL, "px-6 py-3 text-sm transition-colors hover:bg-surface/60")}>
              <span className="num truncate font-mono text-xs text-muted-foreground">{inv.id}</span>
              <span className="truncate font-medium text-foreground">{inv.client}</span>
              <span className="num font-mono text-xs text-muted-foreground">{inv.issued}</span>
              <span className="num font-mono text-xs text-muted-foreground">{inv.due}</span>
              <span className="num text-right font-medium text-foreground">{inv.amount}</span>
              <span className="flex justify-end">
                <Badge tone={inv.tone} dot>
                  {inv.status}
                </Badge>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Upcoming charges */}
      <div className={cn(PANEL, "mt-3 p-6")}>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-2xl">Upcoming charges</h2>
          <span className="eyebrow text-muted-foreground">next 30 days</span>
        </div>
        <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {UPCOMING.map((u) => (
            <li key={u.client} className="surface flex items-center justify-between gap-3 rounded-xl px-4 py-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{u.client}</p>
                <p className="num font-mono text-xs text-muted-foreground">{u.plan} · {u.date}</p>
              </div>
              <span className="num shrink-0 font-display text-base leading-none">{u.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
