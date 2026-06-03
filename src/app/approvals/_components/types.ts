import type { Database } from "@/lib/supabase/types";

/**
 * Row shape the approvals page passes around. Matches the page's
 * Supabase query. Kept here so client components can import the type
 * without dragging server-only modules along.
 */
export type ApprovalRow = Database["public"]["Tables"]["approvals"]["Row"] & {
  agent: { slug: string; name: string } | null;
};

export type ApprovalStatus = ApprovalRow["status"];
