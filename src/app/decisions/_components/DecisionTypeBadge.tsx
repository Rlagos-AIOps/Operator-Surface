/**
 * Lime outline pill for the agent's decision_type. Friendly labels for
 * the seeded decision types; falls back to the raw string with
 * underscores converted to spaces.
 *
 * Server-safe.
 */

// Plain-English titles for CSM audience. Keep the agent slug visible
// separately (AgentBadge) so the decision-type is the *human-readable*
// description of what happened, not the internal enum.
const LABELS: Record<string, string> = {
  classify_at_risk: "At-Risk Renewal Decision",
  classify_renewal_risk: "At-Risk Renewal Decision",
  classify_upsell_opportunity: "Upsell Signal Evaluation",
  flag_data_gap: "Data Hygiene Validation",
  flag_sop_gap: "SOP Gap Flagged",
  recompute_health_band: "Health Score Reconciliation",
  prioritize: "Priority Ranking",
  route_work: "Work Routing",
  generate_checklist: "Checklist Drafted",
  draft_save_plan: "Save Plan Drafting",
};

export function DecisionTypeBadge({ type }: { type: string }) {
  const label = LABELS[type] ?? type.replace(/_/g, " ");
  // Uppercase tracking would scream the human title. Use normal-case for
  // the new plain-English labels but keep the lime outline.
  return (
    <span className="inline-flex items-center rounded-pill border border-lime/40 px-s3 py-[3px] text-micro font-semibold text-lime">
      {label}
    </span>
  );
}
