# Ops Surfer — Design ⇄ Code Contract

The single source both **Figma** (design) and **Storybook** (code) map to, and that **Supernova** bridges into documentation + the MCP the eng agents read. Lock this before building the Figma library so the three stay 1:1.

> Status 2026-06-01: tokens + Storybook are CURRENT (rebuilt off the shipped app). Figma library = to build against this spec.

---

## 0. The rule that makes the bridge work — naming parity

**Figma component name === Storybook title leaf === code component name.** If they drift, Supernova can't link design ↔ code. Examples below are canonical.

---

## 1. Tokens (the spine)

- **Canonical source:** [`operator-app/tokens/tokens.json`](../operator-app/tokens/tokens.json) — DTCG, mirrors `operator-app/app/globals.css` as shipped.
- **Structure:** `primitive` (brand anchors) · `color.light` / `color.dark` (semantic, dual mode) · `fontFamily` · `fontSize` · `radius` · `radiusBlade` · `shadow`.
- **Sync direction:** `tokens.json` → **Figma Variables** (two modes: `light`, `dark`) → **Supernova themes** → export to CSS/native. One canonical source; never hand-maintain Figma + code separately.
- **Grammar (non-negotiable, enforced in code, must hold in Figma):**
  1. **Color = signal, never decoration** — `good · hot · warm · cold · bad · pending` each mean one thing; `muted` = idle/disabled only.
  2. **One color = one meaning per surface** (no doubling a tone across two dimensions).
  3. **Text is one color** (`foreground`); elements around it get colored.
  4. **Color is never the only cue** — always paired with a label/icon (WCAG 1.4.1).
  5. **Motion = signal** — calm by default; pulse only on real events; everything respects `prefers-reduced-motion`.
- **Type scale:** reading prose = **16px** (`body`); dense UI/controls/metadata = 14px (`small`); eyebrow = 11px; min = 10px.

---

## 2. Component inventory (build these in Figma, 1:1 with code)

Atomic kit — `operator-app/components/site/accents.tsx`, `surfaces.ts`, `page-header.tsx`; operator atoms in `components/operator/`.

| Component | Code source | Props / API (the wiring contract) | Figma variants to build | Storybook |
|---|---|---|---|---|
| **Badge** | accents.tsx | `tone` (good·hot·warm·cold·bad·pending·muted), `dot`, `pulse`, `glow`, children | tone (7) × dot (2) × glow (2) | Kit/Badge |
| **StatusDot** | accents.tsx | `tone`, `pulse` | tone (7) × pulse (2) | Kit/StatusDot |
| **Pill** | accents.tsx | `active`, `count`, children | active (2) | Kit/Pill |
| **IntentChip** | operator/intent-chip.tsx | `intent` (high→Hot · mid→Warm · cold→Cold), `score` 0–100 | intent (3) | Kit/IntentChip |
| **MiniBar** | accents.tsx | `value` 0–100, `tone` | tone (6) | Kit/MiniBar |
| **IconTile** | accents.tsx | `tone?`, children (icon) | tone (7) | (in Foundations) |
| **Kbd** | accents.tsx | children | — | (in Foundations) |
| **Bubble** | operator/bubble.tsx | `from` (human·agent·reasoning) — leaf-blade radii | from (3) | Kit/Bubble |
| **Button** | surfaces.ts (`BTN_PRIMARY`/`BTN_GHOST`) | variant (primary·ghost), size (sm·md·lg), `+icon` | variant (2) × size (3) | Kit/Buttons |
| **PageHeader** | site/page-header.tsx | `eyebrow`, `title`, `subtitle?`, `chips?[]`, `right?` slot | with/without subtitle · chips · right(signage\|actions) | Kit/PageHeader |
| **LiveSignage** | site/page-header.tsx | `label?`, `stamp?` | — | (PageHeader/InstrumentPage) |
| **Panel** | surfaces.ts (`PANEL`,`LIFT`,`METRIC_CHIP`) | dot-grid card; `LIFT` = hover-float (clickable only) | static · lift | (Foundations/Surfaces) |

Compositions (eng wires telemetry into these — not atomic Figma components, document as patterns): `MetricRow`, `LeadQueue`, `ThreadView`, `Composer`, `AgentChat`, `TopBar`, `Masthead`, `Footer`.

---

## 3. aria-live contract (for the agent-run / hot-swap model)

Any region wired to **real-time telemetry or agent hot-swap render** MUST be a live region:
- ambient updates → `aria-live="polite"` (+ `role="status"`) — e.g. agent online/offline, metric refresh.
- critical/errors → `aria-live="assertive"` (+ `role="alert"`).
- **One** live region per logical update zone (never blanket every number → screen-reader noise).
Already in code: the agents "Live load" status, the operator "Agent live" pill, sonner toasts.

---

## 4. The pipeline

```
tokens.json ──► Figma Variables (light/dark modes) + components (this inventory)
     │                                   │
     └──► code (globals.css + kit) ──► Storybook (live stories, autodocs, a11y)
                                         │
                          Supernova (hub): embeds Figma frames + Storybook canvases,
                          documents tokens, links design↔code by the names above,
                          exports code, hosts the searchable Portal
                                         │
                                   MCP ──► eng agents (Storybook MCP · Supernova MCP ·
                                          optional Figma Dev Mode MCP) wire functionality
```

**Build order:** (1) this contract → (2) Figma library to spec + fleshed Storybook (done, code side) → (3) Supernova links them + docs → (4) MCP to the agents.
