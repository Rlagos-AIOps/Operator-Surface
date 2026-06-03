import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* =============================================================
   Accent kit — Lovable's component vocabulary as primitives.
   Color-coded status everywhere: lime (active/hot/shipped),
   volt (agent), amber (warm/queued/warn), cyan (signal/info),
   red (error/blocked), muted (idle/review/archived).
   Harvested live from component-comet-kit.lovable.app/styleguide.

   NOTE: tone→class maps use FULL literal class strings so the
   Tailwind v4 scanner keeps them (never build `text-${tone}`).
   ============================================================= */

// Semantic signal tones — color carries MEANING, never decoration.
//   good = green · hot = orange · warm = yellow · cold = blue · bad = red ·
//   pending = violet (queue/draft/pending) · muted = truly idle/disabled.
export type Tone = "good" | "hot" | "warm" | "cold" | "bad" | "pending" | "muted";

const DOT_BG: Record<Tone, string> = {
  good: "bg-good",
  hot: "bg-hot",
  warm: "bg-warm",
  cold: "bg-cold",
  bad: "bg-bad",
  pending: "bg-pending",
  muted: "bg-muted-foreground",
};

// White text always — the TONE lives on the border + a same-tone background
// tint (Lovable's box construction). Color the element, never the words.
const BADGE_TONE: Record<Tone, string> = {
  good: "text-foreground border-good/60 bg-good/15",
  hot: "text-foreground border-hot/65 bg-hot/16",
  warm: "text-foreground border-warm/65 bg-warm/16",
  cold: "text-foreground border-cold/60 bg-cold/15",
  bad: "text-foreground border-bad/70 bg-bad/18",
  pending: "text-foreground border-pending/65 bg-pending/16",
  muted: "text-muted-foreground border-border-strong bg-surface-2",
};

const EDGE_GLOW: Record<Tone, string> = {
  good: "glow-edge-good",
  hot: "glow-edge-hot",
  warm: "glow-edge-warm",
  cold: "glow-edge-cold",
  bad: "glow-edge-bad",
  pending: "glow-edge-pending",
  muted: "",
};

export const TEXT_TONE: Record<Tone, string> = {
  good: "text-good",
  hot: "text-hot",
  warm: "text-warm",
  cold: "text-cold",
  bad: "text-bad",
  pending: "text-pending",
  muted: "text-muted-foreground",
};

/* A leading status dot, optionally pulsing (running agents). */
export function StatusDot({
  tone = "good",
  pulse = false,
  className,
}: {
  tone?: Tone;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-flex size-2 shrink-0 rounded-full", DOT_BG[tone], className)}>
      {pulse && (
        <span className={cn("absolute inset-0 animate-ping rounded-full opacity-50", DOT_BG[tone])} aria-hidden />
      )}
    </span>
  );
}

/* Outline status / tier badge — mono uppercase, color-matched.
   Covers SHIPPED·REVIEW·SCOPING·BLOCKED and HOT·WARM·COLD (dot). */
export function Badge({
  tone = "muted",
  dot = false,
  pulse = false,
  glow = false,
  children,
  className,
}: {
  tone?: Tone;
  dot?: boolean;
  pulse?: boolean;
  glow?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase leading-none tracking-[0.13em]",
        BADGE_TONE[tone],
        glow && EDGE_GLOW[tone],
        className,
      )}
    >
      {dot && <StatusDot tone={tone} pulse={pulse} className="size-1.5" />}
      {children}
    </span>
  );
}

/* Filter pill with a `· count` badge — the ALL·124 / HOT·18 row. */
export function Pill({
  active = false,
  count,
  children,
  className,
}: {
  active?: boolean;
  count?: number | string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        // Dashed = a clickable filter. White text always; tone on the border +
        // same-tone bg fill. Active = solid-feel lime box with a CONTAINED edge glow.
        "inline-flex items-center gap-1.5 rounded-full border border-dashed px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground transition-colors",
        active
          ? "glow-edge-good border-good/75 bg-good/16"
          : "border-border-strong bg-surface/50 hover:border-foreground/45 hover:bg-surface-2",
        className,
      )}
    >
      {children}
      {count != null && <span className="num opacity-70">· {count}</span>}
    </button>
  );
}

/* Keyboard key cap — nav signals (⌘K, J, K, R, E). */
export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return <kbd className={cn("kbd", className)}>{children}</kbd>;
}

/* Thin-stroke icon in an outlined square tile (the proto's icon set). */
export function IconTile({
  children,
  tone,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-surface text-muted-foreground",
        tone && TEXT_TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* Color-matched mini progress bar (RUNNING/QUEUED load meters). */
export function MiniBar({
  value,
  tone = "good",
  className,
}: {
  value: number;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-2", className)}>
      <div
        className={cn("h-full origin-left animate-bar-load rounded-full", DOT_BG[tone])}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
