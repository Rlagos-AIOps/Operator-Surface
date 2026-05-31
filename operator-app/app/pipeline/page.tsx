import { LEADS, type Lead } from "@/lib/data";

const INTENT: Record<string, string> = {
  high: "text-primary",
  mid: "text-amber",
  cold: "text-muted-foreground",
};

// Distribute the real leads across pipeline columns, with a couple closed-won.
const COLUMNS: { title: string; leads: Lead[] }[] = [
  { title: "New", leads: LEADS.filter((l) => l.id === "tom") },
  { title: "Intake", leads: LEADS.filter((l) => ["devon", "ben"].includes(l.id)) },
  { title: "Qualify", leads: LEADS.filter((l) => ["maya", "priya"].includes(l.id)) },
  { title: "Proposal", leads: LEADS.filter((l) => l.id === "aileen") },
  { title: "Won", leads: [] },
];

function LeadCard({ lead }: { lead: Lead }) {
  return (
    <div className="surface rounded-xl p-4 transition-colors hover:bg-surface-2">
      <div className="flex items-center justify-between gap-2">
        <p className="font-medium">{lead.name}</p>
        <span className={`eyebrow ${INTENT[lead.intent]}`}>{lead.intent}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {lead.role} · {lead.company}
      </p>
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span className="num font-mono text-xs text-muted-foreground">
          score {lead.score}
        </span>
        <span className="num text-xs text-muted-foreground">{lead.time}</span>
      </div>
    </div>
  );
}

export default function PipelinePage() {
  return (
    <div className="mx-auto max-w-[1320px] px-6 py-8 sm:py-10">
      <p className="eyebrow text-muted-foreground">Deal flow</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">Pipeline</h1>
      <p className="mt-2 text-muted-foreground">
        Leads move stage by stage — the agent keeps it current.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {COLUMNS.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <span className="eyebrow text-foreground">{col.title}</span>
              <span className="num text-xs text-muted-foreground">
                {col.leads.length}
              </span>
            </div>
            <div className="flex min-h-24 flex-col gap-2 rounded-2xl border border-dashed border-border p-2">
              {col.leads.length ? (
                col.leads.map((l) => <LeadCard key={l.id} lead={l} />)
              ) : (
                <span className="px-2 py-6 text-center text-xs text-muted-foreground">
                  Nothing here yet
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
