import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import type { Kpi } from "./types";

interface Props {
  kpis: Kpi[];
}

export function KpiRow({ kpis }: Props) {
  if (kpis.length === 0) return null;
  return (
    <section className="mb-s6 grid grid-cols-1 gap-s4 sm:grid-cols-2 md:grid-cols-4">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.label} kpi={kpi} />
      ))}
    </section>
  );
}

function KpiCard({ kpi }: { kpi: Kpi }) {
  return (
    <div className="rounded-lg border border-surface-edge bg-surface p-s5 shadow-e1">
      <p className="eyebrow text-muted">{kpi.label}</p>
      <p className="mt-s2 font-serif text-h2 text-paper tabular">
        {typeof kpi.value === "number"
          ? kpi.value.toLocaleString()
          : kpi.value}
      </p>
      <TrendBadge kpi={kpi} />
    </div>
  );
}

function TrendBadge({ kpi }: { kpi: Kpi }) {
  const trend = kpi.trend ?? "flat";
  const delta = kpi.delta;
  if (trend === "up") {
    return (
      <p className="mt-s2 flex items-center gap-s1 text-micro text-lime">
        <ArrowUp className="h-3 w-3" strokeWidth={2.5} />
        <span className="font-mono tabular font-semibold">
          {formatDelta(delta, "+")}
        </span>
      </p>
    );
  }
  if (trend === "down") {
    return (
      <p className="mt-s2 flex items-center gap-s1 text-micro text-muted">
        <ArrowDown className="h-3 w-3" strokeWidth={2.5} />
        <span className="font-mono tabular font-semibold">
          {formatDelta(delta, "")}
        </span>
      </p>
    );
  }
  return (
    <p className="mt-s2 flex items-center gap-s1 text-micro text-muted">
      <Minus className="h-3 w-3" strokeWidth={2.5} />
      <span className="font-mono tabular font-semibold">flat</span>
    </p>
  );
}

function formatDelta(d: number | string | null | undefined, prefix: string): string {
  if (d === null || d === undefined) return prefix.trim() || "—";
  if (typeof d === "number") {
    if (d === 0) return "0";
    return `${prefix}${d}`;
  }
  return String(d);
}
