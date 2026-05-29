# Task 1 — Scaffold + Shared Supabase Schema

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the Operator Surface Next.js app with design tokens wired from the AI Ops OS design system, and define v1 of the Supabase schema that serves as the agent↔app contract.

**Architecture:** Single Next.js (App Router, TypeScript, Tailwind) project deployed to Vercel. Shared Supabase Postgres holds the agent↔app data contract. Hermes agents write to Supabase using the service role key; this app reads via the anon/auth keys and writes back only for human-in-the-loop fields (approval decisions, brief view marks). Schema is managed through SQL migration files under `supabase/migrations/`, pushed to the **hosted** Supabase project via `supabase link` + `supabase db push`. JSONB column conventions are documented in `docs/schema-conventions.md`.

**Tech Stack:**
- Next.js 16.2 (App Router, Turbopack) + TypeScript + Tailwind CSS v4
- Fonts: DM Serif Display + Manrope (via `next/font/google`)
- Supabase JS v2 (`@supabase/supabase-js`, `@supabase/ssr`)
- Supabase CLI linked to the hosted project (no local Docker)
- Node 20 LTS, npm

**Tailwind v4 note:** v4 declares design tokens via `@theme` directives inside CSS, not a `tailwind.config.ts`. The source-of-truth tokens live in `src/styles/tokens.css` (raw CSS variables in `:root`), and `src/app/globals.css` re-exposes them to Tailwind via `@theme inline { --color-bg: var(--bg); ... }`. No `tailwind.config.ts` file is created.

---

## Scope

**In scope for Task 1:**
- Project scaffold, Tailwind config wired to design tokens, base layout that renders in brand colors/fonts.
- SQL migration files for 6 tables: `agents`, `agent_runs`, `decisions`, `approvals`, `briefs`, `connections`.
- RLS policies for v1 (service role bypass for agents; authenticated reads; operator-scoped writes where applicable).
- Generated TypeScript types from the schema.
- Supabase client modules (browser + server) and an env example file.
- A `/api/health` route that verifies the Supabase connection.

**Out of scope (deferred to later tasks):**
- Any actual screens (Daily Brief, Approval Queue, Decision Trace, Lead Queue, Composer). Task 1 stops at "blank app in brand colors."
- Real agent logic (this lives in the Hermes repo).
- Vercel deployment + env wiring (Task 2).
- Supabase Auth UI / Google OAuth (Task 3).
- Seed data / fixtures (Task 4).

---

## Design Decisions (please review before approving)

1. **Operator identity = Supabase `auth.users`.** All operator-scoped FKs reference `auth.users(id)`. Auth wiring itself is Task 3.
2. **Agents write via service role; operators read/write via auth.** RLS is enabled on every table. Service role bypasses RLS by Postgres convention.
3. **`decisions` and `agent_runs` are append-only and globally readable** to any authenticated user. Transparency is the product — every operator can audit any agent run.
4. **`approvals` are globally visible but anyone authenticated can decide.** v1 doesn't model per-operator assignment; the `decided_by` column captures who acted. Tightening (assignee FK) is easy to add later.
5. **`briefs` and `connections` are per-operator** (RLS: row visible only to its `operator_id`).
6. **Hosted-Supabase-from-day-one.** No local Postgres / Docker. `supabase link --project-ref <REF>` against the project the user provides, then `supabase db push` to apply migrations remotely.
7. **No agent-specific tables in v1.** The schema is generic enough to host any CSM agent (`health-score-recomputer`, `at-risk-triage`, `renewal-outreach`, `data-hygiene-audit`, `save-plan-drafter` are the v1 placeholders, all implemented in the separate Hermes repo). Agent-specific payloads live in the `metadata`/`signals`/`proposed_value` JSONB columns — shapes documented in `docs/schema-conventions.md`.
8. **Soft-deletes deferred.** No `deleted_at` columns yet. We'll add when we hit a need.
9. **No service role key in the Next.js app.** This app uses anon + user JWT only. The service role lives in the Hermes repo's env.

---

## Schema Design Rationale

### `agents` — registry & kill switch
The list of agents that exist. Drives the Connections / Settings UI and the kill switch (`enabled = false` stops Hermes from picking up new work). `status` is informational ("currently running", "idle", "errored") and updated by Hermes; `enabled` is the operator's intent and updated only from this app.

### `agent_runs` — one execution of an agent
Append-only log: "Agent X ran from T1 to T2, processed N items, ended with status S." Powers the "what did the agents do today" timeline.

### `decisions` — a judgment made during a run, with reasoning
A run produces many decisions. Each decision has the verdict (`label`), how sure it was (`confidence`), what it was looking at (`source_record_type` + `source_record_id`), narrative reasoning (`reasoning`), and a structured signal trace (`signals` JSONB — list of `{name, value, weight}`). Powers the Decision Trace surface.

### `approvals` — proposed actions waiting on a human
A decision can optionally produce a proposed action — "send this reply", "change this field from X to Y", "create this task." Operator approves/rejects. Hermes polls for `status='approved'` and executes. `current_value` + `proposed_value` are JSONB so the same table handles email drafts, field updates, task creation, etc.

