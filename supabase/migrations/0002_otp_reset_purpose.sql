-- Allow 'reset' as an OTP purpose (password reset flow). Idempotent-ish:
-- drops the old CHECK constraint and re-adds it including 'reset'.
alter table otps drop constraint if exists otps_purpose_check;
alter table otps
  add constraint otps_purpose_check
  check (purpose in ('register','login','reset'));
