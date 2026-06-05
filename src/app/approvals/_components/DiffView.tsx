/**
 * DiffView — render `current_value` vs `proposed_value` per action_type.
 *
 * Server-safe (no state, no event handlers). Importable from both
 * Server and Client Components.
 */

type Json = unknown;

interface DiffViewProps {
  actionType: string;
  currentValue: Json;
  proposedValue: Json;
}

export function DiffView({ actionType, currentValue, proposedValue }: DiffViewProps) {
  switch (actionType) {
    case "update_field":
      return <UpdateFieldDiff current={currentValue} proposed={proposedValue} />;
    case "send_email":
      return <SendEmailPreview proposed={proposedValue} />;
    case "send_slack":
      return <SendSlackPreview proposed={proposedValue} />;
    case "create_task":
      return <CreateTaskPreview proposed={proposedValue} />;
    case "recompute_health":
      return <RecomputeHealthDiff current={currentValue} proposed={proposedValue} />;
    default:
      return <FallbackJsonDiff current={currentValue} proposed={proposedValue} />;
  }
}

/* ------------------------------------------------------------------ */
/* update_field — labeled field, before → after                       */
/* ------------------------------------------------------------------ */

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

function UpdateFieldDiff({ current, proposed }: { current: unknown; proposed: unknown }) {
  const c = asRecord(current);
  const p = asRecord(proposed);
  const field = (p.field ?? c.field) as string | undefined;
  const currentVal = c.value;
  const proposedVal = p.value;

  return (
    <div className="grid grid-cols-1 gap-s3 md:grid-cols-2">
      <DiffPanel label="Current value" tone="paper">
        {field && <FieldLabel name={field} />}
        <ValueText value={currentVal} placeholder="(empty)" />
      </DiffPanel>
      <DiffPanel label="Proposed value" tone="lime">
        {field && <FieldLabel name={field} />}
        <ValueText value={proposedVal} placeholder="(empty)" />
      </DiffPanel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* send_email — paper-styled email preview                            */
/* ------------------------------------------------------------------ */

function SendEmailPreview({ proposed }: { proposed: unknown }) {
  const p = asRecord(proposed);
  const to = Array.isArray(p.to) ? (p.to as string[]).join(", ") : (p.to as string | undefined);
  const cc =
    Array.isArray(p.cc) && (p.cc as string[]).length > 0
      ? (p.cc as string[]).join(", ")
      : undefined;
  const subject = p.subject as string | undefined;
  const body = (p.body_md as string | undefined) ?? "";
  const channel = (p.channel as string | undefined) ?? "email";

  return (
    <div className="grid grid-cols-1 gap-s3 md:grid-cols-[1fr_3fr]">
      <DiffPanel label="Current" tone="paper">
        <p className="font-mono text-small italic text-ink-2">(no email)</p>
      </DiffPanel>
      <DiffPanel label={`Proposed ${channel}`} tone="lime">
        <dl className="grid grid-cols-[auto_1fr] gap-x-s3 gap-y-s1 text-small text-ink">
          <dt className="font-semibold opacity-70">To</dt>
          <dd className="font-mono">{to ?? "—"}</dd>
          {cc && (
            <>
              <dt className="font-semibold opacity-70">Cc</dt>
              <dd className="font-mono">{cc}</dd>
            </>
          )}
          <dt className="font-semibold opacity-70">Subject</dt>
          <dd className="font-semibold">{subject ?? "—"}</dd>
        </dl>
        {body && (
          <pre className="mt-s3 max-h-48 overflow-y-auto whitespace-pre-wrap font-sans text-small text-ink">
            {body}
          </pre>
        )}
      </DiffPanel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* send_slack — paper-styled message preview                          */
/* ------------------------------------------------------------------ */

function SendSlackPreview({ proposed }: { proposed: unknown }) {
  const p = asRecord(proposed);
  const to = Array.isArray(p.to) ? (p.to as string[]).join(", ") : (p.to as string | undefined);
  const body = (p.body_md as string | undefined) ?? "";

  // Slack recipients in this app are internal teammates (AEs, CSMs) tied
  // to a Salesforce account context — not customer endpoints. Label as
  // "Salesforce account" so junior CSMs don't read the @handle as a
  // customer destination.
  return (
    <div className="grid grid-cols-1 gap-s3 md:grid-cols-[1fr_3fr]">
      <DiffPanel label="Current" tone="paper">
        <p className="font-mono text-small italic text-ink-2">(no message)</p>
      </DiffPanel>
      <DiffPanel label="Proposed Slack message" tone="lime">
        <dl className="grid grid-cols-[auto_1fr] gap-x-s3 gap-y-s1 text-small text-ink">
          <dt className="font-semibold opacity-70">Salesforce account</dt>
          <dd className="font-mono">{to ?? "—"}</dd>
        </dl>
        {body && (
          <pre className="mt-s3 whitespace-pre-wrap font-sans text-small text-ink">{body}</pre>
        )}
      </DiffPanel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* create_task — labeled task block                                   */
/* ------------------------------------------------------------------ */

function CreateTaskPreview({ proposed }: { proposed: unknown }) {
  const p = asRecord(proposed);
  return (
    <div className="grid grid-cols-1 gap-s3 md:grid-cols-[1fr_3fr]">
      <DiffPanel label="Current" tone="paper">
        <p className="font-mono text-small italic text-ink-2">(no task)</p>
      </DiffPanel>
      <DiffPanel label="Proposed task" tone="lime">
        <dl className="grid grid-cols-[auto_1fr] gap-x-s3 gap-y-s1 text-small text-ink">
          <dt className="font-semibold opacity-70">Subject</dt>
          <dd className="font-semibold">{(p.subject as string | undefined) ?? "—"}</dd>
          <dt className="font-semibold opacity-70">Due</dt>
          <dd className="font-mono tabular">{(p.due_date as string | undefined) ?? "—"}</dd>
          <dt className="font-semibold opacity-70">Owner</dt>
          <dd className="font-mono">{(p.assigned_to as string | undefined) ?? "—"}</dd>
          {p.priority != null && (
            <>
              <dt className="font-semibold opacity-70">Priority</dt>
              <dd>{String(p.priority)}</dd>
            </>
          )}
        </dl>
      </DiffPanel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* recompute_health — score delta strip                               */
/* ------------------------------------------------------------------ */

function RecomputeHealthDiff({ current, proposed }: { current: unknown; proposed: unknown }) {
  const c = asRecord(current);
  const p = asRecord(proposed);
  const curScore = typeof c.score === "number" ? c.score : null;
  const propScore = typeof p.score === "number" ? p.score : null;
  const delta = curScore != null && propScore != null ? propScore - curScore : null;

  return (
    <div className="grid grid-cols-1 gap-s3 md:grid-cols-2">
      <DiffPanel label="Current health" tone="paper">
        <ScorePill score={curScore} band={c.band as string | undefined} />
      </DiffPanel>
      <DiffPanel label="Proposed health" tone="lime">
        <ScorePill score={propScore} band={p.band as string | undefined} />
        {delta != null && (
          <div className="mt-s2 font-mono text-small tabular text-ink">
            {delta > 0 ? "+" : ""}
            {delta} from previous
          </div>
        )}
      </DiffPanel>
    </div>
  );
}

function ScorePill({ score, band }: { score: number | null; band?: string }) {
  return (
    <div className="flex items-baseline gap-s3 text-ink">
      <span className="font-serif text-h2 tabular">{score ?? "—"}</span>
      {band && (
        <span className="uppercase tracking-wider text-micro font-bold opacity-70">
          band: {band}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Fallback — pretty-printed JSON                                     */
/* ------------------------------------------------------------------ */

function FallbackJsonDiff({ current, proposed }: { current: unknown; proposed: unknown }) {
  return (
    <div className="grid grid-cols-1 gap-s3 md:grid-cols-2">
      <DiffPanel label="Current" tone="paper">
        <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-micro text-ink">
          {current == null ? "(none)" : JSON.stringify(current, null, 2)}
        </pre>
      </DiffPanel>
      <DiffPanel label="Proposed" tone="lime">
        <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-micro text-ink">
          {proposed == null ? "(none)" : JSON.stringify(proposed, null, 2)}
        </pre>
      </DiffPanel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared atoms                                                       */
/* ------------------------------------------------------------------ */

function DiffPanel({
  label,
  tone,
  children,
}: {
  label: string;
  tone: "paper" | "lime";
  children: React.ReactNode;
}) {
  const surface =
    tone === "lime"
      ? "bg-gradient-to-br from-lime to-volt"
      : "bg-paper";
  return (
    <div className={`rounded-md border border-paper-edge p-s4 ${surface}`}>
      <p className="mb-s2 text-micro font-bold uppercase tracking-wider text-ink/60">
        {label}
      </p>
      {children}
    </div>
  );
}

function FieldLabel({ name }: { name: string }) {
  return (
    <p className="mb-s2 font-mono text-small font-semibold text-ink/80">
      {name}
    </p>
  );
}

function ValueText({
  value,
  placeholder,
}: {
  value: unknown;
  placeholder: string;
}) {
  if (value == null || value === "") {
    return <p className="font-mono text-small italic text-ink-2">{placeholder}</p>;
  }
  if (typeof value === "string") {
    return <p className="whitespace-pre-wrap font-sans text-small text-ink">{value}</p>;
  }
  return (
    <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-micro text-ink">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}
