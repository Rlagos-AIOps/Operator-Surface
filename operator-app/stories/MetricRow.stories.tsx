import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MetricRow } from "../components/operator/metric-row";

// The console metric band — Pipeline (total + Hot/Warm/Cold/Drafts breakdown +
// temperature distribution bar + key stats), a Response stats grid, and the
// cross-surface pills (priority-drop on narrow viewports; "1 at risk" stays).
const meta = {
  title: "Operator/MetricRow",
  component: MetricRow,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof MetricRow>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Loading: Story = {
  render: () => (
    <div className="max-w-3xl">
      <MetricRow state="loading" />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div className="max-w-3xl">
      <MetricRow state="empty" />
    </div>
  ),
};
