import type { Database } from "@/lib/supabase/types";

export type BriefRow = Database["public"]["Tables"]["briefs"]["Row"] & {
  generated_run: {
    id: string;
    started_at: string;
    status: Database["public"]["Tables"]["agent_runs"]["Row"]["status"];
    input_summary: string | null;
  } | null;
};

/* Structured data shapes — see docs/schema-conventions.md */

export interface Kpi {
  label: string;
  value: string | number;
  delta?: number | string | null;
  trend?: "up" | "down" | "flat";
}

export interface Chip {
  label: string;
  kind?: "danger" | "warning" | "success" | "info";
}

export interface Priority {
  rank: number;
  summary: string;
  account_id?: string;
  action?: string;
}

export interface Ref {
  type: string;
  id: string;
  label: string;
}

export interface BriefStructuredData {
  kpis?: Kpi[];
  chips?: Chip[];
  priorities?: Priority[];
  refs?: Ref[];
}
