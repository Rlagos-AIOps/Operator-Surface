/**
 * Ops Surfer — token pipeline (single source → many formats).
 *
 * SOURCE OF TRUTH: app/globals.css (the shipped CSS — :root = light, .dark = dark,
 * @theme inline = primitives/radii). We parse it and GENERATE:
 *   • tokens/tokens.json         — DTCG, dual-mode, sRGB (for Supernova / docs)
 *   • tokens/figma.tokens.json   — Tokens Studio format (import → Figma Variables)
 *   • app/tokens.generated.css   — the :root/.dark token block (adoption artifact)
 *   • lib/tokens.generated.ts    — typed token catalog for app/styleguide + stories
 *
 * The sRGB hex is COMPUTED from the source via culori, so it can never drift from
 * the oklch the app ships (the exact bug the audit flagged). One edit in
 * globals.css → `bun run tokens` → all four regenerate. `--check` fails on drift.
 *
 * Run: `bun run tokens`  ·  Gate: `bun run tokens:check`
 */
import { formatHex, formatHex8, parse } from "culori";

const ROOT = new URL("..", import.meta.url).pathname; // operator-app/
const GLOBALS = `${ROOT}app/globals.css`;
const OUT_DTCG = `${ROOT}tokens/tokens.json`;
const OUT_FIGMA = `${ROOT}tokens/figma.tokens.json`;
const OUT_CSS = `${ROOT}app/tokens.generated.css`;
const OUT_TS = `${ROOT}lib/tokens.generated.ts`;

const check = process.argv.includes("--check");

type TokenType = "color" | "dimension" | "fontFamily";

interface ColorTokenSpec {
  name: string;
  cssVar: string;
  usage: string;
  text?: "ink" | "paper";
}

interface ColorGroupSpec {
  group: string;
  tokens: ColorTokenSpec[];
}

interface TypeTokenSpec {
  key: keyof typeof FONT_SIZE;
  name: string;
  font: "serif" | "sans" | "mono";
  sample: string;
  usage: string;
  numeric?: boolean;
}

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
    const match = decl.match(/^\s*--([\w-]+)\s*:\s*(.+?)\s*$/);
    if (match) out[match[1]] = match[2].trim();
  }
  return out;
}

function lookupVar(name: string, scopes: Record<string, string>[]) {
  for (const scope of scopes) {
    if (name in scope) return scope[name];
  }
  return undefined;
}

function resolveValue(value: string, scopes: Record<string, string>[], trail = new Set<string>()): string {
  return value.replace(/var\(\s*--([\w-]+)\s*(?:,\s*([^)]+))?\)/g, (_match, name: string, fallback?: string) => {
    if (trail.has(name)) return fallback?.trim() ?? `var(--${name})`;
    const raw = lookupVar(name, scopes);
    if (raw == null) return fallback ? resolveValue(fallback.trim(), scopes, new Set(trail)) : `var(--${name})`;
    const nextTrail = new Set(trail);
    nextTrail.add(name);
    return resolveValue(raw, scopes, nextTrail);
  });
}

/** CSS color (oklch/rgba/hex) → uppercase sRGB hex (or hex8 when translucent). */
const unparseable: string[] = [];
function toHex(v: string): string | null {
  const c = parse(v);
  if (!c) {
    unparseable.push(v);
    return null;
  }
  const alpha = (c as { alpha?: number }).alpha;
  return (alpha != null && alpha < 1 ? formatHex8(c) : formatHex(c)).toUpperCase();
}

function tokenTypeForBrand(name: string): TokenType {
  if (name.startsWith("font-")) return "fontFamily";
  if (name === "radius") return "dimension";
  return "color";
}

function serialize(value: unknown) {
  return JSON.stringify(value, null, 2);
}

// ---- stable tokens not expressed as CSS vars -------------------------------
const FONT_FAMILY = {
  display: { $type: "fontFamily", $value: ["DM Serif Display", "Times New Roman", "serif"], $description: "Money + headlines" },
  sans: { $type: "fontFamily", $value: ["Manrope", "Inter", "system-ui", "sans-serif"], $description: "Body / UI" },
  mono: { $type: "fontFamily", $value: ["JetBrains Mono", "ui-monospace", "monospace"], $description: "Ops / metadata / eyebrows" },
};

