import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  CircleDot, Command, Cpu, Filter, Inbox, LineChart, Pause, Play, Plus,
  Search, Send, SlidersHorizontal, Sparkles, Terminal, Zap,
} from "lucide-react";
import { LinkedinMark } from "../components/site/nav-icons";

// The operator icon vocabulary — one meaning each, thin-stroke. Mirrors the
// /styleguide icon set; the canonical map lives in components/site/nav-icons.tsx.
const meta = { title: "Foundations/Icons" } satisfies Meta;
export default meta;

type Story = StoryObj;

const SET: { icon: ComponentType<{ className?: string; strokeWidth?: number }>; label: string }[] = [
  { icon: Inbox, label: "Inbox" },
  { icon: Send, label: "Send" },
  { icon: LinkedinMark, label: "LinkedIn" },
  { icon: Cpu, label: "Agents" },
  { icon: Sparkles, label: "AI draft" },
  { icon: LineChart, label: "Metrics" },
  { icon: Filter, label: "Filter" },
  { icon: Command, label: "Command" },
  { icon: Terminal, label: "Console" },
  { icon: Search, label: "Search" },
  { icon: SlidersHorizontal, label: "Settings" },
  { icon: Zap, label: "Intent" },
  { icon: CircleDot, label: "Live" },
  { icon: Pause, label: "Pause" },
  { icon: Play, label: "Run" },
  { icon: Plus, label: "New" },
];

export const OperatorVocabulary: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
      {SET.map(({ icon: Icon, label }) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <span className="grid aspect-square w-full place-items-center rounded-xl border border-border bg-surface text-foreground">
            <Icon className="size-5" strokeWidth={1.75} />
          </span>
          <span className="num text-center font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  ),
};
