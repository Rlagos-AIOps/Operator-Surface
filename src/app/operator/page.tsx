import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { OperatorSurface } from "@/components/operator/operator-surface";
import { approvalsToLeads } from "@/lib/operator-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Operator Console — Operator Surface",
};

export default async function OperatorPage() {
  const sb = createSupabaseAdminClient();
  const { data } = await sb
    .from("approvals")
    .select(
      "id,action_type,target_record_id,status,rationale,created_at,proposed_value,metadata," +
        "agent:agents(slug,name),decision:decisions(reasoning,confidence,label,decision_type)",
    )
    .order("created_at", { ascending: false });

  const leads = approvalsToLeads((data ?? []) as never);

  // metrics panel hidden for now (its KPIs are not yet wired to live counts).
  return <OperatorSurface leads={leads} config={{ panels: { metrics: false } }} />;
}
