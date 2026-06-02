import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ShortcutsTip } from "../components/site/shortcuts-tip";

// Quiet keyboard-shortcut signpost — bordered key-caps in the good/lime signal,
// not pulsing, just present. The Lovable "calm by default" pattern.
const meta = {
  title: "Site/ShortcutsTip",
  component: ShortcutsTip,
  tags: ["autodocs"],
} satisfies Meta<typeof ShortcutsTip>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
