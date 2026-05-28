"use client";

import { cn } from "@/lib/utils";
import { IntentChip } from "./intent-chip";
import type { Lead } from "@/lib/data";

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
    <div className="flex h-full flex-col overflow-hidden border-b border-paper/8 lg:border-b-0 lg:border-r">
      <div className="flex items-baseline justify-between px-6 py-5">
        <h2 className="font-serif text-2xl text-paper">Inbound queue</h2>
        <span className="text-[13px] text-muted-foreground tabular-nums">
          {leads.length} threads
        </span>
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
                "flex w-full flex-col gap-2 border-l-2 px-6 py-4 text-left transition-colors focus-visible:ring-2 focus-visible:ring-volt focus-visible:ring-inset focus-visible:outline-none",
                isSel
                  ? "border-l-lime bg-lime/[0.07]"
                  : "border-l-transparent hover:bg-paper/[0.03]"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-2 font-serif text-sm text-paper"
                >
                  {lead.name.charAt(0)}
                </span>
                <span className="flex-1 truncate text-sm font-semibold text-paper">
                  {lead.name}
                </span>
                <IntentChip intent={lead.intent} score={lead.score} />
              </div>
              <p className="truncate pl-11 text-[13px] text-paper/85">
                {lead.preview}
              </p>
              <p className="pl-11 text-[11px] text-muted-foreground">
                {lead.role} · {lead.time}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
