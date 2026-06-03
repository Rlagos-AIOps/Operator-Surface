import * as React from "react";
import { cn } from "@/lib/utils";
import { brandToCssVars, type Brand } from "@/lib/brand";

export type BrandProviderProps = React.ComponentProps<"div"> & {
  /** Partial brand override — only the keys you set are applied; the rest inherit. */
  brand?: Brand;
  /** Optional name → sets `data-brand` for CSS targeting / analytics. */
  name?: string;
};

/**
 * Applies a customer Brand by setting the `--brand-*` CSS custom properties on a
 * wrapper. The semantic tokens read THROUGH these (see globals.css), so the entire
 * subtree re-skins — in BOTH light and dark — with no code fork. Unset keys inherit
 * the Ops Surfer defaults from `:root`. SSR-safe (pure inline style, zero effects).
 *
 *   <BrandProvider brand={exampleBrand} name="acme">
 *     <App />
 *   </BrandProvider>
 */
export function BrandProvider({
  brand,
  name,
  className,
  style,
  children,
  ...props
}: BrandProviderProps) {
  const vars = brand ? brandToCssVars(brand) : {};
  return (
    <div
      data-brand-scope={brand ? "" : undefined}
      data-brand={name}
      className={cn(className)}
      style={{ ...(vars as React.CSSProperties), ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
