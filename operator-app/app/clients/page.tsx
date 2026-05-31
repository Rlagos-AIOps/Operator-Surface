"use client";

import { toast } from "sonner";
import { ArrowUpRight } from "lucide-react";

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

const RISK: Record<string, string> = {
  low: "text-primary",
  medium: "text-amber",
  high: "text-destructive",
};

export default function ClientsPage() {
  return (
    <div className="mx-auto max-w-[1320px] px-6 py-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-muted-foreground">Client success · Q2</p>
          <h1 className="mt-2 text-4xl sm:text-5xl">Clients</h1>
          <p className="mt-2 text-muted-foreground">
            6 active clients · 10 agents in production
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => toast("Exported clients.csv")}
            className="glass rounded-full px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2"
          >
            Export CSV
          </button>
          <button
            onClick={() => toast("New engagement — opening intake")}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-[transform,filter] hover:brightness-105 active:scale-[0.98]"
          >
            New engagement
            <ArrowUpRight className="size-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Metric cards */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m) => (
          <div key={m.label} className="glass rounded-2xl p-6">
            <p className="eyebrow text-muted-foreground">{m.label}</p>
            <div className="mt-3 flex items-end justify-between">
              <span className="num font-display text-4xl leading-none">{m.value}</span>
              {m.delta ? (
                <span
                  className={`num text-xs font-semibold ${
                    m.up ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {m.delta}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* Clients table */}
      <div className="glass mt-3 overflow-hidden rounded-2xl">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="eyebrow px-5 py-4 font-semibold">Client</th>
              <th className="eyebrow px-5 py-4 font-semibold">Tier</th>
              <th className="eyebrow px-5 py-4 text-right font-semibold">MRR</th>
              <th className="eyebrow px-5 py-4 text-right font-semibold">Agents</th>
              <th className="eyebrow px-5 py-4 text-right font-semibold">ROI</th>
              <th className="eyebrow px-5 py-4 font-semibold">Churn risk</th>
              <th className="eyebrow px-5 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {CLIENTS.map((c) => (
              <tr
                key={c.name}
                className="border-b border-border/60 transition-colors last:border-0 hover:bg-surface"
              >
                <td className="px-5 py-4 font-medium">{c.name}</td>
                <td className="px-5 py-4 text-muted-foreground">{c.tier}</td>
                <td className="num px-5 py-4 text-right">{c.mrr}</td>
                <td className="num px-5 py-4 text-right text-muted-foreground">{c.agents}</td>
                <td className="num px-5 py-4 text-right">{c.roi}</td>
                <td className={`px-5 py-4 font-medium capitalize ${RISK[c.risk]}`}>
                  {c.risk}
                </td>
                <td className="px-5 py-4">
                  <span className="surface rounded-full px-2.5 py-1 text-xs text-muted-foreground">
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
