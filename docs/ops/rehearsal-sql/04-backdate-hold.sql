-- 04 · BACKDATE THE HOLD — to rehearse reservation expiry without waiting 48 hours.
-- This is the 1.08 method: push the reservation's expiry into the past so the scheduled every-5-minutes
-- job (expire-reservations) sweeps it up on its next run, returns the unit to stock, and marks the order
-- 'expired'. This changes ONLY the rehearsal order's reserved_until — nothing else.

update public.orders
   set reserved_until = now() - interval '1 minute'
 where drop_id = (select id from public.drops where slug = 'test-drop')
   and status = 'reserved';

-- Confirm the hold is now in the past (the job will pick it up within ~5 minutes):
select order_number, status, reserved_until, (reserved_until < now()) as past_due
  from public.orders
 order by created_at desc
 limit 1;
