"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { PANEL } from "@/components/ui/surfaces";
import { askGalileo, getConversation, type GalileoTurn } from "@/app/galileo/actions";

// Chat-tuned markdown renderer. Galileo answers in markdown (**bold**, lists,
// occasional headings) — render those rather than printing raw asterisks.
// Smaller text + tighter spacing than the brief's BodyMd (full-width prose).
function ChatMd({ source }: { source: string }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => <h3 className="font-serif text-h4 text-foreground mt-3 mb-1.5 first:mt-0">{children}</h3>,
        h2: ({ children }) => <h4 className="font-sans font-bold text-foreground mt-3 mb-1.5 first:mt-0">{children}</h4>,
        h3: ({ children }) => <h5 className="font-sans font-bold text-foreground mt-2.5 mb-1 first:mt-0">{children}</h5>,
        p: ({ children }) => <p className="my-1.5 text-small leading-relaxed text-foreground first:mt-0 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="my-1.5 list-disc space-y-1 pl-5 text-small text-foreground">{children}</ul>,
        ol: ({ children }) => <ol className="my-1.5 list-decimal space-y-1 pl-5 text-small text-foreground">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        a: ({ children, href }) => (
          <a href={href} className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">
            {children}
          </a>
        ),
        code: ({ children }) => (
          <code className="rounded-sm bg-background/60 px-1 py-[1px] font-mono text-[12px] text-foreground">{children}</code>
        ),
        blockquote: ({ children }) => (
          <blockquote className="my-1.5 border-l-2 border-volt/40 pl-3 italic text-muted-foreground">{children}</blockquote>
        ),
      }}
    >
      {source}
    </ReactMarkdown>
  );
}

export function GalileoConsole({
  accounts,
  initialAccount,
  lockedAccount,
  embedded = false,
}: {
  accounts: string[];
  initialAccount?: string;
  /** When set (e.g. in the operator console), the panel is locked to this account,
   *  hides the selector, and resets the thread when it changes. */
  lockedAccount?: string;
  /** Embedded mode drops the PANEL wrapper + fixed height so a parent can size it. */
  embedded?: boolean;
}) {
  const [account, setAccount] = useState(lockedAccount ?? initialAccount ?? "");
  const [conv, setConv] = useState<string | null>(null);
  const [turns, setTurns] = useState<GalileoTurn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Scroll the chat container directly (NOT scrollIntoView, which scrolls the
  // whole page). Stick to bottom only if the user was already there — so if
  // they scrolled up to re-read, polls don't yank them back down.
  const scrollRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef(true);

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    pinnedRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 64;
  }

  useEffect(() => {
    if (!pinnedRef.current) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns]);
  // Defensive: when this panel mounts, make sure the window itself is at the
  // top. Without this, /operator and /galileo can land with the page scrolled
  // down (Next.js scroll restoration / browser anchor behavior on the tall
  // chat container). Only resets if the page is more than a hair down — so a
  // user who deliberately scrolled before nav-finish doesn't get yanked.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.scrollY > 4) window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);
  useEffect(() => () => {
    if (pollRef.current) clearInterval(pollRef.current);
  }, []);

  // Re-scope when the operator selects a different account.
  useEffect(() => {
    if (lockedAccount === undefined) return;
    setAccount(lockedAccount);
    setConv(null);
    setTurns([]);
    setBusy(false);
    if (pollRef.current) clearInterval(pollRef.current);
  }, [lockedAccount]);

  function startPolling(conversationId: string) {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      const rows = await getConversation(conversationId);
      if (rows.length) setTurns(rows);
      const last = rows[rows.length - 1];
      if (last && (last.status === "done" || last.status === "error")) {
        if (pollRef.current) clearInterval(pollRef.current);
        setBusy(false);
      }
    }, 3000);
  }

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setBusy(true);
    setInput("");
    // user-initiated send: always pin to bottom for the new message
    pinnedRef.current = true;
    const res = await askGalileo(text, account || null, conv);
    if (!res.ok) {
      setBusy(false);
      return;
    }
    setConv(res.conversationId);
    setTurns((t) => [
      ...t,
      { id: res.turnId, prompt: text, response: null, status: "pending", error: null, created_at: new Date().toISOString() },
    ]);
    startPolling(res.conversationId);
  }

  const root = embedded
    ? "flex h-full min-h-0 flex-col"
    : `${PANEL} flex h-[70vh] flex-col p-0`;

  return (
    <div className={root}>
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="relative inline-flex size-2 shrink-0 rounded-full bg-volt" aria-hidden>
            {busy && <span className="absolute inset-0 animate-ping rounded-full bg-volt opacity-50" />}
          </span>
          <span className="font-serif text-h4 text-foreground">Galileo</span>
          {lockedAccount ? (
            <span className="truncate font-mono text-micro uppercase tracking-wider text-muted-foreground">
              · {lockedAccount}
            </span>
          ) : (
            <span className="hidden font-mono text-micro uppercase tracking-wider text-muted-foreground sm:inline">
              front door · orchestrator
            </span>
          )}
        </div>
        {!lockedAccount && (
          <select
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="rounded-md border border-border bg-background px-2 py-1 text-small text-foreground"
          >
            <option value="">No account context</option>
            {accounts.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        )}
      </div>

      <div
        ref={scrollRef}
        onScroll={onScroll}
        style={{ overflowAnchor: "none" }}
        className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-4"
      >
        {turns.length === 0 && (
          <p className="text-small text-muted-foreground">
            {lockedAccount
              ? `Ask Galileo about ${lockedAccount}, or tell him to run an audit or act.`
              : "Ask Galileo about the book, dig into an account, or tell him to run an audit."}
          </p>
        )}
        {turns.map((t) => (
          <div key={t.id} className="space-y-2">
            <div className="ml-auto max-w-[85%] rounded-2xl bg-primary/15 px-4 py-2 text-small text-foreground">
              {t.prompt}
            </div>
            <div className="max-w-[92%]">
              {t.status === "done" ? (
                <div className="rounded-2xl border border-border bg-card px-4 py-3 text-small text-foreground">
                  <ChatMd source={t.response ?? ""} />
                </div>
              ) : t.status === "error" ? (
                <div className="rounded-2xl border border-bad/40 bg-bad/10 px-4 py-3 text-small text-bad">
                  Galileo hit an error: {t.error}
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-small text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.status === "running"
                    ? "Galileo is thinking (consulting the team if needed)…"
                    : "Galileo is thinking…"}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={busy}
            placeholder="Ask Galileo…"
            className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2 text-small text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-small font-semibold text-primary-foreground transition hover:brightness-105 disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