### `briefs` — daily brief content
The agent generates one brief per operator per day. Structured enough for the UI (`headline`, `body_md`), with `structured_data` JSONB for chips/metrics/refs the UI can render natively.

### `connections` — external tool wiring
One row per (operator, provider) pair. Tracks connection status, last sync, scopes. Powers the Connections page and the kill switch on individual integrations. **Credentials are NOT stored here** — those live in Supabase Vault or the Hermes repo's secret store.

---

## File Structure

```
/Users/robertolagos/dev/Operator-Surface/
├── README.md                              [Task 1.19]
├── .env.example                           [Task 1.18]
├── .env.local                             (gitignored, you fill in)
├── .gitignore                             [Task 1.1 from create-next-app]
├── next.config.ts                         [Task 1.1]
├── package.json                           [Task 1.1]
├── tailwind.config.ts                     [Task 1.3]
├── postcss.config.js                      [Task 1.1]
├── tsconfig.json                          [Task 1.1]
├── supabase/
│   ├── config.toml                        [Task 1.6]
│   └── migrations/
│       ├── 0001_enums_and_extensions.sql  [Task 1.7]
│       ├── 0002_agents.sql                [Task 1.8]
│       ├── 0003_agent_runs.sql            [Task 1.9]
│       ├── 0004_decisions.sql             [Task 1.10]
│       ├── 0005_approvals.sql             [Task 1.11]
│       ├── 0006_briefs.sql                [Task 1.12]
│       ├── 0007_connections.sql           [Task 1.13]
│       └── 0008_indexes_and_rls.sql       [Task 1.14]
└── src/
    ├── app/
    │   ├── layout.tsx                     [Task 1.2]
    │   ├── page.tsx                       [Task 1.5]
    │   ├── globals.css                    [Task 1.2]
    │   └── api/
    │       └── health/route.ts            [Task 1.17]
    ├── lib/
    │   ├── design/tokens.ts               [Task 1.4]
    │   └── supabase/
    │       ├── browser.ts                 [Task 1.16]
    │       ├── server.ts                  [Task 1.16]
    │       └── types.ts                   [Task 1.15, generated]
    └── styles/
        └── tokens.css                     [Task 1.3, mirrors design-system CSS vars]
```

---

## Task 1.1 — Scaffold Next.js app

**Files:**
- Create: entire project tree under `/Users/robertolagos/dev/Operator-Surface/`

- [ ] **Step 1: Run create-next-app into the existing empty repo**

```bash
cd /Users/robertolagos/dev/Operator-Surface && \
npx --yes create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --eslint \
  --import-alias "@/*" \
  --use-npm \
  --turbopack
```

Expected: scaffolds `src/app/`, `package.json`, `tailwind.config.ts`, `tsconfig.json`. Detects existing `.git` and skips re-init.

- [ ] **Step 2: Verify dev server boots**

Run: `cd /Users/robertolagos/dev/Operator-Surface && npm run dev`
Expected: `▲ Next.js 15.x.x  - Local: http://localhost:3000` within ~3s, no errors.
Stop with Ctrl-C after confirming.

- [ ] **Step 3: Commit**

```bash
cd /Users/robertolagos/dev/Operator-Surface && \
git add -A && \
git commit -m "chore: scaffold Next.js app router + typescript + tailwind"
```

---

## Task 1.2 — Fonts + base layout

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace `src/app/layout.tsx` with brand-fonts layout**

```tsx
import type { Metadata } from "next";
import { DM_Serif_Display, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const serif = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Manrope({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Operator Surface",
  description: "See what your AI agents did. Approve what they want to do next.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body className="bg-bg text-paper font-sans antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Replace `src/app/globals.css` with token-based reset**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import "../styles/tokens.css";

html, body {
  background: var(--bg);
  color: var(--paper-text);
  font-family: var(--font-sans), system-ui, -apple-system, sans-serif;
  font-size: var(--fs-body);
  line-height: var(--lh-body);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

h1, h2, .display {
  font-family: var(--font-serif), serif;
  font-weight: 400;
  letter-spacing: var(--tr-tight);
  line-height: var(--lh-heading);
  text-wrap: balance;
}
h1, .display {
  font-size: var(--fs-h1);
  letter-spacing: var(--tr-tighter);
  line-height: var(--lh-display);
}
h2 { font-size: var(--fs-h2); }

.eyebrow {
  font-family: var(--font-sans), sans-serif;
  font-size: var(--fs-micro);
  font-weight: 700;
  letter-spacing: var(--tr-eyebrow);
  text-transform: uppercase;
  color: var(--lime);
}

.num, .tabular {
  font-variant-numeric: tabular-nums lining-nums;
}

::selection { background: var(--volt); color: var(--ink); }
```

- [ ] **Step 3: Commit**

```bash
cd /Users/robertolagos/dev/Operator-Surface && \
git add src/app/layout.tsx src/app/globals.css && \
git commit -m "feat(design): wire DM Serif Display + Manrope fonts and base typography"
```

