"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tone } from "./accents";

const FILTERS: { label: string; count: number; tone: Tone }[] = [
  { label: "All leads", count: 47, tone: "good" },
  { label: "Hot", count: 18, tone: "hot" },
  { label: "Warm", count: 12, tone: "warm" },
  { label: "Cold", count: 17, tone: "cold" },
  { label: "Agent-drafted", count: 7, tone: "pending" },
];

// Inactive: faded DASHED border in the filter's OWN color (white text). Hover
// fills with that color. Full-literal maps so Tailwind keeps the classes.
const FADED: Record<Tone, string> = {
  good: "border-dashed border-good/45 hover:border-good/70 hover:bg-good/15",
  hot: "border-dashed border-hot/45 hover:border-hot/70 hover:bg-hot/16",
  warm: "border-dashed border-warm/50 hover:border-warm/70 hover:bg-warm/16",
  cold: "border-dashed border-cold/45 hover:border-cold/70 hover:bg-cold/15",
  bad: "border-dashed border-bad/50 hover:border-bad/70 hover:bg-bad/16",
  pending: "border-dashed border-pending/55 hover:border-pending/75 hover:bg-pending/16",
  muted: "border-dashed border-border-strong hover:bg-surface-2",
};

// Active (clicked): solid full color + a stronger pop (lift + weighted shadow + edge glow).
const ACTIVE: Record<Tone, string> = {
  good: "border-good/75 bg-good/20 glow-edge-good",
  hot: "border-hot/75 bg-hot/20 glow-edge-hot",
  warm: "border-warm/75 bg-warm/20 glow-edge-warm",
  cold: "border-cold/75 bg-cold/20 glow-edge-cold",
  bad: "border-bad/75 bg-bad/20 glow-edge-bad",
  pending: "border-pending/75 bg-pending/22 glow-edge-pending",
  muted: "border-border-strong bg-surface-2",
};

export function LeadFilters({ className }: { className?: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Filter className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
      {FILTERS.map((f, i) => {
        const on = i === active;
        return (
          <button
            key={f.label}
            type="button"
            aria-pressed={on}
            onClick={() => setActive(i)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground transition-[transform,box-shadow,background-color,border-color] duration-200 [transition-timing-function:var(--ease-snap)]",
              on ? cn("-translate-y-0.5 shadow-[var(--lift-shadow)]", ACTIVE[f.tone]) : FADED[f.tone],
            )}
          >
            {f.label}
            <span className="num opacity-75">· {f.count}</span>
          </button>
        );
      })}
    </div>
  );
}
