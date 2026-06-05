"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, Check, Loader2, RotateCw, X } from "lucide-react";
import { decideApproval, retryHermesWebhook } from "../actions";
import {
  AgentBadge,
  ActionTypeBadge,
  RiskBadge,
  StatusBadge,
  timeAgo,
} from "./Badges";
import { DiffView } from "./DiffView";
import {
  type ApprovalRow,
  getUiState,
  getExecutionMetadata,
} from "./types";
import { PANEL, BTN_PRIMARY, BTN_GHOST } from "@/components/ui/surfaces";

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
    opportunity_name?: string;
    contact_name?: string;
    target_name?: string;
    /** Legacy: early Bell drafts wrote this instead of account_name. */
    account?: string;
    risk_level?: string;
  };

  // Title resolution: prefer a type-specific name when present, fall back
  // through synonyms, then to a generic target_name. Opportunity cards
  // were rendering blank because Bell wrote `metadata.account` while
  // Galileo wrote `metadata.account_name`. UI now reads both.
  const displayTitle =
    metadata.target_name ??
    metadata.opportunity_name ??
    metadata.account_name ??
    metadata.contact_name ??
    metadata.account ??
    null;

  const uiState = getUiState(approval);
  const execMeta = getExecutionMetadata(approval);

  // Show decide buttons only when strictly pending. All other states
  // (processing / stalled / executed / rejected) render alternative
  // footers.
  const showDecideButtons = mode === "active" && uiState === "pending";

  const onDecide = (decision: "approved" | "rejected") => {
    setError(null);
    setPendingDecision(decision);
    startTransition(async () => {
      const result = await decideApproval(approval.id, decision, note);
      if (!result.ok) {
        setError(result.error);
        setPendingDecision(null);
      }
    });
  };

  const onRetry = () => {
    setError(null);
    startTransition(async () => {
      const result = await retryHermesWebhook(approval.id);
      if (!result.ok) setError(result.error);
    });
  };

  return (
    <article className={`p-s5 ${PANEL}`}>
      <header className="mb-s4 flex flex-wrap items-center gap-s2">
        {approval.agent && (
          <AgentBadge slug={approval.agent.slug} name={approval.agent.name} />
        )}
        <ActionTypeBadge actionType={approval.action_type} />
        <RiskBadge level={metadata.risk_level} />
        {(uiState === "executed" || uiState === "rejected") && (
          <StatusBadge status={approval.status} />
        )}
        <div className="flex-1" />
        <span className="text-micro text-muted-foreground tabular">
          {timeAgo(approval.created_at)}
        </span>
      </header>

      <div className="mb-s4">
        {displayTitle && (
          <h3 className="font-serif text-h3 text-foreground">
            {displayTitle}
          </h3>
        )}
        <p className="mt-[2px] font-mono text-micro text-muted-foreground">
          {approval.target_record_type}{" "}·{" "}
          <span className="text-muted-foreground">{approval.target_record_id}</span>
        </p>
      </div>

      {approval.rationale && (
        <p className="mb-s5 max-w-[72ch] text-body text-foreground">
          {approval.rationale}
        </p>
      )}

      <DiffView
        actionType={approval.action_type}
        currentValue={approval.current_value}
        proposedValue={approval.proposed_value}
      />

      {showDecideButtons ? (
        <footer className="mt-s5 flex flex-col gap-s3">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note (recorded as decision_note)…"
            className="w-full rounded-md border border-border bg-background px-s3 py-s2 text-small text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40"
            disabled={pending}
          />
          {error && (
            <p className="text-small text-bad">
              <span className="font-bold">Action failed:</span> {error}
            </p>
          )}
          <div className="flex items-center gap-s3">
            <button
              type="button"
              onClick={() => onDecide("rejected")}
              disabled={pending}
              className={`gap-s2 px-s4 py-s2 text-small ${BTN_GHOST} disabled:opacity-50`}
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
              className={`gap-s2 px-s5 py-s2 text-small ${BTN_PRIMARY} disabled:opacity-50`}
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
      ) : uiState === "processing" ? (
        <footer className="mt-s5 flex items-center gap-s3 border-t border-border pt-s4 text-small text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin opacity-70" />
          <span className="font-mono">Processing…</span>
          {approval.decided_at && (
            <span className="ml-auto text-micro tabular opacity-80">
              approved {timeAgo(approval.decided_at)}
            </span>
          )}
        </footer>
      ) : uiState === "stalled" ? (
        <footer className="mt-s5 flex flex-col gap-s2 border-t border-border pt-s4">
          <div className="flex items-center gap-s2 text-small text-warm">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span className="font-bold">Stalled</span>
            <span className="opacity-80">
              {" "}·{" "}execution has not completed in 5 minutes
            </span>
          </div>
          {(execMeta.execution_blocker || execMeta.execution_error) && (
            <p className="text-small text-foreground/80">
              <span className="font-bold text-muted-foreground">
                Hermes reported:
              </span>{" "}
              <span className="font-mono text-small">
                {execMeta.execution_blocker ?? execMeta.execution_error}
              </span>
            </p>
          )}
          {error && (
            <p className="text-small text-bad">
              <span className="font-bold">Retry failed:</span> {error}
            </p>
          )}
          <div className="flex items-center gap-s3">
            <span className="text-micro text-muted-foreground tabular">
              approved {timeAgo(approval.decided_at ?? approval.created_at)}
            </span>
            <div className="flex-1" />
            <button
              type="button"
              onClick={onRetry}
              disabled={pending}
              className={`gap-s2 px-s4 py-s2 text-small ${BTN_GHOST} disabled:opacity-50`}
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RotateCw className="h-4 w-4" />
              )}
              Retry
            </button>
          </div>
        </footer>
      ) : (
        <footer className="mt-s5 border-t border-border pt-s4 text-small text-muted-foreground">
          {approval.decided_at && (
            <>
              <div>
                Decided {timeAgo(approval.decided_at)}
                {approval.decision_note && (
                  <>
                    {" "}·{" "}
                    <span className="italic text-foreground/80">
                      &ldquo;{approval.decision_note}&rdquo;
                    </span>
                  </>
                )}
              </div>
              {uiState === "executed" && execMeta.outcome && (
                <div className="mt-s2 text-foreground/80">
                  <span className="font-bold text-muted-foreground">
                    Outcome:
                  </span>{" "}
                  {execMeta.outcome}
                  {execMeta.sf_record_id && (
                    <span className="ml-s2 font-mono text-micro text-muted-foreground">
                      {" "}·{" "}sf:{execMeta.sf_record_id}
                    </span>
                  )}
                  {execMeta.gmail_message_id && (
                    <span className="ml-s2 font-mono text-micro text-muted-foreground">
                      {" "}·{" "}gmail:{execMeta.gmail_message_id}
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </footer>
      )}
    </article>
  );
}
