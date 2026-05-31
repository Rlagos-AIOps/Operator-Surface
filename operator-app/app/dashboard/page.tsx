import { ArrowUpRight, Bot, Plus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { WeeklyLeadsChart, ResponseTimeChart } from "@/components/charts/dashboard-charts";
import { Badge, IconTile, Kbd, MiniBar, Pill, StatusDot, TEXT_TONE, type Tone } from "@/components/site/accents";

const PANEL =
  "rounded-2xl border border-[color:var(--surface-edge)] bg-card shadow-[var(--shadow-1)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-2)]";

const STATS: { label: string; value: string; delta: string; tone: Tone }[] = [
  { label: "Active leads", value: "47", delta: "+12 this week", tone: "lime" },
  { label: "Callback today", value: "3", delta: "High priority", tone: "amber" },
  { label: "Avg response time", value: "2h 14m", delta: "−23% vs last week", tone: "cyan" },
  { label: "Conv. rate", value: "34%", delta: "+4% this month", tone: "lime" },
];

const AGENTS: {
  name: string;
  status: string;
  tone: Tone;
  note: string;
  load: number;
  running: boolean;
  caret?: boolean;
}[] = [
  { name: "Lead Qualifier", status: "Running", tone: "lime", note: "scoring 14 inbound · routed by ICP", load: 72, running: true },
  { name: "Reply Drafter", status: "Running", tone: "volt", note: "composing reply for Sarah Chen", load: 54, running: true, caret: true },
  { name: "Intent Scorer", status: "Queued", tone: "amber", note: "12 messages waiting to score", load: 38, running: false },
  { name: "Connector", status: "Error", tone: "red", note: "linkedin · re-auth required", load: 8, running: false },
];

const ATTENTION: { name: string; type: string; tier: string; tone: Tone; icp: string; note: string; t: string }[] = [
  { name: "Sarah Chen", type: "Enterprise lead", tier: "HOT", tone: "lime", icp: "0.92", note: "Mentioned budget of $500K. Needs proposal by Friday.", t: "2h" },
  { name: "Marcus Rodriguez", type: "Follow-up", tier: "WARM", tone: "amber", icp: "0.71", note: "Requested technical deep-dive. Schedule a demo.", t: "5h" },
  { name: "Jennifer Park", type: "Cold outreach", tier: "COLD", tone: "cyan", icp: "0.34", note: "VP Eng at a Series B. Strong fit for ROI Pricing.", t: "1d" },
];

const ACTIVITY: { label: string; tone: Tone; who: string; what: string; t: string }[] = [
  { label: "Shipped", tone: "lime", who: "Reply Drafter", what: "sent 7 replies · 3:42 PM", t: "2m" },
  { label: "Signal", tone: "cyan", who: "Intent Scorer", what: "flagged 3 leads cold", t: "8m" },
  { label: "Agent", tone: "volt", who: "roi-calculator", what: "priced Halcyon at $18.4K", t: "18m" },
  { label: "Warn", tone: "amber", who: "LinkedIn API", what: "at 78% of rate limit", t: "24m" },
  { label: "Review", tone: "muted", who: "Lead Qualifier", what: "scored 14 new inbound", t: "32m" },
];

function AgentIcon({ tone, running }: { tone: Tone; running: boolean }) {
  return (
    <span
      className={cn(
        "relative grid size-11 shrink-0 place-items-center rounded-full",
        running ? "animate-glow-ring bg-gradient-to-br from-primary to-volt text-ink" : "bg-surface-2 text-muted-foreground",
      )}
    >
      <Bot className="size-5" strokeWidth={2} />
      <StatusDot tone={tone} pulse={running} className="absolute -right-0.5 -top-0.5 size-2.5 ring-2 ring-background" />
    </span>
  );
}

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1320px] px-6 py-8 sm:py-10">
      {/* Header + live signage */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-primary">LinkedIn inbound triage</p>
          <h1 className="mt-2 text-4xl sm:text-5xl">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5">
            <StatusDot tone="lime" pulse />
            <span className="eyebrow text-muted-foreground">agent online</span>
          </span>
          <span className="num glass rounded-full px-3.5 py-2 font-mono text-xs text-muted-foreground">run · 0042 · 3:42 PM</span>
        </div>
      </div>

      {/* Lead filter pills — nav signal */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Pill active count={47}>All leads</Pill>
        <Pill count={18}>Hot</Pill>
        <Pill count={12}>Warm</Pill>
        <Pill count={17}>Cold</Pill>
        <Pill count={7}>Agent-drafted</Pill>
      </div>

      {/* Pipeline hero (dot-grid texture) + stat squares */}
      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div className={cn(PANEL, "relative overflow-hidden p-7 md:col-span-2 lg:row-span-2")}>
          <div className="dot-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden />
          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <p className="eyebrow text-muted-foreground">Total revenue pipeline</p>
              <span className="eyebrow text-muted-foreground/70">↳ 16/9 · live</span>
            </div>
            <p className="num mt-5 font-display text-6xl leading-none sm:text-7xl">$847K</p>
            <p className="mt-4 text-muted-foreground">Across 47 active opportunities</p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Badge tone="lime" dot pulse>
                <ArrowUpRight className="size-3" strokeWidth={2.5} /> +23% MoM
              </Badge>
              <Badge tone="cyan">14s avg handle</Badge>
              <Badge tone="amber">3 need attention</Badge>
            </div>
          </div>
        </div>
        {STATS.map((s) => (
          <div key={s.label} className={cn(PANEL, "p-5")}>
            <div className="flex items-center justify-between gap-2">
              <p className="eyebrow text-muted-foreground">{s.label}</p>
              <StatusDot tone={s.tone} />
            </div>
            <p className="num mt-3 font-display text-4xl leading-none">{s.value}</p>
            <p className={cn("num mt-2 font-mono text-xs", TEXT_TONE[s.tone])}>{s.delta}</p>
          </div>
        ))}
      </div>

      {/* Live agent activity */}
      <div className={cn(PANEL, "mt-3 p-6")}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <IconTile tone="volt">
              <Sparkles className="size-[18px]" strokeWidth={1.75} />
            </IconTile>
            <h2 className="font-display text-2xl">Live agent activity</h2>
          </div>
          <span className="eyebrow text-muted-foreground/70">4 deployed · 2 running</span>
        </div>
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {AGENTS.map((a) => (
            <li key={a.name} className="surface flex items-center gap-4 rounded-xl p-4">
              <AgentIcon tone={a.tone} running={a.running} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{a.name}</p>
                  <Badge tone={a.tone} dot pulse={a.running}>
                    {a.status}
                  </Badge>
                </div>
                <p className={cn("mt-0.5 truncate font-mono text-xs text-muted-foreground", a.caret && "caret")}>{a.note}</p>
                <MiniBar value={a.load} tone={a.tone} className="mt-2.5" />
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="dashed mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-mono text-xs uppercase tracking-[0.13em] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
        >
          <Plus className="size-4" strokeWidth={1.75} /> Deploy a new agent
        </button>
      </div>

      {/* Charts */}
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <div className={cn(PANEL, "p-6")}>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-2xl">Weekly lead activity</h2>
            <span className="eyebrow text-muted-foreground/70">last 7d</span>
          </div>
          <div className="mt-4">
            <WeeklyLeadsChart />
          </div>
        </div>
        <div className={cn(PANEL, "p-6")}>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-2xl">Avg response time</h2>
            <span className="eyebrow text-muted-foreground/70">minutes</span>
          </div>
          <div className="mt-4">
            <ResponseTimeChart />
          </div>
        </div>
      </div>

      {/* Needs attention + recent activity */}
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <div className={cn(PANEL, "p-6")}>
          <h2 className="font-display text-2xl">Needs attention</h2>
          <ul className="mt-5 grid gap-2.5">
            {ATTENTION.map((a) => (
              <li key={a.name} className="surface rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Badge tone={a.tone} dot>
                      {a.tier}
                    </Badge>
                    <p className="truncate font-medium">{a.name}</p>
                    <span className="hidden shrink-0 text-sm text-muted-foreground sm:inline">· {a.type}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="num font-mono text-xs text-muted-foreground">ICP {a.icp}</span>
                    <span className="num font-mono text-xs text-muted-foreground">{a.t}</span>
                  </div>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">{a.note}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-2 border-t border-border pt-3.5">
            <Kbd>R</Kbd>
            <span className="text-xs text-muted-foreground">reply</span>
            <Kbd>E</Kbd>
            <span className="text-xs text-muted-foreground">archive</span>
            <Kbd>⌘K</Kbd>
            <span className="text-xs text-muted-foreground">command</span>
          </div>
        </div>
        <div className={cn(PANEL, "p-6")}>
          <h2 className="font-display text-2xl">Recent activity</h2>
          <ul className="mt-5 grid gap-2.5">
            {ACTIVITY.map((a) => (
              <li key={a.what} className="surface flex items-start gap-3 rounded-xl px-4 py-3">
                <StatusDot tone={a.tone} className="mt-[5px]" />
                <div className="min-w-0 flex-1">
                  <span className={cn("eyebrow", TEXT_TONE[a.tone])}>{a.label}</span>
                  <p className="mt-1 truncate text-sm">
                    <span className="font-medium">{a.who}</span> <span className="text-muted-foreground">{a.what}</span>
                  </p>
                </div>
                <span className="num shrink-0 font-mono text-xs text-muted-foreground">{a.t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
