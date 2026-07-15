-- expire_reservations() — releases the hold on orders whose reserved_until has passed (D-1.03-6).
-- Ships here; only its SCHEDULE (pg_cron / Vercel cron) is 1.04.
--
-- THE INVARIANT: stock must never be returned twice. Each expired order's stock is returned by
-- exactly ONE caller. This is achieved the same way create_order() decrements: the row is CLAIMED by
-- a conditional flip (update ... where status = 'reserved'), and stock is returned ONLY when that
-- flip actually claimed the row. FOR UPDATE SKIP LOCKED means two concurrent sweeps take disjoint
-- sets of orders and never wait on each other; the `status = 'reserved'` re-check + `if found` are the
-- belt-and-braces that make double-return impossible even if two callers race the same row.
--
-- Returns the number of orders expired by THIS call.
create function public.expire_reservations()
  returns integer
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  v_expired integer := 0;
  r         record;
begin
  for r in
    select id
      from public.orders
      where status = 'reserved' and reserved_until < now()
      order by id
      for update skip locked
  loop
    update public.orders
      set status = 'expired'
      where id = r.id and status = 'reserved';

    if found then
      -- Return this order's units to their variants. Runs only because WE claimed the row above.
      update public.variants v
        set stock = v.stock + oi.quantity
        from public.order_items oi
        where oi.order_id = r.id and oi.variant_id = v.id;
      v_expired := v_expired + 1;
    end if;
  end loop;

  return v_expired;
end;
$$;

revoke all on function public.expire_reservations() from public, anon, authenticated;
grant execute on function public.expire_reservations() to service_role;
