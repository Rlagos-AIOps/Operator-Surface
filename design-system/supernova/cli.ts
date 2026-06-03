#!/usr/bin/env bun
/**
 * Ops Surfer ⇄ Supernova — WRITE-capable SDK tool.
 *
 * The Supernova MCP (the other tool in this stack) is READ-ONLY — it streams the
 * design system INTO an AI agent. This tool is the inverse: it WRITES into Supernova
 * (docs pages, component ties, tokens) via the official `@supernovaio/sdk`, which the
 * MCP cannot. Code Connect is off for this account (see the ops-surfer-figma-codeconnect
 * memory), so this SDK + the name-parity gate are the design↔code automation path.
 *
 * Auth: a Personal Access Token in env as SUPERNOVA_API_TOKEN — NEVER hardcoded/committed.
 *   Doppler:  doppler run -- bun cli.ts whoami
 *   local:    export SUPERNOVA_API_TOKEN=…  &&  bun cli.ts whoami
 *
 * Commands:
 *   whoami               connect + verify (user · workspace · DS · version · counts)  [read · token]
 *   pull                 dump the live DS state (docs structure)                      [read · token]
 *   push-docs            list portal docs that WOULD be authored                      [dry-run · no token]
 *   push-docs --commit   author design-system/portal/*.md as Supernova doc pages      [WRITE · token]
 *   tie                  scaffold: form design↔code component ties                    [scaffold]
 *
 * The first --commit run validates the exact payload shape against the live API —
 * refine the block mapping from its response.
 */
import { Supernova } from "@supernovaio/sdk";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const DS_ID = process.env.SUPERNOVA_DS_ID ?? "823274"; // Ops Surfer DS (akhaus / Brand)
const PORTAL_DIR = join(import.meta.dir, "..", "portal");

function setupMsg() {
  return [
    "✗ SUPERNOVA_API_TOKEN not set.",
    "",
    "Generate a Personal Access Token in Supernova (Profile → Authentication → API keys),",
    "then expose it WITHOUT committing it:",
    "  • Doppler:  doppler secrets set SUPERNOVA_API_TOKEN=…   →  doppler run -- bun cli.ts whoami",
    "  • local:    export SUPERNOVA_API_TOKEN=…                →  bun cli.ts whoami",
    `DS id defaults to ${DS_ID} (override with SUPERNOVA_DS_ID).`,
  ].join("\n");
}

let _sdk: Supernova | null = null;
function getSdk(): Supernova {
  if (_sdk) return _sdk;
  const token = process.env.SUPERNOVA_API_TOKEN;
  if (!token) {
    console.error(setupMsg());
    process.exit(1);
  }
  _sdk = new Supernova(token);
  return _sdk;
}

/** Resolve the {workspaceId, designSystemId, versionId} identifier the read/write APIs need. */
async function resolve() {
  const sdk = getSdk();
  const me = await sdk.me.me();
  const ds = await sdk.designSystems.designSystem(DS_ID);
  if (!ds) throw new Error(`Design system ${DS_ID} not found for this token.`);
  const workspaceId =
    (ds as any).workspaceId ?? (await sdk.workspaces.workspaces((me as any).id))?.[0]?.id;
  const version = await sdk.versions.getActiveVersion(DS_ID);
  if (!version) throw new Error(`No active version for DS ${DS_ID}.`);
  const id = { workspaceId, designSystemId: DS_ID, versionId: (version as any).id };
  return { sdk, me, ds, version, id };
}

async function whoami() {
  const { sdk, me, ds, version, id } = await resolve();
  let docs = -1;
  let tokens = -1;
  try {
    docs = (await sdk.documentation.getDocumentationStructure(id)).length;
  } catch {}
  try {
    tokens = (await sdk.tokens.getTokens({ designSystemId: DS_ID, versionId: id.versionId })).length;
  } catch {}
  const who = (me as any).email ?? (me as any).name ?? (me as any).id;
  console.log(`✓ Connected to Supernova as ${who}`);
  console.log(`  Workspace : ${id.workspaceId}`);
  console.log(`  DS        : ${(ds as any).name} (${DS_ID})`);
  console.log(`  Version   : ${(version as any).name ?? id.versionId} (${id.versionId})`);
  console.log(`  Docs      : ${docs < 0 ? "n/a" : docs} top-level structure entries`);
  console.log(`  Tokens    : ${tokens < 0 ? "n/a" : tokens}`);
  console.log(
    "  Write surface: sdk.documentation.createDocumentationPage() · sdk.components.createComponent() · sdk.tokens.* (all read+write).",
  );
}

async function pull() {
  const { sdk, id } = await resolve();
  const structure = await sdk.documentation.getDocumentationStructure(id);
  console.log(`Docs structure (${structure.length}):`);
  for (const e of structure as any[]) console.log(`  • [${e.type ?? "?"}] ${e.title ?? e.name ?? e.id}`);
}

async function pushDocs(commit: boolean) {
  if (!existsSync(PORTAL_DIR)) throw new Error(`Portal dir missing: ${PORTAL_DIR}`);
  const files = readdirSync(PORTAL_DIR).filter((f) => f.endsWith(".md")).sort();
  const id = commit ? (await resolve()).id : null;
  console.log(`${commit ? "PUSH" : "DRY-RUN"} — ${files.length} portal docs → Supernova DS ${DS_ID}`);
  for (const f of files) {
    const md = readFileSync(join(PORTAL_DIR, f), "utf8");
    const title = (md.match(/^#\s+(.+)$/m)?.[1] ?? f.replace(/\.md$/, "")).trim();
    if (!commit) {
      console.log(`  • would create page: "${title}"  (${md.length} chars · ${f})`);
      continue;
    }
    try {
      // First --commit run validates DTOCreateDocumentationPageInputV2's exact shape
      // (title + block content). Build the block tree from `md` per the API response.
      const pageId = await getSdk().documentation.createDocumentationPage(id as any, { title } as any);
      console.log(`  ✓ "${title}" → ${pageId}`);
    } catch (e: any) {
      console.error(`  ✗ "${title}": ${e?.message ?? e}`);
      console.error("    ↳ first --commit run reveals the required payload — refine the block mapping, re-run.");
    }
  }
  if (commit) console.log("Then publish via the Supernova UI or extend this tool with sdk.documentation.publish().");
}

const cmd = process.argv[2] ?? "whoami";
const commit = process.argv.includes("--commit");
try {
  if (cmd === "whoami") await whoami();
  else if (cmd === "pull") await pull();
  else if (cmd === "push-docs") await pushDocs(commit);
  else if (cmd === "tie")
    console.log(
      "tie (scaffold): form design↔code design-system components via sdk.components.createComponent(to, component).\n" +
        "Map each registry entry (design-system/component-registry.json) → a Supernova component linking its Figma node + code symbol.\n" +
        "Build the Component objects here after a validated whoami; see the project CLAUDE.md.",
    );
  else console.log("commands: whoami | pull | push-docs [--commit] | tie");
} catch (e: any) {
  console.error(`✗ ${e?.message ?? e}`);
  process.exit(1);
}
