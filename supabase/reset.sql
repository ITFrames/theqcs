-- QCS ABROAD — wipe all student data (shared test/prod DB) before launch.
-- Run in the Supabase SQL editor. Order respects foreign keys; CASCADE covers
-- child rows. This does NOT drop tables — the schema stays intact.

truncate table
  shortlist,
  documents,
  applications,
  profiles,
  otps,
  users
restart identity cascade;
