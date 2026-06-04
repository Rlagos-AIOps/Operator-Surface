"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { PANEL } from "@/components/ui/surfaces";
import { askGalileo, getConversation, type GalileoTurn } from "../actions";

export function GalileoConsole({
  accounts,
  initialAccount,
}: {
  accounts: string[];
  initialAccount?: string;
}) {
  const [account, setAccount] = useState(initialAccount ?? "");
  const [conv, setConv] = useState<string | null>(null);
  const [turns, setTurns] = useState<GalileoTurn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns]);
  useEffect(() => () => {
    if (pollRef.current) clearInterval(pollRef.current);
  }, []);

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

  return (
    <div className={`${PANEL} flex h-[70vh] flex-col p-0`}>
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="relative inline-flex size-2 shrink-0 rounded-full bg-volt" aria-hidden>
            {busy && <span className="absolute inset-0 animate-ping rounded-full bg-volt opacity-50" />}
          </span>
          <span className="font-serif text-h4 text-foreground">Galileo</span>
          <span className="hidden font-mono text-micro uppercase tracking-wider text-muted-foreground sm:inline">
            front door · orchestrator
          </span>
        </div>
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
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {turns.length === 0 && (
          <p className="text-small text-muted-foreground">
            Ask Galileo about the book, dig into an account, or tell him to run an audit.
            {account ? ` Scoped to ${account}.` : ""}
          </p>
        )}
        {turns.map((t) => (
          <div key={t.id} className="space-y-2">
            <div className="ml-auto max-w-[80%] rounded-2xl bg-primary/15 px-4 py-2 text-small text-foreground">
              {t.prompt}
            </div>
            <div className="max-w-[90%]">
              {t.status === "done" ? (
                <div className="whitespace-pre-wrap rounded-2xl border border-border bg-card px-4 py-3 text-small text-foreground">
                  {t.response}
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
        <div ref={endRef} />
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
            className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-small text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-small font-semibold text-primary-foreground transition hover:brightness-105 disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
