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

export type Tone = "lime" | "volt" | "amber" | "cyan" | "red" | "muted";

const DOT_BG: Record<Tone, string> = {
  lime: "bg-primary",
  volt: "bg-volt",
  amber: "bg-amber",
  cyan: "bg-cyan",
  red: "bg-destructive",
  muted: "bg-muted-foreground",
};

const BADGE_TONE: Record<Tone, string> = {
  lime: "text-primary border-primary/45 bg-primary/10",
  volt: "text-volt border-volt/45 bg-volt/10",
  amber: "text-amber border-amber/45 bg-amber/10",
  cyan: "text-cyan border-cyan/45 bg-cyan/10",
  red: "text-destructive border-destructive/45 bg-destructive/10",
  muted: "text-muted-foreground border-border-strong bg-transparent",
};

export const TEXT_TONE: Record<Tone, string> = {
  lime: "text-primary",
  volt: "text-volt",
  amber: "text-amber",
  cyan: "text-cyan",
  red: "text-destructive",
  muted: "text-muted-foreground",
};

/* A leading status dot, optionally pulsing (running agents). */
export function StatusDot({
  tone = "lime",
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
        <span className={cn("absolute inset-0 animate-ping rounded-full opacity-60", DOT_BG[tone])} aria-hidden />
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
  children,
  className,
}: {
  tone?: Tone;
  dot?: boolean;
  pulse?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase leading-none tracking-[0.13em]",
        BADGE_TONE[tone],
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
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors",
        active
          ? "border-primary/55 bg-primary/10 text-primary"
          : "border-border-strong text-muted-foreground hover:border-foreground/30 hover:text-foreground",
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
  tone = "lime",
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
