# Supernova Tied Components — The 12 to Form

Supernova's job here is to be the hub: embed the Figma frames, ingest the Storybook canvases, document the tokens, and **tie design ↔ code** so an engineer reading the portal jumps straight from a Figma component to its live story and source. This page is the inventory to form, the exact name-parity table the tie depends on, the import steps — and an honest note on what's automatable and what isn't.

## The 12 components

These are the atomic kit. Each is a real, variable-bound Figma component-set, a live Storybook story, and a code export — named 1:1 so Supernova links them automatically.

`StatusDot · Badge · Pill · IntentChip · MiniBar · IconTile · Kbd · Bubble · Button · PageHeader · LiveSignage · Panel`

## Name-parity table (the bridge)

> **Figma component name === Storybook title leaf === code component name.** If any of the three drift, Supernova can't tie them. This table is the contract.

| # | Figma component | Storybook title | Code source | Props / variants |
|---|---|---|---|---|
| 1 | **Badge** | `Kit/Badge` | `components/site/accents.tsx` | `tone` (good·hot·warm·cold·bad·pending·muted), `dot`, `pulse`, `glow`, children |
| 2 | **StatusDot** | `Kit/StatusDot` | `components/site/accents.tsx` | `tone` (7), `pulse` |
| 3 | **Pill** | `Kit/Pill` | `components/site/accents.tsx` | `active`, `count`, children |
| 4 | **IntentChip** | `Kit/IntentChip` | `components/operator/intent-chip.tsx` | `intent` (high→Hot · mid→Warm · cold→Cold), `score` 0–100 |
| 5 | **MiniBar** | `Kit/MiniBar` | `components/site/accents.tsx` | `value` 0–100, `tone` |
| 6 | **IconTile** | `Foundations/Icons (IconTile)` | `components/site/accents.tsx` | `tone?`, children (icon) |
| 7 | **Kbd** | `Foundations (Kbd)` | `components/site/accents.tsx` | children |
| 8 | **Bubble** | `Kit/Bubble` | `components/operator/bubble.tsx` | `from` (human·agent·reasoning) — leaf-blade radii |
| 9 | **Button** | `Kit/Buttons` | `components/site/surfaces.ts` (`BTN_PRIMARY`/`BTN_GHOST`) | variant (primary·ghost), size (sm·md·lg), `+icon` |
| 10 | **PageHeader** | `Kit/PageHeader` | `components/site/page-header.tsx` | `eyebrow`, `title`, `subtitle?`, `chips?[]`, `right?` slot |
| 11 | **LiveSignage** | `Kit/LiveSignage` | `components/site/page-header.tsx` | `label?`, `stamp?` |
| 12 | **Panel** | `Foundations/Surfaces` | `components/site/surfaces.ts` (`PANEL`/`LIFT`) | static · lift (hover-float) |

**Compositions** (eng wires telemetry into these — document as patterns, not atomic tied components): `MetricRow`, `LeadQueue`, `ThreadView`, `Composer`, `AgentChat`, `TopBar`, `Masthead`, `Footer`. Their state slots are in [`04-state-patterns.md`](04-state-patterns.md).

## Import steps (Data Sources)

In Supernova DS **`823274`** (akhaus / Brand):

1. **Figma source** — Data Sources → **Figma** → authorize Figma → select file **`rtzOAMl5gPIwav7lp1bNXP`** ("Ops Surfer — Design System") → import. Brings in **Variables** (Light/Dark modes) + the **12 component-sets**.
2. **Storybook source** — Data Sources → **Storybook** → point at the **Chromatic** build, appId **`6a1e5264816bad7cf1991083`** (or the hosted Storybook URL) → ingest the **39 stories**.
3. **Tokens** — Supernova reads the Figma Variables automatically, *or* import `operator-app/tokens/tokens.json` (DTCG). Both are kept in sync by the pipeline, so either is fine.

Because the names in the table above already match 1:1, Supernova ties each Figma component to its Storybook story automatically — **no Code Connect needed** (Code Connect is Org/Enterprise-gated; this account is Pro, so name-link is the path).

## Forming the tied components in the portal

For each of the 12, the portal page should present:

- the **Figma frame** (embedded — the design source of truth, variable-bound),
- the **Storybook canvas** (embedded — the live, interactive code, with autodocs + a11y),
- the **props/variants** (from the table — the wiring contract),
- a link to the **code source** file.

That triple — design, code, contract — on one page is what makes a "tied component" worth more than three separate links.

## Honest note: this content vs. the Supernova action

Be clear about the boundary:

- **This portal content** (these six markdown files) is what *populates* Supernova — the documentation contract. It's authored here, in the repo, reviewable in git.
- **Forming the tied components and publishing the portal** is a **Supernova UI / OAuth action** in `app.supernova.io`. It is **not MCP-automatable**: adding the Figma Data Source OAuths to Figma, adding the Storybook source points at Chromatic, and "publish" is an editor action. It must be done by a Supernova editor (≈3 min) with Supernova + Figma auth.
- **The `supernova-mcp` readers are read-only verification**, not authoring. After an editor connects the sources, `get_figma_component_list` should return **12**, `get_storybook_story_list` should return **39**, and `get_token_list` should return the tokens — all currently **0** until the sources are connected. The readers confirm the tie resolved; they can't create it.

So: this content is the *what*. A Supernova editor performs the *connect + publish*. The verification is automatable; the action is not.

## Keeping it in sync (governance)

- **Tokens:** edit `app/globals.css` → `bun run tokens` → commit. CI `tokens:check` fails on drift. Re-import `figma.tokens.json` via Tokens Studio; Supernova re-reads `tokens.json`.
- **Storybook:** push to `design` → Chromatic republishes → Supernova re-ingests.
- **Components:** edit in code → Storybook + Chromatic update → mirror in the Figma library → re-publish the Team Library. Keep the three names locked or the tie breaks.
