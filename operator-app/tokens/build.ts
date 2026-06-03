/**
 * Ops Surfer — token pipeline (single source → many formats).
 *
 * SOURCE OF TRUTH: app/globals.css (the shipped CSS — :root = light, .dark = dark,
 * @theme inline = primitives/radii). We parse it and GENERATE:
 *   • tokens/tokens.json         — DTCG, dual-mode, sRGB (for Supernova / docs)
 *   • tokens/figma.tokens.json   — Tokens Studio format (import → Figma Variables)
 *   • app/tokens.generated.css   — the :root/.dark token block (adoption artifact)
 *
 * The sRGB hex is COMPUTED from the source via culori, so it can never drift from
 * the oklch the app ships (the exact bug the audit flagged). One edit in
 * globals.css → `bun run tokens` → all three regenerate. `--check` fails on drift.
 *
 * Run: `bun run tokens`  ·  Gate: `bun run tokens:check`
 */
import { parse, formatHex, formatHex8 } from "culori";

const ROOT = new URL("..", import.meta.url).pathname; // operator-app/
const GLOBALS = `${ROOT}app/globals.css`;
const OUT_DTCG = `${ROOT}tokens/tokens.json`;
const OUT_FIGMA = `${ROOT}tokens/figma.tokens.json`;
const OUT_CSS = `${ROOT}app/tokens.generated.css`;

const check = process.argv.includes("--check");

