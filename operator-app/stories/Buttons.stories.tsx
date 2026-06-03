import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Terminal, Send } from "lucide-react";
import { cn } from "../lib/utils";
import { BTN_GHOST, BTN_PRIMARY } from "../components/site/surfaces";

// The canonical *action* buttons — the lime BTN_PRIMARY and dashed BTN_GHOST
// class primitives. Size (px/py/text) is set at the call site, so one primitive
// serves the masthead, hero CTAs and in-card actions alike. (UI/Button is the
// lower-level shadcn base used inside a few primitives.)
const SIZE: Record<"sm" | "md" | "lg", string> = {
  sm: "px-3.5 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-sm",
};

function KitButton({
  variant = "primary",
  size = "md",
  icon = true,
  children = "Launch app",
}: {
  variant?: "primary" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: boolean;
  children?: ReactNode;
}) {
  return (
    <button type="button" className={cn(variant === "primary" ? BTN_PRIMARY : BTN_GHOST, SIZE[size])}>
      {icon && <Terminal className="size-4" strokeWidth={2} />}
      {children}
    </button>
  );
}

const meta = {
  title: "Kit/Buttons",
  component: KitButton,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Lime primary + dashed ghost. Hover = lift + contained edge-glow; focus = 2px ring; disabled = dimmed, no motion." } },
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "ghost"], description: "primary = lime fill · ghost = dashed clear" },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    icon: { control: "boolean", description: "Leading icon" },
    children: { control: "text" },
  },
  args: { variant: "primary", size: "md", icon: true, children: "Launch app" },
} satisfies Meta<typeof KitButton>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <KitButton variant="primary">Approve &amp; send</KitButton>
      <KitButton variant="ghost" icon={false}>Revise</KitButton>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <KitButton size="sm" icon={false}>Small</KitButton>
      <KitButton size="md" icon={false}>Medium</KitButton>
      <KitButton size="lg" icon={false}>Large</KitButton>
    </div>
  ),
};

// Interaction states — hover is live (hover any button above); focus + disabled
// shown statically. Mirrors the Figma "Button · states" board.
export const States: Story = {
  render: () => {
    const cell = (label: string, node: ReactNode) => (
      <div className="flex flex-col items-center gap-2.5">
        {node}
        <span className="eyebrow text-muted-foreground">{label}</span>
      </div>
    );
    return (
      <div className="flex flex-wrap items-center gap-8">
        {cell("Default", <button type="button" className={cn(BTN_PRIMARY, SIZE.md)}><Send className="size-3.5" strokeWidth={1.75} />Launch app</button>)}
        {cell("Hover (live)", <button type="button" className={cn(BTN_PRIMARY, SIZE.md, "-translate-y-1 brightness-105 glow-edge-good")}>Launch app</button>)}
        {cell("Focus", <button type="button" className={cn(BTN_PRIMARY, SIZE.md, "outline outline-2 outline-offset-2 outline-[color:var(--ring)]")}>Launch app</button>)}
        {cell("Disabled", <button type="button" disabled className={cn(BTN_PRIMARY, SIZE.md, "cursor-not-allowed opacity-50 hover:translate-y-0 hover:brightness-100 hover:shadow-none")}>Launch app</button>)}
      </div>
    );
  },
};
