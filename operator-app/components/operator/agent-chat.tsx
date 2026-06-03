"use client";

import { useState, type ReactNode } from "react";
import { Sparkles, Send } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { StatusDot } from "@/components/site/accents";
import { EmptyState, ErrorState, SkeletonRows, type SurfaceState } from "@/components/site/states";
import { LinkedinMark } from "@/components/site/nav-icons";
import { Bubble } from "./bubble";
import type { Lead, Intent } from "@/lib/data";

// The agent's read on the currently-open thread — changes with the selected lead.
const REACTION: Record<Intent, string> = {
  high: "This one's hot — a decision-maker with concrete pain. I'd reply within the hour.",
  mid: "Warm lead — real interest, no urgency. A thoughtful reply keeps it moving.",
  cold: "Cold for now — low buying signal. I'd nurture, not push a call.",
};

const SUGGESTIONS = ["Book a call", "Check LinkedIn", "Summarize thread"];

export function AgentChat({
  lead,
  state = "ready",
  className,
  loadingState,
  errorState,
  emptyState,
  onRetry,
}: {
  lead: Lead;
  /** Surface state — drives the thinking/empty/error slots (default "ready"). */
  state?: SurfaceState;
  className?: string;
  loadingState?: ReactNode;
  errorState?: ReactNode;
  emptyState?: ReactNode;
  onRetry?: () => void;
}) {
  const [input, setInput] = useState("");
  const first = lead.name.split(" ")[0];

  if (state !== "ready") {
    return (
      <aside className={cn("flex h-full min-h-0 flex-col items-stretch justify-center overflow-hidden", className)}>
        {state === "loading"
          ? (loadingState ?? <SkeletonRows rows={3} />)
          : state === "empty"
            ? (emptyState ?? (
                <EmptyState
                  icon={<Sparkles strokeWidth={1.75} />}
                  title="No agent activity"
                  hint="The agent's read on a thread appears here once you select a lead."
                />
              ))
            : (errorState ?? (
                <ErrorState
                  title="Agent unavailable"
                  detail="The copilot couldn't respond. Try again."
                  onRetry={onRetry}
                />
              ))}
      </aside>
    );
  }

  return (
    <aside className={cn("flex h-full min-h-0 flex-col overflow-hidden", className)}>
      <div className="flex items-center gap-2.5 border-b border-[color:var(--surface-edge)] px-6 py-5">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-good text-ink">
          <Sparkles className="size-[18px]" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl leading-none">Agent</h2>
          <p className="num mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <StatusDot tone="good" pulse className="size-1.5" /> reacting to {first}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-6 py-5">
        <Bubble from="agent" className="max-w-full self-stretch">
          {REACTION[lead.intent]}
        </Bubble>
        <Bubble from="agent" className="max-w-full self-stretch">
          Intent {lead.score}/100. I&apos;ve drafted a reply for review on the left — want me to pull {first}&apos;s recent LinkedIn activity before you send?
        </Bubble>
        <div className="mt-1 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toast(`Agent · ${s}`)}
              className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border-strong bg-surface/50 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-foreground transition-colors hover:border-good hover:bg-surface-2"
            >
              {s === "Check LinkedIn" && <LinkedinMark className="size-3.5" />}
              {s}
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          toast(`Asked the agent: ${input.trim()}`);
          setInput("");
        }}
        className="border-t border-[color:var(--surface-edge)] p-4"
      >
        <div className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the agent about this lead…"
            aria-label="Ask the agent about this lead"
            className="inset-well h-11 w-full rounded-full border border-border bg-surface pl-4 pr-12 text-[13px] text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          />
          <button
            type="submit"
            aria-label="Send to agent"
            className="absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground transition-[transform,filter] hover:brightness-105 active:scale-95"
          >
            <Send className="size-4" strokeWidth={1.75} />
          </button>
        </div>
      </form>
    </aside>
  );
}
