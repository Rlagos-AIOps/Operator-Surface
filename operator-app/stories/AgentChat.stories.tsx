import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { cn } from "../lib/utils";
import { PANEL } from "../components/site/surfaces";
import { AgentChat } from "../components/operator/agent-chat";
import { LEADS } from "../lib/data";

// The agent copilot column — reacts to the selected lead (intent-keyed read +
// score), suggestion chips, and an ask-the-agent input.
const meta = {
  title: "Operator/AgentChat",
  component: AgentChat,
  tags: ["autodocs"],
  args: {
    lead: LEADS[0],
  },
} satisfies Meta<typeof AgentChat>;
export default meta;

type Story = StoryObj<typeof meta>;

const WRAP = "flex h-[560px] max-w-sm flex-col overflow-hidden";

// Maya — hot lead.
export const Playground: Story = {
  render: () => (
    <div className={cn(PANEL, WRAP)}>
      <AgentChat lead={LEADS[0]} />
    </div>
  ),
};

// Tom — cold, off-pipeline.
export const ColdLead: Story = {
  render: () => (
    <div className={cn(PANEL, WRAP)}>
      <AgentChat lead={LEADS[5]} />
    </div>
  ),
};
