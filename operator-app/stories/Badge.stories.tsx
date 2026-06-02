import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge, type Tone } from "../components/site/accents";

const TONES: Tone[] = ["good", "hot", "warm", "cold", "bad", "pending", "muted"];

// Status / tier badge — white text, tone on the border + same-tone bg tint.
// color = signal, always paired with the label text (use-of-color 1.4.1).
const meta = {
  title: "Kit/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    tone: { control: "select", options: TONES, description: "Semantic signal tone" },
    dot: { control: "boolean", description: "Leading status dot" },
    pulse: { control: "boolean", description: "Pulse the dot (has something to say)" },
    glow: { control: "boolean", description: "Contained edge glow" },
    children: { control: "text" },
  },
  args: { tone: "good", dot: true, pulse: false, glow: false, children: "Active" },
} satisfies Meta<typeof Badge>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllTones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {TONES.map((t) => (
        <Badge key={t} tone={t} dot>
          {t}
        </Badge>
      ))}
    </div>
  ),
};

export const Glow: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["good", "hot", "warm", "cold", "bad", "pending"] as Tone[]).map((t) => (
        <Badge key={t} tone={t} dot glow>
          {t}
        </Badge>
      ))}
    </div>
  ),
};
