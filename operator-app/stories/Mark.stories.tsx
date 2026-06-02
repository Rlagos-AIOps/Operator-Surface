import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Mark } from "../components/operator/marks";

// The Ops Surfer glyph — lime rounded square with the ink wave/triangle.
const meta = {
  title: "Kit/Mark",
  component: Mark,
  tags: ["autodocs"],
  args: { className: "size-12" },
} satisfies Meta<typeof Mark>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Mark className="size-6" />
      <Mark className="size-10" />
      <Mark className="size-16" />
    </div>
  ),
};
