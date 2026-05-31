"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  { label: "Overview", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Operator app", href: "/app" },
  { label: "Clients", href: "/clients" },
  { label: "Agents", href: "/agents" },
  { label: "Styleguide", href: "/styleguide" },
] as const;

function WaveMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} fill="none" aria-hidden>
      <path d="M2 18c3.5 0 3.5-8 7-8s3.5 8 7 8 3.5-8 7-8" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
      <path d="M2 22c3.5 0 3.5-5 7-5s3.5 5 7 5 3.5-5 7-5" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" opacity="0.45" />
    </svg>
  );
}

function useActive() {
  const pathname = usePathname();
  return (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
}

export function Masthead() {
  const isActive = useActive();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1320px] items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-foreground" onClick={() => setOpen(false)}>
          <span className="text-primary">
            <WaveMark className="size-5" />
          </span>
          <span className="font-mono text-[13px] font-semibold uppercase tracking-[0.18em]">Ops Surfer</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center justify-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "font-mono text-[11px] uppercase tracking-[0.16em] transition-colors",
                isActive(item.href) ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <kbd className="hidden items-center gap-1 rounded-md border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground lg:inline-flex">
            <span className="text-[12px] leading-none">⌘</span>K
          </kbd>
          <ThemeToggle />
          <Link
            href="/app"
            className="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-foreground transition-colors hover:text-primary md:inline-flex"
          >
            Launch app ↗
          </Link>
          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="glass grid size-9 place-items-center rounded-full text-foreground md:hidden"
          >
            {open ? <X className="size-[18px]" strokeWidth={1.75} /> : <Menu className="size-[18px]" strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-md md:hidden">
          <nav className="mx-auto flex max-w-[1320px] flex-col gap-1 px-4 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 font-mono text-xs uppercase tracking-[0.16em] transition-colors",
                  isActive(item.href) ? "bg-surface-2 text-primary" : "text-muted-foreground hover:bg-surface hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/app"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground"
            >
              Launch app ↗
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
