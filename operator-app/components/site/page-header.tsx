import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Badge, StatusDot, type Tone } from "@/components/site/accents";
import { METRIC_CHIP } from "@/components/site/surfaces";

// The one page header across the whole app — harvested from the dashboard
// (the quality-bar reference). Bright eyebrow + display title + optional
// subtitle/metric chips, with a right slot for either live signage (instrument
// pages) or action buttons (management pages).
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  chips,
  right,
  className,
}: {
  eyebrow: string;
  title: string;
  subtitle?: ReactNode;
  chips?: Array<{ label: string; tone?: Tone }>;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        <p className="eyebrow text-foreground">{eyebrow}</p>
        <h1 className="mt-2 text-4xl sm:text-5xl">{title}</h1>
        {subtitle ? <p className="mt-2 text-base leading-relaxed text-muted-foreground">{subtitle}</p> : null}
        {chips && chips.length > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {chips.map((c) =>
              c.tone ? (
                // A state signal (e.g. "1 at risk") — wears its tone so it pops
                // at a glance, matching the same-tone badge on the cards below.
                <Badge key={c.label} tone={c.tone} dot className="px-3 py-1 text-[11px]">
                  {c.label}
                </Badge>
              ) : (
                // A neutral count — informational, no signal color.
                <span key={c.label} className={METRIC_CHIP}>
                  {c.label}
                </span>
              ),
            )}
          </div>
        ) : null}
      </div>
      {right ? <div className="flex flex-wrap items-center gap-2.5">{right}</div> : null}
    </div>
  );
}

// The dashboard's live-instrument signage: an "agent online" pulse pill + an
// optional mono run/sync stamp. The default header-right for instrument pages
// (dashboard, pipeline, analytics) — management pages pass action buttons instead.
export function LiveSignage({
  label = "agent online",
  stamp,
}: {
  label?: string;
  stamp?: string;
}) {
  return (
    <>
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5">
        <StatusDot tone="good" pulse />
        <span className="eyebrow text-foreground">{label}</span>
      </span>
      {stamp ? (
        <span className="num glass rounded-full px-3.5 py-2 font-mono text-xs text-foreground">{stamp}</span>
      ) : null}
    </>
  );
}
