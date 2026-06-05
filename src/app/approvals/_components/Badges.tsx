import type { ApprovalStatus } from "./types";
import { InfoIcon } from "@/app/_components/InfoIcon";

/* ------------------------------------------------------------------ */
/* AgentBadge — color-coded pill per CSM agent slug                   */
/* ------------------------------------------------------------------ */

const AGENT_TINTS: Record<string, { bg: string; border: string; text: string }> = {
  galileo: {
    bg: "bg-volt/15",
    border: "border-volt/40",
    text: "text-volt",
  },
  "sop-analyst": {
    bg: "bg-info/15",
    border: "border-info/40",
    text: "text-info",
  },
  "sf-reader": {
    bg: "bg-paper/10",
    border: "border-paper/25",
    text: "text-paper",
  },
  "hygiene-validator": {
    bg: "bg-warning/15",
    border: "border-warning/40",
    text: "text-warning",
  },
  "controlled-executor": {
    bg: "bg-lime/15",
    border: "border-lime/40",
    text: "text-lime",
  },
};

const DEFAULT_TINT = AGENT_TINTS["sf-reader"];

export function AgentBadge({
  slug,
  name,
}: {
  slug: string;
  name?: string;
}) {
  const tint = AGENT_TINTS[slug] ?? DEFAULT_TINT;
  return (
    <span
      className={`inline-flex items-center gap-s1 rounded-pill border px-s3 py-[3px] text-micro font-mono font-medium ${tint.bg} ${tint.border} ${tint.text}`}
      title={name ?? slug}
    >
      <span className="h-1.5 w-1.5 rounded-pill bg-current opacity-80" />
      {slug}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* ActionTypeBadge — outlined lime pill                               */
/* ------------------------------------------------------------------ */

const ACTION_LABELS: Record<string, string> = {
  update_field: "update field",
  send_email: "send email",
  send_slack: "send slack",
  create_task: "create task",
  recompute_health: "recompute health",
};

export function ActionTypeBadge({ actionType }: { actionType: string }) {
  const label = ACTION_LABELS[actionType] ?? actionType.replace(/_/g, " ");
  return (
    <span className="inline-flex items-center rounded-pill border border-lime/40 px-s3 py-[3px] text-micro font-medium uppercase tracking-wider text-lime">
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* RiskBadge — low / med / high                                       */
/* ------------------------------------------------------------------ */

const RISK_STYLES: Record<string, string> = {
  low: "border-muted/30 text-muted",
  med: "border-warning/40 text-warning",
  high: "border-danger/50 text-danger",
};

export function RiskBadge({ level }: { level?: string | null }) {
  if (!level) return null;
  const style = RISK_STYLES[level] ?? RISK_STYLES.low;
  return (
    <span
      className={`inline-flex items-center gap-s1 rounded-pill border px-s3 py-[3px] text-micro font-bold uppercase tracking-wider ${style}`}
    >
      {level} risk
      <InfoIcon tooltipKey="riskBand" />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* StatusBadge — pending / approved / rejected                         */
/* ------------------------------------------------------------------ */

const STATUS_STYLES: Record<ApprovalStatus, string> = {
  pending: "border-paper/25 text-paper bg-paper/5",
  approved: "border-lime/50 text-lime bg-lime/10",
  rejected: "border-danger/50 text-danger bg-danger/10",
  expired: "border-muted/30 text-muted bg-muted/10",
};

export function StatusBadge({ status }: { status: ApprovalStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-pill border px-s3 py-[3px] text-micro font-bold uppercase tracking-wider ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* TimeAgo — fixed-text relative time (server-rendered)                */
/* ------------------------------------------------------------------ */

export function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = now - then;
  if (diff < 60_000) return "just now";
  const min = Math.floor(diff / 60_000);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}
