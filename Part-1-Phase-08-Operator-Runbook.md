# Phase 1.08 — Operator Runbook (the human half of the verification gate)

> **STATUS — 2026-07-18: the gate PASSED.** The register items in this runbook were completed **this session**
> (`D-1.08-4`): the email prereqs were set up, a real order (`TRJ-0001`) was placed and its **email arrived in
> Vladimir's inbox** (#7), and the design sign-off (#1), IG click-test (#2), and auto-expose toggle (#6) were
> done. **Still open — recommended, NOT gate-blocking:** the housekeeping in §5 (**L1** stray Stockholm Supabase
> project, **L2** stray `trajanov` Vercel project, **L3** save DB password + pepper, **L4** revoke the
> `claude-code-phase-1.07` access token, **L7** uptime monitor). This file also stays as the reusable
> open→order→verify→close runbook for the real first drop (2.04/2.05).

**Why this exists.** The 1.08 gate has two halves. The **Code half** (facts + config, the concurrent
oversell re-run, live pg_cron expiry, Turnstile enforcement, IP + phone rate limits) was run and evidenced
against the live Frankfurt DB this session, and hosted was returned to a **clean** state (see
`completions/Part-1-Phase-08-Code-Completion.md`). The **operator half** below is inherently human — it needs
a real phone, a browser-solved Turnstile, and access to Vladimir's inbox and the Supabase/Vercel dashboards.
**Until it is done, the gate is not passed and `NEXT:` stays `1.08`.** (`D-1.08-3`.)

**Golden rules (from `CLAUDE.md`):** never run `supabase db reset --linked` against hosted (it is broken here
and there is no free-tier backup — `D-1.07-15`); clean up with **targeted deletes only**; never paste
Vladimir's email into a file (`D-0-1`, `D-Z.01-3`).

Hosted baseline right now (verified end of this session): `orders/order_items/order_attempts = 0`; only the
**ended** `test-drop` exists (still carrying the OLD placeholder products `test-piece-01..04`); `cron.job` = 2
active; `order_number_seq` = 1 / not-yet-called (next order → **TRJ-0001**).

---

## 0. Prerequisite — the Z.01 email keys must be LIVE (blocks the email check #7)

Confirm, or the notification email cannot arrive:

- [ ] A **Resend account created under Vladimir's email**, confirmation link clicked (`D-Z.01-4`). On the free
      tier, `onboarding@resend.dev` can only deliver to that account's own verified address — which is why the
      account must be Vladimir's.
- [ ] **`RESEND_API_KEY`** and **`ORDER_NOTIFICATION_EMAIL`** set in **Vercel → Project `trajanov-v2` → Settings
      → Environment Variables**, for **Production + Preview**, marked **Sensitive**. Lazar pastes the email
      value himself; it never enters a file.
- [ ] After setting them, **redeploy production** (env-var changes need a new deploy to take effect).

If these are not done, do them first. Everything else can proceed, but step 3 (email in inbox) will fail
without them.

---

## 1. Publish the rehearsal drop (open it for the test) — Task 7

The repo already carries the real content: `src/config/products.ts` prices both colourways at **1199 MKD**
(`test-mustard-ochre` S/M/L/XL, `test-off-white` XL-only), names still placeholder. Its committed window is in
the **past** (ended), so publishing alone does NOT make it buyable — you open the window with a deliberate SQL
step, then close it right after.

**1a. Sync the priced products to hosted** (from the repo root, on the machine that has `.env.hosted`):

```zsh
cd /Users/petarjakimov/Projects/Trajanov-V2
set -a; . ./.env.hosted; set +a      # exports the hosted Postgres URL; do not echo it
npm run sync:drop
```

Expect: `products inserted: 2`, `variants inserted: 5`, and the old `test-piece-01..04` reported as deleted
(they have no orders). Stock is written INSERT-only (`D-1.04-5`). The drop is still **ended** at this point.

**1b. Open the window** — Supabase dashboard → project `kmuocwmevyyuhcvwoebf` → **SQL Editor**, run:

```sql
update public.drops
   set starts_at = now() - interval '1 minute',
       ends_at   = now() + interval '2 hours'
 where slug = 'test-drop';
```

The site computes drop state from the DB on the server (`D-1.04-9`), so the store at
`https://trajanov-v2.vercel.app` now shows the drop **LIVE**. **Do not announce it.** Keep the window short.

---

## 2. Place ONE real order end to end — Tasks 8–10 (on a phone)

- [ ] On a **phone**, open `https://trajanov-v2.vercel.app`, add a rehearsal product to the cart (max 2 units),
      go to checkout.
- [ ] **Solve the real Turnstile**, enter a **real phone number** and a **real address**, submit.
- [ ] **On-screen (Task 8):** the success state shows the order number, **cash on delivery**, **"we'll call you
      to confirm"**, and the price **1199 ден** — in whatever locale you used (MK default / EN at `/en`).
