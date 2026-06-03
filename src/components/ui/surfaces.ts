// Shared surface primitives — one design language across every page.
// PANEL = a static container box (dotted grid, hairline, soft shadow).
// LIFT  = the leaf-element hover-float (lift + weighted shadow). Add to
//         interactive cards/rows/pills; NEVER to container panels or charts.

export const PANEL =
  "dot-grid rounded-2xl border border-[color:var(--surface-edge)] bg-card shadow-[var(--shadow-1)]";

export const LIFT =
  "cursor-pointer transition-[transform,box-shadow,border-color,background-color] duration-200 [transition-timing-function:var(--ease-snap)] hover:-translate-y-1 hover:shadow-[var(--lift-shadow)]";

// A neutral metric chip — informational, NOT a signal. White text, no tone
// color (color is reserved for real status/notification events).
export const METRIC_CHIP =
  "surface inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.13em] text-foreground";

// Interactive button treatments — shared so every page's actions feel identical.
// Size (px/py/text) is set at the call site so one primitive serves header and
// in-card buttons alike. Both carry a resting --shadow-1 for weight and float.
//   PRIMARY — lime fill; lifts + shows a contained edge-glow (no halo) on hover.
//   GHOST   — dashed clear pill; lifts + border turns green on hover.
export const BTN_PRIMARY =
  "inline-flex items-center justify-center gap-1.5 rounded-full bg-primary font-semibold text-primary-foreground shadow-[var(--shadow-1)] transition-[transform,box-shadow,filter] duration-200 [transition-timing-function:var(--ease-snap)] hover:-translate-y-1 hover:brightness-105 hover:glow-edge-good active:translate-y-0 active:scale-[0.98]";

export const BTN_GHOST =
  "inline-flex items-center justify-center gap-1.5 rounded-full border border-dashed border-border-strong bg-surface/50 font-semibold text-foreground shadow-[var(--shadow-1)] cursor-pointer transition-[transform,box-shadow,border-color,background-color] duration-200 [transition-timing-function:var(--ease-snap)] hover:-translate-y-1 hover:border-good hover:bg-surface-2 hover:shadow-[var(--lift-shadow)]";
