"use client";

import * as React from "react";
import { BrandProvider } from "@/components/brand-provider";
import { exampleBrand, type Brand } from "@/lib/brand";

// White-label demo shell. Wires the brand-token INDIRECTION layer into the live
// app: the whole surface renders THROUGH <BrandProvider>, so a tenant re-skin is
// one state change away — no fork. Ops Surfer is the default (null brand → inherits
// :root). "Northwind" is a violet white-label tenant that proves the differentiator.
//
// This is the demoable proof of the customization story: same product, any brand,
// light or dark, signal grammar intact.

type Tenant = { id: string; label: string; brand: Brand | null };

const TENANTS: Tenant[] = [
  { id: "ops-surfer", label: "Ops Surfer", brand: null },
  { id: "northwind", label: "Northwind", brand: exampleBrand },
];

export function BrandShell({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = React.useState<Tenant>(TENANTS[0]!);

  return (
    <BrandProvider brand={tenant.brand ?? undefined} name={tenant.id}>
      {children}
      <BrandSwitcher tenant={tenant} onSelect={setTenant} />
    </BrandProvider>
  );
}

function BrandSwitcher({
  tenant,
  onSelect,
}: {
  tenant: Tenant;
  onSelect: (t: Tenant) => void;
}) {
  return (
    <div
      className="fixed bottom-4 left-4 z-50 flex items-center gap-1 rounded-full border border-[color:var(--color-border-strong)] bg-card/90 p-1 shadow-[var(--shadow-2)] backdrop-blur-md"
      role="group"
      aria-label="White-label tenant preview"
    >
      <span className="px-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        White-label
      </span>
      {TENANTS.map((t) => {
        const active = t.id === tenant.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t)}
            aria-pressed={active}
            className={`rounded-full px-3 py-1 font-mono text-[11px] transition-colors ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
