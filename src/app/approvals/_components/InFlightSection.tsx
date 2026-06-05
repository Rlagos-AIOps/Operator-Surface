import { ApprovalCard } from "./ApprovalCard";
import {
  type ApprovalRow,
  getExecutionMetadata,
  getUiState,
} from "./types";

interface Props {
  items: ApprovalRow[];
}

/**
 * "In flight" — approvals the CSM has decided on, that Hermes is currently
 * executing (or retrying) in the background. Visually distinct from the
 * "Need you" queue above (which needs CSM attention) and from
 * "Recently decided" below (which is finished).
 *
 * Cards in this section are read-only from the CSM's perspective — there's
 * no manual Retry button. The auto-retry service on the droplet handles
 * re-dispatch on a [2, 5, 10, 20] minute backoff schedule. After 4
 * exhausted attempts, the card surfaces a "needs attention" badge but
 * still doesn't ask the CSM to do anything — they can ping an admin.
 */
export function InFlightSection({ items }: Props) {
  if (items.length === 0) return null;

  const needsAttention = items.filter((a) => {
    const m = getExecutionMetadata(a);
    return !!m.execution_blocker;
  }).length;

  return (
    <section className="mt-s7">
      <div className="mb-s4 flex items-center gap-s3 border-t border-border pt-s5">
        <span className="relative inline-flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-pill bg-volt opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-pill bg-volt" />
        </span>
        <span className="font-serif text-h3 text-foreground">In flight</span>
        <span className="tabular text-small text-muted-foreground">
          {items.length}
        </span>
        {needsAttention > 0 && (
          <span className="ml-s2 inline-flex items-center gap-s2 rounded-pill bg-bad/15 px-s3 py-[2px] text-micro font-bold uppercase tracking-wider text-bad">
            {needsAttention} needs attention
          </span>
        )}
      </div>

      <div className="flex flex-col gap-s4">
        {items.map((a) => (
          <ApprovalCard key={a.id} approval={a} mode="readonly" />
        ))}
      </div>
    </section>
  );
}
