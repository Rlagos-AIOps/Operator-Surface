import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ApprovalCard } from "@/app/approvals/_components/ApprovalCard";
import type { ApprovalRow } from "@/app/approvals/_components/types";

// Real rows from the demo Supabase seed (service-role read), embedded as static
// fixtures so the card renders in Storybook's isolated, backend-free context.
// NOTE: Approve/Reject call a Next Server Action; in Storybook (no server) the
// click is inert — use the live app to actually decide.

const AGENT = { name: "Controlled Executor", slug: "controlled-executor" };

const lighthouseEmail = {
  id: "7e1c1475-7f87-40ef-9d72-89d35240bb4a",
  agent_run_id: "e0ac3741-7d14-4223-8bce-22f033b7db88",
  agent_id: "1a5d3a3f-704a-49f7-af15-ea8a97189efe",
  decision_id: "664cd102-59db-447b-b979-ae365dff4b58",
  action_type: "send_email",
  target_record_type: "contact",
  target_record_id: "001gK0000178EfcQAE",
  current_value: null,
  proposed_value: {
    cc: [],
    to: ["chris@lighthouse-marketing.example"],
    channel: "email",
    subject: "Checking in — last month before renewal",
    body_md:
      "Hi Chris,\n\nNoticing your team hasn't logged in for a few weeks and we're 38 days out from your renewal. Want to set up a quick 15-minute call this week to walk through where you are and what would make the next year easier?\n\nI also have a few ideas based on what teams at your size have been doing successfully — happy to share them whenever works best.\n\nThanks,\nTaylor",
  },
  rationale:
    "Strongest at-risk signal today (0.91). 62 days no login, 38d to renewal, zero recent support cases. Standard SMB renewal-recovery outreach template, personalized.",
  status: "pending",
  decided_by: null,
  decided_at: null,
  decision_note: null,
  expires_at: null,
  metadata: { seeded: true, risk_level: "high", account_name: "Lighthouse Marketing" },
  created_at: "2026-06-03T00:15:09.767+00:00",
  updated_at: "2026-06-03T01:30:12.316219+00:00",
  agent: AGENT,
} as unknown as ApprovalRow;

const brightlineField = {
  id: "0915e6b6-b097-4255-a553-dd65930b4286",
  agent_run_id: "e0ac3741-7d14-4223-8bce-22f033b7db88",
  agent_id: "1a5d3a3f-704a-49f7-af15-ea8a97189efe",
  decision_id: "64aa8eab-c34b-477e-a61b-f863eb18646d",
  action_type: "update_field",
  target_record_type: "salesforce.account",
  target_record_id: "001gK0000178v6EQAQ",
  current_value: { field: "CSM_Save_Plan__c", value: "3/12/26: Met with Meera. Renewal looks solid. Will follow up in July." },
  proposed_value: {
    field: "CSM_Save_Plan__c",
    value:
      "3/12/26: Met with Meera. Renewal looks solid. Will follow up in July.\n5/28/26: Renewal now 73d out. No activity in 41d. Forecast still 'Positive Outlook' but signal is thin — need a pressure-test conversation before relying on it.",
  },
  rationale:
    "Renewal inside 90 days and no logged activity in over a month. Existing save plan note is stale; appending current-state, not overwriting.",
  status: "pending",
  decided_by: null, decided_at: null, decision_note: null, expires_at: null,
  metadata: { seeded: true, risk_level: "med", account_name: "Brightline Health" },
  created_at: "2026-06-03T00:10:09.767+00:00",
  updated_at: "2026-06-03T01:30:12.316219+00:00",
  agent: AGENT,
} as unknown as ApprovalRow;

const compassTask = {
  id: "1b14347c-fcaf-45a3-97fc-ba7ed6b8773d",
  agent_run_id: "e0ac3741-7d14-4223-8bce-22f033b7db88",
  agent_id: "1a5d3a3f-704a-49f7-af15-ea8a97189efe",
  decision_id: "7442cc71-c737-4a4d-8209-ef639afa4ef5",
  action_type: "create_task",
  target_record_type: "salesforce.account",
  target_record_id: "001gK0000178nVGQAY",
  current_value: null,
  proposed_value: {
    subject: "Assign CSM owner to Compass Foods (new-logo, 14d unassigned)",
    due_date: "2026-06-04", priority: "High",
    assigned_to: "ops-manager@example-csm.test", related_record: "001gK0000178nVGQAY",
  },
  rationale:
    "SOP requires CSM assignment within 5 business days of new-logo activation. Compass is at day 14 — overdue.",
  status: "pending",
  decided_by: null, decided_at: null, decision_note: null, expires_at: null,
  metadata: { seeded: true, risk_level: "med", account_name: "Compass Foods" },
  created_at: "2026-06-02T17:30:24.767+00:00",
  updated_at: "2026-06-03T01:30:12.316219+00:00",
  agent: AGENT,
} as unknown as ApprovalRow;

