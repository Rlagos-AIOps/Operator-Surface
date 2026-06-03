import type { Meta, StoryObj } from "@storybook/nextjs-vite";

// Brand — the WaveMark logo system and the voice. 1:1 with the Figma
// Brand · Logo and Brand · Voice pages.
const meta = { title: "Brand/Logo & Voice", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj;

// The live masthead WaveMark — the operator riding the wave.
function WaveMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} fill="none" aria-hidden>
      <path d="M2 18c3.5 0 3.5-8 7-8s3.5 8 7 8 3.5-8 7-8" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
      <path d="M2 22c3.5 0 3.5-5 7-5s3.5 5 7 5 3.5-5 7-5" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" opacity="0.45" />
    </svg>
  );
}

function Lockup({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <WaveMark className="size-7" />
      <span className="font-mono text-base font-semibold uppercase tracking-[0.18em]">Ops Surfer</span>
    </span>
  );
}

export const Logo: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="eyebrow text-primary">Primary lockup · lime on dark</p>
        <div className="mt-4 text-primary"><Lockup /></div>
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="grid h-28 w-48 place-items-center rounded-2xl border border-[color:var(--surface-edge)] bg-card text-primary">
          <WaveMark className="size-12" />
        </div>
        <div className="grid h-28 w-48 place-items-center rounded-2xl border border-[color:var(--surface-edge)] bg-card text-primary">
          <Lockup />
        </div>
        <div className="grid h-28 w-48 place-items-center rounded-2xl border border-[color:var(--surface-edge)] text-[color:var(--color-ink)]" style={{ background: "var(--color-emerald)" }}>
          <Lockup />
        </div>
      </div>
      <div>
        <p className="eyebrow text-muted-foreground">Graphic language</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {[
            ["Wave motif", "the operator's wave"],
            ["Leaf-blade", "asymmetric board-nose radius"],
            ["Two-tone", "warm cream over emerald"],
            ["Gold accent", "the surfboard hero illustration"],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl border border-[color:var(--surface-edge)] bg-surface px-4 py-3">
              <p className="font-mono text-[11px] text-foreground">{t}</p>
              <p className="mt-1 text-xs text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="eyebrow text-muted-foreground">Color anchors</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {[
            ["Emerald", "var(--color-emerald)"],
            ["Lime", "var(--color-good)"],
            ["Gold", "var(--color-warm)"],
            ["Cream", "var(--color-paper)"],
            ["Ink", "var(--color-ink)"],
          ].map(([n, v]) => (
            <div key={n} className="flex flex-col gap-1.5">
              <div className="h-14 w-24 rounded-xl border border-[color:var(--surface-edge)]" style={{ background: v }} />
              <span className="font-mono text-[11px] text-foreground">{n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

const PRINCIPLES: [string, string][] = [
  ["Operator, not corporate", "Plainspoken and direct — “not a chatbot in a sidebar,” never “conversational AI solution.”"],
  ["Outcomes, not hours", "Talk in ROI and upside. The fee is a share of the value, not the time spent."],
  ["First-person agents", "Agents speak as themselves — “takes orders, reports back.” Confident, never servile."],
  ["Editorial × operator", "DM Serif for money & headlines, JetBrains Mono for ops, Manrope for body."],
];

const LINES = ["“Price on outcomes, not hours.”", "“Priced like a tool, not a platform.”", "“Six surfaces, one operator.”", "“Your next engagement could ship by Friday.”"];

export const Voice: Story = {
  render: () => (
    <div className="flex max-w-[80ch] flex-col gap-8">
      <div>
        <p className="eyebrow text-primary">Positioning · client success platform for AI consultancies</p>
        <h2 className="mt-3 font-display text-4xl leading-tight">
          Run your consultancy like an <span className="italic text-primary">operator</span>, not a corporate.
        </h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {PRINCIPLES.map(([t, d]) => (
          <div key={t} className="rounded-2xl border border-[color:var(--surface-edge)] bg-card p-5">
            <p className="font-display text-xl">{t}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
      <div>
        <p className="eyebrow text-muted-foreground">Signature lines</p>
        <div className="mt-3 flex flex-col gap-2">
          {LINES.map((l) => (
            <p key={l} className="font-display text-2xl">{l}</p>
          ))}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-good/50 bg-good/[0.08] p-5">
          <p className="eyebrow text-foreground">Do</p>
          <ul className="mt-2 grid gap-1.5 text-sm text-foreground">
            <li>Lead with the outcome and the ROI</li>
            <li>Plainspoken, operator-to-operator</li>
            <li>Agents speak in the first person</li>
            <li>Confident and specific — real numbers</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-bad/50 bg-bad/[0.08] p-5">
          <p className="eyebrow text-foreground">Don&apos;t</p>
          <ul className="mt-2 grid gap-1.5 text-sm text-foreground">
            <li>Corporate jargon (“synergy”, “solutions”)</li>
            <li>Make hours or seats the story</li>
            <li>Servile or cutesy chatbot tone</li>
            <li>Vague hype with no number behind it</li>
          </ul>
        </div>
      </div>
    </div>
  ),
};
