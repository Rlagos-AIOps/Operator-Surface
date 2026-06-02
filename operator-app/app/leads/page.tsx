import Link from "next/link";
import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge, MiniBar, type Tone } from "@/components/site/accents";
import { IntentChip } from "@/components/operator/intent-chip";
import { PageHeader } from "@/components/site/page-header";
import { BTN_GHOST, BTN_PRIMARY, LIFT, PANEL } from "@/components/site/surfaces";
import { LEADS, type Intent } from "@/lib/data";

// Lead intent rides the cold→hot temperature scale — same system as the
// operator queue IntentChip and the clients intent tag.
const INTENT_TONE: Record<Intent, Tone> = { high: "hot", mid: "warm", cold: "cold" };

const TIERS: { intent: Intent; tone: Tone; label: string; range: string; guidance: string }[] = [
  { intent: "high", tone: "hot", label: "Hot", range: "80–100", guidance: "Decision-maker, concrete pain, urgency. Reply within the hour." },
  { intent: "mid", tone: "warm", label: "Warm", range: "50–79", guidance: "Real interest, no deadline. Reply thoughtfully — no rush." },
  { intent: "cold", tone: "cold", label: "Cold", range: "0–49", guidance: "Low buying signal. Nurture with value, don't push a call." },
];

const TIER_GLOW: Record<Tone, string> = {
  hot: "glow-edge-hot border-hot/40",
  warm: "glow-edge-warm border-warm/40",
  cold: "glow-edge-cold border-cold/40",
  good: "",
  bad: "",
  pending: "",
  muted: "",
};

export default function LeadsPage() {
  const hot = LEADS.filter((l) => l.intent === "high").length;
  const sorted = [...LEADS].sort((a, b) => b.score - a.score);

  return (
    <div className="px-5 py-8 sm:px-7 sm:py-10">
      <PageHeader
        eyebrow="Inbound pipeline · LinkedIn"
        title="Leads"
        chips={[{ label: `${LEADS.length} leads` }, { label: `${hot} hot`, tone: "hot" }]}
        right={
          <>
            <button type="button" className={cn(BTN_GHOST, "px-4 py-2 text-sm")}>
              Export CSV
            </button>
            <Link href="/app" className={cn(BTN_PRIMARY, "px-4 py-2 text-sm")}>
              <Terminal className="size-4" strokeWidth={2} />
              Open in operator
            </Link>
          </>
        }
      />

      {/* Intent tiers — the temperature system, with live counts */}
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {TIERS.map((t) => {
          const leads = LEADS.filter((l) => l.intent === t.intent);
          const avg = leads.length ? Math.round(leads.reduce((s, l) => s + l.score, 0) / leads.length) : 0;
          return (
            <div key={t.label} className={cn("rounded-2xl border bg-card p-5", TIER_GLOW[t.tone])}>
              <div className="flex items-center justify-between gap-2">
                <Badge tone={t.tone} dot>
                  {t.label}
                </Badge>
                <span className="num font-mono text-xs text-muted-foreground">{t.range}</span>
              </div>
              <p className="num mt-4 font-display text-4xl leading-none">{leads.length}</p>
              <p className="num mt-1.5 font-mono text-xs text-muted-foreground">
                {leads.length === 1 ? "lead" : "leads"} · avg {avg}
              </p>
              <p className="mt-3 text-base leading-relaxed text-foreground">{t.guidance}</p>
            </div>
          );
        })}
      </div>

      {/* Leads — sorted hottest first; each carries its intent tag + score bar */}
      <ul className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {sorted.map((lead) => (
          <li key={lead.id}>
            <Link href="/app" className={cn(PANEL, LIFT, "block p-5 hover:border-good/70")}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-2 font-display text-base text-foreground"
                  >
                    {lead.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{lead.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {lead.role} · {lead.company}
                    </p>
                  </div>
                </div>
                <IntentChip intent={lead.intent} score={lead.score} />
              </div>

              <p className="mt-4 line-clamp-2 text-base leading-relaxed text-foreground">{lead.message}</p>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-muted-foreground">Intent</span>
                  <span className="num font-mono text-xs text-muted-foreground">{lead.score}/100</span>
                </div>
                <MiniBar value={lead.score} tone={INTENT_TONE[lead.intent]} className="mt-2 h-1.5" />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
                <span className="rounded-full border border-border-strong/60 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  {lead.stage}
                </span>
                <span className="num shrink-0 font-mono text-xs text-muted-foreground">{lead.time}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
