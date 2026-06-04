# Triage your approval queue

How to work the queue without rushing.

## Why this matters

The Approval Queue is where every customer-facing action waits for you. Every email, every Salesforce update, every new task — they sit here until you decide. Triage is the platform's most important habit, and it's where the bright line ("agents draft, you decide") actually lives.

The agents are good. They will be wrong sometimes. Triage is how you catch the wrong ones without slowing down the right ones.

## When you're here

You opened the Operator console (`/operator`) or the Approval Queue (`/approvals`) and there are pending items. Time to work them.

## The bright line, in practice

A pending item is a *proposal*, not a decision. Three things happen when you approve:

1. The action goes live immediately.
2. The agent learns from the approval.
3. The item moves out of your queue and into history.

When you reject, the action dies. The agent still learns. When you rewrite, you're approving your version, not the agent's.

You're the gate. Nothing about an agent's confidence number changes that.

## What's in each row

Every queue item has the same skeleton:

| Field | What it means |
|---|---|
| **Account** | Which customer this is about |
| **Action type** | `send_email`, `update_field`, `create_task`, `send_slack` |
| **Agent** | Who proposed it (usually the Controlled Executor) |
| **Risk level** | `low` / `med` / `high` — agent's read on stakes |
| **Status** | `pending`, `approved`, `rejected`, `expired` |
| **Rationale** | The agent's explanation of *why* this action |
| **Proposed value** | The actual draft (email body, field value, task spec) |

## How to triage one item

### 1. Open it

Click the row in the queue. The middle panel (the thread + composer) populates with the rationale and the draft.

### 2. Read the rationale first

**Why first:** The agent is making a case. Before you judge the draft, judge the *case*. Does the situation the agent describes match what you know? Does it see the same customer you do?

If the reasoning is wrong, the draft is also wrong — reject.

### 3. Then read the draft

If the case holds, judge the draft itself.

**For an email** — does it sound like you? Does it surface what the customer needs to hear? Anything inaccurate? Anything missing?

**For a field update** — is the new value better than the current value? Is it accurate? (Pay extra attention to save-plan updates — those become institutional memory.)

**For a task** — is the owner right? Is the due date realistic?

### 4. Ask Galileo if you're uncertain

The right panel of `/operator` is Galileo, scoped to the selected account. He has the same context you do.

Try: *"Is this draft right for [account]?"* or *"What am I missing about this account?"*

Wait 30–90 seconds for an advisory answer. (He won't take action; he'll just advise.)

### 5. Approve, reject, or rewrite

**Approve & send** — the action goes live immediately. **This is real.** A customer email actually sends from your Gmail. A Salesforce field actually updates.

**Reject** — the action dies. Add a one-line note in the decision-note field so the team learns context (e.g., *"Already handled offline — talked to them Friday."*).

**Rewrite** — edit the draft in the composer before approving. Your version is what ships.

## Common shapes of approvals

### A Bell email draft (post-meeting follow-up)
You had a meeting; Bell wrote the follow-up. Read it like a CSM colleague's draft — would you send it? Adjust tone if needed; the draft saved you a blank page.

### A save-plan field update
The agent is appending a current-state note to a stale or missing plan. Read for accuracy — is the note true? Approve if so. These are usually low-risk and save real time.

### A task assignment
The agent is creating Salesforce work for someone. Sanity-check the owner, the due date, and the description.

### A recovery outreach (high-risk)
The customer's gone dark; the agent wants you to reach out. These are usually high-risk and worth slowing down for. Ask Galileo about the account before sending. The Lighthouse recovery email is the canonical example.

## Tips

- **Edit before approving on emails.** Bell's drafts save you from a blank page; you sign your name on them. The composer is editable.
- **Reject with a note.** A one-line decision-note teaches the team. *"Already handled offline"* is enough.
- **Don't try to clear the queue.** Make one good decision and move on. Tomorrow there'll be more.
- **High-risk approvals deserve Galileo.** Low-risk save-plan updates usually don't.

## What just happened

You decided. The platform executes for you. The agent learns from how you decided. Your customer gets your judgment, not an agent's.

## What to read next

- **Talk to Galileo while triaging** → [talk-to-galileo.md](talk-to-galileo.md)
- **After a customer meeting** → [post-meeting.md](post-meeting.md)
- **The Operator console in detail** → [../screens/operator-console.md](../screens/operator-console.md)
- **Why an agent reached a verdict** → [deep-dive-account.md](deep-dive-account.md)
