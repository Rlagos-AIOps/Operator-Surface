import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: { name: "@storybook/nextjs-vite", options: {} },
  staticDirs: ["../public"],

  // Storybook renders client components in the browser with no backend. The
  // approvals Server Action (`../actions`) transitively imports the Supabase
  // *admin* client (service-role key + `import "server-only"`), which throws in
  // a client bundle and must never reach the browser. Stub it with a no-op so
  // ApprovalCard renders; the Approve/Reject buttons are inert in Storybook.
  viteFinal: async (config) => {
    config.plugins = config.plugins ?? [];
    config.plugins.push({
      name: "mock-approvals-actions",
      enforce: "pre",
      resolveId(source: string, importer?: string) {
        if (source === "../actions" && importer && importer.includes("approvals")) {
          return "\0virtual:approvals-actions-mock";
        }
        return null;
      },
      load(id: string) {
        if (id === "\0virtual:approvals-actions-mock") {
          return "export async function decideApproval() { return { ok: true }; }";
        }
        return null;
      },
    });
    return config;
  },
};

export default config;
