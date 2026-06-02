import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ThemeToggle } from "../components/site/theme-toggle";

// Glass pill that flips next-themes light/dark. In Storybook the toolbar Theme
// switch drives the canvas; this toggle renders standalone and degrades
// gracefully without a ThemeProvider (renders a neutral icon until mounted).
const meta = {
  title: "Site/ThemeToggle",
  component: ThemeToggle,
  tags: ["autodocs"],
} satisfies Meta<typeof ThemeToggle>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
