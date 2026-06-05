import { Settings } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ApprovalQueue } from "./_components/ApprovalQueue";
import { DecidedList } from "./_components/DecidedList";
import { RealtimeWatcher } from "./_components/RealtimeWatcher";
import {
  type ApprovalRow,
  getUiState,
  isActiveApproval,
} from "./_components/types";

// Always fetch fresh data on the server. The Server Action triggers
// revalidatePath('/approvals') after a decision, which lands here. The
// RealtimeWatcher (client component) also forces re-fetch on Supabase
// Realtime UPDATE events and every 30s as a safety net for the time-
// based processing→stalled transition.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Approval Queue — Operator Surface",
};

export default async function ApprovalsPage() {
  const sb = createSupabaseAdminClient();

  const { data, error } = await sb
    .from("approvals")
    .select(
      `
        id, action_type, target_record_type, target_record_id,
        current_value, proposed_value, rationale, status,
        decided_by, decided_at, decision_note, metadata,
        created_at, updated_at, agent_id, agent_run_id, decision_id,
        expires_at,
        agent:agents ( slug, name )
      `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-background px-s5 py-s8">
        <div className="mx-auto max-w-[1200px]">
          <p className="eyebrow mb-s2">Approval Queue</p>
          <h1 className="font-serif text-h1 text-foreground">Something went wrong.</h1>
          <p className="mt-s4 text-body text-bad">
            <span className="font-bold">DB error:</span> {error.message}
          </p>
        </div>
      </main>
    );
  }

  const approvals = (data ?? []) as ApprovalRow[];

  // Split by the UI state, NOT by raw status. Approved-but-not-yet-executed
  // rows stay in the active queue (showing a Processing… indicator) until
  // Hermes flips metadata.executed=true. Rejected rows and successfully-
  // executed rows go to Decided.
  const active: ApprovalRow[] = [];
  const decided: ApprovalRow[] = [];
  for (const a of approvals) {
    if (isActiveApproval(getUiState(a))) {
      active.push(a);
    } else {
      decided.push(a);
    }
  }

  // Most-recently-decided on top so operators see their last action first.
  // Source query orders by created_at desc, which is right for the active
  // queue but wrong here: a row that sat in the queue and was just decided
  // would otherwise appear below older rows decided earlier. Fall back to
  // updated_at, then created_at, for legacy rows missing decided_at.
  decided.sort((a, b) => {
    const at = a.decided_at ?? a.updated_at ?? a.created_at;
    const bt = b.decided_at ?? b.updated_at ?? b.created_at;
    return bt.localeCompare(at);
  });

  const trulyPending = active.filter((a) => getUiState(a) === "pending").length;
  const inFlight = active.filter((a) => getUiState(a) === "processing").length;
  const stalled = active.filter((a) => getUiState(a) === "stalled").length;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] px-s5 py-s7">
        <div className="mb-s5 flex items-start justify-between gap-s5">
          <div>
            <p className="eyebrow mb-s2">Approval Queue</p>
            <h1 className="font-serif text-h1 text-foreground">
              {trulyPending === 0
                ? active.length === 0
                  ? "All clear."
                  : `${active.length} in flight`
                : `${trulyPending} need you`}
            </h1>
          </div>
          <button
            type="button"
            aria-label="Settings"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-border/20 text-foreground transition-colors duration-fast hover:bg-card/5"
          >
            <Settings className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <div className="mb-s6 flex items-center gap-s2 text-micro text-muted-foreground">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-pill bg-volt opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-pill bg-volt" />
          </span>
          <span className="font-bold uppercase tracking-wider text-volt">
            Agent live
          </span>
          <span aria-hidden>·</span>
          <span>
            galileo running · {inFlight} processing · {stalled} stalled ·{" "}
            {decided.length} decided today · {approvals.length} total in queue
          </span>
        </div>

        <ApprovalQueue pending={active} />

        <DecidedList decided={decided} />
      </div>

      {/* Subscribes to Supabase Realtime + 30s polling. No visual output. */}
      <RealtimeWatcher />
    </main>
  );
}
