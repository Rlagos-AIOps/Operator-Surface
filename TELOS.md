# Ops Surfer — TELOS

> Product north star. **v1.0 — signed off by AK, 2026-06-03.** This is the "what it's for" that the design system, the agents, and the roadmap all serve. Structure follows the PAI TELOS frame (Mission · Problems · Goals · Strategies · Narratives · Challenges). The four open decisions are resolved at the bottom; the starred lines (★) carry AK's framing.

---

## What Ops Surfer is (one paragraph)

Ops Surfer is the **ops backend for people who run on clients** — agencies, consultancies, service providers, fractional operators. AI agents absorb the bolted-on manual work that platforms like **Wayfront (FKA Service Provider Pro / SPP)** make you do by hand: triaging inbound, scoping projects, pricing on ROI, drafting the reply, chasing the renewal. The operator stays human-on-the-loop — agents draft, the operator approves. The first surface is the **LinkedIn Inbound Triage** console. The interaction model is **chat-first with a multi-agent team**, not tables and ticket queues. It should feel like a command console that makes the operator feel powerful — and, increasingly, it should be a product the operator can **shape to their own business** without waiting on us.

---

## Missions

- **M0 — Absorb the platform tax.** ★ Give service operators an AI-run backend that does the manual "platform work" (triage, scoping, pricing, drafting, follow-up) instead of making them do it — so the operator spends time on judgment, not data entry.
- **M1 — Human-on-the-loop agentic service.** Make every client interaction agent-drafted and operator-approved by default. The operator is always in control; the agents are always working.
- **M2 — A product the customer can shape.** ★ Ship the operator surface as a **customizable, modular product** — every customer can re-skin it to their brand and recompose which agents/panels/surfaces run, without forking. The design system is a product capability, not an internal asset.

---

## Problems being solved

- **P0 — The bolted-on tax.** Service platforms (Wayfront/SPP) leave the operator doing the connective manual work by hand. The tooling tracks the work; it doesn't *do* it.
- **P1 — Generic SaaS fights the operator.** Tables, ticket queues, and CRM forms are built for managers, not operators. They overwhelm without empowering. An operator needs clear information and a feeling of command.
- **P2 — Agentic tools are black boxes.** Most "AI CS" hides the agent's reasoning and removes operator control. Trust requires seeing the draft and approving it.
- **P3 — Customers can't shape their SaaS.** ★ A service business has its own brand, voice, and workflow. Off-the-shelf SaaS forces them into ours. They need to customize and modularize the UX/UI/experience without engineering us.
- **P4 — Outcome-blind pricing.** Service work is priced on hours, not the value delivered. Operators leave money on the table because the tooling can't show ROI.

---

## Active Goals (2026)

- **G0 — Alpha operator console** (LinkedIn Inbound Triage): chat-first command console, multi-agent team, approve/revise/reject flow. *In progress.*
- **G1 — Design system as a product capability** ★: brand-token indirection (re-skin without forking) + a slot/config composition API + customizable agentic states. *Building now (this session).*
- **G2 — ROI-backed pricing surface**: price every engagement on outcomes, not hours; show the value chain.
- **G3 — Customer customization GA**: a customer onboards, re-brands, picks their agents/panels, and ships — self-serve.
- **G4 — The cohesive design pipeline**: single-source tokens → Figma → Storybook → Supernova portal → MCP → eng agents, drift-gated, so the product stays coherent as it scales.

---

## Strategies

- **S0 — Command console, not dashboard.** Chat-first, card/agent surfaces, dense-but-calm. The operator feels powerful; information is clear without overwhelm. (No tables/ticket queues.)
- **S1 — HOTL by construction.** Agents draft; the operator approves. Reasoning is visible (the dotted-lime "thinking" bubble). Control is never taken away.
- **S2 — Indirection over forking.** ★ Customers customize *through* a brand-token + composition layer, not by editing our code. The design system exposes the seams (tokens, slots, config) as the product's customization surface.
- **S3 — Compete on ROI, not feature lists.** Position against Wayfront/SPP on outcomes delivered. Pricing, reporting, and the pitch all lead with value.
- **S4 — Single source of truth, self-enforcing.** Code (globals.css) is canonical; every other artifact is a generated projection; CI gates (token drift + name parity) make coherence a rule, not a hope.
- **S5 — Designer gives the canvas; engineers wire the function.** The deliverable is the modular component library + design system; functionality is wired through it.

