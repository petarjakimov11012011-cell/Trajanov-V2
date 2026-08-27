-- Phase Y.06 — remove the 2-unit-per-order business cap (D-Y.06-3, Petar's call, 2026-08-27).
--
-- WHAT CHANGES, AND NOTHING ELSE. Two things:
--   1. create_order() step 3 now rejects a total outside 1..99 instead of outside 1..2.
--   2. order_items' per-row quantity CHECK is relaxed from `between 1 and 2` to `between 1 and 99`.
--
-- (2) IS NOT OPTIONAL AND IS NOT COSMETIC (D-Y.06-5). Relaxing only the function would let a 3-unit
-- line pass step 3, decrement real stock in step 4, and then die at the step-6b INSERT with a raw
-- `23514` check violation — a 500 served to a real customer at the one moment that matters, instead
-- of a clean TR code. The two limits must move together or not at all.
--
-- `create or replace` with the IDENTICAL signature preserves the function's existing EXECUTE grants.
-- The body below is byte-for-byte the 1.04 body from `20260715120001_create_order_tr006.sql` EXCEPT
-- step 3: same atomic conditional UPDATE, same deadlock-free variant_id sort order, same price
-- snapshot, same TR001/TR002/TR004/TR005/TR006 behaviour, same 48h reservation. Do not "tidy" step 4
-- — it is proven concurrency code and the ORDER BY is not cosmetic.
--
-- WHAT THE REMOVED CAP WAS HOLDING. Named plainly rather than buried: cash on delivery means ordering
-- costs the customer nothing up front, so with no per-order cap one person can take an entire drop
-- having paid nothing. What is left holding that line is real stock, the per-drop rate limit
-- (D-1.04-7), and TR005. Accepted by the owner (D-Y.06-3).
--
-- The stale intent recorded at `20260715021215_schema.sql:137` ("Max 2 units per line; the cross-item
-- cap (total 1–2) is enforced in create_order()") is SUPERSEDED by this file. That migration is not
-- edited — existing migrations are never edited (D-Y.06-5); this comment is where the truth now lives.
--
-- ERROR VOCABULARY (mirrored in src/lib/orders/order-errors.ts; all map to HTTP 400 via PostgREST):
--   TR001  drop_not_found          — no drop with that slug
--   TR002  drop_not_open           — now() is outside [starts_at, ends_at]  (D-1.03-7)
--   TR003  quantity_cap_violated   — total units across the order not in 1..99, or a line < 1
--                                    [CHANGED: was 1..2 — sanity ceiling now, not a business cap]
--   TR004  insufficient_stock      — a variant had fewer units than requested (also: unknown variant)
--   TR005  duplicate_phone         — a live order already exists for this phone in this drop (D-1.03-4)
--   TR006  price_missing           — an ordered variant's product has no price yet  (D-1.04-6)

create or replace function public.create_order(
  p_drop_slug        text,
  p_customer_name    text,
  p_phone            text,
  p_phone_normalized text,
  p_address          text,
  p_city             text,
  p_items            jsonb,   -- [{ "variant_id": uuid, "quantity": int }, ...]
  p_notes            text default null,
  p_hold_hours       integer default 48  -- parameterised ONLY so the expiry test need not wait 48h.
)                                        -- The 48h default also lives in customer copy (src/messages);
  returns table (order_id uuid, order_number text, total_mkd integer)  -- change one, change both.
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  v_drop_id    uuid;
  v_starts_at  timestamptz;
  v_ends_at    timestamptz;
  v_total_qty  integer;
  v_variant_id uuid;
  v_qty        integer;
  v_total      integer;
  v_order_id   uuid;
  v_order_num  text;
begin
  -- 1. Resolve the drop.
  select id, starts_at, ends_at into v_drop_id, v_starts_at, v_ends_at
    from public.drops where slug = p_drop_slug;
  if not found then
    raise exception using errcode = 'TR001', message = 'drop_not_found';
  end if;

  -- 2. Assert the drop is open — the last line of defence; the browser never decides this (D-1.03-7).
  if not (v_starts_at <= now() and (v_ends_at is null or now() <= v_ends_at)) then
    raise exception using errcode = 'TR002', message = 'drop_not_open';
  end if;

  -- 3. Assert total quantity across all items is 1..99 — a SANITY CEILING, NOT A BUSINESS CAP.
  --     The 2-unit business cap this guard used to carry is GONE (D-Y.06-3, Petar's call, supersedes
  --     D-1.06-6). Nothing here limits how much of a drop one person may buy; real stock (step 4), the
  --     per-drop rate limit (D-1.04-7) and TR005 (one live order per phone per drop) do that. 99 is
  --     input validation only: it keeps TR003 alive so an absurd or malformed quantity is refused
  --     CLEANLY here instead of becoming a cast overflow or a 500 mid-drop. Mirrored client-side by
  --     SANITY_MAX_UNITS_PER_ORDER in src/lib/cart/cart.ts, and by the order_items per-row CHECK
  --     (`between 1 and 99`, relaxed below) so a big line can never reach the INSERT and fail with a
  --     raw 23514 instead of a TR code (D-Y.06-5).
  select coalesce(sum((e->>'quantity')::int), 0) into v_total_qty
    from jsonb_array_elements(p_items) e;
  if v_total_qty < 1 or v_total_qty > 99 then
    raise exception using errcode = 'TR003', message = 'quantity_cap_violated';
  end if;

  -- 3.5 Reject a priceless product BEFORE any decrement (D-1.04-6). A null price means "OWED by
  --     Vladimir, not set yet"; there is no legitimate way to charge for it on cash-on-delivery, so we
  --     refuse rather than snapshot a null into order_items (which its unit_price_mkd > 0 CHECK would
  --     reject anyway, but only AFTER stock had been decremented and rolled back). Unknown variant_ids
  --     do not match this join and still fall through to the TR004 path below, unchanged.
  if exists (
    select 1
      from jsonb_array_elements(p_items) e
      join public.variants v on v.id = (e->>'variant_id')::uuid
      join public.products p on p.id = v.product_id
      where p.price_mkd is null
  ) then
    raise exception using errcode = 'TR006', message = 'price_missing';
  end if;

  -- 4. Decrement each variant with a SINGLE CONDITIONAL UPDATE, in deterministic variant_id order.
  for v_variant_id, v_qty in
    select (e->>'variant_id')::uuid, (e->>'quantity')::int
      from jsonb_array_elements(p_items) e
      order by (e->>'variant_id')::uuid
  loop
    if v_qty < 1 then
      raise exception using errcode = 'TR003', message = 'quantity_cap_violated';
    end if;

    -- NEVER read-then-write. Postgres re-evaluates `stock >= v_qty` under the row lock AFTER any
    -- blocking transaction commits, so exactly the right number of callers win. A SELECT before this
    -- does not participate in that lock and would be a lie by the time we act on it.
    --
    -- The ORDER BY above is NOT cosmetic: two orders touching the same two variants in opposite
    -- orders would deadlock, and Postgres aborting one is a 500 served to a real customer at the only
    -- moment that matters. Sorting by variant_id makes that deadlock impossible by construction.
    update public.variants
      set stock = stock - v_qty
      where id = v_variant_id and stock >= v_qty;

    if not found then
      -- Zero rows affected → insufficient stock (or an unknown variant_id). Rolls the whole
      -- transaction back, restoring any decrements already made in this loop.
      raise exception using errcode = 'TR004', message = 'insufficient_stock';
    end if;
  end loop;

  -- 5. Compute the total from each variant's product price, read INSIDE this transaction. Every price
  --    here is non-null: step 3.5 already rejected any null-priced product in this order.
  select coalesce(sum(p.price_mkd * (e->>'quantity')::int), 0) into v_total
    from jsonb_array_elements(p_items) e
    join public.variants v on v.id = (e->>'variant_id')::uuid
    join public.products p on p.id = v.product_id;

  -- 6. Insert the order (reservation). Catch the one-live-order-per-phone-per-drop unique violation
  --    and re-raise it as the single documented duplicate-phone identifier (D-1.03-4).
  begin
    insert into public.orders (drop_id, customer_name, phone, phone_normalized, address, city, notes,
                               status, reserved_until, total_mkd)
    values (v_drop_id, p_customer_name, p_phone, p_phone_normalized, p_address, p_city, p_notes,
            'reserved', now() + make_interval(hours => p_hold_hours), v_total)
    returning id, orders.order_number into v_order_id, v_order_num;
  exception when unique_violation then
    raise exception using errcode = 'TR005', message = 'duplicate_phone';
  end;

  -- 6b. Insert items, SNAPSHOTTING the unit price (not a live join — the doorstep total must not move).
  insert into public.order_items (order_id, variant_id, quantity, unit_price_mkd)
  select v_order_id, (e->>'variant_id')::uuid, (e->>'quantity')::int, p.price_mkd
    from jsonb_array_elements(p_items) e
    join public.variants v on v.id = (e->>'variant_id')::uuid
    join public.products p on p.id = v.product_id;

  -- 7. Return the identifiers the caller needs.
  return query select v_order_id, v_order_num, v_total;
end;
$$;

-- Re-assert the grant posture (unchanged from 1.03/1.04; explicit for safety after create-or-replace).
revoke all on function public.create_order(text, text, text, text, text, text, jsonb, text, integer)
  from public, anon, authenticated;
grant execute on function public.create_order(text, text, text, text, text, text, jsonb, text, integer)
  to service_role;

-- ---------------------------------------------------------------------------------------------
-- order_items.quantity — relax the per-row CHECK from 1..2 to 1..99 (D-Y.06-5).
--
-- The constraint is dropped BY DISCOVERED NAME, not by an assumed one. It is `order_items_quantity_check`
-- on every database this project has, but a hardcoded `drop constraint if exists <wrong name>` would
-- silently no-op and leave the old 1..2 CHECK in force — the exact silent failure this migration exists
-- to prevent. So: find every CHECK on this table whose definition constrains `quantity`, drop each by
-- its real name, then add the relaxed one.
-- ---------------------------------------------------------------------------------------------
do $$
declare
  r record;
begin
  for r in
    select con.conname
      from pg_constraint con
      join pg_class rel on rel.oid = con.conrelid
      join pg_namespace ns on ns.oid = rel.relnamespace
     where ns.nspname = 'public'
       and rel.relname = 'order_items'
       and con.contype = 'c'
       and pg_get_constraintdef(con.oid) like '%quantity%'
  loop
    execute format('alter table public.order_items drop constraint %I', r.conname);
    raise notice 'dropped order_items CHECK %', r.conname;
  end loop;
end;
$$;

alter table public.order_items
  add constraint order_items_quantity_check check (quantity between 1 and 99);

-- Post-condition: exactly ONE CHECK constrains quantity, and it is the relaxed one. Without this the
-- migration could "succeed" having left a stricter constraint behind, and the first 3-unit order on
-- drop day would be the thing that told us.
do $$
declare
  v_n   integer;
  v_def text;
begin
  select count(*), max(pg_get_constraintdef(con.oid))
    into v_n, v_def
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace ns on ns.oid = rel.relnamespace
   where ns.nspname = 'public'
     and rel.relname = 'order_items'
     and con.contype = 'c'
     and pg_get_constraintdef(con.oid) like '%quantity%';
  if v_n <> 1 or v_def not like '%99%' then
    raise exception 'order_items quantity CHECK not relaxed as expected (count=%, def=%)', v_n, v_def;
  end if;
end;
$$;

comment on column public.order_items.quantity is
  'Units of this variant on this order. CHECK 1..99 is a SANITY CEILING, not a business cap — the 2-unit-per-order rule was removed in Y.06 (D-Y.06-3/4/5). It mirrors create_order() step 3 so an absurd quantity is refused as TR003 rather than as a raw 23514 after stock was already decremented.';
