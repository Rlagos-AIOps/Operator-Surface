"use client";

import { toast } from "sonner";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge, type Tone } from "@/components/site/accents";
import { PageHeader } from "@/components/site/page-header";
import { BTN_GHOST, BTN_PRIMARY, LIFT, PANEL } from "@/components/site/surfaces";

const METRICS = [
  { label: "MRR", value: "$42,180", delta: "+8.2%", up: true },
  { label: "NRR", value: "118%", delta: "+3.1%", up: true },
  { label: "Agent uptime", value: "99.94%", delta: "−0.02%", up: false },
  { label: "Avg ROI / client", value: "6.4×", delta: "" },
];

const CLIENTS = [
  { name: "Northlake Capital", tier: "Enterprise", mrr: "$12,400", agents: 3, roi: "7.8×", risk: "low", status: "Active" },
  { name: "Forge & Co", tier: "Growth", mrr: "$8,900", agents: 2, roi: "6.1×", risk: "low", status: "Active" },
  { name: "Mercer Studio", tier: "Growth", mrr: "$6,200", agents: 2, roi: "5.4×", risk: "medium", status: "Active" },
  { name: "Halcyon Labs", tier: "Scale", mrr: "$7,480", agents: 1, roi: "6.9×", risk: "low", status: "Active" },
  { name: "Pier 9 Group", tier: "Starter", mrr: "$3,400", agents: 1, roi: "4.2×", risk: "high", status: "At risk" },
  { name: "Wynn Industries", tier: "Enterprise", mrr: "$3,800", agents: 1, roi: "8.6×", risk: "low", status: "Active" },
];

// Client intent on the cold→hot temperature scale — matches the lead intent
// system. "At risk" lives only on the red status badge (no doubled colors).
const INTENT: Record<string, { tone: Tone; label: string }> = {
  low: { tone: "cold", label: "Cold" },
  medium: { tone: "warm", label: "Warm" },
  high: { tone: "hot", label: "Hot" },
};

export default function ClientsPage() {
  const atRisk = CLIENTS.filter((c) => c.status !== "Active").length;
  return (
    <div className="px-5 py-8 sm:px-7 sm:py-10">
      <PageHeader
        eyebrow="Client success · Q2"
        title="Clients"
        chips={[
          { label: `${CLIENTS.length} active clients` },
          { label: `${atRisk} at risk`, tone: "bad" },
        ]}
        right={
          <>
            <button
              type="button"
              onClick={() => toast("Exported clients.csv")}
              className={cn(BTN_GHOST, "px-4 py-2 text-sm")}
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => toast("New engagement — opening intake")}
              className={cn(BTN_PRIMARY, "px-4 py-2 text-sm")}
            >
              <Plus className="size-4" strokeWidth={2} /> New engagement
            </button>
          </>
        }
      />

      {/* Metric cards — neutral (informational, not signals) */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m) => (
          <div key={m.label} className={cn(PANEL, "p-6")}>
            <p className="eyebrow text-muted-foreground">{m.label}</p>
            <p className="num mt-3 font-display text-4xl leading-none">{m.value}</p>
            {m.delta ? <p className="num mt-2 font-mono text-xs text-muted-foreground">{m.delta}</p> : null}
          </div>
        ))}
      </div>

      {/* Client cards (card-first, no table) */}
      <ul className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {CLIENTS.map((c) => (
          <li key={c.name} className={cn(PANEL, LIFT, "p-5 hover:border-good/70")}>
            <div className="flex items-center justify-between gap-3">
              <p className="truncate font-medium text-foreground">{c.name}</p>
              <Badge tone={c.status === "Active" ? "good" : "bad"} dot>
                {c.status}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {c.tier} · {c.agents} {c.agents === 1 ? "agent" : "agents"}
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4">
              <div>
                <p className="eyebrow text-muted-foreground">MRR</p>
                <p className="num mt-1.5 font-medium text-foreground">{c.mrr}</p>
              </div>
              <div>
                <p className="eyebrow text-muted-foreground">ROI</p>
                <p className="num mt-1.5 font-medium text-foreground">{c.roi}</p>
              </div>
              <div>
                <p className="eyebrow text-muted-foreground">Intent</p>
                <Badge tone={INTENT[c.risk].tone} dot className="mt-1">
                  {INTENT[c.risk].label}
                </Badge>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
