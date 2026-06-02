import Link from "next/link";
import { Inbox } from "lucide-react";

export function EmptyState({ operatorEmail }: { operatorEmail: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-surface-edge bg-surface px-s5 py-s9 text-center">
      <Inbox className="mb-s4 h-12 w-12 text-muted" strokeWidth={1.75} />
      <p className="font-serif text-h3 text-paper">No brief yet.</p>
      <p className="mt-s2 max-w-[44ch] text-small text-muted">
        <span className="font-mono text-paper">galileo</span> hasn&rsquo;t
        published a brief for <span className="font-mono">{operatorEmail}</span>{" "}
        yet. As soon as a morning brief lands, you&rsquo;ll see it here.
      </p>
      <div className="mt-s5 flex gap-s3">
        <Link
          href="/approvals"
          className="rounded-md bg-lime px-s5 py-s2 text-small font-bold text-ink transition-colors duration-fast hover:bg-volt"
        >
          See the approval queue
        </Link>
        <Link
          href="/decisions"
          className="rounded-md border border-paper/25 px-s5 py-s2 text-small font-semibold text-paper transition-colors duration-fast hover:bg-paper/5"
        >
          See decisions
        </Link>
      </div>
    </div>
  );
}
