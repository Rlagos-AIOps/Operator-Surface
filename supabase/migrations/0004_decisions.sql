-- Operator Surface — v1 schema
-- 0004: decisions — agent judgments with reasoning trace.
--
-- A run produces many decisions. Each has the verdict (`label`), how
-- sure the agent was (`confidence`), what it was looking at
-- (`source_record_type` + `source_record_id`), narrative reasoning,
-- and a structured signal trace in `signals` JSONB.
--
-- `agent_id` is intentionally denormalized (also reachable through
-- agent_runs → agents) so the Decision Trace UI can filter by agent
-- without a join.

create table public.decisions (
  id                  uuid primary key default gen_random_uuid(),
  agent_run_id        uuid not null references public.agent_runs(id) on delete cascade,
  agent_id            uuid not null references public.agents(id)     on delete restrict,
  decision_type       text not null,
  source_record_type  text not null,
  source_record_id    text not null,
  label               text not null,
  confidence          numeric(4,3) check (
                        confidence is null
                        or (confidence >= 0 and confidence <= 1)
                      ),
  reasoning           text,
  signals             jsonb not null default '[]'::jsonb,
  metadata            jsonb not null default '{}'::jsonb,
  created_at          timestamptz not null default now()
);

comment on table public.decisions is
  'Each judgment an agent made during a run, with a reasoning trace. Powers Decision Trace UI.';

comment on column public.decisions.decision_type is
  'What kind of judgment this is: ''classify_intent'' | ''route_lead'' | ''recompute_health'' | …';

comment on column public.decisions.source_record_type is
  'The kind of record the decision was about: ''account'' | ''lead'' | ''thread'' | …';

comment on column public.decisions.source_record_id is
  'External ID of the source record (e.g. Salesforce ID, Zoom meeting ID, Gmail thread ID).';

comment on column public.decisions.confidence is
  'Agent self-reported confidence in the label. 0..1 inclusive. Null if the agent did not estimate.';

comment on column public.decisions.signals is
  'JSONB array. Recommended shape: [{name, value, weight, note?, source?}]. See docs/schema-conventions.md.';
