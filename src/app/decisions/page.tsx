import { Settings } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { DecisionList } from "./_components/DecisionList";
import type { DecisionRow } from "./_components/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Decision Trace — Operator Surface",
};

export default async function DecisionsPage() {
  const sb = createSupabaseAdminClient();

  const { data, error } = await sb
    .from("decisions")
    .select(
      `
        id, agent_id, agent_run_id, decision_type, source_record_type,
        source_record_id, label, confidence, reasoning, signals, metadata,
        created_at,
        agent:agents ( slug, name ),
        agent_run:agent_runs ( id, started_at, status, triggered_by, input_summary )
      `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-background px-s5 py-s8">
        <div className="mx-auto max-w-[1200px]">
          <p className="eyebrow mb-s2">Decision Trace</p>
          <h1 className="font-serif text-h1 text-foreground">Something went wrong.</h1>
          <p className="mt-s4 text-body text-bad">
            <span className="font-bold">DB error:</span> {error.message}
          </p>
        </div>
      </main>
    );
  }

  const decisions = (data ?? []) as DecisionRow[];

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] px-s5 py-s7">
        {/* Header row */}
        <div className="mb-s5 flex items-start justify-between gap-s5">
          <div>
            <p className="eyebrow mb-s2">Decision Trace</p>
            <h1 className="font-serif text-h1 text-foreground">
              What the agents figured out
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

        {/* Agent-live strip */}
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
            {decisions.length} decisions logged · galileo running · newest first
          </span>
        </div>

        <DecisionList decisions={decisions} />
      </div>
    </main>
  );
}
