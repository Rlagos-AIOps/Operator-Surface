# Fonts

Webfonts are loaded from Google Fonts CDN via `@import` at the top of `colors_and_type.css`.

## In use

| Role | Family | Source |
| --- | --- | --- |
| Display / headers | `DM Serif Display` | Google Fonts |
| UI / body | `Manrope` | Google Fonts |
| Mono | `JetBrains Mono` | system / Google Fonts fallback |

## Substitutions flagged

The brand spec calls for **Grenette** (display) and **Graphik** (UI). These are commercial faces — not provided. We've substituted the closest free Google Fonts equivalents:

- **Grenette → DM Serif Display.** Both are high-contrast retro display serifs. DM Serif Display has slightly heavier verticals; tracking has been tightened (`-0.035em`) to compensate.
- **Graphik → Manrope.** Both are geometric grotesques with similar x-height. Manrope is variable; we use 400/500/600/700/800.

If you license Grenette/Graphik, drop `.woff2` files in this folder and replace the `@import` in `colors_and_type.css` with `@font-face` declarations.
