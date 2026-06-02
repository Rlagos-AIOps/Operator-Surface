import type { Database } from "@/lib/supabase/types";

/**
 * Row shape passed from the decisions page to its components. Matches
 * the page's Supabase query.
 */
export type DecisionRow = Database["public"]["Tables"]["decisions"]["Row"] & {
  agent: { slug: string; name: string } | null;
  agent_run: {
    id: string;
    started_at: string;
    status: Database["public"]["Tables"]["agent_runs"]["Row"]["status"];
    triggered_by: string | null;
    input_summary: string | null;
  } | null;
};

/**
 * Convention for entries in `decisions.signals` (jsonb array). See
 * docs/schema-conventions.md.
 */
export interface SignalEntry {
  name: string;
  value: unknown;
  weight?: number;
  note?: string;
  source?: string;
}
