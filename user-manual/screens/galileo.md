# Galileo — `/galileo`

The conversational front door to the agent team.

## Why this screen exists

Sometimes the right interface for "I have a question" is just a chat box. Galileo is your front-door agent — he has your full data context, advises grounded in it, and dispatches the other agents when you ask him to act.

This page is the **standalone version** of the chat. The same Galileo is *also* embedded in the right panel of the Operator console (`/operator`), scoped to whichever lead is selected there. Use the standalone page when you want full-screen focus, when you're comparing accounts, or when you don't have a specific lead in mind.

## What's on screen

### Header
A title — Galileo — with a status dot (volt yellow) that pulses while he's thinking.

To the right, an **account selector** dropdown. Pick an account to scope his context; pick "No account context" to ask about the book as a whole.

### Chat area
Your turns appear on the right (lime tint), Galileo's on the left (paper card). Markdown renders properly — bolded headings, bulleted lists, numbered steps, blockquotes, inline code.

While Galileo is working, you'll see a spinner with one of:
- *"Galileo is thinking…"* — short
- *"Galileo is thinking (consulting the team if needed)…"* — he's dispatched the workers; this will be a few minutes

### Input bar
A text input + Send button at the bottom. Hit Enter or click Send.

## What you can do here

| Action | How |
|---|---|
| **Pick a context** | Choose an account from the selector — Galileo gains live data for that account. |
| **Ask a question** | Type, hit Send. Wait 30–90s for advisory; minutes for action. |
| **Read a multi-paragraph answer** | Galileo's answers render markdown — scan headings and lists like a written brief. |
| **Switch context** | Pick a different account. (Note: this resets the visible thread.) |
| **Continue a thread** | Type a follow-up in the same thread — he remembers the conversation. |

## When to use this screen

- **You want to ask about the book as a whole** ("which renewal should I focus on this week?") — set selector to "No account context."
- **You want a full-screen chat** without the queue distracting you.
- **You're comparing accounts** — switch the selector between them and ask the same question.
- **You're explaining the agent team to someone** (this is where Galileo's voice is most visible).

## How to ask good questions

Galileo is grounded in your data; specific scopes get better answers.

| Worse | Better |
|---|---|
| *"What's wrong?"* | *"What's going on with Cobblestone, and what's the next step?"* |
| *"Help."* | *"I have 12 minutes. Which of the four pending approvals should I tackle first?"* |
| *"Is this email good?"* | *"Read the Lighthouse recovery email and tell me what you'd change."* |

He responds well to operator-to-operator framing. Be direct.

## What he answers with

Markdown — bolded headings, bulleted lists, numbered steps. He writes like a senior CSM who's seen the data: concrete, ordered, opinionated. He doesn't pull punches.

## What he doesn't do

- **He doesn't act on customers without your approval.** "Send the email" puts it in the queue; you still approve.
- **He doesn't know things outside your platform data.** Calendar, inbox, private notes — none of it.
- **He can't be reached when the droplet worker is off.** A question that stays "thinking" longer than a few minutes means the worker is down.

## Tips

- **Use the embedded Galileo (in `/operator`) for triage**, and the standalone page (`/galileo`) for everything else.
- **The page won't scroll on you.** The chat container scrolls only itself; sending a message doesn't yank the page down.
- **Switching account context starts a new thread.** Past threads aren't lost (they're stored), but the visible conversation resets.
- **Galileo references the live data in his answer.** When he says "0.91 at-risk," that number came from the actual decision row — not a guess.

## What to read next

- **Workflow: when to ask vs when to act** → [../workflows/talk-to-galileo.md](../workflows/talk-to-galileo.md)
- **The Operator console (embedded Galileo)** → [operator-console.md](operator-console.md)
- **The agent team behind him** → [../concepts.md](../concepts.md)
