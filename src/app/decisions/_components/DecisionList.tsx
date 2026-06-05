"use client";

import { useMemo, useState } from "react";
import { DecisionCard } from "./DecisionCard";
import { EmptyState } from "./EmptyState";
import type { DecisionRow } from "./types";

interface Props {
  decisions: DecisionRow[];
}

/**
 * Account-filtered decision list.
 *
 * When an account is selected, the page swaps to "story mode" with a
 * lime accent strip — the demo moment for "here's everything we
 * figured out about $ACCOUNT_NAME."
 */
export function DecisionList({ decisions }: Props) {
  const [accountFilter, setAccountFilter] = useState<string>("all");

  // ─────────────────────────────────────────────────────────────────
  // Derived: accounts present in the data
  // ─────────────────────────────────────────────────────────────────

  const accounts = useMemo(() => {
    const seen = new Map<string, { id: string; name: string; count: number }>();
    for (const d of decisions) {
      const meta = (d.metadata ?? {}) as { account_name?: string };
      const id = d.source_record_id;
      const name = meta.account_name ?? id;
      const prev = seen.get(id);
      if (prev) prev.count += 1;
      else seen.set(id, { id, name, count: 1 });
    }
    return Array.from(seen.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [decisions]);

  // ─────────────────────────────────────────────────────────────────
  // Visible list
  // ─────────────────────────────────────────────────────────────────

  const visible = useMemo(() => {
    if (accountFilter === "all") return decisions;
    return decisions.filter((d) => d.source_record_id === accountFilter);
  }, [decisions, accountFilter]);

  const selectedAccount =
    accountFilter !== "all"
      ? accounts.find((a) => a.id === accountFilter) ?? null
      : null;

  // ─────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Account filter row */}
      <div className="mb-s5 flex flex-wrap items-center gap-s2">
        <span className="mr-s2 text-micro font-bold uppercase tracking-wider text-muted-foreground">
          Account
        </span>
        <Chip
          active={accountFilter === "all"}
          onClick={() => setAccountFilter("all")}
          label="All"
          count={decisions.length}
        />
        {accounts.map((a) => (
          <Chip
            key={a.id}
            active={accountFilter === a.id}
            onClick={() => setAccountFilter(a.id)}
            label={a.name}
            count={a.count}
          />
        ))}
      </div>

      {/* Story-mode caption when an account is selected */}
      {selectedAccount && (
        <div className="mb-s5 rounded-md border-l-4 border-primary bg-card/40 px-s5 py-s4">
          <p className="eyebrow">Account focus</p>
          <p className="mt-s1 font-serif text-h3 text-foreground">
            Decision story · {selectedAccount.name}
          </p>
          <p className="mt-s1 text-small text-muted-foreground">
            {visible.length}{" "}
            {visible.length === 1 ? "decision" : "decisions"}, newest first.
          </p>
        </div>
      )}

      {/* Cards */}
      <div className="flex flex-col gap-s4">
        {visible.length === 0 ? (
          <EmptyState />
        ) : (
          visible.map((d) => <DecisionCard key={d.id} decision={d} />)
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
      className={`inline-flex items-center gap-s2 rounded-pill px-s3 py-[6px] text-small font-semibold transition-colors duration-fast ${
        active
          ? "bg-primary text-primary-foreground"
          : "border border-border/15 text-foreground hover:bg-card/5"
      }`}
    >
      <span>{label}</span>
      <span className={`tabular ${active ? "opacity-70" : "opacity-60"}`}>
        {count}
      </span>
    </button>
  );
}
