import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LiveSignage } from "../components/site/page-header";

// The instrument-page header-right: an "agent online" pulse pill + an optional
// mono run/sync stamp. Default right-slot for dashboard / pipeline / analytics;
// management pages pass action buttons instead.
const meta = {
  title: "Kit/LiveSignage",
  component: LiveSignage,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    stamp: { control: "text" },
  },
  args: { label: "agent online", stamp: "last sync 14s ago" },
} satisfies Meta<typeof LiveSignage>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2.5">
      <LiveSignage {...args} />
    </div>
  ),
};

export const PillOnly: Story = {
  args: { stamp: undefined },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2.5">
      <LiveSignage {...args} />
    </div>
  ),
};
