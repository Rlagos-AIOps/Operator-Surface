import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import { BTN_GHOST } from "../components/site/surfaces";
import { cn } from "../lib/utils";

// The app-wide toast layer (sonner), themed to the popover tokens with lucide
// status icons. Mounted once in app/layout.tsx; here it's mounted in-story so
// the trigger buttons actually surface toasts.
const meta = {
  title: "UI/Sonner",
  component: Toaster,
  tags: ["autodocs"],
} satisfies Meta<typeof Toaster>;
export default meta;

type Story = StoryObj<typeof meta>;

const BTN = cn(BTN_GHOST, "px-3.5 py-2 text-[13px]");

export const Playground: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2.5">
      <Toaster />
      <button type="button" className={BTN} onClick={() => toast.success("Reply sent to Maya Okafor")}>
        Success
      </button>
      <button type="button" className={BTN} onClick={() => toast("Revising · concise")}>
        Default
      </button>
      <button type="button" className={BTN} onClick={() => toast.info("Agent drafted a reply")}>
        Info
      </button>
      <button type="button" className={BTN} onClick={() => toast.warning("Lead going cold")}>
        Warning
      </button>
      <button type="button" className={BTN} onClick={() => toast.error("Draft failed to send")}>
        Error
      </button>
    </div>
  ),
};
