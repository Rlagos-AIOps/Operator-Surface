# Quick Start

Five minutes. One real action. Three screens.

By the end of this page, you'll have seen what your agent team thinks about your book, dug into one account that needs your attention, and asked the team a question — using live data, the same way you'll use it every morning.

## Before you start

Open the platform in your browser. You'll land on the **Hub** — three tiles, plus a top nav with **Overview**, **Operator**, **Galileo**, **Daily Brief**, **Approvals**, **Decisions**.

Open this guide in another tab and follow along. Each step takes about a minute.

## Why this is built the way it is

You have an AI agent team that watches your portfolio in the background — they read your Salesforce data, flag risk, draft outreach, and propose actions. They never act on a customer without you. Every customer-facing move (an email to a contact, a Salesforce update, a new task) sits in a queue waiting for you to approve, reject, or rewrite.

So your job with the platform is the same job you've always had — **decide** what to do for each customer — except now you're starting from a stack of well-reasoned drafts instead of an empty inbox.

The next three steps walk you through that loop: **see what they found → review what they want to do → ask them about it.**

## Step 1 — See your book at a glance

Click **Book** in the top nav. (URL: `/accounts`.)

**Why this screen:** The Book is your portfolio in one view. Your agents log a decision every time they look at an account, so the Book aggregates that activity into "here's where every account stands." Open the Book first thing in the morning and you'll know within seconds where to spend your attention.

**What you'll see:** A grid of account cards, sorted by how much attention they need. Above the grid, a summary line: how many accounts, total ARR, how many need attention, how many have pending approvals waiting on you.

**The colors mean things.** This vocabulary repeats everywhere on the platform — learn it once, read every screen faster.

- 🔴 **Red** — at-risk. Renewal or relationship in real trouble.
- 🟠 **Orange** — urgent attention. Not at-risk yet, but the clock is loud.
- 🟡 **Yellow** — caution. A hygiene gap or watch signal.
- 🔵 **Blue** — informational. Routing, references, FYI.
- 🟢 **Green** — working. Active, recovering, upsell-qualified.
- ⚪ **Pending (luminous gray)** — queued, in review. Not muted — *waiting*.

**Try it:** Find **Lighthouse Marketing** on the Book. Look for its verdict tag. It used to be at-risk; today it's *recovering* — your agents proposed an outreach, the operator approved it, the customer replied, and the team re-scored. That arc is your demo's "agents produce outcomes, not just flags."

Each card also shows **Galileo's read** — a short line of your front-door agent's take on the account, drawn from his real reasoning. You'll hear his voice across every surface.

## Step 2 — Review what your agents want to do

Click **Operator** in the top nav. (URL: `/operator`.)

**Why this screen:** The Book tells you *where* to look. The Operator console is *where the work happens*. It's the triage cockpit — every pending agent action lined up for review, with the reasoning and the draft in front of you, and Galileo to your right to consult.

**What you'll see:** Three panels.

- **Left — the queue.** Every pending approval, one per row. The top one is whatever needs your attention most.
- **Center — the thread + composer.** Click any item in the queue. The middle panel shows the agent's rationale (why this action) and the draft itself (the actual email body, the field update, the task). You can edit the draft, approve it, or reject it.
- **Right — Galileo.** Your front-door agent, scoped to whichever account you just selected. Same agent as the standalone Galileo page — embedded here so you don't have to leave the queue to ask a question.

**Try it:** Click the **Lighthouse Marketing** email in the queue. Read what the agent drafted — a recovery outreach to Chris. *Don't approve it yet.* You want to ask Galileo about it first. On to Step 3.

## Step 3 — Ask your team a question

You're still on `/operator`, looking at the Lighthouse email. On the right, the **Galileo** panel is now scoped to Lighthouse.

**Why this screen:** Galileo is the front door to the whole agent team. He has your account's full live context — every decision, every signal, every approval. Ask him a question and he answers grounded in that data, in seconds. Ask him to *act* — run an audit, re-score an account, draft something new — and he dispatches the team, which takes a few minutes.

**Try it:** Type *"What's the situation with Lighthouse right now, and what should I do this week?"* and hit Send.

While he's thinking, the panel shows **"Galileo is thinking…"** with a pulse. Plain advisory questions like this come back in 30–90 seconds. If you'd asked him to *run an audit*, he'd dispatch his team and the wait would be a few minutes.

When the answer lands, you'll get a markdown-formatted response — bolded headings, bulleted lists, concrete next steps. Use it like you'd use a colleague's two-paragraph Slack reply. He won't pull punches.

## What you just did

In five minutes, you ran the full daily loop:

1. **Saw the book** — where every account stands, ranked by attention.
2. **Triaged an item** — read the agent's reasoning and draft, with Galileo at your side.
3. **Asked the team** — got grounded, account-aware advice without leaving the queue.

You'll do this every morning.

## What's true about this platform that's worth remembering

- **Agents never act on a customer without you.** Every outgoing email, Salesforce update, or task waits for your approve/reject in the queue. The composer is the human gate.
- **Color is meaning, not decoration.** Once you've learned the signal grammar from Step 1, every screen reads faster.
- **Galileo is the front door, not the whole team.** He's the one you talk to; behind him, Bell handles communications, Tycho reads Salesforce, Curie validates the data, Kepler interprets it, the executor turns approved drafts into real actions. You don't manage them individually — Galileo does.
- **The platform reads live data.** What you see on the Book and in the queue right now reflects the agent team's actual state, not yesterday's snapshot.

## What to read next

- **The mental model in depth** → [concepts.md](concepts.md) — meet your agent team, learn the signal grammar properly, understand the human gate.
- **Your morning routine** → [workflows/morning-brief.md](workflows/morning-brief.md) — the five-minute daily ritual.
- **Reviewing approvals like a pro** → [workflows/triage-approvals.md](workflows/triage-approvals.md) — what to read first, when to approve vs reject vs rewrite.
- **Working with Galileo** → [workflows/talk-to-galileo.md](workflows/talk-to-galileo.md) — when to ask vs when to act.
