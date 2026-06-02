import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pill } from "../components/site/accents";

// Filter pill — dashed = clickable. Active = solid lime fill + contained glow.
const meta = {
  title: "Kit/Pill",
  component: Pill,
  tags: ["autodocs"],
  argTypes: {
    active: { control: "boolean" },
    count: { control: "text" },
    children: { control: "text" },
  },
  args: { active: false, count: 18, children: "Hot" },
} satisfies Meta<typeof Pill>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FilterRow: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Pill active count={47}>All</Pill>
      <Pill count={18}>Hot</Pill>
      <Pill count={12}>Warm</Pill>
      <Pill count={17}>Cold</Pill>
    </div>
  ),
};
