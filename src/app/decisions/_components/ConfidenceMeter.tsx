import { InfoIcon } from "@/app/_components/InfoIcon";
import type { TooltipKey } from "@/lib/copy/tooltips";

/**
 * ConfidenceMeter — lime bar + percentage when confidence is known,
 * muted "not estimated" pill when null.
 *
 * Server-safe.
 */

interface Props {
  value: number | null;
  /** Tooltip variant — at-risk, upsell, or generic decision. */
  tooltipKey?: TooltipKey;
}

export function ConfidenceMeter({ value, tooltipKey = "decisionConfidence" }: Props) {
  if (value == null) {
    return (
      <span
        className="inline-flex items-center rounded-pill border border-paper/15 px-s3 py-[3px] text-micro font-bold uppercase tracking-wider text-muted"
        title="Agent did not estimate a confidence for this decision"
      >
        not estimated
      </span>
    );
  }
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return (
    <span className="inline-flex items-center gap-s2 text-micro">
      <span className="inline-flex items-center gap-s1 font-bold uppercase tracking-wider text-muted">
        Confidence
        <InfoIcon tooltipKey={tooltipKey} />
      </span>
      <span
        className="h-1 w-16 overflow-hidden rounded-pill bg-paper/10"
        role="presentation"
        aria-hidden
      >
        <span
          className="block h-full bg-lime"
          style={{ width: `${pct}%` }}
        />
      </span>
      <span className="tabular text-paper">{pct}%</span>
    </span>
  );
}
