-- Phase 1.07 — explicit REVOKE on the catalog tables (D-1.07-14).
--
-- WHAT THIS FIXES. `20260715021215_schema.sql` (lines 150-152) says:
--
--   "Local Supabase does NOT auto-expose new public tables to the Data API roles ... So a table is
--    unreachable by anon/authenticated/service_role until GRANTed here. We grant deliberately and
--    narrowly."
--
-- That is TRUE locally (`auto_expose_new_tables` is unset in config.toml) and was FALSE on the
-- hosted project, where the creation-time "Automatically expose new tables" toggle was left ON
-- (D-1.07-3). With it on, `drops`/`products`/`variants` were created with anon/authenticated ALREADY
-- holding INSERT/UPDATE/DELETE/TRUNCATE — so `grant select` added nothing and nothing took the rest
-- away. Measured against Frankfurt in 1.07, before this file:
--
--   hosted anon: DELETE,INSERT,REFERENCES,SELECT,TRIGGER,TRUNCATE,UPDATE
--   local  anon: REFERENCES,SELECT,TRIGGER,TRUNCATE
--
-- NO DATA WAS EVER AT RISK. RLS is enabled and the only policies are SELECT, so every anon write
-- matched no policy and touched 0 rows — verified empirically on hosted (stock 5 -> 5, row count
-- unchanged, INSERT rejected 42501). The problem is depth, not a hole: hosted had ONE barrier (RLS)
-- where local has TWO (RLS + no privilege). One stray permissive policy, or one `disable row level
-- security`, and "anybody on the internet set stock to whatever they like" (schema.sql:162) stops
-- being hypothetical.
--
-- WHY A MIGRATION AND NOT THE DASHBOARD TOGGLE. Turning "auto-expose new tables" off does NOT
-- retroactively revoke privileges already granted, so it would not fix these three tables. A
-- migration also survives the toggle being flipped back, and a step that lives only in a dashboard
-- is a step that gets lost.
--
-- THE PATTERN. Everywhere the migrations revoke EXPLICITLY — orders, order_items, order_attempts,
-- and every function (create_order, expire_reservations, check_order_rate_limit) — hosted and local
-- already agree exactly. The catalog was the only object relying on the default being empty, and it
-- was the only object that diverged. This file extends the existing posture; it invents nothing.
--
-- Idempotent: revoking a privilege that is not held is a no-op, so `db reset` and a re-run both
-- reproduce this state. This changes NO function and NO table shape.

-- Revoke every write privilege from the Data API roles. TRUNCATE matters most: it is NOT subject to
-- RLS, so a TRUNCATE grant is not covered by the "no write policy" barrier at all.
revoke insert, update, delete, truncate
  on public.drops, public.products, public.variants
  from anon, authenticated;

-- Also from PUBLIC. A revoke aimed only at anon/authenticated leaves a default PUBLIC grant intact,
-- and every role inherits PUBLIC — the exact hole D-1.03-9 was written for.
revoke insert, update, delete, truncate
  on public.drops, public.products, public.variants
  from public;

-- Re-assert the intended posture explicitly (schema.sql:167). SELECT only; RLS's SELECT policies
-- remain the second barrier. Idempotent.
grant select on public.drops, public.products, public.variants to anon, authenticated;
