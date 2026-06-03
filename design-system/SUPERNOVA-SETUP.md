# Supernova Setup & Handoff — Ops Surfer Design System

**Audience: the team.** Connect Figma + Storybook in Supernova so design ↔ code round-trips, then merge `design`.

> **What's automated vs. manual.** The Figma library, the Storybook (Chromatic), the tokens, the drift gate, and the name-parity are all done and in the repo. The one remaining step — adding the two Data Sources in Supernova — is a UI action in `app.supernova.io` that OAuths to Figma, so it must be done by a Supernova editor (≈3 min). After that, anyone can ask the assistant to verify it via the `supernova-mcp` readers.

## Current state (ready ✅)
| Piece | State |
|---|---|
| Code | `design` @ `b774821` (pushed) — `tokens.yml` + `chromatic.yml` run on push |
| Storybook | auto-publishes to **Chromatic** appId `6a1e5264816bad7cf1991083` on push to `design` (39 stories) |
| Figma | `rtzOAMl5gPIwav7lp1bNXP` "Ops Surfer — Design System" — **publish as Team Library** (Assets → Publish) |
| Tokens | `operator-app/tokens/tokens.json` (DTCG) + `figma.tokens.json` (Tokens Studio), generated + CI drift-gated |
| Supernova | DS **823274** (akhaus / Brand) — **0 sources connected (this is the step below)** |

## A. Connect in Supernova (UI · ~3 min · needs Supernova + Figma auth)
1. **Figma source** — Supernova → DS 823274 → **Data Sources → Figma** → authorize Figma → select file `rtzOAMl5gPIwav7lp1bNXP` → import. Brings in **Variables** (Light/Dark modes) + the **12 components**.
2. **Storybook source** — **Data Sources → Storybook** → point at the **Chromatic** build (appId `6a1e5264816bad7cf1991083`) or the hosted Storybook URL → ingest the **39 stories**.
3. **Tokens** — Supernova reads the Figma Variables automatically; *or* import `operator-app/tokens/tokens.json` (DTCG). Both are kept in sync by the pipeline, so either is fine.

## B. Verify (ask the assistant, or check in Supernova)
The `supernova-mcp` readers should return, once connected:
- `get_figma_component_list` → **12** components
- `get_storybook_story_list` → **39** stories
- `get_token_list` → tokens present
- components resolve to stories **by name** (1:1).

## C. Name parity — the bridge (already 1:1)
Figma component name === Storybook title leaf === code component. Full table in [`FIGMA-HANDOFF.md`](FIGMA-HANDOFF.md) §0/§2 (Badge · StatusDot · Pill · IntentChip · MiniBar · IconTile · Kbd · Bubble · Button · PageHeader · LiveSignage · Panel). Because the names match, Supernova links design ↔ code automatically — no Code Connect needed (Code Connect is Org/Enterprise-only; this account is Pro, so name-link is the path).

## D. Keep it in sync (governance)
- **Tokens:** edit `app/globals.css` → `bun run tokens` → commit. CI **Tokens** check (`tokens:check`) fails the build on drift. Re-import `figma.tokens.json` via Tokens Studio (Figma) / Supernova re-reads `tokens.json`.
- **Storybook:** push to `design` → Chromatic republishes → Supernova re-ingests.
- **Components:** edit in code → Storybook + Chromatic update; mirror in the Figma library and re-publish.

## E. Merge
After A + B pass, merge `design` → `main` (or open the PR). The **Tokens** and **Chromatic** checks gate the merge, so nothing drifts in.
