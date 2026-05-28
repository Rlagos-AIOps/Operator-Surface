/**
 * Design tokens — TypeScript mirror of src/styles/tokens.css.
 *
 * Use this when a component needs a token value at runtime (canvas
 * fills, chart colors, JS-driven animation). For static styling, use
 * Tailwind utilities (bg-bg, text-paper, text-h1, rounded-bubble-l,
 * shadow-e1, …) so the CSS variables stay the single source of truth.
 *
 * If you change a value here without also updating tokens.css, the
 * runtime + static styles will drift.
 */

export const colors = {
  // Surfaces
  bg: "#1E5631",
  bgDeep: "#163F23",
  surface: "#245F37",
  surface2: "#2B6E40",
  surfaceEdge: "#3A8052",

  // Paper
  paper: "#F4F1E8",
  paper2: "#ECE7D6",
  paperEdge: "#D8D2BE",

  // Accents
  lime: "#D9E879",
  volt: "#C8F902",
  limeDeep: "#B8C95F",
  limeSoft: "rgba(217, 232, 121, 0.18)",

  // Text
  ink: "#0A1410",
  ink2: "#1F2A24",
  paperText: "#F4F1E8",
  muted: "#8FA89A",
  mutedLight: "#5A6E62",

  // Semantic
  success: "#D9E879",
  warning: "#E8A91C",
  danger: "#D9402B",
  info: "#6FB4D9",

  // Focus
  focusRing: "#C8F902",
} as const;

export const fonts = {
  serif: "var(--font-serif)",
  sans: "var(--font-sans)",
  mono: "var(--font-mono)",
} as const;

export const fontSize = {
  display: "clamp(48px, 6.5vw, 96px)",
  h1: 56,
  h2: 40,
  h3: 28,
  h4: 20,
  body: 16,
  small: 14,
  micro: 12,
} as const;

export const spacing = {
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 24,
  s6: 32,
  s7: 48,
  s8: 64,
  s9: 96,
} as const;

export const radii = {
  sm: 4,
  md: 8,
  lg: 14,
  xl: 20,
  pill: 9999,
  bubbleLeft: "60px 15px 60px 15px",
  bubbleRight: "15px 60px 15px 60px",
} as const;

export const shadows = {
  e1: "0 1px 0 rgba(10, 20, 16, 0.20), 0 0 0 1px rgba(58, 128, 82, 0.35)",
  e2: "0 6px 18px rgba(10, 20, 16, 0.30), 0 0 0 1px rgba(58, 128, 82, 0.40)",
  e3: "0 18px 40px rgba(10, 20, 16, 0.45), 0 0 0 1px rgba(58, 128, 82, 0.50)",
  glowVolt:
    "0 0 0 4px rgba(200, 249, 2, 0.20), 0 0 24px rgba(200, 249, 2, 0.45)",
  insetWell:
    "inset 0 1px 0 rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(0, 0, 0, 0.20)",
} as const;

export const motion = {
  durFast: 120,
  durBase: 220,
  durSlow: 420,
  easeSnap: "cubic-bezier(0.2, 0.9, 0.2, 1)",
  easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
  easeIn: "cubic-bezier(0.7, 0, 0.84, 0)",
} as const;

export type ColorToken = keyof typeof colors;
export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radii;
export type ShadowToken = keyof typeof shadows;
