# Schema conventions

How to structure JSONB payloads across the Operator Surface ↔ Hermes contract.
This is the protocol layer on top of the SQL schema in `supabase/migrations/`.
Hermes writers and Operator Surface readers both agree to these shapes. The
database does not enforce them.

> **Example agent slugs used throughout this doc:** `health-score-recomputer`,
> `at-risk-triage`, `renewal-outreach`, `data-hygiene-audit`,
> `save-plan-drafter`. These are placeholders for the CSM agents Hermes will
> implement.

---

## `agents.metadata`

Free-form sidecar on the agent registry row. Recommended keys (all optional):

| Key | Type | Purpose |
|---|---|---|
| `version` | string (semver) | Agent code version, e.g. `"0.4.1"` |
| `owner` | string | Team or person owning the agent, e.g. `"csm-platform"` |
| `runtime` | string | Runtime identifier, e.g. `"node-20+claude-sonnet-4.5"` |
| `schedule` | string \| null | Cron expression if scheduled, e.g. `"0 9 * * 1-5"` |
| `tags` | string[] | Grouping tags, e.g. `["health", "renewals"]` |
| `model` | object \| null | `{ provider, name, temperature, max_tokens }` |
| `capabilities` | string[] | What this agent can do (`read_salesforce`, `draft_email`, `execute_field_update`, …). Surfaced in the Connections / Agents UI as chips. |
| `example_tasks` | string[] | Concrete task descriptions the agent performs. Shown to operators so they understand the agent's job at a glance. |
| `kill_switch_reason` | string \| null | Why `enabled` was last flipped off |
| `last_disabled_at` | ISO timestamp \| null | When `enabled` was last flipped off |
| `last_disabled_by` | uuid \| null | Operator who flipped the switch |

Example for `hygiene-validator`:

```json
{
  "version": "0.3.0",
  "owner": "csm-platform",
  "runtime": "node-20+claude-sonnet-4.5",
  "schedule": "0 6 * * *",
  "tags": ["hygiene", "audit", "read-only"],
  "capabilities": [
    "detect_missing_fields",
    "detect_stale_records",
    "flag_sop_gaps"
  ],
  "example_tasks": [
    "Audit all SMB accounts for empty save plans",
    "Flag accounts with no activity logged in 30 days",
    "Detect missing CSM ownership on new logos"
  ],
  "model": {
    "provider": "anthropic",
    "name": "claude-sonnet-4.5",
    "temperature": 0.1,
    "max_tokens": 3000
  }
}
```

---

## `agent_runs.metadata`

Per-execution sidecar. Recommended keys:

| Key | Type | Purpose |
|---|---|---|
| `trigger_payload` | object | What triggered the run (webhook body, cron context) |
| `version` | string | Agent code version at run-time — correlates with `agents.metadata.version` |
| `model_usage` | object | `{ input_tokens, output_tokens, total_tokens, cost_usd }` |
| `external_run_id` | string \| null | Hermes-internal run ID for correlation |
| `notes` | string \| null | Debug notes |

---

## `decisions.signals`

The reasoning trace. Array of signal objects:

| Key | Type | Required | Purpose |
|---|---|---|---|
| `name` | string | yes | What was measured, e.g. `"days_since_last_login"` |
| `value` | any | yes | The raw signal value |
| `weight` | number 0..1 | yes | How much this signal influenced the label |
| `note` | string | no | Human-readable explanation |
| `source` | string | no | Where the value came from, e.g. `"salesforce.account.Last_Login__c"` |

Example for a decision labeled `at_risk` with `confidence = 0.82` produced by `at-risk-triage`:

```json
[
  { "name": "days_since_last_login", "value": 47, "weight": 0.40,
    "source": "salesforce.account.Last_Login__c" },
  { "name": "support_tickets_30d", "value": 6, "weight": 0.30,
    "source": "salesforce.case" },
  { "name": "save_plan_present", "value": false, "weight": 0.20,
    "source": "salesforce.account.CSM_Save_Plan__c" },
  { "name": "csm_sentiment", "value": "negative", "weight": 0.10,
    "note": "Derived from most recent QBoBR notes" }
]
```

