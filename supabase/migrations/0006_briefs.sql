-- Operator Surface — v1 schema
-- 0006: briefs — daily brief content per operator.
--
-- One row per (operator, date). Hermes generates; the operator reads
-- and writes back only `viewed_at`.
-- `body_md` is markdown narrative; `structured_data` is JSONB that
-- powers the renderable widgets (KPI chips, refs, priorities) — see
-- docs/schema-conventions.md.

create table public.briefs (
  id              uuid primary key default gen_random_uuid(),
  operator_id     uuid not null references auth.users(id) on delete cascade,
  brief_date      date not null,
  headline        text not null,
  body_md         text not null,
  structured_data jsonb not null default '{}'::jsonb,
  generated_by    uuid references public.agent_runs(id) on delete set null,
  generated_at    timestamptz not null default now(),
  viewed_at       timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (operator_id, brief_date)
);

comment on table public.briefs is
  'Daily brief content per operator. One row per (operator, date). body_md is markdown; structured_data is renderable JSONB.';

comment on column public.briefs.brief_date is
  'The calendar date the brief is for (in the operator''s working timezone — handled in app layer).';

comment on column public.briefs.viewed_at is
  'Set by Operator Surface when the operator opens the brief. Used for engagement metrics and stale-brief alerts.';

create trigger briefs_updated_at
  before update on public.briefs
  for each row execute function public.set_updated_at();
