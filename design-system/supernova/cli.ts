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
  for (const e of structure as any[])
    console.log(
      `  • [${e.type ?? "?"}] "${e.title ?? e.name ?? "?"}" id=${e.id} pid=${e.persistentId} parent=${e.parentPersistentId ?? e.parentGroupId ?? e.parentId ?? "—"}`,
    );
  console.log("\nfirst entry keys:", Object.keys((structure as any[])[0] ?? {}).join(", "));
  console.log("first entry raw:\n" + JSON.stringify((structure as any[])[0], null, 2).slice(0, 900));
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

/** Dump the SDK's mocked block shapes so we know how to build page content. */
async function blocks() {
  const sdk = getSdk();
  try {
    const defs = sdk.documentation.getDocumentationMockedEditorBlockDefinitions() as any[];
    console.log(`block definitions (${defs.length}): ` + defs.map((d) => d.type ?? d.variantKey ?? d.key).filter(Boolean).slice(0, 40).join(", "));
    const textDef = defs.find((d) => /text|markdown/i.test(JSON.stringify(d.type ?? d.key ?? "")));
    console.log("\na text/markdown def raw:\n" + JSON.stringify(textDef ?? defs[0], null, 2).slice(0, 1100));
  } catch (e: any) {
    console.error("defs err:", e?.message ?? e);
  }
  try {
    const mock = sdk.documentation.getDocumentationMockedPageContent("x") as any[];
    console.log(`\nmocked page content (${mock.length} blocks). first block:\n` + JSON.stringify(mock[0], null, 2).slice(0, 1200));
  } catch (e: any) {
    console.error("mock err:", e?.message ?? e);
  }
}

/** Discover the exact create-page payload by asking the live API (creates + deletes one page). */
async function probe() {
  const { id } = await resolve();
  console.log("identifier:", JSON.stringify(id));
  try {
    const pageId = await getSdk().documentation.createDocumentationPage(id as any, {
      title: "PROBE — safe to delete",
    } as any);
    console.log(`✓ minimal {title} works → page ${pageId}. Deleting probe…`);
    try {
      await getSdk().documentation.deleteDocumentationPage(id as any, pageId);
      console.log("✓ probe deleted.");
    } catch (de: any) {
      console.error(`(probe page ${pageId} left — delete manually: ${de?.message ?? de})`);
    }
  } catch (e: any) {
    console.error("✗ create failed — full error:");
    try {
      console.error(JSON.stringify(e?.response?.data ?? e?.cause ?? e?.message ?? String(e), null, 2));
    } catch {
      console.error(String(e?.message ?? e));
    }
  }
}

// Brand principles (client-facing summaries, from the design language). The page
// header.description carries the summary; full long-form bodies live in `portal/`
// + GitHub and can be pasted into Supernova's editor (block bodies aren't a simple SDK write).
const BRAND_PAGES = [
  { title: "Overview — Ops Surfer", description: "Ops Surfer is the ops backend for people who run on clients — agencies, consultancies, fractional operators. AI agents absorb the manual 'platform tax' (triage, scoping, ROI pricing, drafting, follow-up); the operator stays human-on-the-loop. A chat-first command console, not tables and ticket queues." },
  { title: "Brand Voice", description: "Operator-to-operator. Engineering authority, retro-modern, confident — never corporate. DO: lead with the outcome and the ROI; the agent speaks first person ('I flagged 3 leads as cold'). DON'T: corporate jargon (synergy, solutions), servile chatbot tone, or emoji." },
  { title: "Graphic Language", description: "The wave mark + 'Ops Surfer' mono wordmark. Leaf-blade rounding (60/15 speech bubbles). Two-tone: warm translucent cream-paper over emerald, with a gold accent. mode.com retro-modern — close-to-the-metal, not generic SaaS." },
  { title: "Color = Signal (the grammar)", description: "Two rules govern everything: (1) color is a SIGNAL, never decoration — every accent means a status (good · hot · warm · cold · bad · pending); (2) text is ONE color (white/foreground) — the elements around it get colored. Motion is a signal too: calm by default, pulse only on real events." },
  { title: "Customization & White-label", description: "Customers re-skin the entire surface — both themes, every signal — by overriding the --brand-* DNA layer (a CSS override or <BrandProvider>), with no code fork. They recompose which panels/agents render. The design system is a product capability, not an internal asset." },
];

