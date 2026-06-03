import {
  CircleDot,
  Command,
  Cpu,
  Filter,
  Inbox,
  LineChart,
  Pause,
  Play,
  Plus,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge, IconTile, Kbd, MiniBar, Pill, StatusDot, type Tone } from "@/components/site/accents";
import { LinkedinMark } from "@/components/site/nav-icons";
import { LIFT, METRIC_CHIP, PANEL } from "@/components/site/surfaces";
import { RADII } from "@/lib/tokens.generated";

// The signal grammar — color carries MEANING, never decoration.
const SIGNALS: { tone: Tone; name: string; means: string }[] = [
  { tone: "good", name: "Good", means: "active · success · running · shipped" },
  { tone: "hot", name: "Hot", means: "hot lead · urgent" },
  { tone: "warm", name: "Warm", means: "warm lead · caution" },
  { tone: "cold", name: "Cold", means: "cold lead · info signal" },
  { tone: "bad", name: "Bad", means: "error · blocked · destructive" },
  { tone: "pending", name: "Pending", means: "queued · draft · in-review · luminous gray" },
  { tone: "muted", name: "Idle", means: "disabled · grayed-out · dim gray" },
];

const SWATCH: Record<Tone, string> = {
  good: "bg-good",
  hot: "bg-hot",
  warm: "bg-warm",
  cold: "bg-cold",
  bad: "bg-bad",
  pending: "bg-pending",
  muted: "bg-muted-foreground",
};

const BASE = [
  { name: "emerald", cls: "bg-emerald", hex: "#1E5631", role: "Light canvas" },
  { name: "mossy", cls: "bg-mossy", hex: "#0F2A26", role: "Dark canvas" },
  { name: "paper", cls: "bg-paper", hex: "#F4F1E8", role: "Two-tone film" },
  { name: "ink", cls: "bg-ink", hex: "#0A1410", role: "Text on light/lime" },
];

