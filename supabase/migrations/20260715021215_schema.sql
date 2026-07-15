-- Phase 1.03 — Data layer: schema.
--
-- Five tables that make "SOLD OUT" true: drops → products → variants (stock lives here, per size),
-- and orders → order_items (the order IS the reservation, D-1.03-2). Stock is never decremented in
-- application code; it is decremented atomically inside create_order() (see the create_order
-- migration). This file is only the shape + the guard rails (constraints, indexes, RLS, grants).
--
-- Roles referenced (anon, authenticated, service_role) are provisioned by Supabase. anon ships to
-- every browser, so RLS + explicit grants below are the only thing between the internet and this
-- data (brief §5).

-- ---------------------------------------------------------------------------------------------
-- Enum + sequence + shared trigger
-- ---------------------------------------------------------------------------------------------

-- Order lifecycle. Default 'reserved': an order holds stock for reserved_until, then either becomes
-- 'confirmed'/'fulfilled' or is released back ('expired' by the sweep, or 'cancelled' by hand later).
create type public.order_status as enum ('reserved', 'confirmed', 'fulfilled', 'cancelled', 'expired');

-- Human order numbers TRJ-0001, TRJ-0002, … A sequence ADVANCES ON ROLLBACK, so numbers WILL have
-- gaps (a rejected/duplicate order still burns a number). That is correct and intended: gapless
-- numbering requires contention, which is exactly the thing this whole phase removes. Do not "fix" it.
create sequence public.order_number_seq as integer start with 1 increment by 1;

-- Keeps orders.updated_at current on every UPDATE. search_path pinned empty (it references no schema
-- objects) to satisfy the SECURITY-DEFINER hygiene lint uniformly across this project's functions.
create function public.set_updated_at()
  returns trigger
  language plpgsql
  set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------------------------
-- drops
-- ---------------------------------------------------------------------------------------------
create table public.drops (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  starts_at  timestamptz not null,
  ends_at    timestamptz,
  created_at timestamptz not null default now(),
  -- an open-ended drop (ends_at null) is allowed; a closed one must end after it starts.
  constraint drops_window_valid check (ends_at is null or ends_at > starts_at)
);
comment on table public.drops is
  'One timed drop. The window [starts_at, ends_at] is the server-side source of truth for whether ordering is open; the browser never decides this (D-1.03-7). ends_at null = open-ended.';