const riversideApproved = {
  id: "2f1d0c46-3b89-4c77-9ee0-0f34ca8268eb",
  agent_run_id: "82dabffc-aa6f-48d0-808f-892d3cd90412",
  agent_id: "1a5d3a3f-704a-49f7-af15-ea8a97189efe",
  decision_id: "af0b6c91-a3b4-4eb6-8aab-23f03b48423d",
  action_type: "update_field",
  target_record_type: "salesforce.account",
  target_record_id: "001gK0000178vNxQAI",
  current_value: { field: "CSM_Save_Plan__c", value: null },
  proposed_value: {
    field: "CSM_Save_Plan__c",
    value: "5/28/26: Yellow band, no recent save plan. Riverside has been stable but quiet. Plan to log a relationship-state note after our Thursday call.",
  },
  rationale: "Yellow account missing save plan per SOP section 5.",
  status: "approved",
  decided_by: "cf87fca9-fb4d-45c9-a4a5-e24cc23c6ecc",
  decided_at: "2026-06-02T23:20:09.767+00:00",
  decision_note: "Approved.",
  expires_at: null,
  metadata: { seeded: true, risk_level: "low", account_name: "Riverside Logistics" },
  created_at: "2026-06-02T22:30:09.767+00:00",
  updated_at: "2026-06-03T01:30:12.316219+00:00",
  agent: AGENT,
} as unknown as ApprovalRow;

const avalonRejected = {
  id: "dd509f53-a8f1-46b3-8324-25b8a3d4c14c",
  agent_run_id: "a8221089-b385-4acb-9801-88c056d77db4",
  agent_id: "1a5d3a3f-704a-49f7-af15-ea8a97189efe",
  decision_id: "1052366a-6719-4b53-84f7-5e3379089c2d",
  action_type: "create_task",
  target_record_type: "salesforce.account",
  target_record_id: "001gK0000177oPNQAY",
  current_value: null,
  proposed_value: {
    subject: "Outreach: log a save plan for Avalon (47d silence)",
    due_date: "2026-06-05", priority: "Normal",
    assigned_to: "taylor@example-csm.test", related_record: "001gK0000177oPNQAY",
  },
  rationale: "Avalon last activity 47 days ago. AE has been forwarding pricing — they may not know there's no CSM follow-up.",
  status: "rejected",
  decided_by: "cf87fca9-fb4d-45c9-a4a5-e24cc23c6ecc",
  decided_at: "2026-05-31T18:10:09.767+00:00",
  decision_note: "Already on it — spoke with AE on Friday. No task needed, will log save plan after Wed call.",
  expires_at: null,
  metadata: { seeded: true, risk_level: "low", account_name: "Avalon Auto" },
  created_at: "2026-05-31T17:30:09.767+00:00",
  updated_at: "2026-06-03T01:30:12.316219+00:00",
  agent: AGENT,
} as unknown as ApprovalRow;

const meta = {
  title: "Domain/ApprovalCard",
  component: ApprovalCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof ApprovalCard>;
export default meta;
type Story = StoryObj<typeof meta>;

// HERO — pending recovery email, high risk. Shows the Approve/Reject buttons.
export const LighthouseRecoveryEmail: Story = { args: { approval: lighthouseEmail, mode: "active" } };
export const BrightlineSavePlanUpdate: Story = { args: { approval: brightlineField, mode: "active" } };
export const CompassAssignOwnerTask: Story = { args: { approval: compassTask, mode: "active" } };
export const RiversideApproved: Story = { args: { approval: riversideApproved, mode: "readonly" } };
export const AvalonRejected: Story = { args: { approval: avalonRejected, mode: "readonly" } };

export const Queue: Story = {
  render: () => (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <ApprovalCard approval={lighthouseEmail} mode="active" />
      <ApprovalCard approval={brightlineField} mode="active" />
      <ApprovalCard approval={compassTask} mode="active" />
      <ApprovalCard approval={riversideApproved} mode="readonly" />
      <ApprovalCard approval={avalonRejected} mode="readonly" />
    </div>
  ),
};