const FONT_SIZE = {
  display: "56px",
  h1: "48px",
  h2: "40px",
  h3: "28px",
  h4: "20px",
  body: "16px",
  small: "14px",
  eyebrow: "11px",
  kbd: "10px",
};

const TYPE_TOKEN_SPECS: TypeTokenSpec[] = [
  { key: "display", name: "Display", font: "serif", sample: "42 active threads", usage: "DM Serif Display · hero numerals + page titles", numeric: true },
  { key: "h1", name: "Heading 1", font: "serif", sample: "Run like an operator", usage: "DM Serif Display · primary page titles" },
  { key: "h2", name: "Heading 2", font: "serif", sample: "Inbound queue", usage: "DM Serif Display · section headers" },
  { key: "h3", name: "Heading 3", font: "serif", sample: "Price on outcomes", usage: "DM Serif Display · subsections and callouts" },
  { key: "h4", name: "Heading 4", font: "serif", sample: "Operator-grade copilot", usage: "DM Serif Display · compact section heads" },
  { key: "body", name: "Body", font: "sans", sample: "I drafted a reply. Send it?", usage: "Manrope 400/500 · default copy (line-height 1.55)" },
  { key: "small", name: "Small", font: "sans", sample: "Head of RevOps · Linnet Health", usage: "Manrope · metadata, secondary" },
  { key: "eyebrow", name: "Eyebrow", font: "mono", sample: "AGENT · ACTIVE", usage: "JetBrains Mono · uppercase labels · 0.14em tracking" },
  { key: "kbd", name: "Kbd", font: "mono", sample: "⌘K · RUN 0042", usage: "JetBrains Mono · keycaps and terse operator metadata", numeric: true },
];

const RADIUS_BLADE = { human: "60px 15px 60px 15px", agent: "15px 60px 15px 60px", blade: "4px 20px 4px 20px" };

// COLOR token name (DTCG/Figma) ← CSS var name in globals
const COLOR_MAP: [string, string][] = [
  ["background", "background"],
  ["foreground", "foreground"],
  ["muted-foreground", "muted-foreground"],
  ["card", "card"],
  ["surface", "surface"],
  ["surface-2", "surface-2"],
  ["surface-edge", "surface-edge"],
  ["border", "border"],
  ["border-strong", "border-strong"],
  ["good", "primary"],
  ["good-foreground", "primary-foreground"],
  ["hot", "hot"],
  ["warm", "warm"],
  ["cold", "cold"],
  ["bad", "destructive"],
  ["pending", "pending"],
  ["secondary", "secondary"],
  ["muted", "muted"],
  ["input", "input"],
];

const PRIMITIVES = ["emerald", "emerald-deep", "mossy", "moss-surface", "paper", "paper-2", "ink", "bone"] as const;

const COLOR_CATALOG: ColorGroupSpec[] = [
  {
    group: "Canvas + Surface",
    tokens: [
      { name: "emerald", cssVar: "--color-emerald", usage: "Primary light-mode canvas", text: "paper" },
      { name: "emerald-deep", cssVar: "--color-emerald-deep", usage: "Sidebar, inset wells, deep recesses", text: "paper" },
      { name: "mossy", cssVar: "--color-mossy", usage: "Primary dark-mode canvas", text: "paper" },
      { name: "moss-surface", cssVar: "--color-moss-surface", usage: "Dark popovers and dense panels", text: "paper" },
      { name: "surface", cssVar: "--color-surface", usage: "Default elevated film", text: "paper" },
      { name: "surface-2", cssVar: "--color-surface-2", usage: "Second elevation / hover film", text: "paper" },
      { name: "surface-edge", cssVar: "--color-surface-edge", usage: "Hairlines and edge treatment", text: "paper" },
    ],
  },
  {
    group: "Paper + Ink",
    tokens: [
      { name: "paper", cssVar: "--color-paper", usage: "Warm cream surface", text: "ink" },
      { name: "paper-2", cssVar: "--color-paper-2", usage: "Slightly darker paper layer", text: "ink" },
      { name: "bone", cssVar: "--color-bone", usage: "Bright light foreground / bone surface", text: "ink" },
      { name: "ink", cssVar: "--color-ink", usage: "Text on paper and accent surfaces", text: "paper" },
      { name: "foreground", cssVar: "--color-foreground", usage: "Default foreground in light mode", text: "paper" },
      { name: "muted-foreground", cssVar: "--color-muted-foreground", usage: "Secondary operator copy", text: "paper" },
    ],
  },
  {
    group: "Accent + Signals",
    tokens: [
      { name: "lime", cssVar: "--color-lime", usage: "Primary action accent", text: "ink" },
      { name: "volt", cssVar: "--color-volt", usage: "Active / live accent", text: "ink" },
      { name: "hot", cssVar: "--color-hot", usage: "Urgent / orange signal", text: "ink" },
      { name: "warm", cssVar: "--color-warm", usage: "Warning / yellow signal", text: "ink" },
      { name: "cold", cssVar: "--color-cold", usage: "Informational / blue signal", text: "paper" },
      { name: "bad", cssVar: "--color-bad", usage: "Error / destructive signal", text: "paper" },
      { name: "pending", cssVar: "--color-pending", usage: "Queued / review / draft signal", text: "ink" },
    ],
  },
];

