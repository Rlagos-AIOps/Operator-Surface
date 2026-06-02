import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SiteFooter } from "../components/site/footer";

// The global footer — brand blurb + Product / Workspace / Resources link columns
// (each link carries its nav icon) and an agent-online status line with a
// pulsing good StatusDot.
const meta = {
  title: "Site/SiteFooter",
  component: SiteFooter,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SiteFooter>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
