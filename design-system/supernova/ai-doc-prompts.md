# Supernova "Write with AI" — prompt pack for the Ops Surfer portal

Paste the **CONTEXT primer** first (or keep it in the AI thread), then the **per-page brief**.
These tell Supernova's Documentation agent to build *native DS docs* — Figma embeds, Token blocks,
Storybook embeds, component property tables, callouts — not a wall of converted markdown.

> Data-bound blocks (Figma embed, Token, Storybook, Component) may need you to pick the specific
> component/token in the block after the AI scaffolds it — the AI places the block + structure; you
> bind the source. Everything is already connected in this DS (20 components, Light/Dark tokens).

---

## CONTEXT primer (paste once per page/thread)

You are the Documentation agent for the **Ops Surfer Design System** in Supernova. Author native Supernova documentation using the platform's blocks (Heading, Callout, Table, Code, Token, Figma embed, Storybook embed, Component, Divider) — never leave raw markdown symbols, and prefer rich blocks over plain paragraphs.

About the system:
- Ops Surfer is a **dual-theme (light/dark) design system for agentic client-success consoles** — the operator-facing backend where a human runs a fleet of AI agents on real leads and threads. It is a **product** design system, not a marketing kit.
- **Two governing rules.** (1) *Signal grammar* — color means exactly one thing (good · hot · warm · cold · bad · pending); text stays one color, the elements around it carry the signal; motion is reserved for real events. (2) *Re-skin contract* — a consumer white-labels the entire surface by overriding one brand-DNA layer (`--brand-*`), in both themes, with no code fork.
- **20 components, tied design↔code in this DS:** 12-atom kit (StatusDot, Badge, Pill, IntentChip, MiniBar, IconTile, Kbd, Bubble, Button, PageHeader, LiveSignage, Panel) + 8 shadcn/base-ui primitives (UI/Button, UI/Badge, UI/Input, UI/Textarea, UI/Separator, UI/Avatar, UI/Card, UI/Tooltip). Each is linked to its Figma component + Storybook story.
- **Tokens** are authored once in code (`operator-app/app/globals.css`) and generated to Figma Variables + Storybook; **Light and Dark themes both exist** here. The cascade is brand-DNA (`--brand-*`) → semantic (`--color-*`) → component.
- **Voice:** operator-to-operator — confident, technical, retro-modern; never corporate, never servile, no emoji.

Author the page described next.

---

## Page: Getting Started
Build a first-landing orientation page:
- **Heading + short intro:** what Ops Surfer is, and that it's one source of truth shown across four surfaces.
- **Callout block** stating the two governing rules (signal grammar; re-skin contract).
- **Table block "The four surfaces"** — columns *Surface | What it is | Who uses it*: Code (`operator-app`, `globals.css` is the token source of truth), Figma (file `rtzOAMl5gPIwav7lp1bNXP`, 20 variable-bound components, Light/Dark modes), Storybook (Chromatic, live stories + a11y), Supernova (this hub — embeds Figma + Storybook, links design↔code by name).
- **Heading "Orient by what you came to do"** + a bulleted list that **links to** the Customization Guide, Slot & Config API, Token Reference, State Patterns, and Tied Components pages.
- **Callout "The naming-parity bridge":** Figma component name === Storybook title leaf === code symbol → Supernova links design↔code automatically (Code Connect is Org/Enterprise-only; this is a Pro plan, so name-link is the path).
- **Code block** showing the token pipeline: `bun run tokens` (regenerate) and `bun run tokens:check` (CI drift gate).

