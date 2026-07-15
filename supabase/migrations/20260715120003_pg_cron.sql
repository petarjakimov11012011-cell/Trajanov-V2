-- Phase 1.04 — schedule expire_reservations() with pg_cron (D-1.04-2, D-1.04-3).
--
-- expire_reservations() has existed since 1.03 but NOTHING calls it. Unscheduled, a lapsed 48h hold
-- never returns its unit to stock — the shirt is sold to nobody, forever. pg_cron runs the sweep
-- inside the database, so a host migration off Vercel is a redeploy, not a silent loss of expiry
-- (the whole reason Vercel Cron was rejected — D-1.04-2).
--
-- Enabling the extension in a migration means `supabase db reset` produces a WORKING schedule from
-- scratch, with no manual dashboard step (a DoD requirement).
--
-- FORWARD RISK carried to 1.07 (owed-verification): pg_cron runs in UTC; a PAUSED Supabase free-tier
-- project silently pauses every schedule; and this whole file is unproven against hosted Supabase.

create extension if not exists pg_cron;

-- cron.schedule(name, schedule, command) UPSERTS by name, so re-running this file (or a reset) is
-- idempotent — it never stacks duplicate jobs.

-- 1. The sweep: every 5 minutes. A unit can sit dead for at most ~5 min after its hold lapses; against
--    a 48h hold on a drop of tens of shirts that is invisible (D-1.04-3). More frequent buys nothing
--    but run-log rows.
select cron.schedule(
  'expire-reservations',
  '*/5 * * * *',
  $$select public.expire_reservations();$$
);

-- 2. Prune the run-log nightly. pg_cron's cron.job_run_details is documented to grow huge and slow the
--    DB; at one sweep every 5 min that is 288 rows/day. Keep 7 days, drop the rest. 03:17 UTC — off the
--    top of the hour so it does not pile onto a sweep tick (D-1.04-3).
select cron.schedule(
  'prune-cron-run-details',
  '17 3 * * *',
  $$delete from cron.job_run_details where end_time < now() - interval '7 days';$$
);
