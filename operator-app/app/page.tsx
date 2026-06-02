import type { ComponentType } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, CircleDot, Cpu, Inbox, LineChart, Send, Sparkles, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Bubble } from "@/components/operator/bubble";
import { StatusDot } from "@/components/site/accents";
import { LinkedinMark } from "@/components/site/nav-icons";
import { BTN_GHOST, BTN_PRIMARY, METRIC_CHIP, PANEL } from "@/components/site/surfaces";

const METRICS = [
  { label: "Agent runs / wk", value: "2,418", delta: "+12%" },
  { label: "Avg handle time", value: "14s", delta: "−31%" },
  { label: "Lead → reply", value: "92%", delta: "+4%" },
];

const LOGOS = [
  "Northlake Capital",
  "Forge & Co",
  "Mercer Studio",
  "Halcyon Labs",
  "Pier 9 Group",
  "Wynn Industries",
];

// Each surface carries its icon from the operator vocabulary (nav-icons set).
type Surface = { n: string; icon: ComponentType<{ className?: string; strokeWidth?: number }>; title: string; blurb: string; href: string };
const SURFACES: Surface[] = [
  { n: "01", icon: Inbox, title: "Triage what's worth your time", blurb: "Inbound DMs, intros and replies are scored against your ICP. The agent drafts, you approve in one keystroke.", href: "/app" },
  { n: "02", icon: LineChart, title: "Price every project on ROI", blurb: "Stop quoting day rates. The engine builds price tags from the upside, not your calendar.", href: "/roi" },
  { n: "03", icon: Cpu, title: "Multi-agent delivery", blurb: "Spin up specialist agents per client. Watch them on a live board — pause, redirect, or take the wheel.", href: "/agents" },
  { n: "04", icon: Sparkles, title: "Operator-grade copilot", blurb: "An agent on a second monitor, not a chatbot in a sidebar. Speaks first-person, takes orders, reports back.", href: "/app" },
  { n: "05", icon: CircleDot, title: "Client success, by default", blurb: "Day-7 and day-30 check-ins, churn-risk flags, renewal triggers — scheduled the moment a contract closes.", href: "/clients" },
  { n: "06", icon: LinkedinMark, title: "LinkedIn-native", blurb: "Built around the channel your inbound actually lives in. Native triage, no glue.", href: "/app" },
];

const PRICING = [
  { tier: "Solo", price: "$0", unit: "free forever", blurb: "For independents shipping their first AI engagement.", feats: ["1 active client", "1 agent", "Inbox + drafts", "Community support"], cta: "Start free", href: "/app", featured: false },
  { tier: "Operator", price: "$149", unit: "/mo · per seat", blurb: "For consultancies running 2–10 engagements at a time.", feats: ["Unlimited clients", "4 concurrent agents", "ROI pricing engine", "Slack + email connectors", "Priority support"], cta: "Launch operator app", href: "/app", featured: true },
  { tier: "Studio", price: "Talk to us", unit: "annual contract", blurb: "For multi-operator shops with custom agents.", feats: ["Everything in Operator", "Unlimited agents", "Custom agent SDK", "SSO + audit log", "Dedicated success lead"], cta: "Book a call", href: "/clients", featured: false },
];

const SECTION = "px-5 sm:px-7";

