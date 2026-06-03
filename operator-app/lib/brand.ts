// Brand DNA — the customer-overridable layer.
//
// Every key maps to a `--brand-*` CSS custom property that the SEMANTIC tokens in
// app/globals.css read THROUGH (e.g. `--primary: var(--brand-accent)`). Override
// these to re-skin Ops Surfer to ANY brand WITHOUT forking — either with
// <BrandProvider brand={...}> or a plain CSS rule on `:root` / `[data-brand="x"]`.
//
// Brand is ORTHOGONAL to light/dark: the hues that differ between themes (accent,
// signals) carry a `*Dark` counterpart, so a single re-skin flows into BOTH modes.
// Unset keys inherit the Ops Surfer defaults from :root — so a partial Brand is
// valid (override only what you want).

export type Brand = {
  accent?: string;        // --brand-accent        primary action (light)
  accentDark?: string;    // --brand-accent-dark   primary action (dark)
  accent2?: string;       // --brand-accent-2      agent-active / volt (light)
  accent2Dark?: string;   // --brand-accent-2-dark agent-active (dark)
  canvas?: string;        // --brand-canvas        page base (light)
  canvasDark?: string;    // --brand-canvas-dark   page base (dark)
  canvasDeep?: string;    // --brand-canvas-deep   deep recess / sidebar
  paper?: string;         // --brand-paper         two-tone film
  paper2?: string;        // --brand-paper-2       darker paper layer
  ink?: string;           // --brand-ink           text on light / accent / paper
  bone?: string;          // --brand-bone          bright foreground
  hot?: string;           // --brand-hot           signal: urgent
  hotDark?: string;
  warm?: string;          // --brand-warm          signal: caution
  warmDark?: string;
  cold?: string;          // --brand-cold          signal: info
  coldDark?: string;
  bad?: string;           // --brand-bad           signal: error / blocked
  badDark?: string;
  pending?: string;       // --brand-pending       signal: queued / in-review
  pendingDark?: string;
  fontDisplay?: string;   // --brand-font-display
  fontSans?: string;      // --brand-font-sans
  fontMono?: string;      // --brand-font-mono
  radius?: string;        // --brand-radius        base corner radius
};

const KEY_TO_VAR: Record<keyof Brand, string> = {
  accent: "--brand-accent",
  accentDark: "--brand-accent-dark",
  accent2: "--brand-accent-2",
  accent2Dark: "--brand-accent-2-dark",
  canvas: "--brand-canvas",
  canvasDark: "--brand-canvas-dark",
  canvasDeep: "--brand-canvas-deep",
  paper: "--brand-paper",
  paper2: "--brand-paper-2",
  ink: "--brand-ink",
  bone: "--brand-bone",
  hot: "--brand-hot",
  hotDark: "--brand-hot-dark",
  warm: "--brand-warm",
  warmDark: "--brand-warm-dark",
  cold: "--brand-cold",
  coldDark: "--brand-cold-dark",
  bad: "--brand-bad",
  badDark: "--brand-bad-dark",
  pending: "--brand-pending",
  pendingDark: "--brand-pending-dark",
  fontDisplay: "--brand-font-display",
  fontSans: "--brand-font-sans",
  fontMono: "--brand-font-mono",
  radius: "--brand-radius",
};

/** Map a Brand to a record of CSS custom properties (for an inline `style`). */
export function brandToCssVars(brand: Brand): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of Object.keys(brand) as (keyof Brand)[]) {
    const value = brand[key];
    if (value == null) continue;
    out[KEY_TO_VAR[key]] = value;
  }
  return out;
}

/** The default Ops Surfer brand — mirrors `:root` in globals.css (the shipped values). */
export const opsSurferBrand: Brand = {
  accent: "oklch(0.89 0.18 122)",
  accentDark: "oklch(0.9 0.225 126)",
  accent2: "#c8f902",
  accent2Dark: "oklch(0.93 0.19 108)",
  canvas: "#1e5631",
  canvasDark: "#0a1f17",
  canvasDeep: "#163f23",
  paper: "#f4f1e8",
  paper2: "#efeadb",
  ink: "#0a1410",
  bone: "#fdfdfa",
  hot: "oklch(0.7 0.18 47)",
  hotDark: "oklch(0.72 0.18 47)",
  warm: "oklch(0.84 0.17 92)",
  warmDark: "oklch(0.88 0.17 92)",
  cold: "oklch(0.66 0.14 245)",
  coldDark: "oklch(0.68 0.14 245)",
  bad: "#e63946",
  badDark: "oklch(0.62 0.21 25)",
  pending: "oklch(0.8 0.014 225)",
  pendingDark: "oklch(0.85 0.014 225)",
  fontDisplay: "var(--font-dm-serif)",
  fontSans: "var(--font-manrope)",
  fontMono: "var(--font-jetbrains)",
  radius: "14px",
};

/**
 * Example white-label re-skin — a violet / indigo brand. Proves "customize without
 * forking": pass this to <BrandProvider brand={exampleBrand}> (or copy the values
 * into a `[data-brand="acme"]` CSS rule) and the entire surface re-skins, light and
 * dark, with the signal grammar intact. This is the customer's customization surface.
 */
export const exampleBrand: Brand = {
  accent: "oklch(0.72 0.19 295)",
  accentDark: "oklch(0.76 0.2 295)",
  accent2: "oklch(0.8 0.16 320)",
  accent2Dark: "oklch(0.82 0.17 320)",
  canvas: "#241b3a",
  canvasDark: "#15102a",
  canvasDeep: "#1a1330",
  paper: "#efeafe",
  paper2: "#e6dffb",
  ink: "#140e26",
  bone: "#fdfcff",
  hot: "oklch(0.7 0.19 25)",
  hotDark: "oklch(0.72 0.19 25)",
  warm: "oklch(0.84 0.16 70)",
  warmDark: "oklch(0.86 0.16 70)",
  cold: "oklch(0.7 0.15 250)",
  coldDark: "oklch(0.72 0.15 250)",
  bad: "#f4476b",
  badDark: "oklch(0.64 0.22 8)",
  pending: "oklch(0.8 0.02 280)",
  pendingDark: "oklch(0.85 0.02 280)",
  radius: "10px",
};
