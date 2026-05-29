-- Operator Surface — v1 schema
-- 0005: approvals — proposed agent actions awaiting human review.
--
-- Hermes proposes; Operator Surface decides. Hermes polls for
-- status = 'approved' and executes.
-- `current_value` and `proposed_value` are free-shape JSONB keyed by
-- action_type ('send_reply' | 'update_field' | 'create_task' |
-- 'recompute_health' | …). See docs/schema-conventions.md for shapes.

create table public.approvals (
  id                  uuid primary key default gen_random_uuid(),
  agent_run_id        uuid references public.agent_runs(id) on delete set null,
  agent_id            uuid not null references public.agents(id) on delete restrict,
  decision_id         uuid references public.decisions(id) on delete set null,
  action_type         text not null,
  target_record_type  text not null,
  target_record_id    text not null,
  current_value       jsonb,
  proposed_value      jsonb not null,
  rationale           text,
  status              approval_status not null default 'pending',
  decided_by          uuid references auth.users(id) on delete set null,
  decided_at          timestamptz,
  decision_note       text,
  expires_at          timestamptz,
  metadata            jsonb not null default '{}'::jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table public.approvals is
  'Proposed agent actions awaiting human review. Hermes polls for status=approved and executes. See docs/schema-conventions.md for action_type → proposed_value shape conventions.';

comment on column public.approvals.action_type is
  'What the agent wants to do: ''send_reply'' | ''update_field'' | ''create_task'' | ''recompute_health'' | …';

comment on column public.approvals.current_value is
  'Free-shape JSONB. The pre-change state of the target. Null when proposing a brand-new record.';

comment on column public.approvals.proposed_value is
  'Free-shape JSONB. The post-change state the agent wants. Shape varies by action_type.';

comment on column public.approvals.decided_by is
  'auth.users.id of the operator who approved/rejected. Set when status leaves ''pending''.';

create trigger approvals_updated_at
  before update on public.approvals
  for each row execute function public.set_updated_at();
