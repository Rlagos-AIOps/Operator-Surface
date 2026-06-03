import { cn } from "@/lib/utils";

type BubbleFrom = "human" | "agent" | "reasoning";

// Curved chat boxes kept (bubble-human / bubble-agent leaf-blade radii) — only
// the colors are migrated onto the semantic system: cream two-tone for the
// human, primary (lime) for the agent, dotted-good for the reasoning trace.
export function Bubble({
  from,
  children,
  className,
}: {
  from: BubbleFrom;
  children: React.ReactNode;
  className?: string;
}) {
  if (from === "human") {
    return (
      <div
        className={cn(
          "bubble-human max-w-[min(560px,75%)] self-start bg-paper px-[22px] py-3.5 text-sm leading-relaxed text-ink shadow-[var(--shadow-1)]",
          className
        )}
      >
        {children}
      </div>
    );
  }

  if (from === "agent") {
    return (
      <div
        className={cn(
          "bubble-agent max-w-[min(560px,75%)] self-end bg-primary px-[22px] py-3.5 text-sm leading-relaxed text-primary-foreground shadow-[var(--shadow-1)]",
          className
        )}
      >
        {children}
      </div>
    );
  }

  // agent reasoning — transparent, dotted good border, white label
  return (
    <div
      className={cn(
        "bubble-human max-w-[min(560px,75%)] self-start border-[1.5px] border-dotted border-good/60 px-5 py-3 text-[13px] leading-relaxed text-foreground",
        className
      )}
    >
      <span className="eyebrow mr-2 align-baseline text-foreground">Reasoning</span>
      {children}
    </div>
  );
}
