import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { VerdictBadge } from "@/app/decisions/_components/VerdictBadge";
import { DecisionTypeBadge } from "@/app/decisions/_components/DecisionTypeBadge";
import { ConfidenceMeter } from "@/app/decisions/_components/ConfidenceMeter";
import {
  AgentBadge,
  ActionTypeBadge,
  RiskBadge,
  StatusBadge,
} from "@/app/approvals/_components/Badges";
import { ChipRow } from "@/app/brief/_components/ChipRow";

const meta = { title: "Domain/Badges & Signals", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj;

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-4 border-b border-border py-3 last:border-0">
    <span className="w-40 shrink-0 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
      {label}
    </span>
    <div className="flex flex-wrap items-center gap-2">{children}</div>
  </div>
);

const VERDICTS = [
  "at_risk", "watch", "priority_high", "upsell_qualified", "route_to_executor",
  "missing_save_plan", "stale_activity", "missing_csm_owner", "green",
];

export const Verdicts: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {VERDICTS.map((v) => <VerdictBadge key={v} label={v} />)}
    </div>
  ),
};

export const AgentTints: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {["galileo", "sop-analyst", "sf-reader", "hygiene-validator", "controlled-executor"].map((s) => (
        <AgentBadge key={s} slug={s} />
      ))}
    </div>
  ),
};

export const Risk: Story = {
  render: () => (
    <div className="flex gap-2">
      <RiskBadge level="low" /><RiskBadge level="med" /><RiskBadge level="high" />
    </div>
  ),
};

export const Status: Story = {
  render: () => (
    <div className="flex gap-2">
      <StatusBadge status="pending" /><StatusBadge status="approved" />
      <StatusBadge status="rejected" /><StatusBadge status="expired" />
    </div>
  ),
};

export const ActionTypes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {["update_field", "send_email", "send_slack", "create_task", "recompute_health"].map((a) => (
        <ActionTypeBadge key={a} actionType={a} />
      ))}
    </div>
  ),
};

export const DecisionTypes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {["classify_at_risk", "flag_data_gap", "prioritize", "recompute_health_band", "generate_checklist"].map((t) => (
        <DecisionTypeBadge key={t} type={t} />
      ))}
    </div>
  ),
};

export const Confidence: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ConfidenceMeter value={0.91} />
      <ConfidenceMeter value={0.68} />
      <ConfidenceMeter value={0.55} />
      <ConfidenceMeter value={null} />
    </div>
  ),
};

export const Chips: Story = {
  render: () => (
    <ChipRow
      chips={[
        { label: "at risk", kind: "danger" },
        { label: "caution", kind: "warning" },
        { label: "healthy", kind: "success" },
        { label: "info", kind: "info" },
        { label: "neutral" },
      ]}
    />
  ),
};

export const AllInOne: Story = {
  render: () => (
    <div className="max-w-2xl">
      <Row label="Verdicts">{VERDICTS.slice(0, 5).map((v) => <VerdictBadge key={v} label={v} />)}</Row>
      <Row label="Agents">
        {["galileo", "hygiene-validator", "controlled-executor"].map((s) => <AgentBadge key={s} slug={s} />)}
      </Row>
      <Row label="Risk"><RiskBadge level="low" /><RiskBadge level="med" /><RiskBadge level="high" /></Row>
      <Row label="Status"><StatusBadge status="pending" /><StatusBadge status="approved" /><StatusBadge status="rejected" /></Row>
    </div>
  ),
};
