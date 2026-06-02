import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "../components/ui/input";

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    type: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: { placeholder: "Search leads, threads, clients" },
} satisfies Meta<typeof Input>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
};
