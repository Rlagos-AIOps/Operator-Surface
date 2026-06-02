import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Separator } from "../components/ui/separator";

const meta = {
  title: "UI/Separator",
  component: Separator,
  tags: ["autodocs"],
  argTypes: { orientation: { control: "inline-radio", options: ["horizontal", "vertical"] } },
  args: { orientation: "horizontal" },
} satisfies Meta<typeof Separator>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-64">
      <p className="text-sm text-foreground">Above</p>
      <Separator className="my-3" />
      <p className="text-sm text-muted-foreground">Below</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-8 items-center gap-3 text-sm text-foreground">
      Inbox <Separator orientation="vertical" /> Pipeline <Separator orientation="vertical" /> Clients
    </div>
  ),
};
