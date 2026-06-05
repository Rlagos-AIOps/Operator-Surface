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
      {/* Promoted from eyebrow → proper H3 per walkthrough feedback —
          "5 priorities today" read as too quiet against the dark bg. */}
      <h2 className="mb-s4 font-serif text-h3 text-paper">
        {sorted.length} {sorted.length === 1 ? "priority" : "priorities"} today
      </h2>
      <ol className="overflow-hidden rounded-lg border border-surface-edge bg-surface">
        {sorted.map((p, i) => {
          // Deep-link into the account-filtered Approvals view. Reuses
          // the ?account= URL pattern from Task 4. Encoded so SF
          // record ids (which look like 001gK0000178EfcQAE) round-trip
          // cleanly through Next 16's async searchParams.
          const href = p.account_id
            ? `/approvals?account=${encodeURIComponent(p.account_id)}`
            : "/approvals";
          return (
            <li
              key={`${p.rank}-${i}`}
              className={i > 0 ? "border-t border-surface-edge/60" : ""}
            >
              <Link
                href={href}
                className="flex items-center gap-s4 px-s5 py-s4 transition-colors duration-fast hover:bg-surface-2"
              >
                <span className="font-serif text-h3 text-lime tabular w-s7 shrink-0">
                  {p.rank}
                </span>
                <span className="flex-1 text-h4 font-medium text-paper">
                  {plainEnglish(p.summary)}
                </span>
                <span className="hidden text-micro uppercase tracking-wider text-muted sm:inline">
                  {p.account_id ? "Open in queue" : "Approvals"}
                </span>
                <ChevronRight
                  className="h-4 w-4 text-muted"
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
