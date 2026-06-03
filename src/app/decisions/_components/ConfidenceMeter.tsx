/**
 * ConfidenceMeter — lime bar + percentage when confidence is known,
 * muted "not estimated" pill when null.
 *
 * Server-safe.
 */

interface Props {
  value: number | null;
}

export function ConfidenceMeter({ value }: Props) {
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
      <span className="font-bold uppercase tracking-wider text-muted">
        Confidence
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
