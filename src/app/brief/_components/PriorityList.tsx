import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Priority } from "./types";
import { plainEnglish } from "@/lib/copy/overrides";

interface Props {
  priorities: Priority[];
}

export function PriorityList({ priorities }: Props) {
  if (priorities.length === 0) return null;
  const sorted = [...priorities].sort((a, b) => a.rank - b.rank);
  return (
    <section className="mb-s7">
      {/* Promoted from eyebrow → H3 so the priority section reads as a
          page-level beat, not a sidebar. */}
      <h2 className="mb-s4 font-serif text-h3 text-foreground">
        {sorted.length} {sorted.length === 1 ? "priority" : "priorities"} today
      </h2>
      <ol className="overflow-hidden rounded-lg border border-border bg-card">
        {sorted.map((p, i) => {
          // Deep-link to the account-scoped approval queue when we know
          // which SF record this priority is about. Falls back to bare
          // /approvals for legacy rows without account_id.
          const href = p.account_id
            ? `/approvals?account=${encodeURIComponent(p.account_id)}`
            : "/approvals";
          return (
            <li
              key={`${p.rank}-${i}`}
              className={i > 0 ? "border-t border-border/60" : ""}
            >
              <Link
                href={href}
                className="flex items-center gap-s4 px-s5 py-s4 transition-colors duration-fast hover:bg-card"
              >
                <span className="font-serif text-h3 text-primary tabular w-s7 shrink-0">
                  {p.rank}
                </span>
                <span className="flex-1 text-h4 font-medium text-foreground">
                  {plainEnglish(p.summary)}
                </span>
                <span className="hidden text-micro uppercase tracking-wider text-muted-foreground sm:inline">
                  {p.account_id ? "Open in queue" : "Approvals"}
                </span>
                <ChevronRight
                  className="h-4 w-4 text-muted-foreground"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
