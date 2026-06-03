# Ops Surfer — DS Fixes Build Spec (2026-06-03)

Implements the 5 assessment gaps. **Default behavior must be visually identical to today** — the Ops Surfer brand is the *default* brand, so nothing re-skins unless a consumer opts in. bun only. TypeScript only. This is a NON-STANDARD Next.js — read `operator-app/node_modules/next/dist/docs/` before any Next-API code (per `operator-app/AGENTS.md`). Verify at the end: `bunx tsc --noEmit` clean, `bun run build-storybook` exit 0, `bun run tokens:check` passes.

## A. Brand-token indirection (globals.css + tokens/build.ts) — FOUNDATIONAL

The seam already exists: `@theme inline` aliases `--color-good → var(--primary)`. Add ONE hop UP so semantic tokens read through a **brand-DNA layer**. Do NOT create a new JSON/TS catalog — the indirection lives in `globals.css` and `build.ts` projects it (single source).

1. In `globals.css` `:root`, add a `--brand-*` primitive block (the brand DNA), defaulting to today's Ops Surfer values:
   - `--brand-accent` (= current lime/good), `--brand-accent-2` (= volt), `--brand-canvas` (emerald `#1e5631`), `--brand-canvas-deep` (`#163f23`), `--brand-paper` (`#f4f1e8`), `--brand-paper-2` (`#efeadb`), `--brand-ink` (`#0a1410`), `--brand-bone` (`#fdfdfa`), and signal hues `--brand-hot/--brand-warm/--brand-cold/--brand-bad/--brand-pending`.
   - type: `--brand-font-display`, `--brand-font-sans`, `--brand-font-mono`; shape: `--brand-radius` (base, 14px).
2. Re-point the existing assignments to read THROUGH brand where it is brand-DNA (not mode-specific): e.g. the fixed anchors `--color-emerald/--color-paper/...` in `@theme` and the `:root`/`.dark` semantic vars for accent + signal hues reference `var(--brand-*)`. Mode-specific darkening (.dark canvas/surface films) may stay literal but should derive accent/signals from `--brand-*` so a brand re-skin flows into BOTH themes. Brand is ORTHOGONAL to light/dark.
3. A consumer re-skins with pure CSS: override `--brand-*` on `:root` or scoped `[data-brand="acme"] { --brand-accent: #...; }`. No code fork.
4. `tokens/build.ts`: parse the new `--brand-*` block and emit a `brand` token group into `tokens.json` + `figma.tokens.json`. Keep `tokens.generated.css` correct. `bun run tokens` then `bun run tokens:check` must pass (regenerate committed outputs).

## B. BrandProvider + presets (ergonomic API on top of A)

- `operator-app/lib/brand.ts`: a `Brand` type (the `--brand-*` keys) + `opsSurferBrand` (default preset = current values) + ONE example alternate preset (`exampleBrand`, e.g. a violet/slate re-skin) to PROVE white-label.
- `operator-app/components/brand-provider.tsx`: `<BrandProvider brand={Partial<Brand>} data-brand? >` that maps brand keys → CSS custom properties as an inline `style` on a wrapper `div` (and sets `data-brand` if named). Minimal, dependency-free, SSR-safe. Export a `useBrand` no-op-safe hook optional. This is the runtime API; CSS-var override is the fallback that works without it.

## C. Slot / config API on the feature layer (scoped by role)

- **Every** `components/operator/*` feature component + `components/site/*` that lacks it: add `className?: string` passthrough merged via `cn()` (tailwind-merge). (Today only `Bubble` has it.)
- **Orchestrator** `operator/operator-surface.tsx`: add an optional **config object** prop, e.g. `config?: { panels?: { metrics?: boolean; queue?: boolean; thread?: boolean; copilot?: boolean }, slots?: { header?: ReactNode; empty?: ReactNode } }` — lets a consumer choose which panels render + inject slot overrides. Default = today's full layout (all panels on). Keep mock data wiring intact.
- **Leaf** components (`LeadQueue`, `ThreadView`, `Composer`, `AgentChat`, `MetricRow`): add render-slot props **`emptyState?`, `loadingState?`, `errorState?`** (ReactNode) that default to the D-components below. This is how a customer re-voices agent failures/empties without forking. Keep existing data props.

## D. State components (the missing empty/loading/error coverage) — these ARE the default slot content

Create `components/site/states.tsx` (or `components/operator/states.tsx`) exporting:
- `Skeleton({ className })` — token-driven shimmer (respects `prefers-reduced-motion`).
- `EmptyState({ icon?, title, hint?, action?, className })` — neutral empty pattern (dot-grid PANEL, muted voice).
- `ErrorState({ title, detail?, onRetry?, tone='bad', className })` — agentic failure pattern with a **Retry** CTA + customizable voice (this is the agentic-CS surface the customer customizes).
Wire defaults: `LeadQueue` empty→EmptyState("No leads in queue"), loading→Skeleton rows, error→ErrorState("Couldn't load the queue", retry). `ThreadView` no-selection→EmptyState, loading→Skeleton, error→ErrorState. `Composer` drafting→loading affordance, draft-failed→ErrorState("Draft failed to send", retry). `AgentChat` thinking→loading, agent-error→ErrorState. `MetricRow`/charts no-data→EmptyState, loading→Skeleton. Drive via optional `state?: 'ready'|'loading'|'empty'|'error'` prop (default 'ready') so stories can demo each.

## E. Retire/regenerate lib/tokens.ts (kill the orphan catalog)

`lib/tokens.ts` has ZERO importers (verified), hardcoded hex, an incompatible 3rd naming scheme, and a false "export surface" claim. Regenerate it as a **typed projection emitted by `tokens/build.ts`** → write `lib/tokens.generated.ts` (typed `COLOR_TOKENS`/`TYPE_TOKENS`/`RADII` derived from globals.css), bring it under `tokens:check`, delete the hand-authored `lib/tokens.ts`, and point the styleguide page + `Foundations.stories.tsx` (which hand-roll their own `RADII`) at the generated file. Net: one source, no satellite catalogs.

## F. Coverage stories (Storybook)

Add stories for the un-storied: `Operator/Sidebar` (operator/sidebar.tsx) and `Site/LiveHeroBadges` (site/live-hero-badges.tsx). Add **state stories** for every D-wired surface: `Operator/LeadQueue` → add `Empty`, `Loading`, `Error`; `Operator/ThreadView` → `Empty`, `Loading`, `Error`; `Operator/Composer` → `Drafting`, `Failed`; `Operator/AgentChat` → `Thinking`, `Error`; `Operator/MetricRow` → `Loading`, `NoData`; plus `Kit/State` (Skeleton/EmptyState/ErrorState playground) and `Foundations/Brand` showing the BrandProvider re-skin (default vs exampleBrand side by side). All stories: `tags:['autodocs']`, dual-theme compatible.

## Guardrails
- Default brand = current values → **zero visual change** unless a consumer opts in. Verify the app looks identical at `/` and `/app` after the change (both themes).
- Preserve leaf-blade bubbles, the signal grammar, `prefers-reduced-motion`/`-transparency`/`-contrast` guards.
- No new deps unless essential. cn() from `lib/utils.ts`. Don't touch `main`.
- After building: run `bunx tsc --noEmit`, `bun run tokens && bun run tokens:check`, `bun run build-storybook` — all must pass; report results.
