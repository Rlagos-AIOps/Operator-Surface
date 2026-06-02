import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Masthead } from "../components/site/masthead";

// The global top bar on every page — wave mark + mono wordmark, centered icon
// nav (active route in primary), the ⌘K global search, theme toggle, Launch app.
// Auto-hides on scroll-down / reveals on scroll-up. `usePathname` is auto-mocked
// by the nextjs-vite framework (defaults to "/", so Overview reads active).
const meta = {
  title: "Site/Masthead",
  component: Masthead,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    // App Router hooks (usePathname) need the nextjs-vite navigation mock —
    // without it usePathname() returns null and useActive() throws.
    nextjs: { appDirectory: true, navigation: { pathname: "/" } },
  },
} satisfies Meta<typeof Masthead>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
