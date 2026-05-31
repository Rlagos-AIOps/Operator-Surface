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

const INTENT = [
  { label: "High", pct: 38, tone: "bg-primary" },
  { label: "Mid", pct: 41, tone: "bg-amber" },
  { label: "Cold", pct: 21, tone: "bg-muted-foreground" },
];

const TREND = [9, 14, 11, 19, 16, 22, 18, 25, 21, 28, 24, 31];
const TREND_MAX = 32;

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-[1320px] px-6 py-8 sm:py-10">
      <p className="eyebrow text-muted-foreground">Performance</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">Analytics</h1>
      <p className="mt-2 text-muted-foreground">
        Funnel, intent mix and trend — last 90 days.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="glass rounded-2xl p-6">
            <p className="eyebrow text-muted-foreground">{k.label}</p>
            <p className="num mt-3 font-display text-4xl leading-none">{k.value}</p>
            <p className="num mt-2 text-xs text-muted-foreground">{k.delta}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {/* Conversion funnel */}
        <div className="glass rounded-2xl p-6">
          <p className="eyebrow text-muted-foreground">Conversion funnel</p>
          <div className="mt-5 grid gap-3">
            {FUNNEL.map((f) => (
              <div key={f.stage}>
                <div className="flex items-center justify-between text-sm">
                  <span>{f.stage}</span>
                  <span className="num text-muted-foreground">{f.v}</span>
                </div>
                <div className="surface mt-1.5 h-3 overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full bg-primary/80"
                    style={{ width: `${f.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leads over time */}
        <div className="glass rounded-2xl p-6">
          <p className="eyebrow text-muted-foreground">Leads over time</p>
          <div className="mt-5 flex h-40 items-end gap-1.5">
            {TREND.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-primary/70"
                style={{ height: `${(v / TREND_MAX) * 100}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Intent distribution */}
      <div className="glass mt-3 rounded-2xl p-6">
        <p className="eyebrow text-muted-foreground">Intent distribution</p>
        <div className="mt-5 flex h-4 overflow-hidden rounded-full">
          {INTENT.map((i) => (
            <div key={i.label} className={i.tone} style={{ width: `${i.pct}%` }} />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-5">
          {INTENT.map((i) => (
            <div key={i.label} className="flex items-center gap-2 text-sm">
              <span className={`size-2.5 rounded-full ${i.tone}`} />
              <span>{i.label}</span>
              <span className="num text-muted-foreground">{i.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
