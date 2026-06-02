# Figma build — the final alpha as a design / token / component system

Goal: a published Figma **Team Library** in the shared workspace that mirrors the shipped alpha 1:1 — Variables (= tokens), components (= the kit), and a Style Guide page. Build it to [`CONTRACT.md`](CONTRACT.md); names must match Storybook exactly (Supernova links design ↔ code by name).

> Why this is a human step: there is no Figma API for authoring components/variables — it happens in the Figma editor (token import is plugin-assisted). Everything that *feeds* it is ready: `operator-app/tokens/tokens.json` (DTCG), `CONTRACT.md`, and the live Storybook.

## 1. Variables (tokens) — via the Tokens Studio plugin
1. Figma → Plugins → **Tokens Studio for Figma**.
2. Import `operator-app/tokens/tokens.json` (DTCG format).
3. On the `color` collection create two **modes** — **light** and **dark** — mapping `color.light.*` / `color.dark.*`. `primitive.*`, `fontSize`, `radius`, `radiusBlade`, `shadow` are single-mode.
4. Sync → generates Figma Variables. Components then bind to Variables, so a mode switch = a theme switch (matches Storybook's toggle).

## 2. Components — to the CONTRACT inventory
Build each component in §2 of `CONTRACT.md` with the listed variants, **bound to Variables (no raw hex)**, named EXACTLY:
`Badge` (tone × dot × glow) · `StatusDot` (tone × pulse) · `Pill` (active) · `IntentChip` (Hot/Warm/Cold) · `MiniBar` (tone) · `IconTile` (tone) · `Kbd` · `Bubble` (human/agent/reasoning — leaf-blade radii 60/15) · `Button` (primary/ghost × sm/md/lg) · `PageHeader` (slots) · `Panel`.
Grammar holds in Figma too: color = signal, text = `foreground`, color always paired with a label (color-blind safety).

## 3. Style Guide page
One Figma page mirroring Storybook `Foundations/Overview` + the live `/styleguide`: the signal palette (both modes), the type scale (16px body), radii, and the component gallery. This is the design-side canon.

## 4. Publish
Publish as a **Team Library** in the shared workspace (so the team + Supernova can consume it). Turn on **Dev Mode**.

## Next → Supernova
Connect the published Figma library + the Chromatic-hosted Storybook in Supernova; it links them by name, documents the tokens, and hosts the team Portal. The Supernova MCP is already wired in the repo's `.mcp.json`.
