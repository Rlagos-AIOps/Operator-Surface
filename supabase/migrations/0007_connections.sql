-- Operator Surface — v1 schema
-- 0007: connections — external tool wiring per operator.
--
-- One row per (operator, provider). Tracks status and last sync.
-- Credentials are NOT stored here — those live in Supabase Vault or
-- the Hermes secret store. `metadata` is for non-secret config only
-- (display name, region, feature flags). See docs/schema-conventions.md.

create table public.connections (
  id                  uuid primary key default gen_random_uuid(),
  operator_id         uuid not null references auth.users(id) on delete cascade,
  provider            text not null,
  status              connection_status not null default 'disconnected',
  external_account_id text,
  scopes              text[] not null default '{}',
  last_sync_at        timestamptz,
  last_error          text,
  metadata            jsonb not null default '{}'::jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (operator_id, provider)
);

comment on table public.connections is
  'External tool connections per operator. Credentials are NOT stored here — see Supabase Vault. metadata is non-secret config only.';

comment on column public.connections.provider is
  'Tool identifier: ''salesforce'' | ''slack'' | ''google'' | ''zoom'' | …';

comment on column public.connections.external_account_id is
  'The upstream user or org ID inside the provider (e.g. Salesforce user ID, Slack team ID).';

comment on column public.connections.metadata is
  'NON-SECRET configuration only. Never store credentials or tokens here.';

create trigger connections_updated_at
  before update on public.connections
  for each row execute function public.set_updated_at();
