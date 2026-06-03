import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Activity } from "lucide-react";
import { Badge, Pill, StatusDot, IconTile, Kbd, type Tone } from "@/components/ui/accents";

const TONES: Tone[] = ["good", "hot", "warm", "cold", "bad", "pending", "muted"];

/* ---------------- Badge ---------------- */
const badgeMeta = {
  title: "Kit/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    tone: { control: "select", options: TONES, description: "Semantic signal tone" },
    dot: { control: "boolean", description: "Leading status dot" },
    pulse: { control: "boolean", description: "Pulse the dot (running agent)" },
    glow: { control: "boolean", description: "Contained edge glow" },
    children: { control: "text" },
  },
  args: { tone: "good", dot: true, pulse: false, glow: false, children: "Active" },
} satisfies Meta<typeof Badge>;
export default badgeMeta;
type BadgeStory = StoryObj<typeof badgeMeta>;

export const Playground: BadgeStory = {};

export const AllTones: BadgeStory = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {TONES.map((t) => <Badge key={t} tone={t} dot>{t}</Badge>)}
    </div>
  ),
};

export const Glow: BadgeStory = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["good", "hot", "warm", "cold", "bad", "pending"] as Tone[]).map((t) => (
        <Badge key={t} tone={t} dot glow>{t}</Badge>
      ))}
    </div>
  ),
};

export const PulseRunning: BadgeStory = {
  render: () => <Badge tone="good" dot pulse>agent live</Badge>,
};

/* ---------------- StatusDot / Pill / IconTile / Kbd ---------------- */
export const StatusDots: BadgeStory = {
  render: () => (
    <div className="flex items-center gap-4">
      {TONES.map((t) => (
        <span key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
          <StatusDot tone={t} /> {t}
        </span>
      ))}
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <StatusDot tone="good" pulse /> pulsing
      </span>
    </div>
  ),
};

export const Pills: BadgeStory = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Pill active count={124}>ALL</Pill>
      <Pill count={18}>HOT</Pill>
      <Pill count={42}>PENDING</Pill>
      <Pill count={6}>APPROVED</Pill>
    </div>
  ),
};

export const IconTiles: BadgeStory = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <IconTile><Activity className="h-4 w-4" /></IconTile>
      <IconTile tone="good"><Activity className="h-4 w-4" /></IconTile>
      <IconTile tone="bad"><Activity className="h-4 w-4" /></IconTile>
      <IconTile tone="cold"><Activity className="h-4 w-4" /></IconTile>
    </div>
  ),
};

export const Kbds: BadgeStory = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Kbd>⌘K</Kbd><Kbd>J</Kbd><Kbd>K</Kbd><Kbd>R</Kbd><Kbd>E</Kbd>
    </div>
  ),
};
