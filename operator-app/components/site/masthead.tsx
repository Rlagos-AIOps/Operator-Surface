"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ICON } from "./nav-icons";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  { label: "Overview", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Operator app", href: "/app" },
  { label: "Clients", href: "/clients" },
  { label: "Leads", href: "/leads" },
  { label: "ROI", href: "/roi" },
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
  // usePathname() can be null (e.g. outside an App Router context / Storybook
  // mock) — fall back to "/" so the startsWith() below never throws.
  const pathname = usePathname() ?? "/";
  return (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
}

export function Masthead({ className }: { className?: string }) {
  const isActive = useActive();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Slide up on scroll-down; reveal on scroll-up OR when the pointer reaches the top edge.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY && y > 96) setHidden(true);
      else if (y < lastY) setHidden(false);
      lastY = y;
    };
    const onMove = (e: MouseEvent) => {
      if (e.clientY <= 16) setHidden(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      <header
        onMouseEnter={() => setHidden(false)}
        className={cn(
          "sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md transition-transform duration-300 ease-out",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          className,
        )}
      >
      <div className="flex h-14 w-full items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-foreground" onClick={() => setOpen(false)}>
          <span className="text-primary">
            <WaveMark className="size-5" />
          </span>
          <span className="font-mono text-[13px] font-semibold uppercase tracking-[0.18em]">Ops Surfer</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center justify-center gap-5 md:flex">
          {NAV.map((item) => {
            const Icon = NAV_ICON[item.href];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors",
                  isActive(item.href) ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {Icon && <Icon className="size-3.5" strokeWidth={1.75} />}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3 md:ml-0">
          {/* Global search — moved here from the operator app top bar */}
          <div className="relative hidden lg:block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.75}
            />
            <input
              type="text"
              placeholder="Search…"
              aria-label="Search leads, threads, clients"
              className="inset-well h-9 w-44 rounded-full border border-border bg-surface pl-9 pr-11 text-[13px] text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none xl:w-60"
            />
            <kbd className="pointer-events-none absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <span className="text-[11px] leading-none">⌘</span>K
            </kbd>
          </div>
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
          <nav className="flex flex-col gap-1 px-4 py-4">
            {NAV.map((item) => {
              const Icon = NAV_ICON[item.href];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "inline-flex items-center gap-2.5 rounded-lg px-3 py-2.5 font-mono text-xs uppercase tracking-[0.16em] transition-colors",
                    isActive(item.href) ? "bg-surface-2 text-primary" : "text-muted-foreground hover:bg-surface hover:text-foreground",
                  )}
                >
                  {Icon && <Icon className="size-4" strokeWidth={1.75} />}
                  {item.label}
                </Link>
              );
            })}
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
    </>
  );
}
