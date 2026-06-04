# The Book — `/accounts`

Your portfolio in one view.

## Why this screen exists

You can't manage what you can't see. Most of the platform shows you *one slice* at a time — one decision, one approval, one conversation. The Book is the opposite: every account in your portfolio, ranked by attention needed, side by side.

Open the Book in the morning, scan for color, and you know within seconds where to spend your day.

## What's on screen

### Header — the summary
A single line at the top:
- **Account count** — how many accounts are in your portfolio
- **Total ARR** — book value
- **Need attention** — how many cards are red or orange
- **Pending approvals** — how many items are waiting on you

This is your morning headline.

### Below the header — the account grid
A card per account, sorted **by attention needed** (most urgent first). Each card shows:

| Element | What it tells you |
|---|---|
| **Account name** | The customer |
| **Segment + ARR** | SMB / MM / Enterprise + annual value |
| **Verdict tag** | The most recent agent verdict: `at_risk`, `recovering`, `data_conflict`, `upsell_qualified`, etc. |
| **Status dot** | Color-coded — red, orange, yellow, blue, green, pending |
| **Pending chip** | If approvals are waiting on you for this account |
| **Galileo's read** | A short paragraph in Galileo's voice — his take on the account |
| **Decision count** | How many agent decisions this account carries |

The cards are ordered so that the accounts you'd *want* to look at first are literally at the top. Trust the order.

## What you can do here

| Action | How |
|---|---|
| **See your whole book** | Scroll the grid. |
| **Spot what needs attention** | Look for red and orange dots near the top. |
| **Read an agent's take** | Read the Galileo's read paragraph on each card. |
| **Drill into an account** | Currently, by going to Decisions or Operator and filtering — direct deep-link is a follow-up. |

## When to use this screen

- **Every morning.** First or second stop in the daily routine.
- **Before a customer call** — quickest way to remind yourself where things stand.
- **When you want to compare accounts** — what's the spread? Who's recovering, who's slipping?
- **When prepping a weekly review** — the Book *is* the portfolio summary.

## How to read the colors

- 🔴 **Red dot** — at-risk. Real trouble.
- 🟠 **Orange dot** — urgent. Priority high.
- 🟡 **Yellow dot** — caution / hygiene gap.
- 🔵 **Blue dot** — informational / routing.
- 🟢 **Green dot** — working, recovering, upsell.
- ⚪ **Pending dot** — queue item open.

See [concepts.md](../concepts.md) for the full color vocabulary.

## Tips

- **Galileo's read is opinionated.** It's not neutral summary — it's his take. Read it, but feel free to disagree and drill in.
- **A pulsing dot means "urgent now."** Red and orange dots pulse; others don't.
- **The Book sorts by attention severity, then by ARR.** A $30k SMB in trouble outranks a $180k Enterprise that's healthy.
- **"Need attention" counts only red + orange.** Yellow watch items aren't there because they're not urgent today.

## What this screen doesn't show

- **The reasoning behind each verdict.** That's the Decision Trace (`/decisions`).
- **The specific actions waiting on you.** That's the Operator console (`/operator`) or Approval Queue (`/approvals`).
- **Historical trends.** Today's Book is today's snapshot.

## What to read next

- **Trust-but-verify a verdict** → [../workflows/deep-dive-account.md](../workflows/deep-dive-account.md)
- **Triage a pending item** → [../workflows/triage-approvals.md](../workflows/triage-approvals.md)
- **The Decision Trace** → [decisions.md](decisions.md)
- **The Operator console** → [operator-console.md](operator-console.md)
