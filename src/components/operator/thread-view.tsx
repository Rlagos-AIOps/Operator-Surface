import type { ReactNode } from "react";
import { Bubble } from "./bubble";
import { Badge } from "@/components/site/accents";
import { EmptyState, ErrorState, SkeletonRows, type SurfaceState } from "@/components/site/states";
import { cn } from "@/lib/utils";
import type { Lead } from "@/lib/data";

export function ThreadView({
  lead,
  state = "ready",
  className,
  emptyState,
  loadingState,
  errorState,
  onRetry,
}: {
  lead: Lead;
  /** Surface state — drives the empty/loading/error slots (default "ready"). */
  state?: SurfaceState;
  className?: string;
  emptyState?: ReactNode;
  loadingState?: ReactNode;
  errorState?: ReactNode;
  onRetry?: () => void;
}) {
  if (state !== "ready") {
    return (
      <div className={cn("flex flex-1 flex-col items-stretch justify-center overflow-hidden", className)}>
        {state === "loading"
          ? (loadingState ?? <SkeletonRows rows={3} />)
          : state === "empty"
            ? (emptyState ?? (
                <EmptyState
                  title="No thread selected"
                  hint="Pick a lead from the queue to see the conversation."
                />
              ))
            : (errorState ?? (
                <ErrorState
                  title="Couldn't load the thread"
                  detail="The conversation didn't load. Try again."
                  onRetry={onRetry}
                />
              ))}
      </div>
    );
  }
  return (
    <div className={cn("flex flex-1 flex-col overflow-hidden", className)}>
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
