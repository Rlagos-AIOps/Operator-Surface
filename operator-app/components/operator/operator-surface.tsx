"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { MetricRow } from "./metric-row";
import { LeadQueue } from "./lead-queue";
import { ThreadView } from "./thread-view";
import { Composer } from "./composer";
import { LEADS } from "@/lib/data";

const SOON_LABELS: Record<string, string> = {
  pipeline: "Pipeline",
  clients: "Clients",
  scoping: "Scoping",
  pricing: "ROI Pricing",
  agents: "Agents",
};

export function OperatorSurface() {
  const fallbackLead = LEADS.at(0);
  const [activeNav, setActiveNav] = useState("inbox");
  const [selectedId, setSelectedId] = useState(() => fallbackLead?.id ?? "");
  const [highIntentOnly, setHighIntentOnly] = useState(false);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());

  const visibleLeads = highIntentOnly
    ? LEADS.filter((l) => l.intent === "high")
    : LEADS;
  const selected =
    visibleLeads.find((l) => l.id === selectedId) ?? visibleLeads[0] ?? fallbackLead;

  if (!selected) {
    return null;
  }

  function handleNav(id: string) {
    if (id === "inbox") {
      setActiveNav(id);
      return;
    }
    toast(`${SOON_LABELS[id] ?? id} is coming soon`);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar active={activeNav} onNav={handleNav} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          highIntentOnly={highIntentOnly}
          onToggleFilter={() => setHighIntentOnly((v) => !v)}
        />
        <MetricRow />
        <div className="flex min-h-0 flex-1 flex-col border-t border-paper/8 lg:grid lg:grid-cols-[minmax(320px,380px)_1fr]">
          <div className="flex max-h-[44vh] min-h-0 flex-col lg:h-full lg:max-h-none">
            <LeadQueue
              leads={visibleLeads}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:h-full">
            <ThreadView lead={selected} />
            <Composer
              lead={selected}
              sent={sentIds.has(selected.id)}
              rejected={rejectedIds.has(selected.id)}
              onApprove={() =>
                setSentIds((s) => new Set(s).add(selected.id))
              }
              onReject={() =>
                setRejectedIds((s) => new Set(s).add(selected.id))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
