import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Inbox } from "lucide-react";
import { Skeleton, SkeletonRows, EmptyState, ErrorState } from "../components/site/states";
import { PANEL } from "../components/site/surfaces";
import { cn } from "../lib/utils";

// The agentic state surfaces — empty / loading / error. These are BOTH the defaults
// the feature components render AND the customizable slots a customer overrides to
// re-voice agent failures, empties, and loading. In an agentic product the failure
// state is a real customization touchpoint, not an afterthought.
const meta = {
  title: "Kit/State",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;

type Story = StoryObj;

export const Skeletons: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-24 w-full" />
      <div className={cn(PANEL, "overflow-hidden")}>
        <SkeletonRows rows={4} />
      </div>
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div className={cn(PANEL, "max-w-md overflow-hidden")}>
      <EmptyState
        icon={<Inbox strokeWidth={1.75} />}
        title="No leads in queue"
        hint="New inbound will appear here as the agents triage it."
      />
    </div>
  ),
};

export const Error: Story = {
  render: () => (
    <div className={cn(PANEL, "max-w-md overflow-hidden")}>
      <ErrorState
        title="Draft failed to send"
        detail="The agent couldn't send this reply. Retry, or write one manually."
        onRetry={() => {}}
      />
    </div>
  ),
};
