import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";

// Base shadcn card primitive (Card + Header/Title/Description/Content/Footer).
// NOTE: the app's surfaces are the dot-grid PANEL (see Foundations/Surfaces);
// this is the base ui card.
const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Northlake Capital</CardTitle>
        <CardDescription>Enterprise · 3 agents</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">MRR $12,400 · ROI 7.8×</CardContent>
      <CardFooter>
        <Button size="sm">Open</Button>
      </CardFooter>
    </Card>
  ),
};
