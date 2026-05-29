-- Operator Surface — v1 schema
-- 0002: agents registry + shared set_updated_at() trigger function.
--
-- Hermes writes the runtime fields (status, metadata.version, etc.).
-- Operator Surface owns `enabled` (the kill switch) and reads everything.
-- See docs/schema-conventions.md for the metadata JSONB shape.

create table public.agents (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  description  text,
  status       agent_status not null default 'idle',
  enabled      boolean not null default true,
  metadata     jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.agents is
  'Registry of agents. `enabled` is the operator-controlled kill switch; `status` is reported by the agent runtime (Hermes). See docs/schema-conventions.md for the metadata JSONB shape.';

comment on column public.agents.slug is
  'Stable string identifier used by Hermes to claim runs (e.g. health-score-recomputer, at-risk-triage).';

comment on column public.agents.enabled is
  'Operator-controlled kill switch. When false, Hermes must not start new runs for this agent.';

-- ============================================================
-- Shared updated_at trigger function
-- Reused by approvals, briefs, connections.
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger agents_updated_at
  before update on public.agents
  for each row execute function public.set_updated_at();
