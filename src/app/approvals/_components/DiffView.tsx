"use client";

/**
 * DiffView — render `current_value` vs `proposed_value` per action_type.
 *
 * Two modes:
 *   editable=false  Pure render. Used for in-flight / decided cards.
 *   editable=true   Text-heavy proposed fields become inputs/textareas.
 *                   Caller threads the draft via `proposedDraft` and
 *                   collects edits via `onProposedFieldChange`. The
 *                   original server data is always available via
 *                   `proposedValue` so a Reset button can revert.
 *
 * Renders body_md with a tiny markdown pass: paragraph wrapping on
 * blank lines, `**bold**` -> <strong>, and `- bullets` (a `-` at line
 * start) preserved. Anything fancier (lists, links, headers) would
 * need a real markdown lib; the bodies we draft today only use these.
 */

import { Fragment, useId } from "react";

type Json = unknown;

interface DiffViewProps {
  actionType: string;
  currentValue: Json;
  proposedValue: Json;
  /** When editing, the live draft. Falls back to proposedValue. */
  proposedDraft?: Json;
  /** True only on pending cards. */
  editable?: boolean;
  /** Caller merges {field: value} into its local draft state. */
  onProposedFieldChange?: (field: string, value: unknown) => void;
}

export function DiffView({
  actionType,
  currentValue,
  proposedValue,
  proposedDraft,
  editable = false,
  onProposedFieldChange,
}: DiffViewProps) {
  // When editing, prefer the live draft so changes show immediately.
  // When not editing, always render the server data.
  const proposed = editable && proposedDraft !== undefined ? proposedDraft : proposedValue;

  const editProps = {
    proposed,
    editable,
    onChange: onProposedFieldChange ?? (() => {}),
  };

  switch (actionType) {
    case "send_reply":
    case "send_email": // legacy alias — same shape
      return <EmailPreview {...editProps} />;
    case "chatter_post":
      return <ChatterPreview {...editProps} />;
    case "create_task":
      return <CreateTaskPreview {...editProps} />;
    case "update_field":
      return <UpdateFieldDiff current={currentValue} proposed={proposed} />;
    case "change_health_band":
      return <HealthBandDiff current={currentValue} proposed={proposed} />;
    case "add_save_plan":
      return <SavePlanPreview {...editProps} />;
    case "flag_data_gap":
      return <DataGapPreview {...editProps} />;
    case "recompute_health":
      return <RecomputeHealthDiff current={currentValue} proposed={proposed} />;
    default:
      return <FallbackJsonDiff current={currentValue} proposed={proposed} />;
  }
}

/* ------------------------------------------------------------------ */
/* Markdown-ish body renderer                                         */
/* ------------------------------------------------------------------ */

