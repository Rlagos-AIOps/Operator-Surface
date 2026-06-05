/**
 * Copy overrides — stopgap rewrites of strings stored in Supabase that
 * came back from the walkthrough as too corporate, contradictory, or
 * redundant for a CSM audience.
 *
 * Why this exists: seeded content lives in `scripts/seed.ts` and ships
 * into Postgres at seed time. We can't reliably rewrite all live demo
 * data before Friday. Until the seed is re-run end-to-end, components
 * call `rewriteCopy(text)` on user-facing strings and we substitute the
 * improved copy. The seed file has been updated in parallel so a
 * re-seed makes this module a no-op.
 *
 * Keys are *fragments* (matched with `includes`) so small DB drift
 * (whitespace, a trailing period) doesn't break the override. Values
 * are the full replacement string.
 *
 * Remove an entry once the seed and DB agree.
 */

interface Override {
  match: string;
  replace: string;
}

const OVERRIDES: Override[] = [
  // Brief priority line — Lighthouse vs Cobblestone ordering is wrong in
  // the seed; soften the copy until Angel fixes the underlying data
  // ordering.
  {
    match: "Lighthouse is the clearest churn risk",
    replace:
      "Cobblestone Realty and Lighthouse Marketing are the two clearest churn risks — start with Cobblestone (94 days out, hygiene flag) then Lighthouse (38 days, 0.91 at-risk).",
  },
  // Beacon Logistics — redundant second sentence.
  {
    match: "there has been no login in 95 days and zero logged activity",
    replace: "Beacon hasn't logged a single login in 95 days",
  },
  // Beacon Logistics — tighten wordy contradiction copy.
  {
    match:
      "The health score is stale and directly contradicts the engagement signals — do NOT trust the green band. Treat as unverified pending a data refresh; this is exactly the kind of contradiction that hides churn.",
    replace:
      "Health score (green) contradicts the engagement signals (95 days silent). Treat the green band as stale — pending a data refresh.",
  },
  // Cobblestone Book widget — lead with the number that matters.
  {
    match:
      "Combining hygiene-validator's at-risk flag with the renewal date (94 days) and the $84k ARR puts Cobblestone at the top of today's queue. Touchpoint recommended before EOD.",
    replace:
      "Cobblestone is 94 days from renewal and the hygiene audit just flagged it at-risk. At $84k ARR (annual recurring revenue), it's the top priority in your queue today.",
  },
];

export function rewriteCopy(text: string | null | undefined): string {
  if (!text) return "";
  let out = text;
  for (const o of OVERRIDES) {
    if (out.includes(o.match)) {
      out = out.replace(o.match, o.replace);
    }
  }
  return out;
}

/**
 * Account display name — reframes the seeded "North Star Print" so it
 * reads as a SaaS account in the CSM book, not a printing company.
 * Per Roberto: web-app-side only, no DB changes.
 */
const ACCOUNT_DISPLAY: Record<string, string> = {
  "North Star Print": "North Star Print (analytics platform)",
  Northstar: "Northstar Analytics",
};

export function accountDisplayName(name: string | null | undefined): string {
  if (!name) return "";
  return ACCOUNT_DISPLAY[name] ?? name;
}

/**
 * Salesforce record URL for an account ID. Null when id is missing —
 * callers fall back to bare text for rows whose source record isn't a
 * Salesforce Account.
 *
 * The instance subdomain is Roberto's dev org. Move to env var when
 * the demo isn't the next thing on the calendar.
 */
const SF_INSTANCE = "orgfarm-f3d0d0ded9-dev-ed.develop";

export function accountSalesforceUrl(
  accountId: string | null | undefined,
): string | null {
  if (!accountId) return null;
  return `https://${SF_INSTANCE}.lightning.force.com/lightning/r/Account/${accountId}/view`;
}

/**
 * Expand the first occurrence of bare acronyms (ARR, GRR) per text
 * block. Subsequent occurrences stay bare. Word-boundary safe so we
 * don't munge code identifiers like `currARR`.
 */
const ACRONYMS: Array<[RegExp, string]> = [
  [/\bARR\b/, "ARR (annual recurring revenue)"],
  [/\bGRR\b/, "GRR (gross recurring revenue)"],
];

export function expandAcronyms(text: string | null | undefined): string {
  if (!text) return "";
  let out = text;
  for (const [pattern, expanded] of ACRONYMS) {
    out = out.replace(pattern, expanded);
  }
  return out;
}

/** Apply all transforms in order. */
export function plainEnglish(text: string | null | undefined): string {
  return expandAcronyms(rewriteCopy(text));
}
