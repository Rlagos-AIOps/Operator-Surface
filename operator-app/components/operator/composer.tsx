"use client";

import { useState } from "react";
import { Send, Check, Minimize2, Maximize2, Flame, Snowflake, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { BTN_GHOST, BTN_PRIMARY } from "@/components/site/surfaces";
import type { Lead } from "@/lib/data";

const REVISE_OPTIONS = [
  { label: "Concise", icon: Minimize2 },
  { label: "Verbose", icon: Maximize2 },
  { label: "Warmer", icon: Flame },
  { label: "Cooler", icon: Snowflake },
];

export function Composer({
  lead,
  sent,
  rejected,
  onApprove,
  onReject,
}: {
  lead: Lead;
  sent: boolean;
  rejected: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  const [reviseOpen, setReviseOpen] = useState(false);
  return (
    <div className="border-t border-surface-edge bg-surface px-7 py-[18px]">
      <div className="mb-2.5 flex items-baseline justify-between">
        <span className="eyebrow inline-flex items-center gap-1.5 text-foreground">
          <Sparkles className="size-3.5" strokeWidth={1.75} />
          Agent draft · Ready for review
        </span>
        <span className="text-[11px] text-muted-foreground tabular-nums">
          confidence {lead.confidence.toFixed(2)} · {lead.tokens} tokens
        </span>
      </div>

      {rejected ? (
        <div className="bubble-human mb-3.5 border-[1.5px] border-dotted border-border-strong px-[22px] py-3.5 text-[13px] text-muted-foreground">
          Draft rejected. Regenerate or write a reply manually.
        </div>
      ) : (
        <textarea
          key={lead.id}
          defaultValue={lead.draft}
          disabled={sent}
          rows={3}
          aria-label={`Drafted reply to ${lead.name}`}
          className={cn(
            "bubble-human mb-3.5 w-full resize-none border-0 bg-paper px-[22px] py-3.5 text-sm leading-relaxed text-ink shadow-none outline-none focus-visible:ring-2 focus-visible:ring-ring",
            sent && "opacity-70"
          )}
        />
      )}

      <div className="flex items-center gap-2.5">
        <button
          onClick={() => {
            if (sent || rejected) return;
            onApprove();
            toast.success(`Reply sent to ${lead.name}`);
          }}
          disabled={sent || rejected}
          className={cn(
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            sent
              ? "inline-flex items-center justify-center gap-1.5 rounded-full bg-good px-5 py-2.5 text-sm font-semibold text-ink glow-edge-good"
              : cn(BTN_PRIMARY, "px-5 py-2.5 text-sm"),
            rejected && "opacity-40"
          )}
        >
          {sent ? (
            <Check className="size-4" strokeWidth={2} />
          ) : (
            <Send className="size-4" strokeWidth={1.75} />
          )}
          <span>{sent ? "Sent" : "Approve & send"}</span>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              if (sent || rejected) return;
              setReviseOpen((v) => !v);
            }}
            disabled={sent || rejected}
            aria-haspopup="menu"
            aria-expanded={reviseOpen}
            className={cn(BTN_GHOST, "px-5 py-2.5 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-40")}
          >
            Revise
          </button>
          {reviseOpen && (
            <>
              <button
                type="button"
                aria-hidden
                tabIndex={-1}
                onClick={() => setReviseOpen(false)}
                className="fixed inset-0 z-10 cursor-default"
              />
              <div
                role="menu"
                className="absolute bottom-full left-0 z-20 mb-2 w-48 overflow-hidden rounded-2xl border border-[color:var(--surface-edge)] bg-background p-1.5 shadow-[var(--shadow-2)]"
              >
                {REVISE_OPTIONS.map((o) => {
                  const Icon = o.icon;
                  return (
                    <button
                      key={o.label}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        toast(`Revising · ${o.label.toLowerCase()}`);
                        setReviseOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-surface-2"
                    >
                      <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} />
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <button
          onClick={() => {
            if (sent || rejected) return;
            onReject();
            toast(`Draft rejected · ${lead.name}`);
          }}
          disabled={sent || rejected}
          className={cn(BTN_GHOST, "px-4 py-2.5 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-40")}
        >
          Reject
        </button>
      </div>
    </div>
  );
}
