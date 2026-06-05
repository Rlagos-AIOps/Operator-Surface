"use client";

import { useState, useTransition } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { decideApproval } from "../actions";
import {
  AgentBadge,
  ActionTypeBadge,
  RiskBadge,
  StatusBadge,
  timeAgo,
} from "./Badges";
import { DiffView } from "./DiffView";
import type { ApprovalRow } from "./types";
import { accountDisplayName, plainEnglish } from "@/lib/copy/overrides";

type Mode = "active" | "readonly";

interface Props {
  approval: ApprovalRow;
  mode?: Mode;
}

export function ApprovalCard({ approval, mode = "active" }: Props) {
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [pendingDecision, setPendingDecision] = useState<
    "approved" | "rejected" | null
  >(null);

  const metadata = (approval.metadata ?? {}) as {
    account_name?: string;
    risk_level?: string;
  };

  const onDecide = (decision: "approved" | "rejected") => {
    setError(null);
    setPendingDecision(decision);
    startTransition(async () => {
      const result = await decideApproval(approval.id, decision, note);
      if (!result.ok) {
        setError(result.error);
        setPendingDecision(null);
      }
      // On success the page revalidates; this card unmounts or shifts
      // into the decided list. No further client state to clean up.
    });
  };

  const isActive = mode === "active" && approval.status === "pending";

  return (
    <article className="rounded-lg border border-surface-edge bg-surface p-s5 shadow-e1 transition-shadow duration-base hover:shadow-e2">
      {/* Top row: agent + action type + risk + status + time */}
      <header className="mb-s4 flex flex-wrap items-center gap-s2">
        {approval.agent && (
          <AgentBadge slug={approval.agent.slug} name={approval.agent.name} />
        )}
        <ActionTypeBadge actionType={approval.action_type} />
        <RiskBadge level={metadata.risk_level} />
        {!isActive && <StatusBadge status={approval.status} />}
        <div className="flex-1" />
        <span className="text-micro text-muted tabular">
          {timeAgo(approval.created_at)}
        </span>
      </header>

      {/* Account + target ID */}
      <div className="mb-s4">
        {metadata.account_name && (
          <h3 className="font-serif text-h3 text-paper">
            {accountDisplayName(metadata.account_name)}
          </h3>
        )}
        <p className="mt-[2px] font-mono text-micro text-muted">
          {approval.target_record_type} ·{" "}
          <span className="text-muted-light">{approval.target_record_id}</span>
        </p>
      </div>

      {/* Rationale */}
      {approval.rationale && (
        <p className="mb-s5 max-w-[72ch] text-body text-paper">
          {plainEnglish(approval.rationale)}
        </p>
      )}

      {/* Diff */}
      <DiffView
        actionType={approval.action_type}
        currentValue={approval.current_value}
        proposedValue={approval.proposed_value}
      />

      {/* Decision footer */}
      {isActive ? (
        <footer className="mt-s5 flex flex-col gap-s3">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note (recorded as decision_note)…"
            className="w-full rounded-md border border-surface-edge bg-bg-deep px-s3 py-s2 text-small text-paper placeholder:text-muted focus:border-lime/60 focus:outline-none focus:ring-1 focus:ring-lime/40"
            disabled={pending}
          />
          {error && (
            <p className="text-small text-danger">
              <span className="font-bold">Action failed:</span> {error}
            </p>
          )}
          <div className="flex items-center gap-s3">
            <button
              type="button"
              onClick={() => onDecide("rejected")}
              disabled={pending}
              className="inline-flex items-center gap-s2 rounded-md border border-paper/25 px-s4 py-s2 text-small font-semibold text-paper transition-colors duration-fast hover:bg-paper/5 disabled:opacity-50"
            >
              {pending && pendingDecision === "rejected" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
              Reject
            </button>
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => onDecide("approved")}
              disabled={pending}
              className="inline-flex items-center gap-s2 rounded-md bg-lime px-s5 py-s2 text-small font-bold text-ink transition-colors duration-fast hover:bg-volt active:bg-lime-deep disabled:opacity-50"
            >
              {pending && pendingDecision === "approved" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" strokeWidth={2.5} />
              )}
              Approve
            </button>
          </div>
        </footer>
      ) : (
        <footer className="mt-s5 border-t border-surface-edge pt-s4 text-small text-muted">
          {approval.decided_at && (
            <span>
              Decided {timeAgo(approval.decided_at)}
              {approval.decision_note && (
                <>
                  {" · "}
                  <span className="italic text-paper/80">
                    &ldquo;{approval.decision_note}&rdquo;
                  </span>
                </>
              )}
            </span>
          )}
        </footer>
      )}
    </article>
  );
}
