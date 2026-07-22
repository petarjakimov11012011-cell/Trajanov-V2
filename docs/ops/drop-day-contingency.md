# Drop-day contingency plan

**What to do if the site goes down during a drop.** This is the `D-0-2` contingency: Trajanov runs on
Vercel's free Hobby tier, whose terms let Vercel pull the deployment without notice, and drop day — a
countdown that funnels everyone into the same few minutes — is exactly the traffic spike those terms name.
The likely outcome is nothing. The tail outcome is the store going dark at the one moment it matters. This
page is the script for that moment, so it is a script and not a scramble.

**Read this before drop day, not during it.** When the site is down you should be posting, not reading.

> **Sign-off:** the Instagram hold copy below is client-facing brand copy. **Lazar signs it off** (an owed
> item of the 2.06 rehearsal). It is written here as a ready-to-post draft; do not change a fact in it
> without checking `facts.md`.

---

## Who does what

| Role | Person | On drop day |
|---|---|---|
| **Posts the hold message** | **Lazar** | Watches the site, posts the Instagram story + caption, keeps followers updated |
| **Takes and fulfils manual orders** | **Vladimir** | Answers DMs and the phone, writes each order down, keeps the stock tally, phones customers to confirm |
| **Triggers technical recovery (X.01)** | **Lazar decides; Code runs it** | Calls the Vercel Pro migration when it is worth it (see below) |

