import { cn } from "@/lib/utils";
import type { Intent } from "@/lib/data";

const STYLES: Record<Intent, string> = {
  high: "bg-hot/15 text-foreground border-hot/50 glow-edge-hot",
  mid: "bg-warm/16 text-foreground border-warm/55 glow-edge-warm",
  cold: "bg-cold/12 text-foreground border-cold/45 glow-edge-cold",
};

// Temperature colors → temperature labels (hot/warm/cold), matching the
// dashboard lead filters and the clients risk pills.
const LABEL: Record<Intent, string> = { high: "Hot", mid: "Warm", cold: "Cold" };

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
