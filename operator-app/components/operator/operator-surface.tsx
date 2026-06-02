"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PANEL } from "@/components/site/surfaces";
import { TopBar } from "./top-bar";
import { MetricRow } from "./metric-row";
import { LeadQueue } from "./lead-queue";
import { ThreadView } from "./thread-view";
import { Composer } from "./composer";
import { AgentChat } from "./agent-chat";
import { LEADS } from "@/lib/data";

// The operator surface — a console of rounded panels under the global masthead.
export function OperatorSurface() {
  const fallbackLead = LEADS.at(0);
  const [selectedId, setSelectedId] = useState(() => fallbackLead?.id ?? "");
  const [highIntentOnly, setHighIntentOnly] = useState(false);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());

  const visibleLeads = highIntentOnly
    ? LEADS.filter((l) => l.intent === "high")
    : LEADS;
  const selected =
    visibleLeads.find((l) => l.id === selectedId) ??
    visibleLeads[0] ??
    fallbackLead;

  if (!selected) {
    return null;
  }

  return (
    <div className="flex flex-col pb-7">
      <TopBar
        highIntentOnly={highIntentOnly}
        onToggleFilter={() => setHighIntentOnly((v) => !v)}
      />
      <MetricRow />
      <div className="grid gap-3 px-7 lg:h-[720px] lg:grid-cols-[minmax(300px,360px)_1fr_minmax(320px,380px)]">
        <div className={cn(PANEL, "flex max-h-[60vh] min-h-0 flex-col overflow-hidden lg:max-h-none")}>
          <LeadQueue
            leads={visibleLeads}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
        <div className={cn(PANEL, "flex min-h-0 flex-col overflow-hidden")}>
          <ThreadView lead={selected} />
          <Composer
            lead={selected}
            sent={sentIds.has(selected.id)}
            rejected={rejectedIds.has(selected.id)}
            onApprove={() => setSentIds((s) => new Set(s).add(selected.id))}
            onReject={() => setRejectedIds((s) => new Set(s).add(selected.id))}
          />
        </div>
        <div className={cn(PANEL, "flex min-h-0 flex-col overflow-hidden")}>
          <AgentChat lead={selected} />
        </div>
      </div>
    </div>
  );
}
