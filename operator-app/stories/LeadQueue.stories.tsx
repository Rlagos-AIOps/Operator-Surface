import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { cn } from "../lib/utils";
import { PANEL } from "../components/site/surfaces";
import { LeadQueue } from "../components/operator/lead-queue";
import { LEADS } from "../lib/data";

// The inbound queue — selectable lead rows with avatar, intent chip, preview,
// and at-a-glance tags. Selection drives the thread view in the full console.
const meta = {
  title: "Operator/LeadQueue",
  component: LeadQueue,
  tags: ["autodocs"],
  args: {
    leads: LEADS,
    selectedId: LEADS[0]?.id ?? "",
    onSelect: () => {},
  },
} satisfies Meta<typeof LeadQueue>;
export default meta;

type Story = StoryObj<typeof meta>;

const noop = () => {};

// Selection-state wrapper — mirrors how OperatorSurface drives the queue.
function QueueDemo({ highOnly = false }: { highOnly?: boolean }) {
  const leads = highOnly ? LEADS.filter((l) => l.intent === "high") : LEADS;
  const [sel, setSel] = useState(leads[0]?.id ?? "");
  return (
    <div className={cn(PANEL, "flex h-[560px] max-w-sm flex-col overflow-hidden")}>
      <LeadQueue leads={leads} selectedId={sel} onSelect={setSel} />
    </div>
  );
}

export const Playground: Story = { render: () => <QueueDemo /> };

export const HighIntentOnly: Story = { render: () => <QueueDemo highOnly /> };

export const Loading: Story = {
  render: () => (
    <div className={cn(PANEL, "flex h-[560px] max-w-sm flex-col overflow-hidden")}>
      <LeadQueue leads={[]} selectedId="" onSelect={noop} state="loading" />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div className={cn(PANEL, "flex h-[560px] max-w-sm flex-col overflow-hidden")}>
      <LeadQueue leads={[]} selectedId="" onSelect={noop} state="empty" />
    </div>
  ),
};

export const Error: Story = {
  render: () => (
    <div className={cn(PANEL, "flex h-[560px] max-w-sm flex-col overflow-hidden")}>
      <LeadQueue leads={[]} selectedId="" onSelect={noop} state="error" onRetry={noop} />
    </div>
  ),
};
