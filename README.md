# Operator Surface

Web platform that shows operators what AI agents did, the reasoning behind
their decisions, and what's waiting on human approval. Pairs with the
Hermes (CSM agents) repo over a shared Supabase database.

> See [`project_state.md`](project_state.md) for the living state document
> and [`docs/schema-conventions.md`](docs/schema-conventions.md) for the
> JSONB shape contract between Hermes and this app.

## Stack

- Next.js 16.2 (App Router, TypeScript, Turbopack)
- Tailwind CSS v4 (design tokens via `@theme inline`)
- Supabase (hosted Postgres) — schema in `supabase/migrations/`
- Deployed to Vercel (later task)

## Local dev

Prereqs: Node 20+, [Supabase CLI](https://supabase.com/docs/guides/cli),
a Supabase project ref.

```bash
npm install
supabase login                                # one-time
supabase link --project-ref doggqkbphsqubpmlihio  # one-time
cp .env.example .env.local                    # then paste URL + anon key from Supabase dashboard
npm run dev                                   # http://localhost:3000
```

Smoke test the DB connection:

```bash
curl http://localhost:3000/api/health
# → {"ok":true,"agents":0}
```

## Database

The agent ↔ app contract lives in `supabase/migrations/`. To apply
schema changes:

```bash
npm run db:push      # apply new migration files to hosted DB
npm run db:types     # regenerate src/lib/supabase/types.ts from live schema
```

Tables:

- `agents` — registry + per-agent kill switch (`enabled`)
- `agent_runs` — append-only execution log
- `decisions` — agent judgments with confidence + signal trace
- `approvals` — proposed actions awaiting human review
- `briefs` — daily brief content per operator
- `connections` — external tool wiring per operator

Hermes writes via the service role key (stored in the Hermes repo, never
here). This app reads everything and writes operator-scoped fields only:
approval decisions, brief view marks, connection toggles, agent kill
switch.

## Design system

Source of truth: AI Ops OS design system (Mode.com retro-modern direction).
Design tokens live in [`src/styles/tokens.css`](src/styles/tokens.css) as
CSS variables, mapped to Tailwind utilities (`bg-bg`, `text-paper`,
`text-h1`, `rounded-bubble-l`, `shadow-e1`, …) in
[`src/app/globals.css`](src/app/globals.css) via `@theme inline`. Runtime
consumers can import the same values from
[`src/lib/design/tokens.ts`](src/lib/design/tokens.ts).

Signature elements:

- Deep emerald canvas (`#1E5631`), cream paper (`#F4F1E8`), lime CTA
  (`#D9E879`), volt for agent-active (`#C8F902`)
- DM Serif Display for H1/H2, Manrope for UI/body, JetBrains Mono for code
- Speech bubble shape: `60px 15px 60px 15px` (mirrored for agent replies)
- Lucide icons at 1.75px stroke
- Sentence case everywhere except UPPERCASE eyebrows with 0.14em tracking

## Project layout

```
.
├── docs/
│   ├── schema-conventions.md       # JSONB shape contract
│   └── superpowers/plans/          # implementation plans
├── project_state.md                # living state doc, phase status, CSM agent slugs
├── src/
│   ├── app/
│   │   ├── api/health/route.ts     # Supabase connectivity probe
│   │   ├── globals.css             # Tailwind v4 + @theme inline mapping
│   │   ├── layout.tsx              # fonts + html shell
│   │   └── page.tsx                # brand smoke page (throwaway)
│   ├── lib/
│   │   ├── design/tokens.ts        # runtime token mirror
│   │   └── supabase/
│   │       ├── browser.ts          # browser/client component client
│   │       ├── server.ts           # server component / route handler client
│   │       └── types.ts            # generated from live schema
│   └── styles/tokens.css           # source-of-truth design tokens
└── supabase/
    ├── config.toml                 # CLI config (project ref, linked)
    └── migrations/                 # 0001–0008
```

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Next.js dev server (Turbopack) on :3000 |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint |
| `npm run db:push` | Apply new migration files to hosted Supabase |
| `npm run db:types` | Regenerate `src/lib/supabase/types.ts` from live schema |
