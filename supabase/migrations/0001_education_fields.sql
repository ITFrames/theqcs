-- Adds education fields introduced after the initial schema. Idempotent.
alter table profiles
  add column if not exists graduation_year_from text,
  add column if not exists graduation_year_to text,
  add column if not exists english_tests text[],
  add column if not exists english_scores jsonb,
  add column if not exists has_masters boolean,
  add column if not exists masters_institution text,
  add column if not exists masters_field text,
  add column if not exists masters_graduation_year text,
  add column if not exists masters_grade text;
