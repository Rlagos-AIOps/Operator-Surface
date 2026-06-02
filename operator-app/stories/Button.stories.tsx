import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "../components/ui/button";

// Base shadcn/base-ui button primitive. NOTE: the app's canonical *action*
// buttons are the lime BTN_PRIMARY / dashed BTN_GHOST class primitives
// (see Kit/Buttons) — this is the lower-level base used in a few places.
const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "outline", "secondary", "ghost", "destructive", "link"] },
    size: { control: "select", options: ["default", "xs", "sm", "lg", "icon"] },
    children: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: { variant: "default", size: "default", children: "Button" },
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};
