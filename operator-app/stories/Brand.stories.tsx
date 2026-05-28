import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IntentChip } from "../components/operator/intent-chip";
import { Bubble } from "../components/operator/bubble";
import { Button } from "../components/ui/button";

// Brand component canon for the AI Ops OS operator surface.
// Tokens load via .storybook/preview.tsx → app/globals.css.
const meta: Meta = {
  title: "AI Ops OS/Brand",
  decorators: [
    (Story) => (
      <div
        className="bg-emerald font-sans text-paper"
        style={{ padding: 40, minHeight: 320 }}
      >
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj;

export const Buttons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
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
