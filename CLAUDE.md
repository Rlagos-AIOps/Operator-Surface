# Ops Surfer — design system project (Claude Code)

> Project doctrine for the **Operator-Surface `design` branch** (the design team's tree). Loaded by Claude Code sessions started here. Product = **Ops Surfer** (client-success / agentic-CS ops backend). Work on `design` ONLY — never `main` or `roberto-backend`.

## The tri-stack (+ the code that's the source of truth)

The **alpha code** (`operator-app/`) is the source of truth. Three deliverable surfaces mirror it, bridged by **name-link** (Code Connect is OFF — Pro full seat):

- **Figma** — `rtzOAMl5gPIwav7lp1bNXP` ("Ops Surfer — Design System"). 12 kit components + 8 UI primitives ("UI Primitives" page), variable-bound, dual-mode.
- **Storybook / Chromatic** — `operator-app/stories/`; CI publishes to Chromatic on push to `design`.
- **Supernova** — DS `823274` (akhaus / Brand). Docs portal + design↔code hub.

Bridge = the **name-parity gate**: `design-system/scripts/check-name-parity.ts` + `.github/workflows/name-parity.yml` enforce Figma set name === Storybook title leaf === code symbol (registry `design-system/component-registry.json`). Run: `bun design-system/scripts/check-name-parity.ts`.

## Supernova — READ with the MCP, WRITE with the SDK

- **Read:** the `supernova-mcp` server (`get_*` tools) streams the DS into the agent — **read-only**.
- **Write:** [`design-system/supernova/cli.ts`](design-system/supernova/cli.ts) (bun · `@supernovaio/sdk`) authors **into** Supernova — docs pages, component ties, tokens. This is how an agent does the steps the MCP can't (form the tied components, publish the `portal/` docs).
  - Auth: `SUPERNOVA_API_TOKEN` (a **Personal Access Token**) from **Doppler**/env — NEVER hardcoded or committed.
  - `doppler run -- bun design-system/supernova/cli.ts whoami` to connect; `… push-docs --commit` to author the portal. See `design-system/supernova/README.md`.
- **Code Connect is OFF** (no monthly option; a Dev seat would cost the Pro full seat). Don't propose it — name-link + the SDK cover it. AK emailed Figma; pending.

## Tokens — single source

`operator-app/app/globals.css` is canonical. In `operator-app`: `bun run tokens` regenerates `tokens/{tokens,figma.tokens}.json` + `tokens.generated.css` + `lib/tokens.generated.ts`; `bun run tokens:check` is the drift gate (CI). Brand-token indirection: a `--brand-*` layer + the `[data-brand-scope]` re-skin rule (customer white-label without forking — `<BrandProvider>` / `lib/brand.ts`).

## Conventions

- **bun only**, never npm/npx. **TypeScript only.**
- **`design` branch only.** Never touch `main`/`roberto-backend`.
- Non-standard Next.js — read `operator-app/node_modules/next/dist/docs/` before novel Next code (`operator-app/AGENTS.md`).
- Verify before claiming done: `bunx tsc --noEmit` · `bun run build-storybook` · `bun run tokens:check` · the name-parity gate. Browser-verify on the host dev server (`cd operator-app && bun run dev`, :3000) via chrome-devtools, both themes.
- Product north star: [`TELOS.md`](TELOS.md) (v1.0, signed off). Name = **Ops Surfer** (retire "AI Ops OS").
- Secrets (PATs, tokens) live in Doppler/secret managers — never in code, chat, or commits.