function MarkdownBody({ text }: { text: string }) {
  // Split on blank lines into paragraphs. Within a paragraph, preserve
  // newlines (bullet lists rendered as text). Within text, replace
  // **bold** with <strong>.
  const paragraphs = text.split(/\n\n+/);
  return (
    <div className="space-y-s3 text-body text-foreground">
      {paragraphs.map((para, i) => (
        <p key={i} className="whitespace-pre-wrap">
          {renderInline(para)}
        </p>
      ))}
    </div>
  );
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/* ------------------------------------------------------------------ */
/* Type-specific renderers                                            */
/* ------------------------------------------------------------------ */

interface EditableProps {
  proposed: unknown;
  editable: boolean;
  onChange: (field: string, value: unknown) => void;
}

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

function EmailPreview({ proposed, editable, onChange }: EditableProps) {
  const p = asRecord(proposed);
  const to = Array.isArray(p.to)
    ? (p.to as string[]).join(", ")
    : (p.to as string | undefined) ?? "";
  const subject = (p.subject as string | undefined) ?? "";
  const body = (p.body_md as string | undefined) ?? "";

  return (
    <DiffGrid>
      <DiffPanel label="Current" tone="paper">
        <EmptyHint label="no email" />
      </DiffPanel>
      <DiffPanel label="Proposed email" tone="lime">
        <FieldRow label="To" value={to} mono />
        <FieldRow
          label="Subject"
          value={subject}
          editable={editable}
          onChange={(v) => onChange("subject", v)}
          semibold
        />
        <BodyField
          body={body}
          editable={editable}
          onChange={(v) => onChange("body_md", v)}
        />
      </DiffPanel>
    </DiffGrid>
  );
}

function ChatterPreview({ proposed, editable, onChange }: EditableProps) {
  const p = asRecord(proposed);
  const body = (p.body_md as string | undefined) ?? "";

  return (
    <DiffGrid>
      <DiffPanel label="Current" tone="paper">
        <EmptyHint label="no Chatter post yet" />
      </DiffPanel>
      <DiffPanel label="Proposed Chatter post" tone="lime">
        <BodyField
          body={body}
          editable={editable}
          onChange={(v) => onChange("body_md", v)}
        />
      </DiffPanel>
    </DiffGrid>
  );
}

function CreateTaskPreview({ proposed, editable, onChange }: EditableProps) {
  const p = asRecord(proposed);
  const subject = (p.subject as string | undefined) ?? "";
  const dueDate = (p.due_date as string | undefined) ?? "";
  const priority = (p.priority as string | undefined) ?? "";
  const owner = (p.assigned_to as string | undefined) ?? "";

  return (
    <DiffGrid>
      <DiffPanel label="Current" tone="paper">
        <EmptyHint label="no task" />
      </DiffPanel>
      <DiffPanel label="Proposed task" tone="lime">
        <FieldRow
          label="Subject"
          value={subject}
          editable={editable}
          onChange={(v) => onChange("subject", v)}
          semibold
        />
        <FieldRow
          label="Due"
          value={dueDate}
          editable={editable}
          onChange={(v) => onChange("due_date", v)}
          mono
          inputType="date"
        />
        <FieldRow
          label="Priority"
          value={priority}
          editable={editable}
          onChange={(v) => onChange("priority", v)}
        />
        <FieldRow label="Owner" value={owner || "(assigned at write time)"} mono />
      </DiffPanel>
    </DiffGrid>
  );
}

function UpdateFieldDiff({ current, proposed }: { current: unknown; proposed: unknown }) {
  const c = asRecord(current);
  const p = asRecord(proposed);
  const field = (p.field ?? c.field) as string | undefined;
  return (
    <DiffGrid columns="even">
      <DiffPanel label="Current" tone="paper">
        {field && <FieldLabel name={field} />}
        <ValueText value={c.value ?? c.new_value} placeholder="(empty)" />
      </DiffPanel>
      <DiffPanel label="Proposed" tone="lime">
        {field && <FieldLabel name={field} />}
        <ValueText value={p.new_value ?? p.value} placeholder="(empty)" />
      </DiffPanel>
    </DiffGrid>
  );
}

function HealthBandDiff({ current, proposed }: { current: unknown; proposed: unknown }) {
  const c = asRecord(current);
  const p = asRecord(proposed);
  const currentBand = (c.band ?? c.current_band) as string | undefined;
  const newBand = (p.new_band ?? p.band) as string | undefined;
  return (
    <DiffGrid columns="even">
      <DiffPanel label="Current health band" tone="paper">
        <BandPill band={currentBand} />
      </DiffPanel>
      <DiffPanel label="Proposed health band" tone="lime">
        <BandPill band={newBand} />
      </DiffPanel>
    </DiffGrid>
  );
}

function BandPill({ band }: { band?: string }) {
  const cls =
    band?.toLowerCase() === "red"
      ? "bg-bad/15 text-bad"
      : band?.toLowerCase() === "yellow"
      ? "bg-warm/15 text-warm"
      : band?.toLowerCase() === "green"
      ? "bg-good/15 text-good"
      : "bg-muted/15 text-muted-foreground";
  return (
    <span
      className={`inline-flex items-center rounded-pill px-s3 py-[3px] text-small font-bold uppercase tracking-wider ${cls}`}
    >
      {band ?? "—"}
    </span>
  );
}

function SavePlanPreview({ proposed, editable, onChange }: EditableProps) {
  const p = asRecord(proposed);
  const body = (p.body_md as string | undefined) ?? (p.plan as string | undefined) ?? "";

  return (
    <DiffGrid>
      <DiffPanel label="Current" tone="paper">
        <EmptyHint label="no save plan yet" />
      </DiffPanel>
      <DiffPanel label="Proposed save plan" tone="lime">
        <BodyField
          body={body}
          editable={editable}
          onChange={(v) => onChange("body_md", v)}
        />
      </DiffPanel>
    </DiffGrid>
  );
}

function DataGapPreview({ proposed, editable, onChange }: EditableProps) {
  const p = asRecord(proposed);
  const description =
    (p.description as string | undefined) ?? (p.body_md as string | undefined) ?? "";
  return (
    <DiffGrid>
      <DiffPanel label="Current" tone="paper">
        <EmptyHint label="no flag yet" />
      </DiffPanel>
      <DiffPanel label="Proposed data-gap flag" tone="lime">
        <BodyField
          body={description}
          editable={editable}
          onChange={(v) => onChange("description", v)}
        />
      </DiffPanel>
    </DiffGrid>
  );
}

function RecomputeHealthDiff({ current, proposed }: { current: unknown; proposed: unknown }) {
  const c = asRecord(current);
  const p = asRecord(proposed);
  const curScore = typeof c.score === "number" ? c.score : null;
  const propScore = typeof p.score === "number" ? p.score : null;
  const delta = curScore != null && propScore != null ? propScore - curScore : null;
  return (
    <DiffGrid columns="even">
      <DiffPanel label="Current health" tone="paper">
        <ScorePill score={curScore} band={c.band as string | undefined} />
      </DiffPanel>
      <DiffPanel label="Proposed health" tone="lime">
        <ScorePill score={propScore} band={p.band as string | undefined} />
        {delta != null && (
          <div className="mt-s2 font-mono text-small tabular text-foreground">
            {delta > 0 ? "+" : ""}
            {delta} from previous
          </div>
        )}
      </DiffPanel>
    </DiffGrid>
  );
}

function ScorePill({ score, band }: { score: number | null; band?: string }) {
  return (
    <div className="flex items-baseline gap-s3 text-foreground">
      <span className="font-serif text-h2 tabular">{score ?? "—"}</span>
      {band && (
        <span className="uppercase tracking-wider text-micro font-bold opacity-70">
          band: {band}
        </span>
      )}
    </div>
  );
}

function FallbackJsonDiff({ current, proposed }: { current: unknown; proposed: unknown }) {
  return (
    <DiffGrid columns="even">
      <DiffPanel label="Current" tone="paper">
        <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-micro text-foreground">
          {current == null ? "(none)" : JSON.stringify(current, null, 2)}
        </pre>
      </DiffPanel>
      <DiffPanel label="Proposed" tone="lime">
        <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-micro text-foreground">
          {proposed == null ? "(none)" : JSON.stringify(proposed, null, 2)}
        </pre>
      </DiffPanel>
    </DiffGrid>
  );
}

/* ------------------------------------------------------------------ */
/* Shared atoms                                                       */
/* ------------------------------------------------------------------ */

function DiffGrid({
  columns = "wide",
  children,
}: {
  columns?: "wide" | "even";
  children: React.ReactNode;
}) {
  const gridCls =
    columns === "even"
      ? "md:grid-cols-2"
      : "md:grid-cols-[1fr_3fr]";
  return <div className={`grid grid-cols-1 gap-s3 ${gridCls}`}>{children}</div>;
}

function DiffPanel({
  label,
  tone,
  children,
}: {
  label: string;
  tone: "paper" | "lime";
  children: React.ReactNode;
}) {
  const surface = tone === "lime" ? "bg-good/15" : "bg-card";
  return (
    <div className={`rounded-md border border-border p-s4 ${surface}`}>
      <p className="mb-s3 text-micro font-bold uppercase tracking-wider text-foreground/60">
        {label}
      </p>
      {children}
    </div>
  );
}

function EmptyHint({ label }: { label: string }) {
  return <p className="font-sans text-small italic text-muted-foreground">({label})</p>;
}

function FieldRow({
  label,
  value,
  editable = false,
  onChange,
  mono = false,
  semibold = false,
  inputType = "text",
}: {
  label: string;
  value: string;
  editable?: boolean;
  onChange?: (v: string) => void;
  mono?: boolean;
  semibold?: boolean;
  inputType?: string;
}) {
  const id = useId();
  const textCls = [
    mono ? "font-mono" : "font-sans",
    semibold ? "font-semibold" : "",
    "text-small text-foreground",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="mb-s2 grid grid-cols-[5rem_1fr] items-baseline gap-s3">
      <label
        htmlFor={editable ? id : undefined}
        className="text-micro font-semibold uppercase tracking-wider text-foreground/60"
      >
        {label}
      </label>
      {editable && onChange ? (
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`rounded-sm border border-border/40 bg-background/40 px-s2 py-[3px] focus:border-primary/60 focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary/40 ${textCls}`}
        />
      ) : (
        <span className={textCls}>{value || "—"}</span>
      )}
    </div>
  );
}

