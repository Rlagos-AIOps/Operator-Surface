---
task: AI Ops OS — design-system prototype frontend (Next.js 16.2 + Tailwind 4.3 + shadcn 4.4.0)
slug: ai-ops-os-prototype
project: ai-ops-os
effort: E4
phase: complete
progress: 46/46
mode: ALGORITHM
started: 2026-05-28
updated: 2026-05-28
---

## Problem

AK has an "AI Ops OS" design system delivered as tokens (CSS), brand docs, static
preview HTML, and `window.*`-style JSX sketches. None of it is a real, runnable
application. There is no Next.js app, no Tailwind theme carrying the tokens, no
shadcn component layer — just design source. The ask is to turn the design system
into a living prototype on the exact stack requested: Next.js 16.2, Tailwind v4.3,
shadcn 4.4.0.

## Vision

Open `localhost:3000` and see the operator surface from `operator-surface.png` come
alive: deep-emerald canvas, cream speech bubbles, lime CTAs, the volt agent-active
pulse, DM Serif Display numerals over Manrope UI. Click a lead → the thread view
swaps. Hit "Approve & send" → the bubble locks to a volt "Sent" state. It should feel
like the screenshot, not a generic SaaS dashboard — close-to-the-metal, editorial,
confident. The euphoric surprise: the static design system is suddenly a real,
interactive product surface on the modern stack.

## Out of Scope

No backend, no auth, no database, no real LinkedIn integration — this is a prototype
frontend with in-memory mock data. The secondary screens (Daily Brief, Decision Trace,
Approval Queue) ship as faithful brand surfaces only if budget allows; the hero
operator surface (Inbox + Thread + Composer) is the contractual deliverable. No tests
beyond typecheck + build + visual probe. No deployment.

## Principles

- **Fidelity to the artifact.** The screenshot and tokens are ground truth; when the
  JSX sketches and the screenshot disagree, the screenshot wins (it is the rendered intent).
- **Tokens are the substrate.** Every color/space/radius/shadow comes from the design
  system, expressed once in Tailwind v4 `@theme`, never hand-typed hex in components.
- **The stack is the deliverable.** Real Next.js/Tailwind/shadcn, not static HTML.
- **Voice discipline is design.** Sentence case, tabular numerics, no emoji — the copy
  rules in the brand doc are as load-bearing as the colors.

## Constraints

- Next.js **16.2.6** (App Router), Tailwind CSS **4.3.0** (CSS-first `@theme`), shadcn **4.4.0** CLI.
- **bun only** — never npm/npx (zero exceptions).
- TypeScript, strict. Fonts via `next/font` (DM Serif Display, Manrope, JetBrains Mono).
- Icons: lucide-react (1.75px stroke feel). SVG marks copied from `_design_src/assets`.
- Must `bun run build` clean and boot on `bun run dev`.

## Goal

A runnable Next.js 16.2.6 + Tailwind 4.3.0 + shadcn 4.4.0 app whose `/` route renders
the AI Ops OS operator surface with visual fidelity to `operator-surface.png`, driven
by the real design tokens in `@theme`, interactive (lead selection, approve/reject,
intent filtering), type-checking and building clean — verified by a live browser probe.

## Criteria

### Stack & build
- [x] ISC-1: `ai-ops-os/package.json` pins `next@16.2.6`
- [x] ISC-2: `tailwindcss` resolves to `4.3.0` in the app
- [x] ISC-3: shadcn `components.json` exists (init via shadcn@4.4.0)
- [x] ISC-4: `bun run build` exits 0
- [x] ISC-5: typecheck has no errors (`tsc --noEmit` / next build typecheck)
- [x] ISC-6: `bun run dev` serves HTTP 200 at `/`
- [x] ISC-7: no `npm`/`npx` invoked anywhere (bun lockfile present, no package-lock.json)

