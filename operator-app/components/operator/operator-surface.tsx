"use client";

import { useState } from "react";
import { TopBar } from "./top-bar";
import { MetricRow } from "./metric-row";
import { LeadQueue } from "./lead-queue";
import { ThreadView } from "./thread-view";
import { Composer } from "./composer";
import { LEADS } from "@/lib/data";

// The operator surface now lives under the global masthead (no side pane).
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
    <div className="flex h-[calc(100dvh-4.75rem)] flex-col overflow-hidden">
      <TopBar
        highIntentOnly={highIntentOnly}
        onToggleFilter={() => setHighIntentOnly((v) => !v)}
      />
      <MetricRow />
      <div className="flex min-h-0 flex-1 flex-col border-t border-border lg:grid lg:grid-cols-[minmax(320px,380px)_1fr]">
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
            onApprove={() => setSentIds((s) => new Set(s).add(selected.id))}
            onReject={() => setRejectedIds((s) => new Set(s).add(selected.id))}
          />
        </div>
      </div>
    </div>
  );
}
