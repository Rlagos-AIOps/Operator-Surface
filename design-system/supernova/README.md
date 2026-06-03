# Supernova SDK tool (write-capable)

The Supernova **MCP** is read-only (it streams the design system *into* an AI agent). This tool is the **write** path — it authors *into* Supernova (docs pages, component ties, tokens) via the official [`@supernovaio/sdk`](https://www.npmjs.com/package/@supernovaio/sdk), which the MCP can't. Code Connect is off for this account, so this SDK + the name-parity gate are the design↔code automation path.

## Auth — Personal Access Token (never hardcoded)

Generate a PAT in Supernova (**Profile → Authentication → API keys**), then expose it via env — **don't commit it**:

```bash
# Doppler (preferred)
doppler secrets set SUPERNOVA_API_TOKEN=…
doppler run -- bun cli.ts whoami

# or local
export SUPERNOVA_API_TOKEN=…
bun cli.ts whoami
```

DS id defaults to `823274` (Ops Surfer / akhaus / Brand); override with `SUPERNOVA_DS_ID`.

## Commands

| Command | What | Needs token |
|---|---|---|
| `bun cli.ts whoami` | connect + verify (user · workspace · DS · version · counts) | yes |
| `bun cli.ts pull` | dump live docs structure | yes |
| `bun cli.ts push-docs` | **dry-run** — list the `portal/*.md` that would be authored | no |
| `bun cli.ts push-docs --commit` | author the portal docs as Supernova pages | yes |
| `bun cli.ts tie` | scaffold: form design↔code component ties | — |

Reads/dry-run are verified. The first `--commit` run validates the exact `createDocumentationPage` payload (block shape) against the live API — refine the markdown→block mapping from its response. `tie` is a scaffold: build `Component` objects from `design-system/component-registry.json` (Figma node + code symbol) via `sdk.components.createComponent()`.

`node_modules/` is gitignored; `cli.ts` + `package.json` + lockfile are committed.
