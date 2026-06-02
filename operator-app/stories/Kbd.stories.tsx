import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Kbd } from "../components/site/accents";

// Keyboard key cap — nav / shortcut signals (⌘K, R, J, K, E).
const meta = {
  title: "Kit/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  argTypes: { children: { control: "text" } },
  args: { children: "R" },
} satisfies Meta<typeof Kbd>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Shortcuts: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <span className="inline-flex items-center gap-1.5">
        <Kbd>R</Kbd> <span className="text-sm text-muted-foreground">reply</span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd> <span className="text-sm text-muted-foreground">command</span>
      </span>
    </div>
  ),
};
