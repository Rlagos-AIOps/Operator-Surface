import { AgentBadge, timeAgo } from "@/app/approvals/_components/Badges";
import { ConfidenceMeter } from "./ConfidenceMeter";
import { DecisionTypeBadge } from "./DecisionTypeBadge";
import { VerdictBadge } from "./VerdictBadge";
import { SignalTrace } from "./SignalTrace";
import type { DecisionRow, SignalEntry } from "./types";
import { PANEL } from "@/components/ui/surfaces";
import { accountDisplayName, plainEnglish } from "@/lib/copy/overrides";

interface Props {
  decision: DecisionRow;
}

export function DecisionCard({ decision }: Props) {
  const metadata = (decision.metadata ?? {}) as { account_name?: string };
  const signals = (decision.signals ?? []) as unknown as SignalEntry[];
  const run = decision.agent_run;

  // Postgres numeric round-trips as string sometimes; normalize.
  const confidence =
    decision.confidence == null ? null : Number(decision.confidence);

  return (
    <article className={`p-s5 ${PANEL}`}>
      {/* Top row: agent + decision type + confidence + time */}
      <header className="mb-s4 flex flex-wrap items-center gap-s2">
        {decision.agent && (
          <AgentBadge slug={decision.agent.slug} name={decision.agent.name} />
        )}
        <DecisionTypeBadge type={decision.decision_type} />
        <ConfidenceMeter value={confidence} />
        <div className="flex-1" />
        <span className="text-micro text-muted-foreground tabular">
          {timeAgo(decision.created_at)}
        </span>
      </header>

      {/* Account + target id */}
      <div className="mb-s4">
        {metadata.account_name && (
          <h3 className="font-serif text-h3 text-foreground">
            {accountDisplayName(metadata.account_name)}
          </h3>
        )}
        <p className="mt-[2px] font-mono text-micro text-muted-foreground">
          {decision.source_record_type} ·{" "}
          <span className="text-muted-foreground">{decision.source_record_id}</span>
        </p>
      </div>

      {/* Verdict */}
      <div className="mb-s4 flex flex-wrap items-center gap-s3">
        <span className="text-micro font-bold uppercase tracking-wider text-muted-foreground">
          Verdict
        </span>
        <VerdictBadge label={decision.label} />
      </div>

      {/* Reasoning */}
      {decision.reasoning && (
        <p className="max-w-[72ch] text-body text-foreground">
          {plainEnglish(decision.reasoning)}
        </p>
      )}

      {/* Signals */}
      <SignalTrace signals={signals} />

      {/* Source run footer */}
      {run && (
        <footer className="mt-s5 border-t border-border pt-s4 text-small text-muted-foreground">
          Source run ·{" "}
          <span className="font-mono text-foreground">
            {decision.agent?.slug ?? "?"}
          </span>
          {run.input_summary && (
            <>
              {" "}
              · <span className="italic">{run.input_summary}</span>
            </>
          )}{" "}
          · {timeAgo(run.started_at)} · status:{" "}
          <span className="text-foreground">{run.status}</span>
        </footer>
      )}
    </article>
  );
}
