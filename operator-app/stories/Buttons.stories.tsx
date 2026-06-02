import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowUpRight } from "lucide-react";
import { cn } from "../lib/utils";
import { BTN_GHOST, BTN_PRIMARY } from "../components/site/surfaces";

// Shared button treatments (class primitives). Size is set at the call site so
// one primitive serves header and in-card actions. PRIMARY = lime; GHOST = dashed.
const meta = { title: "Kit/Buttons" } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Treatments: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" className={cn(BTN_PRIMARY, "px-5 py-2.5 text-sm")}>
        Approve &amp; send <ArrowUpRight className="size-4" strokeWidth={2} />
      </button>
      <button type="button" className={cn(BTN_GHOST, "px-5 py-2.5 text-sm")}>
        Revise
      </button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" className={cn(BTN_PRIMARY, "px-3.5 py-1.5 text-xs")}>Small</button>
      <button type="button" className={cn(BTN_PRIMARY, "px-4 py-2 text-sm")}>Medium</button>
      <button type="button" className={cn(BTN_PRIMARY, "px-5 py-3 text-sm")}>Large</button>
    </div>
  ),
};