## Page: Customization Guide — Re-skin Without Forking
This is the headline differentiator page. Build:
- Intro + a **Callout**: a consumer re-skins the whole product by overriding the `--brand-*` DNA layer — both themes, every signal — with zero fork.
- **Code blocks** showing the two override paths: (1) a CSS `:root { --brand-accent: …; --brand-canvas: …; }` whole-tenant override; (2) a `<BrandProvider brand={…}>` / `data-brand-scope` subtree override (point to `operator-app/lib/brand.ts` + `components/brand-provider.tsx`).
- A **Table** of the brand-DNA keys (accent, accent2, canvas, canvasDeep, paper, ink, signals hot/warm/cold/bad/pending, radius, fonts) with what each controls, noting `*Dark` counterparts keep it theme-orthogonal.
- A **Figma embed** of a component (e.g. Button or Badge) so readers see the live design that re-skins.
- **Callout** on the cascade: brand-DNA → semantic → component, so overriding DNA flows everywhere.

## Page: Slot & Config API Reference — Compose Without Forking
- Intro: how to recompose the surface without forking — `className` passthrough, the `OperatorSurface` `config` object (toggle panels + header slot), and `emptyState` / `loadingState` / `errorState` render-slots on the operator feature components.
- A **Table** of the feature components (LeadQueue, ThreadView, Composer, AgentChat, MetricRow, OperatorSurface) × which slots/props each accepts.
- **Code blocks** with real usage examples of the `config` object and a state-slot override.
- **Storybook embed** of an operator composition (e.g. OperatorSurface or LeadQueue) so the API is shown live.

## Page: Token Reference
- Intro: tokens authored in code, generated to Figma + Storybook; the brand-DNA → semantic → component cascade; the `tokens:check` drift gate.
- **Token blocks** showing the actual groups in this DS, with **both Light and Dark theme values**: the signal palette (good/hot/warm/cold/bad/pending), the surfaces (background, card, surface, surface-2, border, border-strong), and the brand-DNA layer.
- **Table** of the type ramp (display 56 / h1 48 / h2 40 / h3 28 / h4 20 / body 16 / small 14 / eyebrow 11 / kbd 10) with family (DM Serif / Manrope / JetBrains Mono) and the radius scale.
- **Callout:** never hand-edit generated token files — edit `globals.css`, run `bun run tokens`, commit.

## Page: State Patterns — Empty, Loading, Error, Skeleton
- Intro on **why states are the product** in an agentic tool: agents fail, queue, retry, hand off — the customer customizes the error-empathy voice, the loading affordance, the retry CTA.
- A **Table** mapping each operator surface (LeadQueue, ThreadView, Composer, AgentChat, MetricRow) to the states it implements (note Composer has no empty; MetricRow has no error — honor the real contract).
- **Storybook embeds** of the Empty / Loading / Error stories (they exist in Storybook now).
- **Code block** showing the `state` prop + `emptyState`/`loadingState`/`errorState` slot overrides from `components/site/states.tsx`.
- **Callout** on `prefers-reduced-motion` for the skeleton shimmer.

## Page: Supernova Tied Components — The 12 to Form
- Intro: how design↔code is bridged here (name-link, Code Connect off on Pro) and that all 20 components are tied in this DS.
- **Component overview Table / Component block** listing the 20 with their Figma node, Storybook title, and code symbol (this is the naming-parity contract).
- A **Callout** on the rule: renaming a component is a three-surface change (code + Figma + Storybook title move together) or the bridge breaks.
- A **Figma embed** of the Components board (Figma node `2:3`).

---

## Component-page pattern (reuse for each of the 20)
For component **<Name>**: a reference page with — a short intro (what it is, when to use, the tone/signal rules that apply); a **Figma embed** of the tied `<Name>` component; a **Storybook embed** of its primary story; a **component properties Table** (variants + props); and a **Code** usage snippet. Use the native Figma / Storybook / Component blocks bound to this DS's connected sources.

## Brand pages (Overview · Brand Voice · Graphic Language · Color = Signal · Customization & White-label)
Keep these tighter — **Callouts** for principles, a **Figma embed** of the logo/wave mark on Graphic Language, **Token blocks** for the palette on Color = Signal, and short scannable paragraphs. Voice: operator-to-operator.
