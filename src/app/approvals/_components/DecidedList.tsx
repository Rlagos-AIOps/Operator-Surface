import { ApprovalCard } from "./ApprovalCard";
import type { ApprovalRow } from "./types";

interface Props {
  decided: ApprovalRow[];
}

/**
 * Recently decided approvals, hidden behind a native <details>
 * disclosure so we don't need JS for the toggle.
 */
export function DecidedList({ decided }: Props) {
  if (decided.length === 0) return null;

  return (
    <details className="mt-s8 group">
      <summary className="flex cursor-pointer items-center gap-s3 border-t border-border pt-s5 text-foreground">
        <span className="font-serif text-h3">Recently decided</span>
        <span className="tabular text-small text-muted-foreground">
          {decided.length}
        </span>
        <span className="ml-auto text-micro uppercase tracking-wider text-muted-foreground group-open:hidden">
          show
        </span>
        <span className="ml-auto text-micro uppercase tracking-wider text-muted-foreground hidden group-open:inline">
          hide
        </span>
      </summary>

      <div className="mt-s5 flex flex-col gap-s4 opacity-90">
        {decided.map((a) => (
          <ApprovalCard key={a.id} approval={a} mode="readonly" />
        ))}
      </div>
    </details>
  );
}
