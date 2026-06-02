import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WeeklyLeadsChart, ResponseTimeChart } from "../components/charts/dashboard-charts";
import { cn } from "../lib/utils";
import { PANEL } from "../components/site/surfaces";

// Dashboard charts (recharts). Quantitative → green spectrum only; animation off
// so they render instantly and stay correct on resize. Self-contained mock data.
const meta = { title: "Kit/Charts" } satisfies Meta;
export default meta;

type Story = StoryObj;

export const WeeklyLeads: Story = {
  render: () => (
    <div className={cn(PANEL, "max-w-xl p-6")}>
      <h2 className="font-display text-2xl">Weekly lead activity</h2>
      <div className="mt-4">
        <WeeklyLeadsChart />
      </div>
    </div>
  ),
};

export const ResponseTime: Story = {
  render: () => (
    <div className={cn(PANEL, "max-w-xl p-6")}>
      <h2 className="font-display text-2xl">Avg response time</h2>
      <div className="mt-4">
        <ResponseTimeChart />
      </div>
    </div>
  ),
};
