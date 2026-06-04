"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { PANEL } from "@/components/site/surfaces";
import { TopBar } from "./top-bar";
import { MetricRow } from "./metric-row";
import { LeadQueue } from "./lead-queue";
import { ThreadView } from "./thread-view";
import { Composer } from "./composer";
import { GalileoConsole } from "@/components/galileo/GalileoConsole";
import type { Lead } from "@/lib/data";
import { decideApproval } from "@/app/approvals/actions";

type OperatorConfig = {
  /** Toggle which panels render — omit any key to keep it on. */
  panels?: {
    topBar?: boolean;
    metrics?: boolean;
    queue?: boolean;
    thread?: boolean;
    composer?: boolean;
    copilot?: boolean;
  };
  /** Inject content above the console (e.g. a custom banner). */
  slots?: { header?: ReactNode };
};

// The operator surface — a console of rounded panels under the global masthead.
// `config` lets a consumer recompose which panels appear (modularization); the
// default renders the full console unchanged.
export function OperatorSurface({
  className,
  config,
  leads = [],
}: {
  className?: string;
  config?: OperatorConfig;
  leads?: Lead[];
} = {}) {
  const panels = {
    topBar: true,
    metrics: true,
    queue: true,
    thread: true,
    composer: true,
    copilot: true,
    ...config?.panels,
  };
  const fallbackLead = leads.at(0);
  const [selectedId, setSelectedId] = useState(() => fallbackLead?.id ?? "");
  const [highIntentOnly, setHighIntentOnly] = useState(false);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());

  const visibleLeads = highIntentOnly
    ? leads.filter((l) => l.intent === "high")
    : leads;
  const selected =
    visibleLeads.find((l) => l.id === selectedId) ??
    visibleLeads[0] ??
    fallbackLead;

  if (!selected) {
    return null;
  }

  return (
    <div className={cn("flex flex-col pb-7", className)}>
      {config?.slots?.header}
      {panels.topBar && (
        <TopBar
          highIntentOnly={highIntentOnly}
          onToggleFilter={() => setHighIntentOnly((v) => !v)}
        />
      )}
      {panels.metrics && <MetricRow />}
      <div className="grid gap-3 px-7 lg:h-[720px] lg:grid-cols-[minmax(300px,360px)_1fr_minmax(320px,380px)]">
        {panels.queue && (
          <div className={cn(PANEL, "flex max-h-[60vh] min-h-0 flex-col overflow-hidden lg:max-h-none")}>
            <LeadQueue
              leads={visibleLeads}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        )}
        {(panels.thread || panels.composer) && (
          <div className={cn(PANEL, "flex min-h-0 flex-col overflow-hidden")}>
            {panels.thread && <ThreadView lead={selected} />}
            {panels.composer && (
              <Composer
                lead={selected}
                sent={sentIds.has(selected.id)}
                rejected={rejectedIds.has(selected.id)}
                onApprove={() => {
                  setSentIds((s) => new Set(s).add(selected.id));
                  void decideApproval(selected.id, "approved");
                }}
                onReject={() => {
                  setRejectedIds((s) => new Set(s).add(selected.id));
                  void decideApproval(selected.id, "rejected");
                }}
              />
            )}
          </div>
        )}
        {panels.copilot && (
          <div className={cn(PANEL, "flex min-h-0 flex-col overflow-hidden")}>
            <GalileoConsole embedded lockedAccount={selected.company} accounts={[]} />
          </div>
        )}
      </div>
    </div>
  );
}
