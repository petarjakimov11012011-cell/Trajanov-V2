-- create_order() — the heart of the phase. The ONLY path that creates an order (D-1.03-3).
--
-- Runs as ONE transaction (a PostgREST RPC call). SECURITY DEFINER + `set search_path = ''` so it can
-- touch the deny-all orders/variants tables regardless of the caller's grants, while every object is
-- fully schema-qualified to keep the definer safe. EXECUTE is granted to service_role only.
--
-- ERROR VOCABULARY — each distinct failure raises a distinct SQLSTATE that the client switches on via
-- `error.code` (never the message). Mirrored in src/lib/orders/order-errors.ts. All map to HTTP 400.
--   TR001  drop_not_found          — no drop with that slug
--   TR002  drop_not_open           — now() is outside [starts_at, ends_at]  (D-1.03-7)
--   TR003  quantity_cap_violated   — total units across the order not in 1..2
--   TR004  insufficient_stock      — a variant had fewer units than requested (also: unknown variant)
--   TR005  duplicate_phone         — a live order already exists for this phone in this drop (D-1.03-4)
create function public.create_order(
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

  -- 3. Assert total quantity across all items is 1..2.
  select coalesce(sum((e->>'quantity')::int), 0) into v_total_qty
    from jsonb_array_elements(p_items) e;
  if v_total_qty < 1 or v_total_qty > 2 then
    raise exception using errcode = 'TR003', message = 'quantity_cap_violated';
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

  -- 5. Compute the total from each variant's product price, read INSIDE this transaction.
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

-- EXECUTE for service_role only. Revoke from PUBLIC as well as anon/authenticated: a bare `revoke ...
-- from anon, authenticated` would leave them able to execute via the default PUBLIC grant, and the
-- anon-access RLS test would fail. See the completion report §3.
revoke all on function public.create_order(text, text, text, text, text, text, jsonb, text, integer)
  from public, anon, authenticated;
grant execute on function public.create_order(text, text, text, text, text, text, jsonb, text, integer)
  to service_role;
