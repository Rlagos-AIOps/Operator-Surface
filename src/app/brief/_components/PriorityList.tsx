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
      <p className="eyebrow mb-s4">Priorities</p>
      <ol className="overflow-hidden rounded-lg border border-surface-edge bg-surface">
        {sorted.map((p, i) => (
          <li
            key={`${p.rank}-${i}`}
            className={i > 0 ? "border-t border-surface-edge/60" : ""}
          >
            <Link
              href="/approvals"
              className="flex items-center gap-s4 px-s5 py-s4 transition-colors duration-fast hover:bg-surface-2"
            >
              <span className="font-serif text-h3 text-lime tabular w-s7 shrink-0">
                {p.rank}
              </span>
              <span className="flex-1 text-body text-paper">{plainEnglish(p.summary)}</span>
              <span className="hidden text-micro uppercase tracking-wider text-muted sm:inline">
                Approvals
              </span>
              <ChevronRight
                className="h-4 w-4 text-muted"
                strokeWidth={1.75}
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
