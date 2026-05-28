"use client";

import { Send, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Lead } from "@/lib/data";

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
  return (
    <div className="border-t border-surface-edge bg-surface px-7 py-[18px]">
      <div className="mb-2.5 flex items-baseline justify-between">
        <span className="eyebrow text-lime">Agent draft · Ready for review</span>
        <span className="text-[11px] text-muted-foreground tabular-nums">
          confidence {lead.confidence.toFixed(2)} · {lead.tokens} tokens
        </span>
      </div>

      {rejected ? (
        <div className="bubble-human mb-3.5 border-[1.5px] border-dotted border-paper/25 px-[22px] py-3.5 text-[13px] text-muted-foreground">
          Draft rejected. Regenerate or write a reply manually.
        </div>
      ) : (
        <Textarea
          key={lead.id}
          defaultValue={lead.draft}
          disabled={sent}
          rows={3}
          aria-label={`Drafted reply to ${lead.name}`}
          className={cn(
            "bubble-human mb-3.5 min-h-0 resize-none border-0 bg-paper px-[22px] py-3.5 text-sm leading-relaxed text-ink shadow-none focus-visible:ring-2 focus-visible:ring-volt",
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
            "flex items-center gap-2 rounded-md px-5 py-3 text-sm font-bold text-ink transition-all focus-visible:ring-2 focus-visible:ring-volt focus-visible:outline-none",
            sent ? "glow-volt bg-volt" : "bg-lime hover:bg-volt",
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

        <button
          onClick={() => {
            if (sent || rejected) return;
            toast("Manual revision is coming soon");
          }}
          disabled={sent || rejected}
          className="rounded-md border border-paper/25 px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-paper/5 focus-visible:ring-2 focus-visible:ring-volt focus-visible:outline-none disabled:opacity-40"
        >
          Revise
        </button>

        <button
          onClick={() => {
            if (sent || rejected) return;
            onReject();
            toast(`Draft rejected · ${lead.name}`);
          }}
          disabled={sent || rejected}
          className="rounded-md px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-paper disabled:opacity-40"
        >
          Reject
        </button>

        <div className="flex-1" />

        <button
          onClick={() => {
            if (sent) return;
            toast("Regeneration is coming soon");
          }}
          disabled={sent}
          className="flex items-center gap-1.5 rounded-md border border-paper/15 px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-paper disabled:opacity-40"
        >
          <Sparkles className="size-3.5" strokeWidth={1.75} />
          <span>Regenerate</span>
        </button>
      </div>
    </div>
  );
}
