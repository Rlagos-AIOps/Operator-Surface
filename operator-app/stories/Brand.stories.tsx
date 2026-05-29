import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IntentChip } from "../components/operator/intent-chip";
import { Bubble } from "../components/operator/bubble";
import { Button } from "../components/ui/button";

// AI Ops OS brand component canon. Design tokens load via .storybook/preview.tsx → app/globals.css.
const meta: Meta = {
  title: "AI Ops OS/Brand",
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="bg-emerald font-sans text-paper" style={{ padding: 40, minHeight: "100vh" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj;

export const Buttons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Approve &amp; send</Button>
      <Button variant="outline">Revise</Button>
      <Button variant="ghost">Reject</Button>
    </div>
  ),
};

export const IntentChips: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <IntentChip intent="high" score={84} />
      <IntentChip intent="mid" score={62} />
      <IntentChip intent="cold" score={18} />
    </div>
  ),
};

export const SpeechBubbles: Story = {
  render: () => (
    <div className="flex max-w-xl flex-col gap-3">
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
  ),
};

export const MetricCards: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <div className="rounded-[14px] bg-surface p-[18px] shadow-ground">
        <div className="eyebrow mb-2 text-muted-foreground">Pipeline</div>
        <div className="font-serif text-[40px] leading-none tabular-nums text-paper">42</div>
        <div className="mt-1.5 text-[13px] text-muted-foreground">active threads</div>
      </div>
      <div className="rounded-[14px] bg-surface p-[18px] shadow-[0_1px_0_rgba(10,20,16,0.2),0_0_0_1px_rgba(200,249,2,0.45),0_0_24px_rgba(200,249,2,0.2)]">
        <div className="eyebrow mb-2 text-volt">Agent · active</div>
        <div className="font-serif text-[40px] leading-none tabular-nums text-volt">7</div>
        <div className="mt-1.5 text-[13px] text-muted-foreground">drafts pending review</div>
      </div>
      <div className="rounded-[14px] bg-paper p-[18px] shadow-ground">
        <div className="eyebrow mb-2 text-muted-paper">ROI · locked</div>
        <div className="font-serif text-[40px] leading-none tabular-nums text-ink">$4,200</div>
        <div className="mt-1.5 text-[13px] text-muted-paper">monthly · 3.2× est.</div>
      </div>
    </div>
  ),
};
