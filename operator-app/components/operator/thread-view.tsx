import { Bubble } from "./bubble";
import { Badge } from "@/components/site/accents";
import type { Lead } from "@/lib/data";

export function ThreadView({ lead }: { lead: Lead }) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center gap-3.5 border-b border-[color:var(--surface-edge)] px-7 py-5">
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-2 font-display text-lg text-foreground"
        >
          {lead.name.charAt(0)}
        </span>
        <div className="flex-1">
          <div className="font-display text-[22px] leading-tight tracking-tight text-foreground">
            {lead.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {lead.role} · {lead.company}
          </div>
        </div>
        <Badge tone="good">{lead.stage}</Badge>
      </div>

      <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto px-7 py-6">
        <Bubble from="human">{lead.message}</Bubble>
        <Bubble from="reasoning">{lead.reasoning}</Bubble>
      </div>
    </div>
  );
}
