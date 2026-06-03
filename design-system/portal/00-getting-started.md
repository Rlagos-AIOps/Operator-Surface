# Ops Surfer Design System — Getting Started

The system you build agentic client-success surfaces on. Tokens, a 12-component kit, and a re-skin contract — shipped from one source of truth so design, code, and docs never drift.

## What this is

Ops Surfer is a dual-theme design system for **agentic client-success consoles** — the operator-facing backend where a human runs a fleet of AI agents working real leads and threads. It is not a marketing kit. The grammar is built for a product where state changes constantly and the operator has to read the room at a glance: which agent is live, which lead is hot, which draft failed.

Two things make it a system rather than a stylesheet:

1. **A signal grammar.** Color means one thing and only one thing (good · hot · warm · cold · bad · pending). Text stays one color; the elements around it carry the signal. Motion is reserved for real events. These rules are enforced in code, mirror into Figma, and are documented in [`03-token-reference.md`](03-token-reference.md).
2. **A re-skin contract.** A consumer can white-label the whole surface without forking — override one brand-DNA layer and every theme, signal, and component follows. See [`01-customization-guide.md`](01-customization-guide.md).

## The four surfaces

The same design system shows up in four places. They are kept 1:1 by name parity (next section) and a single token pipeline.

| Surface | What it is | Who uses it |
|---|---|---|
| **Code** | `operator-app/` — the shipped Next.js app. `globals.css` is the token source of truth; the component kit lives in `components/site/` + `components/operator/`. | Integrators, app engineers. |
| **Figma** | File `rtzOAMl5gPIwav7lp1bNXP` ("Ops Surfer — Design System") — 12 variable-bound component-sets + Variables (Light/Dark modes), named 1:1 with code. | Designers. |
| **Storybook** | Chromatic build `6a1e5264816bad7cf1991083` — 39 live stories with autodocs + a11y, dual-theme. | Engineers, reviewers, QA. |
| **Supernova** | DS `823274` (akhaus / Brand) — the hub. Embeds Figma frames + Storybook canvases, documents tokens, links design↔code by name, and hosts this Portal. | Everyone — the front door. |

## How a consumer/integrator gets oriented

Depending on what you came to do:

- **Re-skinning for your brand** → start at [`01-customization-guide.md`](01-customization-guide.md). It's the headline doc: override `--brand-*` via CSS or `<BrandProvider>`, no fork.
- **Composing or trimming the surface** → [`02-slot-api-reference.md`](02-slot-api-reference.md). `className` passthrough, the `OperatorSurface` `config` object, and the `emptyState`/`loadingState`/`errorState` render-slots.
- **Reading or extending the tokens** → [`03-token-reference.md`](03-token-reference.md). The brand DNA → semantic → component cascade, plus the grammar rules.
- **Handling agent failures, empties, and loads** → [`04-state-patterns.md`](04-state-patterns.md). Why states matter in an agentic product and how they double as customizable slots.
- **Wiring Supernova / forming tied components** → [`05-supernova-tied-components.md`](05-supernova-tied-components.md). The name-parity table and the import steps.

## The naming-parity bridge

One rule makes the four surfaces a single system:

> **Figma component name === Storybook title leaf === code component name.**

`Badge` in Figma is `Kit/Badge` in Storybook is `Badge` in `components/site/accents.tsx`. Because the names match, Supernova links design↔code automatically — no Code Connect required (Code Connect is Org/Enterprise-gated; this account is Pro, so name-link is the path). The full table is in [`05-supernova-tied-components.md`](05-supernova-tied-components.md).

If a name drifts, the bridge breaks: Supernova can no longer tie the Figma component to its Storybook story. Renaming a component is a three-surface change — code, Figma, and the story title move together.

## Single source, no drift

Tokens are authored once in `operator-app/app/globals.css` and **generated** everywhere else by `tokens/build.ts`:

- `tokens/tokens.json` — DTCG, sRGB computed from the shipped oklch.
- `tokens/figma.tokens.json` — Tokens Studio format, for Figma Variables.
- `app/tokens.generated.css` — the generated CSS block.

`bun run tokens` regenerates them; `bun run tokens:check` is the CI drift gate (fails the build if any output is stale). Never hand-edit a generated file. Edit `globals.css`, regenerate, commit.
