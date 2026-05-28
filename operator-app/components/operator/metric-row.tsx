import { cn } from "@/lib/utils";
import { METRICS } from "@/lib/data";

export function MetricRow() {
  return (
    <div className="grid grid-cols-2 gap-4 px-7 py-5 lg:grid-cols-4">
      {METRICS.map((m) => {
        const isPaper = m.tone === "paper";
        const isLive = m.tone === "live";
        return (
          <div
            key={m.label}
            className={cn(
              "rounded-[14px] p-[18px]",
              isPaper ? "bg-paper text-ink" : "bg-surface text-paper",
              isLive
                ? "shadow-[0_1px_0_rgba(10,20,16,0.2),0_0_0_1px_rgba(200,249,2,0.45),0_0_24px_rgba(200,249,2,0.2)]"
                : "shadow-ground"
            )}
          >
            <div
              className={cn(
                "eyebrow mb-2",
                isLive
                  ? "text-volt"
                  : isPaper
                    ? "text-muted-paper"
                    : "text-muted-foreground"
              )}
            >
              {m.label}
            </div>
            <div
              className={cn(
                "font-serif text-[40px] leading-none tracking-tight tabular-nums",
                isLive && "text-volt"
              )}
            >
              {m.value}
            </div>
            <div
              className={cn(
                "mt-1.5 text-[13px]",
                isPaper ? "text-muted-paper" : "text-muted-foreground"
              )}
            >
              {m.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
}
