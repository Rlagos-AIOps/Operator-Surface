# Design Transplant Plan (Option A)

**Status:** Drafted — awaiting decision before execution.
**Created:** 2026-06-02
**Branch:** `roberto-backend` (no branch switch needed)
**Estimated time:** ~30 minutes (5 commits)

## Goal

Adopt the visual system from `origin/design` (AK's prototype) into the production CSM Operator Surface on `roberto-backend`. Keep all data logic — Supabase wiring, Server Actions, routes, queries, types. **Logic stays. Pixels change.**

## Why this exists

The `main` and `origin/design` branches have **unrelated histories** (no common ancestor) and disjoint file structures. A direct git merge would either fail the Vercel build (wrong `package.json` wins) or land 349 inert files in `main` (wrong app structure). This plan is the **alternative to a structural merge** — adopt AK's design language without taking on AK's app skeleton.

## Decisions still required

Three open questions. Pick or accept the suggested default.

| # | Question | Suggested default | Reason |
|---|---|---|---|
| 1 | **Default theme** — dark or light? | **dark** | Matches AK's app default; feels "operator-grade software" rather than marketing |
| 2 | **`tokens.json` drop location** — `/tokens/` at repo root or `src/styles/`? | **`/tokens/`** | Matches AK's path; DTCG export for Figma/Supernova, not a runtime CSS file |
| 3 | **`priority_high` decision label** — `text-hot` (orange) or `text-bad` (red)? | **`text-hot`** | Urgent attention ≠ error/blocked; orange is the visual mid-step between healthy and critical |

## Scope guardrails

What this plan will NOT touch:

- ❌ `actions.ts` (Server Actions stay verbatim)
- ❌ `src/lib/supabase/*` (admin client, server client, browser client, types, helpers)
- ❌ Supabase queries inside any `page.tsx` (only `className` strings change)
- ❌ `scripts/seed.ts`, `scripts/verify-seed.ts` (data layer stays)
- ❌ Any `.md` doc (content stays)
- ❌ Routes — still `/`, `/brief`, `/approvals`, `/decisions`
- ❌ `origin/design` (extracted via `git show`, not modified)
- ❌ Any data shape — no DB migrations, no schema changes

---

## File-level changes

### Files to COPY from `origin/design`

Extracted with `git show origin/design:<path> > <destination>` — no branch switch, no merge.

| Source path on `origin/design` | Destination on `roberto-backend` | Role |
|---|---|---|
| `operator-app/tokens/tokens.json` | `tokens/tokens.json` | DTCG canonical token graph (Figma/Supernova import) |
| `operator-app/app/globals.css` | `src/app/globals.css` *(replaces existing)* | Dual-theme CSS (light = `:root`, dark = `.dark`), wired via Tailwind v4 `@theme inline` |
| `operator-app/components/site/surfaces.ts` | `src/components/ui/surfaces.ts` | `PANEL`, `LIFT`, `METRIC_CHIP`, `BTN_PRIMARY`, `BTN_GHOST` surface classes |
| `operator-app/components/site/accents.tsx` | `src/components/ui/accents.tsx` | `StatusDot`, `Pill`, `Badge`, `IconTile`, `MiniBar`, `Kbd`, `Tone` type — signal-grammar primitives |
| `operator-app/components/theme-provider.tsx` | `src/components/theme-provider.tsx` | next-themes wrapper |
| `operator-app/lib/utils.ts` | `src/lib/utils.ts` | `cn()` helper (clsx + tailwind-merge) |

### Files to DELETE on `roberto-backend`

| File | Why |
|---|---|
| `src/styles/tokens.css` | Superseded — AK's `globals.css` defines all the same vars + more, plus theme switching |
| `src/lib/design/tokens.ts` | TS-side token mirror — confirmed unused anywhere under `src/` |

### Packages to install

| Package | Version | Reason |
|---|---|---|
| `next-themes` | `^0.4` | `<ThemeProvider>` + class-based light/dark switching |
| `clsx` | `^2.1` | `cn()` helper |
| `tailwind-merge` | `^2.5` | `cn()` helper |
| `tw-animate-css` | `^1.x` | `--animate-pulse-volt`, `--animate-wave-drift`, `--animate-glow-ring`, `--animate-bar-rise` utilities |

Exact versions: lock to whatever `origin/design`'s `operator-app/package.json` pins.

---

## Semantic color mapping

The signal-grammar swap is the heart of this transplant. Color carries MEANING, not decoration.

### Per-element class renames

| Current | New | Where it appears |
|---|---|---|
| `bg-bg` | `bg-background` | Page bodies |
| `text-paper` | `text-foreground` | Default text |
| `text-muted` | `text-muted-foreground` | Secondary text |
| `bg-surface` | `bg-card` (or composed via `PANEL`) | Cards |
| `border-surface-edge` | `border-border` (or via `PANEL`) | Card borders |
| `text-lime` / `text-success` | `text-good` / `text-primary` | CTAs, succeeded states |
| `text-warning` | `text-warm` | Mid-risk, caution |
| `text-danger` | `text-bad` | High-risk, rejected, errors |
| `text-info` | `text-cold` | Reference data, info-only |
| `text-volt` | `text-volt` (kept) | AGENT LIVE pulse |
| (no equivalent) | `text-pending` | Pending state — luminous gray, **not** muted/disabled |
| (no equivalent) | `text-hot` | Urgent attention (orange) |

### Per-data binding (the demo-storytelling table)

What the demo audience sees when they look at a card:

| Domain state | Renders with |
|---|---|
| `approval.status = pending` | `text-pending` (luminous gray pill) |
| `approval.status = approved` | `text-good` (lime, "shipped") |
| `approval.status = rejected` | `text-bad` (red) |
| `approval.status = expired` | `text-muted-foreground` |
| `metadata.risk_level = low` | `text-pending` |
| `metadata.risk_level = med` | `text-warm` |
| `metadata.risk_level = high` | `text-bad` |
| `agent_run.status = running` | `text-volt` + `--animate-pulse-volt` |
| `agent_run.status = succeeded` | `text-good` |
| `agent_run.status = failed` | `text-bad` |
| `agent.status = idle` | `text-muted-foreground` |
| `agent.enabled = false` (kill switch) | `text-muted-foreground` |
| `decision.label = at_risk` | `text-bad` |
| `decision.label = watch` | `text-warm` |
| `decision.label = priority_high` | `text-hot` *(per Q3 decision)* |
| `decision.label = upsell_qualified` | `text-good` |
| `decision.label = missing_save_plan` / `stale_activity` | `text-warm` |

**Demo narration line:**

> "Color carries meaning here — every red is a real risk, every orange is urgent attention, every lime is something working. You can scan the queue and read the state without reading a word."

---

## Files to MODIFY (class-only changes, no JSX or data rewrites)

### `src/app/layout.tsx`

- Update font CSS var names: `--font-serif` → `--font-dm-serif`, `--font-sans` → `--font-manrope`, `--font-mono` → `--font-jetbrains` (AK's globals.css expects those names)
- Wrap children with `<ThemeProvider attribute="class" defaultTheme="dark">` (per Q1)
- Add background-overlay divs (`app-bg` + `app-sweep animate-wave-drift`)

### `src/app/page.tsx` (Hub)

- Wrap each of the 3 tile cards with `PANEL` class
- Eyebrow numbers (`01`, `02`, `03`) → `text-good`
- Tile CTA chevron → `text-primary`

### `src/app/brief/page.tsx` + 6 components

- `BriefHeader.tsx` — AGENT-LIVE strip uses `--animate-pulse-volt`
- `KpiRow.tsx` — each card → `METRIC_CHIP` class
- `ChipRow.tsx` — rewrite `KIND_STYLES` map: `danger`→`bad`, `warning`→`warm`, `success`→`good`, `info`→`cold`
- `BodyMd.tsx` — typography overrides use AK's font + size vars
- `PriorityList.tsx` — each row → `LIFT` class (hover-lift effect)
- `BriefFooter.tsx` — `border-border` + `text-muted-foreground`

### `src/app/approvals/page.tsx` + 8 components

- `ApprovalCard.tsx` — wrap in `PANEL`; Approve → `BTN_PRIMARY`; Reject → `BTN_GHOST`
- `Badges.tsx` — full rewrite of color-tint maps:
  - `AGENT_TINTS` → semantic palette per agent (galileo=`volt`, hygiene-validator=`warm`, sop-analyst=`cold`, sf-reader=`muted-foreground`, controlled-executor=`good`)
  - `RISK_STYLES` → low/med/high → `pending`/`warm`/`bad`
  - `STATUS_STYLES` → pending/approved/rejected/expired → `pending`/`good`/`bad`/`muted-foreground`
- `DiffView.tsx` — paper-bg "current" panel + lime-gradient "proposed" panel → `bg-card` + `bg-good/15`
- `ApprovalQueue.tsx` (FilterChips) — active state → `bg-primary text-primary-foreground`

### `src/app/decisions/page.tsx` + 6 components

- `DecisionCard.tsx` — `PANEL` wrapping
- `ConfidenceMeter.tsx` — bar → `bg-good`; "not estimated" pill → `text-pending`
- `SignalTrace.tsx` — weight bars → `bg-good`; row hover → `bg-card/50`
- `VerdictBadge.tsx` — rewrite `VERDICT_TINTS` map:
  - `at_risk` → `text-bad`
  - `watch` → `text-warm`
  - `priority_high` → `text-hot`
  - `priority_medium` → `text-lime`
  - `upsell_qualified` → `text-good`
  - `route_to_executor` → `text-cold`
  - `missing_save_plan` / `stale_activity` / `missing_csm_owner` / `sop_section_5_gap` → `text-warm`
- `DecisionTypeBadge.tsx` — `border-primary/40 text-primary` (was `border-lime/40 text-lime`)
- `DecisionList.tsx` (FilterChips) — same active-state swap

---

## Commit plan

5 commits on `roberto-backend`. Each one builds clean independently; each is revertable.

```
1. chore(design): install next-themes + clsx + tailwind-merge + tw-animate-css
2. feat(design): adopt AK's tokens, globals.css, surfaces, accents
3. refactor(hub): restyle Hub home with PANEL + semantic colors
4. refactor(brief): restyle Daily Brief with semantic palette + LIFT priorities
5. refactor(approvals,decisions): restyle queue + trace with semantic palette
```

After commit 5: open PR `roberto-backend → main`, merge, Vercel auto-deploys to surfops.io.

---

## Risks

In descending probability:

1. **AK's `globals.css` imports `shadcn/tailwind.css`**
   - Likelihood: medium
   - Impact: build error at commit 2
   - Fix: either drop the import line, or install whatever package provides it. Surfaces on the first `npm run build` after commit 2 — easy to spot.

2. **Tailwind v4 `@theme inline` syntax differences**
   - Likelihood: low (both branches are v4)
   - Impact: build error at commit 2
   - Fix: minor syntax patch on the affected line

3. **Class-name typos across 25 modified files**
   - Likelihood: low per-class, possible across the total
   - Impact: visual glitches on specific elements
   - Fix: caught by per-commit `npm run build` and the post-commit smoke pass

4. **Stray imports of deleted files (`src/styles/tokens.css`, `src/lib/design/tokens.ts`)**
   - Likelihood: low (audited beforehand)
   - Impact: build error at commit 2
   - Fix: surfaces immediately; replace import with new tokens path

None are catastrophic. All are findable in a single build cycle.

---

## Verification checklist

Run after each commit; full pass after commit 5.

- [ ] `npm install` — no missing-peer-dep warnings
- [ ] `npm run build` — clean, all 4 routes + `/api/health` build as Server-rendered (`ƒ`)
- [ ] `npm run dev` — boots on `:3000`
- [ ] `curl http://localhost:3000/api/health` → `{"ok":true,"agents":5}`
- [ ] `/` (Hub) renders 3 tiles, dark theme default
- [ ] `/brief` renders headline, KPIs in `METRIC_CHIP`, priorities with hover-lift
- [ ] `/approvals` — pending cards show `text-pending` pill; high-risk row shows `text-bad`; Approve button is lime; Reject is outline ghost
- [ ] `/decisions` — at_risk verdicts in `text-bad`; priority_high in `text-hot`; upsell_qualified in `text-good`; AGENT LIVE strip pulses
- [ ] Click an Approve button on `/approvals` → DB writes successfully → page revalidates → card moves to "Recently decided" (no Server Action regression)
- [ ] Theme toggle works: light = brighter emerald canvas, dark = mossy default
- [ ] `npm run db:verify` — row counts unchanged (5 / 10 / 17 / 13 / 3 / 6)

---

## How this compares to alternatives

| | A. Visual Transplant (this plan) | B. Defer | C. Monorepo restructure | D. Two-repo treatment |
|---|---|---|---|---|
| Touches `main`? | After 5 commits + PR + merge — yes | No | Yes (huge restructure) | No |
| Demo gets AK's visual language? | ✅ Yes | ❌ No (current Tailwind look) | ✅ Yes (after restructure) | ❌ No |
| Risk to surfops.io | Low (each commit builds; can roll back) | Zero | High (Vercel reconfig) | Zero |
| Honors AK's design work | ✅ Strongly | ⚠️ Postpones | ✅ Strongly | ⚠️ Treats as parallel |
| Time | ~30 min | 0 | ~3 hr | ~10 min |

---

## How to start execution

When ready, reply with:

1. Answers to the three open questions (or "use defaults")
2. "Go" or "execute"

Execution sequence:

1. Install the 4 packages (commit 1)
2. Extract the 6 files from `origin/design`, delete the 2 superseded files (commit 2)
3. Restyle `/` (commit 3)
4. Restyle `/brief` (commit 4)
5. Restyle `/approvals` and `/decisions` (commit 5)
6. Open PR `roberto-backend → main`, merge
7. Verify Vercel auto-deploy of surfops.io

---

## Out of scope (deferred)

- AK's `<Masthead>` / `<SiteFooter>` — different IA, not fit for CSM product
- AK's marketing landing page at `/`
- shadcn primitives (`<Button>`, `<Card>` etc.) — using AK's surface CLASSES instead of his component primitives keeps the dep surface smaller
- Storybook setup
- AK's chart components — no charts in current pages
- Dual-theme component-level testing — one quick visual pass in light + dark, not full QA

These can land in a follow-up if the demo lands well and we choose to deepen the integration.
