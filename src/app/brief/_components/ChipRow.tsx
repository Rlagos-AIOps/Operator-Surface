import type { Chip } from "./types";

interface Props {
  chips: Chip[];
}

const KIND_STYLES: Record<string, string> = {
  danger: "border-bad/40 bg-bad/10 text-bad",
  warning: "border-warm/40 bg-warm/10 text-warm",
  success: "border-good/40 bg-good/10 text-good",
  info: "border-cold/40 bg-cold/10 text-cold",
};

const DEFAULT_STYLE = "border-border/20 bg-card/5 text-foreground";

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