One person can cover two roles if the other is unavailable. The one rule that never bends: **whoever takes
a manual order also writes it on the tally before saying yes** (see [Manual orders](#manual-order-channel)).

---

## 1. Detection — how you learn the site is down

There is no automated uptime monitor yet (it is owed — register **L7**). Until there is one, you find out
one of two ways:

1. **A customer tells you** — a DM or a comment saying the site won't load or the drop page is broken.
2. **You check it yourself.** During a live drop, open **https://www.trajanovv.com** on a phone that is
   **not** on your home Wi‑Fi (use mobile data, so you see what a real visitor sees). If it doesn't load,
   or the drop page throws an error, or the countdown/checkout is stuck, treat the site as down.

Two things that are **not** the site being down, so don't post the hold message for them:

- **The drop sold out.** If products show **SOLD OUT** and the drop reads as ended, that is the site
  working correctly. Nothing to recover.
- **Your own phone/connection.** Check on mobile data, and ideally ask one other person to load it too,
  before you decide the site is down for everyone.

> **Strongly recommended before the first real drop:** stand up an uptime monitor (register **L7**) that
> pings `https://www.trajanovv.com` at least every 5 minutes and alerts two inboxes. It also guards the
> quieter risk in Known issue #7 (a paused free‑tier project silently stops `pg_cron`, so unpaid holds
> stop returning stock). Detection-by-customer-DM is the fallback, not the plan.

---

## 2. Hold the drop publicly — the Instagram message

Instagram is the only channel (`facts.md` §6, `@trajanovv2026`), and it is where the traffic came from.
The moment you're sure the site is down, post **both**: a **story** (seen first, disappears) and a **feed
caption** (stays up, and is what late arrivals find).

The message does three things: says the drop is paused for a technical reason, reassures that it is **not**
cancelled and nobody lost their place, and points people to order by **DM or phone, cash on delivery, same
prices, while stock lasts.**

**Every fact in this copy is traced to `facts.md`.** It names no delivery cost, no courier, and no stock
number, because we don't have those confirmed (`facts.md` §7 — courier + cost are OWED) and a promise made
at a doorstep on cash-on-delivery is money asked for on a promise nobody can keep. Don't add any.

### Macedonian (post this — MK is the default)

**Story:**

> Дропот е на пауза. Технички проблем со страницата.
> Не е откажан и никој не си го изгуби редот.
> Сè уште можете да порачате додека трае залихата: пишете ни DM овде или јавете се на 078 820 520.
> Плаќање при преземање.

**Feed caption:**

> Страницата привремено не работи поради технички проблем, па дропот е на кратка пауза.
> Не е откажан. Ништо не сте изгубиле, само почекајте да се вратиме.
> Во меѓувреме порачувајте директно од нас: DM овде или јавете се на 078 820 520. Истите цени, плаќање
> при преземање, додека трае залихата.
> Ќе објавиме повторно штом страницата ќе работи.

### English (post as a second story slide / second-language caption, if you use one)

**Story:**

> The drop is paused. Technical problem with the site.
> It's not cancelled, and nobody lost their place.
> You can still order while stock lasts: DM us here or call 078 820 520. Cash on delivery.

**Feed caption:**

> The site is down for a bit with a technical problem, so the drop is on a short pause.
> It's not cancelled. You haven't lost anything, so hold on until we're back.
> In the meantime you can order straight from us: DM here or call 078 820 520. Same prices, cash on
> delivery, while stock lasts.
> We'll post again the moment the site is back up.

**When the site comes back,** post a short "we're live again" follow‑up and pin nothing misleading. Do
**not** delete the hold post in a way that buries the DMs customers sent you — those DMs are orders (see
the [hard don'ts](#hard-donts)).

---

## Manual order channel

While the site is down, DMs and the phone are the till. For **every** order, Vladimir (or whoever is
answering) writes down all six fields before confirming. This is exactly the customer block the site
collects (`orders` columns: name, phone, city, address, note) plus the size and quantity the cart carried.

**Record for each order:**

| Field | Notes |
|---|---|
| Name | Full name |
| Phone | The number to call back to confirm |
| City | Ships **North Macedonia only** (`facts.md` §7) — if it's outside NMK, you can't take it |
| Address | Street + number |
| Product + size | e.g. "mustard/ochre, size L" — use the real product name once Vladimir has set them |
| Quantity | **Max 2 units per order** — the same cap the site enforces. Don't exceed it by hand |

Then **phone the customer back to confirm**, exactly as you would for a site order — the notification
email tells you to do the same thing.

### The anti-oversell tally — so the manual path can't sell the same shirt twice

The site's whole reason for existing is that two people can't buy the last unit (stock decrements
atomically in the database). With the site down, that safety net is off. **The written tally replaces
it.** Keep one sheet (paper or a phone note), and treat it as the single source of truth for stock during
the outage.

Before the drop opens, write down the starting stock for every product and size (you set these numbers, so
you know them). As each DM/phone order comes in, subtract it. **Never confirm an order that would take a
size below zero** — if a size is at 0 on the tally, it's sold out, full stop.

**Tally template:**

| Product | Size | Start | Order 1 | Order 2 | Order 3 | … | Remaining |
|---|---|---|---|---|---|---|---|
| (mustard/ochre) | S |  |  |  |  |  |  |
| (mustard/ochre) | M |  |  |  |  |  |  |
| (mustard/ochre) | L |  |  |  |  |  |  |
| (mustard/ochre) | XL |  |  |  |  |  |  |
| (off‑white) | XL |  |  |  |  |  |  |

**When the site comes back, reconcile before you reopen ordering.** Every manual order has to be entered
into the system (so the database stock matches what you actually sold) before the drop page starts taking
orders again. Otherwise the site and the tally can sell the same unit — the exact double-sell the tally
existed to stop. If the site came back via the Vercel Pro migration (below), do the reconciliation as part
of that same afternoon, with Code, before flipping the drop back to live.

---

## Technical recovery — the Vercel Pro migration (X.01)

Posting the hold message buys time; it doesn't fix the site. The fix is **X.01 — Migrate to Vercel Pro**,
the pre-planned recovery path for `D-0-2`.

- **What it is:** move the same app off the free Hobby tier onto Vercel Pro (paid), where the commercial-use
  and traffic-spike takedown terms don't apply. Same code, same Supabase database, same Cloudflare DNS —
  only the hosting plan changes.
- **Why it's an afternoon, not a rewrite:** the **portability rule** (`D-0-2`, `00_stack-and-config.md`).
  Nothing in this project is Vercel-specific — data lives in Supabase, DNS in Cloudflare, assets in the
  repo. So recovery is a redeploy, not a rebuild. That rule is what makes X.01 fast, and it's why we've
  refused Vercel Postgres/Blob/KV at every step.
- **Where it's defined:** X.01 is an on-demand phase in `Trajanov-V2-Phase-Plan.md` ("On demand —
  pre-written, not scheduled"). Its executable brief, once written, lives in `briefs/` as
  `Part-X-Phase-01-*.md`. **As of Phase 2.06 that brief is not yet written** — see the note below; writing
  it is the last thing that makes "pre-written" literally true.
- **Who runs it:** **Code**, on **Lazar's** call.
- **When to trigger it:** if the site is down and either a real drop is live (or about to be), or Vercel has
  sent a takedown/commercial-use notice, or Lazar simply decides the free tier is no longer worth the risk.
  If a drop is mid-flight, keep the hold message up and the manual channel open until X.01 has the site back
  and the tally is reconciled.

> **Gap to close (surfaced by Code, Phase 2.06):** `D-0-2` mitigation #2 promises X.01 is *pre-written* so
> it's an afternoon, not a scramble. The **plan** and the **portability rule** are in place, but the
> **executable X.01 brief does not exist yet.** Recommend writing it before the first real drop so the
> recovery path is a checklist, not an improvisation. Tracked in the completion report.

---

## Hard don'ts

- **Don't promise a delivery time or cost you can't back.** Delivery time (3–5 business days) is confirmed
  (`facts.md` §7) and you may state it. **Courier and delivery cost are not confirmed** (OWED, `facts.md`
  §7) — never quote a price or a courier. On cash on delivery, a number you say in a DM is money demanded
  at the door.
- **Don't announce a stock number you can't back.** "While stock lasts" is fine. "Only 5 left" is not,
  unless the tally actually says so and you're willing to hold to it.
- **Don't invent urgency.** No fake "last chance," no countdown you can't honour. The drop is paused for a
  real reason; say the real reason.
- **Don't take card or online payment.** Trajanov is **cash on delivery only** (`facts.md` §7). Never send
  a payment link, a bank account, or ask for card details in a DM — that's both off-model and how scams
  work.
- **Don't lose the DMs.** The DMs people send during the outage are orders. Don't delete-and-repost the
  hold message in a way that wipes the thread, and don't archive the conversation before the order is
  written on the tally and confirmed.
- **Don't reopen the site without reconciling.** If you took manual orders, enter them into the system
  before the drop page takes orders again, or the site and the tally will sell the same unit.
- **Don't ship outside North Macedonia** (`facts.md` §7), even if someone abroad DMs an order.

---

## After it's over

- Post the "we're back" follow-up.
- Make sure every manual order is in the system and stock reconciled.
- If you triggered X.01, note it and decide whether to stay on Pro.
- If detection was slow (you found out from a customer), that's the case for finally standing up the uptime
  monitor (**L7**).
