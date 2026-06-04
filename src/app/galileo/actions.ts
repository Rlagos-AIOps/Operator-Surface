"use server";

import { randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// galileo_chat isn't in the generated Database types yet (added out-of-band),
// so use a loosely-typed client for these calls.
function client(): SupabaseClient {
  return createSupabaseAdminClient() as unknown as SupabaseClient;
}

export type GalileoTurn = {
  id: string;
  prompt: string;
  response: string | null;
  status: "pending" | "running" | "done" | "error";
  error: string | null;
  created_at: string;
};

export async function askGalileo(
  prompt: string,
  accountContext: string | null,
  conversationId: string | null,
): Promise<
  | { ok: true; conversationId: string; turnId: string }
  | { ok: false; error: string }
> {
  const trimmed = prompt.trim();
  if (!trimmed) return { ok: false, error: "empty prompt" };
  const sb = client();
  const conversation_id = conversationId ?? randomUUID();
  const { data, error } = await sb
    .from("galileo_chat")
    .insert({ conversation_id, account_context: accountContext, prompt: trimmed, status: "pending" })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, conversationId: conversation_id, turnId: (data as { id: string }).id };
}

export async function getConversation(conversationId: string): Promise<GalileoTurn[]> {
  const sb = client();
  const { data } = await sb
    .from("galileo_chat")
    .select("id,prompt,response,status,error,created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  return (data ?? []) as GalileoTurn[];
}
