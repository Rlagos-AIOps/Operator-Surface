"use client";

import Link from "next/link";
import { Cpu, CircleDot, Inbox, LineChart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { StatusDot, type Tone } from "@/components/site/accents";
import { LIFT, PANEL } from "@/components/site/surfaces";
import { EmptyState, Skeleton, type SurfaceState } from "@/components/site/states";

// Pipeline broken down by temperature + drafts pending (mock).
const BREAKDOWN: { label: string; value: number; tone: Tone; pct: number; bar: string }[] = [
  { label: "Hot", value: 11, tone: "hot", pct: 26, bar: "bg-hot" },
  { label: "Warm", value: 18, tone: "warm", pct: 43, bar: "bg-warm" },
  { label: "Cold", value: 13, tone: "cold", pct: 31, bar: "bg-cold" },
];
const DRAFTS = 7;

const PIPELINE_STATS = [
  { label: "pipeline value", value: "$612K" },
  { label: "conversion", value: "34%" },
  { label: "new this wk", value: "+12" },
];

// A real stats box — each stat gets its due, not one big number.
const RESPONSE_STATS = [
  { label: "Avg response", value: "2h 14m" },
  { label: "vs last week", value: "↓ 38%" },
  { label: "Replied today", value: "18" },
  { label: "Within SLA", value: "96%" },
];

// Cross-surface pills — priority-ordered: low-priority drop first on narrow
// viewports, "1 at risk" (clients) always stays.
const PILLS: {
  id: string;
  label: string;
  icon: typeof Cpu;
  href: string | null;
  note: string;
  tone: Tone | null;
  vis: string;
}[] = [
  { id: "agents", label: "Agents", icon: Cpu, href: "/agents", note: "1 error · 4 agents", tone: "bad", vis: "hidden sm:flex" },
  { id: "clients", label: "Clients", icon: CircleDot, href: "/clients", note: "1 at risk · 6 active", tone: "bad", vis: "flex" },
  { id: "leads", label: "Leads", icon: Inbox, href: "/leads", note: "3 to call today", tone: null, vis: "hidden md:flex" },
  { id: "roi", label: "ROI", icon: LineChart, href: "/roi", note: "$4.2k/mo · 3.2×", tone: null, vis: "hidden lg:flex" },
];

const PILL_CLASS =
  "dot-grid min-w-0 flex-1 items-center gap-2.5 rounded-full border border-[color:var(--surface-edge)] bg-card px-4 py-2.5 shadow-[var(--shadow-1)] hover:border-good/50";

function PillBody({ pill }: { pill: (typeof PILLS)[number] }) {
  const Icon = pill.icon;
  return (
    <>
      <Icon className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
      <span className="shrink-0 text-sm font-medium text-foreground">{pill.label}</span>
      <span className="num ml-auto truncate font-mono text-xs text-muted-foreground">{pill.note}</span>
      {pill.tone && <StatusDot tone={pill.tone} pulse className="shrink-0" />}
    </>
  );
}

export function MetricRow({
  state = "ready",
  className,
  loadingState,
  emptyState,
}: {
  state?: SurfaceState;
  className?: string;
  loadingState?: ReactNode;
  emptyState?: ReactNode;
} = {}) {
  if (state === "loading") {
    return (
      <div className={cn("grid gap-3 px-7 py-5", className)}>
        {loadingState ?? (
          <div className="grid gap-3 lg:grid-cols-[1.7fr_1fr]">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        )}
      </div>
    );
  }
  if (state === "empty") {
    return (
      <div className={cn("grid gap-3 px-7 py-5", className)}>
        {emptyState ?? (
          <EmptyState
            title="No metrics yet"
            hint="Pipeline numbers appear once leads start flowing."
          />
        )}
      </div>
    );
  }
  return (
    <div className={cn("grid gap-3 px-7 py-5", className)}>
      <div className="grid gap-3 lg:grid-cols-[1.7fr_1fr]">
        {/* Pipeline — total + temperature distribution + key stats */}
        <div className={cn(PANEL, "p-5")}>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              <p className="eyebrow text-muted-foreground">Pipeline</p>
              <p className="num mt-2 font-display text-5xl leading-none">42</p>
              <p className="num mt-1.5 font-mono text-xs text-muted-foreground">active threads</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
              {BREAKDOWN.map((b) => (
                <div key={b.label} className="flex items-center gap-2">
                  <StatusDot tone={b.tone} />
                  <span className="num font-display text-2xl leading-none">{b.value}</span>
                  <span className="eyebrow text-muted-foreground">{b.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <StatusDot tone="pending" />
                <span className="num font-display text-2xl leading-none">{DRAFTS}</span>
                <span className="eyebrow text-muted-foreground">Drafts</span>
              </div>
            </div>
          </div>

          {/* temperature distribution */}
          <div className="mt-5 flex h-2 overflow-hidden rounded-full">
            {BREAKDOWN.map((b) => (
              <div key={b.label} className={b.bar} style={{ width: `${b.pct}%` }} />
            ))}
          </div>

          {/* key stats */}
          <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-[color:var(--surface-edge)] pt-4">
            {PIPELINE_STATS.map((s) => (
              <div key={s.label} className="flex items-baseline gap-2">
                <span className="num font-display text-xl leading-none">{s.value}</span>
                <span className="eyebrow text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Response — a proper stats grid */}
        <div className={cn(PANEL, "p-5")}>
          <p className="eyebrow text-muted-foreground">Response</p>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-5">
            {RESPONSE_STATS.map((s) => (
              <div key={s.label}>
                <p className="num font-display text-[26px] leading-none">{s.value}</p>
                <p className="eyebrow mt-1.5 text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cross-surface pills */}
      <div className="flex flex-wrap gap-3">
        {PILLS.map((pill) =>
          pill.href ? (
            <Link key={pill.id} href={pill.href} className={cn(PILL_CLASS, LIFT, pill.vis)}>
              <PillBody pill={pill} />
            </Link>
          ) : (
            <button
              key={pill.id}
              type="button"
              onClick={() => toast(`${pill.label} — coming soon`)}
              className={cn(PILL_CLASS, LIFT, pill.vis)}
            >
              <PillBody pill={pill} />
            </button>
          ),
        )}
      </div>
    </div>
  );
}