- [ ] **Email (Task 10 / #7):** confirm the **MK notification email arrives in Vladimir's inbox** — order
      number, each product/size/quantity, and the customer's name / phone / city / address / notes.

**Verify the DB (Task 9)** — Supabase SQL Editor:

```sql
-- one order row, status 'reserved', 48h hold, correct total:
select order_number, status, reserved_until, total_mkd, city
  from public.orders order by created_at desc limit 1;
-- stock decremented atomically for the size ordered (started at 3 in config):
select p.slug, v.size, v.stock
  from public.variants v join public.products p on p.id = v.product_id
 where p.drop_id = (select id from public.drops where slug='test-drop')
 order by p.slug, v.size;
-- the reservation IS the order (D-1.03-2): the order row above with status='reserved' + reserved_until ≈ now()+48h
```

Expect: exactly one order, `status='reserved'`, `reserved_until ≈ now() + 48h`, `total_mkd = 1199 × units`, and
the ordered size's stock one (or two) lower than 3.

---

## 3. Close the drop + return hosted to clean — Task 12 (targeted deletes only)

Supabase SQL Editor — run as one block:

```sql
-- (a) close the window immediately (nothing buyable again):
update public.drops set ends_at = now() - interval '1 minute' where slug='test-drop';

-- (b) delete the test order + its items (the order IS the reservation, so this removes the hold too):
delete from public.order_items
 where order_id in (select id from public.orders
                     where drop_id = (select id from public.drops where slug='test-drop'));
delete from public.orders
 where drop_id = (select id from public.drops where slug='test-drop');

-- (c) restore the rehearsal stock the test order decremented, back to the config starting value (3):
update public.variants v set stock = 3
  from public.products p
 where v.product_id = p.id
   and p.drop_id = (select id from public.drops where slug='test-drop');

-- (d) reset the TRJ-#### sequence so the FIRST REAL order (2.04/2.05) is TRJ-0001:
select setval('order_number_seq', 1, false);
```

Then, from the repo, reconcile the window back to the committed (ended) value — idempotent, never touches stock:

```zsh
set -a; . ./.env.hosted; set +a
npm run sync:drop
```

**Verify clean:** `select count(*) from public.orders;` → 0; `select slug, ends_at from public.drops;` → only
`test-drop`, ended; `select count(*) from cron.job where active;` → 2; `select last_value, is_called from
order_number_seq;` → 1 / false. Note in the completion record that the sequence **was** reset to TRJ-0001.

> Note (`D-1.04-5` spirit): step (c) is a deliberate human stock write to undo a rehearsal — exactly the
> "deliberate SQL by someone who has thought about it" that the no-restock rule intends. It is not the sync
> writing stock.

---

## 4. Clear the human register items — Section E (this is what drives the register down)

- [ ] **Design sign-off (#1).** On `https://trajanov-v2.vercel.app`, review `/`, `/about`, `/contact`,
      `/catalog`, a product page, `/cart`, `/checkout`. **Approve the tokens (palette + fonts) or log the exact
      changes needed** in the completion record. (Tokens were derived from the handover ledger, not a delivered
      `brand.md` — `D-1.02-1`.)
- [ ] **Instagram click-test (#2).** Click `@trajanovv2026` (footer, About/ended banner, Contact) and confirm
      it opens **Vladimir's real profile** (`facts.md` §6).
- [ ] **Auto-expose toggle OFF (#6 / L5).** Supabase → project `kmuocwmevyyuhcvwoebf` → Settings → API →
      **turn OFF "Automatically expose new tables."** (Does not retroactively revoke — pair with an explicit
      REVOKE in any future migration that adds a table.)

---

## 5. Housekeeping — Section F (recommended to close here)

- [ ] **L1** — delete the stray **Stockholm** Supabase project (`ewcqwbuvbbfduytiiaxy`, `eu-north-1`, empty).
      Only `kmuocwmevyyuhcvwoebf` (Frankfurt) should remain.
- [ ] **L2** — remove the stray **`trajanov`** Vercel project so one push cannot trigger two deployments
      (keep only `trajanov-v2`).
- [ ] **L3** — confirm the **new DB password** (reset in 1.07; the only copy is gitignored `.env.hosted` on
      Petar's machine — unrecoverable if lost) **and** `ORDER_IP_HASH_PEPPER` are saved in the password
      manager. The Vercel pepper value must never change (`D-1.04-7`).
- [ ] **L4** — revoke the Supabase access token **`claude-code-phase-1.07`** (Account → Access Tokens).
- [ ] **L7** — stand up an **uptime monitor** (≥ every 5 min, alerting two inboxes). A paused free-tier project
      silently pauses pg_cron and takes the store offline (Known issues #7) — strongly recommended before any
      launch.

---

## 6. When all of the above is done — close the gate

Update `src/_project-state/current-state.md`: mark the owed-verification register **empty** (#1, #2, #5, #6,
#7 cleared with evidence; #8 → 2.05 per `D-1.08-2`), record the design-sign-off outcome, and set **`NEXT:` =
`2.01`**. Append an operator note to `completions/Part-1-Phase-08-Code-Completion.md` (or file a short operator
completion) with: the order number placed, the on-screen + inbox confirmation, and the register clearances.
Only then has the hard pre-Part-2 gate passed.
