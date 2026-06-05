"use client";

import { useMemo, useState } from "react";
import { DecisionCard } from "./DecisionCard";
import { EmptyState } from "./EmptyState";
import type { DecisionRow } from "./types";

interface Props {
  decisions: DecisionRow[];
  /** Pre-select an account filter when arriving via ?account=<id>. */
  initialAccountFilter?: string;
}

/**
 * Two-dimensional client filter: agent + account. Applied AND-wise.
 *
 * When an account is selected, the page swaps to "story mode" with a
 * lime accent strip — the demo moment for "here's everything we
 * figured out about $ACCOUNT_NAME."
 */
export function DecisionList({ decisions, initialAccountFilter }: Props) {
  const [agentFilter, setAgentFilter] = useState<string>("all");
  const [accountFilter, setAccountFilter] = useState<string>(
    initialAccountFilter ?? "all",
  );

  // ─────────────────────────────────────────────────────────────────
  // Derived: agents and accounts present in the data
  // ─────────────────────────────────────────────────────────────────

  const agents = useMemo(() => {
    const seen = new Map<string, string>();
    for (const d of decisions) {
      if (d.agent && !seen.has(d.agent.slug)) {
        seen.set(d.agent.slug, d.agent.name);
      }
    }
    return Array.from(seen.entries()).map(([slug, name]) => ({ slug, name }));
  }, [decisions]);

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

  const agentCounts = useMemo(() => {
    const out: Record<string, number> = { all: decisions.length };
    for (const d of decisions) {
      if (d.agent) out[d.agent.slug] = (out[d.agent.slug] ?? 0) + 1;
    }
    return out;
  }, [decisions]);

  // ─────────────────────────────────────────────────────────────────
  // Visible list — AND of the two filters
  // ─────────────────────────────────────────────────────────────────

  const visible = useMemo(() => {
    return decisions.filter((d) => {
      if (agentFilter !== "all" && d.agent?.slug !== agentFilter) return false;
      if (accountFilter !== "all" && d.source_record_id !== accountFilter) {
        return false;
      }
      return true;
    });
  }, [decisions, agentFilter, accountFilter]);

  const selectedAccount =
    accountFilter !== "all"
      ? accounts.find((a) => a.id === accountFilter) ?? null
      : null;

  // ─────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Agent filter row.
          We drop the count on the Agent "All" chip — the Account row below
          shows the same global total. Two identical "All 19" counters read
          as broken duplication for non-technical CSMs. */}
      <div className="mb-s3 flex flex-wrap items-center gap-s2">
        <span className="mr-s2 text-micro font-bold uppercase tracking-wider text-muted">
          Agent
        </span>
        <Chip
          active={agentFilter === "all"}
          onClick={() => setAgentFilter("all")}
          label="All"
        />
        {agents.map((a) => (
          <Chip
            key={a.slug}
            active={agentFilter === a.slug}
            onClick={() => setAgentFilter(a.slug)}
            label={a.slug}
            count={agentCounts[a.slug] ?? 0}
            mono
          />
        ))}
      </div>

      {/* Account filter row */}
      <div className="mb-s5 flex flex-wrap items-center gap-s2">
        <span className="mr-s2 text-micro font-bold uppercase tracking-wider text-muted">
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
        <div className="mb-s5 rounded-md border-l-4 border-lime bg-surface/40 px-s5 py-s4">
          <p className="eyebrow">Account focus</p>
          <p className="mt-s1 font-serif text-h3 text-paper">
            Decision story · {selectedAccount.name}
          </p>
          <p className="mt-s1 text-small text-muted">
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
  mono = false,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
  mono?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-s2 rounded-pill px-s3 py-[6px] text-small font-semibold transition-colors duration-fast ${
        active
          ? "bg-lime text-ink"
          : "border border-paper/15 text-paper hover:bg-paper/5"
      }`}
    >
      <span className={mono ? "font-mono" : ""}>{label}</span>
      {count != null && (
        <span className={`tabular ${active ? "opacity-70" : "opacity-60"}`}>
          {count}
        </span>
      )}
    </button>
  );
}
