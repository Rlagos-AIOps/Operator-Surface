# Talk to Galileo

The conversational front door to the whole agent team.

## Why this matters

Galileo is the easiest way to use the platform. He has the same data you have. He can advise grounded in it, and dispatch the other agents when you ask him to act. If you only ever learned one workflow on this platform, learn this one.

He's also the demo's hero — the moment that makes the agent team feel like a team.

## When you're here

You want a quick read, a second opinion, or you want the team to actually run something for you.

## Where to find him

Two places:

| Where | Best for |
|---|---|
| **Right panel of `/operator`** | Asking about whatever queue item you're triaging. Embedded, scoped to the selected lead's account. |
| **`/galileo` (standalone)** | Asking about the book, comparing accounts, or starting a longer thread. Full-screen chat with an account selector. |

Both use the same Galileo. Conversations on `/galileo` are scoped to the account you pick from the selector. Conversations in the `/operator` right panel are locked to whichever lead is selected — picking a different lead resets the conversation.

## Two kinds of questions

The difference matters because the speed differs.

### Advisory — "what should I do?"
Examples:
- *"What's the situation with Lighthouse right now, and what should I do this week?"*
- *"Which renewal should I focus on first today?"*
- *"Is this save-plan draft right for Cobblestone?"*

He answers grounded in the current data. **30 to 90 seconds.** He doesn't dispatch the team; he just reasons over what's already known.

### Action — "run something for me"
Examples:
- *"Re-score Cobblestone."*
- *"Run a hygiene audit on the book."*
- *"Have Bell draft a follow-up for the Cedar QBR."*

He dispatches the worker agents. **A few minutes**, depending on what he runs. The chat shows *"Galileo is thinking (consulting the team if needed)…"* while the team works.

If you're not sure which kind you're asking — start advisory. He'll tell you if he needs to dispatch.

## How to ask good questions

Galileo is grounded in your data, so the more you scope, the better the answer.

| Worse | Better |
|---|---|
| *"What's wrong?"* | *"What's going on with Cobblestone, and what's the next step?"* |
| *"Help."* | *"I have 12 minutes. Which of the four pending approvals should I tackle first?"* |
| *"Is this email good?"* | *"Read the Lighthouse recovery email and tell me what you'd change."* |

He responds well to operator-to-operator framing. Don't be polite at the cost of being direct. He won't take offense.

## What he answers with

Markdown — bolded headings, bulleted lists, numbered steps. He writes like a senior CSM who's seen the data: concrete, ordered, opinionated. He doesn't pull punches.

The chat panel scrolls **only its own area**, not the page. If you scroll up to re-read an earlier turn, new responses won't yank you back down. (If they ever do, that's a bug — flag it.)

## What he doesn't do

- **He doesn't act on customers without your approval.** Even if you tell him to "send the email," the email goes into the approval queue. You still approve it.
- **He doesn't know things outside your platform data.** Your calendar, your inbox, your private notes — none of it.
- **He can't be reached when the droplet worker is off.** If a question stays "thinking" for more than a few minutes, the worker is down, not Galileo. The site keeps working; just the chat is silent until the worker resumes.

## A note on history

Conversations persist per `conversation_id`. On `/galileo`, switching account context starts a new thread. On `/operator`, switching leads also starts a new thread. You can't (today) retrieve a past thread by URL — but the rows live in Supabase if you ever need to.

## What to read next

- **Triaging the queue with Galileo's help** → [triage-approvals.md](triage-approvals.md)
- **Galileo screen in detail** → [../screens/galileo.md](../screens/galileo.md)
- **The agent team behind him** → [../concepts.md](../concepts.md)
