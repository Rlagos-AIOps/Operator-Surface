// Ambient declarations for the bun-run token build script (tokens/build.ts).
// Kept local + dependency-free: bun provides the `Bun` global at runtime, and
// `culori` ships no bundled types in this install. These cover ONLY the surface
// build.ts uses, so `bunx tsc --noEmit` typechecks the script without pulling
// in @types/bun or a culori type package.

declare const Bun: {
  file(path: string): {
    text(): Promise<string>;
    exists(): Promise<boolean>;
  };
  write(path: string, content: string): Promise<number>;
};

declare module "culori" {
  /** A parsed color in culori's object form (mode + channels + optional alpha). */
  export interface Color {
    mode: string;
    alpha?: number;
    [channel: string]: number | string | undefined;
  }
  /** Parse any CSS color string (oklch/rgb/hex/named) → Color, or undefined. */
  export function parse(color: string): Color | undefined;
  /** Serialize a Color to a #rrggbb hex string. */
  export function formatHex(color: Color): string;
  /** Serialize a Color to a #rrggbbaa hex string (preserves alpha). */
  export function formatHex8(color: Color): string;
}
