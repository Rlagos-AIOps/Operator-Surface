import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge, type Tone } from "@/components/ui/accents";

// Foundations — the spine: color = signal, the type ramp, radii, elevation.
// Adapted from AK's design Storybook to our transplanted token system.
const meta = { title: "Foundations/Overview", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj;

const SIGNALS: [Tone, string][] = [
  ["good", "active · success · running · shipped · primary action"],
  ["hot", "urgent attention (e.g. priority_high)"],
  ["warm", "caution · hygiene gap (watch, missing_save_plan)"],
  ["cold", "info · routing (route_to_executor)"],
  ["bad", "error · blocked · at_risk · rejected"],
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

const TYPE: { tok: string; px: number; fam: string; cls: string; sample: string }[] = [
  { tok: "display", px: 56, fam: "DM Serif", cls: "font-serif", sample: "Operator Surface" },
  { tok: "h1", px: 48, fam: "DM Serif", cls: "font-serif", sample: "See what your agents did" },
  { tok: "h2", px: 40, fam: "DM Serif", cls: "font-serif", sample: "Approve what they want next" },
  { tok: "h3", px: 28, fam: "DM Serif", cls: "font-serif", sample: "Decision trace" },
  { tok: "h4", px: 20, fam: "DM Serif", cls: "font-serif", sample: "Renewal risk audit" },
  { tok: "body", px: 16, fam: "Manrope", cls: "font-sans", sample: "Plainspoken operator-to-operator body copy." },
  { tok: "small", px: 14, fam: "Manrope", cls: "font-sans", sample: "Dense UI, metadata and controls." },
  { tok: "eyebrow", px: 11, fam: "JetBrains Mono", cls: "font-mono uppercase tracking-[0.14em]", sample: "OPS · EYEBROW" },
  { tok: "kbd", px: 10, fam: "JetBrains Mono", cls: "font-mono uppercase tracking-[0.04em]", sample: "⌘K · RUN 0042" },
];

export const Type: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      {TYPE.map((t) => (
        <div key={t.tok} className="flex items-center gap-6 border-b border-border pb-4 last:border-0">
          <div className="w-44 shrink-0">
            <p className="font-mono text-[13px] text-foreground">{t.tok}</p>
            <p className="font-mono text-[10px] text-muted-foreground">{t.px}px · {t.fam}</p>
          </div>
          <span className={`text-foreground ${t.cls}`} style={{ fontSize: t.px }}>{t.sample}</span>
        </div>
      ))}
    </div>
  ),
};

const RADII: [string, string][] = [
  ["sm · 4", "rounded-sm"], ["md · 8", "rounded-md"], ["lg · 14", "rounded-lg"],
  ["xl · 20", "rounded-xl"], ["2xl", "rounded-2xl"], ["pill", "rounded-full"],
];

export const Radii: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      {RADII.map(([n, c]) => (
        <div key={n} className="flex flex-col items-center gap-2">
          <div className={`size-16 border border-[color:var(--surface-edge)] bg-surface-2 ${c}`} />
          <span className="eyebrow text-muted-foreground">{n}</span>
        </div>
      ))}
    </div>
  ),
};

const SHADOWS: [string, string][] = [
  ["e1 · resting", "shadow-e1"], ["e2 · hover", "shadow-e2"], ["e3 · modal", "shadow-e3"],
];

export const Elevation: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8">
      {SHADOWS.map(([n, c]) => (
        <div key={n} className="flex flex-col items-center gap-3">
          <div className={`size-20 rounded-2xl border border-[color:var(--surface-edge)] bg-card ${c}`} />
          <span className="eyebrow text-muted-foreground">{n}</span>
        </div>
      ))}
    </div>
  ),
};

