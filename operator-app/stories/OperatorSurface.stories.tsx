import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OperatorSurface } from "../components/operator/operator-surface";

// The full operator command console — TopBar + MetricRow + the three rounded
// panels (inbound queue · thread + composer · agent copilot). Self-contained:
// manages selection, the high-intent filter, and approve/reject state.
const meta = {
  title: "Operator/OperatorSurface",
  component: OperatorSurface,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof OperatorSurface>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
