import type { Chip } from "./types";

interface Props {
  chips: Chip[];
}

const KIND_STYLES: Record<string, string> = {
  danger: "border-danger/40 bg-danger/10 text-danger",
  warning: "border-warning/40 bg-warning/10 text-warning",
  success: "border-success/40 bg-success/10 text-success",
  info: "border-info/40 bg-info/10 text-info",
};

const DEFAULT_STYLE = "border-paper/20 bg-paper/5 text-paper";

export function ChipRow({ chips }: Props) {
  if (chips.length === 0) return null;
  return (
    <section className="mb-s6 flex flex-wrap gap-s2">
      {chips.map((c, i) => {
        const style = c.kind ? KIND_STYLES[c.kind] ?? DEFAULT_STYLE : DEFAULT_STYLE;
        return (
          <span
            key={`${c.label}-${i}`}
            className={`inline-flex items-center rounded-pill border px-s4 py-s2 text-small font-semibold ${style}`}
          >
            {c.label}
          </span>
        );
      })}
    </section>
  );
}
