"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

/**
 * Subscribes to changes on the `approvals` table and triggers a router
 * refresh whenever a row changes. Drives two transitions:
 *
 *   1. Active → Decided: when Hermes flips `metadata.executed = true`, the
 *      card moves out of the active queue into the Decided list (because
 *      page.tsx re-derives the split on every render).
 *   2. Processing → Stalled: time-based, so we ALSO poll every 30s via a
 *      router.refresh() so the per-card getUiState() picks up the
 *      threshold crossing on its own.
 *
 * Requires Supabase Realtime enabled for the `approvals` table:
 *   Supabase Dashboard → Database → Replication → toggle 'approvals' on
 *
 * If Realtime is off, the 30s polling fallback still drives correctness;
 * the UI just feels slightly chunkier on completion events.
 */
export function RealtimeWatcher(): null {
  const router = useRouter();
  const refreshRef = useRef(() => router.refresh());
  refreshRef.current = () => router.refresh();

  useEffect(() => {
    const sb = createSupabaseBrowserClient();

    // ─ Realtime subscription ────────────────────────────────────────────
    // Listen to any UPDATE on the approvals table. We don't filter by id
    // because the visible set changes as cards arrive; cheaper to just
    // refresh on any update than to manage a dynamic filter.
    const channel = sb
      .channel("approvals-watcher")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "approvals" },
        () => refreshRef.current(),
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "approvals" },
        () => refreshRef.current(),
      )
      .subscribe();

    // ─ Periodic poll (belt + suspenders) ────────────────────────────────
    // Every 30 seconds, force a refresh so processing → stalled transitions
    // happen even with zero DB activity. Also catches any UPDATE the
    // Realtime channel missed if the WebSocket dropped.
    const pollId = window.setInterval(() => refreshRef.current(), 30_000);

    return () => {
      sb.removeChannel(channel);
      window.clearInterval(pollId);
    };
  }, []);

  return null;
}
