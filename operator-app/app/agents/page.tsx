"use client";

import { toast } from "sonner";
import { Cpu, Pause, Play, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge, MiniBar, StatusDot, type Tone } from "@/components/site/accents";
import { PageHeader } from "@/components/site/page-header";
import { BTN_GHOST, BTN_PRIMARY, PANEL } from "@/components/site/surfaces";

const AGENTS = [
  { name: "inbound-triage", state: "running", last: "2m ago", next: "continuous", load: 72 },
  { name: "proposal-writer", state: "idle", last: "1h ago", next: "on demand", load: 0 },
  { name: "roi-calculator", state: "queued", last: "18m ago", next: "in 4m", load: 24 },
  { name: "onboarding-cs", state: "error", last: "32m ago", next: "paused", load: 8 },
];

const STATE: Record<string, { label: string; tone: Tone; live: boolean }> = {
  running: { label: "Running", tone: "good", live: true },
  idle: { label: "Idle", tone: "muted", live: false },
  queued: { label: "Queued", tone: "pending", live: false },
  error: { label: "Error", tone: "bad", live: false },
};

// Long-view gantt of agent load over the last 12h — one track per agent;
// colored segments are activity windows (green active · luminous queued ·
// red errored), the right edge is "now".
const LOAD_TONE = { good: "bg-good", pending: "bg-pending", bad: "bg-bad" } as const;

const TIMELINE: { name: string; segments: { start: number; width: number; tone: keyof typeof LOAD_TONE }[] }[] = [
  { name: "inbound-triage", segments: [{ start: 2, width: 22, tone: "good" }, { start: 30, width: 26, tone: "good" }, { start: 62, width: 36, tone: "good" }] },
  { name: "proposal-writer", segments: [{ start: 8, width: 11, tone: "good" }, { start: 34, width: 8, tone: "good" }] },
  { name: "roi-calculator", segments: [{ start: 12, width: 17, tone: "good" }, { start: 45, width: 15, tone: "good" }, { start: 90, width: 8, tone: "pending" }] },
  { name: "onboarding-cs", segments: [{ start: 6, width: 23, tone: "good" }, { start: 43, width: 17, tone: "good" }, { start: 93, width: 5, tone: "bad" }] },
];

const AXIS = ["12h", "9h", "6h", "3h", "now"];

// Intent tiers + scoring factors — codifies how the agents rank every lead.
const TIERS: { label: string; tone: Tone; range: string; desc: string }[] = [
  { label: "Hot", tone: "hot", range: "80–100", desc: "Decision-maker, concrete pain, urgency. Reply within the hour." },
  { label: "Warm", tone: "warm", range: "50–79", desc: "Real interest, no deadline. Reply thoughtfully — no rush." },
  { label: "Cold", tone: "cold", range: "0–49", desc: "Low buying signal. Nurture with value, don't push a call." },
];

const TIER_GLOW: Record<string, string> = {
  hot: "glow-edge-hot border-hot/40",
  warm: "glow-edge-warm border-warm/40",
  cold: "glow-edge-cold border-cold/40",
};

const FACTORS = [
  { label: "Persona match", weight: 25 },
  { label: "Concrete pain", weight: 25 },
  { label: "Urgency / deadline", weight: 20 },
  { label: "Decision-maker", weight: 20 },
  { label: "Engagement", weight: 10 },
];

