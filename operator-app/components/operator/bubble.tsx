import { cn } from "@/lib/utils";

type BubbleFrom = "human" | "agent" | "reasoning";

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
          "bubble-human max-w-[min(560px,75%)] self-start bg-paper px-[22px] py-3.5 text-sm leading-relaxed text-ink",
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
          "bubble-agent max-w-[min(560px,75%)] self-end px-[22px] py-3.5 text-sm leading-relaxed text-ink",
          "bg-[linear-gradient(135deg,var(--color-lime),var(--color-volt))]",
          className
        )}
      >
        {children}
      </div>
    );
  }

  // agent reasoning — transparent, dotted lime border
  return (
    <div
      className={cn(
        "bubble-human max-w-[min(560px,75%)] self-start border-[1.5px] border-dotted border-lime px-5 py-3 text-[13px] leading-relaxed text-paper",
        className
      )}
    >
      <span className="eyebrow mr-2 align-baseline text-lime">Reasoning</span>
      {children}
    </div>
  );
}
