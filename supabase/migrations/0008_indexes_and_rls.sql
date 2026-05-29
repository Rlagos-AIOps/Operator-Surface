-- Operator Surface — v1 schema
-- 0008: query indexes + Row Level Security policies.
--
-- RLS model summary:
--   * Service role (used by Hermes) bypasses RLS by Postgres convention.
--   * Authenticated users (Operator Surface UI) follow the policies below.
--   * agents / agent_runs / decisions  → readable by any authenticated user
--     (transparency by default).
--   * agents.enabled                   → updatable by any authenticated user
--     (v1; tightening to a role-gated policy is deferred to Task 3 / Auth).
--   * approvals                        → readable by all; any authenticated
--     user can decide. `decided_by` must equal the actor's auth.uid().
--   * briefs                           → per-operator (operator_id = auth.uid()).
--   * connections                      → per-operator (operator_id = auth.uid()).

-- ============================================================
-- INDEXES
-- ============================================================

create index agent_runs_agent_started_idx
  on public.agent_runs (agent_id, started_at desc);

create index agent_runs_status_running_idx
  on public.agent_runs (status)
  where status = 'running';

create index decisions_run_idx
  on public.decisions (agent_run_id);

create index decisions_source_idx
  on public.decisions (source_record_type, source_record_id);

create index decisions_created_idx
  on public.decisions (created_at desc);

create index approvals_status_idx
  on public.approvals (status, created_at desc);

create index approvals_target_idx
  on public.approvals (target_record_type, target_record_id);

create index approvals_agent_idx
  on public.approvals (agent_id, created_at desc);

create index briefs_operator_date_idx
  on public.briefs (operator_id, brief_date desc);

create index connections_operator_idx
  on public.connections (operator_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.agents      enable row level security;
alter table public.agent_runs  enable row level security;
alter table public.decisions   enable row level security;
alter table public.approvals   enable row level security;
alter table public.briefs      enable row level security;
alter table public.connections enable row level security;

-- ---------- agents ----------
-- Anyone authenticated can read; anyone authenticated can update
-- (column-level tightening — only `enabled` flippable — is deferred
-- to Task 3 once roles exist).
create policy agents_read_authenticated on public.agents
  for select to authenticated using (true);

create policy agents_update_authenticated on public.agents
  for update to authenticated
  using (true)
  with check (true);

-- ---------- agent_runs ----------
-- Read-only for authenticated; Hermes writes via service role.
create policy agent_runs_read_authenticated on public.agent_runs
  for select to authenticated using (true);

-- ---------- decisions ----------
-- Read-only for authenticated.
create policy decisions_read_authenticated on public.decisions
  for select to authenticated using (true);

-- ---------- approvals ----------
-- Any authenticated user can read all approvals.
create policy approvals_read_authenticated on public.approvals
  for select to authenticated using (true);

-- Any authenticated user can decide. The actor must stamp decided_by
-- with their own auth.uid() — enforced by `with check`.
create policy approvals_decide_authenticated on public.approvals
  for update to authenticated
  using (true)
  with check (decided_by = auth.uid());

-- ---------- briefs ----------
-- Per-operator. Operators see only their own briefs.
create policy briefs_select_own on public.briefs
  for select to authenticated
  using (operator_id = auth.uid());

create policy briefs_update_own on public.briefs
  for update to authenticated
  using (operator_id = auth.uid())
  with check (operator_id = auth.uid());

-- ---------- connections ----------
-- Per-operator. Operators manage only their own connections.
create policy connections_select_own on public.connections
  for select to authenticated
  using (operator_id = auth.uid());

create policy connections_insert_own on public.connections
  for insert to authenticated
  with check (operator_id = auth.uid());

create policy connections_update_own on public.connections
  for update to authenticated
  using (operator_id = auth.uid())
  with check (operator_id = auth.uid());

create policy connections_delete_own on public.connections
  for delete to authenticated
  using (operator_id = auth.uid());
