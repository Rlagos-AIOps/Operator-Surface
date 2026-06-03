import { Search } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card px-s5 py-s8 text-center">
      <Search className="mb-s4 h-10 w-10 text-muted-foreground" strokeWidth={1.75} />
      <p className="font-serif text-h3 text-foreground">No matching decisions.</p>
      <p className="mt-s2 text-small text-muted-foreground">
        Try a different agent or account filter.
      </p>
    </div>
  );
}
