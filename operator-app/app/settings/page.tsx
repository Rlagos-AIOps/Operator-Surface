"use client";

import { useState } from "react";
import { toast } from "sonner";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="eyebrow text-muted-foreground">{label}</span>
      <input
        defaultValue={value}
        className="surface mt-2 w-full rounded-lg px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-ring"
      />
    </label>
  );
}

function Toggle({
  label,
  hint,
  defaultOn,
}: {
  label: string;
  hint: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn((v) => !v)}
        className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${
          on ? "bg-primary" : "bg-surface-2"
        }`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-background shadow transition-transform ${
            on ? "translate-x-[18px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass rounded-2xl p-6">
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 py-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-muted-foreground">Workspace</p>
          <h1 className="mt-2 text-4xl sm:text-5xl">Settings</h1>
        </div>
        <button
          onClick={() => toast("Settings saved")}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-[transform,filter] hover:brightness-105 active:scale-[0.98]"
        >
          Save changes
        </button>
      </div>

      <div className="mt-8 grid gap-3">
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
            <Toggle
              label="Auto-draft replies"
              hint="Let the agent draft a reply for every qualified lead."
              defaultOn
            />
            <Toggle
              label="Require approval before send"
              hint="Nothing goes out without a human keystroke."
              defaultOn
            />
            <Toggle
              label="Pause agents outside business hours"
              hint="No drafting between 8pm and 7am local time."
            />
          </div>
        </Section>

        <Section title="Integrations">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">LinkedIn API</p>
              <p className="text-xs text-muted-foreground">Connected · inbound triage</p>
            </div>
            <span className="eyebrow flex items-center gap-1.5 text-primary">
              <span className="size-1.5 rounded-full bg-volt" />
              Connected
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="eyebrow">Monthly quota</span>
              <span className="num">78%</span>
            </div>
            <div className="surface mt-2 h-2 overflow-hidden rounded-full">
              <div className="h-full rounded-full bg-primary" style={{ width: "78%" }} />
            </div>
          </div>
        </Section>

        <Section title="Billing">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Scale plan · 5 seats</p>
              <p className="num text-xs text-muted-foreground">$890 / mo · renews Jun 30</p>
            </div>
            <button
              onClick={() => toast("Opening billing portal")}
              className="surface rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-surface-2"
            >
              Manage billing
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}
