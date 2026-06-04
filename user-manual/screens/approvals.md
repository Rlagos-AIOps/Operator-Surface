# Approval Queue — `/approvals`

The full list of pending and decided agent actions.

## Why this screen exists

The Operator console (`/operator`) is built for *triaging one item at a time* with full context. The Approval Queue is built for *seeing all approvals* — pending and decided — in one list. Same data, different view.

Use the Operator console when you're working through items. Use the Approval Queue when you want to scan, find a specific past decision, or get a sense of volume.

## What's on screen

### Header
A title plus any filter chips (pending / approved / rejected / expired). Pending is the default view.

### The list
Each approval shows as a card or row with:
- **Agent badge** — who proposed it (colored by agent: galileo=volt, hygiene-validator=warm, controlled-executor=good, etc.)
- **Action type** — `send_email`, `update_field`, `create_task`, `send_slack`
- **Risk badge** — low / med / high (luminous gray / yellow / red)
- **Status badge** — pending / approved / rejected / expired (luminous gray / green / red / muted)
- **Account name** — bolded, the customer
- **Target record** — Salesforce ID
- **Rationale** — the agent's case
- **Diff view** — current value vs. proposed value (or the drafted message)
- **Decision footer** — for decided items, when and what the operator noted

For pending items, the card includes Approve / Reject controls.

## What you can do here

| Action | How |
|---|---|
| **Scan all pending** | Default view. Just open the page. |
| **See your decision history** | Filter to approved or rejected. |
| **Open a specific item** | Click it (or use the Operator console for full triage context). |
| **Approve / reject from the list** | Use the buttons inline. (For high-risk items, use the Operator console — Galileo's right there.) |
| **Read the diff** | Each card shows current vs. proposed for field updates. |

## When to use this screen vs. the Operator console

| Use the Approval Queue when… | Use the Operator console when… |
|---|---|
| You want to see *all* approvals at once | You're triaging one item at a time |
| You're scanning for volume or trend | You need Galileo's read on a specific item |
| You're looking up a past decision | You want full context (queue + thread + Galileo) |
| You want to filter by status | You want the working cockpit |

Both write to the same database. Approving here approves everywhere.

## Tips

- **The decision-note shows here.** Notes you left when rejecting items appear in the decided list — useful for spotting patterns.
- **Counts can confirm momentum.** A queue that grew from 5 to 12 overnight tells you something even before you read individual items.
- **Use the Operator console for high-risk items.** Galileo's not on this screen.

## What this screen doesn't show

- **Galileo.** Use `/operator` or `/galileo` for the conversational copilot.
- **The agent's decision trace.** That's `/decisions`. Approvals reference decisions via `decision_id`, but the underlying signal traces live on the Decision Trace page.
- **Per-account portfolio context.** That's the Book.

## What to read next

- **Triage workflow** → [../workflows/triage-approvals.md](../workflows/triage-approvals.md)
- **The Operator console** → [operator-console.md](operator-console.md)
- **The Decision Trace** → [decisions.md](decisions.md)
