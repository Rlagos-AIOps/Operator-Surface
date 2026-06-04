# Deep-dive an account

From a Book card to the reasoning behind every agent's verdict.

## Why this matters

Sometimes you don't want a summary — you want the receipts. *Why* does the team think Lighthouse is at-risk? What signals did they weigh? Where did each signal come from?

This workflow is the trust-but-verify path. You don't have to use it every day. You use it when something seems off, when you're prepping for a call where the agent's read matters, or when you want to learn how the team thinks.

## When you're here

A Book card caught your eye and you want to know more. Or a queue item smells wrong and you want to verify the case before approving. Or you're prepping for a customer conversation and want the full state of play.

## The path

### 1. Start on the Book

Open **Book** (`/accounts`) and find the account card you're curious about.

**Why start here:** The Book is the index. Every other surface is filtered to one slice of data; the Book ranks accounts side by side.

**What to read:**
- The verdict tag — `at_risk`, `recovering`, `data_conflict`, etc.
- The status dot color — your at-a-glance read.
- **Galileo's read** — his one-paragraph take, in his own voice.
- The pending-approvals chip — does the queue have something open on this account?

### 2. Go to Decision Trace

Click **Decisions** in the top nav. (URL: `/decisions`.)

**Why this screen:** The Decision Trace is every agent decision on every account, ordered by recency. It's where reasoning lives.

You can scroll, or filter to one account if the UI supports it. Find the recent decision(s) for the account you're investigating.

### 3. Read the reasoning

Each decision card shows:

| Field | What it tells you |
|---|---|
| **Agent** | Which agent made the call (Hygiene Validator, Galileo, etc.) |
| **Decision type** | `classify_at_risk`, `flag_data_gap`, `route_work`, etc. |
| **Verdict** | The label — `at_risk`, `watch`, `recovering`, etc. |
| **Confidence** | A 0.00–1.00 score. `null` means "no quantitative confidence" (e.g., for binary data-gap flags). |
| **Reasoning** | The agent's natural-language explanation. Read this first. |

Start with the reasoning. It's the agent's case in plain English. If the case makes sense, you're done. If it doesn't, dig further.

### 4. Read the signal trace

Below the reasoning, every decision shows its **signals** — the underlying data points that drove the verdict.

Each signal has:
- A **name** (`days_since_last_login`, `support_tickets_30d`, etc.)
- A **value** (62, 5, true)
- A **weight** (0.30, 0.25 — how much this signal counted)
- A **source** (`salesforce.account.Last_Login__c` — where the value came from)

This is the agent's math. If you disagree with the verdict, the signal trace is where you'll see why.

### 5. Cross-check with the source

If a signal value looks wrong, you can verify it directly in Salesforce — the source field is named. Tycho read it; you can re-read it.

This is the deepest level you'd normally go. Below it is "ask Galileo to re-score" or "talk to Roberto / your admin about the field."

## Common patterns this workflow surfaces

- **Confidence mismatch with the data.** Agent says 0.91 at-risk; you look and only one signal is loud. → The rubric (Euclid's domain) may need a tune.
- **Stale source data.** Agent uses `Last_Login__c` from 60 days ago that's no longer accurate. → Tycho's read isn't wrong; the Salesforce data is.
- **A signal you didn't know about.** *"What's `exec_sponsor_change_60d`? Where does that come from?"* → Read the source field, learn the team's vocabulary.
- **A reasoning chain you want to challenge.** *Galileo, the team scored Lighthouse 0.91 at-risk; is the reasoning still right today?* → Galileo will read the same trace and respond grounded.

## What you don't have to do

You don't have to verify every decision. The team produces more decisions than you can read. The deep-dive workflow is for when you have a specific reason — not as a daily habit.

## What to read next

- **Triage with this skill in hand** → [triage-approvals.md](triage-approvals.md)
- **Ask Galileo to interpret a trace** → [talk-to-galileo.md](talk-to-galileo.md)
- **Decision Trace screen** → [../screens/decisions.md](../screens/decisions.md)
- **The Book** → [../screens/the-book.md](../screens/the-book.md)
