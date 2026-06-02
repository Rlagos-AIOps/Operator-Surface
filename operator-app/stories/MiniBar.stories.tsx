import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MiniBar, type Tone } from "../components/site/accents";

const TONES: Tone[] = ["good", "hot", "warm", "cold", "bad", "pending"];

// Tone-matched load/score meter. Quantitative fills stay green-spectrum;
// categorical (intent) fills carry the temperature tone.
const meta = {
  title: "Kit/MiniBar",
  component: MiniBar,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    tone: { control: "select", options: TONES },
  },
  args: { value: 72, tone: "good" },
} satisfies Meta<typeof MiniBar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="w-72">
      <MiniBar {...args} />
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="grid w-72 gap-2.5">
      <MiniBar value={72} tone="good" />
      <MiniBar value={48} tone="warm" />
      <MiniBar value={22} tone="bad" />
    </div>
  ),
};