// ---- build -----------------------------------------------------------------
const css = stripComments(await Bun.file(GLOBALS).text());
const theme = block(css, /@theme\s+inline\s*\{/);
const root = block(css, /:root\s*\{/);
const dark = block(css, /\.dark\s*\{/);

const brandEntries = Object.entries(root).filter(([name]) => name.startsWith("brand-"));

function resolveColorVar(varName: string, scopes: Record<string, string>[]) {
  const raw = lookupVar(varName, scopes);
  if (!raw) return null;
  return toHex(resolveValue(raw, scopes));
}

function colorSet(vars: Record<string, string>, scopes: Record<string, string>[]) {
  const out: Record<string, { $type: "color"; $value: string }> = {};
  for (const [name, src] of COLOR_MAP) {
    const hex = resolveColorVar(src, scopes);
    if (hex) out[name] = { $type: "color", $value: hex };
  }
  return out;
}

const primitive: Record<string, unknown> = {};
for (const primitiveName of PRIMITIVES) {
  const hex = resolveColorVar(`color-${primitiveName}`, [theme, root]);
  if (hex) primitive[primitiveName] = { $type: "color", $value: hex };
}

const brand: Record<string, unknown> = {};
for (const [name, raw] of brandEntries) {
  const type = tokenTypeForBrand(name.replace(/^brand-/, ""));
  if (type === "color") {
    const hex = toHex(resolveValue(raw, [root]));
    if (hex) brand[name.replace(/^brand-/, "")] = { $type: "color", $value: hex };
    continue;
  }
  brand[name.replace(/^brand-/, "")] = { $type: type, $value: raw };
}

const radius: Record<string, unknown> = {};
for (const token of ["sm", "md", "lg", "xl", "2xl"] as const) {
  if (theme[`radius-${token}`]) radius[token] = { $type: "dimension", $value: theme[`radius-${token}`] };
}
radius.pill = { $type: "dimension", $value: "9999px" };

const light = colorSet(root, [root]);
const darkColors = colorSet(dark, [dark, root]);

// DTCG (mirrors the prior tokens.json shape, now generated + computed sRGB)
const dtcg = {
  $description: "GENERATED by tokens/build.ts from app/globals.css — do not hand-edit. sRGB computed from the shipped oklch via culori; run `bun run tokens` to regenerate.",
  primitive,
  brand,
  color: { light, dark: darkColors },
  fontFamily: FONT_FAMILY,
  fontSize: Object.fromEntries(Object.entries(FONT_SIZE).map(([k, v]) => [k, { $type: "dimension", $value: v }])),
  radius,
  radiusBlade: {
    $description: "Leaf-blade asymmetric radii",
    human: { $type: "dimension", $value: RADIUS_BLADE.human },
    agent: { $type: "dimension", $value: RADIUS_BLADE.agent },
  },
  shadow: {
    "1": { $type: "shadow", $value: root["shadow-1"] ?? "", $valueDark: dark["shadow-1"] ?? "" },
    "2": { $type: "shadow", $value: root["shadow-2"] ?? "", $valueDark: dark["shadow-2"] ?? "" },
    "3": { $type: "shadow", $value: root["shadow-3"] ?? "", $valueDark: dark["shadow-3"] ?? "" },
  },
};

// Tokens Studio (sets → Figma Variable modes) for the Figma import
const globalSet = {
  brand,
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

const generatedCss = `/* GENERATED by tokens/build.ts from globals.css — adoption: replace the
   :root/.dark token block in globals.css with: @import "./tokens.generated.css"; */\n\n${cssBlock(":root", root)}\n\n${cssBlock(".dark", dark)}\n`;

const generatedCatalog = COLOR_CATALOG.map((group) => ({
  group: group.group,
  tokens: group.tokens
    .map((token) => {
      const key = token.cssVar.replace(/^--/, "");
      const hex = resolveColorVar(key, [theme, root]);
      if (!hex) return null;
      return { ...token, hex };
    })
    .filter((token): token is ColorTokenSpec & { hex: string } => token !== null),
}));

const generatedTypeTokens = TYPE_TOKEN_SPECS.map((token) => ({
  name: token.name,
  font: token.font,
  size: FONT_SIZE[token.key],
  sample: token.sample,
  usage: token.usage,
  ...(token.numeric ? { numeric: true } : {}),
}));

const generatedRadii = [
  { name: "sm", value: theme["radius-sm"], usage: "chips, tags" },
  { name: "md", value: theme["radius-md"], usage: "inputs, buttons" },
  { name: "lg", value: theme["radius-lg"], usage: "standard cards" },
  { name: "xl", value: theme["radius-xl"], usage: "hero cards, modals" },
  { name: "2xl", value: theme["radius-2xl"], usage: "large feature wells" },
  { name: "pill", value: "9999px", usage: "pills, badges, CTA buttons" },
  { name: "blade", value: RADIUS_BLADE.blade, usage: "leaf-blade asymmetric accent corners" },
];

const generatedTs = `// AI Ops OS — generated design token catalog.
// Derived from app/globals.css by tokens/build.ts.
// Do not hand-edit; run \`bun run tokens\` to regenerate.

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

export const COLOR_TOKENS: ColorGroup[] = ${serialize(generatedCatalog)};

export const TYPE_TOKENS: TypeToken[] = ${serialize(generatedTypeTokens)};

export const RADII: RadiusToken[] = ${serialize(generatedRadii)};
`;

// ---- write or check --------------------------------------------------------
const outputs: [string, string][] = [
  [OUT_DTCG, `${serialize(dtcg)}\n`],
  [OUT_FIGMA, `${serialize(figma)}\n`],
  [OUT_CSS, generatedCss],
  [OUT_TS, `${generatedTs}\n`],
];

if (check) {
  let drift = false;
  for (const [path, content] of outputs) {
    const file = Bun.file(path);
    const cur = (await file.exists()) ? await file.text() : "";
    if (cur !== content) {
      drift = true;
      console.error(`✗ DRIFT: ${path.replace(ROOT, "")} is stale — run \`bun run tokens\``);
    }
  }
  if (unparseable.length) {
    console.warn(`(skipped ${unparseable.length} non-color value(s): ${[...new Set(unparseable)].join(", ")})`);
  }
  if (drift) process.exit(1);
  console.log("✓ tokens in sync (globals.css ⇄ tokens.json ⇄ figma.tokens.json ⇄ tokens.generated.ts)");
} else {
  for (const [path, content] of outputs) await Bun.write(path, content);
  console.log(
    `✓ generated from globals.css:
  • ${OUT_DTCG.replace(ROOT, "")}  (${Object.keys(light).length} light · ${Object.keys(darkColors).length} dark colors)
  • ${OUT_FIGMA.replace(ROOT, "")}  (Tokens Studio → Figma import)
  • ${OUT_CSS.replace(ROOT, "")}  (CSS adoption artifact)
  • ${OUT_TS.replace(ROOT, "")}  (typed token catalog)`
  );
  if (unparseable.length) {
    console.warn(`  (skipped ${unparseable.length} derived value(s): ${[...new Set(unparseable)].join(", ")})`);
  }
}