export default function HomePage() {
  return (
    <div className="pb-24">
      {/* ------------------------------------------------- Hero (two-column) */}
      <section className="relative overflow-hidden">
        <div className="wave-field pointer-events-none absolute inset-0 -z-10 opacity-70" />
        <div className={`${SECTION} grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr]`}>
          {/* Left — the pitch */}
          <div>
            <p className="eyebrow flex items-center gap-2 text-primary">
              <span className="size-1.5 rounded-full bg-good" />
              Client success platform for AI consultancies
            </p>
            <h1 className="mt-6 text-[44px] leading-[0.98] sm:text-6xl">
              Run your consultancy like an{" "}
              <span className="italic text-primary">operator</span>, not a
              corporate.
            </h1>
            <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-muted-foreground">
              Ops Surfer gives you the client CRM, ROI-backed pricing, and a
              multi-agent delivery layer to scale an AI consultancy — without
              hiring a project manager.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/app" className={cn(BTN_PRIMARY, "px-5 py-3 text-sm")}>
                <Terminal className="size-4" strokeWidth={2} />
                Launch the operator app
              </Link>
              <Link href="/dashboard" className={cn(BTN_GHOST, "px-5 py-3 text-sm")}>
                <LineChart className="size-4" strokeWidth={1.75} />
                See the dashboard
              </Link>
            </div>
            <p className="eyebrow mt-6 text-muted-foreground">
              No credit card · 14-day trial
            </p>

            {/* inline metrics */}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-6">
              {METRICS.map((m) => (
                <div key={m.label}>
                  <p className="eyebrow text-muted-foreground">{m.label}</p>
                  <p className="num mt-2 font-display text-3xl leading-none sm:text-4xl">
                    {m.value}
                  </p>
                  <p className="num mt-1 text-xs font-semibold text-muted-foreground">
                    {m.delta}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — the signature shapes: a live inbound-triage vignette */}
          <div className={cn(PANEL, "flex flex-col gap-3.5 p-6 sm:p-7")}>
            <div className="flex items-center justify-between">
              <span className="eyebrow flex items-center gap-2 text-foreground">
                <StatusDot tone="good" pulse className="size-1.5" />
                Inbound · LinkedIn
              </span>
              <span className="num font-mono text-xs text-muted-foreground">run · 0042</span>
            </div>

            <Bubble from="human">
              Saw your post on AI ops for inbound triage. We get ~200 LinkedIn DMs / week and miss most of them. Open to a quick chat?
            </Bubble>
            <Bubble from="reasoning">
              Intent score 0.84 · Persona match (RevOps · mid-market) · Mentions concrete pain (volume + miss rate). Worth a fast reply with two scoping qs.
            </Bubble>
            <Bubble from="agent">
              Happy to chat. Two quick questions before we book time: (1) what&apos;s your average response time today, and (2) is the bottleneck triage, drafting, or both?
            </Bubble>

            <div className="mt-1 flex items-center justify-between border-t border-[color:var(--surface-edge)] pt-4">
              <span className="num font-mono text-xs text-muted-foreground">confidence 0.84 · 312 tokens</span>
              <Link href="/app" className={cn(BTN_PRIMARY, "px-4 py-2 text-xs")}>
                <Send className="size-3.5" strokeWidth={1.75} />
                Approve &amp; send
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Logo wall */}
      <section className={SECTION}>
        <div className="border-y border-border py-6">
          <p className="eyebrow text-muted-foreground">Run by operators at</p>
          {/* names scroll — label sits above the track; edges fade, pauses on hover */}
          <div className="mt-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]">
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
              {[0, 1].map((dup) => (
                <div key={dup} aria-hidden={dup === 1} className="flex shrink-0 items-center gap-x-12 pr-12">
                  {LOGOS.map((l) => (
                    <span key={l} className="whitespace-nowrap font-display text-lg text-muted-foreground">
                      {l}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- Six surfaces */}
      <section className={`${SECTION} mt-20`}>
        <p className="eyebrow text-primary">What&apos;s inside</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-4xl sm:text-5xl">Six surfaces, one operator</h2>
          <p className="eyebrow text-muted-foreground">↳ each ships with its own agent</p>
        </div>
        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border sm:grid-cols-2 lg:grid-cols-3">
          {SURFACES.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.title}
                href={s.href}
                className="dot-grid group bg-surface p-7 transition-colors hover:bg-surface-2"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl border border-border bg-card text-foreground transition-colors group-hover:border-good/60">
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <ArrowUpRight
                    className="size-4 text-muted-foreground transition-colors group-hover:text-primary"
                    strokeWidth={2}
                  />
                </div>
                <p className="eyebrow mt-5 text-primary">{s.n}</p>
                <h3 className="mt-2 font-display text-2xl leading-tight">{s.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                  {s.blurb}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* -------------------------------------------- ROI-backed pricing */}
      <section className={`${SECTION} mt-20`}>
        <p className="eyebrow text-primary">ROI-backed pricing</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <h2 className="max-w-[18ch] text-4xl sm:text-5xl">Price on outcomes, not hours.</h2>
          <p className="eyebrow text-muted-foreground">↳ your fee is a share of the upside</p>
        </div>
        <div className="mt-8 grid gap-3 lg:grid-cols-3">
          {[
            { n: "01", title: "Identify the upside", blurb: "The agent models the annual value an engagement unlocks — revenue, hours saved, risk removed." },
            { n: "02", title: "Price as a share of it", blurb: "Your fee is a fixed % of Y1 upside, not a day rate. Default 15%, tuned per client." },
            { n: "03", title: "Prove the ROI", blurb: "The client sees their multiple before they sign. Every renewal re-scores against actuals." },
          ].map((s) => (
            <div key={s.n} className={cn(PANEL, "p-7")}>
              <p className="eyebrow text-primary">{s.n}</p>
              <h3 className="mt-2 font-display text-2xl leading-tight">{s.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">{s.blurb}</p>
            </div>
          ))}
        </div>
        {/* worked example — the value chain */}
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-3 rounded-2xl border border-[color:var(--surface-edge)] bg-card p-6">
          <span className="mr-1 font-medium text-foreground">Halcyon Labs</span>
          {[
            { label: "Annual upside", value: "$124K" },
            { label: "Fee rate", value: "15%" },
            { label: "Engagement price", value: "$18.4K" },
            { label: "Client ROI", value: "6.7×", strong: true },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center gap-x-2">
              {i > 0 && <ArrowRight className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />}
              <div
                className={cn(
                  "rounded-xl border px-3 py-2",
                  step.strong ? "border-good/40 bg-good/[0.08] glow-edge-good" : "border-[color:var(--surface-edge)] bg-surface",
                )}
              >
                <p className="eyebrow text-muted-foreground">{step.label}</p>
                <p className="num mt-1 font-display text-xl leading-none">{step.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- Pricing */}
      <section className={`${SECTION} mt-20`}>
        <p className="eyebrow text-primary">Pricing</p>
        <h2 className="mt-3 text-4xl sm:text-5xl">Priced like a tool, not a platform</h2>
        <div className="mt-8 grid gap-3 lg:grid-cols-3">
          {PRICING.map((p) => (
            <div
              key={p.tier}
              className={cn(
                PANEL,
                "p-7 transition-[transform,box-shadow,border-color] duration-300 [transition-timing-function:var(--ease-snap)] hover:-translate-y-2 hover:border-good/70 hover:shadow-[var(--shadow-3)]",
                p.featured && "border-primary/60 bg-surface-2 glow-edge-good",
              )}
            >
              <p className="eyebrow text-muted-foreground">{p.tier}</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="num font-display text-4xl leading-none">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.unit}</span>
              </div>
              <p className="mt-3 text-base text-muted-foreground">{p.blurb}</p>
              <ul className="mt-6 grid gap-2.5 border-t border-border pt-5">
                {p.feats.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-base text-foreground">
                    <Check className="size-4 shrink-0 text-good" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={p.href} className={cn(p.featured ? BTN_PRIMARY : BTN_GHOST, "mt-7 w-full px-5 py-2.5 text-sm")}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- CTA band */}
      <section className={`${SECTION} mt-20`}>
        <div className={cn(PANEL, "relative overflow-hidden px-8 py-14 sm:px-12")}>
          <div className="wave-field pointer-events-none absolute inset-0 -z-10 opacity-60" />
          <p className="eyebrow text-primary">Get started</p>
          <h2 className="mt-4 max-w-[16ch] text-4xl sm:text-5xl">
            Your next engagement could ship{" "}
            <span className="italic text-primary">by Friday.</span>
          </h2>
          <p className="mt-4 max-w-[56ch] text-muted-foreground">
            Drop in your LinkedIn inbox and your top 5 ICP criteria. The triage
            agent starts learning your taste within an hour.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/app" className={cn(BTN_PRIMARY, "px-5 py-3 text-sm")}>
              <Terminal className="size-4" strokeWidth={2} />
              Launch app
            </Link>
            <Link href="/styleguide" className={cn(BTN_GHOST, "px-5 py-3 text-sm")}>
              <Sparkles className="size-4" strokeWidth={1.75} />
              Styleguide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
