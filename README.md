# Operator-Surface — AI Ops OS design home

The design + frontend home for the **AI Ops OS operator surface** (LinkedIn inbound-triage agent). The `design` branch is where design work is built and reviewed before it's wired into the product.

> Mode.com retro-modern · deep-emerald canvas · lime CTA · volt agent-active · DM Serif Display + Manrope.

## Layout

| Folder | What it is |
|---|---|
| `operator-app/` | Next.js 16 + Tailwind v4 + shadcn prototype. The operator surface (`/`), the **live styleguide** (`/styleguide`), **Storybook** (functional canon), and DTCG **tokens** (`tokens/tokens.json`). |
| `design-board/` | tldraw **agent board** — 3 sections (Shipped / Mood board / Build-review). Agents read & write the canvas; the in-app chat runs on **MiniMax**. Deploys to Cloudflare Workers for real-time team multiplayer. |
| `design-system/` | Source design system — tokens, type, assets, UI kit, reference screenshots. |
| `ISA.md` | System of record — ideal-state criteria, decisions, verification. |

## The canon (design **and** functionality)

- **Storybook** (`operator-app`) — functional canon: real, running components in every state.
- **Supernova** — design canon: import `operator-app/tokens/tokens.json` (DTCG) as the token source of truth.
- **Google Stitch** generates new screens from the styleguide → reviewed on the tldraw board → wired into `operator-app`.

## Run

```bash
# Operator app + styleguide
cd operator-app && bun install && bun run dev        # http://localhost:3000  (/styleguide for the canon)
cd operator-app && bun run storybook                  # Storybook

# tldraw agent board
cd design-board && cp .dev.vars.example .dev.vars      # add MINIMAX_API_KEY (or pull from Doppler)
bun install && bun run dev                             # http://localhost:5173
```

Agents (Claude Code sessions) operate the board on your subscription; the in-app chat panel uses MiniMax.
