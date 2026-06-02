import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { cn } from "../lib/utils";
import { PANEL, LIFT, METRIC_CHIP } from "../components/site/surfaces";

// Surface primitives: PANEL (dot-grid card), LIFT (hover-float — clickable only),
// the surface/surface-2/dashed utilities, and METRIC_CHIP (neutral metric pill).
const meta = { title: "Foundations/Surfaces" } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Panels: Story = {
  render: () => (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className={cn(PANEL, LIFT, "flex h-24 items-center justify-center text-sm text-muted-foreground")}>PANEL · hover-float</div>
      <div className="surface flex h-24 items-center justify-center rounded-2xl text-sm text-muted-foreground">surface</div>
      <div className="surface-2 flex h-24 items-center justify-center rounded-2xl text-sm text-muted-foreground">surface-2</div>
      <div className="dashed flex h-24 items-center justify-center rounded-2xl text-sm text-muted-foreground">dashed</div>
    </div>
  ),
};

export const MetricChips: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <span className={METRIC_CHIP}>+23% MoM</span>
      <span className={METRIC_CHIP}>14s avg handle</span>
      <span className={METRIC_CHIP}>3 need attention</span>
    </div>
  ),
};
