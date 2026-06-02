import { ArrowUpRight, Bot, Plus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { WeeklyLeadsChart, ResponseTimeChart } from "@/components/charts/dashboard-charts";
import { Badge, IconTile, MiniBar, StatusDot, type Tone } from "@/components/site/accents";
import { LeadFilters } from "@/components/site/lead-filters";
import { PageHeader, LiveSignage } from "@/components/site/page-header";
import { ShortcutsTip } from "@/components/site/shortcuts-tip";
import { LIFT, METRIC_CHIP, PANEL } from "@/components/site/surfaces";

// An interactive pill surface: the TONE lives on the border + a same-tone bg
// tint (Lovable's box construction). White text. Hover brightens both.
const AGENT_SURFACE: Record<Tone, string> = {
  good: "border-good/40 bg-good/[0.07] hover:border-good/60 hover:bg-good/[0.12]",
  hot: "border-hot/45 bg-hot/[0.08] hover:border-hot/65 hover:bg-hot/[0.13]",
  warm: "border-warm/45 bg-warm/[0.08] hover:border-warm/65 hover:bg-warm/[0.13]",
  cold: "border-cold/40 bg-cold/[0.07] hover:border-cold/60 hover:bg-cold/[0.12]",
  bad: "border-bad/50 bg-bad/[0.09] hover:border-bad/70 hover:bg-bad/[0.15]",
  pending: "border-pending/45 bg-pending/[0.08] hover:border-pending/65 hover:bg-pending/[0.13]",
  muted: "border-border-strong bg-surface hover:bg-surface-2",
};

const STATS: { label: string; value: string; delta: string; tone: Tone }[] = [
  { label: "Active leads", value: "47", delta: "+12 this week", tone: "good" },
  { label: "Callback today", value: "3", delta: "High priority", tone: "hot" },
  { label: "Avg response time", value: "2h 14m", delta: "−23% vs last week", tone: "good" },
  { label: "Conv. rate", value: "34%", delta: "+4% this month", tone: "good" },
];

const AGENTS: {
  name: string;
  status: string;
  tone: Tone;
  note: string;
  load: number;
  running: boolean;
}[] = [
  { name: "Lead Qualifier", status: "Running", tone: "good", note: "scoring 14 inbound · routed by ICP", load: 72, running: true },
  { name: "Reply Drafter", status: "Running", tone: "good", note: "composing reply for Sarah Chen", load: 54, running: true },
  { name: "Intent Scorer", status: "Queued", tone: "pending", note: "12 messages waiting to score", load: 38, running: false },
  { name: "Connector", status: "Error", tone: "bad", note: "linkedin · re-auth required", load: 8, running: false },
];

const ATTENTION: { name: string; type: string; tier: string; tone: Tone; icp: string; note: string; t: string }[] = [
  { name: "Sarah Chen", type: "Enterprise lead", tier: "HOT", tone: "hot", icp: "0.92", note: "Mentioned budget of $500K. Needs proposal by Friday.", t: "2h" },
  { name: "Marcus Rodriguez", type: "Follow-up", tier: "WARM", tone: "warm", icp: "0.71", note: "Requested technical deep-dive. Schedule a demo.", t: "5h" },
  { name: "Jennifer Park", type: "Cold outreach", tier: "COLD", tone: "cold", icp: "0.34", note: "VP Eng at a Series B. Strong fit for ROI Pricing.", t: "1d" },
];

const ACTIVITY: { label: string; tone: Tone; who: string; what: string; t: string }[] = [
  { label: "Shipped", tone: "good", who: "Reply Drafter", what: "sent 7 replies · 3:42 PM", t: "2m" },
  { label: "Signal", tone: "cold", who: "Intent Scorer", what: "flagged 3 leads cold", t: "8m" },
  { label: "Agent", tone: "good", who: "roi-calculator", what: "priced Halcyon at $18.4K", t: "18m" },
  { label: "Warn", tone: "warm", who: "LinkedIn API", what: "at 78% of rate limit", t: "24m" },
  { label: "Review", tone: "pending", who: "Lead Qualifier", what: "scored 14 new inbound", t: "32m" },
];

function AgentIcon({ tone, running }: { tone: Tone; running: boolean }) {
  return (
    <span
      className={cn(
        "relative grid size-11 shrink-0 place-items-center rounded-full",
        running ? "bg-good text-ink" : "bg-surface-2 text-muted-foreground",
      )}
    >
      <Bot className="size-5" strokeWidth={2} />
      <StatusDot tone={tone} pulse={running} className="absolute -right-0.5 -top-0.5 size-2.5 ring-2 ring-background" />
    </span>
  );
}

export default function DashboardPage() {
  return (
    <div className="px-5 py-8 sm:px-7 sm:py-10">
      {/* Header + live signage */}
      <PageHeader
        eyebrow="LinkedIn inbound triage"
        title="Dashboard"
        right={<LiveSignage stamp="run · 0042 · 3:42 PM" />}
      />

      {/* Lead filters — each in its own signal color; click to select */}
      <div className="mt-6">
        <LeadFilters />
      </div>

      {/* Pipeline hero (dot-grid texture) + stat squares */}
      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div className={cn(PANEL, LIFT, "relative overflow-hidden p-7 md:col-span-2 lg:row-span-2")}>
          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <p className="eyebrow text-muted-foreground">Total revenue pipeline</p>
              <span className="eyebrow text-muted-foreground">↳ 16/9 · live</span>
            </div>
            <p className="num mt-5 font-display text-6xl leading-none sm:text-7xl">$847K</p>
            <p className="mt-4 text-foreground">Across 47 active opportunities</p>
            {/* Neutral metric chips — informational, NOT signals (color is reserved
                for real status/notification events, per the signal grammar). */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className={METRIC_CHIP}>
                <ArrowUpRight className="size-3 text-muted-foreground" strokeWidth={2.5} /> +23% MoM
              </span>
              <span className={METRIC_CHIP}>14s avg handle</span>
              <span className={METRIC_CHIP}>3 need attention</span>
            </div>
          </div>
        </div>
        {STATS.map((s) => (
          <div key={s.label} className={cn(PANEL, LIFT, "p-5")}>
            <div className="flex items-center justify-between gap-2">
              <p className="eyebrow text-muted-foreground">{s.label}</p>
              <StatusDot tone={s.tone} />
            </div>
            <p className="num mt-3 font-display text-4xl leading-none">{s.value}</p>
            <p className="num mt-2 font-mono text-xs text-foreground">{s.delta}</p>
          </div>
        ))}
      </div>

      {/* Live agent activity — the PANEL is a static container; the agent pills are interactive */}
      <div className={cn(PANEL, "mt-3 p-6")}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <IconTile tone="good">
              <Sparkles className="size-[18px]" strokeWidth={1.75} />
            </IconTile>
            <h2 className="font-display text-2xl">Live agent activity</h2>
          </div>
          <span className="eyebrow text-foreground">4 deployed · 2 running</span>
        </div>
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {AGENTS.map((a) => (
            <li key={a.name}>
              <button
                type="button"
                className={cn(
                  "flex w-full items-center gap-4 rounded-xl border p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                  AGENT_SURFACE[a.tone],
                  LIFT,
                )}
              >
                <AgentIcon tone={a.tone} running={a.running} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-foreground">{a.name}</p>
                    <Badge tone={a.tone} dot pulse={a.running}>
                      {a.status}
                    </Badge>
                  </div>
                  <p className="mt-0.5 truncate font-mono text-xs text-foreground">{a.note}</p>
                  <MiniBar value={a.load} tone={a.tone} className="mt-2.5" />
                </div>
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="dashed mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-mono text-xs uppercase tracking-[0.13em] text-foreground transition-colors hover:border-foreground/40 hover:bg-surface/50"
        >
          <Plus className="size-4" strokeWidth={1.75} /> Deploy a new agent
        </button>
      </div>

      {/* Charts */}
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <div className={cn(PANEL, "p-6")}>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-2xl">Weekly lead activity</h2>
            <span className="eyebrow text-muted-foreground">last 7d</span>
          </div>
          <div className="mt-4">
            <WeeklyLeadsChart />
          </div>
        </div>
        <div className={cn(PANEL, "p-6")}>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-2xl">Avg response time</h2>
            <span className="eyebrow text-muted-foreground">minutes</span>
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
              <li key={a.name} className={cn("surface rounded-xl p-4", LIFT)}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Badge tone={a.tone} dot>
                      {a.tier}
                    </Badge>
                    <p className="truncate font-medium text-foreground">{a.name}</p>
                    <span className="hidden shrink-0 text-sm text-muted-foreground sm:inline">· {a.type}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="num font-mono text-xs text-muted-foreground">ICP {a.icp}</span>
                    <span className="num font-mono text-xs text-muted-foreground">{a.t}</span>
                  </div>
                </div>
                <p className="mt-1.5 text-sm text-foreground">{a.note}</p>
              </li>
            ))}
          </ul>
          <ShortcutsTip className="mt-4" />
        </div>
        <div className={cn(PANEL, "p-6")}>
          <h2 className="font-display text-2xl">Recent activity</h2>
          <ul className="mt-5 grid gap-2.5">
            {ACTIVITY.map((a) => (
              <li key={a.what} className={cn("surface flex items-start gap-3 rounded-xl px-4 py-3", LIFT)}>
                <StatusDot tone={a.tone} className="mt-[5px]" />
                <div className="min-w-0 flex-1">
                  <span className="eyebrow text-foreground">{a.label}</span>
                  <p className="mt-1 truncate text-sm text-foreground">
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
