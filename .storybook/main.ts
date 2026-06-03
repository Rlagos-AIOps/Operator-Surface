import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: { name: "@storybook/nextjs-vite", options: {} },
  staticDirs: ["../public"],

  // Storybook renders client components in the browser with no backend. The
  // approvals Server Action transitively imports the Supabase *admin* client
  // (service-role key + `import "server-only"`), which throws in a client
  // bundle and must never reach the browser. Neutralize that whole chain with
  // virtual stubs so ApprovalCard renders. The Approve/Reject buttons are inert
  // in Storybook (no backend) — decisions happen in the live app.
  viteFinal: async (config) => {
    config.plugins = config.plugins ?? [];
    config.plugins.unshift({
      name: "storybook-stub-server-only-modules",
      enforce: "pre",
      resolveId(source: string, importer?: string) {
        // the approvals Server Action
        if (source === "../actions" && importer && importer.includes("approvals")) {
          return "\0stub:approvals-actions";
        }
        // the Supabase admin (service-role) client — any import path
        if (/(^|\/)lib\/supabase\/admin$/.test(source) || source.endsWith("/supabase/admin")) {
          return "\0stub:supabase-admin";
        }
        // the `server-only` guard package
        if (source === "server-only" || source === "client-only") {
          return "\0stub:empty";
        }
        return null;
      },
      load(id: string) {
        if (id === "\0stub:approvals-actions") {
          return "export async function decideApproval() { return { ok: true }; }";
        }
        if (id === "\0stub:supabase-admin") {
          return "export function createSupabaseAdminClient() { return {}; }";
        }
        if (id === "\0stub:empty") {
          return "export {};";
        }
        return null;
      },
    });
    return config;
  },
};

export default config;