// The operator icon vocabulary — one meaning each, thin-stroke. Deployed
// identically across the masthead, footer, and every operator surface.
const ICON_SET: { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; label: string }[] = [
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

function Block({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="eyebrow text-muted-foreground">{title}</p>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 py-8 sm:py-10">
      <p className="eyebrow text-muted-foreground">The Ops Surfer system</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">Styleguide</h1>
      <p className="mt-2 max-w-[64ch] text-muted-foreground">
        One modular, plug-and-play language across a light (paper-on-emerald) and dark (mossy) theme.
        Two rules run the whole system: <span className="text-foreground">color is a signal, never decoration</span>,
        and <span className="text-foreground">text stays one color — the elements around it get colored.</span>{" "}
        Toggle the theme in the masthead; every token below flips with it.
      </p>

      {/* THE SIGNAL GRAMMAR */}
      <Block title="Signals — color = meaning" hint="the spine of the system">
        <div className={cn(PANEL, "p-6")}>
          <ul className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            {SIGNALS.map((s) => (
              <li key={s.tone} className="flex items-center gap-3">
                <span className={cn("size-8 shrink-0 rounded-lg", SWATCH[s.tone])} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{s.name}</span>
                    <Badge tone={s.tone} dot>
                      {s.name}
                    </Badge>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{s.means}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Block>

      {/* BASE CANVAS */}
      <Block title="Canvas base">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {BASE.map((s) => (
            <div key={s.name} className="surface overflow-hidden rounded-xl">
              <div className={cn("h-16 w-full", s.cls)} />
              <div className="p-3">
                <p className="text-sm font-medium text-foreground">{s.name}</p>
                <p className="num text-xs text-muted-foreground">{s.hex}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{s.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Block>

      {/* THE KIT */}
      <Block title="The kit — components" hint="plug-and-play; swap & multiply">
        <div className={cn(PANEL, "grid gap-6 p-6")}>
          {/* Badges */}
          <div>
            <p className="eyebrow mb-3 text-muted-foreground">Badge · status / tier</p>
            <div className="flex flex-wrap gap-2">
              {SIGNALS.map((s) => (
                <Badge key={s.tone} tone={s.tone} dot>
                  {s.name}
                </Badge>
              ))}
            </div>
          </div>
          {/* Filter pills */}
          <div>
            <p className="eyebrow mb-3 text-muted-foreground">Filter pill · dashed = clickable</p>
            <div className="flex flex-wrap gap-2">
              <Pill active count={47}>
                All
              </Pill>
              <Pill count={18}>Hot</Pill>
              <Pill count={12}>Warm</Pill>
            </div>
          </div>
          {/* Status dots */}
          <div>
            <p className="eyebrow mb-3 text-muted-foreground">Status dot · pulse = has something to say</p>
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-2 text-sm text-foreground">
                <StatusDot tone="good" pulse /> live
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-foreground">
                <StatusDot tone="pending" /> queued
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-foreground">
                <StatusDot tone="bad" /> error
              </span>
            </div>
          </div>
          {/* Icon tiles */}
          <div>
            <p className="eyebrow mb-3 text-muted-foreground">Icon tile · thin-stroke, outlined</p>
            <div className="flex flex-wrap gap-2">
              <IconTile tone="good">
                <Cpu className="size-[18px]" strokeWidth={1.75} />
              </IconTile>
              <IconTile>
                <Send className="size-[18px]" strokeWidth={1.75} />
              </IconTile>
              <IconTile>
                <Search className="size-[18px]" strokeWidth={1.75} />
              </IconTile>
              <IconTile tone="warm">
                <Zap className="size-[18px]" strokeWidth={1.75} />
              </IconTile>
              <IconTile>
                <Sparkles className="size-[18px]" strokeWidth={1.75} />
              </IconTile>
            </div>
          </div>
          {/* Mini bars */}
          <div>
            <p className="eyebrow mb-3 text-muted-foreground">Load meter · tone-matched</p>
            <div className="grid max-w-sm gap-2.5">
              <MiniBar value={72} tone="good" />
              <MiniBar value={38} tone="warm" />
              <MiniBar value={12} tone="bad" />
            </div>
          </div>
          {/* Keys + chips */}
          <div>
            <p className="eyebrow mb-3 text-muted-foreground">Keys & chips</p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5">
                <Kbd>R</Kbd> <span className="text-xs text-muted-foreground">reply</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd> <span className="text-xs text-muted-foreground">command</span>
              </span>
              <span className={METRIC_CHIP}>
                <Command className="size-3 text-muted-foreground" /> neutral metric
              </span>
            </div>
          </div>
          {/* Buttons */}
          <div>
            <p className="eyebrow mb-3 text-muted-foreground">Buttons</p>
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                Primary
              </button>
              <button type="button" className="surface rounded-full px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2">
                Surface
              </button>
              <button type="button" className="dashed rounded-full px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-foreground/40">
                Dashed
              </button>
            </div>
          </div>
        </div>
      </Block>

      {/* ICON SET — the operator vocabulary */}
      <Block title="Icon set — the operator vocabulary" hint="one meaning each · thin-stroke">
        <div className={cn(PANEL, "p-6")}>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {ICON_SET.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <span className="grid aspect-square w-full place-items-center rounded-xl border border-border bg-surface text-foreground">
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <span className="num text-center font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Block>

      {/* SURFACES */}
      <Block title="Surfaces" hint="dot-grid panel · two-tone films · dashed">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className={cn(PANEL, LIFT, "flex h-24 items-center justify-center text-sm text-muted-foreground")}>panel · hover-float</div>
          <div className="surface flex h-24 items-center justify-center rounded-2xl text-sm text-muted-foreground">surface</div>
          <div className="surface-2 flex h-24 items-center justify-center rounded-2xl text-sm text-muted-foreground">surface-2</div>
          <div className="dashed flex h-24 items-center justify-center rounded-2xl text-sm text-muted-foreground">dashed</div>
        </div>
      </Block>

      {/* TYPE */}
      <Block title="Typography">
        <div className={cn(PANEL, "p-6")}>
          <p className="font-display text-5xl leading-tight">Operator clarity.</p>
          <p className="mt-1 font-display text-5xl leading-tight text-muted-foreground">Engineering authority.</p>
          <p className="eyebrow mt-4 text-muted-foreground">Display · DM Serif Display — money & headlines</p>
          <hr className="my-6 border-border" />
          <p className="max-w-[60ch] text-lg text-foreground">
            Tell them what happened, what&apos;s next, and what they need to decide. Body copy is Manrope — comfortable,
            geometric, quietly confident.
          </p>
          <p className="eyebrow mt-3 text-muted-foreground">Body · Manrope</p>
          <hr className="my-6 border-border" />
          <p className="num font-mono text-sm text-foreground">run·0042 · 14s · intent 0.94 · $125K</p>
          <p className="eyebrow mt-3 text-muted-foreground">Mono · JetBrains Mono — ops & metadata</p>
        </div>
      </Block>

      {/* SPEECH BUBBLES */}
      <Block title="Speech bubbles" hint="chat-first — the agent talks to you">
        <div className={cn(PANEL, "flex flex-col gap-3 p-6")}>
          <div className="bubble-human max-w-[75%] bg-paper px-5 py-3 text-ink">
            Saw your post on AI ops — open to a quick chat?
          </div>
          <div className="bubble-agent ml-auto max-w-[75%] bg-primary px-5 py-3 text-primary-foreground">
            Happy to chat. Two quick questions before we book time…
          </div>
        </div>
      </Block>

      {/* RADII */}
      <Block title="Radii · leaf-blade rounding">
        <div className={cn(PANEL, "flex flex-wrap gap-4 p-6")}>
          {RADII.map((r) => (
            <div key={r.name} className="flex flex-col items-center gap-2">
              <div className="surface-2 size-16" style={{ borderRadius: r.value }} />
              <span className="text-[11px] text-muted-foreground">{r.name}</span>
            </div>
          ))}
        </div>
      </Block>
    </div>
  );
}
