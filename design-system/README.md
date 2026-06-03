# Ops Surfer — Design System (legacy scaffold)

> ⚠️ **SUPERSEDED — kept for provenance.** This is the original brand-spec scaffold (lime/volt token names, "no codebase attached"). The CURRENT design system is the **code** (`operator-app/`) + [`CONTRACT.md`](CONTRACT.md) + [`portal/`](portal/) + [`TELOS.md`](../TELOS.md) + the live Figma library. Product name resolved to **Ops Surfer** (was "AI Ops OS") — AK, 2026-06-03.

**Mode.com Retro-Modern**

A design system for **Ops Surfer** — a platform for managing an AI consultancy end-to-end: client CRM, project scoping, ROI-backed pricing, and multi-agent delivery. The first product surface is an operator-facing UI for the **LinkedIn Inbound Triage Agent**.

> Engineering authority. Retro-modern. High contrast. Confident, never corporate. Inspired by mode.com — close-to-the-metal, not generic SaaS.

---

## Sources

No codebase, Figma file, or screenshots were attached. This system was built directly from the brand spec provided in the project brief. If a codebase or Figma exists, please attach it via the Import menu so we can pull real components, screenshots, and assets.

---

## Index

| File | What's in it |
| --- | --- |
| `README.md` | This file — content fundamentals, visual foundations, iconography |
| `colors_and_type.css` | All CSS variables: colors, type, spacing, radii, shadows, motion |
| `SKILL.md` | Agent-skill manifest — drop-in for Claude Code |
| `fonts/` | Webfonts (Google Fonts CDN @import — see Substitutions) |
| `assets/` | Logo, mark, illustrations, icon set |
| `preview/` | Per-token preview cards rendered in the Design System tab |
| `ui_kits/ai-ops-os/` | UI kit — LinkedIn Inbound Triage Agent operator surface |

---

## Content Fundamentals

**Voice.** Operator-to-operator. You're talking to someone who runs an AI consultancy and respects their own time. No exclamations. No "we're so excited." Tell them what happened, what's next, and what they need to decide.

**Person.** Second person ("you," "your inbox") for instructions and prompts. First person plural ("we") only when referring to the agent collective. The agent itself uses **first person singular** in speech bubbles ("I flagged 3 leads as cold," not "the system has flagged…").

**Casing.** Sentence case for everything — buttons, headers, navigation, table headers. Title Case is reserved for product names ("LinkedIn Inbound Triage," "ROI Pricing"). ALL CAPS only for eyebrow labels with wide tracking.

**Tone examples.**
- ✅ "3 leads need a callback today."
- ✅ "I drafted a reply. Send it?"
- ✅ "Pricing locked. Send proposal."
- ❌ "We're excited to help you triage your leads! 🎉"
- ❌ "Optimize your inbound funnel with AI-powered insights."

**Numbers.** Always tabular figures for numerics in tables, dashboards, and inline metrics. Currency: `$4,200` not `$4200`. Percent: `12%` not `12 percent`. Time: `2h 14m`, `Today, 3:42 PM`.

**Emoji.** Never. Use the lime/volt color, dotted borders, or icons instead.

**Punctuation.** Em-dashes for asides. Sentences in copy land without periods on labels and short button text ("Approve reply"), but full sentences keep them.

**Vocabulary.** "Lead," "thread," "intent," "pipeline," "scope," "ROI," "agent," "approval." Avoid "leverage," "synergy," "empower," "delight."

---

## Visual Foundations

### Color
Deep emerald canvas (`#1E5631`) with cream paper (`#F4F1E8`) as the secondary surface. Lime (`#D9E879`) is the only CTA color — every primary action is lime. Volt (`#C8F902`) is brighter still and reserved for **agent-active** states (a thinking agent, a live pulse, a fresh result). Backgrounds are **always emerald** — never white as the dominant surface. Cards on emerald, never floating.

### Typography
**Display:** retro serif with high contrast — `DM Serif Display` (sub for Grenette). Tight tracking (`-0.02em` to `-0.035em`), short line-height. Used for headers and display numerals.
**UI/Body:** geometric grotesque — `Manrope` (sub for Graphik). 400/500/600/700/800. Comfortable line-height (1.55).
**Numerics:** Manrope with tabular + lining figures (`font-variant-numeric: tabular-nums lining-nums`).

### Spacing
8-pt grid. Generous whitespace at the page level, dense inside cards. Standard gutter is 24px (`--s-5`); section spacing 64px (`--s-8`).

### Backgrounds
- **Default:** flat emerald. No gradients on backgrounds.
- **Hero / section accents:** subtle vertical noise (paper-grain texture, low alpha) over emerald, optional.
- **Agent-active surfaces:** lime → volt linear gradient, used **only** on speech bubbles and the active-agent pulse.
- **No stock illustrations.** No bluish-purple gradients. No soft pastels.