function BodyField({
  body,
  editable,
  onChange,
}: {
  body: string;
  editable: boolean;
  onChange: (v: string) => void;
}) {
  if (editable) {
    return (
      <textarea
        value={body}
        onChange={(e) => onChange(e.target.value)}
        rows={Math.min(Math.max(body.split(/\n/).length + 1, 6), 16)}
        className="mt-s2 w-full resize-y rounded-sm border border-border/40 bg-background/40 px-s3 py-s2 font-sans text-body leading-relaxed text-foreground focus:border-primary/60 focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary/40"
        placeholder="Body…"
      />
    );
  }
  if (!body) {
    return <EmptyHint label="empty" />;
  }
  return (
    <div className="mt-s2 max-h-72 overflow-y-auto">
      <MarkdownBody text={body} />
    </div>
  );
}

function FieldLabel({ name }: { name: string }) {
  return (
    <p className="mb-s2 font-mono text-small font-semibold text-foreground/80">{name}</p>
  );
}

function ValueText({ value, placeholder }: { value: unknown; placeholder: string }) {
  if (value == null || value === "") {
    return <p className="font-sans text-small italic text-muted-foreground">{placeholder}</p>;
  }
  if (typeof value === "string") {
    return <p className="whitespace-pre-wrap font-sans text-body text-foreground">{value}</p>;
  }
  return (
    <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-micro text-foreground">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}
