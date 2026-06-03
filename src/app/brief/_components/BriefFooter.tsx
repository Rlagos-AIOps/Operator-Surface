import type { BriefRow } from "./types";
import { timeAgo } from "@/app/approvals/_components/Badges";

interface Props {
  brief: BriefRow;
}

export function BriefFooter({ brief }: Props) {
  const run = brief.generated_run;
  const isLive = run?.status === "running";
  return (
    <footer className="mt-s7 border-t border-border pt-s5 text-small text-muted-foreground">
      <p>
        Generated {timeAgo(brief.generated_at)} by{" "}
        <span className="font-mono text-foreground">galileo</span>
        {run?.input_summary && (
          <>
            {" · "}
            <span className="italic">{run.input_summary}</span>
          </>
        )}
        {isLive && (
          <span className="ml-s2 font-bold uppercase tracking-wider text-volt">
            still running
          </span>
        )}
      </p>
      <p className="mt-s1 text-micro">
        Brief {brief.brief_date} ·{" "}
        {brief.viewed_at ? (
          <>
            viewed {timeAgo(brief.viewed_at)}
          </>
        ) : (
          <span className="text-primary">not yet viewed</span>
        )}
      </p>
    </footer>
  );
}
