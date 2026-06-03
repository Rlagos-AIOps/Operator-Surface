import {
  CircleDot,
  Command,
  Cpu,
  Filter,
  Inbox,
  LineChart,
  SlidersHorizontal,
  Sparkles,
  Terminal,
  type LucideIcon,
} from "lucide-react";

/* =============================================================
   Nav iconography — the operator vocabulary, mapped to routes.
   One icon = one destination, used identically in the masthead,
   the footer, and any cross-surface pill so the language stays
   consistent everywhere it appears.

   Picked from AK's 16-icon operator set. Two stretches (no
   people/overview glyph exists in the set):
     "/"        → Command   (the command center / system overview)
     "/clients" → CircleDot (a target account)
   ============================================================= */
export const NAV_ICON: Record<string, LucideIcon> = {
  "/": Command,
  "/dashboard": LineChart,
  "/app": Terminal,
  "/pipeline": Filter,
  "/clients": CircleDot,
  "/leads": Inbox,
  "/agents": Cpu,
  "/analytics": LineChart,
  "/roi": LineChart,
  "/settings": SlidersHorizontal,
  "/styleguide": Sparkles,
};

/* LinkedIn "in" — lucide dropped brand glyphs, so this is a
   thin-stroke mark drawn to match the rest of the set (like the
   masthead WaveMark). Accepts the same props as a lucide icon
   (className for sizing, strokeWidth) so it drops in anywhere. */
export function LinkedinMark({
  className,
  strokeWidth = 1.75,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* i — stem + dot */}
      <line x1="6.4" y1="10.5" x2="6.4" y2="17" />
      <circle cx="6.4" cy="6.9" r="0.9" fill="currentColor" stroke="none" />
      {/* n — stem + arch */}
      <path d="M11 17v-6.5M11 13a2.75 2.75 0 0 1 5.5 0V17" />
    </svg>
  );
}