-- ---------------------------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------------------------
create table public.products (
  id         uuid primary key default gen_random_uuid(),
  drop_id    uuid not null references public.drops (id),
  slug       text not null unique,
  name_mk    text not null,
  name_en    text not null,
  -- MKD денари, whole units, no subunit. A price is always a positive number of denari.
  price_mkd  integer not null check (price_mkd > 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
comment on table public.products is
  'A product within a drop. price_mkd is whole MKD (денари). Real names/prices are OWED by Vladimir and arrive as typed drop config in 1.04; anything here in local/seed data is a fake test fixture.';

-- ---------------------------------------------------------------------------------------------
-- variants — stock lives here, PER SIZE (D-1.03-1)
-- ---------------------------------------------------------------------------------------------
create table public.variants (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id),
  size       text not null,
  -- Backstop only, NOT the mechanism. The atomic conditional decrement in create_order() is what
  -- keeps stock >= 0. If this check ever FIRES, the decrement is broken and you have found a real
  -- bug — say so in the completion report; do not relax the check.
  stock      integer not null check (stock >= 0),
  unique (product_id, size)
);
comment on table public.variants is
  'Buyable unit = (product, size). stock is the real, limited count for that size. Decremented ONLY by create_order() via a single conditional UPDATE; never read-then-written in app code.';

-- ---------------------------------------------------------------------------------------------
-- orders — the order IS the reservation (D-1.03-2)
-- ---------------------------------------------------------------------------------------------
create table public.orders (
  id               uuid primary key default gen_random_uuid(),
  -- TRJ-0001 … Gaps are expected (see order_number_seq above).
  order_number     text not null unique default ('TRJ-' || lpad(nextval('public.order_number_seq')::text, 4, '0')),
  drop_id          uuid not null references public.drops (id),
  customer_name    text not null,
  phone            text not null,
  -- Normalised form the app dedupes/rate-limits on. TODO(2.02): this ^\+389\d{8}$ pattern is the
  -- orchestrator's best read of Macedonian numbering and is NOT a VERIFIED fact — the native
  -- reviewers confirm or loosen it. Vladimir's 078820520 normalises to +38978820520 and must pass.
  -- If it ever rejects a real number, loosening it is the fix.
  phone_normalized text not null check (phone_normalized ~ '^\+389\d{8}$'),
  address          text not null,
  city             text not null,
  notes            text,
  status           public.order_status not null default 'reserved',
  -- When the 48h (configurable) hold lapses, expire_reservations() releases the stock.
  reserved_until   timestamptz not null,
  -- Price the customer agreed to, summed. A backstop > 0 mirrors price_mkd > 0.
  total_mkd        integer not null check (total_mkd > 0),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
comment on table public.orders is
  'A customer order, which IS the stock reservation (D-1.03-2): status + reserved_until live here, no separate reservations table. Holds real customer PII (name, phone, address) — locked down by RLS below.';

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- One LIVE order per phone per drop (D-1.03-4). A DB-level rate limit, not app-level. Only live
-- statuses count, so an expired/cancelled order frees the phone to order again.
create unique index orders_one_live_per_phone_per_drop
  on public.orders (drop_id, phone_normalized)
  where status in ('reserved', 'confirmed', 'fulfilled');

-- The expiry sweep reads exactly this: reserved orders past their hold. Partial index keeps it cheap.
create index orders_expiry_sweep
  on public.orders (status, reserved_until)
  where status = 'reserved';

-- ---------------------------------------------------------------------------------------------
-- order_items — price snapshot, not a join (brief §2)
-- ---------------------------------------------------------------------------------------------
create table public.order_items (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null references public.orders (id) on delete cascade,
  variant_id     uuid not null references public.variants (id),
  -- Max 2 units per line; the cross-item cap (total 1–2) is enforced in create_order().
  quantity       integer not null check (quantity between 1 and 2),
  -- SNAPSHOT of the price at order time. On cash-on-delivery the courier collects a specific number
  -- from a real doorstep; the order must remember what the customer agreed to even if config changes.
  unit_price_mkd integer not null check (unit_price_mkd > 0),
  unique (order_id, variant_id)
);
comment on table public.order_items is
  'Line items for an order. unit_price_mkd is a PRICE SNAPSHOT taken at order time, never a live join to products.price_mkd — the doorstep total must not move under the customer.';

-- ---------------------------------------------------------------------------------------------
-- Row Level Security + grants (brief §5)
--
-- Local Supabase does NOT auto-expose new public tables to the Data API roles (the modern cloud
-- default; see the api.auto_expose_new_tables note in config.toml). So a table is unreachable by
-- anon/authenticated/service_role until GRANTed here. We grant deliberately and narrowly.
-- ---------------------------------------------------------------------------------------------

alter table public.drops       enable row level security;
alter table public.products    enable row level security;
alter table public.variants    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- Catalog is public and read-only. SELECT policy + SELECT grant (RLS needs BOTH: a policy AND the
-- table privilege). No insert/update/delete policy exists — an anon UPDATE on variants would let
-- anybody on the internet set stock to whatever they like.
create policy drops_public_read    on public.drops       for select to anon, authenticated using (true);
create policy products_public_read on public.products    for select to anon, authenticated using (true);
create policy variants_public_read on public.variants    for select to anon, authenticated using (true);
grant select on public.drops, public.products, public.variants to anon, authenticated;

-- The server (service_role, used only server-side behind Turnstile once 1.04 lands) reads the whole
-- catalog and the order tables for order lists. It does NOT get direct INSERT/UPDATE on stock or
-- orders: every write goes through the SECURITY DEFINER functions, keeping the "no read-then-write
-- on stock in app code" rule true even for the privileged role.
grant select on public.drops, public.products, public.variants, public.orders, public.order_items
  to service_role;

-- orders + order_items: RLS is enabled with ZERO policies = deny-all to anon/authenticated. Belt and
-- braces, also REVOKE every privilege — these rows are real customers' names, phones, and addresses.
revoke all on public.orders      from anon, authenticated;
revoke all on public.order_items from anon, authenticated;
