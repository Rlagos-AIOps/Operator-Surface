# Slot & Config API Reference — Compose Without Forking

Re-skinning ([`01`](01-customization-guide.md)) changes how the surface *looks*. This contract changes how it's *composed*: which panels render, what gets injected where, and how a customer re-voices an agent's empty/loading/error states. Three levels, scoped by component role.

## Level 1 — `className` passthrough (every component)

Every feature component in `components/operator/*` and the kit in `components/site/*` accepts an optional `className?: string`, merged onto the root via `cn()` (tailwind-merge — your class wins on conflict). This is the universal escape hatch: spacing, width, borders, one-off overrides, all without touching the component.

```tsx
<LeadQueue className="max-h-[50vh] border-cold/40" leads={leads} … />
<Badge tone="hot" className="px-4 text-xs">URGENT</Badge>
```

Because it's `cn()`-merged (not concatenated), passing `rounded-none` actually overrides the component's `rounded-2xl` — no specificity fights.

## Level 2 — the `OperatorSurface` config object (orchestrator)

`OperatorSurface` is the top-level console. It accepts an optional `config` object that controls **which panels render** and lets you **inject slots**. Default is today's full layout — all panels on, nothing injected. Mock-data wiring stays intact.

```tsx
type OperatorSurfaceConfig = {
  panels?: {
    metrics?: boolean;   // the metric row
    queue?: boolean;     // the inbound lead queue
    thread?: boolean;    // the thread + composer column
    copilot?: boolean;   // the agent chat column
  };
  slots?: {
    header?: ReactNode;  // replace the TopBar region
    empty?: ReactNode;   // surface-level empty override
  };
};
```

```tsx
// A two-panel console: queue + thread only, custom header
<OperatorSurface
  config={{
    panels: { metrics: false, copilot: false },
    slots: { header: <MyBrandedTopBar /> },
  }}
/>
```

Omit `config` entirely and you get the shipped three-column console with the metric row and TopBar. Set any panel to `false` to drop it; the layout reflows. This is how an integrator tailors the surface to their product's information density without rebuilding it.

## Level 3 — leaf render-slots: `emptyState` / `loadingState` / `errorState`

This is the one customers reach for most in an agentic product. The leaf components — `LeadQueue`, `ThreadView`, `Composer`, `AgentChat`, `MetricRow` — accept three render-slot props:

```tsx
emptyState?: ReactNode;
loadingState?: ReactNode;
errorState?: ReactNode;
```

Each **defaults** to the matching state component from the kit (`EmptyState` / `Skeleton` / `ErrorState` — see [`04-state-patterns.md`](04-state-patterns.md)). Pass your own to **re-voice** that state without forking the component's data logic.

Which state shows is driven by an optional `state?: 'ready' | 'loading' | 'empty' | 'error'` prop (default `'ready'`), so stories and consumers can demo or force each state.

### Re-voicing an agent-failure state

In an agentic CS product, the failure copy *is* the product voice. When an agent's draft fails or a thread won't load, the customer wants their own tone and their own retry affordance — not the system default. Pass a custom `errorState`:

```tsx
import { ErrorState } from "@/components/site/states";

<AgentChat
  lead={lead}
  state={agentError ? "error" : "ready"}
  errorState={
    <ErrorState
      title="Athena hit a snag"
      detail="The agent couldn't reach the CRM. Your draft is saved."
      onRetry={retryAgent}
      tone="bad"
    />
  }
/>
```

Or go fully custom — `errorState` is just a `ReactNode`:

```tsx
<Composer
  lead={lead}
  state="error"
  errorState={<MyBrandedDraftFailure onRetry={resend} />}
/>
```

The component still owns the *when* (its state machine decides a draft failed); you own the *what* (the rendered failure). That separation is the whole point — you re-voice failures, empties, and loads without touching telemetry wiring.

## Component → props table

| Component | Code source | Data / behavior props | Composition props |
|---|---|---|---|
| **OperatorSurface** | `operator/operator-surface.tsx` | (mock-wired internally) | `config?`, `className?` |
| **LeadQueue** | `operator/lead-queue.tsx` | `leads`, `selectedId`, `onSelect` | `state?`, `emptyState?`, `loadingState?`, `errorState?`, `className?` |
| **ThreadView** | `operator/thread-view.tsx` | `lead` | `state?`, `emptyState?`, `loadingState?`, `errorState?`, `className?` |
| **Composer** | `operator/composer.tsx` | `lead`, `sent`, `rejected`, `onApprove`, `onReject` | `state?`, `loadingState?`, `errorState?`, `className?` |
| **AgentChat** | `operator/agent-chat.tsx` | `lead` | `state?`, `loadingState?`, `errorState?`, `className?` |
| **MetricRow** | `operator/metric-row.tsx` | (mock-wired internally) | `state?`, `emptyState?`, `loadingState?`, `className?` |
| **TopBar** | `operator/top-bar.tsx` | `highIntentOnly`, `onToggleFilter` | `className?` |
| **Sidebar** | `operator/sidebar.tsx` | (nav config) | `className?` |
| **IntentChip** | `operator/intent-chip.tsx` | `intent` (high·mid·cold), `score` 0–100 | `className?` |
| **Bubble** | `operator/bubble.tsx` | `from` (human·agent·reasoning) | `className?` |

Kit primitives (`Badge`, `StatusDot`, `Pill`, `MiniBar`, `IconTile`, `Kbd`, `Button`, `PageHeader`, `LiveSignage`, `Panel`) all take `className?`; their tone/variant props are catalogued in [`05-supernova-tied-components.md`](05-supernova-tied-components.md).

## The three levels together

```
className           →  tweak any component's look inline
config              →  choose which panels render + inject surface slots
emptyState/         →  re-voice a leaf's empty/loading/error without forking
loadingState/
errorState
```

Reach for the lowest level that does the job. Most customization is `className` + a custom `errorState`. The `config` object is for integrators reshaping the console itself.
