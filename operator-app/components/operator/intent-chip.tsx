import { cn } from "@/lib/utils";
import type { Intent } from "@/lib/data";

const STYLES: Record<Intent, string> = {
  high: "bg-volt/15 text-volt border-volt/45",
  mid: "bg-lime/15 text-lime border-lime/40",
  cold: "bg-paper/[0.06] text-muted-foreground border-paper/15",
};

const LABEL: Record<Intent, string> = { high: "High", mid: "Mid", cold: "Cold" };

export function IntentChip({
  intent,
  score,
}: {
  intent: Intent;
  score: number;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-sm border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] tabular-nums",
        STYLES[intent]
      )}
    >
      {LABEL[intent]} · {score}
    </span>
  );
}