### Tokens (Tailwind v4 @theme)
- [x] ISC-8: `--color-emerald` (#1E5631) + bg-deep + surface tiers defined in @theme
- [x] ISC-9: `--color-paper` (#F4F1E8) + paper-2/edge defined
- [x] ISC-10: `--color-lime` (#D9E879) + `--color-volt` (#C8F902) defined
- [x] ISC-11: semantic success/warning/danger/info defined
- [x] ISC-12: DM Serif Display wired as serif/display font var
- [x] ISC-13: Manrope wired as sans/UI font var
- [x] ISC-14: JetBrains Mono wired as mono font var
- [x] ISC-15: spacing 8pt scale + radii (sm..xl, pill) tokens present
- [x] ISC-16: signature bubble radius `60px 15px 60px 15px` available as a token/util
- [x] ISC-17: shadow-1/2/3 + glow-volt elevation tokens present
- [x] ISC-18: tabular-nums numeric treatment available for metrics

### Components (faithful to screenshot)
- [x] ISC-19: Sidebar renders mark + "AI Ops / OPERATOR OS" lockup
- [x] ISC-20: Sidebar nav (Inbox, Pipeline, Clients, Scoping, ROI Pricing, Agents) with counts
- [x] ISC-21: Sidebar active item is lime-filled pill; Agents count is volt live-glow
- [x] ISC-22: Sidebar bottom "Triage agent · Working" card with pulsing volt dot
- [x] ISC-23: TopBar search input (inset well) with leading search icon
- [x] ISC-24: TopBar "High intent" filter button + "AGENT LIVE" volt pill + avatar R
- [x] ISC-25: Four metric cards: Pipeline 42, Agent·active 7 (volt/live), Avg response 2h 14m, ROI·locked $4,200 (paper)
- [x] ISC-26: metric values use DM Serif Display + tabular numerics
- [x] ISC-27: Lead queue lists 6 leads with name/role/preview/time
- [x] ISC-28: each lead shows intent chip HIGH/MID/COLD + score (e.g. HIGH·84)
- [x] ISC-29: ThreadView header: avatar, name in serif, role·company, "STAGE 02 · QUALIFY" chip
- [x] ISC-30: human bubble = paper bg, left, radius `60 15 60 15`
- [x] ISC-31: reasoning bubble = transparent + 1.5px dotted lime + "REASONING" eyebrow
- [x] ISC-32: Composer "AGENT DRAFT · READY FOR REVIEW" eyebrow + confidence·tokens meta
- [x] ISC-33: Composer editable draft area + Approve & send / Revise / Reject / Regenerate
- [x] ISC-34: Approve & send is lime; on approve → volt "Sent" with glow

### Interaction
- [x] ISC-35: clicking a queue row selects it (lime tint) and swaps the ThreadView content
- [x] ISC-36: "Approve & send" transitions composer to sent state (volt) without reload
- [x] ISC-37: "High intent" filter narrows the queue to HIGH leads
- [x] ISC-38: Reject dims/removes the draft for that lead

### Visual fidelity (live probe)
- [x] ISC-39: Interceptor screenshot of `/` matches operator-surface.png layout (emerald canvas dominant, 4 cards, queue, thread, composer)
- [x] ISC-40: no console errors on load
- [x] ISC-41: focus ring is volt on keyboard focus of an interactive element

### Anti-criteria
- [x] ISC-42: Anti: no emoji anywhere in the UI
- [x] ISC-43: Anti: no bluish-purple gradient anywhere
- [x] ISC-44: Anti: white/paper is never the dominant full-page background (emerald is)
- [x] ISC-45: Anti: buttons/nav are sentence case, not Title Case (product names excepted)
- [x] ISC-46: Antecedent: dev server renders `/` with no runtime/hydration error (precondition for any visual judgement)

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| ISC-1..3 | build | grep package.json / components.json | exact version | Read/Grep |
| ISC-4..6 | build | run build + curl dev | exit 0 / HTTP 200 | Bash |
| ISC-7 | build | absence of package-lock.json, presence of bun.lock | files | Bash |
| ISC-8..18 | tokens | grep globals.css @theme + font config | token present | Grep |
| ISC-19..34 | component | grep component source for required markup/labels | symbol present | Grep/Read |
| ISC-35..38 | interaction | live click + DOM state via Interceptor | state changes | Interceptor |
| ISC-39..41 | fidelity | Interceptor screenshot + console read | matches/no errors | Interceptor |
| ISC-42..46 | anti/antecedent | grep for forbidden patterns + render probe | absent/renders | Grep/Interceptor |

## Features

| name | satisfies | depends_on | parallelizable |
|------|-----------|------------|----------------|
| scaffold (next/tailwind/shadcn) | ISC-1..7 | — | no |
| theme tokens + fonts | ISC-8..18 | scaffold | no |
| brand primitives (bubble, chip, eyebrow, metric) | ISC-16,18,26,28,30..32 | tokens | partly |
| Sidebar | ISC-19..22 | tokens | yes |
| TopBar | ISC-23,24 | tokens | yes |
| MetricRow | ISC-25,26 | primitives | yes |
| LeadQueue | ISC-27,28,35,37,38 | primitives | yes |
| ThreadView + Composer | ISC-29..34,36 | primitives | yes |
| page assembly + mock data | ISC-39,46 | all components | no |
| Forge hardening + verify | ISC-40,41,42..45 | assembly | no |

## Decisions

- 2026-05-28 — ISA lives at workspace root `/Users/ak/a-r-capstone/ISA.md`; the app is the `ai-ops-os/` subdir. The capstone workspace is the persistent thing.
- 2026-05-28 — Pin exactly what AK asked: next 16.2.6 (top of 16.2 line), tailwind 4.3.0, shadcn 4.4.0 CLI (latest is 4.8.2 but request is explicit).
- 2026-05-28 — Screenshot is the fidelity target over the JSX sketches (the JSX `dm-data.js` is a different screen, the Approval Queue, using INVESTOR/CANDIDATE categories; the operator-surface screenshot uses HIGH/MID/COLD intent scores — I build to the screenshot).
- 2026-05-28 — refined: composer draft renders as a paper/cream editable bubble (matches screenshot) rather than the dotted-lime variant in Composer.jsx.
- 2026-05-28 — show-your-math (ISC soft floor): E4 soft floor is 128 ISCs; I wrote 46 atomic, individually-probeable ISCs covering stack/tokens/components/interaction/fidelity/anti. Padding to 128 for a single-surface prototype would manufacture ceremony the doctrine warns against ("never let ceremony eat the budget"). Coverage, not count, is the bar here.
- 2026-05-28 — show-your-math (thinking lenses): FirstPrinciples/IterativeDepth/ApertureOscillation applied as inline reasoning rather than separate skill subprocesses, to keep the 30-min E4 budget on the build. External rigor is preserved via real Forge (build/quality) + Cato (cross-vendor audit) + Advisor subprocess calls.
- 2026-05-28 — Cato verdict: concerns (casing at ISC-28/31/45) → reviewed as brand-sanctioned eyebrow/chip uppercase (CSS-only; source is sentence case, rg-confirmed); matches target screenshot. No code change.
- 2026-05-28 — Advisor "FATAL ISA mismatch" was an `--auto-state` artifact: it loaded an unrelated session's work.json (`citizens-full-power-slack-reconcile`), not this ISA. Substantive notes (build vs dev, empty state, a11y, token discipline) were already satisfied. Accepted-for-tier: approve→sent is demo-only local state (no backend, out of scope).
- 2026-05-28 — interceptor CLI installed per AK's instruction: built slop-browser from source → `interceptor 0.16.1` + daemon at `/opt/homebrew/bin`, bridge running (full mode). Remaining manual step: load the unpacked Chrome extension (`~/Projects/interceptor/extension/dist`) for browser control. This run verified via the Claude Preview (Chrome DevTools) MCP since the extension load is a manual user step.
- 2026-05-28 — Forge (GPT-5.4) hardening pass applied 6 surgical fixes (re-verified by me): null-safe lead selection in operator-surface (`.at(0)` + fallback chain — also fixes filter-while-a-hidden-lead-is-selected), composer switched to uncontrolled `defaultValue` + `key={lead.id}` to satisfy Next 16 `react-hooks/set-state-in-effect`, a11y `role=status`/`aria-live` on status pills + `aria-hidden` on decorative avatars/dots, dead Revise/Regenerate buttons now toast "coming soon". Re-verified: `bun run lint` clean, no visual regression at 1280.
- 2026-05-28 (Phase 2 — design-ops) — Whiteboard platform: **tldraw, not Excalidraw** (AK confirmed). tldraw has first-class agent support (agent-template = client + Cloudflare worker; programmatic `useAgent().prompt()`). Set up via the tldraw **agent SDK**, not the in-session MCP-exec widget (which timed out twice — unreliable in this client).
- 2026-05-28 — Product-bible canon: **Storybook (functional spine) + Supernova (token→code design canon)**, AK confirmed. `ai-ops-os/lib/tokens.ts` + `/styleguide` are the machine-readable seed both consume; Google Stitch is the generator at the front of the pipeline (screenshots/prompts → HTML/Tailwind + Figma export).
- 2026-05-28 — Delivered: (A) live `app/styleguide/page.tsx` + `lib/tokens.ts` reading the same @theme tokens (verified render); (B) `design-board/` = cloned tldraw agent-template; `client/seed.ts` seeds 3 sections (Shipped/Mood/Build) on empty canvas — verified live (23 shapes: 3 frames + 17 notes + 3 headers; agent chat present). Board run needs `.dev.vars` ANTHROPIC_API_KEY (template made, key NOT invented); real-time team multiplayer needs a Cloudflare deploy (flagged, not yet done).

## Changelog

- conjectured: shadcn init would scaffold cleanly with `-b neutral` (color-name base, as in prior shadcn versions).
  refuted_by: shadcn 4.4.0 rejected it — `base: Invalid enum value. Expected 'radix' | 'base'`; and `-y` no longer bypasses the new interactive "preset" prompt.
  learned: shadcn 4.4.0 changed the base-color contract to `radix|base` + added presets; non-interactive init needs `-d` (defaults → template=next, preset=base-nova) or `-b base -p base-nova`. The base-nova preset uses `@base-ui/react` (not Radix) + lucide.
  criterion_now: ISC-3 satisfied via `shadcn@4.4.0 init -d -f`.

- conjectured: one fixed 3-pane grid (`grid-cols-[minmax(340px,420px)_1fr]`) was sufficient.
  refuted_by: at the preview's 800px viewport the thread/composer pane collapsed to a ~200px strip (text wrapped one word per line).
  learned: the 3-pane operator console needs a breakpoint — side-by-side at `lg`+, stacked (queue over thread) below — to stay usable below the 1280 design target.
  criterion_now: ISC-39 holds at 1280; narrow widths now degrade gracefully.

- conjectured: a `useEffect` calling `setText(lead.draft)` on lead change was the right way to reset the composer draft (React 18 idiom).
  refuted_by: Next 16 / React 19 ESLint enforces `react-hooks/set-state-in-effect`; `bun run lint` failed on it. (Forge-surfaced.)
  learned: prefer remount-to-reset (`key={lead.id}` + uncontrolled `defaultValue`) over setState-in-effect; and `LEADS[0]` is unsafe under strict index access — use `.at(0)` + a fallback chain.
  criterion_now: ISC-4/5 hold with lint clean; ISC-35 still passes (draft resets on lead switch via remount).

- conjectured: the in-session tldraw MCP `exec` channel would let me draw the board directly.
  refuted_by: `exec` timed out twice (30s) — the MCP-App canvas widget doesn't render/respond in this client; AK redirected me to the tldraw agent SDK.
  learned: for a team-shareable, persistent, agent-operable tldraw board, scaffold the agent-template (client + Cloudflare worker) and seed via the `editor` API in `onMount` — not the ephemeral MCP widget. The read-only spec `search` works regardless; only live-canvas `exec` needs the widget.
  criterion_now: board set up via the agent SDK; 3-section seed verified live (23 shapes).

## Verification

- ISC-1: package.json → `"next": "16.2.6"`. ✓
- ISC-2: node_modules/tailwindcss → `"version": "4.3.0"`. ✓
- ISC-3: components.json present (`"style": "base-nova"`), via `shadcn@4.4.0 init -d -f`. ✓
- ISC-4/5: `bun run build` → "Compiled successfully in 2.1s", "Finished TypeScript in 1907ms", `/` prerendered, exit 0. ✓
- ISC-6: dev server `GET / 200`. ✓
- ISC-7: `bun.lock` present, no `package-lock.json`. ✓
- ISC-8..18 (tokens): preview_inspect → body bg rgb(30,86,49)=emerald, aside rgb(22,63,35)=emerald-deep, h2 font "DM Serif Display", body font Manrope, active nav lime rgb(217,232,121). globals.css @theme carries emerald/paper/lime/volt/semantic + fonts + radii (incl. bubble @utility) + shadows (ground/raised/float, glow-volt) + pulse-volt. ✓
- ISC-19..34 (components): 1280×832 screenshot matches operator-surface.png — lockup+nav+agent card, topbar (search/filter/AGENT LIVE/avatar), 4 metric cards (live-volt + paper ROI) with serif tabular numerals, 6-lead queue + HIGH/MID/COLD chips, thread header + STAGE chip, paper human bubble + dotted-lime REASONING bubble, composer eyebrow + confidence/tokens + paper draft + 4 actions. ✓
- ISC-35: live click "Aileen Cruz" → thread header read back "Aileen Cruz" (COO · Northwind); composer swapped to her draft (0.89 · 274 tokens). ✓
- ISC-36: live click "Approve & send" → button → volt "✓ Sent" + "Reply sent to Aileen Cruz" toast (screenshot). ✓
- ISC-37: live click "High intent" → queue → "2 threads" (Maya 84 + Aileen 91), filter button lime (screenshot). ✓
- ISC-38: rejectedIds Set pattern identical to the live-proven sentIds approve flow; rejected branch renders "Draft rejected" bubble + disables actions (code-verified).
- ISC-39: 1280×832 screenshot — emerald canvas dominant, all panes present, near pixel-match to target. ✓
- ISC-40: preview_console_logs(error) → "No console logs". ✓
- ISC-41: focus-visible:ring-volt on interactive elements + `--ring: #C8F902` confirmed via inspect. ✓
- ISC-42: rg scan → NO EMOJI in components/app/lib. ✓
- ISC-43: rg scan → no purple/violet/indigo/blue/fuchsia; only gradient is lime→volt (agent bubble). ✓
- ISC-44: body bg emerald; paper used only on cards/bubbles, never full-page. ✓
- ISC-45: button/nav source text sentence case ("High intent", "Regenerate", "Approve & send"); uppercase is CSS-only on eyebrows/chips (brand-sanctioned). ✓
- ISC-46: dev server `/` 200, no console errors, screenshot proves render. ✓

Coverage: 46/46 (43 live/tool-probed, 3 inspection-verified: ISC-38, ISC-41, ISC-44).

### Cato (cross-vendor audit, E4) — ran (GPT-5.4 via codex)
Flagged casing concern (ISC-28/31/45) → resolved: uppercase is brand-sanctioned eyebrow/chip CSS; source sentence case (rg-confirmed); no emoji/purple/raw-hex. Verdict: concerns → resolved, no code change.

### Advisor (commitment-boundary, E4) — ran
"ISA mismatch" was an --auto-state artifact (unrelated session). Substantive notes pre-addressed (build passes, empty-filter state, a11y + sonner aria-live, token discipline). Residual accepted-for-tier: approve→sent demo-only (no backend, out of scope).
