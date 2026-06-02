"use client";

import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { IntentChip } from "./intent-chip";
import { LEAD_TAGS, type Lead } from "@/lib/data";

export function LeadQueue({
  leads,
  selectedId,
  onSelect,
}: {
  leads: Lead[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-baseline justify-between px-6 py-5">
        <h2 className="flex items-center gap-2 font-display text-2xl">
          <Inbox className="size-[18px] text-muted-foreground" strokeWidth={1.75} />
          Inbound queue
        </h2>
        <span className="num text-[13px] text-muted-foreground">{leads.length} threads</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {leads.length === 0 && (
          <p className="px-6 py-8 text-[13px] text-muted-foreground">
            No threads match this filter.
          </p>
        )}
        {leads.map((lead) => {
          const isSel = lead.id === selectedId;
          return (
            <button
              key={lead.id}
              onClick={() => onSelect(lead.id)}
              aria-current={isSel ? "true" : undefined}
              className={cn(
                "flex w-full flex-col gap-2 border-l-2 px-6 py-4 text-left transition-colors duration-200 [transition-timing-function:var(--ease-snap)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:outline-none",
                isSel
                  ? "border-l-good bg-good/[0.08]"
                  : "border-l-transparent hover:border-l-good/50 hover:bg-foreground/[0.04]"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-2 font-display text-sm text-foreground"
                >
                  {lead.name.charAt(0)}
                </span>
                <span className="flex-1 truncate text-sm font-semibold text-foreground">
                  {lead.name}
                </span>
                <IntentChip intent={lead.intent} score={lead.score} />
              </div>
              <p className="truncate pl-11 text-[13px] text-muted-foreground">{lead.preview}</p>
              <div className="flex flex-wrap items-center gap-1.5 pl-11">
                {LEAD_TAGS[lead.id]?.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border-strong/70 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
                <span className="num ml-auto shrink-0 text-[11px] text-muted-foreground">
                  {lead.role} · {lead.time}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
