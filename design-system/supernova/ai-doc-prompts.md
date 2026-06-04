# Ops Surfer — Supernova "Write with AI" prompt pack (all pages)

Complete prompts to author the entire Ops Surfer documentation portal natively in Supernova — no markdown paste, no manual block-building.

**How to use**
1. Open a page in Supernova's editor → **Write with AI**.
2. Paste the **Context primer** (§0) once at the start of the AI thread. (If you start a fresh thread per page, prepend it each time.)
3. Paste that page's prompt and run. Review/accept.
4. **Heads-up on data-bound blocks:** the AI builds the structure + all text/heading/table/code/callout blocks. The *live* blocks — **Figma embed, Token block, Storybook embed, Component block** — are bound to a specific source, so after the AI scaffolds them you may need to click the block and pick the component/token. That bind step is inherent to those block types; the prompts say which pages use them.

Connected entities you can reference: Figma file `rtzOAMl5gPIwav7lp1bNXP` (Components board node `2:3`), Storybook (Chromatic), 20 tied DS components, Light + Dark token themes.

---

## 0 · Context primer (paste first, once per thread)

> You are the Documentation agent for the **Ops Surfer Design System** in Supernova. Author **native** Supernova documentation using the platform's blocks — Heading, Callout, Table, Code, Token, Figma embed, Storybook embed, Component, Divider. Never leave raw markdown symbols visible; prefer rich blocks over plain paragraphs.
>
> **What Ops Surfer is:** a dual-theme (light/dark) design system for **agentic client-success consoles** — the operator-facing backend where one human runs a fleet of AI agents on real leads and threads. A product design system, not a marketing kit.
>
> **Two governing rules:** (1) **Signal grammar** — color means exactly one thing (good · hot · warm · cold · bad · pending); text stays one color, the surrounding elements carry the signal; motion is reserved for real events. (2) **Re-skin contract** — a consumer white-labels the whole surface by overriding one brand-DNA layer (`--brand-*`), in both themes, with no code fork.
>
> **20 components, tied design↔code in this DS:** kit — StatusDot, Badge, Pill, IntentChip, MiniBar, IconTile, Kbd, Bubble, Button, PageHeader, LiveSignage, Panel; primitives — UI/Button, UI/Badge, UI/Input, UI/Textarea, UI/Separator, UI/Avatar, UI/Card, UI/Tooltip. Each links to its Figma component + Storybook story.
>
> **Tokens** are authored once in code (`operator-app/app/globals.css`) and generated to Figma Variables + Storybook; Light and Dark themes both exist. Cascade: brand-DNA (`--brand-*`) → semantic (`--color-*`) → component.
>
> **Voice:** operator-to-operator — confident, technical, retro-modern; never corporate, never servile, no emoji.

---

# Portal pages

## 1 · Getting Started
> Author the **Getting Started** page.
> - Heading + a 2–3 sentence intro: what Ops Surfer is, and that it's one source of truth shown across four surfaces.
> - A **Callout** stating the two governing rules (signal grammar; re-skin contract).
> - A **Table** titled "The four surfaces" — columns *Surface | What it is | Who uses it*: **Code** (`operator-app`; `globals.css` is the token source of truth), **Figma** (file `rtzOAMl5gPIwav7lp1bNXP` — 20 variable-bound components, Light/Dark modes), **Storybook** (Chromatic — live stories + a11y), **Supernova** (this hub — embeds Figma + Storybook, links design↔code by name).
> - A Heading **"Orient by what you came to do"** + a bulleted list that **links** to the Customization Guide, Slot & Config API, Token Reference, State Patterns, and Tied Components pages.
> - A **Callout "The naming-parity bridge"**: Figma component name === Storybook title leaf === code symbol, so Supernova links design↔code automatically (Code Connect is Org/Enterprise-only; this is a Pro plan, so name-link is the path).
> - A **Code** block: `bun run tokens` (regenerate) and `bun run tokens:check` (CI drift gate).

