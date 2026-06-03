import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PANEL, LIFT } from "@/components/ui/surfaces";

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
      className={`group relative flex h-full flex-col p-s6 ${PANEL} ${LIFT}`}
    >
      <span className="eyebrow mb-s5 text-muted-foreground">
        {num}
      </span>
      <h3
        className={`font-serif text-h2 leading-tight text-balance mb-s4 ${titleClassName ?? "text-foreground"}`}
      >
        {title}
      </h3>
      <p className="mb-s6 max-w-[34ch] text-body text-foreground/80 leading-relaxed">
        {description}
      </p>
      <div className="mt-auto flex items-end justify-between gap-s3">
        <div className="text-small text-muted-foreground">{meta}</div>
        <span
          aria-hidden
          className="flex h-9 w-9 items-center justify-center rounded-pill border border-border/20 text-foreground transition-all duration-base group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
        >
          <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}
