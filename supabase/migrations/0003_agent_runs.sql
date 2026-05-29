-- Operator Surface — v1 schema
-- 0003: agent_runs append-only execution log.
--
-- Each row = one execution of an agent. Hermes writes; this app reads.
-- `duration_ms` is computed automatically when `finished_at` is set.
-- `triggered_by` describes what kicked off the run (cron / manual /
-- webhook / …). NOT the trigger keyword.

create table public.agent_runs (
  id              uuid primary key default gen_random_uuid(),
  agent_id        uuid not null references public.agents(id) on delete restrict,
  started_at      timestamptz not null default now(),
  finished_at     timestamptz,
  duration_ms     integer generated always as (
                    case
                      when finished_at is null then null
                      else (extract(epoch from (finished_at - started_at)) * 1000)::int
                    end
                  ) stored,
  status          agent_run_status not null default 'running',
  triggered_by    text,
  items_processed integer not null default 0,
  input_summary   text,
  output_summary  text,
  error           text,
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now()
);

comment on table public.agent_runs is
  'One agent execution. Append-only audit log. Hermes writes; this app reads. See docs/schema-conventions.md for metadata JSONB shape (model_usage, version, trigger_payload, etc.).';

comment on column public.agent_runs.triggered_by is
  'What kicked off the run: ''cron'' | ''manual'' | ''webhook'' | ''api''. NOT the trigger keyword.';

comment on column public.agent_runs.duration_ms is
  'Computed automatically from started_at + finished_at. Null while the run is in progress.';
