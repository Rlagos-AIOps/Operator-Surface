import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IntentChip } from "../components/operator/intent-chip";

// Lead intent on the cold→hot temperature scale. Color → temperature label
// (Hot/Warm/Cold) + the 0–100 score — the tag is never color-only.
const meta = {
  title: "Kit/IntentChip",
  component: IntentChip,
  tags: ["autodocs"],
  argTypes: {
    intent: { control: "inline-radio", options: ["high", "mid", "cold"], description: "high→Hot, mid→Warm, cold→Cold" },
    score: { control: { type: "range", min: 0, max: 100, step: 1 } },
  },
  args: { intent: "high", score: 84 },
} satisfies Meta<typeof IntentChip>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Scale: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <IntentChip intent="high" score={91} />
      <IntentChip intent="mid" score={62} />
      <IntentChip intent="cold" score={18} />
    </div>
  ),
};
