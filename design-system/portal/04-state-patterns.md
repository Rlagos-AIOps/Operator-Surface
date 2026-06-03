# State Patterns — Empty, Loading, Error, Skeleton

In an agentic client-success product, the surface is rarely "done loading and full." Agents are thinking, queues are filling, drafts are sending, CRMs are timing out. The states *are* the product. This system treats empty/loading/error as first-class, gives every agentic surface a sensible default, and exposes each one as a customizable slot.

## Why states matter in an agentic product

A static dashboard can get away with a spinner. An agentic console can't:

- **The operator is supervising autonomy.** When an agent is mid-task, the operator needs to see "Athena is drafting" — a calm, legible loading affordance — not a frozen panel. Ambiguity reads as "is it broken?"
- **Failure is a normal branch, not an exception.** Agents hit rate limits, lose CRM connections, produce drafts that won't send. The error state is where the product earns trust: it names what failed, says what's safe, and offers a retry.
- **Empty is a starting condition, not a bug.** An empty queue means "all caught up," not "something's wrong." The empty pattern says so in a muted, non-alarming voice.
- **State changes are live.** Per the aria-live contract, ambient updates (agent online/offline, metric refresh) announce `polite`; errors announce `assertive`. The state components are wired so screen readers track the surface the way the eyes do.

## The three state components

Authored in `components/site/states.tsx` (or `components/operator/states.tsx`). These are the **default** content for every leaf's render-slots — and the building blocks customers pass back in to re-voice.

### `Skeleton`

```tsx
<Skeleton className?={string} />
```

A token-driven shimmer placeholder. Respects `prefers-reduced-motion` (the shimmer stops; the placeholder stays). Use for loading rows, loading cards, loading metrics — anywhere real content is about to arrive. Matches the shape of what it replaces (queue rows shimmer as rows, metrics as chips).

### `EmptyState`

```tsx
<EmptyState
  icon?={ReactNode}
  title={string}
  hint?={string}
  action?={ReactNode}
  className?={string}
/>
```

The neutral empty pattern: a dot-grid `PANEL`, muted voice, optional icon, optional hint line, optional action. Deliberately calm — empty is a state of rest, not an alarm. "No leads in queue" reads as caught-up, not broken.

### `ErrorState`

```tsx
<ErrorState
  title={string}
  detail?={string}
  onRetry?={() => void}
  tone?={Tone}        // default 'bad'
  className?={string}
/>
```

The agentic-failure pattern, and the one customers customize most. A `bad`-toned panel, a clear title, optional detail, and a **Retry** CTA wired to `onRetry`. The voice is customizable because in an agentic CS product the failure copy carries the brand. This is the surface [`02-slot-api-reference.md`](02-slot-api-reference.md) shows being re-voiced.

## Defaults wired per surface

Each leaf component ships with these states wired as defaults, driven by an optional `state?: 'ready' | 'loading' | 'empty' | 'error'` prop (default `'ready'`):

| Surface | empty | loading | error |
|---|---|---|---|
| **LeadQueue** | `EmptyState("No leads in queue")` | `Skeleton` rows | `ErrorState("Couldn't load the queue", retry)` |
| **ThreadView** | `EmptyState` (no selection) | `Skeleton` | `ErrorState` |
| **Composer** | — | drafting affordance | `ErrorState("Draft failed to send", retry)` |
| **AgentChat** | — | thinking affordance | `ErrorState` (agent error) |
| **MetricRow** / charts | `EmptyState` (no data) | `Skeleton` | — |

These are the **defaults**, not the only option.

## Defaults and slots are the same surface

The key idea: the default state content and the customization slot are one and the same. Each leaf renders its default state component *unless* you pass a replacement via `emptyState` / `loadingState` / `errorState`. So:

- **Do nothing** → you get the system's well-behaved defaults, on-brand, accessible, reduced-motion-safe.
- **Pass a slot** → you re-voice that exact state without touching the component's state machine. The component still decides *when* the queue is empty or the draft failed; you decide *what* renders.

```tsx
// Default error — system voice
<LeadQueue state="error" leads={[]} … />

// Re-voiced error — your voice, same trigger
<LeadQueue
  state="error"
  leads={[]}
  errorState={<MyQueueError onRetry={refetch} />}
  …
/>
```

This is why states are both robust out of the box and fully ownable. See the full slot contract in [`02-slot-api-reference.md`](02-slot-api-reference.md) and the `Kit/State` Storybook playground for every state rendered live.
