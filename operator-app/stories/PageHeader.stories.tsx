import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PageHeader, LiveSignage } from "../components/site/page-header";

// The one header across every interior page — bright eyebrow + display title +
// optional subtitle / tone-aware chips, and a right slot for live signage
// (instrument pages) or action buttons (management pages).
const meta = {
  title: "Kit/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  argTypes: {
    eyebrow: { control: "text" },
    title: { control: "text" },
    subtitle: { control: "text" },
  },
  args: {
    eyebrow: "Client success · Q2",
    title: "Clients",
    subtitle: "Your book of business at a glance.",
  },
} satisfies Meta<typeof PageHeader>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithChips: Story = {
  args: {
    eyebrow: "Inbound pipeline · LinkedIn",
    title: "Leads",
    subtitle: undefined,
    chips: [{ label: "6 leads" }, { label: "2 hot", tone: "hot" }],
  },
};

export const InstrumentPage: Story = {
  args: {
    eyebrow: "Performance",
    title: "Analytics",
    subtitle: "Funnel, intent mix and trend — last 90 days.",
    right: <LiveSignage stamp="last 90d · live" />,
  },
};
