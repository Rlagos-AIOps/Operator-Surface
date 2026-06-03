import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { cn } from "../lib/utils";
import { PANEL } from "../components/site/surfaces";
import { Composer } from "../components/operator/composer";
import { LEADS } from "../lib/data";

// The agent-draft composer — confidence/token meta, an editable cream draft
// bubble, Approve & send (→ good "Sent"), the Revise popover, and Reject.
const meta = {
  title: "Operator/Composer",
  component: Composer,
  tags: ["autodocs"],
  args: {
    lead: LEADS[0],
    sent: false,
    rejected: false,
    onApprove: () => {},
    onReject: () => {},
  },
} satisfies Meta<typeof Composer>;
export default meta;

type Story = StoryObj<typeof meta>;

const WRAP = "max-w-2xl overflow-hidden";
const noop = () => {};

// Interactive wrapper — Approve / Reject flip the local sent/rejected state.
function ComposerDemo() {
  const [sent, setSent] = useState(false);
  const [rejected, setRejected] = useState(false);
  return (
    <div className={cn(PANEL, WRAP)}>
      <Composer
        lead={LEADS[0]}
        sent={sent}
        rejected={rejected}
        onApprove={() => setSent(true)}
        onReject={() => setRejected(true)}
      />
    </div>
  );
}

export const Playground: Story = { render: () => <ComposerDemo /> };

export const Sent: Story = {
  render: () => (
    <div className={cn(PANEL, WRAP)}>
      <Composer lead={LEADS[0]} sent rejected={false} onApprove={() => {}} onReject={() => {}} />
    </div>
  ),
};

export const Rejected: Story = {
  render: () => (
    <div className={cn(PANEL, WRAP)}>
      <Composer lead={LEADS[0]} sent={false} rejected onApprove={() => {}} onReject={() => {}} />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className={cn(PANEL, WRAP)}>
      <Composer
        lead={LEADS[0]}
        sent={false}
        rejected={false}
        onApprove={noop}
        onReject={noop}
        state="loading"
      />
    </div>
  ),
};

export const Error: Story = {
  render: () => (
    <div className={cn(PANEL, WRAP)}>
      <Composer
        lead={LEADS[0]}
        sent={false}
        rejected={false}
        onApprove={noop}
        onReject={noop}
        state="error"
        onRetry={noop}
      />
    </div>
  ),
};
