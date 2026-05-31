# Lovable styleguide — design spec

> **Source:** `https://component-comet-kit.lovable.app/styleguide` (proto #3 — "Loveable").
> **Role in the merge:** UX, navigation, **color**, and **small interactive components**; dark theme.
> **Character:** near-black deep-emerald, **flat hairline borders (no glass)**, mono/terminal accents, big editorial serif with key words in lime italic. "Close to the metal," not generic SaaS.
> Values are **exact** where printed on the page or extracted from computed CSS; marked **≈** where read from layout proportion.

---

## 1. Canvas & layout

- **Page background:** near-black emerald. Canvas token `#0F2A26`; the page itself reads a touch deeper (≈ `#0A1F17`) with the cards sitting at `#0F2A26`.
- **Container:** centered, max-width ≈ **1320px**, generous side gutters (≈ 48px), large vertical section rhythm (≈ 80–96px between sections).
- **Grid note printed on page:** "↳ retro-modern · 16/9 grid" (mono, muted, right-aligned per section).
- **Everything is bordered with hairlines**, not filled cards. Hairline = `rgba(242,244,229,0.08–0.12)` (1px). No drop shadows, no blur, no glass.

## 2. Masthead (flush, transparent — NOT a floating pill)

- Full-width, transparent, flush to top, **1px hairline** bottom border. No rounded container.
- **Left:** small lime wave/line-chart mark (≈20px) + `AI OPS OS` in **mono, uppercase, wide tracking** (≈0.14em), bone.
- **Center:** nav — `OVERVIEW · OPERATOR APP · CLIENTS · AGENTS · STYLEGUIDE` — **mono uppercase, ~11–12px, wide tracking**, muted; active item is **lime**.
- **Right:** `⌘K command` pill (1px hairline border, rounded, mono) + `LAUNCH APP ↗` (mono uppercase, bone).

## 3. Color palette (exact — printed on page)

| Token | Hex | Role |
|---|---|---|
| emerald / canvas | `#0F2A26` | primary background |
| emerald / surface | `#143832` | elevated surface |
| emerald / raised | `#1A463F` | second elevation |
| lime / primary | `#C7F36A` | the only CTA color |
| volt / agent | `#E6F462` | agent-active only |
| warn / amber | `#E6A852` | warning / queued |
| signal / cyan | `#6BC8D6` | info / signal / sparklines |
| alert / red | `#D14545` | error / destructive |
| bone / text | `#F2F4E5` | primary text |

Computed root vars (OKLCH equivalents): `--background oklch(19.8% .045 165)`, `--primary oklch(89% .22 125)` (lime), `--volt oklch(92% .19 105)`, `--foreground oklch(96% .02 110)` (bone). Muted text ≈ `rgba(242,244,229,0.55)`.

## 4. Typography

- **Display / headings:** `DM Serif Display` (serif). Section titles ("Tokens & type", "Building blocks", "Icons & badges") ≈ **40–44px**, tight tracking (−0.025em).
- **Signature treatment:** key phrase set in **lime italic serif** — e.g. "Engineering *authority.*", "*by Friday.*".
- **Body:** `Manrope`. Body ≈ 16px, muted ≈ `#F2F4E5` @ 55–70%.
- **Mono:** `JetBrains Mono` — all eyebrows, labels, values, nav, badges. Example specimen: `run_id=0042 · status=draft_ready · t=14.2s`.
- **Eyebrows / labels:** mono, **uppercase, ~11px, tracking ≈0.14em**, lime (active/section) or muted.
- **Section label format:** `NN / SECTIONNAME` in lime mono (e.g. `01 / FOUNDATIONS`) above the serif title.

## 5. Surfaces & cards

- **Bordered cards only** — 1px hairline `rgba(242,244,229,0.1)`, corner radius ≈ **10–12px**, no fill (or `#0F2A26`/`#143832` barely-there fill), no shadow.
- Each card carries a **mono label "tab"** at its top-left inset (e.g. `PALETTE`, `METRIC`, `AGENT STATUS`, `TABLE · LEADS (PREVIEW)`, `TOAST`, `ICON SET`, `BADGES`) — ~11px mono, muted.

## 6. Components

**Buttons** (pill, ≈8px radius, ~36px tall):
- Primary — **lime `#C7F36A` fill, ink text** ("send 7 replies").
- Secondary — 1px bone hairline border, bone text ("review drafts").
- Quiet — faint border, muted text ("cancel").
- Destructive — **red `#D14545` border + red text** ("archive").
- Icon buttons — square, hairline border (`+`, sliders).

**Filter chips:** pills, mono, with count — `ALL · 124`, `HOT · 18`, `WARM · 41`, `AGENT · 87`. Active chip = **lime border + lime text**; inactive = hairline + muted.

**Search:** full-width input, hairline border, leading search icon, placeholder "search leads…" (mono), trailing `⌘K`.

**Badges** (small bordered pills, mono uppercase ~10px): `SHIPPED` (lime), `AGENT` (lime), `REVIEW` (cyan), `SCOPING` (amber), `BLOCKED` (red), `ARCHIVED` (muted/grey). Border + text share the semantic color; fill transparent.

**Status dots:** `HOT` (lime dot), `WARM` (amber dot), `COLD` (cyan dot).

**Metric card:** mono label `MONTHLY RECURRING`, serif value `$42,180` with lime delta `+8.2%`, and a **cyan area/line sparkline** beneath.

**Agent status list:** rows of `● name` (mono) + right-aligned state. inbound-triage (yellow dot) `RUNNING` + lime progress bar; proposal-writer (grey) `IDLE`; roi-calculator (amber) `QUEUED`; onboarding-cs (red) `ERROR`. State labels mono, right-aligned, with small bars.

**Speech bubbles:** `AGENT` label (lime mono) above a **lime-hairline-bordered** bubble ("I drafted a reply to **Sasha M.** Send it?"); user/reply below as a plain outline bubble ("not yet — show me the cold ones first."). Bone names bolded inline.

**Table (leads preview):** columns `LEAD · TIER · ICP · STATUS · AGE` (mono uppercase headers, hairline under). Rows: circular initial avatar + name (sans) + role·company (muted small); TIER = HOT/WARM badge; ICP = mono decimal (`0.92`); STATUS = `●drafted` / `scoring`; AGE = mono (`2m`). Row separators = hairline.

**Toasts:** stacked rows, each = status dot + mono label (`SHIPPED`/`AGENT`/`WARN`/`ERROR`) + message + trailing `…`. Hairline-bordered.

## 7. Iconography

Line icons, **~1.75px stroke**, bone or lime. Set shown: inbox, paper-plane (send), LinkedIn, cpu/chip, sparkles, line-chart, funnel/filter, command; terminal (`>_`), search, sliders, zap/lightning, target, pause (`‖`), play (`▶`), plus (`+`). No filled/PNG icons.

## 8. Footer

Flush, hairline top border. Left: lime mark + `V0.4 · MODE.COM RETRO-MODERN · 2026` (mono). Right: `● agent online · last sync 14s ago` (mono, lime status dot).

## 9. Motion / feel

Restrained. Lime used **sparingly as sharp accents** (borders, checks, single fills, italic words) — never as large fills. Negative space is generous. The whole system reads as an instrument panel, not a marketing site.
