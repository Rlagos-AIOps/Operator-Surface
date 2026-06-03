import * as React from "react";
import { cn } from "@/lib/utils";
import type { Tone } from "@/components/site/accents";

// State patterns for the agentic-CS surfaces. In an agentic product the empty,
// loading, and (especially) error states ARE the product — agents fail, queue,
// retry, hand off — so these are first-class and customizable. They double as the
// DEFAULT content for the `emptyState` / `loadingState` / `errorState` slots on the
// feature components: a customer re-voices an agent failure by passing their own.
//
// All respect prefers-reduced-motion (the shimmer is killed under `reduce`, both via
// the Tailwind variant here and the global guard in globals.css).

/** Token-driven shimmer block — fills space while data loads. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-[var(--radius-md)] bg-surface-2 motion-reduce:animate-none",
        className,
      )}
    />
  );
}

/** A stack of skeleton rows — a ready-made loading affordance for list surfaces. */
export function SkeletonRows({
  rows = 4,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 px-6 py-5", className)} aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-2.5 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Neutral "nothing here yet" pattern. Voice is customizable via title/hint/action. */
export function EmptyState({
  icon,
  title,
  hint,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  hint?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center gap-2 px-6 py-12 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-1 text-muted-foreground [&_svg]:size-6" aria-hidden="true">
          {icon}
        </div>
      )}
      <p className="font-display text-lg text-foreground">{title}</p>
      {hint && <p className="max-w-[40ch] text-sm text-muted-foreground">{hint}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/**
 * The agentic-failure surface. Retry is first-class; the voice (title/detail) is
 * meant to be re-written per customer. This is a real, customizable touchpoint —
 * how *your* product tells *your* client an agent couldn't finish.
 */
export function ErrorState({
  title = "Something went wrong",
  detail,
  onRetry,
  retryLabel = "Retry",
  tone = "bad",
  className,
}: {
  title?: string;
  detail?: string;
  onRetry?: () => void;
  retryLabel?: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-2 px-6 py-10 text-center",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "mb-1 size-2 rounded-full",
          tone === "bad"
            ? "bg-bad"
            : tone === "warm"
              ? "bg-warm"
              : tone === "hot"
                ? "bg-hot"
                : "bg-pending",
        )}
      />
      <p className="font-display text-lg text-foreground">{title}</p>
      {detail && <p className="max-w-[44ch] text-sm text-muted-foreground">{detail}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-full border border-border-strong/70 px-4 py-1.5 text-[13px] font-medium text-foreground transition-colors duration-200 [transition-timing-function:var(--ease-snap)] hover:border-good/60 hover:bg-foreground/[0.04] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:outline-none"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}

/** Convenience union for the feature-component `state` prop. */
export type SurfaceState = "ready" | "loading" | "empty" | "error";
