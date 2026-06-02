import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../components/ui/tooltip";

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
} satisfies Meta<typeof Tooltip>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground">
          Hover me
        </TooltipTrigger>
        <TooltipContent>Drafted by the agent · confidence 0.84</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
