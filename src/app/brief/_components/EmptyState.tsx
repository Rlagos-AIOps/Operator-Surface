import Link from "next/link";
import { Inbox } from "lucide-react";

export function EmptyState({ operatorEmail }: { operatorEmail: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card px-s5 py-s9 text-center">
      <Inbox className="mb-s4 h-12 w-12 text-muted-foreground" strokeWidth={1.75} />
      <p className="font-serif text-h3 text-foreground">No brief yet.</p>
      <p className="mt-s2 max-w-[44ch] text-small text-muted-foreground">
        <span className="font-mono text-foreground">galileo</span> hasn&rsquo;t
        published a brief for <span className="font-mono">{operatorEmail}</span>{" "}
        yet. As soon as a morning brief lands, you&rsquo;ll see it here.
      </p>
      <div className="mt-s5 flex gap-s3">
        <Link
          href="/approvals"
          className="rounded-md bg-primary px-s5 py-s2 text-small font-bold text-primary-foreground transition-colors duration-fast hover:bg-volt"
        >
          See the approval queue
        </Link>
        <Link
          href="/decisions"
          className="rounded-md border border-border/25 px-s5 py-s2 text-small font-semibold text-foreground transition-colors duration-fast hover:bg-card/5"
        >
          See decisions
        </Link>
      </div>
    </div>
  );
}
