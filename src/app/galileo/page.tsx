import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { GalileoConsole } from "@/components/galileo/GalileoConsole";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Galileo — Operator Surface",
};

export default async function GalileoPage({
  searchParams,
}: {
  searchParams: Promise<{ account?: string }>;
}) {
  const sp = await searchParams;
  const sb = createSupabaseAdminClient();
  const { data } = await sb.from("decisions").select("metadata");
  const names = Array.from(
    new Set(
      (data ?? [])
        .map((d) => (d.metadata as { account_name?: string } | null)?.account_name)
        .filter((n): n is string => Boolean(n)),
    ),
  ).sort();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <header className="mb-5">
        <p className="eyebrow text-muted-foreground">Talk to your team</p>
        <h1 className="mt-1 font-serif text-h2 text-foreground">Galileo</h1>
        <p className="mt-2 max-w-[58ch] text-body text-muted-foreground">
          Your front door to the agent team — ask about the book, dig into an account, or tell him
          to run an audit. He answers directly from the live data, and dispatches the team when you
          ask him to act.
        </p>
      </header>
      <GalileoConsole accounts={names} initialAccount={sp.account} />
    </div>
  );
}
