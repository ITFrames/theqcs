-- QCS ABROAD — Supabase / Postgres schema
-- Run this in the Supabase SQL editor to move from the in-memory dev store to
-- durable storage. The app's data layer (src/lib/db.ts) maps 1:1 to these tables.

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text unique not null,
  phone text not null,
  password_hash text not null,
  email_verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists otps (
  email text not null,
  purpose text not null check (purpose in ('register','login')),
  code text not null,
  expires_at timestamptz not null,
  attempts int not null default 0,
  primary key (email, purpose)
);

create table if not exists profiles (
  user_id uuid primary key references users(id) on delete cascade,
  date_of_birth date,
  gender text,
  nationality text,
  current_country text,
  city text,
  whatsapp text,
  highest_qualification text,
  institution_name text,
  field_of_study text,
  graduation_year text,
  grade text,
  english_test text,
  english_score text,
  destinations text[],
  preferred_program text,
  study_level text,
  preferred_intake text,
  expected_start_year text,
  budget text,
  funding_method text,
  onboarding_complete boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  university text not null,
  program text not null,
  country text not null,
  flag text,
  intake text,
  application_id text not null,
  status text not null
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  category text not null,
  name text not null,
  status text not null,
  file_name text,
  uploaded_at timestamptz
);

create table if not exists shortlist (
  user_id uuid references users(id) on delete cascade,
  program_id text not null,
  primary key (user_id, program_id)
);

create table if not exists sessions (
  token text primary key,
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Storage (documents bucket)
-- Create a PRIVATE bucket named `documents` in Supabase Storage.
-- Enforce the upload policy at the platform level as the final guardrail:
--   * Allowed MIME types: application/pdf
--   * Max file size: 4 MB (4194304 bytes)
-- In the Dashboard: Storage -> documents -> Settings, set
--   "Allowed MIME types" = application/pdf and
--   "File size limit"     = 4 MB.
-- (These mirror src/lib/uploadConstraints.ts, which the app enforces in code.)
-- ---------------------------------------------------------------------------
