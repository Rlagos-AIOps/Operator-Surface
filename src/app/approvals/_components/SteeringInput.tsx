"use client";

import { useRef, useState, useTransition } from "react";
import { CornerDownLeft, Loader2, Check } from "lucide-react";
import { addSteeringInstruction } from "../actions";

interface Props {
  approvalId: string;
}

/**
 * Steering chat input — the CSM types a re-prompt ("instead, update the
 * save plan to X") and Enter persists it onto the approval's metadata
 * for agent-side consumption.
 *
 * The textarea auto-grows from 1 row up to 5; beyond that it scrolls.
 * Shift+Enter inserts a newline so multi-paragraph instructions still
 * work. Enter alone submits — junior CSMs expect chat-style behaviour.
 *
 * Confirmation auto-dismisses after 3s so a follow-up steering can be
 * sent without resetting state manually.
 */
export function SteeringInput({ approvalId }: Props) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [pending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    // 5 rows ≈ 5 * ~22px line-height + padding. Cap there so the card
    // doesn't push everything below it off screen on long instructions.
    const max = 5 * 22 + 16;
    el.style.height = `${Math.min(el.scrollHeight, max)}px`;
  }

  function submit() {
    const trimmed = text.trim();
    if (trimmed.length === 0 || pending) return;
    setError(null);
    startTransition(async () => {
      const result = await addSteeringInstruction(approvalId, trimmed);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setText("");
      setConfirmed(true);
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      window.setTimeout(() => setConfirmed(false), 3000);
    });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="flex flex-col gap-s2">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            autoResize();
          }}
          onKeyDown={onKeyDown}
          placeholder={'Steer Galileo: type a change ("instead, update the save plan to X") and press Enter'}
          rows={1}
          disabled={pending}
          // Chat-bubble shape borrowed from the design tokens. The right
          // edge is rounded to make room for the inline send icon.
          className="block w-full resize-none rounded-md border border-border bg-background px-s4 py-s3 pr-s8 text-small text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-50"
        />
        <button
          type="button"
          onClick={submit}
          disabled={pending || text.trim().length === 0}
          aria-label="Send to Galileo"
          className="absolute right-s3 top-s3 inline-flex h-6 w-6 items-center justify-center rounded-pill text-primary transition-colors duration-fast hover:bg-primary/15 disabled:opacity-40"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CornerDownLeft className="h-4 w-4" strokeWidth={1.75} />
          )}
        </button>
      </div>
      <div className="flex items-center justify-between text-micro text-muted-foreground">
        <span>
          {confirmed ? (
            <span className="inline-flex items-center gap-s1 text-good">
              <Check className="h-3 w-3" strokeWidth={2.5} />
              Sent to Galileo
            </span>
          ) : error ? (
            <span className="text-bad">
              <span className="font-bold">Failed:</span> {error}
            </span>
          ) : (
            <span className="font-mono">⏎ Enter to send · Shift+⏎ for newline</span>
          )}
        </span>
      </div>
    </div>
  );
}
