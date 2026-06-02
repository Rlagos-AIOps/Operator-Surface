import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "../components/ui/badge";

// The shadcn base-nova Badge primitive — distinct from the signal-tone
// Kit/Badge (accents.tsx). Six CVA variants for generic labelling; the
// product UI uses the signal Badge for status, this for neutral chrome.
const meta = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "secondary", "destructive", "outline", "ghost", "link"],
    },
  },
  args: { variant: "default", children: "Badge" },
} satisfies Meta<typeof Badge>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="link">Link</Badge>
    </div>
  ),
};
