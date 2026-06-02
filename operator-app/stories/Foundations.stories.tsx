import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge, type Tone } from "../components/site/accents";

// Foundations — the spine of the system: color = signal, type, radii.
const meta = { title: "Foundations/Overview" } satisfies Meta;
export default meta;
type Story = StoryObj;

const SIGNALS: [Tone, string][] = [
  ["good", "active · success · running · shipped · primary action"],
  ["hot", "hot lead · urgent"],
  ["warm", "warm lead · caution"],
  ["cold", "cold lead · info"],
  ["bad", "error · blocked · destructive"],
  ["pending", "queued · draft · in-review — luminous, not disabled"],
  ["muted", "idle · disabled only"],
];

export const Signals: Story = {
  render: () => (
    <div>
      <p className="eyebrow text-muted-foreground">Signals — color = meaning, never decoration</p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {SIGNALS.map(([t, m]) => (
          <li key={t} className="flex items-center gap-3">
            <Badge tone={t} dot>{t}</Badge>
            <span className="text-sm text-muted-foreground">{m}</span>
          </li>
        ))}
      </ul>
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div className="max-w-[64ch]">
      <p className="font-display text-5xl leading-tight">Operator clarity.</p>
      <p className="eyebrow mt-3 text-muted-foreground">Display · DM Serif Display — money &amp; headlines</p>
      <hr className="my-6 border-border" />
      <p className="text-base leading-relaxed text-foreground">
        Body copy is Manrope at 16px — comfortable reading prose. Dense UI, labels and metadata stay 13–14px;
        eyebrows are 11px uppercase mono.
      </p>
      <p className="eyebrow mt-3 text-muted-foreground">Body · Manrope · 16px</p>
      <hr className="my-6 border-border" />
      <p className="num font-mono text-sm text-foreground">run·0042 · 14s · intent 0.94 · $125K</p>
      <p className="eyebrow mt-3 text-muted-foreground">Mono · JetBrains Mono — ops &amp; metadata</p>
    </div>
  ),
};

export const Radii: Story = {
  render: () => (
    <div className="flex flex-wrap gap-5">
      {[["sm", "rounded-sm"], ["md", "rounded-md"], ["lg", "rounded-lg"], ["xl", "rounded-xl"], ["2xl", "rounded-2xl"]].map(([n, c]) => (
        <div key={n} className="flex flex-col items-center gap-2">
          <div className={`size-16 border border-surface-edge bg-surface-2 ${c}`} />
          <span className="eyebrow text-muted-foreground">{n}</span>
        </div>
      ))}
    </div>
  ),
};
