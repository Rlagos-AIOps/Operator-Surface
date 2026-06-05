interface Props {
  label: string;
  value: number | string;
  eyebrow?: string;
  /** Optional one-line caption shown under the value. */
  caption?: string;
}

/**
 * Compact metric chip for the Galileo-this-week ROI strip.
 *
 * Uses the same surface treatment as the KPI cards in /brief so the
 * dashboard reads as part of the same product, not a new surface.
 */
export function MetricTile({ label, value, eyebrow = "This week", caption }: Props) {
  return (
    <div className="overflow-visible rounded-lg border border-surface-edge bg-surface p-s5 shadow-e1">
      <p className="font-mono text-micro font-bold uppercase tracking-[0.14em] text-muted">
        {eyebrow}
      </p>
      <p className="mt-s2 font-serif text-paper tabular" style={{ fontSize: 56, lineHeight: 1 }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p className="mt-s3 text-small text-paper/85">{label}</p>
      {caption && <p className="mt-s1 text-micro text-muted">{caption}</p>}
    </div>
  );
}
