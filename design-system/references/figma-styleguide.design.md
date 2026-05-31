# Figma styleguide — design spec

> **Source:** the Figma proto "Design System" page (`Create UI Element (Copy)` / published at `https://slaw-glade-36002212.figma.site`). Proto #2 — "Figma".
> **Role in the merge:** **design language, aesthetic, big components**, and the **two-tone blended look that is the through-line for the whole site**; light theme.
> **Character:** brighter emerald `#1e5631` base with **translucent cream-paper surfaces layered on top** (the two-tone), **soft rounded cards (14px)**, gentle shadows, big serif display. Warm, classy, restrained, *elevated* — not flat, not glassy-cool. This warmth is the target for both themes.
> Hex/measurements are **exact** where extracted from computed CSS or printed; **≈** where read from layout.

---

## 1. Canvas & layout

- **Canvas:** emerald `#1e5631` (notably brighter/warmer than Lovable's near-black).
- **Navigation = LEFT SIDEBAR** (Figma's pattern). ⚠️ Per AK's brief we replace this with a **top masthead** (from Lovable) — but the sidebar's *content grouping* is the IA reference: primary group `Dashboard · Lead triage · Pipeline · Analytics`, secondary group `Styleguide · Settings`.
- **Sidebar:** ≈280px, fill `#0F2A26` (deeper than canvas), 1px right hairline. Header: "AI Ops OS" (serif, cream) + "LinkedIn Inbound Triage" (muted). Items: Inter, line icons (~1.75px), muted; **active = lime text on a subtle rounded bordered surface**.
- Main content: generous padding (≈40px), section rhythm ≈ 48–64px, cards on a responsive grid.

## 2. The two-tone surface system (THE signature — most important)

The defining move: **translucent cream-paper film over the emerald canvas.** Cards are not opaque and not blurry-glass — they are paper at low alpha, so the emerald glows through warmly.

- `--surface` = **`#f4f1e8` @ ~4% alpha** (`#f4f1e80a`) — the standard card fill.
- `--surface-edge` = `#f4f1e8` @ ~16% (`#f4f1e829`) — hairline border on surfaces.
- `--paper-text` = `#f4f1e8` @ ~92% (`#f4f1e8eb`).
- `--border` = `#f4f1e814` (~8%); `--border-strong` = `#f4f1e847` (~28%).
- Cards: **radius 14px**, 1px `--surface-edge` border, soft shadow (below). Nested elements: **radius 8px**.

## 3. Color palette (exact — extracted from the proto's CSS)

| Token | Hex | Role (as labeled on page) |
|---|---|---|
| `--emerald` | `#1e5631` | Primary background |
| `--emerald-deep` | `#16421f` | Card surfaces / sidebar |
| `--paper` | `#f4f1e8` | Primary text (cream) |
| `--paper-2` | `#efeadb` | — |
| `--ink` | `#0a1410` | text on lime/paper |
| `--lime` | `#d9e879` | **Primary accent** (note: paler than Lovable's `#C7F36A`) |
| `--lime-deep` | `#c5d45e` | pressed lime |
| `--volt` | `#c8f902` | Secondary accent / agent-active |
| `--destructive` | `#e63946` | error |
| `--muted-foreground` | `#f4f1e899` (~60%) | muted text |

Palette card on page shows six: **Emerald, Emerald Deep, Lime, Volt, Paper, Surface** (the Surface swatch is nearly invisible = the translucent fill).

## 4. Typography

⚠️ **Font discrepancy to resolve:** the styleguide page *labels* its fonts **Display = Space Grotesk, UI = Inter**, but the published proto's computed CSS uses **`DM Serif Display` (display) + `Manrope` (UI)**, and the on-page specimens **render as a high-contrast serif** (DM-Serif-like), not Space Grotesk. The og design system and Lovable both use **DM Serif Display + Manrope + JetBrains Mono**. → Recommend standardizing on **DM Serif Display / Manrope / JetBrains Mono** unless AK wants Space Grotesk/Inter.

- **Display:** high-contrast serif (cream `#f4f1e8`), tight tracking. "Design System" heading ≈ 44px.
- **Scale (labeled):** `5xl` Display Large · `4xl` Display Medium · `3xl` Display Small · `2xl` Heading Large · `xl` Heading Medium · `lg` Heading Small · `base` Body Regular · `sm` Body Small. Maps to the og scale: display ≈48–96 / h1 56 / h2 40 / h3 28 / h4 20 / body 16 / small 14.
- **UI/body:** Inter (labeled) / Manrope (rendered) — muted cream.

## 5. Components

**Buttons** (pill / fully rounded, ≈40px tall):
- **Primary** — **lime `#d9e879` fill, ink `#0a1410` text** ("Primary Button").
- **Secondary** — **lime outline + lime text**, transparent fill ("Secondary Button").

**Cards** — translucent paper surface, **14px radius**; nested cards **8px radius** (labeled "Card with border radius of 8px"). Soft, not hairline-sharp like Lovable.

## 6. Spacing & effects (printed on page)

- **Border radius:** `14px` for cards, `8px` for nested elements. (Full scale: sm 4 / md 8 / lg 14 / xl 20.)
- **Shadow:** `0 0 0 1px rgba(244,241,232,0.16), 0 8px 24px rgba(10,20,16,0.24)` — a 1px paper hairline + a soft deep-emerald drop. This soft elevation (vs Lovable's flat hairline) is part of the warmth.
- **Gradient accent:** horizontal **lime → volt** gradient bar (used on agent-active surfaces / the hero metric card).
- **Spacing:** 8-pt grid (4/8/12/16/24/32/48/64/96).

## 7. Big-component references (from the Dashboard surface)

- **Hero metric card:** full-width translucent card with a **lime→volt radial gradient wash** in the corner, giant serif numeral (`$847K`), label eyebrow, and a small lime pill delta (`↗ +23% this month`).
- **Stat cards:** translucent paper, serif numeral, muted label + delta.
- **Live agent activity:** rows with a rounded lime agent avatar, name + `ACTIVE` lime pill, note, and a **lime progress bar** underneath.

## 8. Net character vs Lovable

| | Figma (this) | Lovable |
|---|---|---|
| Canvas | brighter emerald `#1e5631` | near-black `#0F2A26`/darker |
| Surfaces | **warm translucent paper, soft, 14px, soft shadow** | flat hairline, sharp, no shadow |
| Lime | paler `#d9e879` | brighter `#C7F36A` |
| Nav | left sidebar | top masthead, mono |
| Feel | warm, soft, elevated | terminal, editorial, flat |

**Merge target:** carry **Figma's warm two-tone translucent-paper soft surfaces as the through-line**, take **Lovable's color sharpness + mono nav + small components**, on the **og layout**, with a **mode.com + wave/curve** homepage. The two themes: **light = Figma paper-forward**, **dark = Lovable mossy + glass-transparency**, both keeping the Figma two-tone warmth.
