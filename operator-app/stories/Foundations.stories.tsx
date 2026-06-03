import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge, type Tone } from "../components/site/accents";

// Foundations — the spine: color = signal, the type ramp, radii, elevation,
// and the accessibility contract. 1:1 with the Figma Foundations page.
const meta = { title: "Foundations/Overview", tags: ["autodocs"] } satisfies Meta;
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

// Full 9-step type ramp across the three families.
const TYPE: { tok: string; px: number; fam: string; cls: string; sample: string }[] = [
  { tok: "display", px: 56, fam: "DM Serif", cls: "font-display", sample: "Ops Surfer" },
  { tok: "h1", px: 48, fam: "DM Serif", cls: "font-display", sample: "Run like an operator" },
  { tok: "h2", px: 40, fam: "DM Serif", cls: "font-display", sample: "Six surfaces, one operator" },
  { tok: "h3", px: 28, fam: "DM Serif", cls: "font-display", sample: "Price on outcomes" },
  { tok: "h4", px: 20, fam: "DM Serif", cls: "font-display", sample: "Operator-grade copilot" },
  { tok: "body", px: 16, fam: "Manrope", cls: "font-sans", sample: "Plainspoken, operator-to-operator body copy." },
  { tok: "small", px: 14, fam: "Manrope", cls: "font-sans", sample: "Dense UI, metadata and controls." },
  { tok: "eyebrow", px: 11, fam: "JetBrains Mono", cls: "font-mono uppercase tracking-[0.14em]", sample: "OPS · EYEBROW LABEL" },
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
  ["xl · 20", "rounded-xl"], ["2xl · 28", "rounded-2xl"], ["pill", "rounded-full"], ["blade · 4·20", "blade"],
];

export const Radii: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      {RADII.map(([n, c]) => (
        <div key={n} className="flex flex-col items-center gap-2">
          <div className={`size-16 border border-[color:var(--border-strong)] bg-surface-2 ${c}`} />
          <span className="eyebrow text-muted-foreground">{n}</span>
        </div>
      ))}
    </div>
  ),
};

const SHADOWS: [string, string][] = [
  ["shadow-1", "resting hairline"], ["shadow-2", "raised"], ["shadow-3", "floating · pricing hover"],
];

export const Elevation: Story = {
  render: () => (
    <div className="flex flex-wrap gap-10 p-4">
      {SHADOWS.map(([n, role], i) => (
        <div key={n} className="flex flex-col items-center gap-3">
          <div
            className="grid h-20 w-40 place-items-center rounded-2xl border border-[color:var(--surface-edge)] bg-card"
            style={{ boxShadow: `var(--${n})` }}
          >
            <span className="font-mono text-[11px] text-muted-foreground">{i + 1}</span>
          </div>
          <div className="text-center">
            <p className="font-mono text-[11px] text-foreground">{n}</p>
            <p className="font-mono text-[10px] text-muted-foreground">{role}</p>
          </div>
        </div>
      ))}
    </div>
  ),
};

const A11Y: ReactNode[] = [
  "Focus-visible: 2px solid var(--ring), offset 2px — on every link, button, input & [tabindex]",
  "prefers-reduced-motion · reduced-transparency · contrast: more — all supported",
  "APCA |Lc| 85–105 primary · 77–83 muted · Lighthouse a11y 100",
  "Min font 10px · reading prose 16px · target size ≥ 24px (2.5.8)",
  "Color is never the only cue — always paired with a label/icon (1.4.1)",
  "aria-live: polite + role=status (ambient) · assertive + role=alert (critical) · one region per zone",
];

export const Accessibility: Story = {
  render: () => (
    <div className="max-w-[72ch]">
      <p className="eyebrow text-primary">WCAG 2.2 AA · APCA · Lighthouse 100</p>
      <div className="mt-5 flex items-center gap-4">
        <button type="button" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground outline outline-2 outline-offset-2 outline-[color:var(--ring)]">
          Focused button
        </button>
        <span className="text-sm text-muted-foreground">← the focus ring every interactive element gets</span>
      </div>
      <ul className="mt-6 grid gap-2.5">
        {A11Y.map((line, i) => (
          <li key={i} className="flex items-start gap-2.5 text-base text-foreground">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-good" />
            {line}
          </li>
        ))}
      </ul>
    </div>
  ),
};
