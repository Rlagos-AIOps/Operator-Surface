# Token Reference

The token catalog and the grammar that governs it. Tokens cascade in three tiers — **brand DNA → semantic signal → component usage** — and the grammar rules are non-negotiable: they're enforced in code, mirror into Figma, and survive every re-skin.

## The cascade

```
TIER 1  brand DNA        --brand-accent · --brand-canvas · --brand-hot · --brand-radius …
   │                     (the identity layer — override this to re-skin; see 01)
   ▼
TIER 2  semantic signal  --color-good · --color-hot · --color-warm · --color-cold ·
   │                     --color-bad · --color-pending  +  --primary, --foreground,
   │                     --surface, --border …   (light values in :root, dark in .dark)
   ▼
TIER 3  component usage  bg-good/15 · border-hot/65 · text-foreground · glow-edge-cold …
                         (Tailwind classes the kit composes — never raw hex)
```

A component never references a raw color. It references a semantic token. The semantic token reads through the brand DNA. So one brand override at Tier 1 reaches every component at Tier 3 — across both themes.

## Tier 1 — brand DNA (`--brand-*`)

The identity layer. Full list and what each controls is in [`01-customization-guide.md`](01-customization-guide.md#every---brand---token-and-what-it-controls). Summary:

- **Surface:** `--brand-accent`, `--brand-accent-2`, `--brand-canvas`, `--brand-canvas-deep`, `--brand-paper`, `--brand-paper-2`, `--brand-ink`, `--brand-bone`
- **Signals:** `--brand-hot`, `--brand-warm`, `--brand-cold`, `--brand-bad`, `--brand-pending`
- **Type:** `--brand-font-display`, `--brand-font-sans`, `--brand-font-mono`
- **Shape:** `--brand-radius`

Defaults to today's Ops Surfer values, so overriding nothing = no change.

## Tier 2 — semantic signals

Each signal means exactly one thing. This is the heart of the grammar. `muted` is the only non-signal — it marks idle/disabled.

| Token | Meaning | Default hue | Used for |
|---|---|---|---|
| `--color-good` | good / active / shipped / healthy | green (= `--primary`) | live agents, won deals, healthy metrics, selected lead |
| `--color-hot` | hot — high intent / urgent | orange | high-intent leads, urgent flags |
| `--color-warm` | warm — mid intent | yellow | mid-intent leads, queued, warn |
| `--color-cold` | cold — low intent / info | blue | low-intent leads, informational signals |
| `--color-bad` | bad — error / blocked / failed | red (= `--destructive`) | failures, blocked, agent errors |
| `--color-pending` | pending — queued / draft / in-review | luminous cool gray | drafts awaiting send, in-review, pending — **not** grayed-out |
| `muted-foreground` | idle / disabled / archived | paper/bone gray | truly inert UI, metadata, secondary text |

Structural semantic tokens (also Tier 2, dual-mode): `--background`, `--foreground`, `--primary`, `--surface` / `--surface-2` / `--surface-edge`, `--border` / `--border-strong`, `--card`, `--popover`, `--sidebar`, `--ring`, `--dot` (panel grid dots), `--volt` (agent accent), `--shadow-1/2/3`, `--lift-shadow`.

## Tier 3 — component usage

The kit composes semantic tokens into Tailwind classes. Examples from the shipped code:

- **Badge** (`accents.tsx`): `text-foreground border-{tone}/60 bg-{tone}/15` — white text, tone on border + tint.
- **IntentChip** (`intent-chip.tsx`): `bg-hot/15 text-foreground border-hot/50 glow-edge-hot` for high intent.
- **Pill active** (`accents.tsx`): `glow-edge-good border-good/75 bg-good/16`.
- **Panel** (`surfaces.ts`): `dot-grid rounded-2xl border-[color:var(--surface-edge)] bg-card shadow-[var(--shadow-1)]`.

The tone→class maps use full literal class strings (e.g. `bg-good`, `text-hot`) so the Tailwind v4 scanner keeps them — the kit never builds `text-${tone}` dynamically.

## The grammar — five non-negotiable rules

Enforced in code, required to hold in Figma. A re-skin tunes hues; it never breaks these.

1. **Color = signal, never decoration.** `good · hot · warm · cold · bad · pending` each mean one thing. `muted` = idle/disabled only. Don't color something just to make it pretty.
2. **One color = one meaning per surface.** Never double a tone across two dimensions (e.g. don't use `hot` for both "urgent" and "expensive" on the same screen).
3. **Text is one color.** Body text is `foreground` (white/paper/bone). The elements *around* text get the color — border, dot, tint, fill. You don't tint the words.
4. **Color is never the only cue.** Every signal pairs with a label and/or icon (WCAG 1.4.1). A red border always rides with the word/icon that says what's wrong. A status dot always sits beside a label.
5. **Motion = signal.** Calm by default. Pulse, glow-ring, and bar-load animations fire only on real events (agent live, load in progress). Everything respects `prefers-reduced-motion`.

### Type scale

| Role | Size | Token |
|---|---|---|
| Reading prose | 16px | `body` |
| Dense UI / controls / metadata | 14px | `small` |
| Eyebrow (mono uppercase) | 11px | `.eyebrow` |
| Minimum (kbd, micro-labels) | 10px | — |

Display/headings use `--brand-font-display` (DM Serif); body + UI use `--brand-font-sans` (Manrope); eyebrows, numbers, and kbd use `--brand-font-mono` (JetBrains Mono).

## Single source → no drift

All tokens are authored once in **`operator-app/app/globals.css`** (`:root` = light · `.dark` = dark · `@theme inline` = primitives/radii/brand aliases) and generated everywhere else:

```
globals.css ──(bun run tokens · tokens/build.ts)──► tokens/tokens.json        (DTCG)
                                                  ├► tokens/figma.tokens.json  (Tokens Studio → Figma Variables)
                                                  └► app/tokens.generated.css  (generated CSS block)
```

- `bun run tokens` regenerates all three outputs (sRGB computed from oklch via culori).
- `bun run tokens:check` is the CI **drift gate** — non-zero exit if any output is stale.
- `tokens/build.ts` also emits the `brand` token group (Tier 1) and a typed projection (`lib/tokens.generated.ts` — `COLOR_TOKENS` / `TYPE_TOKENS` / `RADII`) so the styleguide page and `Foundations.stories.tsx` read one source instead of hand-rolling their own values.

**Never hand-edit a generated file.** Edit `globals.css`, run `bun run tokens`, commit the regenerated outputs. Figma re-imports `figma.tokens.json` via Tokens Studio; Supernova re-reads `tokens.json`.
