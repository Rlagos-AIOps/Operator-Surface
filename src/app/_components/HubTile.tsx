import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface Props {
  num: string;
  title: string;
  description: string;
  meta: React.ReactNode;
  href: string;
  /** Optional accent color for the title — falls back to paper. */
  titleClassName?: string;
}

export function HubTile({
  num,
  title,
  description,
  meta,
  href,
  titleClassName,
}: Props) {
  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col rounded-xl border border-surface-edge bg-surface p-s6 shadow-e1 transition-all duration-base hover:border-lime/40 hover:shadow-e2"
    >
      <span className="eyebrow mb-s5 text-muted">
        {num}
      </span>
      <h3
        className={`font-serif text-h2 leading-tight text-balance mb-s4 ${titleClassName ?? "text-paper"}`}
      >
        {title}
      </h3>
      <p className="mb-s6 max-w-[34ch] text-body text-paper/80 leading-relaxed">
        {description}
      </p>
      <div className="mt-auto flex items-end justify-between gap-s3">
        <div className="text-small text-muted">{meta}</div>
        <span
          aria-hidden
          className="flex h-9 w-9 items-center justify-center rounded-pill border border-paper/20 text-paper transition-all duration-base group-hover:border-lime group-hover:bg-lime group-hover:text-ink"
        >
          <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}