---

## Narratives

- **N0 — "Your command console."** Close-to-the-metal, engineering authority, retro-modern. You run your book of business from one powerful surface. (mode.com energy, not generic SaaS.)
- **N1 — "The agents absorb the busywork."** ★ You stopped doing triage, scoping, drafting, and chasing by hand. The team does it; you decide.
- **N2 — "Your SaaS, your shape."** ★ Re-skin it to your brand, choose your agents and panels, re-voice how failures and empties speak to *your* clients — without forking a line of code.
- **N3 — "Priced on what you deliver."** Outcome-based pricing baked into the product, so you charge for value, not hours.

---

## Challenges (what could go wrong)

- **C0 — Becoming generic SaaS.** The pull toward tables/queues/CRM-forms is constant. Resist it; stay a command console.
- **C1 — Losing the operator's trust.** If agents act without approval, or hide reasoning, the HOTL promise breaks.
- **C2 — Customization that overwhelms.** ★ "Complete freedom" must not become "assemble your own product from parts." The customization surface must be powerful *and* guided (presets, recipes, sane defaults).
- **C3 — The build-mirror trap.** ★ Shipping a design system that only mirrors our one product, instead of one customers can actually shape. (This is the exact gap the 2026-06-03 assessment named — G1 exists to close it.)
- **C4 — Drift at scale.** As Figma/Storybook/Supernova/customer-themes multiply, names and tokens drift and the bridge breaks. The CI gates (S4) exist to prevent this.

---

## North-star metric (signed off)

**Operator leverage** (leading) **+ net revenue retention** (lagging). Operator leverage = the share of client-facing work that is agent-drafted-and-operator-approved rather than hand-done, × the number of operators who have re-skinned/recomposed the product to their own business (M0 × M2: busywork absorbed × customers who made it theirs). Lead product decisions with leverage; report NRR to the business.

## Context filter

When steering Ops Surfer work, bias toward: the operator feeling powerful; agents working while humans decide; clarity without overwhelm; the customer's freedom to shape their own surface; outcomes over hours; one coherent, drift-free system.

---

## Decisions (signed off by AK · 2026-06-03)

_All four confirmed as recommended._

1. **M2 (customer-customization): near-term mission or later-era goal?**
   ✓ *Near-term mission.* It's foundational ("can't bolt on after components ship hardcoded") and is now *built* — the brand-token indirection + slot/config API shipped this session. Treating it as later-era would strand a capability you already have. Keep M2 as a standing mission; G3 (customer-customization GA) is its near-term goal.
2. **North-star metric: operator-leverage, or revenue/retention-led?**
   ✓ *Operator-leverage as the leading indicator, retention as the lagging business metric.* Leverage (busywork-absorbed × customers-who-made-it-theirs) predicts retention; lead with it for product decisions, report net revenue retention to the business. Don't pick one — pair them (leading + lagging).
3. **Sharpest ICP?**
   ✓ *Boutique agencies + fractional operators running client-success — the Wayfront/SPP switchers.* They feel the "platform tax" most acutely, value the operator-feels-powerful UX, and are small enough to self-serve the customization without an enterprise procurement cycle. Land here first; expand to larger service firms once G3 (customization GA) + roles/permissions exist.
4. **Name: "Ops Surfer" or "AI Ops OS"?**
   ✓ *Resolve to one — recommend "Ops Surfer"* (it's the name in active use across the app, repo root, and this telos; "AI Ops OS" survives only in the legacy `design-system/README.md` scaffold). This is your brand call, but the split is real drift worth closing — pick one and retire the other from the docs. (See [[ops-surfer-ds-process-gaps]]: the README is stale legacy.)

*Signed off 2026-06-03. A telos is living — reopen any line anytime.*
