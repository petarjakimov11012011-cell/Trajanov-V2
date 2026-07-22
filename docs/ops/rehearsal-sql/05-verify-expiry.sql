-- 05 · VERIFY EXPIRY — read-only. Run ~5 minutes after 04-backdate-hold.sql (wait for the next */5 tick).
-- Confirms the SCHEDULED job ran (not a manual call), the order is now 'expired', and the unit is back.

-- The scheduled sweep's recent runs (expect the most recent 'succeeded', return_message like '1 row'):
select d.runid, d.status, d.return_message, d.start_time, d.end_time
  from cron.job_run_details d
  join cron.job j on j.jobid = d.jobid
 where j.jobname = 'expire-reservations'
 order by d.start_time desc
 limit 5;

-- The order should now read 'expired':
select order_number, status, reserved_until
  from public.orders
 order by created_at desc
 limit 1;

-- The unit should be back in stock (the size you ordered returns from 0 to 1):
select p.slug as product, v.size, v.stock
  from public.variants v
  join public.products p on p.id = v.product_id
 where p.drop_id = (select id from public.drops where slug = 'test-drop')
 order by p.slug, v.size;

-- If the order is still 'reserved', the next */5 tick has not run yet — wait a couple more minutes and
-- re-run this file. (pg_cron runs in UTC; the schedule is every 5 minutes on the clock.)
