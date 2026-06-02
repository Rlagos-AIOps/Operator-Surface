import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ScrollArea } from "../components/ui/scroll-area";

const meta = {
  title: "UI/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
} satisfies Meta<typeof ScrollArea>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-48 w-64 rounded-lg border border-border p-3">
      <div className="grid gap-2">
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} className="text-sm text-muted-foreground">Inbound lead #{i + 1}</p>
        ))}
      </div>
    </ScrollArea>
  ),
};
