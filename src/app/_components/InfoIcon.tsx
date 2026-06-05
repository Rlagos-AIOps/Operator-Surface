import { Info } from "lucide-react";
import { TOOLTIPS, type TooltipKey } from "@/lib/copy/tooltips";

interface Props {
  tooltipKey: TooltipKey;
  /** Optional override copy when the registry entry doesn't fit. */
  text?: string;
  className?: string;
}

/**
 * Small `i` glyph that reveals an explainer on hover/focus. Pure CSS,
 * server-safe — uses the `group/info` peer pattern so we don't pull in
 * any client-side hover state. Tap on touch devices triggers focus.
 *
 * Tooltip floats above the trigger; `overflow-visible` on parent rows
 * is required for it not to clip. The 240px width is enough for three
 * short sentences without wrapping into a column of single words.
 */
export function InfoIcon({ tooltipKey, text, className = "" }: Props) {
  const copy = text ?? TOOLTIPS[tooltipKey];
  return (
    <span
      className={`group/info relative inline-flex items-center align-middle ${className}`}
      tabIndex={0}
    >
      <Info
        className="h-[14px] w-[14px] text-muted hover:text-paper transition-colors duration-fast"
        strokeWidth={1.75}
        aria-hidden
      />
      <span className="sr-only">{copy}</span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-s2 hidden w-[240px] -translate-x-1/2 rounded-md border border-surface-edge bg-bg-deep px-s3 py-s2 text-micro font-medium leading-snug text-paper shadow-e2 group-hover/info:block group-focus/info:block"
      >
        {copy}
      </span>
    </span>
  );
}