function LoadTimeline() {
  return (
    <div className={cn(PANEL, "mt-8 p-6")}>
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow text-muted-foreground">Load · last 12h</p>
        <div className="flex items-center gap-3.5">
          {(["good", "pending", "bad"] as const).map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <span className={cn("size-1.5 rounded-full", LOAD_TONE[t])} />
              <span className="eyebrow text-muted-foreground">
                {t === "good" ? "active" : t === "pending" ? "queued" : "error"}
              </span>
            </span>
          ))}
        </div>
      </div>
      <div className="mt-5 grid gap-2.5">
        {TIMELINE.map((row) => (
          <div key={row.name} className="flex items-center gap-3">
            <span className="w-32 shrink-0 truncate font-mono text-xs text-foreground">{row.name}</span>
            <div className="relative h-7 flex-1 overflow-hidden rounded-lg bg-surface-2">
              {row.segments.map((s, i) => (
                <span
                  key={i}
                  className={cn("absolute inset-y-1 rounded-[4px]", LOAD_TONE[s.tone])}
                  style={{ left: `${s.start}%`, width: `${s.width}%` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex justify-between pl-[8.75rem]">
        {AXIS.map((t) => (
          <span key={t} className="num font-mono text-[10px] text-muted-foreground">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AgentsPage() {
  const running = AGENTS.filter((a) => a.state === "running").length;
  const errored = AGENTS.filter((a) => a.state === "error").length;
  const chips: { label: string; tone?: Tone }[] = [
    { label: `${AGENTS.length} agents` },
    { label: `${running} running`, tone: "good" },
  ];
  if (errored) chips.push({ label: `${errored} error${errored === 1 ? "" : "s"}`, tone: "bad" });

  return (
    <div className="px-5 py-8 sm:px-7 sm:py-10">
      <PageHeader
        eyebrow="Agent control room"
        title="Agents"
        subtitle={
          <span className="inline-flex items-center gap-2">
            <StatusDot tone={errored ? "bad" : "good"} pulse={!!errored} className="transition-colors" />
            Live load
          </span>
        }
        chips={chips}
        right={
          <>
            <button
              type="button"
              onClick={() => toast("All agents paused")}
              className={cn(BTN_GHOST, "px-4 py-2 text-sm")}
            >
              <Pause className="size-4" strokeWidth={1.75} />
              Pause all
            </button>
            <button
              type="button"
              onClick={() => toast("New agent — choose a template")}
              className={cn(BTN_PRIMARY, "px-4 py-2 text-sm")}
            >
              <Plus className="size-4" strokeWidth={2} />
              New agent
            </button>
          </>
        }
      />

      <LoadTimeline />
      <ul className="mt-4 grid gap-3 lg:grid-cols-2 2xl:grid-cols-4">
        {AGENTS.map((a) => {
          const s = STATE[a.state];
          return (
            <li key={a.name} className={cn(PANEL, "p-6")}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "relative grid size-11 shrink-0 place-items-center rounded-full",
                      s.live ? "bg-good text-ink" : "bg-surface-2 text-muted-foreground",
                    )}
                  >
                    <Cpu className="size-5" strokeWidth={2} />
                    <StatusDot tone={s.tone} pulse={s.live} className="absolute -right-0.5 -top-0.5 size-2.5 ring-2 ring-background" />
                  </span>
                  <div>
                    <p className="font-mono text-base font-medium text-foreground">{a.name}</p>
                    <p className="num mt-0.5 text-xs text-muted-foreground">
                      Last run {a.last} · Next {a.next}
                    </p>
                  </div>
                </div>
                <Badge tone={s.tone} dot pulse={s.live}>
                  {s.label}
                </Badge>
              </div>

              {/* Load meter */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="eyebrow text-muted-foreground">Load</span>
                  <span className="num text-foreground">{a.load}%</span>
                </div>
                <MiniBar value={a.load} tone={s.tone} className="mt-2 h-2" />
              </div>

              <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => toast(`${a.name} — run started`)}
                  className={cn(BTN_PRIMARY, "px-3.5 py-1.5 text-xs")}
                >
                  <Play className="size-3.5" strokeWidth={2} />
                  Run now
                </button>
                <button
                  type="button"
                  onClick={() => toast(`${a.name} — paused`)}
                  className={cn(BTN_GHOST, "px-3.5 py-1.5 text-xs")}
                >
                  <Pause className="size-3.5" strokeWidth={1.75} />
                  Pause
                </button>
                <button
                  type="button"
                  onClick={() => toast(`${a.name} — opening run history`)}
                  className={cn(BTN_GHOST, "px-3.5 py-1.5 text-xs")}
                >
                  View runs
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Intent & scoring — codifies how the agents rank leads */}
      <section className={cn(PANEL, "mt-3 p-6")}>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-2xl">Intent &amp; scoring</h2>
          <span className="eyebrow text-muted-foreground">how the agents rank leads</span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {TIERS.map((t) => (
            <div key={t.label} className={cn("rounded-2xl border bg-card p-5", TIER_GLOW[t.tone])}>
              <div className="flex items-center justify-between gap-2">
                <Badge tone={t.tone} dot>
                  {t.label}
                </Badge>
                <span className="num font-mono text-xs text-muted-foreground">{t.range}</span>
              </div>
              <p className="mt-3 text-sm text-foreground">{t.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <p className="eyebrow text-muted-foreground">What feeds the 0–100 score</p>
          <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {FACTORS.map((f) => (
              <li key={f.label} className="flex items-center gap-3">
                <span className="w-36 shrink-0 text-sm text-foreground">{f.label}</span>
                <MiniBar value={f.weight} tone="good" className="h-2" />
                <span className="num w-9 shrink-0 text-right font-mono text-xs text-muted-foreground">
                  {f.weight}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