function portalPages() {
  if (!existsSync(PORTAL_DIR)) return [];
  return readdirSync(PORTAL_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => {
      const md = readFileSync(join(PORTAL_DIR, f), "utf8");
      const title = (md.match(/^#\s+(.+)$/m)?.[1] ?? f.replace(/\.md$/, "")).trim();
      const para =
        md
          .split("\n")
          .map((l) => l.trim())
          .find((l) => l && !l.startsWith("#") && !l.startsWith(">") && !l.startsWith("|") && !l.startsWith("```")) ?? "";
      return { title, description: para.replace(/\*\*/g, "").replace(/`/g, "").slice(0, 300) };
    });
}

/** Create the Ops Surfer docs group + brand-principle + portal pages (idempotent by title). */
async function mkdocs(commit: boolean) {
  const { sdk, id } = await resolve();
  const structure = (await sdk.documentation.getDocumentationStructure(id)) as any[];
  const root = structure.find((e) => e.isRoot) ?? structure.find((e) => e.type === "Group");
  const pages = [...BRAND_PAGES, ...portalPages()];
  console.log(`${commit ? "CREATE" : "DRY-RUN"} — "Ops Surfer — Brand & Design System" group + ${pages.length} pages (under root ${root?.persistentId})`);
  if (!commit) {
    for (const p of pages) console.log(`  • ${p.title}\n      ${p.description.slice(0, 130)}…`);
    console.log("\n(run with --commit to author into Supernova)");
    return;
  }
  let groupPid = structure.find((e) => e.type === "Group" && /Ops Surfer/i.test(e.title))?.persistentId;
  if (!groupPid) {
    groupPid = await sdk.documentation.createDocumentationGroup(id, {
      title: "Ops Surfer — Brand & Design System",
      parentPersistentId: root.persistentId,
    } as any);
    console.log(`  ✓ group → ${groupPid}`);
  } else {
    console.log(`  • group exists → ${groupPid}`);
  }
  const existing = new Set(structure.map((e) => e.title));
  for (const p of pages) {
    if (existing.has(p.title)) {
      console.log(`  • exists: ${p.title}`);
      continue;
    }
    try {
      const pid = await sdk.documentation.createDocumentationPage(id, {
        title: p.title,
        parentPersistentId: groupPid,
        configuration: { header: { description: p.description, alignment: "Left", backgroundImageScaleType: "AspectFill", foregroundColor: null, showBackgroundOverlay: false, minHeight: 0, showCoverText: true, backgroundImage: null, backgroundImageAssetId: null, backgroundImageAssetUrl: null } },
      } as any);
      console.log(`  ✓ ${p.title} → ${pid}`);
    } catch (e: any) {
      console.error(`  ✗ ${p.title}: ${(e?.message ?? String(e)).slice(0, 240)}`);
    }
  }
  console.log("\nDone. Publish in Supernova (or extend with sdk.documentation.publish). Page BODIES: paste the portal/*.md into each page's editor (block bodies aren't a simple SDK write).");
}

/** Publish the documentation so the portal is live/shareable. env defaults to "Live". */
async function publish() {
  const { sdk, id } = await resolve();
  const env = (process.argv[3] as any) ?? "Live";
  // NOTE: the older publish(id, env, isForcing) errors "Design system not found in the workspace" /
  // "Unsupported!" on this account — publishDrafts is the working endpoint (publishes all pending drafts).
  const build = (await sdk.documentation.publishDrafts(id as any, env, undefined as any, false)) as any;
  const url = await sdk.documentation.getDocumentationUrl(id as any).catch(() => null);
  console.log(`✓ publish (${env}) triggered: build ${build?.id}. Live URL: ${url ?? "(see Supernova UI)"}`);
}

/** Rename the design system. */
async function rename() {
  const { sdk } = await resolve();
  await sdk.designSystems.updateDesignSystemMetadata(DS_ID, "Ops Surfer — Design System");
  console.log('✓ renamed DS → "Ops Surfer — Design System"');
}

/** Runtime discovery: dump live components/tokens + the SDK method surface so we build writes against real shapes, not guesses. */
async function inspect() {
  const { sdk, id } = await resolve();
  const dump = (label: string, fn: () => string[]) => {
    try { const lines = fn(); console.log(`${label} (${lines.length}):`); for (const l of lines.slice(0, 40)) console.log("  • " + l); }
    catch (e: any) { console.log(`${label}: ERR ${e?.message ?? e}`); }
  };
  const proto = (o: any) => Object.getOwnPropertyNames(Object.getPrototypeOf(o)).filter((m) => m !== "constructor" && !m.startsWith("_")).join(", ");

  const dcs = (await sdk.components.getDesignComponents(id as any)) as any[];
  dump("DESIGN components (Figma)", () => dcs.map((d) => `${d.name}  id=${d.id} pid=${d.persistentId} group=${d.componentGroupId ?? d.groupId ?? "—"}`));
  const cs = (await sdk.components.getComponents(id as any)) as any[];
  dump("DS components (the ties)", () => cs.map((c) => `${c.name} id=${c.id} pid=${c.persistentId}`));
  try {
    const cgs = (await sdk.components.getComponentGroups(id as any)) as any[];
    console.log(`component groups (${cgs.length}): ` + cgs.map((g) => `${g.name}${g.isRoot ? "*" : ""}`).join(", "));
  } catch (e: any) { console.log("component groups: " + (e?.message ?? e) + " (components are a flat list — fine)"); }

  console.log("\nsdk.documentation methods:\n  " + proto(sdk.documentation));
  console.log("\nsdk.components methods:\n  " + proto(sdk.components));
  console.log("\nsdk.tokens methods:\n  " + proto(sdk.tokens));
  console.log("\nsdk.brands methods:\n  " + proto((sdk as any).brands));

  try {
    const toks = (await sdk.tokens.getTokens({ designSystemId: DS_ID, versionId: id.versionId } as any)) as any[];
    console.log(`\ntokens (${toks.length}). sample keys: ${Object.keys(toks[0] ?? {}).join(", ")}`);
    console.log("sample token:\n" + JSON.stringify(toks[0], null, 2).slice(0, 600));
    const themeFn = (sdk.tokens as any).getTokenThemes ?? (sdk.tokens as any).getThemes;
    if (themeFn) {
      const themes = (await themeFn.call(sdk.tokens, { designSystemId: DS_ID, versionId: id.versionId })) as any[];
      console.log(`\ntoken themes (${themes?.length ?? 0}): ` + (themes ?? []).map((t: any) => `${t.name}(${t.id})`).join(", "));
    } else console.log("\ntoken themes: no getTokenThemes/getThemes on sdk.tokens");
  } catch (e: any) { console.log("tokens/themes ERR: " + (e?.message ?? e)); }

  try {
    const brands = (await (sdk as any).brands.getBrands(id)) as any[];
    console.log(`\nbrands (${brands?.length ?? 0}): ` + (brands ?? []).map((b: any) => `${b.name}(${b.id})`).join(", "));
  } catch (e: any) { console.log("brands ERR: " + (e?.message ?? e)); }
}

// Canonical component registry (the name-parity source of truth) → Supernova DS components.
const REGISTRY = JSON.parse(readFileSync(join(import.meta.dir, "..", "component-registry.json"), "utf8"));
const COMP_DESC: Record<string, string> = {
  Badge: "Tonal status badge — color = signal (good/hot/warm/cold/bad/pending/muted), optional leading dot.",
  StatusDot: "Live status dot — tone-colored; pulses on active/errored events.",
  Pill: "Dashed filter pill — default / active states for filter rows.",
  IntentChip: "Lead-intent chip — Hot/Warm/Cold tier + 0–100 score.",
  MiniBar: "Compact proportional bar — tone-colored fill for temperature / score.",
  IconTile: "Tinted icon tile — surface background + tone-colored lucide glyph.",
  Kbd: "Keyboard key cap — mono, for ⌘K-style shortcut hints.",
  Bubble: "Leaf-blade speech bubble — human / agent / reasoning variants.",
  Button: "Primary (lime) / ghost (dashed) action — pill; sizes sm/md/lg. Code: BTN_PRIMARY / BTN_GHOST.",
  PageHeader: "Interior page header — eyebrow + display title + chips + right slot.",
  LiveSignage: "Agent-online pulse pill + mono run stamp.",
  Panel: "Dot-grid surface card — static / lift (clickable) states. Code: PANEL.",
};

/** Form the design↔code DS components from the registry (idempotent by name). */
async function tie(commit: boolean) {
  const { sdk, id } = await resolve();
  const brands = (await (sdk as any).brands.getBrands(id)) as any[];
  const brandId = brands?.[0]?.id;
  if (!brandId) throw new Error("no brand found");
  const existing = (await sdk.components.getComponents(id as any)) as any[];
  const have = new Set(existing.map((c) => c.name));
  const entries = [...REGISTRY.components, ...REGISTRY.uiComponents];
  console.log(`${commit ? "CREATE" : "DRY-RUN"} — ${entries.length} DS components (existing in DS: ${existing.length}) · brand ${brandId}`);
  let created = 0;
  for (const e of entries) {
    const desc = COMP_DESC[e.name] ?? `${e.name} — shadcn/base-ui primitive.`;
    const link = `Figma "${e.figma.name}" (${e.figma.nodeId}) · ${e.code.file} [${e.code.symbols.join(", ")}] · Storybook ${e.storybook}`;
    if (have.has(e.name)) { console.log(`  • exists: ${e.name}`); continue; }
    if (!commit) { console.log(`  • would create: ${e.name}\n      ${desc}\n      ↳ ${link}`); continue; }
    try {
      const local = sdk.components.createLocalComponent(id.versionId, brandId);
      local.name = e.name;
      local.description = `${desc}\n\n${link}`;
      const res = await sdk.components.createComponent(id as any, local);
      console.log(`  ✓ ${e.name} → ${res.id}`);
      created++;
    } catch (err: any) {
      console.error(`  ✗ ${e.name}: ${(err?.message ?? String(err)).slice(0, 220)}`);
    }
  }
  if (commit) console.log(`\nDone — ${created} created. Re-run \`inspect\` to confirm, then link each to its design component + Storybook in the Supernova UI (or via component detail).`);
}

// Supernova's default starter-template pages (clutter next to our authored portal). Deletions are restorable via restoreDocumentationPage.
const TEMPLATE_PAGE_PIDS: Array<[string, string]> = [
  ["6fb8d6a0-4bae-11ec-a0dd-9f8e86820f15", "Welcome!"],
  ["52eef460-4bad-11ec-8f5e-29e732ba669c", "Component overview"],
  ["293bf110-d480-11ed-911b-fb014ea4328e", "Component detail"],
  ["a8687860-4d3f-11ec-8ce5-cb0f56bcf344", "Typography (template)"],
  ["4a82edd0-4bae-11ec-a0dd-9f8e86820f15", "Design tokens (template)"],
];
async function cleanup(commit: boolean) {
  const { sdk, id } = await resolve();
  const structure = (await sdk.documentation.getDocumentationStructure(id)) as any[];
  const byPid = new Map(structure.map((e) => [e.persistentId, e]));
  console.log(`${commit ? "DELETE" : "DRY-RUN"} — ${TEMPLATE_PAGE_PIDS.length} default-template pages (restorable)`);
  for (const [pid, label] of TEMPLATE_PAGE_PIDS) {
    const e = byPid.get(pid) as any;
    if (!e) { console.log(`  • already gone: ${label}`); continue; }
    if (!commit) { console.log(`  • would delete: "${e.title}" (${pid})`); continue; }
    try { await sdk.documentation.deleteDocumentationPage(id as any, pid); console.log(`  ✓ deleted "${e.title}"`); }
    catch (err: any) { console.error(`  ✗ "${e.title}": ${(err?.message ?? String(err)).slice(0, 180)}`); }
  }
}

const cmd = process.argv[2] ?? "whoami";
const commit = process.argv.includes("--commit");
try {
  if (cmd === "probe") await probe();
  else if (cmd === "blocks") await blocks();
  else if (cmd === "mkdocs") await mkdocs(commit);
  else if (cmd === "publish") await publish();
  else if (cmd === "rename") await rename();
  else if (cmd === "whoami") await whoami();
  else if (cmd === "pull") await pull();
  else if (cmd === "inspect") await inspect();
  else if (cmd === "push-docs") await pushDocs(commit);
  else if (cmd === "tie") await tie(commit);
  else if (cmd === "cleanup") await cleanup(commit);
  else console.log("commands: whoami | pull | push-docs [--commit] | tie");
} catch (e: any) {
  console.error(`✗ ${e?.message ?? e}`);
  process.exit(1);
}
