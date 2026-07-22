-- 01 · OPEN THE REHEARSAL DROP — the only step that makes anything buyable. Run in the SQL Editor.
--
-- This does NOT get committed to `main`. The committed config (src/config/drops.ts) keeps test-drop in
-- the PAST (ended); this is a live-only, temporary window on hosted that 06-teardown.sql closes again.
--
-- Two parts, run together as one block:
--   (a) set a short countdown then open the window, so the operators watch it tick to zero → LIVE;
--   (b) constrain the WHOLE drop to exactly ONE sellable unit, so a single order sells the drop out.

-- (a) Short countdown (starts in 5 minutes) then a 2-hour open window. Adjust the 5 minutes if you need
--     more time to get the phone ready; keep the window short and DO NOT announce it publicly.
update public.drops
   set starts_at = now() + interval '5 minutes',
       ends_at   = now() + interval '2 hours'
 where slug = 'test-drop';

-- (b1) Zero every size in the drop...
update public.variants v
   set stock = 0
  from public.products p
 where v.product_id = p.id
   and p.drop_id = (select id from public.drops where slug = 'test-drop');

-- (b2) ...then put a single unit back on ONE size. Mustard/ochre size M by default — change the two
--      literals below if you want a different size, but keep it to exactly one unit on one size.
update public.variants v
   set stock = 1
  from public.products p
 where v.product_id = p.id
   and p.drop_id = (select id from public.drops where slug = 'test-drop')
   and p.slug = 'test-mustard-ochre'
   and v.size = 'M';

-- Show the result: the window and the one sellable unit (M = 1, everything else 0).
select p.slug as product, v.size, v.stock
  from public.variants v
  join public.products p on p.id = v.product_id
 where p.drop_id = (select id from public.drops where slug = 'test-drop')
 order by p.slug, v.size;
