---
name: ai-ops-os-design
description: Use this skill to generate well-branded interfaces and assets for AI Ops OS (an AI Operations Consultant OS — client CRM, project scoping, ROI pricing, multi-agent delivery, and the LinkedIn Inbound Triage Agent operator surface), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping in the Mode.com Retro-Modern direction.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

Key files:
- `README.md` — voice, content fundamentals, visual foundations, iconography, substitutions
- `colors_and_type.css` — all design tokens (colors, type, spacing, radii, shadows, motion)
- `assets/` — logo.svg, mark.svg, agent-avatar.svg
- `preview/` — token preview cards
- `ui_kits/ai-ops-os/` — operator-surface UI kit (Sidebar, TopBar, LeadQueue, ThreadView, Composer, MetricCard)

Signature elements to honor:
- Deep emerald canvas (#1E5631), cream paper surfaces (#F4F1E8), lime CTA (#D9E879), volt for agent-active (#C8F902)
- Speech bubbles with `border-radius: 60px 15px 60px 15px` (mirrored for right-aligned agent replies)
- Three bubble variants: human (paper bg) / agent (lime→volt gradient) / agent-reasoning (transparent + dotted lime border)
- Display serif: DM Serif Display (sub for Grenette). UI sans: Manrope (sub for Graphik).
- Tabular figures for all numerics. Sentence case everywhere except eyebrows (UPPERCASE + 0.14em tracking).
- Lucide icons at 1.75px stroke. No emoji. No bluish-purple gradients. No stock illustrations.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
