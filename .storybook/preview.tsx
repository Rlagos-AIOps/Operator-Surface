import React from "react";
import type { Preview } from "@storybook/nextjs-vite";
import "../src/app/globals.css";

// Dual-theme harness (adapted from AK's design Storybook): the toolbar Theme
// toggle wraps every story in `.dark` (or not) over the real `bg-background`
// canvas, so each component shows exactly as shipped in both the light/emerald
// (Figma) and dark/mossy (Lovable) modes. Default = dark (our app default).
const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: "todo" },
  },
  globalTypes: {
    theme: {
      description: "Color theme",
      defaultValue: "dark",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "dark", title: "Dark · mossy" },
          { value: "light", title: "Light · emerald" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, ctx) => {
      const dark = (ctx.globals.theme ?? "dark") === "dark";
      return (
        <div className={dark ? "dark" : ""}>
          <div
            className="bg-background text-foreground font-sans"
            style={{ padding: 40, minHeight: "100vh" }}
          >
            <Story />
          </div>
        </div>
      );
    },
  ],
};

export default preview;
