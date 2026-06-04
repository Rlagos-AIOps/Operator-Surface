# Operator console — `/operator`

Your daily cockpit. Where the work happens.

## Why this screen exists

Most of the platform tells you *what* to look at. The Operator console is *where you act* — the queue, the agent's draft in front of you, Galileo at your side.

It's a three-panel layout because triage has three parts: **what to look at**, **what to decide on**, and **who to ask**. Putting all three on one screen means you stay in flow instead of bouncing between tabs.

This is where you'll spend most of your time on the platform.

## What's on screen

### Left panel — the queue
A list of every pending (and recently decided) approval, sorted by attention needed. Each row shows:
- **Account name** (top)
- **Action type** — `send_email`, `update_field`, `create_task`, `send_slack`
- **Risk indicator** — colored chip
- **A one-line preview** of what the agent wants to do

The currently selected row is highlighted.

### Center panel — thread + composer
Two sections stacked.

**Top — the thread.** The agent's full rationale, the linked decision's reasoning, account/target metadata. This is the *case* for the proposed action.

**Bottom — the composer.** The actual draft.
- For an **email**: the body, editable.
- For a **field update**: the proposed value vs. the current value.
- For a **task**: subject, owner, due date.

Below the composer: **Approve & send** and **Reject** buttons.

### Right panel — Galileo
The conversational copilot, **locked to the selected lead's account**. The account name shows in the panel header.

This is the same Galileo as the standalone `/galileo` page — embedded here so you don't have to leave the queue to ask a question.

Switching to a different lead in the queue *resets the Galileo conversation* to the new account. Old threads aren't lost (they're stored), but they're not displayed.

## What you can do here

| Action | How |
|---|---|
| **Pick something to work on** | Click a row in the left queue. |
| **Read why an agent proposed something** | Read the thread (center, top). |
| **Edit the draft before sending** | Click into the composer text (for emails). |
| **Approve** | Click **Approve & send**. Customer-facing — this is real. |
| **Reject** | Click **Reject**. The action dies. Add a note to teach the team. |
| **Ask Galileo a question** | Type in the right panel. Wait 30–90s for advice. |
| **Switch focus** | Click a different queue row. Composer + Galileo both re-scope. |

## When to use this screen

- Every triage session. This is the home of triage.
- When you want to act on one specific item rather than scan the whole book.
- When you need Galileo's read on a specific account-and-action combination.

## Tips

- **Edit before approving on emails.** Bell's drafts save you from a blank page — sign your name on them.
- **Reject with a one-line note.** *"Already handled offline"* is enough; the team learns from it.
- **Don't try to clear the queue.** One good decision is a successful session.
- **High-risk items deserve Galileo.** Low-risk save-plan updates usually don't.
- **The page won't scroll on you.** Chat scrolls only its own panel; sending a question doesn't yank the page. (If it ever does, that's a bug — flag it.)

## What this screen doesn't show

- **History.** Past approvals are in the Approval Queue (`/approvals`) — this view is biased toward what needs attention now.
- **Account context across the book.** That lives on the Book (`/accounts`). Use the Book for portfolio scans; use this screen for one-item decisions.
- **The Daily Brief synthesis.** Read the Brief (`/brief`) for that.

## What to read next

- **The triage workflow** → [../workflows/triage-approvals.md](../workflows/triage-approvals.md)
- **Talking to Galileo** → [../workflows/talk-to-galileo.md](../workflows/talk-to-galileo.md)
- **The Book** → [the-book.md](the-book.md)
- **The standalone Galileo page** → [galileo.md](galileo.md)
