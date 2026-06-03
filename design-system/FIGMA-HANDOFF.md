# Ops Surfer — Figma Handoff (Design System)

> Updated 2026-06-02. The Figma file `rtzOAMl5gPIwav7lp1bNXP` ("Ops Surfer — Design System") now has a **real component library** on the **Components** page (`2:3`, was empty). 12 variant-organized, variable-bound components named 1:1 with code + Storybook. This replaces the audit finding of "screen captures, no components."

## What's real now (built this session, via `use_figma` Plugin API)
- **Components page (2:3)** — a dark-mode board with 12 real component-sets, every fill/stroke **bound to the 47 Variables** (no raw hex):
  `StatusDot` · `Badge` · `Pill` · `IntentChip` · `MiniBar` · `IconTile` · `Kbd` · `Bubble` · `Button` · `PageHeader` · `LiveSignage` · `Panel`.
- **Real variants + component properties**: Badge tone(7) + `Dot` boolean; Button Variant(primary/ghost)×Size(sm/md/lg); IntentChip Intent(3); Bubble From(human/agent/reasoning) with leaf-blade radii; MiniBar/StatusDot/IconTile tone axes; Pill/Panel state axes.
- **Tokenized handoff (the audit's #1 fix)**: `get_design_context` on a component now returns a **typed React component** with `var(--color-…)` tokens and real props — not the captures' `left-[28px] w-[485.336px] rgba(...)`. **WEB codeSyntax** is set on the 16 color variables so Dev Mode emits the exact CSS names (`var(--color-good)`, etc.).

## Naming parity — the Supernova bridge (Figma === Storybook === code)
| Figma component | Storybook title | Code source |
|---|---|---|
| Badge | Kit/Badge | components/site/accents.tsx |
| StatusDot | Kit/StatusDot | components/site/accents.tsx |
| Pill | Kit/Pill | components/site/accents.tsx |
| IntentChip | Kit/IntentChip | components/operator/intent-chip.tsx |
| MiniBar | Kit/MiniBar | components/site/accents.tsx |
| IconTile | Foundations/Icons (IconTile) | components/site/accents.tsx |
| Kbd | Foundations (Kbd) | components/site/accents.tsx |
| Bubble | Kit/Bubble | components/operator/bubble.tsx |
| Button | Kit/Buttons | components/site/surfaces.ts (BTN_PRIMARY/BTN_GHOST) |
| PageHeader | Kit/PageHeader | components/site/page-header.tsx |
| LiveSignage | Kit/LiveSignage | components/site/page-header.tsx |
| Panel | Foundations/Surfaces | components/site/surfaces.ts (PANEL/LIFT) |

## Manual finish (UI-only — these have no MCP/API path)
1. **Publish as Team Library**: Figma → Assets panel → **Publish** (select the 12 components + variables).
2. **Supernova** (DS `823274`): add two sources — (a) this Figma library, (b) the Chromatic Storybook (`6a1e5264816bad7cf1991083`). Supernova links design↔code **by name** (Code Connect is Org/Enterprise-gated; this account is Pro → name-link). The names above are already 1:1, so the link resolves automatically.
3. Verify: after publish+connect, `supernova-mcp get_figma_component_list` / `get_storybook_story_list` will return the inventory (currently 0 = not yet connected).

## Screens — DONE (all 8 from instances)
Operator Console (`2:7`) + Home/Dashboard/Clients/Leads/ROI/Agents (`2:8`) + Styleguide (`2:4`) rebuilt from component instances, light+dark, all pixel captures removed.

## Token pipeline (single source → no drift)
**Source of truth: `operator-app/app/globals.css`** (`:root` = light · `.dark` = dark · `@theme inline` = primitives/radii). Everything else is **generated** — never hand-typed:
- `bun run tokens` → regenerates `tokens/tokens.json` (DTCG, sRGB **computed** from the shipped oklch via culori), `tokens/figma.tokens.json` (Tokens Studio format), `app/tokens.generated.css`.
- `bun run tokens:check` → exits non-zero if any output is stale (the **drift gate** — add to CI alongside Chromatic).
- Generator: `tokens/build.ts`. First run corrected **11** hand-typed sRGB values that had silently drifted from the oklch (the exact audit finding).
- **Figma sync:** import `tokens/figma.tokens.json` via the **Tokens Studio** plugin → Figma Variables (Light/Dark modes). Edit globals.css → `bun run tokens` → re-import.
- **Optional adoption:** replace the `:root`/`.dark` token block in globals.css with `@import "./tokens.generated.css";` to make the CSS consume the generated block directly (post-demo; not required).

## Supernova connect (after publishing the Figma library)
1. Supernova → DS `823274` → **Data Sources** → add the **Figma file** (`rtzOAMl5gPIwav7lp1bNXP`) → import Variables + the 12 components.
2. **Data Sources** → add the **Storybook** (Chromatic: `6a1e5264816bad7cf1991083`) → ingest the 39 stories.
3. Supernova links design↔code **by name** (already 1:1 — see §0). Verify via `supernova-mcp get_figma_component_list` / `get_storybook_story_list` (return 0/0 until connected).
