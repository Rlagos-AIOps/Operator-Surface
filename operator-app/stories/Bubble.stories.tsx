import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bubble } from "../components/operator/bubble";

// The signature leaf-blade chat shapes — cream human, lime agent, dotted
// reasoning trace. Ops Surfer's hero motif.
const meta = {
  title: "Kit/Bubble",
  component: Bubble,
  tags: ["autodocs"],
  argTypes: {
    from: { control: "inline-radio", options: ["human", "agent", "reasoning"] },
    children: { control: "text" },
  },
  args: { from: "agent", children: "Happy to chat — what's your average response time today?" },
} satisfies Meta<typeof Bubble>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="flex max-w-xl flex-col">
      <Bubble {...args} />
    </div>
  ),
};

export const Conversation: Story = {
  render: () => (
    <div className="flex max-w-xl flex-col gap-3">
      <Bubble from="human">Saw your post on AI ops for inbound triage. Open to a quick chat?</Bubble>
      <Bubble from="reasoning">Intent score 0.84 · Persona match (RevOps · mid-market) · concrete pain.</Bubble>
      <Bubble from="agent">Happy to chat. Two quick questions before we book time…</Bubble>
    </div>
  ),
};
