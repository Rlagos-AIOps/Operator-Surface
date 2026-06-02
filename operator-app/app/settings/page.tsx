"use client";

import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MiniBar, StatusDot } from "@/components/site/accents";
import { PageHeader } from "@/components/site/page-header";
import { BTN_GHOST, BTN_PRIMARY, PANEL } from "@/components/site/surfaces";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="eyebrow text-muted-foreground">{label}</span>
      <input
        defaultValue={value}
        className="surface mt-2 w-full rounded-lg px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-ring"
      />
    </label>
  );
}

function Toggle({ label, hint, defaultOn }: { label: string; hint: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn((v) => !v)}
        className={cn("relative h-6 w-10 shrink-0 rounded-full transition-colors", on ? "bg-primary" : "bg-surface-2")}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-background shadow transition-transform",
            on ? "translate-x-[18px]" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}

function Section({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn(PANEL, "p-6", className)}>
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function SettingsPage() {
  return (
    <div className="px-5 py-8 sm:px-7 sm:py-10">
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        right={
          <button
            type="button"
            onClick={() => toast("Settings saved")}
            className={cn(BTN_PRIMARY, "px-4 py-2 text-sm")}
          >
            Save changes
          </button>
        }
      />

      <div className="mt-8 grid gap-3 lg:grid-cols-2">
        <Section title="Profile">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" value="AK Almoumen" />
            <Field label="Email" value="ak@opssurfer.com" />
          </div>
        </Section>

        <Section title="Workspace">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Workspace name" value="Ops Surfer HQ" />
            <Field label="Timezone" value="America/Los_Angeles" />
          </div>
        </Section>

        <Section title="Agents">
          <div className="divide-y divide-border">
            <Toggle label="Auto-draft replies" hint="Let the agent draft a reply for every qualified lead." defaultOn />
            <Toggle label="Require approval before send" hint="Nothing goes out without a human keystroke." defaultOn />
            <Toggle label="Pause agents outside business hours" hint="No drafting between 8pm and 7am local time." />
          </div>
        </Section>

        <Section title="Integrations">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">LinkedIn API</p>
              <p className="text-xs text-muted-foreground">Connected · inbound triage</p>
            </div>
            <span className="eyebrow flex items-center gap-1.5 text-foreground">
              <StatusDot tone="good" />
              Connected
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="eyebrow text-muted-foreground">Monthly quota</span>
              <span className="num text-foreground">78%</span>
            </div>
            <MiniBar value={78} tone="good" className="mt-2 h-2" />
          </div>
        </Section>

        <Section title="Billing" className="lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Scale plan · 5 seats</p>
              <p className="num text-xs text-muted-foreground">$890 / mo · renews Jun 30</p>
            </div>
            <button
              type="button"
              onClick={() => toast("Opening billing portal")}
              className={cn(BTN_GHOST, "px-4 py-2 text-sm")}
            >
              Manage billing
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}
