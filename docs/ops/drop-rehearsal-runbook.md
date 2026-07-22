# Drop rehearsal runbook

**A full dress rehearsal of a drop, on the real site, before any real stock is on the line.** You walk the
whole lifecycle on your own phone: **countdown → live → order → sold out → expiry**, Vladimir walks his
fulfilment, you dry-run the contingency plan, and then you tear it all down so nothing buyable is left.

This is written for a non-coder. Every command is in a grey box you can copy exactly. When a step says "run
`XX-something.sql`", it means: open the **Supabase dashboard → project `kmuocwmevyyuhcvwoebf` → SQL
Editor**, open the file `docs/ops/rehearsal-sql/XX-something.sql`, paste it in, and press Run.

**Two rules that never bend:**

1. **Hosted only. Never commit the open drop to `main`.** Opening the drop happens by editing the live
   database, not the repo. The committed config stays ended; production must never become buyable because
   of this rehearsal.
2. **Never run `supabase db reset --linked`.** It wipes the hosted database and there is no backup on the
   free tier (Known issue #8). Cleanup is the targeted teardown in step 6, nothing else.

**Don't announce the rehearsal.** The drop is open on the public URL for a few minutes; if you post about
it, a real customer could place a real order. Keep it quiet, keep the window short.

---

## Before you start — what you need

- The **two phones** you'll actually use on drop day (one to place the order, one to be "the customer" that
  Vladimir calls back). One phone works too; the second is only for the fulfilment call.
- Access to the **Supabase dashboard** (project `kmuocwmevyyuhcvwoebf`).
- Access to **Vladimir's inbox** (where `info@trajanovv.com` forwards), to confirm the order email.
- The repo on Petar's machine, with the gitignored **`.env.hosted`** file present (it holds the hosted
  database URL that `npm run sync:drop` needs).
- This runbook and `docs/ops/rehearsal-sql/` open side by side.

The two `zsh` commands you'll run from the repo (everything else is the SQL Editor or the phone):

```zsh
cd /Users/petarjakimov/Projects/Trajanov-V2
set -a; . ./.env.hosted; set +a      # load the hosted DB URL into this shell; do not echo it
npm run sync:drop                     # reconcile the committed config into hosted (idempotent, safe)
```

---

## Step 0 · Pre-flight — is everything actually up?

Confirm three things before you open anything.

1. **The site is up.** On a phone **on mobile data** (not your home Wi-Fi), open
   **https://www.trajanovv.com**. It loads, both languages work, no errors.
2. **The checkout page loads and shows the captcha.** Open the checkout page directly:
   **https://www.trajanovv.com/naracka** (Macedonian) or **https://www.trajanovv.com/en/checkout**
   (English). The **Cloudflare Turnstile** captcha box should render on the form. (The captcha is fully
   exercised for real in step 2, when you place the order — this is just a "does it appear" check.)
3. **`info@trajanovv.com` reaches Vladimir.** From any email account, send a short test email **to**
   `info@trajanovv.com`. Confirm it lands in **Vladimir's inbox** (Cloudflare Email Routing forwards it).
   If it doesn't arrive, the order notification in step 2 won't either — fix the routing first.

Then confirm hosted is at a clean starting point: run **`00-baseline.sql`**. Expect **0 orders**, every size
at **stock 3**, only the ended `test-drop`, **2** cron jobs, and the next order number is **TRJ-0001**.
Write those numbers down — teardown restores to exactly this.

---

## Step 1 · Open the rehearsal drop (hosted only)

The repo already carries the rehearsal content: two test colourways (`test-mustard-ochre` S/M/L/XL,
`test-off-white` XL-only) priced at **1199 MKD**, with placeholder names. Its committed window is in the
**past**, so it renders as *ended* and nothing is buyable. You open it with a temporary database edit.

**1a. Reconcile the committed config into hosted** (so hosted matches the repo before you open it):

```zsh
cd /Users/petarjakimov/Projects/Trajanov-V2
set -a; . ./.env.hosted; set +a
npm run sync:drop
```

