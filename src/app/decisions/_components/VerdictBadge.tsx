/**
 * VerdictBadge — semantic color per known label. Falls back to
 * a neutral lime tint.
 *
 * Server-safe.
 */

const VERDICT_TINTS: Record<string, { bg: string; text: string }> = {
  // Risk / health labels
  at_risk: { bg: "bg-bad/20", text: "text-bad" },
  watch: { bg: "bg-warm/20", text: "text-warm" },
  red: { bg: "bg-bad/20", text: "text-bad" },
  yellow: { bg: "bg-warm/20", text: "text-warm" },
  green: { bg: "bg-good/20", text: "text-good" },

  // Opportunity labels
  upsell_qualified: { bg: "bg-good/20", text: "text-good" },
  priority_high: { bg: "bg-volt/20", text: "text-volt" },
  priority_medium: { bg: "bg-primary/20", text: "text-primary" },

  // Routing labels
  route_to_executor: { bg: "bg-cold/20", text: "text-cold" },

  // Hygiene labels
  missing_save_plan: { bg: "bg-warm/20", text: "text-warm" },
  stale_activity: { bg: "bg-warm/20", text: "text-warm" },
  missing_csm_owner: { bg: "bg-warm/20", text: "text-warm" },
  sop_section_5_gap: { bg: "bg-warm/20", text: "text-warm" },

  // Generative labels
  qbobr_checklist_ready: { bg: "bg-cold/20", text: "text-cold" },
};

const DEFAULT_VERDICT = { bg: "bg-primary/20", text: "text-primary" };

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
