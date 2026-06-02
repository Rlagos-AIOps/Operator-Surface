import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LeadFilters } from "../components/site/lead-filters";

// Temperature filter row — each pill wears its own signal color as a dashed
// outline when inactive, then fills + lifts + edge-glows when selected. Color is
// always paired with a label + count (never color-only — WCAG 1.4.1).
const meta = {
  title: "Site/LeadFilters",
  component: LeadFilters,
  tags: ["autodocs"],
} satisfies Meta<typeof LeadFilters>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