This is idempotent and safe — it never overwrites existing stock. The drop is still **ended** after it.

**1b. Open the window and set the stock:** run **`01-open-rehearsal-drop.sql`**. This sets a **5-minute
countdown**, opens a 2-hour window, and constrains the **whole drop to exactly one sellable unit**
(mustard/ochre size M by default) so a single order sells the drop out. The output should show that one
size at stock 1 and everything else at 0.

> **This open state is never committed to `main`.** It lives only in the hosted database, and step 6 closes
> it again. Nothing about the repo changes here.

---

## Step 2 · Walk the lifecycle on a phone

**2a. Watch the countdown → LIVE.** On a phone, open **https://www.trajanovv.com**. The featured drop shows
a **countdown** ticking down (you set it 5 minutes out). Watch it reach zero and flip to **LIVE**. If you
want to double-check the server agrees, run **`02-verify-live.sql`** — the window should read open and one
unit sellable.

**2b. Place ONE real order — this clears owed #15.** On the phone, add the in-stock product (mustard/ochre,
size M) to the cart, go to checkout, and place a real order:

- **Solve the Cloudflare Turnstile** captcha on the form. This is the real captcha on the real domain —
  solving it and having the order go through **is** the #15 verification (the widget renders and solves,
  and the server verifies the token).
- Enter a **real phone number** and a **real address** (use one of your own — you'll delete it in teardown).
- Submit. The confirmation screen should show the **order number**, **cash on delivery**, a line about
  **calling you to confirm**, and the price **1199 ден** (or the EN wording at `/en`).

**Capture a screenshot** of the checkout with the captcha, and of the confirmation screen.

**2c. Watch it go to SOLD OUT.** Reload the drop / product page. Because that was the only unit in the drop,
the product now shows **SOLD OUT** and the drop reads as ended. Screenshot it.

Confirm the database agrees — run **`03-verify-order.sql`**: exactly one order, `status = 'reserved'`,
`reserved_until` about 48h out, `total_mkd = 1199`, and the size you ordered now at stock **0**.

**2d. Confirm the notification email — this clears owed #16.** Check **Vladimir's inbox**. The order email
should arrive **from `info@trajanovv.com`**, subject **"Нова нарачка TRJ-0001 — Trajanov"**, and contain:

- the **order number**,
- the **ordered line** (product — size — quantity),
- the **customer block** (name, phone, city, address, note),
- the **cash-on-delivery** line and the "call the customer to confirm" line.

**Save the email** (screenshot or forward it into the evidence folder). This is #16: a real order email
delivered end to end from `info@trajanovv.com`.

**2e. Vladimir walks his fulfilment.** Vladimir now does exactly what he'd do on drop day: using only the
email (and the database if he wants), he **phones the "customer"** — the second phone / known number — and
**writes the order down** the way he will for real (name, phone, city, address, size, quantity). The point
is for him to say out loud afterwards: *yes, I know how to take it from email to a confirmed order.* If
anything is unclear or missing from the email, note it — that's a real finding.

---

## Step 3 · Rehearse expiry — stock comes back if a hold lapses

A reservation holds stock for 48 hours; if the customer never confirms, the scheduled job returns the unit
to stock. You don't wait 48 hours — you backdate the hold (the 1.08 method).

1. Run **`04-backdate-hold.sql`**. It pushes the rehearsal order's expiry into the past.
2. **Wait about 5 minutes** for the next scheduled sweep (the `expire-reservations` job runs every 5
   minutes).
3. Run **`05-verify-expiry.sql`**. You should see: the job's most recent run **succeeded** (return message
   like "1 row"), the order now reads **`expired`**, and the unit is **back in stock** (the size returns
   from 0 to 1). If the order still says `reserved`, the next tick hasn't run yet — wait a couple minutes
   and re-run the file.

That's the safety net working: an unpaid hold doesn't sell the shirt to nobody forever.

