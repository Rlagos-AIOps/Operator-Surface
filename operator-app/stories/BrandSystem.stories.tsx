import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BrandProvider } from "../components/brand-provider";
import { opsSurferBrand, exampleBrand } from "../lib/brand";
import { Badge, StatusDot, MiniBar } from "../components/site/accents";
import { PANEL, BTN_PRIMARY, BTN_GHOST } from "../components/site/surfaces";
import { cn } from "../lib/utils";

// Brand-token indirection: every `--brand-*` key feeds the semantic tokens, so a
// customer re-skins the ENTIRE surface — light AND dark, with the signal grammar
// intact — by overriding the brand, with no code fork. Below, the same kit under
// the default Ops Surfer brand and an example violet white-label, side by side.
// (Whole-tenant white-label is a one-line CSS override on :root / [data-brand].)
const meta = {
  title: "Foundations/Brand System",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;

type Story = StoryObj;

function KitSlice({ label }: { label: string }) {
  return (
    <div className={cn(PANEL, "flex w-72 flex-col gap-4 bg-background p-5")}>
      <p className="eyebrow text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        <Badge tone="good" dot>
          Active
        </Badge>
        <Badge tone="hot" dot>
          Hot
        </Badge>
        <Badge tone="pending" dot>
          Queued
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <StatusDot tone="good" pulse />
        <span className="text-sm text-foreground">Agent live</span>
      </div>
      <MiniBar value={72} tone="good" />
      <div className="flex gap-2">
        <button className={cn(BTN_PRIMARY, "px-4 py-2 text-sm")}>Approve</button>
        <button className={cn(BTN_GHOST, "px-4 py-2 text-sm")}>Revise</button>
      </div>
    </div>
  );
}

export const ReskinDemo: Story = {
  name: "Default vs white-label re-skin",
  render: () => (
    <div className="flex flex-wrap gap-6">
      <BrandProvider brand={opsSurferBrand} name="ops-surfer">
        <KitSlice label="Ops Surfer (default brand)" />
      </BrandProvider>
      <BrandProvider brand={exampleBrand} name="acme">
        <KitSlice label="Acme — exampleBrand (no fork)" />
      </BrandProvider>
    </div>
  ),
};
