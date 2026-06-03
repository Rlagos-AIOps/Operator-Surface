# CSM Playbooks (canonical reference)

Source: Customer Success operations corpus. Converted from `.docx` / `.pptx` to markdown via [microsoft/markitdown](https://github.com/microsoft/markitdown).

This is the **canon** the Hermes agents reason from when classifying accounts, drafting outreach, or recommending actions. Operator Surface UI renders the agent's reasoning; this folder is the source these agents cite when they explain themselves.

## Section 1 — CSM Playbooks (the "what do I do?" docs)

How a CSM should respond to a recurring situation. Workflow-shaped.

| Doc | Use it for | Demo agent that reads it |
|---|---|---|
| [1.5 Renewal](1.5-renewal-playbook.md) | Standard renewal motion, 60/45/30-day cadence | `renewal-outreach` |
| [1.6 At-Risk](1.6-at-risk-playbook.md) | Triage and Save Plan for accounts below 65 health | `at-risk-triage`, `hygiene-validator` |
| [1.8 Churn Save](1.8-churn-save-playbook.md) | Last-mile save after escalation | `controlled-executor` |
| [1.9 Champion Loss](1.9-champion-loss-playbook.md) | When the buyer-side champion leaves | `at-risk-triage` |
| [1.10 Leadership Turnover](1.10-leadership-turnover-playbook.md) | Customer-side exec change | `at-risk-triage` |
| [1.12 New Stakeholder Onboarding](1.12-new-stakeholder-onboarding-playbook.md) | New buyer-side contact ramps | `controlled-executor` (intro emails) |
| [1.13 Custom Scoping](1.13-custom-scoping-playbook.md) | Bespoke project framing | `sop-analyst` |

## Section 2 — SOPs (the "how do I keep my data clean?" docs)

Process rules. Compliance-shaped.

| Doc | Use it for | Demo agent that reads it |
|---|---|---|
| [2.1 Mid-Contract Cancellation](2.1-mid-contract-cancellation-sop.md) | Process when a customer signals early exit | `at-risk-triage` |
| [2.3 Risk Flag](2.3-risk-flag-sop.md) | Filing, escalating, resolving Risk Flags in SFDC | `hygiene-validator` |
| [2.5a CSM Data Hygiene](2.5a-csm-data-hygiene-sop.md) | Daily / weekly / monthly / pre-quarterly hygiene checks | `data-hygiene-audit`, `hygiene-validator` |
| [2.5b CSM Transition](2.5b-csm-transition-sop.md) | Handing off an account between CSMs | `controlled-executor` |
| [2.6 New CSM Onboarding](2.6-new-csm-onboarding-sop.md) | Ramping a new hire onto a book | (internal — agents reference) |
| [2.9 Churn Report](2.9-churn-report-sop.md) | Post-mortem after a loss | `at-risk-triage` |

## Section 3 — Communication Templates (drafts the agents can adapt)

Pre-approved email / Slack copy. These are the canon `controlled-executor` proposes from.

| Doc | Action this drafts | When the agent uses it |
|---|---|---|
| [3.5/3.6/3.7 Renewal Outreach 60/45/30 day](3.5-3.6-3.7-renewal-outreach-templates.md) | Renewal touch sequence | `renewal-outreach` proposes via `controlled-executor` |
| [3.8 At-Risk Outreach](3.8-at-risk-outreach-template.md) | Quiet-account recovery email | `at-risk-triage` |
| [3.9 Reengagement](3.9-reengagement-template.md) | After 30+ days of silence | `at-risk-triage` |
| [3.10 Post Risk Resolved](3.10-post-risk-resolved-template.md) | Once a Save Plan succeeds | `controlled-executor` |
| [3.11/3.12 Stakeholder / Leadership Turnover](3.11-3.12-stakeholder-leadership-turnover-templates.md) | Intro / re-intro emails | `controlled-executor` |

## Section 4 — Internal docs (the source of truth)

The reference material the playbooks themselves derive from. These define the constants.

| Doc | Defines | Used by |
|---|---|---|
| [4.1 Customer Health Score Model](4.1-customer-health-score-model.md) | The 5 pillars, the segment weights, the score formula | Every agent that computes or cites a health score |
| [4.2 Customer Health Score Exec Summary](4.2-customer-health-score-exec-summary.md) | Slide-deck version of 4.1 — useful for the demo narrative | Demo prep |
| [4.3 Renewal Forecast & Stages](4.3-renewal-forecast-and-stages.md) | Forecast picklist values + stage progression | `renewal-outreach` |

## How this gets used at runtime

In a future Phase, the agents won't have these documents inlined into their prompts. They'll fetch them at decision time from a managed SOP store (likely the live Google Drive folder these were exported from). This repo copy exists for:

1. **The demo** — so the Decision Trace UI can cite a "source SOP" link that resolves locally
2. **Roberto's design + UI work** — so the screens correctly reflect playbook constants (health-band thresholds, save-plan field locations, etc.)
3. **Angel's Salesforce seeder** — so demo accounts produce the data shapes these playbooks expect

## Re-exporting from source

These files were exported in one batch on 2026-06-02. To regenerate:

```bash
python3.11 -m venv /tmp/markitdown-venv
/tmp/markitdown-venv/bin/pip install 'markitdown[docx,pptx]'
cd "/path/to/Playbooks 2"
for f in *.docx *.pptx; do
  /tmp/markitdown-venv/bin/markitdown "$f" -o "${f%.*}.md"
done
```

Then copy + rename per the kebab-case scheme above.

## Original filenames

The source files use a `1.6 _ At Risk Playbook.docx` convention that's awkward in git. The repo names drop the underscores and uppercase. Mapping:

| Original | This repo |
|---|---|
| `1.5 _ Renewal _ Playbook.docx` | `1.5-renewal-playbook.md` |
| `1.6 _ At Risk Playbook.docx` | `1.6-at-risk-playbook.md` |
| `1.8 _ Churn Save _ Playbook.docx` | `1.8-churn-save-playbook.md` |
| `1.9 _ Champion Loss _ Playbook.docx` | `1.9-champion-loss-playbook.md` |
| `1.10 _ Leadership Turnover _ Playbook.docx` | `1.10-leadership-turnover-playbook.md` |
| `1.12 _ New Stakeholder Onboarding _ Playbook.docx` | `1.12-new-stakeholder-onboarding-playbook.md` |
| `1.13 _ Custom Scoping _ Playbook.docx` | `1.13-custom-scoping-playbook.md` |
| `2.1 _ Mid-Contract Cancellation _ SOP.docx` | `2.1-mid-contract-cancellation-sop.md` |
| `2.3 _ Risk Flag _ SOP.docx` | `2.3-risk-flag-sop.md` |
| `2.5 _ CSM Data Hygiene _ SOP.docx` | `2.5a-csm-data-hygiene-sop.md` |
| `2.5 _ CSM Transition _ SOP.docx` | `2.5b-csm-transition-sop.md` *(disambiguated — two source docs share §2.5)* |
| `2.6 _ New CSM Onboarding _ SOP.docx` | `2.6-new-csm-onboarding-sop.md` |
| `2.9 _ Churn Report _ SOP.docx` | `2.9-churn-report-sop.md` |
| `3.5_3.6_3.7 _ Renewal Outreach 60_45_30 Day _ Comm Template.docx` | `3.5-3.6-3.7-renewal-outreach-templates.md` |
| `3.8 _ At Risk Outreach _ Comm Template.docx` | `3.8-at-risk-outreach-template.md` |
| `3.9 _ Reengagement _ Comm Template.docx` | `3.9-reengagement-template.md` |
| `3.10 _ Post Risk Resolved _ Comm Template.docx` | `3.10-post-risk-resolved-template.md` |
| `3.11_3.12 _ New Stakeholder_Leadership Turnover _ Comm Template.docx` | `3.11-3.12-stakeholder-leadership-turnover-templates.md` |
| `4.1 _ Customer Health Score Model _ Internal Doc.docx` | `4.1-customer-health-score-model.md` |
| `4.2 _ Customer Health Score Exec Summary _ Internal Doc.pptx` | `4.2-customer-health-score-exec-summary.md` |
| `4.3 _ Renewal Forecast & Stages _ Internal Doc.docx` | `4.3-renewal-forecast-and-stages.md` |
