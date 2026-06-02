import { LEADS, type Lead } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Badge, type Tone } from "@/components/site/accents";
import { PageHeader, LiveSignage } from "@/components/site/page-header";
import { LIFT } from "@/components/site/surfaces";

const INTENT_TONE: Record<string, Tone> = { high: "hot", mid: "warm", cold: "cold" };

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
    <div className={cn("surface rounded-xl p-4", LIFT)}>
      <div className="flex items-center justify-between gap-2">
        <p className="truncate font-medium text-foreground">{lead.name}</p>
        <Badge tone={INTENT_TONE[lead.intent] ?? "muted"} dot>
          {lead.intent}
        </Badge>
      </div>
      <p className="mt-1 truncate text-xs text-muted-foreground">
        {lead.role} · {lead.company}
      </p>
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span className="num font-mono text-xs text-muted-foreground">score {lead.score}</span>
        <span className="num text-xs text-muted-foreground">{lead.time}</span>
      </div>
    </div>
  );
}

export default function PipelinePage() {
  return (
    <div className="px-5 py-8 sm:px-7 sm:py-10">
      <PageHeader
        eyebrow="Deal flow"
        title="Pipeline"
        subtitle="Leads move stage by stage — the agent keeps it current."
        right={<LiveSignage stamp="auto-sorted · live" />}
      />

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {COLUMNS.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <span className="eyebrow text-foreground">{col.title}</span>
              <span className="num text-xs text-muted-foreground">{col.leads.length}</span>
            </div>
            <div className="dashed flex min-h-24 flex-col gap-2 rounded-2xl p-2">
              {col.leads.length ? (
                col.leads.map((l) => <LeadCard key={l.id} lead={l} />)
              ) : (
                <span className="px-2 py-6 text-center text-xs text-muted-foreground">Nothing here yet</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
