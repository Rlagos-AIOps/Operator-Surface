# Customization Guide — Re-skin Without Forking

This is the headline. Ops Surfer ships with its own brand as the **default**, but the brand is a thin DNA layer sitting one hop above everything else. Override that layer and the entire surface — both themes, every signal, every component — re-skins. You never fork the system.

## The model: brand is orthogonal to light/dark

There are two independent axes:

- **Theme** (`light` / `dark`) — controlled by the `.dark` class on the document. This is the *mode*.
- **Brand** (`--brand-*`) — controlled by the brand-DNA layer. This is the *identity*.

A brand re-skin flows into **both** themes. You set `--brand-accent` once; light mode and dark mode both pick it up. You do not maintain two brand palettes. Mode-specific darkening (dark-canvas films, elevation) stays internal to the system and derives its accent/signal hues from `--brand-*`, so your single brand override reaches both.

```
--brand-*  (brand DNA — the identity you override)
   │
   ▼
semantic tokens  (--color-good, --primary, signals … read THROUGH brand)
   │            light values in :root · dark values in .dark
   ▼
component classes  (bg-good/15, border-hot/65, text-foreground … )
```

You override the **top** layer. Everything below cascades.

## Two ways to re-skin

### Option A — CSS variable override (no code)

The scope marker `data-brand-scope` is what re-resolves the **full** semantic layer. (CSS custom properties compute at their declaring element, so a bare `--brand-*` override on a nested element can't reach the `:root` semantic tokens — the scope marker re-declares them, exactly the way `.dark` re-declares them for theme switching.)

```css
/* FULL re-skin (canvas, surfaces, accent, signals) — add data-brand-scope */
html[data-brand-scope] {
  --brand-accent: oklch(0.72 0.19 290);   /* your primary */
  --brand-accent-2: oklch(0.85 0.16 300); /* your secondary / agent accent */
  --brand-canvas: #2a2350;                 /* page base */
  --brand-radius: 10px;                    /* tighter shape language */
}

/* Or scope one region for a full re-skin of just that subtree */
[data-brand-scope] { --brand-accent: #6d4aff; --brand-canvas: #1b1730; }
```

```html
<section data-brand-scope style="--brand-accent:#6d4aff; --brand-canvas:#1b1730">
  <!-- everything here renders in the new brand, in whichever theme is active -->
</section>
```

**Lightweight path:** overriding `--brand-*` on `:root` *without* the scope marker re-skins the accent + signal hues (the brand DNA routed at `:root`) while the canvas/surfaces keep their defaults — use it when you only want to change the accent. No JS, SSR-safe, framework-agnostic.

### Option B — `<BrandProvider>` (the ergonomic runtime API)

For React consumers, `<BrandProvider>` maps a typed `Brand` object onto the `--brand-*` custom properties on a wrapper AND marks it `data-brand-scope`, so the full semantic layer (canvas, surfaces, accent, signals) re-resolves inside — in both themes. Pass `name` to also set a `data-brand` attribute. Minimal, dependency-free, SSR-safe.

```tsx
import { BrandProvider } from "@/components/brand-provider";
import { exampleBrand } from "@/lib/brand";

export default function App() {
  return (
    <BrandProvider brand={exampleBrand} name="example">
      <OperatorSurface />
    </BrandProvider>
  );
}
```

You can pass a `Partial<Brand>` — only the keys you set are overridden; the rest fall through to the Ops Surfer defaults.

```tsx
<BrandProvider brand={{ accent: "#6d4aff", radius: "10px" }}>
  {/* just the accent + shape change; canvas, signals, type stay default */}
</BrandProvider>
```

`BrandProvider` is sugar over Option A's `data-brand-scope` path — it writes the same custom properties **plus** the scope marker. Use whichever fits your stack; both give the identical full re-skin.

> **Brand keys + dark variants.** Accent and each signal also have a `*Dark` key (`accentDark`, `accent2Dark`, `hotDark`, `warmDark`, `coldDark`, `badDark`, `pendingDark`) so you can set a distinct dark-theme hue. Omit them and dark mode derives from the base values. The full key list is in `lib/brand.ts`.

## White-label example: the `exampleBrand` re-skin

The system ships a default preset (`opsSurferBrand` = today's emerald/lime values) and **one** alternate preset (`exampleBrand`, a violet/slate re-skin) that exists to prove white-label end to end. Both live in `lib/brand.ts`.

```ts
// lib/brand.ts (shape)
export type Brand = {
  accent: string;       // → --brand-accent
  accent2: string;      // → --brand-accent-2
  canvas: string;       // → --brand-canvas
  canvasDeep: string;   // → --brand-canvas-deep
  paper: string;        // → --brand-paper
  paper2: string;       // → --brand-paper-2
  ink: string;          // → --brand-ink
  bone: string;         // → --brand-bone
  hot: string;          // → --brand-hot
  warm: string;         // → --brand-warm
  cold: string;         // → --brand-cold
  bad: string;          // → --brand-bad
  pending: string;      // → --brand-pending
  fontDisplay: string;  // → --brand-font-display
  fontSans: string;     // → --brand-font-sans
  fontMono: string;     // → --brand-font-mono
  radius: string;       // → --brand-radius
};

export const opsSurferBrand: Brand = { /* current Ops Surfer values */ };

export const exampleBrand: Brand = {
  // a violet/slate identity — same system, different DNA
  accent: "oklch(0.72 0.19 290)",
  accent2: "oklch(0.85 0.16 300)",
  canvas: "#2a2350",
  // … remaining keys
};
```

Render `opsSurferBrand` and `exampleBrand` side by side (the `Foundations/Brand` Storybook story does exactly this) and you see the same 12 components, the same signal grammar, the same layout — wearing two different identities, in either theme. Nothing was forked.

## Every `--brand-*` token and what it controls

The brand DNA splits into four groups: surface palette, signal hues, type, and shape. Override any subset.

### Surface palette — the canvas + paper identity

| Token | Controls |
|---|---|
| `--brand-accent` | Primary accent — the "good/active/shipped" lime in Ops Surfer. Drives `--primary` and `--color-good`. |
| `--brand-accent-2` | Secondary accent (the "volt" agent color) — agent activity, selection highlight, hero washes. |
| `--brand-canvas` | Page base (Ops Surfer emerald `#1e5631`). The light-mode background. |
| `--brand-canvas-deep` | Deeper canvas (`#163f23`) — sidebar, popovers, recessed zones. |
| `--brand-paper` | Warm paper film (`#f4f1e8`) — the translucent two-tone surfaces and human chat bubbles. |
| `--brand-paper-2` | Second paper tone (`#efeadb`) — layered surfaces. |
| `--brand-ink` | Ink (`#0a1410`) — text on accent fills, under-shadows. |
| `--brand-bone` | Bone (`#fdfdfa`) — dark-mode foreground. |

### Signal hues — the grammar colors

These keep the signal grammar intact while letting you tune the exact hues to your palette. **Do not repurpose them** — `good` must still mean good, `bad` must still mean bad. You are tuning the hue, not the meaning.

| Token | Signal it carries |
|---|---|
| `--brand-hot` | hot — high-intent / orange |
| `--brand-warm` | warm — mid-intent / yellow |
| `--brand-cold` | cold — low-intent / blue |
| `--brand-bad` | bad — error / blocked / red |
| `--brand-pending` | pending — queued / draft / in-review |

(`good` is `--brand-accent` — the primary doubles as the good signal by design.)

### Type — the typographic voice

| Token | Controls |
|---|---|
| `--brand-font-display` | Display / headings (Ops Surfer: DM Serif). |
| `--brand-font-sans` | Body + UI (Manrope). |
| `--brand-font-mono` | Eyebrows, numbers, kbd, metadata (JetBrains Mono). |

### Shape — the rounding language

| Token | Controls |
|---|---|
| `--brand-radius` | Base radius (14px). Sets the leaf-blade rounding scale. Drop it for a sharper product, raise it for a softer one. |

## Guarantees

- **Default = zero change.** If you override nothing, the surface is pixel-identical to shipped Ops Surfer. The brand layer defaults to today's values.
- **One override, both themes.** Brand is orthogonal to light/dark.
- **No fork.** You consume the published system and override the DNA. Upgrades to the system flow to you; your brand stays yours.
- **The grammar holds.** Re-skinning changes hues, not meanings. The signal contract in [`03-token-reference.md`](03-token-reference.md) survives every re-skin.
