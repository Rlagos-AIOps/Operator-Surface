"use client";

import { Inbox, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusDot } from "@/components/site/accents";
import { BTN_GHOST, BTN_PRIMARY } from "@/components/site/surfaces";

export function TopBar({
  highIntentOnly,
  onToggleFilter,
  className,
}: {
  highIntentOnly: boolean;
  onToggleFilter: () => void;
  className?: string;
}) {
  return (
    <header className={cn("flex items-center gap-3.5 border-b border-[color:var(--surface-edge)] bg-background px-7 py-3.5", className)}>
      <div className="flex min-w-0 items-center gap-2">
        <Inbox className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
        <span className="eyebrow truncate text-foreground">Inbound triage</span>
      </div>

      <div className="flex-1" />

      <button
        onClick={onToggleFilter}
        aria-pressed={highIntentOnly}
        className={cn(
          highIntentOnly ? BTN_PRIMARY : BTN_GHOST,
          "px-3.5 py-2 text-[13px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        )}
      >
        <Zap className="size-3.5" strokeWidth={1.75} />
        <span>High intent</span>
      </button>

      <div
        role="status"
        aria-live="polite"
        className="inline-flex items-center gap-2 rounded-full border border-good/40 bg-good/10 px-3 py-2"
      >
        <StatusDot tone="good" pulse className="size-1.5" />
        <span className="eyebrow text-foreground">Agent live</span>
      </div>

      <div
        aria-hidden="true"
        className="flex size-8 items-center justify-center rounded-full bg-foreground font-display text-sm text-background"
      >
        R
      </div>
    </header>
  );
}
