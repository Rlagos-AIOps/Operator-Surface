/**
 * Lime outline pill for the agent's decision_type. Friendly labels for
 * the seeded decision types; falls back to the raw string with
 * underscores converted to spaces.
 *
 * Server-safe.
 */

const LABELS: Record<string, string> = {
  classify_at_risk: "classify at risk",
  classify_renewal_risk: "classify renewal risk",
  classify_upsell_opportunity: "classify upsell opportunity",
  flag_data_gap: "flag data gap",
  flag_sop_gap: "flag SOP gap",
  recompute_health_band: "recompute health",
  prioritize: "prioritize",
  route_work: "route work",
  generate_checklist: "generate checklist",
};

export function DecisionTypeBadge({ type }: { type: string }) {
  const label = LABELS[type] ?? type.replace(/_/g, " ");
  return (
    <span className="inline-flex items-center rounded-pill border border-primary/40 px-s3 py-[3px] text-micro font-medium uppercase tracking-wider text-primary">
      {label}
    </span>
  );
}
