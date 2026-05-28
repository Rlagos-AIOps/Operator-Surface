// AI Ops OS — design token catalog.
// Single machine-readable source of truth for the styleguide page, and the
// export surface for Stitch / Supernova / Storybook. Values mirror the
// Tailwind v4 @theme block in app/globals.css — keep them in sync.

export interface ColorToken {
  name: string; // utility name, e.g. bg-emerald
  cssVar: string; // --color-emerald
  hex: string;
  usage: string;
  text?: "ink" | "paper"; // legible label color on this swatch
}

export interface ColorGroup {
  group: string;
  tokens: ColorToken[];
}

export const COLOR_TOKENS: ColorGroup[] = [
  {
    group: "Surfaces (emerald)",
    tokens: [
      { name: "emerald", cssVar: "--color-emerald", hex: "#1E5631", usage: "Primary canvas — always the dominant background", text: "paper" },
      { name: "emerald-deep", cssVar: "--color-emerald-deep", hex: "#163F23", usage: "Sidebar, inset wells, deep recesses", text: "paper" },
      { name: "surface", cssVar: "--color-surface", hex: "#245F37", usage: "Elevated card background", text: "paper" },
      { name: "surface-2", cssVar: "--color-surface-2", hex: "#2B6E40", usage: "Hover / second elevation", text: "paper" },
      { name: "surface-edge", cssVar: "--color-surface-edge", hex: "#3A8052", usage: "Hairline divider on dark", text: "paper" },
    ],
  },
  {
    group: "Paper (cream)",
    tokens: [
      { name: "paper", cssVar: "--color-paper", hex: "#F4F1E8", usage: "Cream surface — speech bubbles, ROI card", text: "ink" },
      { name: "paper-2", cssVar: "--color-paper-2", hex: "#ECE7D6", usage: "Slightly darker paper", text: "ink" },
      { name: "paper-edge", cssVar: "--color-paper-edge", hex: "#D8D2BE", usage: "Border on paper surfaces", text: "ink" },
    ],
  },
  {
    group: "Accent",
    tokens: [
      { name: "lime", cssVar: "--color-lime", hex: "#D9E879", usage: "The ONLY CTA color — every primary action", text: "ink" },
      { name: "volt", cssVar: "--color-volt", hex: "#C8F902", usage: "Agent-active ONLY — pulse, live, fresh result", text: "ink" },
      { name: "lime-deep", cssVar: "--color-lime-deep", hex: "#B8C95F", usage: "Pressed lime", text: "ink" },
    ],
  },
  {
    group: "Text",
    tokens: [
      { name: "ink", cssVar: "--color-ink", hex: "#0A1410", usage: "Text on light / lime / paper", text: "paper" },
      { name: "ink-2", cssVar: "--color-ink-2", hex: "#1F2A24", usage: "Secondary text on light", text: "paper" },
      { name: "muted-foreground", cssVar: "--color-muted-foreground", hex: "#8FA89A", usage: "Muted text on dark", text: "ink" },
      { name: "muted-paper", cssVar: "--color-muted-paper", hex: "#5A6E62", usage: "Muted text on paper", text: "paper" },
    ],
  },
  {
    group: "Semantic",
    tokens: [
      { name: "success", cssVar: "--color-success", hex: "#D9E879", usage: "Success", text: "ink" },
      { name: "warning", cssVar: "--color-warning", hex: "#E8A91C", usage: "Warning", text: "ink" },
      { name: "danger", cssVar: "--color-danger", hex: "#D9402B", usage: "Danger / destructive", text: "paper" },
      { name: "info", cssVar: "--color-info", hex: "#6FB4D9", usage: "Info", text: "ink" },
    ],
  },
];

export interface TypeToken {
  name: string;
  font: "serif" | "sans" | "mono";
  size: string; // rendered preview size
  sample: string;
  usage: string;
  numeric?: boolean;
}

export const TYPE_TOKENS: TypeToken[] = [
  { name: "Display", font: "serif", size: "56px", sample: "42 active threads", usage: "DM Serif Display · hero numerals + page titles", numeric: true },
  { name: "Heading 2", font: "serif", size: "40px", sample: "Inbound queue", usage: "DM Serif Display · section headers" },
  { name: "Heading 3", font: "sans", size: "28px", sample: "Maya Okafor", usage: "Manrope 700 · panel titles" },
  { name: "Heading 4", font: "sans", size: "20px", sample: "Agent draft", usage: "Manrope 600 · card titles" },
  { name: "Body", font: "sans", size: "16px", sample: "I drafted a reply. Send it?", usage: "Manrope 400/500 · default copy (line-height 1.55)" },
  { name: "Small", font: "sans", size: "14px", sample: "Head of RevOps · Linnet Health", usage: "Manrope · metadata, secondary" },
  { name: "Eyebrow", font: "sans", size: "11px", sample: "AGENT · ACTIVE", usage: "Manrope 700 · UPPERCASE · 0.14em tracking (only place caps allowed)" },
  { name: "Mono", font: "mono", size: "14px", sample: "confidence 0.84 · 312 tokens", usage: "JetBrains Mono · code, telemetry", numeric: true },
];

export const RADII = [
  { name: "sm", value: "4px", usage: "chips, tags" },
  { name: "md", value: "8px", usage: "inputs, buttons" },
  { name: "lg", value: "14px", usage: "standard cards" },
  { name: "xl", value: "20px", usage: "hero cards, modals" },
  { name: "bubble", value: "60px 15px 60px 15px", usage: "signature speech bubble (mirror for agent)" },
];

export const ELEVATION = [
  { name: "shadow-ground", usage: "ground level — most cards (hairline + soft contact)" },
  { name: "shadow-raised", usage: "menus, popovers" },
  { name: "shadow-float", usage: "modals, dialogs" },
  { name: "glow-volt", usage: "agent-active halo — volt only" },
];
