# Operator Surface — Project State

Living state document for the Operator Surface web platform. Update with each session.

---

## What this is

A web platform that shows operators (Customer Success Managers) what AI agents
did, the reasoning behind their decisions, and what is waiting on human
approval before executing.

**This repo is the platform (web app) only.** The Hermes agents live in a
separate project. The two connect through a shared Supabase database:

```
┌───────────────┐  writes runs/decisions/approvals  ┌──────────────┐
│ Hermes agents │ ────────────────────────────────▶ │   Supabase   │
│ (separate)    │ ◀──────────────────────────────── │  (Postgres)  │
└───────────────┘  reads approval decisions, kill   └──────────────┘
                   switches, connection toggles            │ reads everything,
                                                           │ writes approvals,
                                                           ▼ brief views, etc.
                                                  ┌──────────────────┐
                                                  │ Operator Surface │
                                                  │  (this repo)     │
                                                  └──────────────────┘
```

---

## CSM agent slugs (v1 capability-based architecture)

Hermes runs five agents organized by **capability**, not by task. Galileo is
the orchestrator; the others are specialists with narrow, well-defined
permissions. This separation means the operator can read each agent's
authority surface ("can it write to Salesforce? can it touch external
systems at all?") at a glance.

| Slug | Role | Capabilities | External access |
|---|---|---|---|
| `galileo` | Orchestrator / supervisor | Routes work, gates approvals, assembles the daily brief | None directly — delegates |
| `sop-analyst` | SOP reasoning | Parses SOP library, builds checklists, compares accounts to policy | None — pure reasoning over policy docs |
| `sf-reader` | Salesforce read-only | Pulls accounts, opportunities, cases, activity history | Salesforce (read) |
| `hygiene-validator` | Data quality auditor | Detects missing fields, stale records, SOP gaps; flags issues | Salesforce (read), no writes |
| `controlled-executor` | Gated write executor | Updates fields, sends emails, creates tasks, posts Slack — **every action approval-gated** | Salesforce (write), Slack (write), Gmail (write) |

Earlier prototype slugs (`linkedin-triage`, `health-score-recomputer`,
`at-risk-triage`, etc.) are deprecated — do not reference them in seed
data, comments, or UI strings.

### `agents.metadata` keys to populate

Every seeded agent row populates `capabilities` and `example_tasks` in
metadata. See [`docs/schema-conventions.md`](docs/schema-conventions.md)
for the full convention.

---

## `agents.metadata` JSONB convention

The agent registry row's `metadata` JSONB is a free-form sidecar. Hermes writes
it; Operator Surface reads it. The full schema-side reference lives in
[`docs/schema-conventions.md`](docs/schema-conventions.md); this section is the
quick reference operators and Hermes maintainers should hit first.

### Recommended keys

All keys are optional. The DB does not enforce shape — these are the agreed
conventions between Hermes (writer) and Operator Surface (reader).

```jsonc
{
  // Agent code version (semver). Bump on any logic change.
  "version": "0.4.1",

  // Team or person owning the agent.
  "owner": "csm-platform",

  // Runtime identifier — language, runtime version, primary model.
  "runtime": "node-20+claude-sonnet-4.5",

  // Cron expression if the agent runs on a schedule. null if event-driven.
  "schedule": "0 9 * * 1-5",

  // Grouping tags. Used for filtering in the Connections / Agents UI.
  "tags": ["health", "renewals"],

  // Model configuration. Surfaced as a read-only block in the agent detail UI.
  "model": {
    "provider": "anthropic",
    "name": "claude-sonnet-4.5",
    "temperature": 0.2,
    "max_tokens": 4000
  },

  // When `agents.enabled` was last flipped off, why, and who did it.
  "kill_switch_reason": null,
  "last_disabled_at": null,
  "last_disabled_by": null
}
```

### Worked example — `at-risk-triage`

```json
{
  "version": "0.4.1",
  "owner": "csm-platform",
  "runtime": "node-20+claude-sonnet-4.5",
  "schedule": "0 9 * * 1-5",
  "tags": ["health", "renewals"],
  "model": {
    "provider": "anthropic",
    "name": "claude-sonnet-4.5",
    "temperature": 0.2,
    "max_tokens": 4000
  }
}
```

### Rules of the road

1. **Adding new optional keys is fine.** Removing or renaming existing keys is
   a breaking change — coordinate cross-repo before either.
2. **No secrets in metadata.** API keys, tokens, anything sensitive → Supabase
   Vault. `metadata` is read by operators in the UI.
3. **If it gets queried in SQL, promote it to a column.** Use the migration
   system, not JSONB squat.
4. **Update `metadata.version` whenever the agent's logic changes** so
   `agent_runs.metadata.version` (the per-run snapshot) can be correlated.

For the full conventions across all JSONB columns (`decisions.signals`,
`approvals.proposed_value`, `briefs.structured_data`, `connections.metadata`,
etc.), see [`docs/schema-conventions.md`](docs/schema-conventions.md).

---

## Phase status

### Phase 1 — Task 1: Scaffold + shared Supabase schema (in progress)

**Done:**
- Next.js 16.2 (App Router, TypeScript, Turbopack) scaffolded
- Tailwind v4 wired to the AI Ops OS design system via `@theme inline` in `src/app/globals.css`
- Source-of-truth design tokens in `src/styles/tokens.css` (colors, type, spacing, radii, shadows, motion)
- TypeScript tokens mirror in `src/lib/design/tokens.ts`
- Brand smoke page on `/` renders deep emerald + cream serif + lime accent
- Fonts: DM Serif Display + Manrope + JetBrains Mono via `next/font`
- Plan written to `docs/superpowers/plans/2026-05-27-scaffold-and-schema.md`
- Schema conventions documented in `docs/schema-conventions.md`

**Pending:**
- Supabase CLI install + link to hosted project `doggqkbphsqubpmlihio`
- Write 8 migration files (enums, agents, agent_runs, decisions, approvals, briefs, connections, indexes + RLS)
- Push migrations to hosted DB
- Generate TS types from schema
- Supabase client modules (browser + server)
- `/api/health` route
- `.env.example` + final README

### Deferred to later tasks
- **Task 2:** Vercel deploy + CI
- **Task 3:** Supabase Auth (Google OAuth) + sign-in UI
- **Task 4:** Seed data / fixtures for local dev against the hosted DB
- **Task 5+:** Daily Brief, Approval Queue, Decision Trace, Connections, Agents kill-switch UI

---

## Sessions

### Session 1 — 2026-05-27

- Initialized empty repo at `/Users/robertolagos/dev/Operator-Surface`
- Wrote `docs/superpowers/plans/2026-05-27-scaffold-and-schema.md`
- Wrote `docs/schema-conventions.md`
- Scaffolded Next.js 16.2 + Tailwind v4
- Wired design tokens + fonts
- Brand smoke page lands
- Started Task 1.6 (Supabase link) — pending CLI install
