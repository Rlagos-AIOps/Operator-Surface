import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { TopBar } from "../components/operator/top-bar";

// The operator console header — "Inbound triage" label, the High-intent
// ghost↔lime toggle, an aria-live "Agent live" pill, and the operator avatar.
const meta = {
  title: "Operator/TopBar",
  component: TopBar,
  tags: ["autodocs"],
  args: {
    highIntentOnly: false,
    onToggleFilter: () => {},
  },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof TopBar>;
export default meta;

type Story = StoryObj<typeof meta>;

// Interactive wrapper so the High-intent toggle flips live in the story.
function TopBarDemo() {
  const [on, setOn] = useState(false);
  return <TopBar highIntentOnly={on} onToggleFilter={() => setOn((v) => !v)} />;
}

export const Playground: Story = { render: () => <TopBarDemo /> };

export const HighIntentOn: Story = {
  render: () => <TopBar highIntentOnly onToggleFilter={() => {}} />,
};
