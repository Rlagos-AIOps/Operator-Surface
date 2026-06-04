# Hub — `/`

The landing screen. A launcher with live counts.

## Why this screen exists

You land here when you open the platform. Three tiles give you the most common entry points at a glance — the Brief to read, the Approval Queue to act on, the Decision Trace to verify — each with a live count so you can decide where to go in two seconds.

It's a launcher, not a working surface. You won't spend time here; you'll pass through.

## What's on screen

### Hero
A short header — the platform name and a one-liner about what it does. Sets the tone.

### Three tiles
Each tile is a clickable card linking to a working surface, with a live metadata line:

| Tile | Goes to | Live count shown |
|---|---|---|
| **Daily Brief** | `/brief` | Latest brief date · viewed or not |
| **Approval Queue** | `/approvals` | Number of pending approvals |
| **Decision Trace** | `/decisions` | Total decisions logged |

The tiles use the PANEL surface (dot-grid texture, soft hairline, rounded corners). On hover they lift slightly.

### Demo-mode footer
A small one-line note about the operator scope (e.g., "Pre-auth demo. Scoped to taylor@example-csm.test.") — present while the platform is in pre-auth mode.

## What you can do here

| Action | How |
|---|---|
| **Open the Brief** | Click the Daily Brief tile. |
| **Open the queue** | Click the Approval Queue tile. |
| **Open the trace** | Click the Decision Trace tile. |

The top nav (Overview, Book, Operator, Galileo, Brief, Approvals, Decisions) gets you to every other surface from anywhere on the platform — the Hub's tiles are just the most-trafficked three.

## When to use this screen

- **Right after signing in.** It's where you land.
- **When you've forgotten what to do.** The tiles plus the nav give you every option.
- **As a quick gut-check on volume.** The pending-approvals count is visible at a glance.

## Tips

- **The counts are live.** They update from Supabase on every page load — not a snapshot.
- **The nav has more.** The three tiles aren't an exhaustive map — the Book, Operator, and Galileo are nav-only links from here.
- **Don't camp here.** It's a launcher. Once you know where you're going, click and move on.

## What this screen doesn't show

- **Per-account portfolio context.** That's the Book.
- **The live operator console.** That's `/operator`.
- **The conversational front door.** That's `/galileo`.

## What to read next

- **First-time experience** → [../quick-start.md](../quick-start.md)
- **The Book** → [the-book.md](the-book.md)
- **The Operator console** → [operator-console.md](operator-console.md)
