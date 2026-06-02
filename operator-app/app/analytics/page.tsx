import { cn } from "@/lib/utils";
import { StatusDot, type Tone } from "@/components/site/accents";
import { PageHeader, LiveSignage } from "@/components/site/page-header";
import { PANEL } from "@/components/site/surfaces";

const KPIS = [
  { label: "Total leads", value: "312", delta: "+18% vs Q1" },
  { label: "Qualified", value: "184", delta: "59% of leads" },
  { label: "Proposals", value: "71", delta: "+9 this month" },
  { label: "Win rate", value: "34%", delta: "+4%" },
];

const FUNNEL = [
  { stage: "Leads", v: 312, pct: 100 },
  { stage: "Qualified", v: 184, pct: 59 },
  { stage: "Proposal", v: 71, pct: 23 },
  { stage: "Won", v: 24, pct: 8 },
];

// Intent = a status category → semantic signal colors (hot/warm/cold).
const INTENT: { label: string; pct: number; tone: Tone; bar: string }[] = [
  { label: "High", pct: 38, tone: "hot", bar: "bg-hot" },
  { label: "Mid", pct: 41, tone: "warm", bar: "bg-warm" },
  { label: "Cold", pct: 21, tone: "cold", bar: "bg-cold" },
];

const TREND = [9, 14, 11, 19, 16, 22, 18, 25, 21, 28, 24, 31];
const TREND_MAX = 32;

export default function AnalyticsPage() {
  return (
    <div className="px-5 py-8 sm:px-7 sm:py-10">
      <PageHeader
        eyebrow="Performance"
        title="Analytics"
        subtitle="Funnel, intent mix and trend — last 90 days."
        right={<LiveSignage stamp="last 90d · live" />}
      />

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className={cn(PANEL, "p-6")}>
            <p className="eyebrow text-muted-foreground">{k.label}</p>
            <p className="num mt-3 font-display text-4xl leading-none">{k.value}</p>
            <p className="num mt-2 font-mono text-xs text-muted-foreground">{k.delta}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {/* Conversion funnel — quantitative → green spectrum */}
        <div className={cn(PANEL, "p-6")}>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-2xl">Conversion funnel</h2>
            <span className="eyebrow text-muted-foreground">Q2</span>
          </div>
          <div className="mt-5 grid gap-3">
            {FUNNEL.map((f) => (
              <div key={f.stage}>
                <div className="flex items-center justify-between text-sm text-foreground">
                  <span>{f.stage}</span>
                  <span className="num text-muted-foreground">{f.v}</span>
                </div>
                <div className="surface-2 mt-1.5 h-3 overflow-hidden rounded-full">
                  <div className="h-full rounded-full bg-good" style={{ width: `${f.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leads over time — quantitative → green spectrum */}
        <div className={cn(PANEL, "p-6")}>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-2xl">Leads over time</h2>
            <span className="eyebrow text-muted-foreground">last 12 mo</span>
          </div>
          <div className="mt-5 flex h-40 items-end gap-1.5">
            {TREND.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-good/75"
                style={{ height: `${(v / TREND_MAX) * 100}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Intent distribution — categorical status → semantic signal colors */}
      <div className={cn(PANEL, "mt-3 p-6")}>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-2xl">Intent distribution</h2>
          <span className="eyebrow text-muted-foreground">current</span>
        </div>
        <div className="mt-5 flex h-4 overflow-hidden rounded-full">
          {INTENT.map((i) => (
            <div key={i.label} className={i.bar} style={{ width: `${i.pct}%` }} />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-5">
          {INTENT.map((i) => (
            <div key={i.label} className="flex items-center gap-2 text-sm text-foreground">
              <StatusDot tone={i.tone} />
              <span>{i.label}</span>
              <span className="num text-muted-foreground">{i.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
