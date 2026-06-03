import Link from "next/link";
import { cn } from "@/lib/utils";
import { StatusDot } from "@/components/ui/accents";
import { NAV_ICON } from "./nav-icons";

function WaveMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} fill="none" aria-hidden>
      <path d="M2 18c3.5 0 3.5-8 7-8s3.5 8 7 8 3.5-8 7-8" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
      <path d="M2 22c3.5 0 3.5-5 7-5s3.5 5 7 5 3.5-5 7-5" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" opacity="0.45" />
    </svg>
  );
}

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/" },
      { label: "Daily Brief", href: "/brief" },
      { label: "Approval Queue", href: "/approvals" },
      { label: "Decision Trace", href: "/decisions" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "#" },
      { label: "Support", href: "#" },
    ],
  },
];

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={cn("mt-20 border-t border-border", className)}>
      <div className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          {/* brand */}
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2 text-foreground">
              <span className="text-primary">
                <WaveMark className="size-5" />
              </span>
              <span className="font-mono text-[13px] font-semibold uppercase tracking-[0.18em]">Ops Surfer</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              The operator surface for Customer Success — see what your agents did, and approve what they do next.
            </p>
          </div>
          {/* link columns */}
          {COLUMNS.map((col) => (
            <nav key={col.title} className="flex flex-col gap-3">
              <span className="eyebrow text-muted-foreground">{col.title}</span>
              {col.links.map((l) => {
                const Icon = NAV_ICON[l.href];
                return (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="inline-flex items-center gap-2 text-sm text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {Icon && <Icon className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />}
                    {l.label}
                  </Link>
                );
              })}
            </nav>
          ))}
        </div>

        {/* bottom bar */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          <span className="eyebrow text-muted-foreground">© 2026 Ops Surfer · v0.4</span>
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <StatusDot tone="good" pulse />
            <span className="eyebrow">agent online · last sync 14s ago</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