## 2 · Customization Guide — Re-skin Without Forking
> Author the **Customization Guide** page — this is the headline differentiator.
> - Intro + a **Callout**: a consumer re-skins the whole product by overriding the `--brand-*` DNA layer — both themes, every signal — with zero fork.
> - Two **Code** blocks for the override paths: (1) CSS `:root { --brand-accent: …; --brand-canvas: …; }` whole-tenant; (2) `<BrandProvider brand={…}>` / `data-brand-scope` subtree (point to `operator-app/lib/brand.ts` + `components/brand-provider.tsx`).
> - A **Table** of the brand-DNA keys (accent, accent2, canvas, canvasDeep, paper, ink, hot, warm, cold, bad, pending, radius, fonts) — columns *Key | Controls | Theme note* (note `*Dark` counterparts keep it theme-orthogonal).
> - A **Figma embed** of a component (Button or Badge) so readers see the live design that re-skins.
> - A **Callout** on the cascade: brand-DNA → semantic → component, so overriding DNA flows everywhere.

## 3 · Slot & Config API Reference — Compose Without Forking
> Author the **Slot & Config API Reference** page.
> - Intro: recompose the surface without forking — `className` passthrough, the `OperatorSurface` `config` object (toggle panels + header slot), and `emptyState` / `loadingState` / `errorState` render-slots on the operator feature components.
> - A **Table** of feature components (LeadQueue, ThreadView, Composer, AgentChat, MetricRow, OperatorSurface) × the slots/props each accepts.
> - Two **Code** blocks: a real `config` object example, and a state-slot override example.
> - A **Storybook embed** of an operator composition (OperatorSurface or LeadQueue) to show the API live.

## 4 · Token Reference
> Author the **Token Reference** page.
> - Intro: tokens authored in code, generated to Figma + Storybook; the brand-DNA → semantic → component cascade; the `tokens:check` drift gate.
> - **Token blocks** showing the actual groups in this DS, with **both Light and Dark theme values**: the signal palette (good, hot, warm, cold, bad, pending), the surfaces (background, card, surface, surface-2, border, border-strong), and the brand-DNA layer.
> - A **Table** of the type ramp — *Token | px | Family*: display 56, h1 48, h2 40, h3 28, h4 20 (DM Serif Display); body 16, small 14 (Manrope); eyebrow 11, kbd 10 (JetBrains Mono) — plus the radius scale (sm 4 / md 8 / lg 14 / xl 20 / 2xl 28 / pill / blade).
> - A **Callout**: never hand-edit generated token files — edit `globals.css`, run `bun run tokens`, commit.

## 5 · State Patterns — Empty, Loading, Error, Skeleton
> Author the **State Patterns** page.
> - Intro on **why states are the product** in an agentic tool: agents fail, queue, retry, hand off — the customer customizes the error-empathy voice, the loading affordance, the retry CTA.
> - A **Table** mapping each operator surface (LeadQueue, ThreadView, Composer, AgentChat, MetricRow) to the states it implements — note **Composer has no empty** state and **MetricRow has no error** state (honor the real contract).
> - **Storybook embeds** of the Empty / Loading / Error stories (they exist in Storybook).
> - A **Code** block: the `state` prop + `emptyState`/`loadingState`/`errorState` slot overrides from `components/site/states.tsx`.
> - A **Callout** on `prefers-reduced-motion` for the skeleton shimmer.

## 6 · Supernova Tied Components — The Naming-Parity Bridge
> Author the **Tied Components** page.
> - Intro: how design↔code is bridged here (name-link; Code Connect off on Pro) and that all 20 components are tied in this DS.
> - A **Component overview block** (or **Table**) listing the 20 with *Component | Figma node | Storybook title | Code symbol* — the naming-parity contract.
> - A **Callout**: renaming a component is a three-surface change — code symbol, Figma name, and Storybook title leaf must move together, or the bridge breaks.
> - A **Figma embed** of the Components board (Figma node `2:3`).

---

# Brand pages

