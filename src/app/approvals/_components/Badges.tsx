import type { ApprovalStatus } from "./types";

/* ------------------------------------------------------------------ */
/* AgentBadge — color-coded pill per CSM agent slug                   */
/* Semantic tones: galileo=volt · sop-analyst=cold · sf-reader=muted  */
/* hygiene-validator=warm · controlled-executor=good                  */
/* ------------------------------------------------------------------ */

const AGENT_TINTS: Record<string, { bg: string; border: string; text: string }> = {
  galileo: {
    bg: "bg-volt/15",
    border: "border-volt/40",
    text: "text-volt",
  },
  "sop-analyst": {
    bg: "bg-cold/15",
    border: "border-cold/40",
    text: "text-cold",
  },
  "sf-reader": {
    bg: "bg-surface-2",
    border: "border-border-strong",
    text: "text-muted-foreground",
  },
  "hygiene-validator": {
    bg: "bg-warm/15",
    border: "border-warm/40",
    text: "text-warm",
  },
  "controlled-executor": {
    bg: "bg-good/15",
    border: "border-good/40",
    text: "text-good",
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
/* ActionTypeBadge — outlined primary pill                            */
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
    <span className="inline-flex items-center rounded-pill border border-primary/40 px-s3 py-[3px] text-micro font-medium uppercase tracking-wider text-primary">
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* RiskBadge — low / med / high                                       */
/* low=pending (luminous, not disabled) · med=warm · high=bad         */
/* ------------------------------------------------------------------ */

const RISK_STYLES: Record<string, string> = {
  low: "border-pending/40 text-pending",
  med: "border-warm/40 text-warm",
  high: "border-bad/50 text-bad",
};

export function RiskBadge({ level }: { level?: string | null }) {
  if (!level) return null;
  const style = RISK_STYLES[level] ?? RISK_STYLES.low;
  return (
    <span
      className={`inline-flex items-center rounded-pill border px-s3 py-[3px] text-micro font-bold uppercase tracking-wider ${style}`}
    >
      {level} risk
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* StatusBadge — pending / approved / rejected / expired               */
/* pending=pending (luminous) · approved=good · rejected=bad · expired=muted */
/* ------------------------------------------------------------------ */

const STATUS_STYLES: Record<ApprovalStatus, string> = {
  pending: "border-pending/50 text-pending bg-pending/10",
  approved: "border-good/50 text-good bg-good/10",
  rejected: "border-bad/50 text-bad bg-bad/10",
  expired: "border-border-strong text-muted-foreground bg-surface-2",
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
