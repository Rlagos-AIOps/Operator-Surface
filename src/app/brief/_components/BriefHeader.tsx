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
      {/* Page identity — bumped from micro eyebrow to a louder lime row so
          Brief's "you are here" cue is glanceable at desk-distance. */}
      <p className="mb-s3 font-mono text-small font-bold uppercase tracking-[0.14em] text-primary">
        Daily Brief
        <span className="ml-s2 text-muted-foreground">
          · {formatBriefDate(brief.brief_date)}
        </span>
      </p>
      <h1
        className="font-serif text-foreground text-balance mb-s5 max-w-[22ch]"
        style={{
          fontSize: "clamp(56px, 7vw, 80px)",
          lineHeight: 0.98,
          letterSpacing: "-0.025em",
        }}
      >
        {plainEnglish(brief.headline)}
      </h1>
      <div className="flex items-center gap-s2 text-micro text-muted-foreground">
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
            isLive ? "text-volt" : "text-muted-foreground"
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
