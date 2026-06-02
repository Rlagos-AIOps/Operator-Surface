import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Cpu, Search, Send, Sparkles, Zap } from "lucide-react";
import { IconTile, type Tone } from "../components/site/accents";

const TONES: Tone[] = ["good", "hot", "warm", "cold", "bad", "pending", "muted"];

// Thin-stroke icon in an outlined square tile. Optional tone tints the glyph.
const meta = {
  title: "Kit/IconTile",
  component: IconTile,
  tags: ["autodocs"],
  argTypes: { tone: { control: "select", options: TONES } },
  args: { tone: "good", children: <Cpu className="size-[18px]" strokeWidth={1.75} /> },
} satisfies Meta<typeof IconTile>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Set: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <IconTile tone="good"><Cpu className="size-[18px]" strokeWidth={1.75} /></IconTile>
      <IconTile><Send className="size-[18px]" strokeWidth={1.75} /></IconTile>
      <IconTile><Search className="size-[18px]" strokeWidth={1.75} /></IconTile>
      <IconTile tone="warm"><Zap className="size-[18px]" strokeWidth={1.75} /></IconTile>
      <IconTile><Sparkles className="size-[18px]" strokeWidth={1.75} /></IconTile>
    </div>
  ),
};
