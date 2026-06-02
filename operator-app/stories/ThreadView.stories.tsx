import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { cn } from "../lib/utils";
import { PANEL } from "../components/site/surfaces";
import { ThreadView } from "../components/operator/thread-view";
import { LEADS } from "../lib/data";

// The open thread — lead header (avatar, name, role · company, stage badge),
// the human inbound bubble, and the agent reasoning bubble (dotted-lime).
const meta = {
  title: "Operator/ThreadView",
  component: ThreadView,
  tags: ["autodocs"],
  args: {
    lead: LEADS[2],
  },
} satisfies Meta<typeof ThreadView>;
export default meta;

type Story = StoryObj<typeof meta>;

// Aileen — high intent, explicit deadline.
export const Playground: Story = {
  render: () => (
    <div className={cn(PANEL, "flex h-[420px] max-w-2xl flex-col overflow-hidden")}>
      <ThreadView lead={LEADS[2]} />
    </div>
  ),
};

// Ben — cold, low buying signal.
export const ColdLead: Story = {
  render: () => (
    <div className={cn(PANEL, "flex h-[420px] max-w-2xl flex-col overflow-hidden")}>
      <ThreadView lead={LEADS[3]} />
    </div>
  ),
};