---

## Task 1.3 — Design tokens CSS + Tailwind config

**Files:**
- Create: `src/styles/tokens.css` (mirrors `colors_and_type.css` from the design system)
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Create `src/styles/tokens.css`** — copy verbatim from `/tmp/operator-surface-design/colors_and_type.css` lines 9–117 (the `:root { ... }` block), wrapped as a `@layer base` import. This is the single source of truth for color/spacing/radii/shadows/motion. Do NOT include the typography element rules from that file (those live in `globals.css`).

The file content:

```css
@layer base {
  :root {
    /* Surfaces */
    --bg: #1E5631;
    --bg-deep: #163F23;
    --surface: #245F37;
    --surface-2: #2B6E40;
    --surface-edge: #3A8052;

    /* Paper */
    --paper: #F4F1E8;
    --paper-2: #ECE7D6;
    --paper-edge: #D8D2BE;

    /* Accents */
    --lime: #D9E879;
    --volt: #C8F902;
    --lime-deep: #B8C95F;
    --lime-soft: rgba(217,232,121,0.18);

    /* Text */
    --ink: #0A1410;
    --ink-2: #1F2A24;
    --paper-text: #F4F1E8;
    --muted: #8FA89A;
    --muted-light: #5A6E62;

    /* Semantic */
    --success: #D9E879;
    --warning: #E8A91C;
    --danger: #D9402B;
    --info: #6FB4D9;

    /* Focus */
    --focus-ring: #C8F902;

    /* Type scale */
    --fs-display: clamp(48px, 6.5vw, 96px);
    --fs-h1: 56px;
    --fs-h2: 40px;
    --fs-h3: 28px;
    --fs-h4: 20px;
    --fs-body: 16px;
    --fs-small: 14px;
    --fs-micro: 12px;

    /* Tracking */
    --tr-tight: -0.02em;
    --tr-tighter: -0.035em;
    --tr-normal: 0;
    --tr-wide: 0.02em;
    --tr-eyebrow: 0.14em;

    /* Line heights */
    --lh-display: 0.96;
    --lh-heading: 1.05;
    --lh-body: 1.55;
    --lh-tight: 1.2;

    /* Spacing (8pt grid) */
    --s-1: 4px;
    --s-2: 8px;
    --s-3: 12px;
    --s-4: 16px;
    --s-5: 24px;
    --s-6: 32px;
    --s-7: 48px;
    --s-8: 64px;
    --s-9: 96px;

    /* Radii */
    --r-sm: 4px;
    --r-md: 8px;
    --r-lg: 14px;
    --r-xl: 20px;
    --r-pill: 999px;

    /* Shadows */
    --shadow-1: 0 1px 0 rgba(10,20,16,0.20), 0 0 0 1px rgba(58,128,82,0.35);
    --shadow-2: 0 6px 18px rgba(10,20,16,0.30), 0 0 0 1px rgba(58,128,82,0.40);
    --shadow-3: 0 18px 40px rgba(10,20,16,0.45), 0 0 0 1px rgba(58,128,82,0.50);
    --glow-volt: 0 0 0 4px rgba(200,249,2,0.20), 0 0 24px rgba(200,249,2,0.45);
    --inset-well: inset 0 1px 0 rgba(0,0,0,0.25), inset 0 0 0 1px rgba(0,0,0,0.20);

    /* Motion */
    --ease-snap: cubic-bezier(0.2, 0.9, 0.2, 1);
    --ease-out:  cubic-bezier(0.16, 1, 0.3, 1);
    --ease-in:   cubic-bezier(0.7, 0, 0.84, 0);
    --dur-fast:  120ms;
    --dur-base:  220ms;
    --dur-slow:  420ms;
  }
}
```

