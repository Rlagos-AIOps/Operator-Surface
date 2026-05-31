const SWATCHES = [
  { name: "emerald", cls: "bg-emerald", hex: "#1E5631", role: "Light canvas base" },
  { name: "mossy", cls: "bg-mossy", hex: "#0F2A26", role: "Dark canvas base" },
  { name: "moss-surface", cls: "bg-moss-surface", hex: "#143832", role: "Dark surface" },
  { name: "paper", cls: "bg-paper", hex: "#F4F1E8", role: "Two-tone film / light" },
  { name: "lime", cls: "bg-lime", hex: "#C7F36A", role: "The only CTA color" },
  { name: "volt", cls: "bg-volt", hex: "#E6F462", role: "Agent-active only" },
  { name: "amber", cls: "bg-amber", hex: "#E6A852", role: "Warning / queued" },
  { name: "cyan", cls: "bg-cyan", hex: "#6BC8D6", role: "Info / signal" },
  { name: "danger", cls: "bg-danger", hex: "#D14545", role: "Error / destructive" },
  { name: "ink", cls: "bg-ink", hex: "#0A1410", role: "Text on light / lime" },
];

const SPACING = [
  ["s-1", "4"],
  ["s-2", "8"],
  ["s-3", "12"],
  ["s-4", "16"],
  ["s-5", "24"],
  ["s-6", "32"],
  ["s-7", "48"],
  ["s-8", "64"],
];

const RADII = [
  ["sm", "rounded-sm"],
  ["md", "rounded-md"],
  ["lg", "rounded-lg"],
  ["xl", "rounded-xl"],
];

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <p className="eyebrow text-muted-foreground">{title}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 py-8 sm:py-10">
      <p className="eyebrow text-muted-foreground">01 / Foundations</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">Styleguide</h1>
      <p className="mt-2 max-w-[60ch] text-muted-foreground">
        The Ops Surfer system — one two-tone language across a light (paper) and
        dark (mossy glass) theme. Toggle the theme in the masthead; every token
        below flips with it.
      </p>

      {/* Palette */}
      <Block title="Palette">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {SWATCHES.map((s) => (
            <div key={s.name} className="surface overflow-hidden rounded-xl">
              <div className={`h-16 w-full ${s.cls}`} />
              <div className="p-3">
                <p className="text-sm font-medium">{s.name}</p>
                <p className="num text-xs text-muted-foreground">{s.hex}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{s.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Block>

      {/* Surfaces */}
      <Block title="Surfaces — the two-tone blend">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="surface flex h-24 items-center justify-center rounded-xl text-sm text-muted-foreground">
            surface
          </div>
          <div className="surface-2 flex h-24 items-center justify-center rounded-xl text-sm text-muted-foreground">
            surface-2
          </div>
          <div className="glass flex h-24 items-center justify-center rounded-xl text-sm text-foreground">
            glass (acrylic)
          </div>
        </div>
      </Block>

      {/* Type */}
      <Block title="Typography">
        <div className="glass rounded-2xl p-6">
          <p className="font-display text-5xl leading-tight">Operator clarity.</p>
          <p className="mt-1 font-display text-5xl leading-tight text-muted-foreground">
            Engineering authority.
          </p>
          <p className="eyebrow mt-4 text-muted-foreground">Display · DM Serif Display</p>
          <hr className="my-6 border-border" />
          <p className="max-w-[60ch] text-lg">
            Tell them what happened, what&apos;s next, and what they need to
            decide. Body copy is Manrope — comfortable, geometric, quietly
            confident.
          </p>
          <p className="eyebrow mt-3 text-muted-foreground">Body · Manrope</p>
          <hr className="my-6 border-border" />
          <p className="num font-mono text-sm text-muted-foreground">
            run·0042 · 14s · intent 0.94 · $125K
          </p>
          <p className="eyebrow mt-3 text-muted-foreground">Mono · JetBrains Mono</p>
        </div>
      </Block>

      {/* Components */}
      <Block title="Controls">
        <div className="glass flex flex-wrap items-center gap-3 rounded-2xl p-6">
          <button className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            Primary (lime)
          </button>
          <button className="surface rounded-full px-5 py-2.5 text-sm font-semibold">
            Surface
          </button>
          <button className="glass rounded-full px-5 py-2.5 text-sm font-semibold">
            Glass
          </button>
          <span className="surface rounded-full px-3 py-1 text-xs text-muted-foreground">
            chip
          </span>
          <span className="eyebrow flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-primary">
            <span className="size-1.5 animate-pulse-volt rounded-full bg-volt" />
            Agent active
          </span>
        </div>
      </Block>

      {/* Speech bubbles */}
      <Block title="Speech bubbles">
        <div className="glass flex flex-col gap-3 rounded-2xl p-6">
          <div className="bubble-human max-w-[75%] bg-paper px-5 py-3 text-ink">
            Saw your post on AI ops — open to a quick chat?
          </div>
          <div className="bubble-agent ml-auto max-w-[75%] bg-primary px-5 py-3 text-primary-foreground">
            Happy to chat. Two quick questions before we book time…
          </div>
        </div>
      </Block>

      {/* Spacing + radii */}
      <Block title="Spacing · 8-pt grid">
        <div className="glass flex flex-wrap items-end gap-4 rounded-2xl p-6">
          {SPACING.map(([name, px]) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div
                className="rounded bg-primary/70"
                style={{ width: `${px}px`, height: `${px}px` }}
              />
              <span className="num text-[11px] text-muted-foreground">{px}</span>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Radii">
        <div className="glass flex flex-wrap gap-4 rounded-2xl p-6">
          {RADII.map(([name, cls]) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div className={`surface size-16 ${cls}`} />
              <span className="text-[11px] text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>
      </Block>
    </div>
  );
}
