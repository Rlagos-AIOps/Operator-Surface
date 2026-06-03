import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Check, X } from "lucide-react";
import { PANEL, LIFT, METRIC_CHIP, BTN_PRIMARY, BTN_GHOST } from "@/components/ui/surfaces";

const meta = { title: "Kit/Surfaces", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Panel: Story = {
  render: () => (
    <div className={`${PANEL} max-w-md p-6`}>
      <p className="eyebrow text-muted-foreground mb-2">PANEL</p>
      <h3 className="font-serif text-h3 text-foreground">Static container</h3>
      <p className="mt-2 text-small text-muted-foreground">
        Dot-grid texture, hairline surface-edge border, soft resting shadow. Used for cards and panels.
      </p>
    </div>
  ),
};

export const PanelWithLift: Story = {
  render: () => (
    <div className={`${PANEL} ${LIFT} max-w-md p-6`}>
      <p className="eyebrow text-muted-foreground mb-2">PANEL + LIFT</p>
      <h3 className="font-serif text-h3 text-foreground">Hover me</h3>
      <p className="mt-2 text-small text-muted-foreground">
        The leaf-blade hover-float: lifts and gains a weighted shadow. For interactive cards/rows.
      </p>
    </div>
  ),
};

export const MetricChips: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <span className={METRIC_CHIP}>$794k ARR</span>
      <span className={METRIC_CHIP}>4 at-risk</span>
      <span className={METRIC_CHIP}>6 pending</span>
      <span className={METRIC_CHIP}>3 renewals · 90d</span>
    </div>
  ),
};

export const Buttons: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <button type="button" className={`gap-1.5 px-5 py-2 text-small ${BTN_PRIMARY}`}>
        <Check className="h-4 w-4" strokeWidth={2.5} /> Approve
      </button>
      <button type="button" className={`gap-1.5 px-4 py-2 text-small ${BTN_GHOST}`}>
        <X className="h-4 w-4" /> Reject
      </button>
    </div>
  ),
};
