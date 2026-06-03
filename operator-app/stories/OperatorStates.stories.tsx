import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactNode } from "react";
import { cn } from "../lib/utils";
import { PANEL } from "../components/site/surfaces";
import { LeadQueue } from "../components/operator/lead-queue";
import { ThreadView } from "../components/operator/thread-view";
import { Composer } from "../components/operator/composer";
import { AgentChat } from "../components/operator/agent-chat";
import { MetricRow } from "../components/operator/metric-row";
import { LEADS } from "../lib/data";

const lead = LEADS[0]!;
const noop = () => {};

// Empty / loading / error states across the agentic surfaces. In an agentic product
// these ARE the product (agents fail, queue, retry, hand off), so each is a
// first-class, customizable slot — pass `emptyState`/`loadingState`/`errorState` to
// re-voice them for your clients.
const meta = {
  title: "Operator/States",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;

type Story = StoryObj;

function Box({ children, h = "h-[420px]" }: { children: ReactNode; h?: string }) {
  return (
    <div className={cn(PANEL, "flex w-full max-w-sm flex-col overflow-hidden", h)}>
      {children}
    </div>
  );
}

export const QueueLoading: Story = {
  render: () => (
    <Box>
      <LeadQueue leads={[]} selectedId="" onSelect={noop} state="loading" />
    </Box>
  ),
};
export const QueueEmpty: Story = {
  render: () => (
    <Box>
      <LeadQueue leads={[]} selectedId="" onSelect={noop} state="empty" />
    </Box>
  ),
};
export const QueueError: Story = {
  render: () => (
    <Box>
      <LeadQueue leads={[]} selectedId="" onSelect={noop} state="error" onRetry={noop} />
    </Box>
  ),
};

export const ThreadEmpty: Story = {
  render: () => (
    <Box>
      <ThreadView lead={lead} state="empty" />
    </Box>
  ),
};
export const ThreadLoading: Story = {
  render: () => (
    <Box>
      <ThreadView lead={lead} state="loading" />
    </Box>
  ),
};
export const ThreadError: Story = {
  render: () => (
    <Box>
      <ThreadView lead={lead} state="error" onRetry={noop} />
    </Box>
  ),
};

export const ComposerDrafting: Story = {
  render: () => (
    <Box h="h-auto">
      <Composer lead={lead} sent={false} rejected={false} onApprove={noop} onReject={noop} state="loading" />
    </Box>
  ),
};
export const ComposerFailed: Story = {
  render: () => (
    <Box h="h-auto">
      <Composer lead={lead} sent={false} rejected={false} onApprove={noop} onReject={noop} state="error" onRetry={noop} />
    </Box>
  ),
};

export const AgentThinking: Story = {
  render: () => (
    <Box>
      <AgentChat lead={lead} state="loading" />
    </Box>
  ),
};
export const AgentError: Story = {
  render: () => (
    <Box>
      <AgentChat lead={lead} state="error" onRetry={noop} />
    </Box>
  ),
};

export const MetricsLoading: Story = {
  render: () => (
    <div className="max-w-3xl">
      <MetricRow state="loading" />
    </div>
  ),
};
export const MetricsEmpty: Story = {
  render: () => (
    <div className="max-w-3xl">
      <MetricRow state="empty" />
    </div>
  ),
};