## 7 · Overview — Ops Surfer
> Author the **Overview** page.
> - Heading + intro: Ops Surfer is the ops backend for people who run on clients — agencies, consultancies, fractional operators. AI agents absorb the manual "platform tax" (triage, scoping, ROI pricing, drafting, follow-up); the operator stays human-on-the-loop. Chat-first command console, not tables and ticket queues.
> - A **Callout** with the positioning one-liner: "Run your consultancy like an operator, not a corporate."
> - A short **Table** or bulleted list of the six surfaces (Overview, Operator app, Clients, Leads, ROI, Agents) — what each does.
> - A closing **Callout** linking to Getting Started.

## 8 · Brand Voice
> Author the **Brand Voice** page.
> - Intro: operator-to-operator — engineering authority, retro-modern, confident; never corporate.
> - Two **Callouts** side-by-side in spirit: **DO** (lead with the outcome and the ROI; the agent speaks first person — "I flagged 3 leads as cold"; plainspoken) and **DON'T** (corporate jargon like synergy/solutions; servile chatbot tone; emoji).
> - A **Table** of example rewrites — *Weak | Ops Surfer voice* — 4–5 rows.

## 9 · Graphic Language
> Author the **Graphic Language** page.
> - Intro: the wave mark + "Ops Surfer" mono wordmark; leaf-blade rounding (60/15 speech bubbles); two-tone warm cream-paper over emerald with a lime accent; mode.com retro-modern — close-to-the-metal, not generic SaaS.
> - A **Figma embed** of the logo / wave mark.
> - A **Callout** on the leaf-blade radius and the two-tone treatment.
> - A short **Table** of do/don't for logo usage (clear space, min size, don't recolor, don't stretch).

## 10 · Color = Signal (the grammar)
> Author the **Color = Signal** page.
> - Intro: the two rules — color is a signal never decoration (good · hot · warm · cold · bad · pending), and text is one color while the elements around it carry the signal. Motion is a signal too: calm by default, pulse only on real events.
> - **Token blocks** for the signal palette (good, hot, warm, cold, bad, pending) showing Light + Dark values.
> - A **Table** mapping each signal to its meaning (good = active/success/primary; hot = hot lead/urgent; warm = caution; cold = info; bad = error/blocked; pending = queued/in-review — luminous, not disabled).
> - A **Callout**: luminous gray (pending) ≠ dim gray (disabled); never use color decoratively.

## 11 · Customization & White-label
> Author the **Customization & White-label** page (consumer-facing summary of the re-skin story).
> - Intro + **Callout**: customers re-skin the entire surface — both themes, every signal — by overriding the `--brand-*` DNA layer (a CSS override or `<BrandProvider>`), no code fork; they also recompose which panels/agents render.
> - A **Figma embed** of a re-skinnable component.
> - A short pointer (**Callout** or link) to the full **Customization Guide** and **Slot & Config API** pages.
> - Closing line: the design system is a product capability, not an internal asset.

---

# Component pages

## Template (reuse for each of the 20)
> Author a reference page for the **<NAME>** component.
> - Heading + 1–2 sentence intro: what it is and when to use it.
> - A **Figma embed** of the tied `<NAME>` component (Figma node `<NODE>`).
> - A **Storybook embed** of its primary story (`<STORYBOOK>`).
> - A **component properties Table** (variants + props).
> - A **Callout** with the signal/tone rule that applies.
> - A **Code** usage snippet referencing `<CODE>`.
> Use the native Figma / Storybook / Component blocks bound to this DS's connected sources.

## Kit components (12)
> **Badge** — tonal status badge; color is the signal (good/hot/warm/cold/bad/pending/muted), optional leading dot, text stays neutral. Figma `39:23` · Storybook `Kit/Badge` · Code `components/site/accents.tsx [Badge]`. Rule: the badge color is the only signal — never decorative.

> **StatusDot** — live status dot; tone-colored, pulses on active/errored events. Figma `34:13` · Storybook `Kit/StatusDot` · Code `components/site/accents.tsx [StatusDot]`. Rule: pulse = a real event, calm = steady state.

