"use client";

import { useMemo, useState } from "react";
import { ApprovalCard } from "./ApprovalCard";
import { EmptyState } from "./EmptyState";
import type { ApprovalRow } from "./types";

interface Props {
  pending: ApprovalRow[];
}

export function ApprovalQueue({ pending }: Props) {
  const [filter, setFilter] = useState<string>("all");

  // Build action_type counts for the chip badges.
  const counts = useMemo(() => {
    const out: Record<string, number> = { all: pending.length };
    for (const a of pending) {
      out[a.action_type] = (out[a.action_type] ?? 0) + 1;
    }
    return out;
  }, [pending]);

  const visible = useMemo(() => {
    if (filter === "all") return pending;
    return pending.filter((a) => a.action_type === filter);
  }, [filter, pending]);

  // Ordered, deduplicated list of action types present in the data.
  const actionTypes = useMemo(() => {
    const seen = new Set<string>();
    for (const a of pending) seen.add(a.action_type);
    return Array.from(seen);
  }, [pending]);

  return (
    <>
      {/* Filter chips */}
      <div className="mb-s5 flex flex-wrap gap-s2">
        <Chip
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label="All"
          count={counts.all}
        />
        {actionTypes.map((t) => (
          <Chip
            key={t}
            active={filter === t}
            onClick={() => setFilter(t)}
            label={t.replace(/_/g, " ")}
            count={counts[t] ?? 0}
          />
        ))}
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-s4">
        {visible.length === 0 ? (
          <EmptyState />
        ) : (
          visible.map((a) => <ApprovalCard key={a.id} approval={a} />)
        )}
      </div>
    </>
  );
}

function Chip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-s2 rounded-pill px-s4 py-s2 text-small font-semibold transition-colors duration-fast ${
        active
          ? "bg-primary text-primary-foreground"
          : "border border-border/15 text-foreground hover:bg-card/5"
      }`}
    >
      <span className="capitalize">{label}</span>
      <span className={`tabular ${active ? "opacity-70" : "opacity-60"}`}>
        {count}
      </span>
    </button>
  );
}
