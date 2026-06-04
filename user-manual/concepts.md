# Concepts

The mental model behind the platform. Read this once — every other page in the manual leans on it.

## Why we built it this way

You drown in signals. Salesforce, Slack, support tickets, calendar, email — the data exists, but turning it into the right next action eats most of your week. The Operator Surface is built on a simple bet: **a team of specialized AI agents can watch all those signals for you and put a well-reasoned draft in front of you to decide on.** The agents do the watching. You do the deciding.

That bet has two consequences worth understanding upfront:

1. **You will see drafts, not actions.** Every customer-facing move waits for you. Nothing surprises a customer.
2. **You will see *why*, not just *what*.** Every agent decision shows its reasoning, its signals, and its sources. You can trust as much or as little as you want — the work is in the open.

The rest of this page explains the team, the colors, the bright line, and how it all connects.

---

## Meet your agent team

Six agents, each with one job. You only need to remember two day-to-day; the rest is the team Galileo dispatches when needed.

### Galileo — the front door
The one you talk to. Same context you have, can advise grounded in it, and dispatches the rest of the team when you ask for real work. When you see chat on the platform, you're talking to Galileo.

### Bell — communications
Handles the post-meeting follow-up. Reads a meeting transcript, posts a Chatter summary on the Salesforce opportunity (auto — internal only), and drafts the customer-facing follow-up email for you to approve. Customer-facing email *never* sends automatically.

### Tycho — the Salesforce reader
Read-only access to your Salesforce org. Pulls accounts, opportunities, cases, activity. When another agent needs real data, it asks Tycho.

### Curie — the hygiene validator
Watches the data for contradictions and gaps. When an account's health band reads green but engagement is dead, Curie catches the conflict.

### Kepler — the data analyst
Takes Tycho's data and Curie's validation, scores it against a rubric, returns a verdict — `at_risk`, `watch`, `upsell_qualified` — with a confidence number and a signal trace.

### Euclid — the rubric author
Writes and updates the rubric Kepler scores against. The team's institutional knowledge of *what counts as risk*.

There's also a **Controlled Executor** behind the scenes — the agent that turns your approved drafts into real Salesforce updates and sent emails. You won't interact with it directly; it acts only after you approve in the queue.

**TL;DR:** talk to Galileo, hand off meetings to Bell, trust the rest of the team to run in the background.

---

## The bright line: agents draft, you decide

This is the most important rule on the platform.

Every **customer-facing** action — outgoing email, Salesforce field update, new task on an owner — goes through the **Approval Queue**. The agents propose; you decide.

What this protects:
- **Customers never receive an email from an agent.** Only from you, after you approve (or rewrite, then approve).
- **Salesforce records never update without your judgment.** Even when an agent is 91% confident.
- **You can rewrite anything before sending.** You're not stuck with what the agent wrote.

The two **internal** exceptions exist because they don't touch a customer:
- **Bell posts Chatter** on internal Salesforce records (visible only to your team).
- **The team logs decisions** in the platform itself (visible only to you and Roberto).

Everything that reaches a customer reaches them through your approve button.

---

## The signal grammar: color is meaning

Every color on the platform is a signal, not decoration. Internalize this once — every screen reads at a glance after.

| Color | Means | When you'll see it |
|---|---|---|
| 🔴 **Red** (`bad`) | At-risk, blocked, rejected, error | `at_risk` verdicts, rejected approvals, errors |
| 🟠 **Orange** (`hot`) | Urgent attention | `priority_high` verdicts, time-pressured items |
| 🟡 **Yellow** (`warm`) | Caution, watch, hygiene gap | `watch`, `missing_save_plan`, `stale_activity` |
| 🔵 **Blue** (`cold`) | Info, routing, reference | `route_to_executor`, informational chips |
| 🟢 **Green** (`good`) | Working, succeeded, approved, upsell | `approved` approvals, `upsell_qualified`, recovering accounts |
| ⚪ **Luminous gray** (`pending`) | Queued, draft, awaiting decision | Pending approvals, low-risk chips |
| ⚡ **Volt yellow** (`volt`) | Agent live, Galileo thinking | The agent-live strip, Galileo's status dot |

**Important nuance:** *pending* is **luminous**, not muted. It's *waiting*, not *disabled*. Truly idle/disabled things show in muted foreground gray.

---

## Trust but verify

Every agent decision is traceable. When Galileo (or any agent) tells you something — "Lighthouse is at-risk with 0.91 confidence" — you can drill into:

- **The reasoning** — the agent's natural-language explanation.
- **The signals** — the underlying data points, each weighted.
- **The source** — where each signal came from (`salesforce.account.Last_Login__c`).

This lives on the **Decision Trace** surface (`/decisions`). You don't have to verify every decision — but when something seems off, you can in seconds.

The agents don't ask for blind trust. They show their work.

---

## How these concepts map to the rest of the manual

- **The daily loop** — [workflows/morning-brief.md](workflows/morning-brief.md) puts the concepts above into a five-minute routine.
- **Acting on a queue item** — [workflows/triage-approvals.md](workflows/triage-approvals.md) is the bright line in action.
- **Conversational front door** — [workflows/talk-to-galileo.md](workflows/talk-to-galileo.md) shows what Galileo can and can't do.
- **Why an agent reached a verdict** — [workflows/deep-dive-account.md](workflows/deep-dive-account.md) walks the trust-but-verify path.
- **Where each concept lives on screen** — the [screens/](screens/) directory maps every concept to its visual home.

## What to read next

- **Your first morning** → [workflows/morning-brief.md](workflows/morning-brief.md)
- **Working the queue** → [workflows/triage-approvals.md](workflows/triage-approvals.md)
- **Asking the team** → [workflows/talk-to-galileo.md](workflows/talk-to-galileo.md)
