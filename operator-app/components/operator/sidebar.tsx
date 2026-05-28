"use client";

import {
  Inbox,
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  Bot,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "./marks";
import { NAV_ITEMS, type NavIcon } from "@/lib/data";

const ICONS: Record<NavIcon, LucideIcon> = {
  inbox: Inbox,
  "trending-up": TrendingUp,
  users: Users,
  "file-text": FileText,
  "dollar-sign": DollarSign,
  bot: Bot,
};

export function Sidebar({
  active,
  onNav,
}: {
  active: string;
  onNav: (id: string) => void;
}) {
  return (
    <aside className="flex h-screen w-[260px] shrink-0 flex-col gap-1 border-r border-sidebar-border bg-sidebar px-3.5 py-5">
      <div className="flex items-center gap-2.5 px-2.5 pt-1 pb-4">
        <Mark className="size-7" />
        <div className="leading-tight">
          <div className="font-serif text-lg text-paper">AI Ops</div>
          <div className="eyebrow text-[9px] tracking-[0.18em] text-lime">
            Operator OS
          </div>
        </div>
      </div>

      <div className="eyebrow px-2.5 pt-3 pb-1.5 text-[10px] text-muted-foreground">
        Workspace
      </div>

      {NAV_ITEMS.map((it) => {
        const Icon = ICONS[it.icon];
        const isActive = active === it.id;
        return (
          <button
            key={it.id}
            onClick={() => onNav(it.id)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-volt focus-visible:outline-none",
              isActive
                ? "bg-lime text-ink shadow-[inset_0_0_0_1px_rgba(217,232,121,0.45)]"
                : "text-muted-foreground hover:bg-paper/5 hover:text-paper"
            )}
          >
            <Icon className="size-[18px] shrink-0" strokeWidth={1.75} />
            <span className="flex-1 text-left">{it.label}</span>
            {it.count !== undefined && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
                  it.live
                    ? "glow-volt bg-volt text-ink"
                    : isActive
                      ? "bg-ink/10 text-ink"
                      : "bg-paper/10 text-muted-foreground"
                )}
              >
                {it.count}
              </span>
            )}
          </button>
        );
      })}

      <div className="flex-1" />

      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-2.5 rounded-[10px] border border-surface-edge bg-surface px-3.5 py-3"
      >
        <span
          aria-hidden="true"
          className="glow-volt size-2 shrink-0 animate-pulse-volt rounded-full bg-volt"
        />
        <div className="flex-1">
          <div className="text-xs font-semibold text-paper">Triage agent</div>
          <div className="text-[11px] text-muted-foreground">
            Working · 7 drafts
          </div>
        </div>
      </div>
    </aside>
  );
}