> **Note for real drops (Known issue #7):** this job only runs while the Supabase project is **awake**. A
> free-tier project that sits quiet for ~7 days **pauses**, and the expiry sweep pauses with it. Between
> drops, keep the project awake (the uptime monitor, register **L7**) or lapsed holds won't return stock.

---

## Step 4 · Contingency dry-run (a walk-through, not a real post)

Open **`docs/ops/drop-day-contingency.md`** next to you and confirm you could actually run it — **without
posting anything publicly**:

- **Lazar:** open Instagram as if to post, and confirm you can paste the pre-written **hold message** (MK
  story + feed caption) into a story and a caption. **Do not publish it** — just confirm it's ready and
  reads right. This is also your moment to **sign off the copy** (owed item — client-facing brand copy).
- **Reachability:** send a test **DM** to `@trajanovv2026` and place a test **call** to **078 820 520**,
  and confirm both reach **Vladimir**. That's the manual order channel proven.
- **Tally:** look at the anti-oversell tally template and confirm Vladimir understands he writes every
  manual order on it and never lets a size go below zero.

---

## Step 5 · Evidence to capture

Put these in `docs/ops/rehearsal-evidence/` (or paste them straight into the completion report):

| Evidence | From | File name suggestion |
|---|---|---|
| Countdown on the phone | Step 2a | `01-countdown.png` |
| Checkout with the Turnstile captcha solved (#15) | Step 2b | `02-checkout-turnstile.png` |
| Order confirmation screen (order number + COD + 1199 ден) | Step 2b | `03-confirmation.png` |
| Product showing SOLD OUT | Step 2c | `04-sold-out.png` |
| The order notification email from `info@trajanovv.com` (#16) | Step 2d | `05-order-email.png` |
| `03-verify-order.sql` output (order row + stock 0) | Step 2c | paste into report |
| `05-verify-expiry.sql` output (job succeeded + stock returned) | Step 3 | paste into report |
| `07-verify-clean.sql` output (all clean after teardown) | Step 6 | paste into report |

---

## Step 6 · Mandatory teardown — leave nothing buyable

**Do this every time, even if a step failed.** Nothing buyable may remain on `www.trajanovv.com`.

**6a. Run the targeted teardown:** run **`06-teardown.sql`**. It closes the window, deletes the rehearsal
order and its line(s), clears rate-limit attempt rows, restores every size to stock **3**, and resets the
order number so the first real order is **TRJ-0001**.

**6b. Reconcile the committed (ended) window** from the repo:

```zsh
cd /Users/petarjakimov/Projects/Trajanov-V2
set -a; . ./.env.hosted; set +a
npm run sync:drop
```

This puts the drop's window back to the committed past values (ended). It never touches stock.

**6c. Verify clean:** run **`07-verify-clean.sql`**. Expect: **0 orders / 0 order_items / 0
order_attempts**, only the **ended** `test-drop`, all sizes at **stock 3**, **2** active cron jobs, and the
next order number **TRJ-0001**. Compare against the numbers you wrote down in step 0 — they should match.

**Do NOT run `supabase db reset --linked`** to clean up. Ever. (Known issue #8.)

---

## Step 7 · You're done — what this rehearsal proved

If every step passed, you've cleared the two owed verifications from the cutover and proven the drop-day
plan on real infrastructure:

- **#15** — the Turnstile captcha renders and solves on the real-domain checkout, and the order verified
  server-side.
- **#16** — a real order email delivered from `info@trajanovv.com` end to end into Vladimir's inbox.
- The countdown reached zero and went **LIVE**; stock decremented to **0** and the product showed **SOLD
  OUT**; the reservation **expiry** returned stock; Vladimir walked his **fulfilment**; and the
  **contingency** plan is ready to post and reachable.
- Hosted was **verified clean** afterward — nothing buyable left.

Record what happened (order number, on-screen + inbox confirmation, the clean re-verify) in the completion
report, and have **Lazar sign off the Instagram hold copy**. If anything failed, write down exactly what,
and it stays owed until it passes.
