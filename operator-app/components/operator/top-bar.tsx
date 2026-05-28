"use client";

import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function TopBar({
  highIntentOnly,
  onToggleFilter,
}: {
  highIntentOnly: boolean;
  onToggleFilter: () => void;
}) {
  return (
    <header className="flex items-center gap-3.5 border-b border-paper/8 bg-emerald px-7 py-3.5">
      <div className="relative max-w-[420px] flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          strokeWidth={1.75}
        />
        <Input
          placeholder="Search leads, threads, clients"
          aria-label="Search leads, threads, clients"
          className="inset-well h-10 rounded-md border-paper/10 bg-emerald-deep pl-9 text-[13px] text-paper placeholder:text-muted-foreground focus-visible:ring-volt"
        />
      </div>

      <div className="flex-1" />

      <button
        onClick={onToggleFilter}
        aria-pressed={highIntentOnly}
        className={cn(
          "flex items-center gap-2 rounded-md border px-3.5 py-2 text-[13px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-volt focus-visible:outline-none",
          highIntentOnly
            ? "border-transparent bg-lime text-ink"
            : "border-paper/15 text-paper hover:bg-paper/5"
        )}
      >
        <Filter className="size-3.5" strokeWidth={1.75} />
        <span>High intent</span>
      </button>

      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-2 rounded-full border border-volt/40 bg-volt/10 px-3 py-2"
      >
        <span
          aria-hidden="true"
          className="size-1.5 animate-pulse-volt rounded-full bg-volt shadow-[0_0_8px_var(--color-volt)]"
        />
        <span className="eyebrow text-[11px] text-volt">Agent live</span>
      </div>

      <div
        aria-hidden="true"
        className="flex size-8 items-center justify-center rounded-full bg-paper font-serif text-sm text-ink"
      >
        R
      </div>
    </header>
  );
}