> **Pill** — dashed filter pill; default / active. Figma `42:6` · Storybook `Kit/Pill` · Code `components/site/accents.tsx [Pill]`. Rule: active state uses the accent border, not a fill.

> **IntentChip** — lead-intent chip; Hot/Warm/Cold tier + 0–100 score. Figma `42:15` · Storybook `Kit/IntentChip` · Code `components/operator/intent-chip.tsx [IntentChip]`. Rule: temperature color → temperature label (Hot/Warm/Cold).

> **MiniBar** — compact proportional bar; tone-colored fill for temperature/score. Figma `44:14` · Storybook `Kit/MiniBar` · Code `components/site/accents.tsx [MiniBar]`. Rule: fill tone matches the signal it measures.

> **IconTile** — tinted icon tile; surface background + tone-colored lucide glyph. Figma `45:26` · Storybook `Kit/IconTile` · Code `components/site/accents.tsx [IconTile]`. Rule: tile tone = the category's signal.

> **Kbd** — keyboard key cap; mono, for ⌘K-style shortcut hints. Figma `44:17` · Storybook `Kit/Kbd` · Code `components/site/accents.tsx [Kbd]`. Rule: only show shortcuts that are actually wired.

> **Bubble** — leaf-blade speech bubble; human / agent / reasoning variants. Figma `46:12` · Storybook `Kit/Bubble` · Code `components/operator/bubble.tsx [Bubble]`. Rule: agent = lime, human = cream, reasoning = dotted; leaf-blade radius (60/15).

> **Button** — primary (lime) / ghost (dashed) action; pill; sizes sm/md/lg. Figma `47:17` · Storybook `Kit/Buttons` · Code `components/site/surfaces.ts [BTN_PRIMARY, BTN_GHOST]`. Rule: one primary per surface; ghost for secondary.

> **PageHeader** — interior page header; eyebrow + display title + chips + right slot. Figma `48:5` · Storybook `Kit/PageHeader` · Code `components/site/page-header.tsx [PageHeader]`. Rule: chips are tone-aware (neutral count + colored state).

> **LiveSignage** — agent-online pulse pill + mono run stamp. Figma `49:5` · Storybook `Kit/LiveSignage` · Code `components/site/page-header.tsx [LiveSignage]`. Rule: pulse only while the agent is genuinely live.

> **Panel** — dot-grid surface card; static / lift (clickable) states. Figma `49:21` · Storybook `Foundations/Surfaces` · Code `components/site/surfaces.ts [PANEL]`. Rule: float (lift) = clickable only; neutral cards don't float.

## UI primitives (8) — vendored shadcn/base-ui
> **UI/Button** — base-ui button primitive (CVA variants × sizes). Figma `106:14` · Storybook `UI/Button` · Code `components/ui/button.tsx [Button]`.

> **UI/Badge** — base-ui badge primitive. Figma `107:10` · Storybook `UI/Badge` · Code `components/ui/badge.tsx [Badge]`.

> **UI/Input** — text input primitive. Figma `108:2` · Storybook `UI/Input` · Code `components/ui/input.tsx [Input]`.

> **UI/Textarea** — multiline input primitive. Figma `108:6` · Storybook `UI/Textarea` · Code `components/ui/textarea.tsx [Textarea]`.

> **UI/Separator** — divider primitive. Figma `108:10` · Storybook `UI/Separator` · Code `components/ui/separator.tsx [Separator]`.

> **UI/Avatar** — avatar primitive (image + fallback). Figma `109:2` · Storybook `UI/Avatar` · Code `components/ui/avatar.tsx [Avatar]`.

> **UI/Card** — card container primitive. Figma `109:6` · Storybook `UI/Card` · Code `components/ui/card.tsx [Card]`.

> **UI/Tooltip** — tooltip primitive. Figma `109:11` · Storybook `UI/Tooltip` · Code `components/ui/tooltip.tsx [Tooltip]`.

> For each: paste the **Template** above, replacing `<NAME>` / `<NODE>` / `<STORYBOOK>` / `<CODE>` with the row's values and adding its intro + rule.