// ---- parse helpers ---------------------------------------------------------
function stripComments(s: string) {
  return s.replace(/\/\*[\s\S]*?\*\//g, "");
}
/** First `selector { ... }` rule → { varName: value } (blocks are flat, no nested braces).
    Matches the actual rule opener (regex), so `.dark {` isn't confused with the
    `.dark` mention inside `@custom-variant`. */
function block(css: string, selectorRe: RegExp): Record<string, string> {
  const m = selectorRe.exec(css);
  if (!m) throw new Error(`block not found: ${selectorRe}`);
  const open = css.indexOf("{", m.index);
  const close = css.indexOf("}", open);
  if (open < 0 || close < 0) throw new Error(`block not found: ${selectorRe}`);
  const out: Record<string, string> = {};
  for (const decl of css.slice(open + 1, close).split(";")) {
    const m = decl.match(/^\s*--([\w-]+)\s*:\s*(.+?)\s*$/);
    if (m) out[m[1]] = m[2].trim();
  }
  return out;
}
/** CSS color (oklch/rgba/hex) → uppercase sRGB hex (or hex8 when translucent). */
const unparseable: string[] = [];
function toHex(v: string): string | null {
  const c = parse(v);
  if (!c) { unparseable.push(v); return null; }
  const a = (c as { alpha?: number }).alpha;
  return (a != null && a < 1 ? formatHex8(c) : formatHex(c)).toUpperCase();
}

// ---- stable tokens not expressed as CSS vars -------------------------------
const FONT_FAMILY = {
  display: { $type: "fontFamily", $value: ["DM Serif Display", "Times New Roman", "serif"], $description: "Money + headlines" },
  sans: { $type: "fontFamily", $value: ["Manrope", "Inter", "system-ui", "sans-serif"], $description: "Body / UI" },
  mono: { $type: "fontFamily", $value: ["JetBrains Mono", "ui-monospace", "monospace"], $description: "Ops / metadata / eyebrows" },
};
const FONT_SIZE = { display: "56px", h1: "48px", h2: "40px", h3: "28px", h4: "20px", body: "16px", small: "14px", eyebrow: "11px", kbd: "10px" };
const RADIUS_BLADE = { human: "60px 15px 60px 15px", agent: "15px 60px 15px 60px" };

// COLOR token name (DTCG/Figma) ← CSS var name in globals
const COLOR_MAP: [string, string][] = [
  ["background", "background"], ["foreground", "foreground"], ["muted-foreground", "muted-foreground"],
  ["card", "card"], ["surface", "surface"], ["surface-2", "surface-2"], ["surface-edge", "surface-edge"],
  ["border", "border"], ["border-strong", "border-strong"],
  ["good", "primary"], ["good-foreground", "primary-foreground"],
  ["hot", "hot"], ["warm", "warm"], ["cold", "cold"], ["bad", "destructive"], ["pending", "pending"],
  ["secondary", "secondary"], ["muted", "muted"], ["input", "input"],
];
const PRIMITIVES = ["emerald", "emerald-deep", "mossy", "moss-surface", "paper", "paper-2", "ink", "bone"];

// ---- build -----------------------------------------------------------------
const css = stripComments(await Bun.file(GLOBALS).text());
const theme = block(css, /@theme\s+inline\s*\{/);
const root = block(css, /:root\s*\{/);
const dark = block(css, /\.dark\s*\{/);

function colorSet(vars: Record<string, string>) {
  const out: Record<string, { $type: "color"; $value: string }> = {};
  for (const [name, src] of COLOR_MAP) {
    const raw = vars[src];
    if (!raw) continue;
    const hex = toHex(raw);
    if (hex) out[name] = { $type: "color", $value: hex };
  }
  return out;
}

const primitive: Record<string, unknown> = {};
for (const p of PRIMITIVES) {
  const raw = theme[`color-${p}`];
  if (raw) { const hex = toHex(raw); if (hex) primitive[p] = { $type: "color", $value: hex }; }
}
const radius: Record<string, unknown> = {};
for (const r of ["sm", "md", "lg", "xl", "2xl"]) if (theme[`radius-${r}`]) radius[r] = { $type: "dimension", $value: theme[`radius-${r}`] };
radius["pill"] = { $type: "dimension", $value: "9999px" };

const light = colorSet(root);
const darkColors = colorSet(dark);

// DTCG (mirrors the prior tokens.json shape, now generated + computed sRGB)
const dtcg = {
  $description: "GENERATED by tokens/build.ts from app/globals.css — do not hand-edit. sRGB computed from the shipped oklch via culori; run `bun run tokens` to regenerate.",
  primitive,
  color: { light, dark: darkColors },
  fontFamily: FONT_FAMILY,
  fontSize: Object.fromEntries(Object.entries(FONT_SIZE).map(([k, v]) => [k, { $type: "dimension", $value: v }])),
  radius,
  radiusBlade: { $description: "Leaf-blade asymmetric radii", human: { $type: "dimension", $value: RADIUS_BLADE.human }, agent: { $type: "dimension", $value: RADIUS_BLADE.agent } },
  shadow: {
    "1": { $type: "shadow", $value: root["shadow-1"] ?? "", $valueDark: dark["shadow-1"] ?? "" },
    "2": { $type: "shadow", $value: root["shadow-2"] ?? "", $valueDark: dark["shadow-2"] ?? "" },
    "3": { $type: "shadow", $value: root["shadow-3"] ?? "", $valueDark: dark["shadow-3"] ?? "" },
  },
};

// Tokens Studio (sets → Figma Variable modes) for the Figma import
const globalSet = {
  radius: Object.fromEntries(Object.entries(radius).map(([k, v]) => [k, v])),
  fontSize: dtcg.fontSize,
  fontFamily: FONT_FAMILY,
};
const figma = {
  $metadata: { tokenSetOrder: ["global", "light", "dark"] },
  $themes: [
    { id: "light", name: "Light", selectedTokenSets: { global: "source", light: "enabled" } },
    { id: "dark", name: "Dark", selectedTokenSets: { global: "source", dark: "enabled" } },
  ],
  global: globalSet,
  light: { color: light },
  dark: { color: darkColors },
};

// CSS adoption artifact — the :root/.dark token block, regenerated
function cssBlock(sel: string, vars: Record<string, string>) {
  const lines = Object.entries(vars).map(([k, v]) => `  --${k}: ${v};`).join("\n");
  return `${sel} {\n${lines}\n}`;
}
const generatedCss = `/* GENERATED by tokens/build.ts from globals.css — adoption: replace the\n   :root/.dark token block in globals.css with: @import "./tokens.generated.css"; */\n\n${cssBlock(":root", root)}\n\n${cssBlock(".dark", dark)}\n`;

// ---- write or check --------------------------------------------------------
const outputs: [string, string][] = [
  [OUT_DTCG, JSON.stringify(dtcg, null, 2) + "\n"],
  [OUT_FIGMA, JSON.stringify(figma, null, 2) + "\n"],
  [OUT_CSS, generatedCss],
];

if (check) {
  let drift = false;
  for (const [path, content] of outputs) {
    const cur = (await Bun.file(path).exists()) ? await Bun.file(path).text() : "";
    if (cur !== content) { drift = true; console.error(`✗ DRIFT: ${path.replace(ROOT, "")} is stale — run \`bun run tokens\``); }
  }
  if (unparseable.length) console.warn(`(skipped ${unparseable.length} non-color value(s): ${[...new Set(unparseable)].join(", ")})`);
  if (drift) process.exit(1);
  console.log("✓ tokens in sync (globals.css ⇄ tokens.json ⇄ figma.tokens.json)");
} else {
  for (const [path, content] of outputs) await Bun.write(path, content);
  console.log(`✓ generated from globals.css:\n  • ${OUT_DTCG.replace(ROOT, "")}  (${Object.keys(light).length} light · ${Object.keys(darkColors).length} dark colors)\n  • ${OUT_FIGMA.replace(ROOT, "")}  (Tokens Studio → Figma import)\n  • ${OUT_CSS.replace(ROOT, "")}  (CSS adoption artifact)`);
  if (unparseable.length) console.warn(`  (skipped ${unparseable.length} derived value(s): ${[...new Set(unparseable)].join(", ")})`);
}
