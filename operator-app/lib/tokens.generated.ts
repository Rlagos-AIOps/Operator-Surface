// AI Ops OS — generated design token catalog.
// Derived from app/globals.css by tokens/build.ts.
// Do not hand-edit; run `bun run tokens` to regenerate.

export interface ColorToken {
  name: string;
  cssVar: string;
  hex: string;
  usage: string;
  text?: "ink" | "paper";
}

export interface ColorGroup {
  group: string;
  tokens: ColorToken[];
}

export interface TypeToken {
  name: string;
  font: "serif" | "sans" | "mono";
  size: string;
  sample: string;
  usage: string;
  numeric?: boolean;
}

export interface RadiusToken {
  name: string;
  value: string;
  usage: string;
}

export const COLOR_TOKENS: ColorGroup[] = [
  {
    "group": "Canvas + Surface",
    "tokens": [
      {
        "name": "emerald",
        "cssVar": "--color-emerald",
        "usage": "Primary light-mode canvas",
        "text": "paper",
        "hex": "#1E5631"
      },
      {
        "name": "emerald-deep",
        "cssVar": "--color-emerald-deep",
        "usage": "Sidebar, inset wells, deep recesses",
        "text": "paper",
        "hex": "#163F23"
      },
      {
        "name": "mossy",
        "cssVar": "--color-mossy",
        "usage": "Primary dark-mode canvas",
        "text": "paper",
        "hex": "#0F2A26"
      },
      {
        "name": "moss-surface",
        "cssVar": "--color-moss-surface",
        "usage": "Dark popovers and dense panels",
        "text": "paper",
        "hex": "#143832"
      },
      {
        "name": "surface",
        "cssVar": "--color-surface",
        "usage": "Default elevated film",
        "text": "paper",
        "hex": "#F4F1E80D"
      },
      {
        "name": "surface-2",
        "cssVar": "--color-surface-2",
        "usage": "Second elevation / hover film",
        "text": "paper",
        "hex": "#F4F1E81A"
      },
      {
        "name": "surface-edge",
        "cssVar": "--color-surface-edge",
        "usage": "Hairlines and edge treatment",
        "text": "paper",
        "hex": "#F4F1E829"
      }
    ]
  },
  {
    "group": "Paper + Ink",
    "tokens": [
      {
        "name": "paper",
        "cssVar": "--color-paper",
        "usage": "Warm cream surface",
        "text": "ink",
        "hex": "#F4F1E8"
      },
      {
        "name": "paper-2",
        "cssVar": "--color-paper-2",
        "usage": "Slightly darker paper layer",
        "text": "ink",
        "hex": "#EFEADB"
      },
      {
        "name": "bone",
        "cssVar": "--color-bone",
        "usage": "Bright light foreground / bone surface",
        "text": "ink",
        "hex": "#FDFDFA"
      },
      {
        "name": "ink",
        "cssVar": "--color-ink",
        "usage": "Text on paper and accent surfaces",
        "text": "paper",
        "hex": "#0A1410"
      },
      {
        "name": "foreground",
        "cssVar": "--color-foreground",
        "usage": "Default foreground in light mode",
        "text": "paper",
        "hex": "#F4F1E8"
      },
      {
        "name": "muted-foreground",
        "cssVar": "--color-muted-foreground",
        "usage": "Secondary operator copy",
        "text": "paper",
        "hex": "#E9E5D5"
      }
    ]
  },
  {
    "group": "Accent + Signals",
    "tokens": [
      {
        "name": "lime",
        "cssVar": "--color-lime",
        "usage": "Primary action accent",
        "text": "ink",
        "hex": "#C7ED55"
      },
      {
        "name": "volt",
        "cssVar": "--color-volt",
        "usage": "Active / live accent",
        "text": "ink",
        "hex": "#C8F902"
      },
      {
        "name": "hot",
        "cssVar": "--color-hot",
        "usage": "Urgent / orange signal",
        "text": "ink",
        "hex": "#F57323"
      },
      {
        "name": "warm",
        "cssVar": "--color-warm",
        "usage": "Warning / yellow signal",
        "text": "ink",
        "hex": "#F2C50E"
      },
      {
        "name": "cold",
        "cssVar": "--color-cold",
        "usage": "Informational / blue signal",
        "text": "paper",
        "hex": "#3899E2"
      },
      {
        "name": "bad",
        "cssVar": "--color-bad",
        "usage": "Error / destructive signal",
        "text": "paper",
        "hex": "#E63946"
      },
      {
        "name": "pending",
        "cssVar": "--color-pending",
        "usage": "Queued / review / draft signal",
        "text": "ink",
        "hex": "#B5C0C5"
      }
    ]
  }
];

export const TYPE_TOKENS: TypeToken[] = [
  {
    "name": "Display",
    "font": "serif",
    "size": "56px",
    "sample": "42 active threads",
    "usage": "DM Serif Display · hero numerals + page titles",
    "numeric": true
  },
  {
    "name": "Heading 1",
    "font": "serif",
    "size": "48px",
    "sample": "Run like an operator",
    "usage": "DM Serif Display · primary page titles"
  },
  {
    "name": "Heading 2",
    "font": "serif",
    "size": "40px",
    "sample": "Inbound queue",
    "usage": "DM Serif Display · section headers"
  },
  {
    "name": "Heading 3",
    "font": "serif",
    "size": "28px",
    "sample": "Price on outcomes",
    "usage": "DM Serif Display · subsections and callouts"
  },
  {
    "name": "Heading 4",
    "font": "serif",
    "size": "20px",
    "sample": "Operator-grade copilot",
    "usage": "DM Serif Display · compact section heads"
  },
  {
    "name": "Body",
    "font": "sans",
    "size": "16px",
    "sample": "I drafted a reply. Send it?",
    "usage": "Manrope 400/500 · default copy (line-height 1.55)"
  },
  {
    "name": "Small",
    "font": "sans",
    "size": "14px",
    "sample": "Head of RevOps · Linnet Health",
    "usage": "Manrope · metadata, secondary"
  },
  {
    "name": "Eyebrow",
    "font": "mono",
    "size": "11px",
    "sample": "AGENT · ACTIVE",
    "usage": "JetBrains Mono · uppercase labels · 0.14em tracking"
  },
  {
    "name": "Kbd",
    "font": "mono",
    "size": "10px",
    "sample": "⌘K · RUN 0042",
    "usage": "JetBrains Mono · keycaps and terse operator metadata",
    "numeric": true
  }
];

export const RADII: RadiusToken[] = [
  {
    "name": "sm",
    "value": "4px",
    "usage": "chips, tags"
  },
  {
    "name": "md",
    "value": "8px",
    "usage": "inputs, buttons"
  },
  {
    "name": "lg",
    "value": "14px",
    "usage": "standard cards"
  },
  {
    "name": "xl",
    "value": "20px",
    "usage": "hero cards, modals"
  },
  {
    "name": "2xl",
    "value": "28px",
    "usage": "large feature wells"
  },
  {
    "name": "pill",
    "value": "9999px",
    "usage": "pills, badges, CTA buttons"
  },
  {
    "name": "blade",
    "value": "4px 20px 4px 20px",
    "usage": "leaf-blade asymmetric accent corners"
  }
];

