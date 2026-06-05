import type { BriefRow } from "./types";
import { timeAgo } from "@/app/approvals/_components/Badges";
import { plainEnglish } from "@/lib/copy/overrides";

interface Props {
  brief: BriefRow;
}

function formatBriefDate(iso: string): string {
  // brief_date is YYYY-MM-DD. Add T12:00 so the resulting Date doesn't
  // shift across timezones during formatting.
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function BriefHeader({ brief }: Props) {
  const run = brief.generated_run;
  const isLive = run?.status === "running";
  return (
    <header className="mb-s7">
      <p className="eyebrow mb-s3">
        Daily Brief · {formatBriefDate(brief.brief_date)}
      </p>
      <h1 className="font-serif text-paper text-balance mb-s5 max-w-[20ch]">
        {plainEnglish(brief.headline)}
      </h1>
      <div className="flex items-center gap-s2 text-micro text-muted">
        <span className="relative inline-flex h-2 w-2">
          {isLive && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-pill bg-volt opacity-75" />
          )}
          <span
            className={`relative inline-flex h-2 w-2 rounded-pill ${
              isLive ? "bg-volt" : "bg-muted"
            }`}
          />
        </span>
        <span
          className={`font-bold uppercase tracking-wider ${
            isLive ? "text-volt" : "text-muted"
          }`}
        >
          {isLive ? "Agent live" : "Agent idle"}
        </span>
        <span aria-hidden>·</span>
        <span>
          galileo {isLive ? "running" : "finished"} {timeAgo(brief.generated_at)}
        </span>
      </div>
    </header>
  );
}
