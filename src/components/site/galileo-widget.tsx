"use client";

/**
 * GalileoWidget — persistent floating chat across the whole app.
 *
 * Lives in the root layout so it survives page navigations: the user can open
 * Galileo, send a question, navigate to /accounts or /brief while he thinks,
 * and come back to the same panel with the answer ready. The panel is a small
 * floating window (not a full-height side panel) and there is NO backdrop or
 * blur — the rest of the site stays fully interactive while chat is open.
 *
 * Three pieces working together as one state machine:
 *   - FAB (floating action button): the always-visible "G" circle, bottom-right.
 *     Hidden while the panel is open (panel sits over the same spot).
 *   - Panel: floating chat window, bottom-right, ~400×600. Esc or the X button
 *     closes it; clicking outside does NOT close it (so a stray click on the
 *     page doesn't kill an in-flight request).
 *   - CTA bubble: first-visit-only welcome tooltip that explains who Galileo is.
 *
 * The standalone /galileo route is preserved as a fallback for direct linking.
 * When the user is on /galileo, the FAB hides so the two don't compete.
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PANEL } from "@/components/ui/surfaces";
import { GalileoConsole } from "@/components/galileo/GalileoConsole";

const CTA_DISMISSED_KEY = "galileo-cta-dismissed-v1";

interface GalileoWidgetProps {
  /** Account names for the GalileoConsole. Fetched once in the layout, reused everywhere. */
  accounts: string[];
}

export function GalileoWidget({ accounts }: GalileoWidgetProps) {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const fabRef = useRef<HTMLButtonElement>(null);

  // First-visit CTA bubble: localStorage-gated, surfaces ~600ms after mount
  // (long enough that the user has registered the FAB exists; short enough
  // that the page does not feel inert).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = window.localStorage.getItem(CTA_DISMISSED_KEY);
    if (dismissed) return;
    const t = window.setTimeout(() => setCtaVisible(true), 600);
    return () => window.clearTimeout(t);
  }, []);

  // Esc closes the panel. Only bound while open to avoid stealing Esc elsewhere.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Hide the FAB entirely on the legacy /galileo route — the standalone page
  // already shows the full console, no need to double up.
  if (pathname.startsWith("/galileo")) return null;

  function dismissCta() {
    setCtaVisible(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CTA_DISMISSED_KEY, "1");
    }
  }

  function openPanel() {
    setOpen(true);
    if (ctaVisible) dismissCta();
  }

  return (
    <>
      {/* Floating chat panel — anchored bottom-right, sized to leave the rest
          of the page visible and interactive. No backdrop, no blur: the user
          can keep reading, scrolling, and navigating while Galileo thinks. */}
      <aside
        role="dialog"
        aria-label="Galileo chat"
        aria-hidden={!open}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex w-[400px] max-w-[calc(100vw-3rem)] flex-col",
          "h-[600px] max-h-[calc(100dvh-3rem)]",
          "rounded-2xl border border-border bg-background shadow-2xl",
          "origin-bottom-right transition-all duration-200 ease-out",
          open
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0",
        )}
      >
        <header className="flex items-center justify-between border-b border-border px-s5 py-s4">
          <div>
            <p className="eyebrow text-muted-foreground">Talk to your team</p>
            <h2 className="mt-0.5 font-serif text-h3 text-foreground">Galileo</h2>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Your gateway to the agent team
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close Galileo"
            className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
          >
            <X className="size-4" strokeWidth={1.75} />
          </button>
        </header>
        <div className="flex-1 min-h-0 overflow-hidden">
          {open && <GalileoConsole accounts={accounts} embedded />}
        </div>
      </aside>

      {/* First-visit CTA bubble — sits above the FAB pointing at it. */}
      {ctaVisible && !open && (
        <div
          role="status"
          className={cn(
            PANEL,
            "fixed bottom-24 right-6 z-50 w-[290px] rounded-2xl p-4 shadow-2xl",
          )}
        >
          <button
            type="button"
            onClick={dismissCta}
            aria-label="Dismiss"
            className="absolute right-2 top-2 grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-surface hover:text-foreground"
          >
            <X className="size-3.5" strokeWidth={1.75} />
          </button>
          <p className="font-serif text-h5 text-foreground">Meet Galileo</p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
            Your gateway to the agent team — six AI teammates managing your book,
            your leads, and the work between meetings. Ask him anything, or have
            him dispatch the team for you.
          </p>
          <button
            type="button"
            onClick={openPanel}
            className="mt-3 inline-flex h-8 items-center justify-center rounded-full bg-primary px-3 font-mono text-[11px] uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            Say hi →
          </button>
          {/* Pointer to the FAB */}
          <div
            aria-hidden
            className="absolute -bottom-2 right-7 size-4 rotate-45 border-b border-r border-border bg-background"
          />
        </div>
      )}

      {/* Hover tooltip — only when not open and not showing the CTA. */}
      {hovered && !open && !ctaVisible && (
        <div
          role="tooltip"
          className="fixed bottom-24 right-6 z-50 rounded-full border border-border bg-background px-3 py-1.5 shadow-lg font-mono text-[11px] uppercase tracking-[0.16em] text-foreground"
        >
          Galileo · gateway to your agent team
        </div>
      )}

      {/* The FAB itself — hidden while the panel is open (the panel sits over
          this same spot; showing both is noisy and the panel has its own X). */}
      {!open && (
        <button
          ref={fabRef}
          type="button"
          onClick={openPanel}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          aria-label="Open Galileo"
          aria-expanded={open}
          className={cn(
            "fixed bottom-6 right-6 z-50 grid size-14 place-items-center rounded-full",
            "bg-background ring-2 ring-primary shadow-xl",
            "transition-all duration-200 hover:scale-105 hover:shadow-2xl",
            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60",
            "active:scale-95",
          )}
        >
          {/* The "G" in DM Serif Display, same family as the headers. */}
          <span
            aria-hidden
            className="font-serif text-2xl leading-none text-primary"
            style={{ transform: "translateY(1px)" }}
          >
            G
          </span>
        </button>
      )}
    </>
  );
}
