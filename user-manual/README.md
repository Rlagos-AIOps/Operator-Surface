# Operator Surface — User Manual

> An AI agent team watches your book of business. This manual is how you work with them.

If you're a Customer Success Manager using the Operator Surface, this is your guide. You don't need to know anything about how the agents work under the hood — only how to read what they did, decide what they should do next, and ask them for help.

## Start here

**[Quick Start →](quick-start.md)** — Five minutes from "what is this" to your first real action with the agent team.

## How this manual is organized

We organized it the way you'll actually use it.

### Concepts — the *why*
Read once, refer back. The mental model behind the platform: who's on your team, what the colors mean, why nothing happens to a customer without your approval.

### Workflows — *what you do*
Task-based how-tos. Use these when you have a specific job in front of you — your morning routine, triaging the queue, following up after a customer call.

### Screens — *where you look*
Page-by-page reference. Use these when you're on a screen and want to know what something is.

### Glossary — *what it's called*
Terminology and quick lookups.

## Table of contents

```
user-manual/
├── README.md ............................. you are here
├── quick-start.md ........................ ✅ DRAFTED
├── concepts.md ........................... ✅ DRAFTED — the mental model
├── workflows/
│   ├── morning-brief.md .................. ✅ DRAFTED — start your day
│   ├── triage-approvals.md ............... ✅ DRAFTED — review the queue
│   ├── post-meeting.md ................... 🔲 to write — Bell's loop (mostly out-of-platform)
│   ├── deep-dive-account.md .............. ✅ DRAFTED — from card to trace
│   └── talk-to-galileo.md ................ ✅ DRAFTED — the conversational front door
├── screens/
│   ├── hub.md ............................ ✅ DRAFTED — the launcher
│   ├── the-book.md ....................... ✅ DRAFTED — /accounts portfolio view
│   ├── operator-console.md ............... ✅ DRAFTED — /operator triage cockpit
│   ├── galileo.md ........................ ✅ DRAFTED — /galileo (also embedded in operator)
│   ├── daily-brief.md .................... ✅ DRAFTED — /brief
│   ├── approvals.md ...................... ✅ DRAFTED — /approvals
│   └── decisions.md ...................... ✅ DRAFTED — /decisions
└── glossary.md ........................... 🔲 to write — terminology (write last)
```

## What's left to write

Two docs remain, both intentionally deferred:

1. **`workflows/post-meeting.md`** — Bell's loop. The transcript → Chatter → draft → send-from-your-Gmail story. **Deferred** because most of the click path lives *outside* the platform (Gmail inbox, Salesforce Chatter pane), so it needs a different structure than the others.
2. **`glossary.md`** — terminology lookups. **Write last** so it's based on the actual terms used in the manual rather than guessed in advance.

All other click-path docs for first-time users are drafted.

## Writing principles

These keep the manual readable and trustworthy. Follow them when you add anything.

1. **Lead with the *why*.** Every page, every section opens with the reason before the instruction. Humans need motivation before mechanics. *Bad:* "To approve an email, click Approve." *Good:* "When Bell drafts a follow-up to a customer, it sits in your queue waiting on your judgment — because we never send a customer email without you. Here's how to review and approve."
2. **Second person, active voice, present tense.** "You open the queue" — not "the queue is opened" or "the user opens."
3. **Imperative for steps.** "Click", "Read", "Ask" — not "you should click."
4. **Action-oriented titles.** A title is a promise. "Approve a Bell draft" beats "About approvals." "See what your agents did overnight" beats "The Daily Brief screen."
5. **No jargon.** The reader is a CSM, not an engineer. Say *the platform*, not *the Next.js app*. Say *the queue*, not *Supabase approvals table*. Say *the agent team*, not *the Hermes profile registry*.
6. **Plain language. Short sentences.** Long sentences read as instructions; short sentences read as conversation. Match Galileo's voice — operator-to-operator.
7. **No dead ends.** End every doc with a one-liner: "What to do next →" with a link or two. Manuals only work if the reader can keep moving.
8. **Concrete over abstract.** "Lighthouse Marketing has 38 days until renewal" beats "an account approaching renewal." The seeded accounts are real; use their names.
9. **Show the screen.** When describing a surface, say what the reader will literally see. Use the same words that appear on the screen. (Tip: paste a screenshot or render to ASCII when helpful — but words first; screenshots age.)
10. **Honest about latency and limits.** When something takes a while (Galileo answers in 30–90s), say so. When something requires a human (sending customer emails), say so. The reader trusts the manual when the manual tells them what to expect.

## Audience and scope

This is the **user manual** — for the person *using* the platform.

It is not:
- A developer guide (how to add a route, deploy, run the agents)
- An architecture spec (how Supabase, the droplet worker, and Salesforce fit together)
- An operations runbook (what to do when something breaks)

Those documents will live elsewhere when we get to them. Keep this one focused on the operator's experience.

## Reading paths

Different readers want different things. The manual supports three paths.

**You're new to the platform** — read in order:
1. Quick Start
2. Concepts
3. Workflow: your morning brief
4. Workflow: triage approvals

**You have a specific task** — skip the rest, go straight to the workflow:
- Reviewing what's in your queue → `workflows/triage-approvals.md`
- Following up after a customer call → `workflows/post-meeting.md`
- Asking the team a question → `workflows/talk-to-galileo.md`
- Understanding why an agent reached a verdict → `workflows/deep-dive-account.md`

**You're on a screen and want to know what something is** — go to the screen reference:
- `screens/operator-console.md` for `/operator`
- `screens/the-book.md` for `/accounts`
- `screens/galileo.md` for `/galileo` (and the embedded copilot)
- etc.

## Contributing to this manual

The manual lives in the repo at `user-manual/`. Edit any file, open a PR, and ship.

If you're not sure where something should go: workflows are for *doing*, screens are for *finding*. If a doc reads like a how-to with steps, it's a workflow. If it reads like an inventory of what's on a screen, it's a screen reference. When in doubt, put the action in a workflow and link to the relevant screen for reference.