- [ ] **Step 2: Replace `tailwind.config.ts`** so utilities map to the CSS variables. This keeps the variables as the single source of truth.

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-deep": "var(--bg-deep)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        "surface-edge": "var(--surface-edge)",
        paper: "var(--paper)",
        "paper-2": "var(--paper-2)",
        "paper-edge": "var(--paper-edge)",
        lime: "var(--lime)",
        "lime-deep": "var(--lime-deep)",
        volt: "var(--volt)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        muted: "var(--muted)",
        "muted-light": "var(--muted-light)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        info: "var(--info)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        display: ["var(--fs-display)", { lineHeight: "var(--lh-display)" }],
        h1: ["var(--fs-h1)", { lineHeight: "var(--lh-display)" }],
        h2: ["var(--fs-h2)", { lineHeight: "var(--lh-heading)" }],
        h3: ["var(--fs-h3)", { lineHeight: "var(--lh-tight)" }],
        h4: ["var(--fs-h4)", { lineHeight: "var(--lh-tight)" }],
        body: ["var(--fs-body)", { lineHeight: "var(--lh-body)" }],
        small: ["var(--fs-small)", { lineHeight: "var(--lh-body)" }],
        micro: ["var(--fs-micro)", { lineHeight: "var(--lh-tight)" }],
      },
      spacing: {
        s1: "var(--s-1)",
        s2: "var(--s-2)",
        s3: "var(--s-3)",
        s4: "var(--s-4)",
        s5: "var(--s-5)",
        s6: "var(--s-6)",
        s7: "var(--s-7)",
        s8: "var(--s-8)",
        s9: "var(--s-9)",
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        xl: "var(--r-xl)",
        pill: "var(--r-pill)",
        "bubble-l": "60px 15px 60px 15px",
        "bubble-r": "15px 60px 15px 60px",
      },
      boxShadow: {
        e1: "var(--shadow-1)",
        e2: "var(--shadow-2)",
        e3: "var(--shadow-3)",
        "glow-volt": "var(--glow-volt)",
        well: "var(--inset-well)",
      },
      transitionTimingFunction: {
        snap: "var(--ease-snap)",
        "ease-in-bz": "var(--ease-in)",
        "ease-out-bz": "var(--ease-out)",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 3: Commit**

```bash
cd /Users/robertolagos/dev/Operator-Surface && \
git add src/styles/tokens.css tailwind.config.ts && \
git commit -m "feat(design): add design tokens CSS + Tailwind mapping"
```

---

## Task 1.4 — TypeScript tokens module

**Files:**
- Create: `src/lib/design/tokens.ts`

Why: when a component needs a token value at runtime (e.g. canvas, chart, JS animation), it imports from here — keeping non-CSS consumers in sync.

- [ ] **Step 1: Write `src/lib/design/tokens.ts`**

```ts
export const colors = {
  bg: "#1E5631",
  bgDeep: "#163F23",
  surface: "#245F37",
  surface2: "#2B6E40",
  surfaceEdge: "#3A8052",
  paper: "#F4F1E8",
  paper2: "#ECE7D6",
  paperEdge: "#D8D2BE",
  lime: "#D9E879",
  volt: "#C8F902",
  limeDeep: "#B8C95F",
  ink: "#0A1410",
  ink2: "#1F2A24",
  muted: "#8FA89A",
  mutedLight: "#5A6E62",
  success: "#D9E879",
  warning: "#E8A91C",
  danger: "#D9402B",
  info: "#6FB4D9",
} as const;

export const fonts = {
  serif: "var(--font-serif)",
  sans: "var(--font-sans)",
  mono: "var(--font-mono)",
} as const;

export const radii = {
  sm: 4,
  md: 8,
  lg: 14,
  xl: 20,
  pill: 9999,
  bubbleLeft: "60px 15px 60px 15px",
  bubbleRight: "15px 60px 15px 60px",
} as const;

export const motion = {
  durFast: 120,
  durBase: 220,
  durSlow: 420,
  easeSnap: "cubic-bezier(0.2, 0.9, 0.2, 1)",
  easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
  easeIn: "cubic-bezier(0.7, 0, 0.84, 0)",
} as const;
```

- [ ] **Step 2: Commit**

```bash
cd /Users/robertolagos/dev/Operator-Surface && \
git add src/lib/design/tokens.ts && \
git commit -m "feat(design): add TypeScript tokens module"
```

---

## Task 1.5 — Brand smoke page

**Files:**
- Modify: `src/app/page.tsx`

Why: confirms fonts loaded, colors render, layout pipeline works. Throwaway when real screens land.

- [ ] **Step 1: Replace `src/app/page.tsx`**

```tsx
export default function Home() {
  return (
    <main className="mx-auto max-w-[1280px] px-s5 py-s8">
      <p className="eyebrow mb-s3">Operator Surface</p>
      <h1 className="text-h1 font-serif text-paper mb-s5">
        See what your agents did. Approve what they want to do next.
      </h1>
      <p className="text-body text-muted max-w-[640px]">
        Hermes agents are running. This surface shows their work, their
        reasoning, and what needs your decision before they execute.
      </p>

      <div className="mt-s8 grid grid-cols-3 gap-s5">
        <div className="rounded-lg bg-surface p-s5 shadow-e1">
          <p className="eyebrow mb-s2">Today</p>
          <p className="font-serif text-h2 tabular text-paper">12</p>
          <p className="text-small text-muted">decisions made</p>
        </div>
        <div className="rounded-lg bg-surface p-s5 shadow-e1">
          <p className="eyebrow mb-s2">Pending</p>
          <p className="font-serif text-h2 tabular text-lime">3</p>
          <p className="text-small text-muted">need your review</p>
        </div>
        <div className="rounded-lg bg-surface p-s5 shadow-e1">
          <p className="eyebrow mb-s2">Connected</p>
          <p className="font-serif text-h2 tabular text-paper">4 / 4</p>
          <p className="text-small text-muted">integrations live</p>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify visually**

Run: `npm run dev`, open http://localhost:3000.
Expected: deep-emerald background, cream serif headline, lime "3" in the middle card, no console errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/robertolagos/dev/Operator-Surface && \
git add src/app/page.tsx && \
git commit -m "feat: brand smoke page rendering tokens, fonts, and elevation"
```

---

## Task 1.6 — Initialize Supabase against the hosted project

**Files:**
- Create: `supabase/config.toml` (via CLI)
- Modify: `.gitignore`

Prereq: user provides Supabase project ref (the `<REF>` from `https://<REF>.supabase.co`). User runs `supabase login` once if needed.

- [ ] **Step 1: Install Supabase CLI if not already present**

```bash
which supabase || brew install supabase/tap/supabase
```

Expected: prints a path or installs cleanly.

- [ ] **Step 2: Authenticate (one-time, user action)**

```bash
supabase login
```

Expected: opens a browser, returns "Logged in." Skip if already logged in.

- [ ] **Step 3: Initialize the Supabase project skeleton**

```bash
cd /Users/robertolagos/dev/Operator-Surface && supabase init
```

Expected: creates `supabase/config.toml` and `supabase/seed.sql`. Decline IDE-settings prompts.

- [ ] **Step 4: Link to the hosted project**

```bash
cd /Users/robertolagos/dev/Operator-Surface && supabase link --project-ref <REF>
```

Expected: "Finished supabase link." Writes `.temp/project-ref` and remembers the linked project.

- [ ] **Step 5: Append Supabase CLI local state to `.gitignore`**

```
# Supabase CLI local state
supabase/.branches
supabase/.temp
**/supabase/.env
```

- [ ] **Step 6: Commit**

```bash
cd /Users/robertolagos/dev/Operator-Surface && \
git add supabase/config.toml supabase/seed.sql .gitignore && \
git commit -m "chore(db): initialize Supabase + link to hosted project"
```

---

## Task 1.7 — Migration: extensions + enums

**Files:**
- Create: `supabase/migrations/0001_enums_and_extensions.sql`

- [ ] **Step 1: Write the migration**

```sql
-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Agent lifecycle
create type agent_status as enum ('idle', 'running', 'errored');

-- Run outcome
create type agent_run_status as enum ('running', 'succeeded', 'failed', 'cancelled');

-- Human approval lifecycle
create type approval_status as enum ('pending', 'approved', 'rejected', 'expired');

-- Connection lifecycle
create type connection_status as enum ('connected', 'disconnected', 'error', 'expired');
```

- [ ] **Step 2: Commit (apply happens in Task 1.15 via `supabase db push`)**

```bash
cd /Users/robertolagos/dev/Operator-Surface && \
git add supabase/migrations/0001_enums_and_extensions.sql && \
git commit -m "feat(db): extensions + status enums"
```

---

## Task 1.8 — Migration: agents

**Files:**
- Create: `supabase/migrations/0002_agents.sql`

- [ ] **Step 1: Write the migration**

```sql
create table public.agents (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  description  text,
  status       agent_status not null default 'idle',
  enabled      boolean not null default true,
  metadata     jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.agents is
  'Registry of agents. `enabled` is the operator-controlled kill switch; `status` is reported by the agent runtime (Hermes).';

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end
$$;

create trigger agents_updated_at
  before update on public.agents
  for each row execute function public.set_updated_at();
```

- [ ] **Step 2: Commit (apply happens in Task 1.15)**

```bash
cd /Users/robertolagos/dev/Operator-Surface && \
git add supabase/migrations/0002_agents.sql && \
git commit -m "feat(db): agents registry + kill switch"
```

---

## Task 1.9 — Migration: agent_runs

**Files:**
- Create: `supabase/migrations/0003_agent_runs.sql`

- [ ] **Step 1: Write the migration**

```sql
create table public.agent_runs (
  id              uuid primary key default gen_random_uuid(),
  agent_id        uuid not null references public.agents(id) on delete restrict,
  started_at      timestamptz not null default now(),
  finished_at     timestamptz,
  duration_ms     integer generated always as
                    (case when finished_at is null then null
                          else (extract(epoch from (finished_at - started_at)) * 1000)::int end) stored,
  status          agent_run_status not null default 'running',
  triggered_by    text,                         -- 'cron' | 'manual' | 'webhook' | ... (renamed from `trigger` — reserved word)
  items_processed integer not null default 0,
  input_summary   text,
  output_summary  text,
  error           text,
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now()
);

comment on table public.agent_runs is
  'One agent execution. Append-only audit log. Hermes writes; this app reads.';
```

- [ ] **Step 2: Commit (apply happens in Task 1.15)**

```bash
cd /Users/robertolagos/dev/Operator-Surface && \
git add supabase/migrations/0003_agent_runs.sql && \
git commit -m "feat(db): agent_runs append-only execution log"
```

---

## Task 1.10 — Migration: decisions

**Files:**
- Create: `supabase/migrations/0004_decisions.sql`

- [ ] **Step 1: Write the migration**

```sql
create table public.decisions (
  id                  uuid primary key default gen_random_uuid(),
  agent_run_id        uuid not null references public.agent_runs(id) on delete cascade,
  agent_id            uuid not null references public.agents(id) on delete restrict,
  decision_type       text not null,            -- e.g. 'classify_intent', 'route_lead'
  source_record_type  text not null,            -- e.g. 'lead', 'thread', 'account'
  source_record_id    text not null,            -- external ID (Salesforce, Zoom, Gmail, etc.)
  label               text not null,            -- the verdict, e.g. 'hot', 'cold'
  confidence          numeric(4,3) check (confidence is null or (confidence >= 0 and confidence <= 1)),
  reasoning           text,                     -- narrative
  signals             jsonb not null default '[]'::jsonb,
                                                -- array of {name, value, weight, note}
  metadata            jsonb not null default '{}'::jsonb,
  created_at          timestamptz not null default now()
);

comment on table public.decisions is
  'Each judgment an agent made during a run, with a reasoning trace. Powers Decision Trace UI.';
comment on column public.decisions.signals is
  'JSONB array. Recommended shape: [{name: string, value: any, weight: number, note?: string}].';
```

- [ ] **Step 2: Commit (apply happens in Task 1.15)**

```bash
cd /Users/robertolagos/dev/Operator-Surface && \
git add supabase/migrations/0004_decisions.sql && \
git commit -m "feat(db): decisions with signals + reasoning trace"
```

---

## Task 1.11 — Migration: approvals

**Files:**
- Create: `supabase/migrations/0005_approvals.sql`

- [ ] **Step 1: Write the migration**

```sql
create table public.approvals (
  id                  uuid primary key default gen_random_uuid(),
  agent_run_id        uuid references public.agent_runs(id) on delete set null,
  agent_id            uuid not null references public.agents(id) on delete restrict,
  decision_id         uuid references public.decisions(id) on delete set null,
  action_type         text not null,            -- 'send_reply' | 'update_field' | 'create_task' | ...
  target_record_type  text not null,
  target_record_id    text not null,
  current_value       jsonb,                    -- what's there now (null if creating)
  proposed_value      jsonb not null,           -- what the agent wants to set
  rationale           text,
  status              approval_status not null default 'pending',
  decided_by          uuid references auth.users(id) on delete set null,
  decided_at          timestamptz,
  decision_note       text,
  expires_at          timestamptz,
  metadata            jsonb not null default '{}'::jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table public.approvals is
  'Proposed agent actions awaiting human review. Hermes polls for status=approved and executes.';

create trigger approvals_updated_at
  before update on public.approvals
  for each row execute function public.set_updated_at();
```

- [ ] **Step 2: Commit (apply happens in Task 1.15)**

```bash
cd /Users/robertolagos/dev/Operator-Surface && \
git add supabase/migrations/0005_approvals.sql && \
git commit -m "feat(db): approvals queue for human-in-the-loop actions"
```

---

## Task 1.12 — Migration: briefs

**Files:**
- Create: `supabase/migrations/0006_briefs.sql`

- [ ] **Step 1: Write the migration**

```sql
create table public.briefs (
  id              uuid primary key default gen_random_uuid(),
  operator_id     uuid not null references auth.users(id) on delete cascade,
  brief_date      date not null,
  headline        text not null,
  body_md         text not null,
  structured_data jsonb not null default '{}'::jsonb,
                                                -- chips, metrics, refs the UI renders natively
  generated_by    uuid references public.agent_runs(id) on delete set null,
  generated_at    timestamptz not null default now(),
  viewed_at       timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (operator_id, brief_date)
);

comment on table public.briefs is
  'Daily brief content per operator. One row per (operator, date).';

create trigger briefs_updated_at
  before update on public.briefs
  for each row execute function public.set_updated_at();
```

- [ ] **Step 2: Commit (apply happens in Task 1.15)**

```bash
cd /Users/robertolagos/dev/Operator-Surface && \
git add supabase/migrations/0006_briefs.sql && \
git commit -m "feat(db): daily briefs per operator"
```

---

## Task 1.13 — Migration: connections

**Files:**
- Create: `supabase/migrations/0007_connections.sql`

- [ ] **Step 1: Write the migration**

```sql
create table public.connections (
  id                  uuid primary key default gen_random_uuid(),
  operator_id         uuid not null references auth.users(id) on delete cascade,
  provider            text not null,            -- 'salesforce' | 'slack' | 'google' | 'zoom' | ...
  status              connection_status not null default 'disconnected',
  external_account_id text,                     -- the upstream user/org ID
  scopes              text[] not null default '{}',
  last_sync_at        timestamptz,
  last_error          text,
  metadata            jsonb not null default '{}'::jsonb,
                                                -- non-secret tool config only
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (operator_id, provider)
);

comment on table public.connections is
  'External tool connections per operator. Credentials are NOT stored here (use Supabase Vault).';

create trigger connections_updated_at
  before update on public.connections
  for each row execute function public.set_updated_at();
```

- [ ] **Step 2: Commit (apply happens in Task 1.15)**

```bash
cd /Users/robertolagos/dev/Operator-Surface && \
git add supabase/migrations/0007_connections.sql && \
git commit -m "feat(db): per-operator external tool connections"
```

---

## Task 1.14 — Migration: indexes + RLS

**Files:**
- Create: `supabase/migrations/0008_indexes_and_rls.sql`

- [ ] **Step 1: Write the migration**

```sql
-- ===== INDEXES =====
create index agent_runs_agent_started_idx
  on public.agent_runs (agent_id, started_at desc);
create index agent_runs_status_idx
  on public.agent_runs (status) where status = 'running';

create index decisions_run_idx
  on public.decisions (agent_run_id);
create index decisions_source_idx
  on public.decisions (source_record_type, source_record_id);
create index decisions_created_idx
  on public.decisions (created_at desc);

create index approvals_status_idx
  on public.approvals (status, created_at desc);
create index approvals_target_idx
  on public.approvals (target_record_type, target_record_id);
create index approvals_agent_idx
  on public.approvals (agent_id, created_at desc);

create index briefs_operator_date_idx
  on public.briefs (operator_id, brief_date desc);

create index connections_operator_idx
  on public.connections (operator_id);

-- ===== ROW LEVEL SECURITY =====
-- Service role bypasses RLS by default. These policies cover the
-- authenticated (anon JWT) path used by this app.

alter table public.agents       enable row level security;
alter table public.agent_runs   enable row level security;
alter table public.decisions    enable row level security;
alter table public.approvals    enable row level security;
alter table public.briefs       enable row level security;
alter table public.connections  enable row level security;

-- agents: anyone authenticated can read; only this app's UI flips `enabled`
create policy agents_read_authenticated on public.agents
  for select to authenticated using (true);
create policy agents_update_enabled on public.agents
  for update to authenticated using (true) with check (true);
-- NOTE: tightening the update policy to only allow `enabled` to change is
-- deferred to Task 3 when we add Auth + roles.

-- agent_runs: read-only for authenticated users; agents write via service role
create policy agent_runs_read_authenticated on public.agent_runs
  for select to authenticated using (true);

-- decisions: read-only for authenticated users
create policy decisions_read_authenticated on public.decisions
  for select to authenticated using (true);

-- approvals: any authenticated user can read and decide (v1).
create policy approvals_read_authenticated on public.approvals
  for select to authenticated using (true);
create policy approvals_decide_authenticated on public.approvals
  for update to authenticated
  using (true)
  with check (decided_by = auth.uid());

-- briefs: per-operator only
create policy briefs_select_own on public.briefs
  for select to authenticated using (operator_id = auth.uid());
create policy briefs_update_own on public.briefs
  for update to authenticated
  using (operator_id = auth.uid()) with check (operator_id = auth.uid());

-- connections: per-operator only
create policy connections_select_own on public.connections
  for select to authenticated using (operator_id = auth.uid());
create policy connections_update_own on public.connections
  for update to authenticated
  using (operator_id = auth.uid()) with check (operator_id = auth.uid());
create policy connections_insert_own on public.connections
  for insert to authenticated with check (operator_id = auth.uid());
create policy connections_delete_own on public.connections
  for delete to authenticated using (operator_id = auth.uid());
```

- [ ] **Step 2: Commit (apply happens in Task 1.15)**

```bash
cd /Users/robertolagos/dev/Operator-Surface && \
git add supabase/migrations/0008_indexes_and_rls.sql && \
git commit -m "feat(db): indexes and v1 RLS policies"
```

---

## Task 1.15 — Push migrations to hosted + generate TypeScript types

**Files:**
- Create: `src/lib/supabase/types.ts` (generated)
- Modify: `package.json` (add `db:types` and `db:push` scripts)

- [ ] **Step 1: Push all 8 migrations to the hosted project**

```bash
cd /Users/robertolagos/dev/Operator-Surface && supabase db push
```

Expected: "Applying migration 0001_enums_and_extensions.sql…" through "0008_indexes_and_rls.sql" then "Finished supabase db push." On error the migration that failed is named — fix the SQL, commit, and re-run.

- [ ] **Step 2: Add scripts to `package.json`**

```json
"scripts": {
  "db:push":  "supabase db push",
  "db:types": "supabase gen types typescript --linked --schema public > src/lib/supabase/types.ts"
}
```

- [ ] **Step 3: Generate types from the hosted schema**

```bash
cd /Users/robertolagos/dev/Operator-Surface && npm run db:types
```

Expected: writes `src/lib/supabase/types.ts` with `Database` plus per-table `Row` / `Insert` / `Update` types. File is ~150–250 lines.

- [ ] **Step 4: Commit**

```bash
cd /Users/robertolagos/dev/Operator-Surface && \
git add src/lib/supabase/types.ts package.json && \
git commit -m "chore(db): push schema to hosted Supabase + generate TS types"
```

---

## Task 1.16 — Supabase client modules

**Files:**
- Create: `src/lib/supabase/browser.ts`
- Create: `src/lib/supabase/server.ts`

- [ ] **Step 1: Install client + SSR helpers**

```bash
cd /Users/robertolagos/dev/Operator-Surface && \
npm install @supabase/supabase-js @supabase/ssr
```

- [ ] **Step 2: Write `src/lib/supabase/browser.ts`**

```ts
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

- [ ] **Step 3: Write `src/lib/supabase/server.ts`**

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        },
      },
    },
  );
}
```

- [ ] **Step 4: Commit**

```bash
cd /Users/robertolagos/dev/Operator-Surface && \
git add src/lib/supabase/browser.ts src/lib/supabase/server.ts package.json package-lock.json && \
git commit -m "feat(supabase): browser + server clients"
```

---

## Task 1.17 — `/api/health` route

**Files:**
- Create: `src/app/api/health/route.ts`

Why: smoke-tests that the Supabase client can reach the DB. We query `agents` (any table works; this one's empty so the response stays small).

- [ ] **Step 1: Write the route**

```ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { error, count } = await supabase
    .from("agents")
    .select("*", { count: "exact", head: true });

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true, agents: count ?? 0 });
}
```

Uses the `@/` import alias set up by `create-next-app --import-alias "@/*"` in Task 1.1.

- [ ] **Step 2: Verify**

```bash
cd /Users/robertolagos/dev/Operator-Surface && npm run dev
# in another shell:
curl -s http://localhost:3000/api/health
```

Expected: `{"ok":true,"agents":0}`.

- [ ] **Step 3: Commit**

```bash
cd /Users/robertolagos/dev/Operator-Surface && \
git add src/app/api/health/route.ts tsconfig.json && \
git commit -m "feat: /api/health verifies Supabase connection"
```

---

## Task 1.18 — Env example

**Files:**
- Create: `.env.example`

- [ ] **Step 1: Write `.env.example`**

```
# Supabase (hosted)
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from Supabase dashboard → Settings → API>

# DO NOT put SERVICE_ROLE_KEY in this app — it lives in the Hermes repo only.
```

- [ ] **Step 2: Create `.env.local` locally (not committed)**

Copy the project URL + anon key from the Supabase dashboard (Settings → API) into a new `.env.local` file. `.env.local` is gitignored by `create-next-app` by default.

- [ ] **Step 3: Commit**

```bash
cd /Users/robertolagos/dev/Operator-Surface && \
git add .env.example && \
git commit -m "chore: env example"
```

---

## Task 1.19 — README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write `README.md`**

```markdown
# Operator Surface

Web platform that shows operators what AI agents did, the reasoning behind
their decisions, and what's waiting on human approval. Pairs with the Hermes
agents repo over a shared Supabase database.

## Stack

Next.js 15 (App Router, TypeScript) · Tailwind · Supabase (Postgres) ·
Vercel

## Local dev

Prereqs: Node 20+, Supabase CLI, a Supabase project ref.

    npm install
    supabase login                              # one-time
    supabase link --project-ref <REF>           # one-time
    cp .env.example .env.local                  # then paste URL + anon key from Supabase dashboard
    npm run db:push                             # apply any new migrations to hosted DB
    npm run db:types                            # regenerate TS types after schema changes
    npm run dev                                 # http://localhost:3000

Smoke test the DB connection: `curl http://localhost:3000/api/health` →
`{"ok":true,"agents":0}`.

## Schema

The agent↔app contract lives in `supabase/migrations/`. JSONB column shapes
live in [`docs/schema-conventions.md`](docs/schema-conventions.md).

Tables:

- `agents` — registry + per-agent kill switch (`enabled`)
- `agent_runs` — append-only execution log
- `decisions` — agent judgments with confidence + signal trace
- `approvals` — proposed actions awaiting human review
- `briefs` — daily brief content per operator
- `connections` — external tool wiring per operator

Hermes writes via the service role key (in the Hermes repo). This app reads
everything and writes operator-scoped fields only: approval decisions, brief
view marks, connection toggles, agent kill switch.

## Design system

Source of truth: AI Ops OS design system (Mode.com retro-modern direction).
Tokens are in `src/styles/tokens.css` and mapped into Tailwind via
`tailwind.config.ts`. Runtime-needed token values mirrored in
`src/lib/design/tokens.ts`.
```

- [ ] **Step 2: Commit**

```bash
cd /Users/robertolagos/dev/Operator-Surface && \
git add README.md && \
git commit -m "docs: README with stack, local dev, schema overview"
```

---

## Self-review

- **Spec coverage:** every requested table has its own migration; every table has columns + types + FKs + comments. Tokens (colors / fonts / spacing) flow from the design system into Tailwind via CSS variables. Vercel deploy is intentionally deferred per scope.
- **Placeholder scan:** no TBDs. Every step includes the actual code or command.
- **Type consistency:** all enum names (`agent_status`, `agent_run_status`, `approval_status`, `connection_status`) are defined in 0001 and referenced verbatim in 0002–0007. `set_updated_at()` is defined once (in 0002) and reused in 0005/0006/0007.
- **Open questions deferred to the Decisions section above** rather than left in tasks.

---

## Execution handoff

After approval, two options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task with a review checkpoint between each. Better isolation, slower wall-clock.

**2. Inline Execution** — I run tasks in this session with batch checkpoints. Faster, more context bleed.

Which do you want? Or want to revise the plan first?
