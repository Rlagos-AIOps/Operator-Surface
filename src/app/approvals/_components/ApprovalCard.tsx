"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, Check, Loader2, X } from "lucide-react";
import { decideApproval } from "../actions";
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

  // Manual Retry removed. Auto-retry on the droplet (60s cron) handles
  // re-dispatch on a [2, 5, 10, 20] minute schedule. The CSM never needs
  // to think about dispatch failures — when something exhausts retries
  // we surface "needs attention" and they ping an admin.

  // Left-edge color treatment makes in-flight cards visually distinct.
  //   processing               → volt (active, healthy in-flight)
  //   stalled, no blocker      → warm amber (taking longer; auto-retry pending)
  //   stalled, blocker set     → bad red (auto-retry exhausted; needs admin)
  const isExhausted = uiState === "stalled" && !!execMeta.execution_blocker;
  const edgeClass =
    uiState === "processing"
      ? "border-l-4 border-l-volt"
      : uiState === "stalled"
      ? isExhausted
        ? "border-l-4 border-l-bad"
        : "border-l-4 border-l-warm"
      : "";

  return (
    <article className={`p-s5 ${PANEL} ${edgeClass}`}>
      <header className="mb-s4 flex flex-wrap items-center gap-s2">
        {approval.agent && (
          <AgentBadge slug={approval.agent.slug} name={approval.agent.name} />
        )}
        <ActionTypeBadge actionType={approval.action_type} />
        <RiskBadge level={metadata.risk_level} />
        {uiState === "processing" && (
          <span className="inline-flex items-center gap-s2 rounded-pill bg-volt/15 px-s3 py-[2px] text-micro font-bold uppercase tracking-wider text-volt">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-pill bg-volt opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-pill bg-volt" />
            </span>
            Galileo working
          </span>
        )}
        {uiState === "stalled" && (
          <span
            className={`inline-flex items-center gap-s2 rounded-pill px-s3 py-[2px] text-micro font-bold uppercase tracking-wider ${
              isExhausted
                ? "bg-bad/15 text-bad"
                : "bg-warm/15 text-warm"
            }`}
          >
            <AlertTriangle className="h-3 w-3" />
            {isExhausted ? "Needs attention" : "Slow"}
          </span>
        )}
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
        <footer className="mt-s5 flex flex-col gap-s2 border-t border-border pt-s4">
          <div className="flex items-center gap-s3 text-small">
            <Loader2 className="h-4 w-4 animate-spin text-volt" />
            <span className="font-bold text-foreground">
              Galileo is processing this approval
            </span>
            <span className="text-muted-foreground">
              · dispatching to {approval.action_type === "send_reply" ? "Bell" : "Hopper"}
            </span>
            {approval.decided_at && (
              <span className="ml-auto text-micro tabular text-muted-foreground">
                approved {timeAgo(approval.decided_at)}
              </span>
            )}
          </div>
          {execMeta.retry_attempts && execMeta.retry_attempts > 0 ? (
            <p className="text-micro text-muted-foreground">
              Retried {execMeta.retry_attempts}× automatically — Galileo is
              still working on it.
            </p>
          ) : null}
        </footer>
      ) : uiState === "stalled" ? (
        <footer className="mt-s5 flex flex-col gap-s2 border-t border-border pt-s4">
          {execMeta.execution_blocker ? (
            // Auto-retry has exhausted — surfaces a soft "needs attention"
            // banner. No action button: the CSM pings an admin out-of-band.
            <>
              <div className="flex items-center gap-s2 text-small text-bad">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span className="font-bold">Needs attention</span>
                <span className="opacity-80">
                  {" "}·{" "}Galileo couldn&apos;t complete this after several
                  automatic retries
                </span>
              </div>
              <p className="text-small text-foreground/80">
                <span className="font-bold text-muted-foreground">
                  Galileo reported:
                </span>{" "}
                <span className="font-mono text-small">
                  {execMeta.execution_blocker}
                </span>
              </p>
              <p className="text-micro text-muted-foreground">
                The decision is recorded. Ping an admin to investigate the
                dispatch failure.
              </p>
            </>
          ) : (
            // Stalled but not exhausted — auto-retry will pick this up on
            // its next tick. Reassure the operator that the system has it.
            <>
              <div className="flex items-center gap-s2 text-small text-warm">
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                <span className="font-bold">Taking longer than usual</span>
                <span className="opacity-80">
                  {" "}·{" "}auto-retry will pick this up shortly
                </span>
              </div>
              {execMeta.retry_attempts && execMeta.retry_attempts > 0 ? (
                <p className="text-micro text-muted-foreground">
                  Retried {execMeta.retry_attempts}× automatically so far.
                </p>
              ) : null}
            </>
          )}
          <div className="text-micro tabular text-muted-foreground">
            approved {timeAgo(approval.decided_at ?? approval.created_at)}
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
