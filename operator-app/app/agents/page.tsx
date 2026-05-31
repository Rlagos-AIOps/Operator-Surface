"use client";

import { toast } from "sonner";

const AGENTS = [
  { name: "inbound-triage", state: "running", last: "2m ago", next: "continuous", load: 72 },
  { name: "proposal-writer", state: "idle", last: "1h ago", next: "on demand", load: 0 },
  { name: "roi-calculator", state: "queued", last: "18m ago", next: "in 4m", load: 0 },
  { name: "onboarding-cs", state: "error", last: "32m ago", next: "paused", load: 0 },
];

const STATE: Record<string, { label: string; dot: string; text: string }> = {
  running: { label: "Running", dot: "animate-pulse-volt bg-volt", text: "text-primary" },
  idle: { label: "Idle", dot: "bg-muted-foreground", text: "text-muted-foreground" },
  queued: { label: "Queued", dot: "bg-amber", text: "text-amber" },
  error: { label: "Error", dot: "bg-destructive", text: "text-destructive" },
};

export default function AgentsPage() {
  return (
    <div className="mx-auto max-w-[1320px] px-6 py-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-muted-foreground">Agent control room</p>
          <h1 className="mt-2 text-4xl sm:text-5xl">Agents</h1>
          <p className="mt-2 text-muted-foreground">4 agents · 1 running</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => toast("All agents paused")}
            className="glass rounded-full px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2"
          >
            Pause all
          </button>
          <button
            onClick={() => toast("New agent — choose a template")}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-[transform,filter] hover:brightness-105 active:scale-[0.98]"
          >
            + New agent
          </button>
        </div>
      </div>

      <p className="eyebrow mt-8 text-muted-foreground">Live load</p>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {AGENTS.map((a) => {
          const s = STATE[a.state];
          return (
            <div key={a.name} className="glass rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-base font-medium">{a.name}</p>
                  <p className="num mt-1 text-xs text-muted-foreground">
                    Last run {a.last} · Next {a.next}
                  </p>
                </div>
                <span className={`eyebrow flex shrink-0 items-center gap-1.5 ${s.text}`}>
                  <span className={`size-1.5 rounded-full ${s.dot}`} />
                  {s.label}
                </span>
              </div>

              {/* Load meter */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="eyebrow">Load</span>
                  <span className="num">{a.load}%</span>
                </div>
                <div className="surface mt-2 h-2 overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${a.load}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
                <button
                  onClick={() => toast(`${a.name} — run started`)}
                  className="rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-[transform,filter] hover:brightness-105 active:scale-[0.98]"
                >
                  Run now
                </button>
                <button
                  onClick={() => toast(`${a.name} — paused`)}
                  className="surface rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors hover:bg-surface-2"
                >
                  Pause
                </button>
                <button
                  onClick={() => toast(`${a.name} — opening run history`)}
                  className="surface rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors hover:bg-surface-2"
                >
                  View runs
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
