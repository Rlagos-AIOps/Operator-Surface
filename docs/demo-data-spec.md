# Demo Data Spec

**Purpose.** Single source of truth for the customer accounts that appear in the demo. Angel's Salesforce seeder, Roberto's Supabase seed (`scripts/seed.ts`), and the screens (`/brief`, `/approvals`, `/decisions`) all conform to this.

**Audience.** Angel (Salesforce data), Roberto (Supabase data), anyone presenting the demo.

**Authority.** This doc describes what's already seeded in Supabase. Any drift between Supabase, Salesforce, and the screens should be reconciled to this doc — not the other way around.

**Last reconciled with:** `scripts/seed.ts` as of 2026-06-02.

---

## At a glance

10 accounts in the seed. The top 8 carry the demo narrative; the bottom 2 are supporting cast (present so the queue feels real, not the demo's hero moments).

| Rank | Account | Industry | Segment | ARR | Renewal in | Health (implied) | Risk flags | CSM |
|---|---|---|---|---:|---:|---|---|---|
| 1 | **Lighthouse Marketing** 🔥 | Marketing agency | SMB | $28.5k | **38 d** | **35 · red** | at_risk (0.91), silent | Taylor |
| 2 | Cobblestone Realty 🎯 | Real estate | MM | $84k | 94 d | 50 · red | at_risk (0.82), missing save plan, exec sponsor change | Taylor |
| 3 | Brightline Health | Healthcare | Ent | $180k | 73 d | 60 · yellow | stale_activity (41d), renewal_risk (0.68), thin forecast | Taylor |
| 4 | Cedar & Co | Professional services | MM | $96k | n/a | 55 · red | at_risk (0.74), missed 2 QBRs, primary contact deactivated | Taylor |
| 5 | Riverside Logistics | Logistics | MM | $52k | 110 d | 70 · yellow | missing_save_plan, priority_high (0.84) | Morgan |
| 6 | Spruce Education | EdTech | Ent | $142k | n/a | 67 · yellow | recompute green→yellow, engagement −14 | Taylor |
| 7 | Northstar Print | Print services | SMB | $24k | 51 d | 82 · green | upsell_qualified (0.79) **and** missing_save_plan | Taylor |
| 8 | Compass Foods | Food & beverage | MM | $68k | n/a (new) | 75 · green | missing_csm_owner (14d), brand-new logo | Taylor |
| 9 | Avalon Auto | Automotive | MM | $72k | n/a | 65 · yellow | stale_activity (47d) | Morgan |
| 10 | Polaris Builders | Construction | MM | $48k | n/a | 60 · yellow | watch (0.55), sop_section_5_gap, 71d yellow band | Morgan |

🔥 = hero of the brief ("clearest churn risk — start there")
🎯 = richest decision trail (the demo's signal-to-action narrative)

**Book totals**: $794k ARR, 4 at-risk, 6 pending approvals, 3 renewals within 90d.

> **Health score caveat.** The current Supabase schema does NOT store an explicit `health_score` column. The numbers above are inferred from the at-risk decisions' confidence + signal mix. Salesforce can provide the canonical score via `Account.Health_Score__c`; when it does, the agents will recompute and write `recompute_health` decisions that supersede these inferences.

---

## Hero — Lighthouse Marketing

**The opening line of the demo brief: "Lighthouse is the clearest churn risk — start there."**

| Field | Value |
|---|---|
| Salesforce ID (placeholder) | `0015A00000A1B7hZAA` |
| Name | Lighthouse Marketing |
| Industry | Marketing agency |
| Segment | SMB |
| ARR | $28,500 |
| Renewal date | **38 days out** |
| Last logged login | 62 days ago |
| Support tickets, last 30d | 0 (the silence is the signal) |
| Sentiment | Negative — disengaged |
| Usage trend | Sharp drop-off |
| Save plan? | No |
| Exec sponsor mapped? | No |
| Risk band | Red |
| CSM owner | Taylor Reeves |

**The at-risk story in one line:** Lighthouse stopped logging in two months ago, has filed zero support tickets, and is 38 days from renewal — silence often precedes churn for SMB.

**What the agents have done about it:**

1. `hygiene-validator` flagged Lighthouse as `at_risk` with **0.91 confidence** — strongest signal in the book today.
2. `galileo` auto-routed the proposed save-plan email draft to `controlled-executor` for human review.
3. There is a **pending approval** waiting on Taylor: a recovery email to `chris@lighthouse-marketing.example` with subject "Checking in — last month before renewal." 38 days · pending · high risk.

This is the click-Approve moment in the demo.

---

## Account specs

For each account: the per-row data, the signal trace from the seeded decision (so Angel can match the values exactly), the decisions/approvals tied to it, and the one-line at-risk story.

### Cobblestone Realty 🎯

| Field | Value |
|---|---|
| Salesforce ID | `0015A00000A1B2cZAA` |
| Industry | Real estate |
| Segment | MM |
| ARR | $84,000 |
| Renewal in | 94 days |
| Health (implied) | 50 · red border |
| Usage trend | Declining |
| CSM | Taylor |

**Signal trace** (from `classify_at_risk`, 0.82 confidence):

| Signal | Value | Weight | Source |
|---|---:|---:|---|
| `days_since_last_login` | 38 | 0.30 | `salesforce.account.Last_Login__c` |
| `support_tickets_30d` | 5 | 0.25 | `salesforce.case` |
| `save_plan_present` | false | 0.25 | `salesforce.account.CSM_Save_Plan__c` |
| `exec_sponsor_change_60d` | true | 0.20 | note: "VP Ops left in April" |

**Plus** a follow-on `prioritize` decision from `galileo` at 0.91 confidence, citing the at-risk flag + 94-day renewal + $84k ARR — bumping Cobblestone to `priority_high` for today.

**Pending approvals (2):**

1. `update_field` on `CSM_Save_Plan__c` — proposes the dated save-plan narrative.
2. `create_task` "Recovery call: Cobblestone Realty (at-risk 0.82)" — due tomorrow, assigned to Taylor.

**One line:** Quiet decline — usage down, support up, no save plan, exec sponsor left. Matches the 'silent decline' pattern usually only caught at QBoBR.

---

### Brightline Health

| Field | Value |
|---|---|
| Salesforce ID | `0015A00000A1B4eZAA` |
| Industry | Healthcare |
| Segment | Enterprise |
| ARR | $180,000 |
| Renewal in | 73 days |
| Health (implied) | 60 · yellow |
| Usage trend | Flat to declining |
| CSM | Taylor |

**Signal traces:**

- `flag_data_gap → stale_activity` (no confidence): `days_since_last_activity=41` (w=0.5), `renewal_in_days=73` (w=0.3), `segment=Enterprise` (w=0.2)
- `classify_renewal_risk → at_risk` (0.68): `csm_forecast=Positive Outlook` (w=0.3), `save_plan_present=false` (w=0.25), `exec_sponsor_mapped=false` (w=0.25), `qbr_before_close=false` (w=0.20)

**Pending approval (1):** `update_field` on `CSM_Save_Plan__c` — appending a current-state note to a 3-month-old save plan.

**One line:** Renewal forecast is positive on paper but the supporting data is thin — no save plan, no exec sponsor map, no scheduled QBR.

---

### Cedar & Co

| Field | Value |
|---|---|
| Salesforce ID | `0015A00000A1B8iZAA` |
| Industry | Professional services |
| Segment | MM |
| ARR | $96,000 |
| Renewal in | Not specified |
| Health (implied) | 55 · red border |
| Usage trend | Slow decline |
| CSM | Taylor |

**Signal trace** (from `classify_at_risk`, 0.74):

| Signal | Value | Weight | Note / Source |
|---|---:|---:|---|
| `missed_qbr_count` | 2 | 0.40 | Last two consecutive quarters |
| `primary_contact_active` | false | 0.30 | `salesforce.contact.IsActive` |
| `days_since_last_login` | 26 | 0.30 | — |

Plus a `generate_checklist` decision from `sop-analyst`: pre-QBoBR checklist ready — 4 of 6 must-haves complete.

**Approvals:** None pending.

**One line:** Relationship erosion — two missed QBRs and the primary admin contact deactivated last week.

---

### Riverside Logistics

| Field | Value |
|---|---|
| Salesforce ID | `0015A00000A1B3dZAA` |
| Industry | Logistics |
| Segment | MM |
| ARR | $52,000 |
| Renewal in | 110 days |
| Health (implied) | 70 · yellow |
| Usage trend | Stable but quiet |
| CSM | Morgan |

**Signal traces:**

- `flag_data_gap → missing_save_plan`: `health_band=yellow` (w=0.5, computed), `save_plan_last_updated=null` (w=0.5)
- `prioritize → priority_high` (0.84): yellow band + missing save plan + renewal in 110 days. Top priority on Morgan's brief.

**Approved approval (1):** Save plan update approved by Taylor (note: "Approved.") — already executed by `controlled-executor`.

**One line:** Yellow-band account with no save plan, SOP section 5 violation.

---

### Spruce Education

| Field | Value |
|---|---|
| Salesforce ID | `0015A00000A1B1lZAA` |
| Industry | EdTech |
| Segment | Enterprise |
| ARR | $142,000 |
| Renewal in | Not specified |
| Health (implied) | 67 · yellow (just dropped from 78) |
| Usage trend | Stable; engagement subscore dropping |
| CSM | Taylor |

**Signal trace** (from `recompute_health_band`, 0.88):

| Signal | Value | Weight | Note |
|---|---:|---:|---|
| `previous_score` | 78 | 0.20 | Last week |
| `current_score` | 67 | 0.40 | This week |
| `engagement_delta` | −14 | 0.40 | 5-pillar engagement subscore |

**Approved approval (1):** Health band updated `green → yellow` (Taylor: "Confirmed — flagged for outreach this Friday.")

**One line:** Primary user went on parental leave; secondary contact hasn't picked up the slack. Pure engagement signal — no churn risk yet, but watching.

---

### Northstar Print

| Field | Value |
|---|---|
| Salesforce ID | `0015A00000A1B6gZAA` |
| Industry | Print services |
| Segment | SMB |
| ARR | $24,000 |
| Renewal in | 51 days |
| Health (implied) | 82 · green |
| Usage trend | **Tripled in 60 days** |
| CSM | Taylor |

**Signal traces:**

- `classify_upsell_opportunity → upsell_qualified` (0.79): `seat_cap_hit_days_30d=19` (w=0.4), `usage_growth_60d_pct=218` (w=0.3), `ae_pricing_inquiries=2` (w=0.3)
- `flag_data_gap → missing_save_plan` (no confidence): `renewal_in_days=51` (w=0.5), `save_plan_present=false` (w=0.3), `renewal_readiness_note_present=false` (w=0.2)

**Pending approval (1):** A Slack DM to `@kim-ae` (the AE), low risk, drafted to qualify the upsell carefully without pitching directly.

**One line:** Growing fast, asking about higher tier — the rare positive-momentum demo moment, but renewal hygiene is still missing.

---

### Compass Foods

| Field | Value |
|---|---|
| Salesforce ID | `0015A00000A1B5fZAA` |
| Industry | Food & beverage |
| Segment | MM |
| ARR | $68,000 |
| Renewal in | Not yet — new logo |
| Health (implied) | 75 · green |
| Usage trend | Just activated, normal ramp |
| CSM | (unassigned — see below) |

**Signal trace** (from `flag_data_gap → missing_csm_owner`):

| Signal | Value | Weight | Source |
|---|---:|---:|---|
| `csm_owner_id` | null | 0.70 | `salesforce.account.OwnerId` |
| `days_since_activation` | 14 | 0.30 | — |

**Pending approval (1):** `create_task` to assign a CSM owner — overdue per SOP (5-business-day SLA, currently at 14).

**One line:** Brand-new logo with no CSM owner — SOP section 5 violation, lands in the queue automatically.

---

### Avalon Auto *(supporting)*

| Field | Value |
|---|---|
| Salesforce ID | `0015A00000A1B9jZAA` |
| Industry | Automotive |
| Segment | MM |
| ARR | $72,000 |
| Health (implied) | 65 · yellow |
| CSM | Morgan |

**Signal trace** (from `flag_data_gap → stale_activity`): `days_since_last_activity=47` (w=0.6), `ae_handoffs_30d=3` (w=0.4, note: "AE asked CSM to follow up 3 times").

**Rejected approval (1):** A task creation was proposed and the CSM overrode it ("Already on it — spoke with AE on Friday. No task needed.") — useful for showing the demo audience that operators are in control.

---

### Polaris Builders *(supporting)*

| Field | Value |
|---|---|
| Salesforce ID | `0015A00000A1B0kZAA` |
| Industry | Construction |
| Segment | MM |
| ARR | $48,000 |
| Health (implied) | 60 · yellow (71d in band) |
| CSM | Morgan |

**Signal traces:**

- `classify_at_risk → watch` (0.55): `usage_pct_of_segment_median=38` (w=0.4), `days_since_last_outbound_email=22` (w=0.3), `support_tickets_30d=1` (w=0.3)
- `flag_sop_gap → sop_section_5_gap` (no confidence): `days_in_yellow_band=71` (w=0.4), `save_plan_present=false` (w=0.3), `next_touchpoint_scheduled=null` (w=0.3)

**Approvals:** None pending.

---

## Operators (CSMs) in the seed

Two `auth.users` rows. Both real Supabase auth users — the `id` is what shows up in `approvals.decided_by` and `briefs.operator_id`.

| Email | Display name | Book (8 accounts inferred from brief priorities) |
|---|---|---|
| `taylor@example-csm.test` | Taylor Reeves | Cobblestone · Lighthouse · Brightline · Compass · Northstar · Spruce · Cedar |
| `morgan@example-csm.test` | Morgan Patel | Riverside · Avalon · Polaris |

> **Caveat.** CSM ownership is **inferred** from which operator's brief mentions each account. There's no explicit `csm_id` field in this Supabase seed — that lives in Salesforce as `Account.OwnerId`. When Angel's seeder runs, the canonical ownership comes from Salesforce; the inferences above are just narratively consistent with our briefs.

---

## Salesforce ↔ Supabase field mapping

What lives where, and how Angel's Salesforce seeder maps to this app's data model.

### Account-level fields

| Concept | Salesforce field | Supabase location (in this seed) |
|---|---|---|
| Account ID | `Account.Id` | `decisions.source_record_id`, `approvals.target_record_id`, `briefs.structured_data.priorities[].account_id`, `briefs.structured_data.refs[].id` |
| Account name | `Account.Name` | `decisions.metadata.account_name`, `approvals.metadata.account_name`, `briefs.structured_data.refs[].label` |
| Industry | `Account.Industry` | *not in current seed* — add to metadata if needed |
| Segment | `Account.Segment__c` (custom) | `decisions.metadata.account_segment` (`SMB` / `MM` / `Ent`) |
| ARR | `Account.AnnualRevenue` *or* `Account.ARR__c` | `decisions.metadata.account_arr_usd` (number) |
| Health score | `Account.Health_Score__c` | *not stored* — implied by `classify_at_risk` confidence and signals |
| Health band | computed: green / yellow / red | `decisions.signals[].name == "health_band"` value, or the `label` on a `recompute_health_band` decision |
| CSM owner | `Account.OwnerId` | inferred from which `briefs.operator_id` mentions the account |
| Save plan | `Account.CSM_Save_Plan__c` (Long Text) | `approvals.proposed_value.value` when `action_type = "update_field"` and `field = "CSM_Save_Plan__c"` |
| Last login | `Account.Last_Login__c` (Datetime) | `decisions.signals[]` where `name = "days_since_last_login"` |
| Renewal date | `Opportunity.CloseDate` (related) | `decisions.signals[]` where `name = "renewal_in_days"` |
| New-logo timestamp | `Account.Activated_At__c` | `decisions.signals[]` where `name = "days_since_activation"` |

### Signal source attribution

The signal trace in `decisions.signals[].source` already names the Salesforce origin for each value. Examples from the seed:

| Signal `source` string | What Salesforce object/field this maps to |
|---|---|
| `salesforce.account.Last_Login__c` | `Account.Last_Login__c` |
| `salesforce.account.CSM_Save_Plan__c` | `Account.CSM_Save_Plan__c` |
| `salesforce.account.OwnerId` | `Account.OwnerId` |
| `salesforce.account.AnnualRevenue__c` | `Account.AnnualRevenue` (or `ARR__c`) |
| `salesforce.case` | rollup count from `Case` |
| `salesforce.task` | rollup count from `Task` |
| `salesforce.opportunity.CloseDate` | `Opportunity.CloseDate` for the renewal opp |
| `salesforce.opportunity.CSM_Forecast__c` | `Opportunity.CSM_Forecast__c` |
| `salesforce.contact.IsActive` | `Contact.IsActive` |
| `computed` | derived in the agent runtime, no direct SF source |
| `product.usage` | external product analytics, not SF |
| `decisions.hygiene-validator` | upstream decision in this app (cross-agent reference) |

### Approval payload fields

| Concept | Salesforce field | Supabase location |
|---|---|---|
| Field to update | (e.g. `Account.CSM_Save_Plan__c`) | `approvals.proposed_value.field` |
| Current value | from the SF record | `approvals.current_value.value` |
| Proposed value | the new value to write | `approvals.proposed_value.value` |
| Email To | (recipient address) | `approvals.proposed_value.to[]` |
| Email Subject | — | `approvals.proposed_value.subject` |
| Email body | — | `approvals.proposed_value.body_md` (markdown) |
| Task subject | `Task.Subject` | `approvals.proposed_value.subject` |
| Task due date | `Task.ActivityDate` | `approvals.proposed_value.due_date` |
| Task owner | `Task.OwnerId` | `approvals.proposed_value.assigned_to` |
| Related record | `Task.WhatId` (lookup) | `approvals.proposed_value.related_record` |

---

## What Angel needs from his Salesforce seeder

For each of the 10 demo accounts:

1. **Account record** with `Name`, `Industry`, `Segment__c`, `AnnualRevenue` matching the table above.
2. **Owner assignment** matching the CSM column.
3. **`CSM_Save_Plan__c`** populated according to the per-account "save plan" state (see each account block — Cobblestone/Riverside/Northstar are blank; Brightline has a stale 3-month-old note; Spruce/Riverside post-approval have updated notes).
4. **`Last_Login__c`** set so that `today − Last_Login__c == days_since_last_login` from the relevant signal.
5. **Open Opportunity** with `CloseDate = today + renewal_in_days` (only for accounts with a renewal signal — Lighthouse, Cobblestone, Brightline, Northstar, Riverside).
6. **Cases**: a count of `support_tickets_30d` open or recently closed cases per account.
7. **Tasks / Activities**: enough Task records to make `days_since_last_activity` true (e.g. Brightline's last logged Task is 41 days old; Avalon's is 47).
8. **Contacts**: for Cedar, set the primary contact's `IsActive = false`. For Lighthouse, the recipient contact must exist with email `chris@lighthouse-marketing.example`.

Once Angel's seeder runs, the **Salesforce IDs will be real** (e.g. `001ABC...`). At that point:

- Either Angel's seeder *also* writes the real IDs into our Supabase via a script (so `source_record_id` matches the live SF Id), or
- A migration script swaps the placeholders (`0015A00000A1B...`) for the real IDs in one pass before the demo.

Coordinate this swap as a separate task — it shouldn't block the spec.

---

## Open questions for Angel

1. **CSM emails.** Salesforce `User.Email` should match `taylor@example-csm.test` / `morgan@example-csm.test`. Confirm this is OK in the dev org or pick a different convention.
2. **Industries.** Inferred from account names in this doc. Confirm before seeding.
3. **Health score canonicalisation.** Do we use `Account.Health_Score__c` (numeric 0–100) plus `Account.Health_Band__c` (picklist green/yellow/red), or just the band? The seed uses the band string; the implied numerics are illustrative.
4. **Currency.** ARR is USD in this doc; confirm SF org currency.
5. **Renewal opportunities.** One open Opportunity per renewing account, or one per product line? Affects how `renewal_in_days` is computed.
6. **Avalon's "no task needed" rejection.** Should Salesforce reflect Taylor's offline action (a save plan logged Friday)? If yes, set `Avalon.CSM_Save_Plan__c` with a note dated this past Friday.

---

## Reconciliation rules

When this doc and the seed disagree:

- **For account demographics** (name, industry, segment, ARR): this doc wins. Update the seed.
- **For agent decisions and approvals** (the dynamic side): the seed wins. This doc gets re-extracted.
- **For Salesforce IDs**: the live SF org wins. Both the seed and this doc get updated by Angel's mapping script.

This doc is regenerable from the seed — keep `scripts/seed.ts` as the system of record for the dynamic data, and treat this doc as the human-readable derivative.
