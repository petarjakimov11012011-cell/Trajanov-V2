-- Phase 1.04 — IP rate limit on order creation (D-1.04-7).
--
-- Cash on delivery means an order costs the orderer nothing, so abuse costs nothing. This is a
-- BACKSTOP against casual abuse, not a defence against a determined attacker (D-1.04-7 states this
-- plainly): phones are never OTP-verified, and anyone with a proxy pool + a Turnstile solver walks
-- through it. The real containment is the 48h hold + Vladimir's confirmation call.
--
-- PRIVACY: we never store a raw IP. The repo is public, the seller is a minor, and a large share of
-- the audience is 12–17. The app hashes the IP with a server-side pepper (SHA-256, in Node — the
-- pepper never reaches the database) and stores ONLY the hash. This table can therefore leak nothing
-- more than "some hash made N attempts", which is exactly the arithmetic we need and nothing more.

-- The threshold is a COLUMN on the drop, so Lazar can widen/narrow it from the Supabase dashboard
-- mid-drop without a deploy (Macedonian carriers NAT many subscribers behind few IPs — the number may
-- need to move on drop day). The window length (10 min) is a documented app constant (D-1.04-14).
alter table public.drops
  add column rate_limit_per_window integer not null default 20
  check (rate_limit_per_window > 0);
comment on column public.drops.rate_limit_per_window is
  'Max order-creation attempts allowed per IP-hash per rate-limit window (window length = 10 min, an app constant). Default 20 (D-1.04-7). Editable per drop from the dashboard without a deploy — sized for carrier NAT, not tight anti-abuse. A backstop only.';

-- Append-only log of order-creation attempts, keyed on the peppered IP hash. No raw IP, no PII.
create table public.order_attempts (
  id         bigint generated always as identity primary key,
  -- SHA-256 hex of (pepper || ip), computed in the app. 64 lowercase hex chars; never a raw address.
  ip_hash    text not null,
  created_at timestamptz not null default now()
);
comment on table public.order_attempts is
  'Rate-limit ledger for order creation (D-1.04-7). ip_hash is a peppered SHA-256 of the client IP computed in the app — the raw IP and the pepper never touch the database. Written and read ONLY by check_order_rate_limit(); no direct grants. Pruned implicitly by the sliding window (old rows stop counting) — not swept, so it grows; acceptable at this scale.';

-- Windowed count = "rows for this ip_hash newer than now() - window". This composite index makes it an
-- index-only range scan instead of a table scan on every order attempt.
create index order_attempts_ip_window on public.order_attempts (ip_hash, created_at desc);

-- Same posture as orders/order_items (D-1.03-9): RLS on with ZERO policies = deny-all, and REVOKE from
-- PUBLIC (not just anon/authenticated — the default PUBLIC grant is the hole D-1.03-9 was written for).
-- service_role gets NO direct DML: all access is through the SECURITY DEFINER function below.
alter table public.order_attempts enable row level security;
revoke all on public.order_attempts from public, anon, authenticated, service_role;

-- Records an attempt and reports whether it is allowed, in one call.
--   returns true  → under the limit; the attempt has been recorded.
--   returns false → at/over the limit; the attempt is NOT recorded (the sliding window frees up on its
--                   own after `p_window_seconds`, so a rejected hammerer is not rewarded with a row
--                   that would keep them blocked longer, and the table does not grow under an attack).
-- Best-effort under concurrency (count-then-insert is not atomic): two simultaneous calls can both pass
-- on the boundary, overshooting the limit by a hair. That is fine for a backstop (D-1.04-7, D-1.04-14).
create function public.check_order_rate_limit(
  p_ip_hash        text,
  p_max            integer,
  p_window_seconds integer default 600
)
  returns boolean
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  v_count integer;
begin
  if p_ip_hash is null or length(p_ip_hash) = 0 then
    -- A programming error (the app must always supply a hash), not a business error. Fail closed.
    raise exception 'check_order_rate_limit: p_ip_hash is required';
  end if;

  select count(*) into v_count
    from public.order_attempts
    where ip_hash = p_ip_hash
      and created_at > now() - make_interval(secs => p_window_seconds);

  if v_count >= p_max then
    return false;
  end if;

  insert into public.order_attempts (ip_hash) values (p_ip_hash);
  return true;
end;
$$;

revoke all on function public.check_order_rate_limit(text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.check_order_rate_limit(text, integer, integer)
  to service_role;
