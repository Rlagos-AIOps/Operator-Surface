/**
 * Tooltip copy registry — keyed by stable identifiers used at the
 * `<InfoIcon tooltipKey="..." />` call site so a junior CSM hovering on
 * an unfamiliar number sees a plain-English explanation.
 *
 * Adding a new tooltip is a one-line registry entry. Editing copy is a
 * one-place change. Keep entries short (1–3 sentences); the tooltip is
 * a hover affordance, not a doc page.
 */

export const TOOLTIPS = {
  atRiskConfidence:
    "How strong the at-risk signal is, from 0 to 1. Closer to 1 means this account is more likely to churn. Lighthouse at 0.91 is our strongest at-risk signal in the book.",
  upsellConfidence:
    "How likely this upsell signal is real and worth a conversation, from 0 to 1. Above 0.7 means it's worth a CSM-led conversation. This is NOT the probability of close-won — it's the probability the signal itself is valid.",
  healthBand:
    "Composite health score for the account, from 0 to 100, pulled from Salesforce. Green > 70, Yellow 40–70, Red < 40. Treat as stale if it contradicts recent engagement signals.",
  arr: "Annual recurring revenue — what this account pays you per year. Used to weight prioritization.",
  grr: "Gross recurring revenue — what percentage of last year's ARR you renewed, before any expansion. Drops when accounts churn or downgrade.",
  daysToRenewal:
    "Calendar days until this account's renewal. Most contracts auto-renew 15–30 days before the renewal date, so under 30 days means the save window is shrinking fast.",
  decisionConfidence:
    "How confident the agent is in this decision, from 0 to 1. Below 0.5 means the agent flagged this for closer human review.",
  riskBand:
    "Final risk level for this item. Anything tied to a high-risk account inherits high-risk priority — even if the individual task looks low-stakes on its own.",
  signalWeight:
    "How much this signal contributed to the final decision, as a percent of total weight. Bigger bar = bigger influence.",
} as const;

export type TooltipKey = keyof typeof TOOLTIPS;
