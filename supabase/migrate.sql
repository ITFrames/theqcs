-- QCS ABROAD — Idempotent migration / schema sync
-- ===========================================================================
-- Run this in the Supabase SQL Editor ANY TIME the schema changes. It is safe
-- to run repeatedly: it only creates tables/columns that don't already exist
-- and never drops or overwrites data.
--
--   * Tables:  CREATE TABLE IF NOT EXISTS
--   * Columns: ADD COLUMN IF NOT EXISTS
--
-- After adding a new column to `supabase/schema.sql`, mirror it here with an
-- `add column if not exists` line, then re-run this file against your DB.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
create table if not exists users (
  id uuid primary key default gen_random_uuid()
);
alter table users add column if not exists first_name text;
alter table users add column if not exists last_name text;
alter table users add column if not exists email text;
alter table users add column if not exists phone text;
alter table users add column if not exists password_hash text;
alter table users add column if not exists email_verified boolean not null default false;
alter table users add column if not exists created_at timestamptz not null default now();

-- Ensure email uniqueness (safe if it already exists).
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'users_email_key'
  ) then
    alter table users add constraint users_email_key unique (email);
  end if;
end$$;

-- ---------------------------------------------------------------------------
-- otps
-- ---------------------------------------------------------------------------
create table if not exists otps (
  email text not null,
  purpose text not null,
  primary key (email, purpose)
);
alter table otps add column if not exists code text;
alter table otps add column if not exists expires_at timestamptz;
alter table otps add column if not exists attempts int not null default 0;

-- ---------------------------------------------------------------------------
-- profiles  (all current onboarding fields)
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  user_id uuid primary key references users(id) on delete cascade
);
alter table profiles add column if not exists date_of_birth date;
alter table profiles add column if not exists gender text;
alter table profiles add column if not exists nationality text;
alter table profiles add column if not exists current_country text;
alter table profiles add column if not exists city text;
alter table profiles add column if not exists whatsapp text;
alter table profiles add column if not exists highest_qualification text;
alter table profiles add column if not exists institution_name text;
alter table profiles add column if not exists field_of_study text;
alter table profiles add column if not exists graduation_year text;
alter table profiles add column if not exists graduation_year_from text;
alter table profiles add column if not exists graduation_year_to text;
alter table profiles add column if not exists grade text;
alter table profiles add column if not exists english_test text;
alter table profiles add column if not exists english_score text;
alter table profiles add column if not exists english_tests text[];
alter table profiles add column if not exists english_scores jsonb;
alter table profiles add column if not exists has_masters boolean;
alter table profiles add column if not exists masters_institution text;
alter table profiles add column if not exists masters_field text;
alter table profiles add column if not exists masters_graduation_year text;
alter table profiles add column if not exists masters_grade text;
alter table profiles add column if not exists destinations text[];
alter table profiles add column if not exists preferred_program text;
alter table profiles add column if not exists study_level text;
alter table profiles add column if not exists preferred_intake text;
alter table profiles add column if not exists expected_start_year text;
alter table profiles add column if not exists budget text;
alter table profiles add column if not exists funding_method text;
alter table profiles add column if not exists onboarding_complete boolean not null default false;
alter table profiles add column if not exists updated_at timestamptz not null default now();

-- ---------------------------------------------------------------------------
-- applications
-- ---------------------------------------------------------------------------
create table if not exists applications (
  id uuid primary key default gen_random_uuid()
);
alter table applications add column if not exists user_id uuid references users(id) on delete cascade;
alter table applications add column if not exists university text;
alter table applications add column if not exists program text;
alter table applications add column if not exists country text;
alter table applications add column if not exists flag text;
alter table applications add column if not exists intake text;
alter table applications add column if not exists application_id text;
alter table applications add column if not exists status text;

-- ---------------------------------------------------------------------------
-- documents
-- ---------------------------------------------------------------------------
create table if not exists documents (
  id uuid primary key default gen_random_uuid()
);
alter table documents add column if not exists user_id uuid references users(id) on delete cascade;
alter table documents add column if not exists category text;
alter table documents add column if not exists name text;
alter table documents add column if not exists status text;
alter table documents add column if not exists file_name text;
alter table documents add column if not exists uploaded_at timestamptz;

-- ---------------------------------------------------------------------------
-- shortlist
-- ---------------------------------------------------------------------------
create table if not exists shortlist (
  user_id uuid references users(id) on delete cascade,
  program_id text not null,
  primary key (user_id, program_id)
);

-- ---------------------------------------------------------------------------
-- sessions
-- ---------------------------------------------------------------------------
create table if not exists sessions (
  token text primary key,
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table sessions add column if not exists user_id uuid references users(id) on delete cascade;
alter table sessions add column if not exists created_at timestamptz not null default now();

-- ---------------------------------------------------------------------------
-- email_suppressions
-- ---------------------------------------------------------------------------
create table if not exists email_suppressions (
  email text primary key
);
alter table email_suppressions add column if not exists reason text;
alter table email_suppressions add column if not exists created_at timestamptz not null default now();

-- ===========================================================================
-- Done. This migration is idempotent — running it again is a no-op for
-- anything that already exists.
-- ===========================================================================