### Motion
Subtle and structural, never decorative.
- Volt **glow pulse** on agent-active states: shadow expands `0 → 24px` of `rgba(200,249,2,0.45)` over 1400ms, eases in and out, loops.
- **Approval action:** the speech bubble morphs into a checkmark (border-radius animates to a circle, content cross-fades to a check glyph), then translates `+24px` on X and fades to 0 over 320ms with `cubic-bezier(0.2, 0.9, 0.2, 1)`.
- **Hover:** `120ms` color/elevation change. **Press:** `80ms` shrink to `scale(0.98)` plus a darker fill.
- Page transitions: cross-fade 220ms, no slide.

### Hover & press states
- **Buttons (lime):** hover = lighten to volt; press = darken to `--lime-deep` + scale 0.98.
- **Buttons (paper):** hover = `--paper-2`; press = `--paper-edge`.
- **Cards:** hover = elevation `--shadow-2 → --shadow-3` and border lifts to `--surface-edge`. No translate, no scale.
- **Icon buttons:** hover = bg `rgba(244,241,232,0.06)`; press = `0.10`.

### Borders
- **On dark:** hairline `rgba(244,241,232,0.08)` baseline, `0.16` for active, `0.28` for strong dividers.
- **On paper:** `#D8D2BE` 1px.
- **Signature dotted lime border** (1.5px dotted `--lime`) on **agent reasoning** bubbles and any "draft / pending review" surfaces.

### Shadows & elevation
- **`--shadow-1`:** ground level — 1px hairline + soft contact shadow. Most cards.
- **`--shadow-2`:** raised — menus, popovers.
- **`--shadow-3`:** floating — modals, dialogs.
- **`--glow-volt`:** 4px volt halo + 24px volt bloom. Agent-active only.
- **`--inset-well`:** input fields, code blocks, deep recesses.

### Transparency & blur
Used sparingly. Modal scrims are `rgba(10,20,16,0.6)` with `backdrop-filter: blur(6px)`. Never on cards. Never on speech bubbles.

### Corner radii
- 4px on chips, tags, micro-buttons.
- 8px on inputs and small cards.
- 14px on standard cards.
- 20px on large hero cards / modals.
- **60px 15px 60px 15px** — the signature speech-bubble shape. Mirrored to `15px 60px 15px 60px` for right-aligned (agent) bubbles.
- Pill (`9999px`) only on filter chips and avatar groups.

### Cards
14px radius, `--surface` background, `--shadow-1` (hairline + soft shadow), 24px padding standard. Never floating without a container — always sit on the emerald canvas with explicit elevation. Hover lifts to `--shadow-3` + brighter edge.

### Speech bubbles (signature)
The defining element of the system. Three variants:

| Variant | Alignment | Background | Text | Border |
| --- | --- | --- | --- | --- |
| **Human / sender** | Left | `--paper` (#F4F1E8) | `--ink` | none |
| **Agent reply** | Right | linear-gradient(`--lime` → `--volt`) | `--ink` | none |
| **Agent reasoning** | Left or right | transparent | `--paper` | 1.5px dotted `--lime` |

All three use `border-radius: 60px 15px 60px 15px` (mirrored for right alignment). Padding: `14px 22px`. Max-width: `min(560px, 75%)`. Bubble tail is implied by the asymmetric radius — no extra arrow.

### Layout
Mobile-first. Desktop is the same modular grid, denser. 12-column grid on desktop with 24px gutters. Page max-width 1280px. Sidebars are fixed 280px when present.

---

## Iconography

**Icon system: Lucide** (CDN-linked) at 1.75px stroke. Lucide gives us the engineering-instrument feel — geometric, slightly retro, no rounded "blobby" lines. We pin to a fixed version.

```html
<script src="https://unpkg.com/lucide@0.456.0/dist/umd/lucide.min.js"></script>
```

- Default size: 20px in UI, 16px inline with text, 28px in nav rail.
- Stroke width: 1.75px (Lucide default 2px is slightly heavy for our display serif's contrast).
- Color: inherits `currentColor` — typically `--paper-text` on dark, `--ink` on paper. Lime for agent-active icon states.
- **No emoji. No unicode glyphs as icons** (no ▶, no ✓ — use Lucide `play` / `check`).
- **No PNG icons.** SVG only.

Custom marks (logo, agent identity, status pips) live in `assets/` as SVG.

> ⚠️ **Substitution flagged:** No icon set was provided. We chose **Lucide** because its line quality matches the mode.com aesthetic more closely than Heroicons or Material. If you have a proprietary icon set, drop SVGs into `assets/icons/` and we'll switch.

---

## Substitutions (please review)

The following were not provided and have been substituted. Replace when you can.

| Asset | Substitute | What to provide |
| --- | --- | --- |
| **Grenette** (display serif) | `DM Serif Display` (Google Fonts) | `.woff2` + license for Grenette |
| **Graphik** (UI sans) | `Manrope` (Google Fonts) | `.woff2` + license for Graphik |
| Logo / wordmark | Generated mark in `assets/logo.svg` | Final logo SVG |
| Icons | Lucide CDN | Proprietary icon set, if any |

---

## SKILL

See `SKILL.md`. The folder is portable as a Claude Code Agent Skill — `name: ai-ops-os-design`.
