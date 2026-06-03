import { CheckCircle2 } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card px-s5 py-s8 text-center">
      <CheckCircle2 className="mb-s4 h-12 w-12 text-primary" strokeWidth={1.75} />
      <p className="font-serif text-h3 text-foreground">You&rsquo;re caught up.</p>
      <p className="mt-s2 text-small text-muted-foreground">
        No pending approvals. The agents will surface new ones as they come in.
      </p>
    </div>
  );
}
