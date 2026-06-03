import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DecisionCard } from "@/app/decisions/_components/DecisionCard";
import type { DecisionRow } from "@/app/decisions/_components/types";

// Real rows from the demo Supabase seed, embedded as static fixtures.
const RUN_NIGHTLY = {
  id: "fda084de-76e6-4c3c-a61f-591479ed78a4",
  status: "succeeded",
  started_at: "2026-06-02T17:30:09.767+00:00",
  triggered_by: "cron",
  input_summary: "Nightly audit across active book",
};
const HYGIENE = { name: "Hygiene Validator", slug: "hygiene-validator" };

const lighthouseAtRisk = {
  id: "664cd102-59db-447b-b979-ae365dff4b58",
  agent_run_id: "fda084de-76e6-4c3c-a61f-591479ed78a4",
  agent_id: "3cab6b7d-4084-40c7-8caf-417d469bd728",
  decision_type: "classify_at_risk",
  source_record_type: "account",
  source_record_id: "001gK0000178EfcQAE",
  label: "at_risk",
  confidence: 0.91,
  reasoning:
    "Lighthouse has stopped logging into the product entirely (62 days). Support cases dropped to zero. Combined with their original 12-month commit ending in 38 days, this is the clearest churn-risk signal in the book today.",
  signals: [
    { name: "days_since_last_login", value: 62, source: "salesforce.account.Last_Login__c", weight: 0.5 },
    { name: "renewal_in_days", value: 38, weight: 0.3 },
    { name: "support_tickets_30d", value: 0, weight: 0.2, note: "Silence often precedes churn for SMB" },
  ],
  metadata: { seeded: true, account_name: "Lighthouse Marketing", account_arr_usd: 28500, account_segment: "SMB" },
  created_at: "2026-06-02T17:30:27.767+00:00",
  agent: HYGIENE,
  agent_run: RUN_NIGHTLY,
} as unknown as DecisionRow;

const polarisWatch = {
  id: "376b1791-a2f9-4c48-84eb-8378b6181fb6",
  agent_run_id: "fda084de-76e6-4c3c-a61f-591479ed78a4",
  agent_id: "3cab6b7d-4084-40c7-8caf-417d469bd728",
  decision_type: "classify_at_risk",
  source_record_type: "account",
  source_record_id: "001gK0000178TMuQAM",
  label: "watch",
  confidence: 0.55,
  reasoning:
    "Polaris is borderline. Usage is steady but on the low end of their segment, and they've been quiet on email for three weeks. Not at-risk today, but worth a courtesy check-in.",
  signals: [
    { name: "usage_pct_of_segment_median", value: 38, weight: 0.4 },
    { name: "days_since_last_outbound_email", value: 22, weight: 0.3 },
    { name: "support_tickets_30d", value: 1, weight: 0.3 },
  ],
  metadata: { seeded: true, account_name: "Polaris Builders", account_arr_usd: 48000, account_segment: "MM" },
  created_at: "2026-06-02T17:30:30.767+00:00",
  agent: HYGIENE,
  agent_run: RUN_NIGHTLY,
} as unknown as DecisionRow;

const compassMissingOwner = {
  id: "7442cc71-c737-4a4d-8209-ef639afa4ef5",
  agent_run_id: "fda084de-76e6-4c3c-a61f-591479ed78a4",
  agent_id: "3cab6b7d-4084-40c7-8caf-417d469bd728",
  decision_type: "flag_data_gap",
  source_record_type: "account",
  source_record_id: "001gK0000178nVGQAY",
  label: "missing_csm_owner",
  confidence: null,
  reasoning:
    "Account flipped from new-logo to active 14 days ago and still has no CSM assigned. SOP requires assignment within 5 business days.",
  signals: [
    { name: "csm_owner_id", value: null, source: "salesforce.account.OwnerId", weight: 0.7 },
    { name: "days_since_activation", value: 14, weight: 0.3 },
  ],
  metadata: { seeded: true, account_name: "Compass Foods", account_arr_usd: 68000, account_segment: "MM" },
  created_at: "2026-06-02T17:30:21.767+00:00",
  agent: HYGIENE,
  agent_run: RUN_NIGHTLY,
} as unknown as DecisionRow;

const brightlineStale = {
  id: "64aa8eab-c34b-477e-a61b-f863eb18646d",
  agent_run_id: "fda084de-76e6-4c3c-a61f-591479ed78a4",
  agent_id: "3cab6b7d-4084-40c7-8caf-417d469bd728",
  decision_type: "flag_data_gap",
  source_record_type: "account",
  source_record_id: "001gK0000178v6EQAQ",
  label: "stale_activity",
  confidence: null,
  reasoning:
    "Enterprise account with no logged activity in 41 days. Renewal is in 73 days. SOP requires monthly engagement minimum.",
  signals: [
    { name: "days_since_last_activity", value: 41, source: "salesforce.task", weight: 0.5 },
    { name: "renewal_in_days", value: 73, source: "salesforce.opportunity.CloseDate", weight: 0.3 },
    { name: "segment", value: "Enterprise", weight: 0.2 },
  ],
  metadata: { seeded: true, account_name: "Brightline Health", account_arr_usd: 180000, account_segment: "Ent" },
  created_at: "2026-06-02T17:30:18.767+00:00",
  agent: HYGIENE,
  agent_run: RUN_NIGHTLY,
} as unknown as DecisionRow;

const galileoRoute = {
  id: "d2388c6d-9a33-474b-92ae-78ee713d2c35",
  agent_run_id: "e0ac3741-7d14-4223-8bce-22f033b7db88",
  agent_id: "60e59dc8-6527-4d9b-9dbc-ed881161cc98",
  decision_type: "route_work",
  source_record_type: "account",
  source_record_id: "001gK0000178EfcQAE",
  label: "route_to_executor",
  confidence: 0.92,
  reasoning:
    "Lighthouse is the clearest at-risk signal today (0.91 confidence). Auto-routing the proposed save-plan draft to controlled-executor for operator review.",
  signals: [
    { name: "upstream_confidence", value: 0.91, weight: 0.6 },
    { name: "renewal_in_days", value: 38, weight: 0.4 },
  ],
  metadata: { seeded: true, account_name: "Lighthouse Marketing", account_arr_usd: 28500, account_segment: "SMB" },
  created_at: "2026-06-02T23:30:10.767+00:00",
  agent: { name: "Galileo", slug: "galileo" },
  agent_run: {
    id: "e0ac3741-7d14-4223-8bce-22f033b7db88",
    status: "running",
    started_at: "2026-06-02T23:30:09.767+00:00",
    triggered_by: "cron",
    input_summary: "Assemble 7am brief for taylor@",
  },
} as unknown as DecisionRow;

const meta = {
  title: "Domain/DecisionCard",
  component: DecisionCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof DecisionCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const LighthouseAtRisk: Story = { args: { decision: lighthouseAtRisk } };
export const PolarisWatch: Story = { args: { decision: polarisWatch } };
export const CompassMissingOwner: Story = { args: { decision: compassMissingOwner } };
export const BrightlineStaleActivity: Story = { args: { decision: brightlineStale } };
export const GalileoRouteToExecutor: Story = { args: { decision: galileoRoute } };

export const Trace: Story = {
  render: () => (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <DecisionCard decision={lighthouseAtRisk} />
      <DecisionCard decision={galileoRoute} />
      <DecisionCard decision={brightlineStale} />
      <DecisionCard decision={compassMissingOwner} />
      <DecisionCard decision={polarisWatch} />
    </div>
  ),
};
