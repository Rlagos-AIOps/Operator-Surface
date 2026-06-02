import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getDemoOperatorId, getDemoOperatorEmail } from "@/lib/supabase/operator";
import { BriefHeader } from "./_components/BriefHeader";
import { KpiRow } from "./_components/KpiRow";
import { ChipRow } from "./_components/ChipRow";
import { BodyMd } from "./_components/BodyMd";
import { PriorityList } from "./_components/PriorityList";
import { BriefFooter } from "./_components/BriefFooter";
import { EmptyState } from "./_components/EmptyState";
import type {
  BriefRow,
  BriefStructuredData,
  Chip,
  Kpi,
  Priority,
} from "./_components/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Daily Brief — Operator Surface",
};

export default async function BriefPage() {
  const sb = createSupabaseAdminClient();
  const operatorId = await getDemoOperatorId();

  const { data, error } = await sb
    .from("briefs")
    .select(
      `
        id, operator_id, brief_date, headline, body_md, structured_data,
        generated_at, viewed_at, generated_by, created_at, updated_at,
        generated_run:agent_runs ( id, started_at, status, input_summary )
      `,
    )
    .eq("operator_id", operatorId)
    .order("brief_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return (
      <main className="min-h-screen bg-bg-deep px-s5 py-s8">
        <div className="mx-auto max-w-[1000px]">
          <p className="eyebrow mb-s2">Daily Brief</p>
          <h1 className="font-serif text-h1 text-paper">Something went wrong.</h1>
          <p className="mt-s4 text-body text-danger">
            <span className="font-bold">DB error:</span> {error.message}
          </p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-bg-deep">
        <div className="mx-auto max-w-[1000px] px-s5 py-s8">
          <p className="eyebrow mb-s2">Daily Brief</p>
          <h1 className="font-serif text-h1 text-paper mb-s6">
            No brief for you yet.
          </h1>
          <EmptyState operatorEmail={getDemoOperatorEmail()} />
        </div>
      </main>
    );
  }

  const brief = data as BriefRow;
  const sd = (brief.structured_data ?? {}) as unknown as BriefStructuredData;
  const kpis: Kpi[] = sd.kpis ?? [];
  const chips: Chip[] = sd.chips ?? [];
  const priorities: Priority[] = sd.priorities ?? [];

  return (
    <main className="min-h-screen bg-bg-deep">
      <div className="mx-auto max-w-[1000px] px-s5 py-s8">
        <BriefHeader brief={brief} />
        <KpiRow kpis={kpis} />
        <ChipRow chips={chips} />
        <BodyMd source={brief.body_md} />
        <PriorityList priorities={priorities} />
        <BriefFooter brief={brief} />
      </div>
    </main>
  );
}
