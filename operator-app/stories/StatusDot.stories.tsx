import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StatusDot, type Tone } from "../components/site/accents";

const TONES: Tone[] = ["good", "hot", "warm", "cold", "bad", "pending", "muted"];

// Leading status dot. pulse = motion-as-signal (live / has something to say).
// Always pair with an adjacent label — never a color-only signal.
const meta = {
  title: "Kit/StatusDot",
  component: StatusDot,
  tags: ["autodocs"],
  argTypes: {
    tone: { control: "select", options: TONES },
    pulse: { control: "boolean" },
  },
  args: { tone: "good", pulse: true },
} satisfies Meta<typeof StatusDot>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithLabels: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-5">
      <span className="inline-flex items-center gap-2 text-sm text-foreground">
        <StatusDot tone="good" pulse /> live
      </span>
      <span className="inline-flex items-center gap-2 text-sm text-foreground">
        <StatusDot tone="pending" /> queued
      </span>
      <span className="inline-flex items-center gap-2 text-sm text-foreground">
        <StatusDot tone="bad" /> error
      </span>
    </div>
  ),
};
