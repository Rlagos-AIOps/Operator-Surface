import type { SignalEntry } from "./types";

/**
 * SignalTrace — the weighted-signals table that gives Decision Trace
 * its punch. Sorted by weight DESC; unweighted entries (legal per
 * the convention) fall to the bottom rendered with em-dash.
 *
 * Server-safe.
 */

interface Props {
  signals: SignalEntry[];
}

function formatValue(value: unknown): React.ReactNode {
  if (value == null) {
    return <span className="italic text-muted">null</span>;
  }
  if (typeof value === "boolean") {
    return value ? (
      <span className="text-paper">true</span>
    ) : (
      <span className="italic text-muted">false</span>
    );
  }
  if (typeof value === "number") return value.toLocaleString();
  if (typeof value === "string") {
    if (value.length > 80) return value.slice(0, 77) + "…";
    return value;
  }
  return JSON.stringify(value);
}

export function SignalTrace({ signals }: Props) {
  if (!signals || signals.length === 0) return null;

  // Weight DESC. Unweighted signals (weight == null) sort last via -1
  // sentinel so they don't crowd the visible bars.
  const sorted = [...signals].sort((a, b) => {
    const aw = typeof a.weight === "number" ? a.weight : -1;
    const bw = typeof b.weight === "number" ? b.weight : -1;
    return bw - aw;
  });

  return (
    <section className="mt-s5">
      <p className="eyebrow mb-s3">Signals</p>
      <ol className="overflow-hidden rounded-md border border-surface-edge bg-bg-deep/40">
        {sorted.map((s, i) => {
          const weightPct =
            typeof s.weight === "number"
              ? Math.max(0, Math.min(100, Math.round(s.weight * 100)))
              : null;
          return (
            <li
              key={i}
              className={`grid grid-cols-[minmax(0,1fr)_auto_140px] items-center gap-s4 px-s4 py-s3 ${
                i > 0 ? "border-t border-surface-edge/60" : ""
              }`}
            >
              {/* Name + source/note */}
              <div className="min-w-0">
                <p className="font-mono text-small font-medium text-paper">
                  {s.name}
                </p>
                {(s.source || s.note) && (
                  <p className="mt-[2px] truncate text-micro text-muted">
                    {s.source ? (
                      <span className="font-mono">{s.source}</span>
                    ) : (
                      <span className="italic">{s.note}</span>
                    )}
                  </p>
                )}
              </div>

              {/* Value */}
              <div className="font-mono text-small tabular text-right text-paper">
                {formatValue(s.value)}
              </div>

              {/* Weight bar */}
              <div className="flex items-center gap-s2">
                {weightPct != null ? (
                  <>
                    <span
                      className="h-1 flex-1 overflow-hidden rounded-pill bg-paper/10"
                      role="presentation"
                      aria-hidden
                    >
                      <span
                        className="block h-full bg-lime"
                        style={{ width: `${weightPct}%` }}
                      />
                    </span>
                    <span className="text-micro tabular text-muted">
                      {weightPct}%
                    </span>
                  </>
                ) : (
                  <span className="ml-auto text-micro text-muted">—</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
