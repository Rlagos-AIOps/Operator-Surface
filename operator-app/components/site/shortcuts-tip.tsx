import { Command } from "lucide-react";
import { cn } from "@/lib/utils";

// Static tip-element signaling (Lovable pattern): a quiet bordered box, mono
// label, bordered key-caps. Keys are lime — not pulsing, just signposted.
const KEY =
  "inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-md border border-good/55 bg-good/[0.12] px-1.5 font-mono text-[10px] font-medium uppercase leading-none tracking-wide text-good";

const SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ["R"], label: "reply" },
  { keys: ["E"], label: "archive" },
  { keys: ["⌘", "K"], label: "command" },
];

export function ShortcutsTip({ className }: { className?: string }) {
  return (
    <div className={cn("surface flex flex-wrap items-center gap-x-5 gap-y-2.5 rounded-xl px-4 py-3", className)}>
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        <Command className="size-3.5" strokeWidth={1.75} />
        <span className="eyebrow">Shortcuts</span>
      </span>
      {SHORTCUTS.map((s) => (
        <span key={s.label} className="inline-flex items-center gap-1.5">
          {s.keys.map((k) => (
            <kbd key={k} className={KEY}>
              {k}
            </kbd>
          ))}
          <span className="text-xs text-foreground">{s.label}</span>
        </span>
      ))}
    </div>
  );
}
