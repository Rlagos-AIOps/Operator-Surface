import type { Database } from "@/lib/supabase/types";

/**
 * Row shape the approvals page passes around. Matches the page's
 * Supabase query. Kept here so client components can import the type
 * without dragging server-only modules along.
 */
export type ApprovalRow = Database["public"]["Tables"]["approvals"]["Row"] & {
  agent: { slug: string; name: string } | null;
};

export type ApprovalStatus = ApprovalRow["status"];

// ─── In-flight UX state machine ──────────────────────────────────────────
//
// An approval's *display state* in the UI is richer than its `status` column.
// Once a human approves a row, the Hermes side has to actually execute it
// (Bell sends the email, Hopper writes to Salesforce). That execution lives
// in `metadata.executed`. Until then the card should stay in the active
// queue with a "Processing…" indicator — not jump straight to "Decided".
//
// The five states:
//   pending     status='pending'                            → show Approve/Reject buttons
//   processing  status='approved' AND not executed AND      → dim "Processing…" + spinner
//                 decided_at < STALLED_THRESHOLD_MS ago
//   stalled     status='approved' AND not executed AND      → warning + error text + Retry
//                 decided_at >= STALLED_THRESHOLD_MS ago
//   executed    status='approved' AND metadata.executed===true → readonly, in Decided list
//   rejected    status='rejected'                            → readonly, in Decided list
//
// The Decided section shows only `executed` + `rejected`. Everything else
// (pending, processing, stalled) shows in the active queue.

export type ApprovalUiState =
  | "pending"
  | "processing"
  | "stalled"
  | "executed"
  | "rejected";

/** Approvals are considered stalled if not executed within this window after decided_at. */
export const STALLED_THRESHOLD_MS = 5 * 60 * 1000;

interface ExecutionMetadata {
  executed?: boolean;
  outcome?: string;
  sf_record_id?: string;
  gmail_message_id?: string;
  sent_via?: string;
  execution_blocker?: string;
  execution_error?: string;
  /**
   * ISO timestamp of the last Retry click. Used to reset the
   * stalled-threshold clock so a card returns to Processing
   * after retry instead of staying visually stalled.
   */
  last_retry_at?: string;
}

/**
 * Derive the UI state from the row + the current clock. Pure — same input,
 * same output. `now` is a parameter so it's testable and so server-render
 * and client-render can agree on the same moment when needed.
 */
export function getUiState(
  approval: ApprovalRow,
  now: number = Date.now(),
): ApprovalUiState {
  if (approval.status === "rejected") return "rejected";
  if (approval.status === "pending") return "pending";

  // status === "approved" from here on
  const meta = (approval.metadata ?? {}) as ExecutionMetadata;
  if (meta.executed === true) return "executed";

  // Approved but not executed yet — check age. The stalled clock measures
  // from the most-recent action: original approval OR last Retry click.
  // Without the retry-aware comparison, hitting Retry on a 6-min-old card
  // would leave it visually stuck in Stalled even though we just kicked
  // a fresh dispatch.
  const decidedAt = approval.decided_at
    ? Date.parse(approval.decided_at)
    : null;
  const retryAt = meta.last_retry_at ? Date.parse(meta.last_retry_at) : null;
  const referenceAt =
    decidedAt !== null && retryAt !== null
      ? Math.max(decidedAt, retryAt)
      : decidedAt ?? retryAt;
  if (referenceAt !== null && now - referenceAt >= STALLED_THRESHOLD_MS) {
    return "stalled";
  }
  return "processing";
}

/** True when an approval should appear in the active (top) queue. */
export function isActiveApproval(state: ApprovalUiState): boolean {
  return state === "pending" || state === "processing" || state === "stalled";
}

/** Convenience: read execution metadata in a typed way. */
export function getExecutionMetadata(approval: ApprovalRow): ExecutionMetadata {
  return (approval.metadata ?? {}) as ExecutionMetadata;
}
