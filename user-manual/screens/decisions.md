# Decision Trace — `/decisions`

Every agent decision, with its reasoning, signals, and sources.

## Why this screen exists

The agents don't ask for blind trust. They show their work. The Decision Trace is the surface where every agent verdict — every `at_risk`, every `watch`, every `recovering` — lives alongside the reasoning that produced it, the signals that weighted it, and the sources those signals came from.

You don't read this every day. You read it when something seems off, when you're prepping for a call where the agent's read matters, or when you want to learn how the team thinks.

## What's on screen

### Header
A title plus filter controls (by agent, by decision type, by label/verdict — depending on the build).

### The list
Each decision card shows:

| Element | What it tells you |
|---|---|
| **Agent badge** | Which agent made the call — Hygiene Validator, Galileo, Controlled Executor, etc. |
| **Decision type** | `classify_at_risk`, `flag_data_gap`, `route_work`, `recompute_health_band`, `classify_renewal_risk` |
| **Account name** | The customer in question |
| **Verdict (label)** | The output — `at_risk`, `watch`, `recovering`, `data_conflict`, `priority_high`, etc. (colored by the signal grammar) |
| **Confidence meter** | A 0.00–1.00 score with a visual bar. `null` confidence = "no quantitative score" (typical for binary data-gap flags). |
| **Reasoning** | The agent's natural-language explanation. **Read this first.** |
| **Signal trace** | The underlying data points (name, value, weight, source) |
| **Source run footer** | The agent_run that produced the decision — input summary, status, timestamp |

## How to read a decision

### Read the reasoning first
The agent makes a case in plain English. If the case holds, you're done. If it doesn't, dig further.

### Then the signals
Each signal has:
- **name** (`days_since_last_login`, `support_tickets_30d`)
- **value** (62, 5, true, null)
- **weight** (0.30, 0.25 — how much this signal mattered)
- **source** (`salesforce.account.Last_Login__c` — where the value came from)

This is the agent's math. If you disagree with the verdict, the signal trace is where you'll see why.

### Cross-check the source if needed
The signal `source` is named in the trace. If a value looks wrong, you can verify it directly in Salesforce — Tycho read it; you can re-read it.

## What you can do here

| Action | How |
|---|---|
| **Scan recent decisions** | Default view, ordered by recency. |
| **Filter by agent** | Use the filter chips. |
| **Filter by verdict** | Filter chips for label types. |
| **Read full reasoning** | Click into the card; the reasoning is the body of each card. |
| **Inspect signals** | Each decision card includes the full signal trace. |

The Decision Trace is **read-only**. You don't decide here; you decide on the Operator console.

## When to use this screen

- **When a queue item smells wrong.** Verify the case before approving.
- **When prepping for a customer call.** Get the full state of play behind the team's verdict.
- **When something on the Book confused you.** Why does Lighthouse say `recovering`? Find the decision behind it.
- **When you're explaining the platform.** The Decision Trace is the proof of trust-but-verify.

## Tips

- **Confidence is the agent's stakes-read, not the truth.** A 0.91 at-risk decision can still be wrong; check the signals.
- **`null` confidence isn't a missing number.** It means "we flagged a binary condition, no probability applies" — usually for data-gap flags.
- **Reasoning is the fastest path.** If the prose holds up to common sense, the math probably does too.
- **Ask Galileo to interpret a trace.** Copy the decision summary and paste it into the chat — *"Walk me through this Lighthouse at-risk verdict"* — he'll explain it back.

## What this screen doesn't show

- **Actions waiting on you.** Approvals are at `/approvals` or `/operator`.
- **Portfolio context.** That's the Book.
- **Galileo.** Use `/galileo` or the Operator console's right panel.

## What to read next

- **Trust-but-verify workflow** → [../workflows/deep-dive-account.md](../workflows/deep-dive-account.md)
- **Ask Galileo to interpret** → [../workflows/talk-to-galileo.md](../workflows/talk-to-galileo.md)
- **The Book** → [the-book.md](the-book.md)
- **The Approval Queue** → [approvals.md](approvals.md)