Weights should sum to ~1.0 by convention so the operator can read them as
percentages, but the DB doesn't enforce this.

---

## `decisions.metadata`

| Key | Type | Purpose |
|---|---|---|
| `prompt_id` | string \| null | Which prompt template produced this |
| `model_response_id` | string \| null | Provider-side response ID for replay |
| `latency_ms` | number | Time to produce the decision |

---

## `approvals.current_value` / `approvals.proposed_value`

Free-shape JSONB matching the `action_type`. Conventions per action type:

### `action_type = "send_reply"`

```jsonc
// current_value: null (we're creating a new draft)
// proposed_value:
{
  "channel": "email",                    // "email" | "slack" | "in_app"
  "to": ["jane@customer.com"],
  "subject": "Re: Pricing question",
  "body_md": "Hi Jane,\n\nThanks for...",
  "attachments": []
}
```

### `action_type = "update_field"`

```jsonc
// current_value:
{ "record": "salesforce.account.0015...", "field": "CSM_Save_Plan__c",
  "value": "..." }
// proposed_value:
{ "record": "salesforce.account.0015...", "field": "CSM_Save_Plan__c",
  "value": "5/27/26: Spoke with Jane. Plan to follow up next week." }
```

Typical producers: `save-plan-drafter`, `data-hygiene-audit`.

### `action_type = "create_task"`

```jsonc
// current_value: null
// proposed_value:
{
  "subject": "Follow up with Acme on pricing",
  "due_date": "2026-06-03",
  "assigned_to": "user@dazos.com",
  "related_record": "salesforce.account.0015..."
}
```

Typical producer: `renewal-outreach`.

### `action_type = "recompute_health"`

```jsonc
// current_value:
{ "account": "salesforce.account.0015...", "score": 67, "band": "yellow" }
// proposed_value:
{ "account": "salesforce.account.0015...", "score": 54, "band": "red",
  "pillars": { "engagement": 40, "usage": 55, "risk": 60, "support": 65, "financial": 50 } }
```

Typical producer: `health-score-recomputer`.

---

## `approvals.metadata`

| Key | Type | Purpose |
|---|---|---|
| `ttl_reason` | string \| null | Why this approval expires, e.g. `"stale_after_24h"` |
| `dependencies` | string[] | IDs of other approvals that must clear first |
| `risk_level` | `"low"` \| `"med"` \| `"high"` | Hint for UI ordering and warnings |

---

## `briefs.structured_data`

The brief is markdown for narrative (`body_md`); `structured_data` holds the
renderable widgets.

| Key | Type | Purpose |
|---|---|---|
| `kpis` | object[] | `{ label, value, delta, trend }` cards across the top |
| `chips` | object[] | `{ label, kind, payload }` pill-shaped callouts |
| `refs` | object[] | `{ type, id, label }` source records for "open in Salesforce" |
| `priorities` | object[] | `{ rank, summary, account_id, action }` daily ranked list |

---

## `connections.metadata`

**Non-secret** configuration only. Never put credentials here.

| Key | Type | Purpose |
|---|---|---|
| `display_name` | string | What the operator named the connection |
| `region` | string \| null | For multi-region providers |
| `webhook_url` | string \| null | Outbound webhook target if applicable |
| `feature_flags` | object | Provider-specific opt-ins, e.g. `{ "sync_attachments": true }` |
| `last_token_refresh_at` | ISO timestamp \| null | For OAuth providers |

---

## Rules of the road

1. **JSONB columns are append-only-ish in spirit.** Adding new optional keys is
   fine; removing or renaming existing keys is a breaking change for the
   consumer. Coordinate cross-repo before either.
2. **Schema is the contract; conventions are the protocol.** The SQL is what
   the DB enforces; this doc is what code agrees to. If a convention changes,
   update this doc and bump the agent's `metadata.version`.
3. **Avoid burying business logic in JSONB.** If a field gets queried or
   filtered in SQL, it deserves a real column. Use the migration system, not
   JSONB squat.
4. **No secrets in JSONB.** OAuth tokens, API keys, anything sensitive →
   Supabase Vault.
5. **Use string enums in JSONB, not booleans-with-magic.** e.g.
   `risk_level: "high"`, not `risk_high: true`. Future-proof.
