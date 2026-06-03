import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Sidebar } from "../components/operator/sidebar";
import { NAV_ITEMS } from "../lib/data";

// The left workspace nav (used by the /capture layout). Selectable items with
// live counts + an agent-status footer. Closes the storybook coverage gap on the
// one live operator surface that lacked a story.
const meta = {
  title: "Operator/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
} satisfies Meta<typeof Sidebar>;
export default meta;

type Story = StoryObj<typeof meta>;

function SidebarDemo() {
  const [active, setActive] = useState(NAV_ITEMS[0]?.id ?? "");
  return (
    <div className="flex h-[640px]">
      <Sidebar active={active} onNav={setActive} />
    </div>
  );
}

export const Playground: Story = {
  args: { active: NAV_ITEMS[0]?.id ?? "", onNav: () => {} },
  render: () => <SidebarDemo />,
};
