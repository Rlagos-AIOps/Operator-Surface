import { Search } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-surface-edge bg-surface px-s5 py-s8 text-center">
      <Search className="mb-s4 h-10 w-10 text-muted" strokeWidth={1.75} />
      <p className="font-serif text-h3 text-paper">No matching decisions.</p>
      <p className="mt-s2 text-small text-muted">
        Try a different agent or account filter.
      </p>
    </div>
  );
}
