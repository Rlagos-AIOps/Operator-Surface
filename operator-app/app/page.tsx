import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

const METRICS = [
  { label: "Agent runs / wk", value: "2,418", delta: "+12%" },
  { label: "Avg handle time", value: "14s", delta: "−31%" },
  { label: "Lead → reply", value: "92%", delta: "+4%" },
];

const STEPS = [
  "parsed 14 new inbound DMs",
  "scored intent · routed by ICP",
  "drafted 7 personalized replies",
];

const LOGOS = [
  "Northlake Capital",
  "Forge & Co",
  "Mercer Studio",
  "Halcyon Labs",
  "Pier 9 Group",
  "Wynn Industries",
];

const SURFACES = [
  { n: "01", title: "Triage what's worth your time", blurb: "Inbound DMs, intros and replies are scored against your ICP. The agent drafts, you approve in one keystroke.", href: "/app" },
  { n: "02", title: "Price every project on ROI", blurb: "Stop quoting day rates. The calculator builds price tags from the upside, not your calendar.", href: "/dashboard" },
  { n: "03", title: "Multi-agent delivery", blurb: "Spin up specialist agents per client. Watch them on a live board — pause, redirect, or take the wheel.", href: "/agents" },
  { n: "04", title: "Operator-grade copilot", blurb: "An agent on a second monitor, not a chatbot in a sidebar. Speaks first-person, takes orders, reports back.", href: "/app" },
  { n: "05", title: "Client success, by default", blurb: "Day-7 and day-30 check-ins, churn-risk flags, renewal triggers — scheduled the moment a contract closes.", href: "/clients" },
  { n: "06", title: "LinkedIn-native", blurb: "Built around the channel your inbound actually lives in. Native triage, no glue.", href: "/app" },
];

const PRICING = [
  { tier: "Solo", price: "$0", unit: "free forever", blurb: "For independents shipping their first AI engagement.", feats: ["1 active client", "1 agent", "Inbox + drafts", "Community support"], cta: "Start free", href: "/app", featured: false },
  { tier: "Operator", price: "$149", unit: "/mo · per seat", blurb: "For consultancies running 2–10 engagements at a time.", feats: ["Unlimited clients", "4 concurrent agents", "ROI pricing engine", "Slack + email connectors", "Priority support"], cta: "Launch operator app", href: "/app", featured: true },
  { tier: "Studio", price: "Talk to us", unit: "annual contract", blurb: "For multi-operator shops with custom agents.", feats: ["Everything in Operator", "Unlimited agents", "Custom agent SDK", "SSO + audit log", "Dedicated success lead"], cta: "Book a call", href: "/clients", featured: false },
];

const SECTION = "mx-auto max-w-[1320px] px-6";

export default function HomePage() {
  return (
    <div className="pb-24">
      {/* ------------------------------------------------- Hero (two-column) */}
      <section className="relative overflow-hidden">
        <div className="wave-field pointer-events-none absolute inset-0 -z-10 opacity-70" />
        <div className={`${SECTION} grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr]`}>
          {/* Left */}
          <div>
            <p className="eyebrow flex items-center gap-2 text-primary">
              <span className="size-1.5 rounded-full bg-volt" />
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
              <Link
                href="/app"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-[transform,filter] hover:brightness-105 active:scale-[0.98]"
              >
                Launch the operator app
                <ArrowUpRight className="size-4" strokeWidth={2} />
              </Link>
              <Link
                href="/dashboard"
                className="surface rounded-full px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2"
              >
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
                  <p className="num mt-1 text-xs font-semibold text-primary">
                    {m.delta}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — agent terminal card */}
          <div className="surface rounded-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="eyebrow flex items-center gap-2 text-primary">
                <span className="size-1.5 animate-pulse-volt rounded-full bg-volt" />
                Agent active
              </span>
              <span className="num font-mono text-xs text-muted-foreground">
                run · 0042
              </span>
            </div>
            <p className="mt-6 font-display text-2xl leading-tight sm:text-3xl">
              “I flagged 3 leads as cold and drafted replies for the other 7.”
            </p>
            <ul className="mt-7 grid gap-2.5">
              {STEPS.map((s) => (
                <li key={s} className="flex items-center gap-2.5 font-mono text-sm text-muted-foreground">
                  <Check className="size-4 text-primary" strokeWidth={2.5} />
                  {s}
                </li>
              ))}
              <li className="flex items-center gap-2.5 font-mono text-sm text-muted-foreground">
                <span className="size-1.5 animate-pulse-volt rounded-full bg-volt" />
                awaiting operator review
              </li>
            </ul>
            <div className="mt-7 flex items-center justify-between border-t border-border pt-5">
              <span className="num font-mono text-xs text-muted-foreground">
                14s · 1 reviewer pending
              </span>
              <Link
                href="/app"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-[transform,filter] hover:brightness-105 active:scale-[0.98]"
              >
                Review 7 drafts
                <ArrowUpRight className="size-3.5" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Logo wall */}
      <section className={SECTION}>
        <div className="flex flex-col gap-6 border-y border-border py-6 lg:flex-row lg:items-center lg:justify-between">
          <span className="eyebrow shrink-0 text-muted-foreground">
            Run by operators at
          </span>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {LOGOS.map((l) => (
              <span key={l} className="font-display text-lg text-muted-foreground">
                {l}
              </span>
            ))}
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
          {SURFACES.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className="group bg-surface p-7 transition-colors hover:bg-surface-2"
            >
              <div className="flex items-center justify-between">
                <span className="num font-mono text-xs text-primary">{s.n}</span>
                <ArrowUpRight
                  className="size-4 text-muted-foreground transition-colors group-hover:text-primary"
                  strokeWidth={2}
                />
              </div>
              <h3 className="mt-5 font-display text-2xl leading-tight">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.blurb}
              </p>
            </Link>
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
              className={`rounded-2xl p-7 ${
                p.featured
                  ? "border border-primary/60 bg-surface-2 shadow-[0_0_0_1px_var(--color-primary)]"
                  : "surface"
              }`}
            >
              <p className="eyebrow text-muted-foreground">{p.tier}</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="num font-display text-4xl leading-none">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.unit}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{p.blurb}</p>
              <ul className="mt-6 grid gap-2.5 border-t border-border pt-5">
                {p.feats.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check className="size-4 shrink-0 text-primary" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={p.href}
                className={`mt-7 inline-flex w-full items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-[transform,filter] active:scale-[0.98] ${
                  p.featured
                    ? "bg-primary text-primary-foreground hover:brightness-105"
                    : "surface hover:bg-surface-2"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- CTA band */}
      <section className={`${SECTION} mt-20`}>
        <div className="surface relative overflow-hidden rounded-2xl px-8 py-14 sm:px-12">
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
            <Link
              href="/app"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-[transform,filter] hover:brightness-105 active:scale-[0.98]"
            >
              Launch app
              <ArrowUpRight className="size-4" strokeWidth={2} />
            </Link>
            <Link
              href="/styleguide"
              className="surface rounded-full px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2"
            >
              Styleguide
            </Link>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Footer */}
      <footer className={`${SECTION} mt-16`}>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border py-8 font-mono text-xs uppercase tracking-wider text-muted-foreground sm:flex-row">
          <span>Ops Surfer · v0.4 · 2026</span>
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-volt" />
            Agent online · last sync 14s ago
          </span>
        </div>
      </footer>
    </div>
  );
}
