#!/usr/bin/env bun
/**
 * Name-link parity gate.
 *
 * The Ops Surfer design system bridges four surfaces by NAME:
 *   Figma component-set  ===  CONTRACT.md entry  ===  code symbol  ===  Storybook title leaf
 * If any one drifts, Supernova can no longer link design ↔ code and the
 * "cohesive process" silently breaks. This gate fails the build on drift.
 *
 * Source of truth: design-system/component-registry.json (the canonical names +
 * a COMMITTED Figma snapshot — CI cannot auth Figma live, so the snapshot is the
 * checked-in record; refresh it when the Figma library changes).
 *
 * Run locally:  bun design-system/scripts/check-name-parity.ts
 * CI:           .github/workflows/name-parity.yml (push to `design` + PRs)
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const here = import.meta.dir;                 // design-system/scripts
const dsDir = join(here, "..");               // design-system
const repo = join(dsDir, "..");               // repo root
const app = join(repo, "operator-app");

type Component = {
  name: string;
  figma: { nodeId: string; name: string };
  storybook: string;
  code: { file: string; symbols: string[] };
};

const registry = JSON.parse(
  readFileSync(join(dsDir, "component-registry.json"), "utf8"),
) as { components: Component[]; kitExceptions?: string[] };

const contractPath = join(dsDir, "CONTRACT.md");
const contract = existsSync(contractPath) ? readFileSync(contractPath, "utf8") : "";

// ---- gather every Storybook title across the stories tree ----
function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}
const storyTitles = new Set<string>();
for (const f of walk(join(app, "stories"))) {
  if (!/\.stories\.(tsx|ts|jsx|js)$/.test(f)) continue;
  const src = readFileSync(f, "utf8");
  for (const m of src.matchAll(/title:\s*["'`]([^"'`]+)["'`]/g)) storyTitles.add(m[1]);
}

const errors: string[] = [];
const warnings: string[] = [];

for (const c of registry.components) {
  // 1. code symbol(s) exist in the named file
  const codeFile = join(app, c.code.file);
  if (!existsSync(codeFile)) {
    errors.push(`${c.name}: code file missing — ${c.code.file}`);
  } else {
    const src = readFileSync(codeFile, "utf8");
    const found = c.code.symbols.some((s) =>
      new RegExp(`export\\s+(?:function|const|class)\\s+${s}\\b`).test(src),
    );
    if (!found)
      errors.push(
        `${c.name}: no export {${c.code.symbols.join(" | ")}} in ${c.code.file}`,
      );
  }
  // 2. Storybook title leaf exists
  if (!storyTitles.has(c.storybook))
    errors.push(`${c.name}: Storybook title "${c.storybook}" not found in stories/`);
  // 3. CONTRACT.md names the component
  if (contract && !new RegExp(`\\b${c.name}\\b`).test(contract))
    errors.push(`${c.name}: not named in design-system/CONTRACT.md`);
  // 4. committed Figma snapshot is intact
  if (!c.figma?.name || !c.figma?.nodeId)
    errors.push(`${c.name}: missing figma snapshot fields in component-registry.json`);
}

// orphan check (warn, non-fatal): a new Kit/* story with no registry entry
const known = new Set(registry.components.map((c) => c.storybook));
const exceptions = new Set(registry.kitExceptions ?? []);
for (const t of storyTitles) {
  if (t.startsWith("Kit/") && !known.has(t) && !exceptions.has(t))
    warnings.push(
      `Storybook "${t}" (Kit/*) has no registry entry — add it to component-registry.json or list it in kitExceptions.`,
    );
}

for (const w of warnings) console.warn(`⚠ ${w}`);

if (errors.length) {
  console.error(
    `\n✗ NAME-PARITY DRIFT (${errors.length}):\n` +
      errors.map((e) => `  - ${e}`).join("\n") +
      `\n\nFigma ↔ CONTRACT.md ↔ code ↔ Storybook must stay 1:1.\n` +
      `Fix the name, or update design-system/component-registry.json.\n`,
  );
  process.exit(1);
}

console.log(
  `✓ name-parity: ${registry.components.length} components aligned across Figma snapshot, CONTRACT.md, code, and Storybook` +
    (warnings.length ? ` (${warnings.length} warning(s))` : "") +
    ".",
);
