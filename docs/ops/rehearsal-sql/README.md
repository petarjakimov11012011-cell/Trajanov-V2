# Rehearsal SQL — run these in the Supabase SQL Editor

These are the exact, copy-paste SQL steps the drop rehearsal uses against the **hosted** Frankfurt
database (`kmuocwmevyyuhcvwoebf`). Run them by opening the **Supabase dashboard → project
`kmuocwmevyyuhcvwoebf` → SQL Editor**, pasting one file, and running it. Follow
[`../drop-rehearsal-runbook.md`](../drop-rehearsal-runbook.md) — it says when to run each one.

**They only ever touch the `test-drop` rehearsal drop.** They never touch `create_order`,
`expire_reservations`, the migrations, or any real order.

**The hard rule (`CLAUDE.md`, Known issue #8):** **never** run `supabase db reset --linked` against
hosted. It wipes the database and the free tier has no backup. Clean up with the targeted deletes in
`06-teardown.sql` only.

| File | When | What it does |
|---|---|---|
| `00-baseline.sql` | Pre-flight, before anything | Shows the current drop window, per-size stock, and order count so you can confirm a clean starting point (orders = 0, all stock 3) |
| `01-open-rehearsal-drop.sql` | To open the drop | Sets a short countdown, opens the window, and constrains the whole drop to **one** sellable unit so a single order sells it out |
| `02-verify-live.sql` | After the countdown hits zero | Confirms the window is open and exactly one unit is sellable |
| `03-verify-order.sql` | Right after you place the order | Shows the order row, the atomic stock decrement, and the 48h reservation |
| `04-backdate-hold.sql` | To rehearse expiry | Backdates the reservation so the every-5-minutes job expires it instead of waiting 48h |
| `05-verify-expiry.sql` | ~5 min after `04` | Shows the scheduled job ran, the order is `expired`, and the unit is back in stock |
| `06-teardown.sql` | Mandatory, at the end | Deletes the rehearsal order, restores stock, resets the order number, closes the window |
| `07-verify-clean.sql` | After teardown + re-sync | Confirms orders = 0, drop ended, 2 cron jobs, next order is TRJ-0001 |

The runbook also has two `zsh` steps that run **outside** the SQL Editor, from the repo root with
`.env.hosted` loaded: `npm run sync:drop` (reconcile the committed config) before `01` and after `06`.
