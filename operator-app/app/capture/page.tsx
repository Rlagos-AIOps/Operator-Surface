"use client";

// Capture-only route: renders each prototype component isolated + sized so a
// headless browser can screenshot it (#cap-*) into clean PNG assets for the
// design board. Not part of the product nav.
import { Sidebar } from "@/components/operator/sidebar";
import { TopBar } from "@/components/operator/top-bar";
import { MetricRow } from "@/components/operator/metric-row";
import { LeadQueue } from "@/components/operator/lead-queue";
import { ThreadView } from "@/components/operator/thread-view";
import { Composer } from "@/components/operator/composer";
import { Bubble } from "@/components/operator/bubble";
import { IntentChip } from "@/components/operator/intent-chip";
import { LEADS } from "@/lib/data";

const noop = () => {};

export default function Capture() {
  const lead = LEADS[0];
  return (
    <div className="flex flex-col items-start gap-16 bg-emerald p-16">
      <div id="cap-sidebar" className="h-[760px] w-[260px] shrink-0">
        <Sidebar active="inbox" onNav={noop} />
      </div>

      <div id="cap-topbar" className="w-[1080px] bg-emerald">
        <TopBar highIntentOnly={false} onToggleFilter={noop} />
      </div>

      <div id="cap-metrics" className="w-[1080px] bg-emerald">
        <MetricRow />
      </div>

      <div id="cap-queue" className="flex h-[540px] w-[420px] flex-col bg-emerald">
        <LeadQueue leads={LEADS} selectedId={lead.id} onSelect={noop} />
      </div>

      <div id="cap-thread" className="flex h-[460px] w-[760px] flex-col bg-emerald">
        <ThreadView lead={lead} />
      </div>

      <div id="cap-composer" className="w-[760px] bg-emerald">
        <Composer
          lead={lead}
          sent={false}
          rejected={false}
          onApprove={noop}
          onReject={noop}
        />
      </div>

      <div id="cap-bubbles" className="flex w-[620px] flex-col gap-3 bg-emerald p-6">
        <Bubble from="human">
          Saw your post on AI ops for inbound triage. Open to a quick chat?
        </Bubble>
        <Bubble from="reasoning">
          Intent score 0.84 · Persona match (RevOps · mid-market).
        </Bubble>
        <Bubble from="agent">
          Happy to chat — what&apos;s your average response time today?
        </Bubble>
      </div>

      <div id="cap-chips" className="flex w-[420px] items-center gap-3 bg-emerald p-6">
        <IntentChip intent="high" score={84} />
        <IntentChip intent="mid" score={62} />
        <IntentChip intent="cold" score={18} />
      </div>
    </div>
  );
}
