import type { Metadata } from "next";
import { Mark } from "@/components/operator/marks";
import { IntentChip } from "@/components/operator/intent-chip";
import { Bubble } from "@/components/operator/bubble";
import { Button } from "@/components/ui/button";
import {
  COLOR_TOKENS,
  TYPE_TOKENS,
  RADII,
  ELEVATION,
  type TypeToken,
} from "@/lib/tokens";

export const metadata: Metadata = {
  title: "AI Ops OS · Styleguide",
  description: "Living design-system styleguide — the canon for design and build.",
};

const FONT_CLASS: Record<TypeToken["font"], string> = {
  serif: "font-serif",
  sans: "font-sans",
  mono: "font-mono",
};

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-paper/8 py-10">
      <div className="eyebrow mb-1 text-lime">{eyebrow}</div>
      <h2 className="mb-6 font-serif text-[28px] tracking-tight text-paper">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Spec({
  label,
  wires,
  children,
}: {
  label: string;
  wires?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[14px] bg-surface p-5 shadow-ground">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-paper">{label}</span>
        {wires && (
          <span className="text-[11px] text-muted-foreground">
            wires to → {wires}
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export default function Styleguide() {
  return (
    <main className="mx-auto max-w-[1100px] px-7 pb-16">
      {/* Header */}
      <header className="flex flex-col gap-3 py-10">
        <div className="flex items-center gap-2.5">
          <Mark className="size-8" />
          <div className="leading-tight">
            <div className="font-serif text-xl text-paper">AI Ops OS</div>
            <div className="eyebrow text-[10px] text-lime">
              Design system · Styleguide
            </div>
          </div>
        </div>
        <p className="max-w-[640px] text-[15px] leading-relaxed text-muted-foreground">
          The canonical, live styleguide — it renders the same{" "}
          <span className="font-mono text-paper">@theme</span> tokens production
          ships, so it never drifts. Screenshot it for Google Stitch, or feed the
          token catalog to Storybook / Supernova as the source of truth.
        </p>
      </header>

      {/* Colors */}
      <Section eyebrow="Foundations" title="Color">
        <div className="flex flex-col gap-7">
          {COLOR_TOKENS.map((grp) => (
            <div key={grp.group}>
              <div className="eyebrow mb-3 text-muted-foreground">
                {grp.group}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {grp.tokens.map((t) => (
                  <div
                    key={t.name + t.cssVar}
                    className="overflow-hidden rounded-[12px] shadow-ground"
                  >
                    <div
                      className="flex h-20 items-end p-2.5"
                      style={{ background: t.hex }}
                    >
                      <span
                        className="font-mono text-[11px]"
                        style={{
                          color: t.text === "paper" ? "#F4F1E8" : "#0A1410",
                        }}
                      >
                        {t.hex}
                      </span>
                    </div>
                    <div className="bg-surface p-2.5">
                      <div className="font-mono text-[12px] text-paper">
                        {t.name}
                      </div>
                      <div className="mt-1 text-[11px] leading-snug text-muted-foreground">
                        {t.usage}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Typography */}
      <Section eyebrow="Foundations" title="Typography">
        <div className="flex flex-col divide-y divide-paper/8">
          {TYPE_TOKENS.map((t) => (
            <div
              key={t.name}
              className="grid grid-cols-1 gap-2 py-5 md:grid-cols-[200px_1fr] md:items-baseline"
            >
              <div>
                <div className="text-sm font-semibold text-paper">{t.name}</div>
                <div className="mt-1 text-[11px] leading-snug text-muted-foreground">
                  {t.usage}
                </div>
              </div>
              <div
                className={`${FONT_CLASS[t.font]} text-paper ${
                  t.numeric ? "tabular-nums" : ""
                } ${t.name === "Eyebrow" ? "eyebrow text-lime" : ""}`}
                style={{
                  fontSize: t.size,
                  lineHeight: t.font === "serif" ? 1 : 1.3,
                }}
              >
                {t.sample}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Radii + elevation */}
      <Section eyebrow="Foundations" title="Radii & elevation">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div className="eyebrow mb-3 text-muted-foreground">Radii</div>
            <div className="flex flex-wrap gap-4">
              {RADII.map((r) => (
                <div key={r.name} className="flex flex-col items-center gap-2">
                  <div
                    className="size-16 border border-surface-edge bg-surface-2"
                    style={{ borderRadius: r.value }}
                  />
                  <div className="text-center">
                    <div className="font-mono text-[11px] text-paper">
                      {r.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {r.usage}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="eyebrow mb-3 text-muted-foreground">Elevation</div>
            <div className="flex flex-wrap gap-4">
              {ELEVATION.map((e) => (
                <div key={e.name} className="flex flex-col items-center gap-2">
                  <div className={`size-16 rounded-[14px] bg-surface ${e.name}`} />
                  <div className="text-center">
                    <div className="font-mono text-[11px] text-paper">
                      {e.name}
                    </div>
                    <div className="max-w-28 text-[10px] leading-snug text-muted-foreground">
                      {e.usage}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Components */}
      <Section eyebrow="Components" title="Live components">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Spec label="Buttons" wires="primary actions (lime = the only CTA)">
            <Button>Approve &amp; send</Button>
            <Button variant="outline">Revise</Button>
            <Button variant="ghost">Reject</Button>
          </Spec>

          <Spec label="Intent chips" wires="triage agent score → queue">
            <IntentChip intent="high" score={84} />
            <IntentChip intent="mid" score={62} />
            <IntentChip intent="cold" score={18} />
          </Spec>

          <Spec label="Eyebrow + agent-live pill" wires="agent runtime status">
            <span className="eyebrow text-lime">Agent · active</span>
            <span className="flex items-center gap-2 rounded-full border border-volt/40 bg-volt/10 px-3 py-2">
              <span className="size-1.5 animate-pulse-volt rounded-full bg-volt shadow-[0_0_8px_var(--color-volt)]" />
              <span className="eyebrow text-[11px] text-volt">Agent live</span>
            </span>
          </Spec>

          <Spec label="Metric card (3 tones)" wires="pipeline / ROI telemetry">
            <div className="rounded-[14px] bg-surface p-4 shadow-ground">
              <div className="eyebrow mb-1.5 text-muted-foreground">Pipeline</div>
              <div className="font-serif text-3xl tabular-nums text-paper">42</div>
            </div>
            <div className="rounded-[14px] bg-surface p-4 shadow-[0_1px_0_rgba(10,20,16,0.2),0_0_0_1px_rgba(200,249,2,0.45),0_0_24px_rgba(200,249,2,0.2)]">
              <div className="eyebrow mb-1.5 text-volt">Agent · active</div>
              <div className="font-serif text-3xl tabular-nums text-volt">7</div>
            </div>
            <div className="rounded-[14px] bg-paper p-4 shadow-ground">
              <div className="eyebrow mb-1.5 text-muted-paper">ROI · locked</div>
              <div className="font-serif text-3xl tabular-nums text-ink">$4,200</div>
            </div>
          </Spec>

          <div className="lg:col-span-2">
            <Spec label="Speech bubbles (signature)" wires="thread view ↔ triage agent">
              <div className="flex w-full flex-col gap-3">
                <Bubble from="human">
                  Saw your post on AI ops for inbound triage. Open to a quick chat?
                </Bubble>
                <Bubble from="reasoning">
                  Intent score 0.84 · Persona match (RevOps · mid-market). Worth a
                  fast reply with two scoping qs.
                </Bubble>
                <Bubble from="agent">
                  Happy to chat. Two quick questions before we book time — what&apos;s
                  your average response time today?
                </Bubble>
              </div>
            </Spec>
          </div>
        </div>
      </Section>

      {/* Voice */}
      <Section eyebrow="Foundations" title="Voice & rules">
        <ul className="flex flex-col gap-2 text-[15px] text-muted-foreground">
          <li>— Sentence case everywhere. UPPERCASE only for eyebrow labels (0.14em tracking).</li>
          <li>— Tabular figures for every number. Currency <span className="font-mono text-paper tabular-nums">$4,200</span>, time <span className="font-mono text-paper tabular-nums">2h 14m</span>.</li>
          <li>— Lime is the only CTA color. Volt is reserved for agent-active states.</li>
          <li>— No emoji. No bluish-purple gradients. Emerald is always the dominant surface.</li>
          <li>— Operator-to-operator voice: tell them what happened, what&apos;s next, what to decide.</li>
        </ul>
      </Section>
    </main>
  );
}
