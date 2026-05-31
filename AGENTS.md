# Operator-Surface (design branch)

AI Ops OS operator surface — the design + frontend home. This branch is a small
monorepo of three independent parts. There is **no shared workspace install**:
each part keeps its own `bun.lock` and installs on its own. The root
`package.json` only adds convenience scripts that delegate into the subprojects.

## Layout

| Path | What it is | Installable |
|---|---|---|
| `operator-app/` | Next.js 16 + Tailwind v4 + shadcn prototype: operator surface (`/`), live styleguide (`/styleguide`), Storybook (functional canon), DTCG tokens (`tokens/tokens.json`). Has its own `AGENTS.md` / `CLAUDE.md`. | yes (`ai-ops-os`) |
| `design-board/` | tldraw agent board — client + Cloudflare Worker. In-app chat runs on MiniMax; agents read/write the canvas. | yes (`tldraw-agent`) |
| `design-system/` | Source design system — tokens, type, assets, UI kit, reference screenshots. | no (source only) |
| `ISA.md` | System of record — ideal-state criteria, decisions, verification. | — |

## Rules

- **bun only** — never npm / npx (zero exceptions).
- TypeScript, strict.
- Secrets are per-subproject and never committed: copy `design-board/.dev.vars.example`
  → `design-board/.dev.vars` and set `MINIMAX_API_KEY`. `.dev.vars` / `.env*` are gitignored.

## Commands (from repo root)

```bash
bun run setup        # install operator-app + design-board
bun run dev          # operator app + styleguide  -> http://localhost:3000
bun run storybook    # Storybook (functional canon)
bun run dev:board    # tldraw agent board         -> http://localhost:5173
bun run build        # build the operator app
```

Per-subproject commands still work by `cd`-ing into the folder (see each subproject's README).
