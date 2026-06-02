import { Settings } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ApprovalQueue } from "./_components/ApprovalQueue";
import { DecidedList } from "./_components/DecidedList";
import type { ApprovalRow } from "./_components/types";

// Always fetch fresh data on the server. The Server Action triggers
// revalidatePath('/approvals') after a decision, which lands here.
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
      <main className="min-h-screen bg-bg-deep px-s5 py-s8">
        <div className="mx-auto max-w-[1200px]">
          <p className="eyebrow mb-s2">Approval Queue</p>
          <h1 className="font-serif text-h1 text-paper">Something went wrong.</h1>
          <p className="mt-s4 text-body text-danger">
            <span className="font-bold">DB error:</span> {error.message}
          </p>
        </div>
      </main>
    );
  }

  const approvals = (data ?? []) as ApprovalRow[];
  const pending = approvals.filter((a) => a.status === "pending");
  const decided = approvals.filter((a) => a.status !== "pending");

  return (
    <main className="min-h-screen bg-bg-deep">
      <div className="mx-auto max-w-[1200px] px-s5 py-s7">
        {/* Header row */}
        <div className="mb-s5 flex items-start justify-between gap-s5">
          <div>
            <p className="eyebrow mb-s2">Approval Queue</p>
            <h1 className="font-serif text-h1 text-paper">
              {pending.length === 0
                ? "All clear."
                : `${pending.length} need you`}
            </h1>
          </div>
          <button
            type="button"
            aria-label="Settings"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-paper/20 text-paper transition-colors duration-fast hover:bg-paper/5"
          >
            <Settings className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Agent-live strip */}
        <div className="mb-s6 flex items-center gap-s2 text-micro text-muted">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-pill bg-volt opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-pill bg-volt" />
          </span>
          <span className="font-bold uppercase tracking-wider text-volt">
            Agent live
          </span>
          <span aria-hidden>·</span>
          <span>
            galileo running · {decided.length} decided today · {approvals.length} total in queue
          </span>
        </div>

        <ApprovalQueue pending={pending} />

        <DecidedList decided={decided} />
      </div>
    </main>
  );
}
