/**
 * VerdictBadge — semantic color per known label. Falls back to
 * a neutral lime tint.
 *
 * Server-safe.
 */

const VERDICT_TINTS: Record<string, { bg: string; text: string }> = {
  // Risk / health labels
  at_risk: { bg: "bg-danger/20", text: "text-danger" },
  watch: { bg: "bg-warning/20", text: "text-warning" },
  red: { bg: "bg-danger/20", text: "text-danger" },
  yellow: { bg: "bg-warning/20", text: "text-warning" },
  green: { bg: "bg-success/20", text: "text-success" },

  // Opportunity labels
  upsell_qualified: { bg: "bg-success/20", text: "text-success" },
  priority_high: { bg: "bg-volt/20", text: "text-volt" },
  priority_medium: { bg: "bg-lime/20", text: "text-lime" },

  // Routing labels
  route_to_executor: { bg: "bg-info/20", text: "text-info" },

  // Hygiene labels
  missing_save_plan: { bg: "bg-warning/20", text: "text-warning" },
  stale_activity: { bg: "bg-warning/20", text: "text-warning" },
  missing_csm_owner: { bg: "bg-warning/20", text: "text-warning" },
  sop_section_5_gap: { bg: "bg-warning/20", text: "text-warning" },

  // Generative labels
  qbobr_checklist_ready: { bg: "bg-info/20", text: "text-info" },
};

const DEFAULT_VERDICT = { bg: "bg-lime/20", text: "text-lime" };

export function VerdictBadge({ label }: { label: string }) {
  const tint = VERDICT_TINTS[label] ?? DEFAULT_VERDICT;
  return (
    <span
      className={`inline-flex items-center rounded-md px-s3 py-s1 font-mono text-small font-bold ${tint.bg} ${tint.text}`}
    >
      {label}
    </span>
  );
}
