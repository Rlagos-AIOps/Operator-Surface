-- Operator Surface — v1 schema
-- 0001: Postgres extensions + status enums shared across tables.

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- Status enums
-- ============================================================

-- Agent lifecycle (reported by Hermes runtime)
create type agent_status as enum (
  'idle',
  'running',
  'errored'
);

-- Outcome of a single agent execution
create type agent_run_status as enum (
  'running',
  'succeeded',
  'failed',
  'cancelled'
);

-- Lifecycle of a human approval
create type approval_status as enum (
  'pending',
  'approved',
  'rejected',
  'expired'
);

-- External tool connection lifecycle
create type connection_status as enum (
  'connected',
  'disconnected',
  'error',
  'expired'
);
