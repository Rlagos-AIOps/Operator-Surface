import type { Lead, Intent } from "@/lib/data";

/**
 * Adapter: real approval rows (+ their linked decision) -> AK's operator-console
 * `Lead` shape. This is the ONE place the mapping lives, so the ported console
 * components stay verbatim. Each "lead card" = one pending/decided Approval.
 */
type ApprovalLike = {
  id: string;
  action_type: string;
  target_record_id: string;
  status: string;
  rationale: string | null;
  created_at: string;
  proposed_value: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  agent?: { slug: string; name: string } | null;
  decision?: {
    reasoning?: string | null;
    confidence?: number | null;
    label?: string | null;
    decision_type?: string | null;
  } | null;
};

const RISK_INTENT: Record<string, Intent> = { high: "high", med: "mid", low: "cold" };
const RISK_SCORE: Record<string, number> = { high: 88, med: 62, low: 34 };

const ACTION_LABEL: Record<string, string> = {
  send_email: "Send email",
  send_reply: "Send email",
  update_field: "Update field",
  create_task: "Create task",
  send_slack: "Send Slack",
  recompute_health: "Recompute health",
};
function humanizeAction(a: string): string {
  return ACTION_LABEL[a] ?? a.replace(/_/g, " ");
}

function relTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function previewOf(r: ApprovalLike): string {
  const pv = (r.proposed_value ?? {}) as Record<string, unknown>;
  if (r.action_type === "send_email" || r.action_type === "send_reply")
    return (pv.subject as string) ?? "Drafted email";
  if (r.action_type === "update_field") return `Update ${(pv.field as string) ?? "field"}`;
  if (r.action_type === "create_task") return (pv.subject as string) ?? "Create task";
  return humanizeAction(r.action_type);
}

function draftOf(r: ApprovalLike): string {
  const pv = (r.proposed_value ?? {}) as Record<string, unknown>;
  if (r.action_type === "send_email" || r.action_type === "send_reply")
    return (pv.body_md as string) ?? "";
  if (r.action_type === "update_field") return String(pv.value ?? "");
  if (r.action_type === "create_task")
    return [pv.subject, pv.due_date && `Due ${pv.due_date}`, pv.assigned_to && `Owner: ${pv.assigned_to}`]
      .filter(Boolean)
      .join("\n");
  return JSON.stringify(pv, null, 2);
}

export function approvalsToLeads(rows: ApprovalLike[]): Lead[] {
  return rows.map((r) => {
    const meta = (r.metadata ?? {}) as Record<string, unknown>;
    const risk = (meta.risk_level as string) ?? "low";
    const conf = r.decision?.confidence ?? null;
    const account = (meta.account_name as string) ?? r.target_record_id;
    return {
      id: r.id,
      name: account,
      role: r.agent?.name ?? humanizeAction(r.action_type),
      company: account,
      intent: RISK_INTENT[risk] ?? "cold",
      score: conf != null ? Math.round(conf * 100) : RISK_SCORE[risk] ?? 34,
      preview: previewOf(r),
      time: relTime(r.created_at),
      stage: `${r.status} · ${humanizeAction(r.action_type)}`,
      message: r.rationale ?? r.decision?.reasoning ?? "(no rationale recorded)",
      reasoning:
        r.decision?.reasoning ??
        r.rationale ??
        "Agent proposed this action; no separate decision trace linked.",
      draft: draftOf(r),
      confidence: conf ?? (risk === "high" ? 0.9 : risk === "med" ? 0.65 : 0.4),
      tokens: 0,
    };
  });
}
