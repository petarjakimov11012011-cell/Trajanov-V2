NEXT: 2.04 — Perf, a11y, SEO (Lighthouse, schema.org, sitemap, robots, OG images — none of which 2.03 touched). **Phase 2.03 — Legal + facts audit — COMPLETE (2026-07-19, branch `phase-2.03-legal-facts`).** Three **static** legal pages shipped both locales — Terms (`/uslovi`·`/en/terms`), Privacy (`/privatnost`·`/en/privacy`), Shipping & Returns (`/isporaka-i-vrakjanje`·`/en/shipping-returns`) — built from the `/about`+`/contact` editorial pattern via a shared `LegalPage` shell, all `●` SSG. Responsible party is **Vladimir Trajanov, Струмица, alone** (`D-2.03-1`, Lazar's call) — **no parent named anywhere in the diff**; **no statute/article/withdrawal period cited** (Decision 5); **no cookie banner** (Decision 4); the email **stays unpublished**. Privacy's collected-field list matches the real `orders` columns (`20260715021215_schema.sql`: name/phone/city/address/note — **no email**); the IP line matches `src/lib/rate-limit/hash.ts` (one-way hash, raw IP never stored). Courier/delivery-cost and returns-window ship as **visible `[PLACEHOLDER: …]`** (register #6, #7 — owner Vladimir), not guesses. **Full `facts.md` audit** committed at `docs/legal/facts-audit-2.03.md` — every rendered claim traced; **2 findings** (F-1 the `facts.md` §1 responsible-party contradiction, resolved by the §1 amendment; F-2 the cart's "calculated on delivery", surfaced not reworded, `D-2.03-6`); **zero UNSOURCED remain**; §10 clean (`grep`-checked). `facts.md` §1 amended (both the displayed party and the intake fact kept; open parental-confirmation flag intact). **63→213 message keys** (63 new, MK+EN identical); humanizer pass run; `docs/i18n/mk-review-2.03.md` committed **unsigned**; `string-inventory.md` regenerated (213) + committed. **69 tests pass** (63 + 6 new legal-route pathname assertions) incl. the 10-vs-3 oversell gate; build/lint/tsc clean; parity driven **RED→GREEN**. **No `supabase/migrations/`, `create_order`, `expire_reservations`, cart, `src/config/`, hosted DB, or npm dependency touched.** **Owed-verification register is NO LONGER EMPTY** — 2.03 added **two rows** (#9 no human legal review; #10 MK legal copy unreviewed) — both verify by 2.05 cutover. Placeholder register **+2** (#6, #7). **PR #12 MERGED to `main` (merge `4fcc0bd`) on Petar's explicit instruction (`D-0-3`: an operator, not Code, authorised the merge); production deploy VERIFIED** — the six legal URLs serve on `https://trajanov-v2.vercel.app` (MK slugs `/uslovi`·`/privatnost`·`/isporaka-i-vrakjanje` → 200 direct; `/en/*` → 200; MK Terms renders „Услови на продажба" + „Владимир Трајанов, од Струмица"). Recommended operator housekeeping (L1–L4, L7) still open.

# Current state — Trajanov-V2

**This file is the single source of truth for project status.** The orchestrator reads it before
every brief. Nobody's memory outranks it. Line 1 is always the `NEXT:` line — Code updates it when
closing every phase.

Last updated: **2026-07-19** · By: **Claude Code (Phase 2.03 — Legal + facts audit, Code)**

---

## Status

**2.03 COMPLETE — the store has honest legal pages and every rendered claim is now audited (this
update, 2026-07-19).** Three **static** pages joined the site in both locales, built from the same
editorial pattern as `/about`+`/contact` through a shared `src/components/legal/LegalPage.tsx` shell:
**Terms** (`/uslovi` · `/en/terms`), **Privacy** (`/privatnost` · `/en/privacy`), and **Shipping &
Returns** (`/isporaka-i-vrakjanje` · `/en/shipping-returns`) — all prerendered `●` SSG per locale, no
`force-dynamic`. Every line is written to a source: `facts.md §1/§7`, shipped code (the 48h reservation,
the 2-per-order cap, COD, the one-way IP hash, the `orders`-column field list, the notification email),
or a logged decision. **No statute, article, directive, or statutory withdrawal period is cited**
(Decision 5); **no cookie banner** was added (Decision 4); the **email is not published** on any page
(register #5 intact). The responsible party displayed on Terms + Privacy is **Vladimir Trajanov,
Струмица, alone** (`D-2.03-1`, Lazar's call) — **no parent or guardian name appears anywhere in the
diff.** Delivery cost/time and the returns/exchange window ship as **visible `[PLACEHOLDER: …]`** markers
(register #6, #7 — owner Vladimir), never estimated. The **full `facts.md` audit** is committed at
`docs/legal/facts-audit-2.03.md`: every rendered claim traced, **2 findings surfaced** (F-1 the §1
responsible-party contradiction — resolved by amending §1; F-2 the cart's "calculated on delivery" —
surfaced, not reworded, `D-2.03-6`), **zero UNSOURCED rows remain**, and the §10 "do-NOT-have" list
(reviews, counts, partners, team, second location) `grep`-confirmed **absent**. `facts.md` §1 amended so
the file and the site agree (displayed party + intake fact both kept; the open parental-confirmation flag
**unchanged**). Message catalogs grew **150 → 213 keys** (63 new, MK+EN identical, no empty value); a
`humanizer` pass ran over every new string; `docs/i18n/mk-review-2.03.md` is committed **unsigned** for
the native review; `docs/i18n/string-inventory.md` regenerated (213) and committed. **69 tests pass** (63
+ 6 new legal-route pathname assertions) incl. the **10-vs-3 oversell gate**; build/lint/tsc clean;
parity driven **RED→GREEN**. **Nothing touched** in `supabase/migrations/`, `create_order`,
`expire_reservations`, the cart, `src/config/`, the hosted DB, or dependencies. All three pages rendered
in-browser at 390px + 1180px in both locales (Cyrillic native, placeholders visible, footer links resolve
to the localised slugs). **The owed-verification register is NO LONGER EMPTY** — 2.03 added rows **#9**
(no human legal review) and **#10** (MK legal copy unreviewed), both owner-verifiable by the 2.05 cutover.
Branch `phase-2.03-legal-facts`; **PR #12 MERGED to `main` (merge `4fcc0bd`, 2026-07-19)** on Petar's instruction and the production deploy verified live (six legal URLs serve; MK Terms renders MK). Code did not self-merge — an operator authorised it (`D-0-3`).

**2.02 COMPLETE — the native MK review passed clean (2026-07-19).** Two native Macedonian
speakers, Lazar and Petar, read all **150** MK strings and all **8** URLs in both locales against
`docs/i18n/string-inventory.md`, plus the six MK route slugs. Verdict: **every string OK — no
spelling / grammar / agreement / terminology fault, no English-in-MK leak, and no style change — and all six
slugs confirmed Keep** (`/katalog`, `/katalog/[slug]`, `/kosnicka`, `/naracka`, `/za-nas`, `/kontakt`; the
Latin transliteration, `D-2.01-1`, and the shared product slug, `D-2.01-2`, both stand — `D-2.02-3`). The
working record is `docs/i18n/mk-review-2.02.md`: the how-to, the URL walk, the slug question, the full
150-row table with a verdict on every row, and **both sign-off blocks filled** (the two reviewed **jointly**
and Code transcribed the verdicts, `D-2.02-2`; provenance noted in the file). Because nothing was a fault,
**`src/messages/{mk,en}.json` are untouched** (Task 3 a no-op — no string changed, so no humanizer pass and
no `facts.md` re-verify was needed); because every slug is Keep, **`next.config.ts`, the redirect table,
`src/i18n/routing.ts` `pathnames`, and `tests/i18n/` are unchanged** — the only code change in the whole
phase is the `routing.ts` comment flipping from "provisional" to "confirmed", and the removal of "provisional"
slug language from `routing.ts` and this file. **63 tests pass** (unchanged from 2.01) incl. the 10-vs-3
oversell gate; build / lint / tsc clean; the parity test was driven **RED then GREEN**; `npm run i18n:inventory`
regenerated `docs/i18n/string-inventory.md` **byte-identical** (no commit — no string changed). **No
`supabase/migrations/`, `src/config/`, `create_order`, `expire_reservations`, hosted DB, or npm dependency
touched.** Branch `phase-2.02-mk-review`. **Owed-verification register stays EMPTY; placeholder register
unchanged.**

**2.01 COMPLETE — the store is bilingual down to the URL (2026-07-19).** next-intl `pathnames`
localise the MK route slugs (Latin transliteration, `D-2.01-1`) while the internal route folders are
unchanged; the product slug is single/shared across locales (`D-2.01-2`). Old English MK paths **308** to
the new slugs (`next.config.ts`, kept in lockstep with `routing.ts`), `/en/*` untouched (`D-2.01-3`). Every
user-facing string lives in `src/messages/{mk,en}.json` — the only literals left to extract were the cart
quantity-stepper `aria-label`s (`Cart.decrease`/`increase`); a new `Meta` namespace drives per-locale
`<title>`/description on every route. Reciprocal **hreflang** (mk/en/x-default→MK) + a self-referencing
`canonical`, all absolute on the single `SITE_URL` constant (`src/lib/site.ts`, `TODO(2.05): trajanov.com`),
are emitted per page via `src/lib/metadata.ts`'s `localeAlternates` + next-intl `getPathname`. The MK-only
**shipping statement** (one shared key `Common.shippingNotice`, traced to `facts.md` §7 VERIFIED) renders
above Add-to-cart on the product page and in the checkout COD block, both locales; the EN wording is
explicit that we do not deliver outside North Macedonia (`ShippingNotice.tsx`, `D-2.01-7`). `formatMkd` is
now locale-aware (MK `1.199 ден` / EN `1,199 MKD`; MKD always, **no currency conversion anywhere**,
`D-2.01-8`). The `LanguageSwitch` switches locale in place and preserves the page + query/`?preview` across
the slug change (`D-2.01-6`). A committed `docs/i18n/string-inventory.md` (regen `npm run i18n:inventory`)
lists every key/MK/EN/where + two flag sections for the 2.02 reviewers. **63 tests pass** (56 + 7 new i18n:
catalog parity + pathname coverage; the parity test was confirmed RED when a key was removed from `en.json`,
then restored). Verified in-browser both locales at 390px + 1180px: redirects (308 + Location), MK slugs 200,
`/en/*` 200, reciprocal hreflang, the shipping notice, and the language switch on a dynamic product page with
`?preview`. **No `supabase/migrations/`, `create_order`, `expire_reservations`, component-of-record, or
hosted DB touched; no new npm dependency** (added the `i18n:inventory` script only). Branch
`phase-2.01-bilingual`. **Owed-verification register stays EMPTY.**

**1.08 CODE HALF PASSED against hosted (2026-07-18); operator half + email prereq still OWED.**
The gate ran its Code-verifiable half against the live Frankfurt DB and returned it clean (`D-1.08-3`):
- **Real content recorded.** `facts.md` §7 marks **1199 MKD** + currency **MKD** + sizes **S/M/L/XL
  (off-white XL-only)** VERIFIED (owner via Lazar, 2026-07-18); the old ~$65/3,700 MKD indicative ceiling is
  SUPERSEDED; fabric/care + per-size measurements stay OWED. `src/config/products.ts` now prices the two
  verified colourways at 1199 MKD — `test-mustard-ochre` (S/M/L/XL) and `test-off-white` (XL-only, the
  single-variant path) — names still `null`/placeholder. No USD anywhere.
- **Concurrent oversell re-run on hosted (DoD):** `10 simultaneous orders against 3 units → exactly 3 succeed,
  7 rejected with insufficient_stock, stock 0` (726 ms). Full suite **56/56 against `kmuocwmevyyuhcvwoebf`**
  (25 s), incl. both expiry tests.
- **Reservation expiry observed LIVE on hosted** (no 48h wait): a backdated hold was expired by the scheduled
  `*/5` pg_cron job at the 10:00:00 cycle (`cron.job_run_details`: succeeded, "1 row"), stock returned; **2
  active cron jobs**; test row cleaned.
- **Turnstile enforced (real production secret):** Siteverify rejected a **missing** token
  (`missing-input-response`) and an **invalid** token (`invalid-input-response`); wrong-secret control
  (`invalid-input-secret`) proves the real secret is genuinely validated. Hosted `orders=0` — no order row, no
  stock change. Closes register #5 per the brief's Task 5 (`D-1.07-7`, `D-1.08-3`).
- **Rate limits fire:** IP limit (`check_order_rate_limit`, max=5) → 5 allowed, 6th–7th rejected; phone limit
  (`create_order` one-live-order-per-phone) → 2nd same-phone order rejected `TR005`, stock decremented only by
  the 1st. Test rows cleaned.
- **Hosted returned to pre-session clean:** seed fixtures removed; `orders/order_items/order_attempts = 0`;
  only the ended `test-drop` (still its old `test-piece-01..04` placeholder products — the new priced config
  was **not** synced, because the live order is deferred); `order_number_seq` reset to **1/false → TRJ-0001**.
- **NOT done this session (operator half, deferred to the runbook — `D-1.08-3`):** publishing the buyable
  rehearsal drop + the **one real phone order**; the **notification email landing in Vladimir's inbox** (#7);
  the **design sign-off** (#1); the **Instagram click-test** (#2); the **auto-expose toggle** (#6); and the
  Z.01 email prereqs (Resend account + Vercel keys) are **UNCONFIRMED**. The register is therefore **not at
  zero** and `NEXT:` stays `1.08`. Method note: Turnstile + rate-limit enforcement were proven at the exact
  server-side calls the Server Action makes (Siteverify with the real secret; the `check_order_rate_limit`
  RPC; `create_order` `TR005`), not by hand-driving the deployed Next Server Action (which needs a
  browser-solved token / an open drop — the operator path). Branch `phase-1.08-verification-gate`.

**Z.01 SHIPPED — the order-notification email is built (Phase Z.01, prior update).** When `create_order()`
returns success, the order path fires a **best-effort** MK notification to Vladimir via **Resend** (SDK
`resend 6.17.2`), so he can phone the customer to confirm. It is wired as an injected, awaited-but-guarded
`notifyOrder` dep on the pure `processOrder` core (`D-Z.01-5`): a Resend outage, timeout, thrown error, or
**missing env var never fails, delays past ~8s, or rolls back the order** — the DB is the record, the email
is a side channel (Plan §8, `D-0-5`). Sender in `src/lib/email/order-notification.ts`; from
`onboarding@resend.dev` until `trajanov.com` (`D-Z.01-2`); **no customer email collected** (`D-Z.01-1`).
Vladimir's address lives **only** in `ORDER_NOTIFICATION_EMAIL` and is **not** published on Contact
(`D-Z.01-3`; placeholder #5 stays). **56 tests pass** (46 + 6 email, Resend mocked + 4 notify-wiring),
incl. the re-run 10-vs-3 oversell gate; build/lint/tsc clean. **What is owed to 1.08:** that a real order
actually *delivers* to Vladimir's inbox — needs the live Vercel keys (operator prereq) + a live, priced
drop. Branch `phase-Z01-order-email`. **`create_order`/`expire_reservations`/migrations untouched; the only
new dependency is `resend`.**

**THE STORE IS LIVE ON A PUBLIC URL — https://trajanov-v2.vercel.app — running against the real
Frankfurt database with real bot-protection keys.** Phase 1.07 (Code) linked the repo to hosted
Supabase (`kmuocwmevyyuhcvwoebf`, `eu-central-1`, Postgres 17.6), pushed the schema, proved parity,
deployed, and verified production. **Six phases of "local only" (`D-1.03-5`) are over.**

**Hosted parity is PROVEN, not asserted (owed #4 CLOSED).** All **8** migrations pushed; `migration
list` shows local and remote carrying the same 8 with **no migration edited to make that true**.
**pg_cron came up from the migration with no dashboard step** — `cron.job` returns **2 active rows**
in the `postgres` database (the phase's biggest named risk, and it was a non-event). The **real
46-test suite ran against Frankfurt and all 46 passed**, including the **10-vs-3 oversell gate
(exactly 3 succeed, 7 cleanly rejected, stock 0)** and both expiry tests — **the atomic decrement
holds on the real host, under real latency**. Hosted was then **reset clean and verified**: 0 rows in
all 6 tables, `TRJ-####` back to **TRJ-0001**, 2 cron jobs still active. Local re-run: **46 still
pass**, `.env.local` untouched and still pointing at Colima (`D-1.07-9`).

**The phase found a real bug and fixed it (`D-1.07-14`).** The parity run failed **1 of 46**:
hosted `anon` held `INSERT/UPDATE/DELETE/TRUNCATE` on `drops`/`products`/`variants`; local held
none of them. Cause: `schema.sql:150-152` assumes *"a table is unreachable until GRANTed here"* —
true locally (`auto_expose_new_tables` unset), **false on hosted**, where Cowork left
**"Automatically expose new tables" ON** (`D-1.07-3`). **No data was ever exposed** — RLS with
SELECT-only policies blocked every write (verified: stock 5→5, INSERT rejected `42501`) — but hosted
had **one barrier where local has two**. New migration `20260716120000_catalog_grant_hardening.sql`
REVOKEs those privileges from `anon`/`authenticated`/`public`; **both environments now report
`REFERENCES,SELECT,TRIGGER`** and the test passes for the right reason. Everywhere the migrations
already revoked explicitly (`orders`, `order_items`, `order_attempts`, all 3 functions), hosted
matched local exactly.

**Real Turnstile is live and proven end to end (owed #5 NARROWED, not closed — `D-1.07-7`).** The
deployed `/checkout` serves site key **`0x4AAAAAAD23OFW7Ka1hTR1F`**; **no dummy key appears anywhere
in the deployed build** (961 KB of JS + HTML scanned). A widget mounted on the production hostname
**solved in Managed mode and minted a real token**, which Siteverify accepted with the real secret:
**`success: true`, `hostname: trajanov-v2.vercel.app`**. A wrong-secret control returned
`invalid-input-secret`, so the pass is meaningful. **Still owed to 1.08:** whether Cloudflare
actually challenges a *bot* on a *real order* — that needs a live drop, which 1.07 deliberately does
not create.

**`test-drop` published to hosted** via `npm run sync:drop` — **stock INSERT-only (16 inserted, 0
overwritten), 0 rows deleted** (`D-1.04-5`). It is **ended and null-priced** (`D-1.04-12`), so the
site renders the *ended* state and **nothing is buyable**. **0 orders on production.**

**Resend was struck from 1.07 (`D-1.07-8`) and BUILT in Z.01 (this update).** 1.07 shipped no key, no
code, no stub; Z.01 added the SDK + sender. The email code is done and unit-tested; the remaining Resend
work is real-world only (live keys + a live drop), owed to 1.08 — see the register.

**Two credential facts the operator must know (`D-1.07-12`):** (1) the Vercel env vars are marked
**Sensitive**, which makes them **write-only** — `vercel env pull` returns all six as empty strings,
so Cowork's "no functional impact" is true for the build and **false** for anyone working locally;
(2) **the Supabase DB password was RESET this phase at the operator's instruction** — the password
manager's entry is now **stale and wrong**; the new one exists only in gitignored `.env.hosted` on
Petar's machine and is **unrecoverable if lost**. A Supabase **account access token**
(`claude-code-phase-1.07`, expires 2026-08-15) was minted to drive the CLI and **should be revoked**.

**`supabase db reset --linked` is broken against this schema (`D-1.07-15`)** — it drops tables but not
sequences, then fails its own re-apply on `order_number_seq already exists`, leaving the database
wiped. Recovered by hand (drop sequence → `db push --include-all`). **Never run it against a database
with real orders — on the free tier there is no backup.**

Prior (1.07 Cowork): the accounts — Vercel project, hosted Supabase (Frankfurt), Turnstile widget,
and six env vars set in Vercel (Production + Preview, Sensitive). Reports:
`completions/Part-1-Phase-07-Cowork-Completion.md` + `Ops-Handoff-Phase-1.07.md`.

Prior (1.06): the cart flow —

**The cart flow is real — checkout now orders what the customer actually chose (`D-1.04-16` closed).**
A client-side cart (a pure reducer in `src/lib/cart/cart.ts` + a sessionStorage `useSyncExternalStore`
store in `src/components/cart/cart-store.ts`) carries the chosen **(product, variant, qty)** from the
product page through the cart to checkout and into `create_order()`. The **stand-in** that submitted
the active drop's first in-stock variant is **deleted** (`getActiveOrderContext` gone; grep clean); the
client sends **`variant_id` + `qty` only** — never a price or a name. `SizePicker`/`BuyButton` are
wired via a new `AddToCartPanel` (size required before Add; sold-out sizes unselectable; the six buy
states); `CartView` and `CheckoutForm` read real cart state; empty checkout is rejected before
`create_order()` (client empty state + `processOrder` `"empty"` guard). The cart **never** writes to
`variants`/`orders`/`order_items` and never reserves stock. The cap mirrors what `create_order()`
enforces — **2 total units per order** (not per line), which agrees with the Plan. **No new dependency;
no `supabase/migrations/` file touched; `create_order`/`expire_reservations` unchanged.** `seed.sql`
gained a second product (`test-tee-two`) so a test can prove the *chosen* product (not the drop's
first) reaches the order row. **46 Vitest tests pass** (31 + 15 new), incl. the re-run 10-vs-3 oversell
gate; the phase test was confirmed to fail against the stand-in before it was deleted. Pages rendered
in-browser both locales at 390px + 1180px. Branch `phase-1.06-cart-flow`; PR `#6` to `main`.

Prior (1.05): About + Contact —

**About + Contact are live, sourced entirely from `facts.md`.** Two **static** editorial pages
(`/about`, `/contact`, both locales, prerendered `●`/SSG via `setRequestLocale`) join the site. About
tells the competition story from `facts.md` §3 and lists **all five** press outlets as links (Трн.мк,
Струмица Денес, Бизнис Вести, Cultural Chat, Република) under a plain heading — no count, no adjective
(`D-1.05-5`); the one approved quote renders in MK and as a marked EN translation (`D-1.05-6`). Contact
carries the phone (`078 820 520` → `tel:+38978820520`), the single Instagram account, and a visible
email `[PLACEHOLDER]` — **no form, no address** (`facts.md` §1). The phone joined `src/lib/social.ts`
as a shared constant (`D-1.05-9`); the footer now links About + Contact and shows a **translated**
location (fixed a pre-existing EN-in-MK leak, `D-1.05-10`); Home shows one quiet About link in its
**countdown** and **ended** states only (`D-1.05-7`). **No hero photo and no photo slot** (`D-1.05-4`).
The header is unchanged. **31 tests still pass; build/tsc/lint clean.** Branch
`phase-1.05-about-contact`. **No `src/lib/{drop,orders}`, `src/config/`, `supabase/`, or `tests/` file
was touched.**

Prior (1.04): the drop engine —

**Drop engine landed — the site is DB-driven and a drop can open and close on its own.** The
catalogue, countdown, and buy path now come from the **database, computed on the server**;
`src/lib/demo.ts` is deleted. A typed drop config lives in `src/config/` (`D-0-4`) and a
`npm run sync:drop` script writes it to Supabase (direct-Postgres, `D-1.04-11`). Drop state
(countdown/live/ended) is server-computed from the DB and drop-state routes are `force-dynamic`
(`D-1.04-9`); the countdown is anchored to the server clock, and at T-0 the client re-validates with
the server. `create_order()` gained **`TR006 price_missing`** (before any decrement); `price_mkd`
and product names are **nullable** (`D-1.04-6/10` — no fabricated prices/names). `expire_reservations()`
is now **scheduled by pg_cron** (every 5 min) with a nightly run-log prune (`D-1.04-2/3`). Order
creation is gated by **real Cloudflare Turnstile** (Siteverify server-side, token minted at submit,
dummy keys until 1.07) and an **IP rate limit** (peppered SHA-256 hash, 20/10 min, threshold on the
drop row — no raw IP stored). **31 Vitest tests pass**, including the re-run oversell gate (10 vs 3 →
exactly 3, stock 0) and the sync-never-resets-stock test. A full order was placed end-to-end
in-browser (Turnstile → Siteverify → rate limit → `create_order` → `TRJ-0001`). **Local only, no
deploy (`D-1.03-5`).** UI unchanged bar the retired client preview switcher (`D-1.04-13`). Branch
`phase-1.04-drop-engine`; PR `#4` to `main`.

Prior (1.03): Postgres schema + atomic `create_order`/`expire_reservations` + RLS + typed clients.
Prior (1.02): design system + full clickable site, MK default + EN.

| | |
|---|---|
| Part | 2 of 2 — Launch prep |
| Phase | **2.03 complete — Legal + facts audit** (three static legal pages both locales via a shared `LegalPage` shell; full `facts.md` audit, 2 findings, zero UNSOURCED; §1 amended; 63 new MK+EN keys; MK review pack unsigned). Next: **2.04** (Perf, a11y, SEO) |
| Branch | `phase-2.03-legal-facts` → PR **#12** — **MERGED to `main` (merge `4fcc0bd`, 2026-07-19)** on Petar's instruction; branch deleted. Prior: `phase-2.02-mk-review` → PR `#11`, merged `6afae55` |
| Open PR | **None.** `#12` merged (2026-07-19). Prior merged: 1.01–1.07 `#1`–`#7`; Z.01 `#8`; 1.08 `#9`; 2.01 `#10`; 2.02 `#11`; 2.03 `#12` |
| Deployed | **YES — https://trajanov-v2.vercel.app**, production. **2.01 merged (`#10`) is LIVE and smoke-verified by Code (2026-07-19):** old `/catalog` **308→`/katalog`**, MK `/katalog` **200**, `/en/catalog` **200**, home `<html lang="mk">` + `canonical` + `hrefLang` mk/en/x-default all present. `D-1.03-5`/`D-1.06-4` closed |
| Domain | `trajanov.com` — **not purchased** (2.05) |

---

## Stack

**Canonical: `00_stack-and-config.md`.** Not restated here.

Installed and pinned in 1.01 (versions recorded there). Toolchain: Node `v24.17.0`, npm `11.13.0`.
Note: shadcn's default style is Base UI-based (`base-nova`), not Radix — see `D-1.01-1`.

---

## Built

### Legal pages + facts audit (2.03) — three honest pages, every claim traced

- **Three static legal pages**, both locales, all `●` SSG (`setRequestLocale`, no `force-dynamic`):
  `src/app/[locale]/terms/page.tsx` (`/uslovi` · `/en/terms`), `privacy/page.tsx` (`/privatnost` ·
  `/en/privacy`), `shipping-returns/page.tsx` (`/isporaka-i-vrakjanje` · `/en/shipping-returns`). Built
  from the `/about`+`/contact` editorial pattern through a **shared shell** `src/components/legal/LegalPage.tsx`
  (`LegalPage` + `LegalSection`, `D-2.03-3`); brand.md tokens only. Each carries a per-locale `Meta`
  title/description + `localeAlternates` (canonical + reciprocal hreflang) and a fixed, per-locale-formatted
  **last-updated date** (`Common.lastUpdated` + a `LAST_UPDATED` constant, `D-2.03-4`).
- **Terms** — who you buy from (**Vladimir Trajanov, Струмица, alone** — `D-2.03-1`; no company, no
  address), reach us (phone + IG from `social.ts`, email unpublished), COD-only, NMK-only, the 48h
  reservation + 2-per-order + call-to-confirm flow, MKD prices/no conversion, and "what we don't do".
- **Privacy** — collected fields **matched to the real `orders` columns** in
  `supabase/migrations/20260715021215_schema.sql` (name/phone/city/address/note, **no email** — `D-Z.01-1`);
  why/who (notification email to Vladimir, `D-Z.01-5`); Frankfurt storage; the **one-way IP hash, raw IP
  never stored** (`src/lib/rate-limit/hash.ts`); `sessionStorage` cart + **no advertising/tracking/analytics/
  social cookies** (no consent banner — Decision 4); deletion by phone; responsible party Vladimir alone.
- **Shipping & Returns** — reuses the shared `ShippingNotice` (`Common.shippingNotice`, §7); pay-courier-on-
  arrival; **two visible `[PLACEHOLDER: …]`** (courier/time/cost, returns window — register #6/#7, owner
  Vladimir), never estimated; "call the phone, Vladimir sorts it" and a plain statement that there is no
  online returns portal / prepaid label. **No statutory withdrawal period cited** (Decision 5).
- **Facts audit** `docs/legal/facts-audit-2.03.md` — Part A walks all 150 pre-2.03 keys + rendered
  constants; Part B the 63 new keys. Status per row (VERIFIED `facts.md` / VERIFIED code / PLACEHOLDER /
  NOT A CLAIM / UNSOURCED). **2 findings:** F-1 (`facts.md` §1 responsible-party contradiction → resolved
  by the §1 amendment) and F-2 (cart "calculated on delivery" → surfaced, not reworded, `D-2.03-6`).
  **Zero UNSOURCED remain.** §10 "do-NOT-have" list `grep`-confirmed absent (EAM appears only as the
  competition organiser/prize factory on About).
- **`facts.md` §1 amended** so file and site agree (displayed party = Vladimir alone `D-2.03-1`; intake
  fact kept; **open parental-confirmation flag unchanged**); dated change-log row added.
- **Strings**: `Terms`/`Privacy`/`ShippingReturns` namespaces + `Nav.terms/privacy/shipping` + 6 `Meta`
  + `Common.lastUpdated` + `Placeholder.courier`/`returnsWindow` — **63 new, MK+EN key sets identical
  (150 → 213)**, no empty value. `humanizer` pass run (cut a stiff "Here is exactly" and a self-praising
  "Short and honest:" opener; the "no X, no Y, no Z" negations match the established voice and stayed).
  `docs/i18n/string-inventory.md` regenerated (213) + committed; `docs/i18n/mk-review-2.03.md` committed
  **unsigned** (63-row table + 3-slug question + two sign-off blocks).
- **Routing**: three `pathnames` entries (MK Latin transliteration, `D-2.01-1`); **no 308 redirects**
  (new paths, nothing to redirect from); lockstep comment updated. Footer links all three (locale-aware
  `Link`, `Nav.*` keys). `tests/i18n/pathnames.test.ts` gained explicit both-locale assertions for the
  three routes.
- **Gates**: `npm run build` / `npx tsc --noEmit` / `npm run lint` clean; `npm test` **69/69** incl.
  `✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock,
  stock 0`; parity driven **RED** (`Terms.sellerHeading` removed from `en.json`) **→ GREEN**. Rendered
  in-browser at 390px + 1180px, both locales. **No `supabase/migrations/`, `create_order`,
  `expire_reservations`, cart, `src/config/`, hosted DB, or npm dependency touched.**
- **Decisions:** `D-2.03-1` (responsible party — Lazar), `D-2.03-2` (audit treats operational claims as
  code-VERIFIED), `D-2.03-3` (shared `LegalPage` shell), `D-2.03-4` (fixed last-updated date), `D-2.03-5`
  (placeholders in the `Placeholder` namespace), `D-2.03-6` (cart F-2 surfaced, not reworded).

### Native MK review (2.02) — clean pass, no source change

- **Review record** `docs/i18n/mk-review-2.02.md`: the instrument the two reviewers worked from **and** the
  recorded result. Six sections — a plain-language how-to, an 8-page URL walk (both locales, live absolute
  links on `https://trajanov-v2.vercel.app`, checked 200 before writing), the six-slug Keep/Change question,
  the full **150-key** MK/EN table with a verdict on every row, the "intentionally not translated" list, and
  two sign-off blocks. The 150 keys were diffed against `docs/i18n/string-inventory.md` — **150 = 150**, exact.
- **Result: clean pass.** All 150 strings `OK` (no faults, no style notes); all six MK slugs `Keep`. Both
  reviewers (Lazar + Petar) signed off; they reviewed **jointly** and Code transcribed the verdicts, with the
  provenance stated in the file's Section 6 (`D-2.02-2`).
- **What that means for the code:** nothing to fix. `src/messages/{mk,en}.json` are **unchanged** (Task 3 a
  no-op); `next.config.ts`, the redirect table, `src/i18n/routing.ts` `pathnames`, and `tests/i18n/` are
  **unchanged** (all six slugs Keep, `D-2.02-3`). The only code edit in the phase is the `routing.ts` comment
  flipping "provisional"→"confirmed"; the word "provisional" is now gone from `routing.ts` and this file
  (`D-2.01-5` in `Decisions.md` is left intact as the historical record).
- **Decisions:** `D-2.02-1` (review pack in English prose, MK strings verbatim, dev-path column dropped),
  `D-2.02-2` (joint review transcribed by Code), `D-2.02-3` (all six slugs confirmed Keep).
- **Gates re-run (standing protection, none skipped):** `npm run build` / `npx tsc --noEmit` / `npm run lint`
  clean; `npm test` **63/63** incl. `✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected
  with insufficient_stock, stock 0`; the catalog-parity test driven **RED** (removed `Nav.contact` from
  `en.json` → `keys present only in mk.json: [ 'Nav.contact' ]`) **then GREEN** (restored); `npm run
  i18n:inventory` regenerated `string-inventory.md` **byte-identical** (no string changed → nothing to commit).

### Bilingual (2.01) — Macedonian down to the URL

- **Localised route slugs** (`src/i18n/routing.ts`): `pathnames` maps each internal route to its MK Latin
  slug (`/katalog`, `/kosnicka`, `/naracka`, `/za-nas`, `/kontakt`) and EN English slug (`/en/catalog`, …);
  `localePrefix: 'as-needed'`, `defaultLocale: 'mk'` unchanged. Route **folders** under `src/app/[locale]/`
  are NOT renamed. Product route `/catalog/[slug]` keeps a single shared slug in both locales (`D-2.01-2`).
  `src/proxy.ts` consumes `routing` unchanged — **no edit needed**.
- **Redirects** (`next.config.ts`): six **308** rules from the old English MK paths to the new MK slugs
  (`/catalog→/katalog`, `/catalog/:slug→/katalog/:slug`, `/cart→/kosnicka`, `/checkout→/naracka`,
  `/about→/za-nas`, `/contact→/kontakt`). `/en/*` is not matched. Runs before the next-intl middleware.
  Carries a "keep in lockstep with `routing.ts`" comment (`D-2.01-3`).
- **Typed navigation everywhere**: `ProductCard`'s dynamic link uses the object form
  `{pathname:'/catalog/[slug]', params:{slug}}` so next-intl emits the localised URL; `HomeExperience`'s
  `useRouter` moved to `@/i18n/navigation`. The only remaining `next/navigation` imports are `notFound`
  (layout, product page — not a route link) and `useParams` (LanguageSwitch — a param reader with no
  next-intl equivalent). No hand-written MK slug in any component.
- **String extraction**: the only user-facing literals still inline were the cart quantity-stepper
  `aria-label`s → `Cart.decrease` / `Cart.increase`. Everything else was already in the catalogs.
- **Per-locale metadata** (`Meta` namespace): `generateMetadata` on every route (+ the layout default)
  sets a locale-distinct `<title>` + description from the catalog; nothing hardcoded in `layout.tsx`.
  `<html lang>` renders `mk`/`en` correctly.
- **hreflang + canonical** (`src/lib/site.ts` + `src/lib/metadata.ts`): a single `SITE_URL` constant
  (`https://trajanov-v2.vercel.app`, `TODO(2.05): trajanov.com` — **not** from a Vercel var, no new env
  var). `localeAlternates(href, locale)` builds `alternates` via next-intl `getPathname`: `canonical` in
  the page's own locale, `languages.mk`/`languages.en`/`languages['x-default']`(→MK), all absolute and
  reciprocal (EN↔MK point at each other for the same page, incl. the shared product slug).
- **Shipping statement** (`src/components/system/ShippingNotice.tsx`, `Common.shippingNotice`): one shared
  key, traced to `facts.md` §7 ("Shipping — North Macedonia only", VERIFIED). Renders above Add-to-cart on
  the product page and in the checkout COD block, both locales. EN: "We ship inside North Macedonia only.
  We can't deliver outside the country. Cash on delivery." (`D-2.01-7`). The product page's existing
  below-fold Shipping detail (`Product.shippingBody`) is unchanged, so shipping shows twice there.
- **Locale-correct formatting** (`src/lib/format.ts`): `formatMkd(amount, currency, locale)` groups per
  locale (MK `1.199`, EN `1,199`), MKD always. Dates already go through the next-intl formatter (About).
  **No currency conversion exists anywhere** (`D-2.01-8`).
- **Language switch** (`src/components/layout/LanguageSwitch.tsx`): `router.replace({pathname, params,
  query}, {locale})` keeps the customer on the same page across the slug change; query + `?preview` read
  from `window.location.search` at click time (avoids a CSR bail-out on the static pages, `D-2.01-6`).
- **String inventory** (`scripts/i18n-inventory.ts`, `npm run i18n:inventory` → `docs/i18n/string-inventory.md`,
  committed): 150 keys with MK/EN/where + "Intentionally not translated" + "byte-identical" (4) sections.
  Flags ~12 apparently-unused keys carried from earlier phases (e.g. `Home.title`, `Product.details`) for
  2.02 — **not removed** (out of scope).
- **Tests** (`tests/i18n/`): catalog parity (identical key sets, no empty value bar the deliberate
  `About.quoteNote`, `D-2.01-10`) + pathname coverage (route folders ⇔ `pathnames`, both-locale slugs,
  `D-2.01-9`). **63 pass** total; parity confirmed RED then GREEN. No DB needed for the i18n suites.

### Order notification email (Z.01) — the side channel, best-effort

- **Sender** `src/lib/email/order-notification.ts`: `composeOrderNotification()` (pure MK subject + body —
  order number, each product/size/qty, customer name/phone/city/address/notes) and `sendOrderNotification()`
  (reads `RESEND_API_KEY` + `ORDER_NOTIFICATION_EMAIL` at call time, sends via `resend`, **never throws**,
  bounds the call at 8s, logs failures **without PII** — only the order number + Resend error code). From
  `onboarding@resend.dev` (`D-Z.01-2`). **No `import "server-only"`** — deliberately, so it stays unit-
  testable; it is only ever imported by the "use server" action + tests, never a client component.
- **Wiring**: optional `notifyOrder(input, orderNumber)` on `ProcessDeps`; `processOrder` calls it **only**
  after `create_order()` succeeds, awaited inside a `try/catch` so the order outcome is fixed before the
  email is attempted (`D-Z.01-5`). `actions.ts` supplies the closure: `resolveOrderLines()` does one bounded
  (4s abort), best-effort `service_role` SELECT (`variants` embed `products.name_mk/name_en/slug`) to name
  the lines, degrading to quantity-only on failure (`D-Z.01-6`); then `sendOrderNotification`.
- **Customer confirmation** (Task 5): `Order.success` extended in **both** locales to state the order number,
  the 48h reservation, **COD**, and **"we'll call you to confirm"** (`D-Z.01-7`). No new message key — MK/EN
  key sets stay identical. No customer email is collected (`D-Z.01-1`).
- **Tests**: `tests/email/order-notification.test.ts` (Resend **mocked**, no DB) proves: one email to the
  right recipient from `onboarding@resend.dev` with the right fields; a thrown Resend error and a missing
  env var both degrade silently (no throw); **no PII in any log line**; and the null-line fallback fabricates
  nothing. `tests/orders/process-order.test.ts` (+4) proves notify fires exactly once after success, never on
  failure/empty, and a throwing notify still returns success. **56 pass** incl. the re-run oversell gate.
- **Dep**: `resend 6.17.2` — the only new dependency; no new `npm audit` advisory. **No migration,
  `create_order`, `expire_reservations`, component, route, or existing test changed.**

### Deploy + hosted Supabase + real keys (1.07 Code) — the store left the laptop

- **Live**: `https://trajanov-v2.vercel.app`, Vercel Hobby, project `trajanov-v2`, `main` =
  production. Deployed from the phase branch via CLI **before** the PR merged (`D-1.07-5`) — Turnstile
  will not accept preview hostnames (`D-1.07-6`), so production is the only place it can be proven.
- **Hosted DB**: Frankfurt `eu-central-1`, ref `kmuocwmevyyuhcvwoebf`, **Postgres 17.6** (= local
  major). **8/8 migrations pushed**; local and remote lists match; no migration edited to force it.
  `config.toml`'s `major_version = 17` agreed with hosted — no mismatch warning.
- **New migration** `20260716120000_catalog_grant_hardening.sql` (`D-1.07-14`) — the phase's one code
  change. REVOKEs `insert/update/delete/truncate` on `drops`/`products`/`variants` from
  `anon`/`authenticated`/`public`; re-asserts `grant select`. Idempotent; `db reset` reproduces it.
  **No function, table shape, component, string, or test changed.**
- **pg_cron on hosted**: `create extension if not exists pg_cron` **worked straight from the
  migration** — no dashboard step. 2 active jobs (`expire-reservations` `*/5 * * * *`,
  `prune-cron-run-details` `17 3 * * *`) in the `postgres` database. **Named risk: a PAUSED free-tier
  project silently pauses pg_cron, and reservations then stop expiring** (register #4).
- **Parity method** (`D-1.07-4`): ran the **real** suite against Frankfurt while empty, then reset.
  `seed.sql` applied for the run against its own "never on a deployed database" header (`D-1.07-13`)
  — the only way to reach the fixtures; erased by the reset, which was **verified**, not assumed.
  All four hosted vars exported together, not just `SUPABASE_DB_URL` (`D-1.07-10`) — exporting only
  the DB URL would have run the RLS suites against **local** and reported a **false** 46/46.
- **Connection**: the **session pooler** (`aws-0-eu-central-1.pooler.supabase.com:5432`), not the
  direct host (`D-1.07-11`). Direct is **IPv6-only** and this machine has **no IPv6** — `dns.resolve6`
  finds the AAAA, `getaddrinfo` refuses it, so every tool fails `ENOTFOUND`. Session mode keeps
  prepared statements (transaction mode on 6543 would have forced a test-helper edit). **The app never
  uses `SUPABASE_DB_URL`** — it is admin/test only (`D-1.03-12`), so nothing in production depends on
  this.
- **RLS on hosted, real anon key** (Task 6, `D-1.07-3`): `orders`/`order_items` deny **select, insert,
  update** — all `42501`. Catalog **readable, not writable** (verified against ground truth: stock
  5→5, row counts unchanged). `create_order`/`expire_reservations`/`check_order_rate_limit`
  **`anon=false, authenticated=false, service_role=true`** — **identical to local**.
- **Types**: `gen types --linked` schema content is identical to committed (6 tables, 4 functions,
  2 enums), and committed matches `--local` **byte-for-byte** (sha256 equal). `--linked` adds a
  cloud-only `__InternalSupabase { PostgrestVersion: "14.5" }` block that `--local` never emits — so
  the DoD's "byte-identical to `--linked`" is **unmeetable as worded**, for a non-schema reason.
  `src/types/database.ts` left untouched, as the brief instructs.
- **Rehearsal drop**: `npm run sync:drop` → 1 drop, 4 products, **16 variants INSERT-only, 0
  overwritten, 0 deleted** (`D-1.04-5`). `test-drop` is **ended + null-priced** (`D-1.04-12`) — the
  site renders the ended state, nothing is buyable, **0 orders** on production.
- **Turnstile proven end to end**: deployed `/checkout` carries `0x4AAAAAAD23OFW7Ka1hTR1F`; **no dummy
  key in 961 KB of deployed JS + HTML**; no `service_role`/secret/pepper/connection-string in the
  client payload. A widget on the production hostname **solved in Managed mode** and its **real token
  + the real secret** returned Siteverify **`success: true, hostname: trajanov-v2.vercel.app`**
  (wrong-secret control: `invalid-input-secret`).
- **Credentials**: hosted values live in gitignored **`.env.hosted`** (`D-1.07-9`), NOT in
  `.env.local` — pointing `.env.local` at Frankfurt would aim `npm run dev`/`test`/`sync:drop` at
  **production** by default. Verified: exported vars beat `process.loadEnvFile`, so both coexist.

### Cart flow (1.06) — the customer's choice reaches the order row

- **Pure cart** `src/lib/cart/cart.ts` — React-free reducer: `addItem`/`setItemQty`/`removeItem`/
  `toOrderItems` + `MAX_UNITS_PER_ORDER = 2` (total units, mirrors `create_order()` step 3, `D-1.06-6`).
  Node-testable; never touches the DB.
- **Cart store** `src/components/cart/cart-store.ts` — a module-singleton external store via
  `useSyncExternalStore`, **sessionStorage**-backed (`D-1.06-5`): survives refresh + in-session
  navigation, dies with the tab. Null server snapshot → a clean `hydrated` flag, no hydration flash, no
  setState-in-effect. No new dependency.
- **Add to cart** `src/components/product/AddToCartPanel.tsx` — owns the selected variant; wires
  `SizePicker` (available/selected/unavailable) + `BuyButton` (six states). Size required before Add
  (`Product.chooseSize`), sold-out sizes unselectable, cap enforced, inline `aria-live` feedback
  ("Added. — View cart"), header cart badge left unwired (header out of scope, `D-1.06-10`).
- **Wiring**: `SizePicker` (controllable) + `BuyButton` (real `onClick`) wired without breaking the
  styleguide; `CartView` reads the store (steppers/cap/empty); `catalog/[slug]` passes
  `variantId`/`dropSlug`; `cart`/`checkout` pages read real state; `CheckoutForm` submits
  `variant_id`+`qty` only.
- **Stand-in deleted**: `getActiveOrderContext`/`CheckoutContext` removed from `src/lib/drop/state.ts`
  (now exposes `variantId` on `SizeOption` + `dropSlug` on the product view, `D-1.06-7`); grep clean.
- **Empty-cart guard**: `processOrder` rejects `items: []` with `"empty"` before `create_order()`
  (`D-1.06-8`), plus the client's own empty checkout state.
- **Tests**: `tests/cart/cart.test.ts` (pure reducer) + `tests/orders/checkout-items.test.ts` (chosen
  variant → order_items, two items, cap client+server, TR004 sellout) + empty-cart case in
  `process-order.test.ts`. `seed.sql` gained `test-tee-two` (`D-1.06-9`). **46 pass; the phase test
  confirmed to fail against the stand-in (RED captured), then pass against the cart.**
- **Strings**: `Buy.added`, `Buy.viewCart`, `Order.emptyCart` in both catalogs (**130 keys each,
  identical**). Humanizer pass run.

### About + Contact (1.05) — static editorial pages

- **About** `src/app/[locale]/about/page.tsx` — **static** (`setRequestLocale`, no `force-dynamic`).
  Eyebrow → H1 → 3 body paragraphs (brand, competition, prize) → pull-quote → coverage list → link to
  `/catalog`. Every claim traced to `facts.md` §1/§2/§3/§4/§7. Quote renders in MK (original) and EN
  (marked translation, `D-1.05-6`). Coverage = all five outlets as links, dates via the next-intl
  formatter, **no count/adjective** (`D-1.05-5`, `D-1.05-11`). Press URLs copied character-exact from
  `facts.md` §4 (Cultural Chat's Cyrillic path keeps its stripped `fbclid`); all five verified live
  (HTTP 200) and confirmed as the competition article.
- **Contact** `src/app/[locale]/contact/page.tsx` — **static**. Phone (`078 820 520` →
  `tel:+38978820520`, ≥44px tap target), Instagram (`@trajanovv2026`, ≥44px), email
  `[PLACEHOLDER]` via the `<Placeholder>` component. Context line (Strumica · ships NMK only · COD).
  **No form, no address.**
- **`src/lib/social.ts`** gained `PHONE_DISPLAY` + `PHONE_TEL` (`D-1.05-9`) — single source for the
  phone, imported by the footer + Contact, never retyped.
- **`SiteFooter.tsx`** — About + Contact links (locale-aware `Link`), phone imported from `social.ts`,
  location now translated via `Nav.location` (`D-1.05-10`). Header untouched (`D-1.05-7`).
- **`HomeExperience.tsx`** — one quiet About link in the **countdown** and **ended** states; **none** in
  live/opening (verified in-browser).
- **Strings**: new `About` + `Contact` namespaces and `Nav.about/contact/location`, `Placeholder.email`
  in **both** catalogs — **identical key sets (126 each), verified**. Humanizer pass run.
- Rendered in-browser at 390px + 1180px, both locales (Task 8). `completions/_TEMPLATE.md` filename
  corrected to `Part-X-Phase-YY-Completion.md`.

### Drop engine (1.04) — server-driven, local only

- **Typed drop config** (`src/config/`, `D-0-4`): `schema.ts` (strict types + runtime validators +
  `LOW_STOCK_THRESHOLD`/`DEFAULT_RATE_LIMIT`), `time.ts` (DST-aware Europe/Skopje wall-clock → UTC,
  `D-1.04-4`), `drops.ts` + `products.ts` + `index.ts`. One committed **ended, null-priced** `test-drop`
  rehearsal (`D-1.04-12`).
- **Config→DB sync** (`scripts/`, `npm run sync:drop`): idempotent; **stock written INSERT-only**
  (`D-1.04-5`); refuses to publish an open/future drop with a null price, or to change a started drop's
  price; never deletes a row with `order_items`; direct-Postgres admin tool, not runtime (`D-1.04-11`).
- **Server drop state** (`src/lib/drop/state.ts`, server-only): countdown/live/ended computed from the
  DB; product mapping to the card shape; a dev-only `?preview` override (`D-1.04-13`). Routes
  `force-dynamic` (`D-1.04-9`); countdown anchored to server time; T-0 re-validates (`router.refresh`).
- **Migrations** (4): `price_mkd`/`name_*` nullable + CHECK; `create_order` `TR006` before decrement;
  `drops.rate_limit_per_window` + `order_attempts` + `check_order_rate_limit()`; `pg_cron` (sweep 5-min
  + nightly prune). `db reset` builds a working schedule from scratch (`select * from cron.job` = 2).
- **Order path** (`src/lib/orders/`): `placeOrder` Server Action → `verifyTurnstile` (Siteverify) →
  IP rate limit → `create_order`. `process-order.ts` is the testable core; `phone.ts` normalises MK
  numbers to `+389########`.
- **Turnstile** (`src/lib/turnstile/`, `src/components/checkout/Turnstile.tsx`): real widget, token
  minted at submit, dummy keys until 1.07 (`D-1.04-8/17`).
- **IP rate limit** (`src/lib/rate-limit/`): peppered SHA-256 in Node, only the hash in the DB
  (`D-1.04-7/14`).
- **UI wired to real data** (same components/handover): home/catalog/product/checkout. `demo.ts` +
  `TurnstilePlaceholder` deleted; IG constants moved to `src/lib/social.ts`.
- **Strings**: MK + EN for every `TR001`–`TR006`, rate-limit, Turnstile, and the "opening" state;
  humanizer pass run (`TR004` reads "someone got there first", `TR006` is honest self-guard copy).
- **Tests**: `npm test` → **31 pass** (13 prior + 18 new): DST resolver, sync no-reset/idempotent/
  refusals, `TR006` no-decrement, rate limit 20/21 + hash-not-IP, Turnstile-gates-create_order, cron
  jobs present, and the re-run 10-vs-3 oversell gate.

### Data layer (1.03) — Supabase, local only

- **Schema** (`supabase/migrations/`): `drops`, `products`, `variants` (stock per size, `stock >= 0`
  backstop), `orders` (enum `order_status`, `TRJ-####` sequence, phone `^\+389\d{8}$` — `TODO(2.02)`,
  partial unique index for one-live-order-per-phone-per-drop, expiry-sweep index), `order_items`
  (qty 1–2, `unit_price_mkd` **price snapshot**). Every table commented.
- **`create_order()`** — the only path that creates an order. Atomic conditional decrement, sorted by
  `variant_id`, drop-window + cap + duplicate-phone enforcement. Distinct error codes `TR001`–`TR005`
  on `error.code` (`src/lib/orders/order-errors.ts`); `D-1.03-11`.
- **`expire_reservations()`** — releases lapsed holds, returns stock exactly once, concurrency-safe
  (`FOR UPDATE SKIP LOCKED` + conditional claim). Ships now; **scheduling is 1.04** (`D-1.03-6`).
- **RLS + grants**: catalog read-only public; `orders`/`order_items` deny-all; functions
  `service_role`-only (`SECURITY DEFINER`, execute revoked from `PUBLIC`; `D-1.03-9`).
- **Typed clients**: `src/lib/supabase/client.ts` (anon), `server.ts` (service-role + `server-only`),
  generated `src/types/database.ts` (`npm run gen:types`).
- **Tests** (`npm test`, Vitest): 13 pass — oversell gate, expiry (incl. concurrent double-return),
  anon RLS wall, drop window + full error vocabulary.

### Design tokens
- **`brand.md` filled** (source of truth) and mirrored into `src/app/globals.css`: full dark palette
  (ground/surface/surface-2, foreground/muted, mustard + hover + on-mustard, accent red + on-accent,
  live, soldout, error, border/border-strong, focus-ring, mustard tints), type scale, radius, shadow,
  motion. **Every colour pair computed against WCAG 2.2 AA — all pass** (`brand.md` §3 ledger).
- **Fonts:** Rubik (display) + Inter (body), OFL, self-hosted via `next/font` with the `cyrillic`
  subset; MK glyphs verified at display size in-browser.

### Pages (MK default `/`, EN `/en/`)
- **Home** `/[locale]` — hero countdown (loudest object; <1h + <1min thresholds + zero→LIVE) that
  switches to the LIVE drop grid; a preview switcher mirrors the handover's demo buttons.
- **Catalog** `/catalog` — 4-piece grid incl. a sold-out card.
- **Product** `/catalog/[slug]` — buy path above the fold, detail below.
- **Cart** `/cart` — shown at the 2-unit cap (disabled `+`, cap notice); remove to reach empty state.
- **Checkout** `/checkout` — one screen, fields + error validation, Turnstile-resolving gate, COD.
- **Styleguide** `/styleguide` — component-state strip + colour/type reference (review aid).

### Components (all handover states)
- `drop/` — Countdown, DropBanner (live/ended/countdown-eyebrow), StockBadge.
- `product/` — ProductCard, BuyButton (6 states), SizePicker.
- `cart/` — CartView (steppers, cap, empty). `checkout/` — CheckoutField, TurnstilePlaceholder,
  CheckoutForm. `layout/` — SiteHeader, SiteFooter, LanguageSwitch. `system/` — Placeholder,
  PhotoSlot, PreviewNotice. `home/` — HomeExperience. (`components/ui/` still shadcn-reserved, empty.)

### Integrations wired
- **next-intl** — MK default (`/`), EN (`/en/`), `localePrefix: as-needed`; message catalogs
  expanded for all UI strings (full extraction/hreflang still 2.01).
- **shadcn/ui** — config + `cn()` only; brand components hand-authored (`D-1.02-6`). No `ui/` yet.

| Integration | Status |
|---|---|
| Supabase | **HOSTED + MIGRATIONS PUSHED + PARITY PROVEN** (1.07 Code) — Frankfurt `eu-central-1`, ref `kmuocwmevyyuhcvwoebf`, **Postgres 17.6**. 8/8 migrations; local == remote. **46/46 tests pass against hosted**, incl. the 10-vs-3 oversell gate; pg_cron = **2 active jobs**; RLS verified with the real anon key; DB left **clean, TRJ-0001**. `test-drop` published (ended, null-priced). **Owed #4 CLOSED.** Legacy keys (`D-1.07-1`) confirmed in use. Admin access via the **session pooler** (`D-1.07-11`, IPv6). ⚠ **"Auto-expose new tables" is still ON** — future tables land anon-writable (`D-1.07-14`); ⚠ **`db reset --linked` is broken here** (`D-1.07-15`). |
| Resend | **BUILT (Z.01).** SDK `resend 6.17.2`; server-side best-effort order-notification sender in `src/lib/email/order-notification.ts`, fired after `create_order()` succeeds (`D-Z.01-5`), never affecting the order (Plan §8). From `onboarding@resend.dev` (`D-Z.01-2`); recipient in `ORDER_NOTIFICATION_EMAIL`, not published on Contact (`D-Z.01-3`). Unit-tested with **Resend mocked**. ✅ **Real inbox delivery VERIFIED — 1.08 operator (2026-07-18, `D-1.08-4`):** prereqs live (Resend account under Vladimir's email + `RESEND_API_KEY`/`ORDER_NOTIFICATION_EMAIL` in Vercel, redeployed); a real order (`TRJ-0001`) delivered the MK notification to Vladimir's inbox from `onboarding@resend.dev` with the correct order number / line / customer block / COD copy. Register #7 cleared. Branded from-address on `trajanov.com` still owed (#8 → 2.05, `D-Z.01-2`). |
| Turnstile | **REAL KEYS LIVE IN PRODUCTION** (1.07 Code) — "Trajanov store", **Managed** (`D-1.07-2`), hostnames `trajanov-v2.vercel.app` + `localhost` only (`D-1.07-6`). Deployed `/checkout` serves `0x4AAAAAAD23OFW7Ka1hTR1F`; **no dummy key anywhere in the deployed build** (`D-1.04-8` superseded). Widget **solves on the production hostname**; real token + real secret → Siteverify **`success: true`**. **Owed #5 CLEARED — 1.08 Code (2026-07-18):** the real secret also *rejects* a missing token (`missing-input-response`) and an invalid token (`invalid-input-response`), wrong-secret control → `invalid-input-secret`; `orders=0`, no stock change. Server-side enforcement proven both directions (`D-1.07-7`, `D-1.08-3`). |
| Cloudflare DNS | Not configured (2.05) |
| Cloudflare Analytics | Not configured (2.05) |
| Vercel project | **DEPLOYED** (1.07 Code) — `trajanov-v2`, Hobby, `main` = production, live at `https://trajanov-v2.vercel.app` serving both locales from the hosted DB. 6 env vars in effect. ⚠ All six are **Sensitive = write-only**: `vercel env pull` returns them **empty** (`D-1.07-12`). ⚠ Stray **`trajanov`** project still exists — one repo, two projects (Lazar). |

---

## Owed-verification register

Things claimed done that only Lazar (or a real device / real account) can confirm. **At 3+ items,
or before any phase that builds on unverified work, the next phase is a verification phase.**
**Must be empty before Part 2 — hard gate at 1.08.**

| # | Item | Owed since | Phase that verifies |
|---|---|---|---|
| ~~1~~ | **Design direction sign-off** — **CLEARED — 1.08 operator (2026-07-18).** Lazar reviewed the live site (`/`, `/about`, `/contact`, `/catalog`, product, `/cart`, `/checkout`) and **signed off on the tokens** (palette + fonts derived from the handover ledger, `D-1.02-1`). No changes requested. | 1.02 | **CLEARED — Lazar review of the live site** |
| ~~2~~ | **IG profile URL click-test** — **CLEARED — 1.08 operator (2026-07-18).** A human clicked `@trajanovv2026` and confirmed it opens **Vladimir's actual profile** (`facts.md` §6). The handle was already VERIFIED and the link renders correctly (footer, drop-ended banner, Contact). | 1.02 | **CLEARED — Lazar click-test** |
| ~~4~~ | ~~**Hosted-Supabase parity**~~ — **CLOSED by 1.07 Code, with evidence.** 8/8 migrations pushed to `kmuocwmevyyuhcvwoebf`; `migration list` shows local == remote, **no migration edited to force it**. **`npm test` against Frankfurt: 46/46**, incl. the **10-vs-3 oversell gate (exactly 3 succeed, 7 rejected, stock 0)** and both expiry tests. `cron.job` = **2 active rows**, extension created **by the migration, no dashboard step**. Rate-limit table + `check_order_rate_limit` present and exercised (20/21 test passed on hosted). RLS re-verified with the **real anon key**: `orders`/`order_items` deny select/insert/update (`42501`); functions `anon=false`, identical to local. Hosted then **reset and verified clean** (0 rows, TRJ-0001). **One real divergence was found and fixed, not waved through** (`D-1.07-14`). **Residual risk, NOT a verification debt — moved to Known issues #7:** a **paused free-tier project silently pauses pg_cron**, and reservations stop expiring. | 1.03/1.04 | **1.07 Code — DONE** |
| 5 | **Real Turnstile keys — NARROWED, still open** (`D-1.07-7`). **Proven in 1.07 Code:** the deployed `/checkout` serves the **real** site key `0x4AAAAAAD23OFW7Ka1hTR1F`; **no dummy key appears anywhere in the deployed build** (961 KB of JS + HTML scanned) — `D-1.04-8`'s "dummy keys until 1.07" is fully retired; the widget **renders and solves in Managed mode on `trajanov-v2.vercel.app`**, and a **real token + the real secret** returned Siteverify **`success: true, hostname: trajanov-v2.vercel.app`** (a wrong-secret control returned `invalid-input-secret`, so the pass is meaningful); Managed mode's silent auto-pass **matches** the local dummy-key behaviour (`D-1.07-2` confirmed). **STILL OWED:** whether Cloudflare actually **challenges a bot on a real order**. That needs a **live drop**, which 1.07 deliberately does not create (the only drop is `test-drop`, ended + null-priced, `D-1.04-12`). Also unexercisable on preview URLs at all (`D-1.07-6`). **CLEARED — 1.08 Code (2026-07-18):** against the deployed **real production secret**, Siteverify rejected a **missing** token (`missing-input-response`) and an **invalid** token (`invalid-input-response`), and a wrong-secret control returned `invalid-input-secret` — so the real gate genuinely validates; hosted `orders=0`, no stock change. Per the brief's Task 5 this is what closes #5 (the load-bearing server-side gate is proven; a browser-solved bot on a *real* order is exercised whenever the operator runs the runbook order). | 1.04 | **CLEARED — 1.08 Code** |
| ~~6~~ | **"Automatically expose new tables"** — **CLEARED — 1.08 operator (2026-07-18).** Lazar turned the toggle **OFF** on `kmuocwmevyyuhcvwoebf`. **Standing caveat (not a debt):** turning it off does **not** retroactively revoke, so any future migration that adds a table (e.g. `Y.01`'s photo/fabric work) must still pair it with an explicit `REVOKE` — carry this into that migration's DoD (`D-1.07-3/14`). | 1.07 | **CLEARED — Lazar (dashboard)** |
| ~~7~~ | **A real order sends a notification email that arrives in Vladimir's inbox** — **CLEARED — 1.08 operator (2026-07-18).** The Z.01 email prereqs were set up (Resend account under Vladimir's email + `RESEND_API_KEY`/`ORDER_NOTIFICATION_EMAIL` in Vercel, redeployed), the rehearsal drop was opened, and **a real order (`TRJ-0001`) was placed end to end on a phone.** The MK notification **arrived in Vladimir's inbox** from `onboarding@resend.dev` — subject "Нова нарачка TRJ-0001 — Trajanov", listing the ordered line (`test-mustard-ochre — величина L — 1 бр.`), the full customer block (name/phone/city/address/notes), and the COD + call-to-confirm + "Supabase is the record" lines. DB side confirmed: order row, atomic decrement (3→2), 48h reservation. Order + reservation then deleted; hosted returned clean (`D-1.08-4`). | Z.01 | **CLEARED — 1.08 operator (real order + email)** |
| ~~8~~ | **Branded from-address on `trajanov.com`.** The sender is `onboarding@resend.dev` until the domain is bought + verified (`D-Z.01-2`). **RECLASSIFIED to the 2.05 cutover track (`D-1.08-2`)** — removed from this register's zero-condition, since #8 cannot be cleared without the (unbought) domain and leaving it here would make 1.08's "register to zero" impossible. | Z.01 → | **2.05** (domain purchase + verification) |
| 9 | **The legal pages have had no human legal review.** Terms, Privacy, and Shipping & Returns were written in-house by Code from `facts.md` and shipped code; **no lawyer has read them**, and the responsible party named is a **minor, alone** (`D-2.03-1`). No statute is cited and nothing legally binding is asserted beyond what the store operationally does — but no professional has confirmed these pages are adequate for a cash-on-delivery consumer contract. Owner: **Lazar + Vladimir**. | 2.03 | **2.05 cutover** |
| 10 | **New MK legal copy is unreviewed by a native speaker.** The 63 new `Terms` / `Privacy` / `ShippingReturns` (+ `Nav`/`Meta`/`Placeholder`) MK strings are machine-written and have **not** been read by a native Macedonian speaker — legal copy is the worst place for a machine-translation error. Review pack ready and **unsigned** at `docs/i18n/mk-review-2.03.md` (63-row table + slug question for the 3 new slugs + two sign-off blocks). Owner: **Lazar + Petar**. | 2.03 | **before 2.05 cutover** |

*Code verified directly (not owed) in 1.06 — carried forward; the 1.07 Cowork half is ops-only and
verified no code directly: `npm run build`, `npx tsc --noEmit`, `npm run lint`,
`npm test` (**46**) all green, incl. the re-run 10-vs-3 oversell gate; the phase test was confirmed to
**fail against the stand-in** (RED captured) before the stand-in was deleted; `/catalog`,
`/catalog/[slug]`, `/cart`, `/checkout` rendered in-browser at 390px + 1180px, both locales, against
the 1.02 handover; the cart writes to **no** DB table and reserves no stock (verified by reading — no
cart code path touches `variants`/`orders`/`order_items`); the stand-in grep returns nothing; no
`supabase/migrations/` file and neither `create_order` nor `expire_reservations` changed; no new
dependency (`package.json` unchanged). (Prior direct-verified items carry forward unchanged.)*

*Code verified directly in **Z.01** (not owed): `npm run build`, `npx tsc --noEmit`, `npm run lint`, and
`npm test` (**56** — 46 + 6 email + 4 notify) all green, incl. the re-run 10-vs-3 oversell gate; the email
sender's best-effort guarantees (sends once on success with the right recipient/fields; a thrown Resend
error, a Resend error object, and a missing env var all leave the order successful; **no PII in any log
line**) are proven by unit tests against a **mocked** Resend — the real API is never called; the diff was
grepped clean of any email literal, key, or PII, and `.env.local`/`.env.hosted` remain gitignored; no
`supabase/migrations/` file, `create_order`, `expire_reservations`, component, or route changed; the only
new dependency is `resend 6.17.2`.*

*Code verified directly in **1.08** (not owed): local `npm run build`, `npx tsc --noEmit`, `npm run lint`, and
`npm test` (**56**) all green; and **against the live Frankfurt DB**: the full suite **56/56** incl. the
**10-vs-3 oversell gate** (exactly 3 succeed, 7 `insufficient_stock`, stock 0), **live pg_cron expiry** (a
backdated hold expired by the scheduled `*/5` job at the 10:00:00 cycle — `cron.job_run_details` succeeded,
"1 row" — stock returned; **2 active cron jobs**), **Turnstile enforcement with the real production secret**
(missing→`missing-input-response`, invalid→`invalid-input-response`, wrong-secret control→`invalid-input-secret`;
`orders=0`, no stock change), and **rate limits** (IP `check_order_rate_limit` max=5 → 5 allowed / 6th–7th
rejected; phone `create_order` → 2nd same-phone `TR005`). All hosted writes were seed/test fixtures, removed
after; hosted left at `orders=0`, only the ended `test-drop`, **2 cron jobs**, `order_number_seq` reset to
**TRJ-0001**. No `supabase/migrations/` file, `create_order`, `expire_reservations`, component, or route
changed; the only source changes are `facts.md` §7, `src/config/products.ts`, `src/config/drops.ts` (comment),
plus state/decision/report docs. **Then verified by the operator, same session (`D-1.08-4`):** the Z.01 email
prereqs were set up, the rehearsal drop was opened, a **real phone order (`TRJ-0001`)** was placed, the **MK
notification email arrived in Vladimir's inbox**, and the order + reservation were deleted (hosted re-verified
clean); the **design sign-off**, **IG click-test**, and **auto-expose toggle OFF** were all done by Lazar. The
hosted `test-drop` is left **ended** and carrying the two real-priced colourways (`test-mustard-ochre`
S/M/L/XL, `test-off-white` XL-only, 1199 MKD, stock 3) — matching the committed config, nothing buyable.*

***2.03 update (2026-07-19): the register is NO LONGER EMPTY.*** Phase 2.03 added rows **#9** (the legal
pages have had no human legal review) and **#10** (the new MK legal copy is unreviewed by a native
speaker). Neither is a build blocker; **both are 2.05-cutover blockers**, owned jointly by Lazar +
Vladimir (#9) and Lazar + Petar (#10). This is expected — the phase brief said this register "is why it
stops being empty." The 1.08 note below stands as the historical record of how the **Part 2 hard gate**
(register-to-zero before Part 2) was met; that gate is unaffected — it fired before 2.01 and passed.

*After **1.08 (Code + operator, 2026-07-18) the register's zero-condition was MET — the register was EMPTY.**
Cleared/moved this session: **#5 CLEARED** (Code — real-secret Siteverify enforcement); **#1** design sign-off,
**#2** IG click-test, **#6** auto-expose toggle OFF, and **#7** real-order-delivers-email-to-Vladimir's-inbox
all **CLEARED by the operator** (`D-1.08-4`, evidence in each row above); **#8 RECLASSIFIED to the 2.05 cutover
track** (`D-1.08-2`); **#4 remains CLOSED** (1.07, struck above). Item #3 (fresh-session review of PR `#4`) was
removed at the PR-#4 merge; the old #6 (review of PR `#6`, `D-1.06-2`) was **WAIVED** (`D-1.06-11`). **1.08 was
the hard gate before Part 2, and it has now PASSED — nothing sits in front of 2.01.** The only operator items
still open are **recommended housekeeping** (L1–L4, L7), which are explicitly **not** part of the gate's
zero-condition.*

**Owed to Lazar / the operator — dashboard + password-manager jobs only he can do:**

| # | Item | What "pass" looks like |
|---|---|---|
| L1 | **Delete the stray Stockholm Supabase project.** **Confirmed still live this phase**: ref `ewcqwbuvbbfduytiiaxy`, region `eu-north-1`, name "petarjakimov11012011-cell's Project", status ACTIVE_HEALTHY, empty. | Only `kmuocwmevyyuhcvwoebf` (Frankfurt) remains in the Supabase account |
| L2 | **Review/remove the stray `trajanov` Vercel project.** Confirmed still present alongside `trajanov-v2`. | Exactly one Vercel project points at this repo, so one push cannot trigger two deployments |
| L3 | **SAVE THE NEW DB PASSWORD — CHANGED THIS PHASE (`D-1.07-12`).** The password manager's entry is **stale and wrong**: the DB password was **reset** at the operator's instruction. The new value exists **only** in gitignored `.env.hosted` on Petar's machine. **Unrecoverable if that file is lost** (another reset would be needed). Also confirm `ORDER_IP_HASH_PEPPER` is saved — the **Vercel** value must never change or every rate-limit window resets (`D-1.04-7`). | Both retrievable from the password manager, and the DB password matches `.env.hosted` |
| L4 | **Revoke the Supabase access token `claude-code-phase-1.07`** (Account → Access Tokens; expires 2026-08-15). It controls the **whole Supabase account** and was only needed for `link`/`db push`/`gen types --linked`. | Token no longer listed |
| ~~L5~~ | **DONE (2026-07-18).** Lazar turned OFF "Automatically expose new tables" on `kmuocwmevyyuhcvwoebf` (register #6 cleared). Standing caveat: does not retroactively revoke — pair with an explicit REVOKE in any migration that adds a table. | ✅ Toggle off |
| ~~L6~~ | **DONE (2026-07-18).** Register #1 (design sign-off) and #2 (Instagram click-test) both cleared by Lazar against the live site. | ✅ Both confirmed |
| L7 | **Uptime monitor** — a paused free-tier project silently pauses pg_cron and takes the store offline (Known issues #7). Not set up this phase (out of scope). | A monitor hits the URL ≥ every 5 min, alerting two inboxes |

---

## Placeholder register

Every visible `[PLACEHOLDER: …]` on the site. **Must be empty before cutover (2.05). Launch
blocker.**

*2.03 update (2026-07-19): **+2 rows** — #6 (courier / delivery time / delivery cost) and #7
(returns/exchange window), both on the new Shipping & Returns page, owner Vladimir. 2.03 **cleared,
reworded, or hid no existing placeholder** (#2–#5 are byte-for-byte unchanged); it added two honest
`[PLACEHOLDER: …]` markers rather than guessing a delivery cost or a returns window.*

*2.01 shipped **no new placeholder** and **cleared/reworded/hid none** — the existing rows below are
unchanged. The placeholder strings themselves (`Placeholder.*`) were already in the catalogs; 2.01 only
confirmed they are translated in both locales.*

| # | Placeholder | Page | Waiting on | Owner |
|---|---|---|---|---|
| ~~1~~ | ~~`[PLACEHOLDER: цена MKD]` (product price)~~ | ~~Catalog cards, Product, Cart, Checkout~~ | **CLEARED 2026-07-18** — a real price now exists: **1199 MKD** VERIFIED (`facts.md` §7), set in `src/config/products.ts`, and **synced to hosted** (the rehearsal `test-drop` products carry 1199 MKD). When the drop was briefly opened for the gate's real order, the checkout/cart/confirmation rendered **1199 ден** (no placeholder, no USD). Each *future* drop still needs its own real price, but that is per-drop, not a standing placeholder. | — |
| 2 | `[PLACEHOLDER: фотографија — Владимир]` (product photo) | Catalog cards, Product | Real product photos (`D-0-6`) | Vladimir |
| 3 | `[PLACEHOLDER: состав и нега — од етикетата]` (fabric/care) | Product | Composition from the labels | Vladimir |
| 4 | Product **names** render as neutral slots ("Производ 01…") — **NARROWED to names-only 2026-07-18**: sizes are now **real** (S/M/L/XL, off-white XL-only, VERIFIED `facts.md` §7), no longer a flagged sample. Per-size **measurements** (cm/fit chart) are still owed. | Catalog, Product | Real product **names** + a size-**measurement** chart | Vladimir |
| 5 | `[PLACEHOLDER: е-пошта — Владимир]` (contact email) | **Contact** (1.05) — live at `https://trajanov-v2.vercel.app/contact` | **The email now EXISTS (VERIFIED 2026-07-18) and is wired as the Z.01 notification recipient — but it is DELIBERATELY NOT published on Contact yet** (`D-Z.01-3`): showing a minor's personal email to a 12+ audience + scrapers awaits Vladimir's explicit sign-off. So this placeholder **stays** — no longer "waiting on the email to exist", now waiting on **Vladimir's OK to display it publicly** | Vladimir (sign-off) |
| 6 | `[PLACEHOLDER: курир, време и цена на испорака — Владимир]` (courier, delivery time + delivery cost) | **Shipping & Returns** (`/isporaka-i-vrakjanje`, `/en/shipping-returns`) — live after 2.03 deploys | Courier + delivery time + delivery **cost** — none in `facts.md`. Deliberately **not** estimated: on cash-on-delivery a wrong delivery cost is money asked for at the door on a promise nobody made (`D-2.03` Task 5) | Vladimir |
| 7 | `[PLACEHOLDER: рок за враќање и замена — Владимир]` (returns/exchange window) | **Shipping & Returns** | The returns/exchange **window** — not in `facts.md`; **no statutory withdrawal period is cited** (Decision 5). A real number comes from Vladimir | Vladimir |

*#5 (email) is a pure UI placeholder via `<Placeholder>` (`Placeholder.email` key), shipped by 1.05
(`D-1.05-3`). **Z.01 has shipped**, so this row no longer gates anything on the build side — the email
exists and is wired as the notification recipient. It now persists for a **different** reason (`D-Z.01-3`):
Vladimir's personal email is not published publicly until he signs off. Do **not** clear it by filling the
Contact page until that sign-off exists. **Every placeholder below is publicly visible on
`https://trajanov-v2.vercel.app`.**
#1–#4 are now driven by the **DB via the typed drop config** (not `demo.ts`, deleted): a null
`price_mkd`/`name_*` renders the price/name placeholder (`D-1.04-6/10`); photo + fabric/care have **no
DB column yet** — those columns land with **`Y.01 — Drop content load`** (`D-1.06-3`), not 1.06 — and
render as pure UI placeholders. The price (#1) and neutral-name (#4) placeholders also surface on the
new **Cart** rows (existing placeholders, no new one shipped by 1.06). When
Vladimir supplies real prices/names, filling `src/config/products.ts` + `npm run sync:drop` clears #1
and #4 (for a drop). Sizes for a real drop come from config (the rehearsal's are a flagged sample).
**The register must be empty before cutover (2.05).***

**Already known to be coming** (from `facts.md`, will become entries the moment the relevant page
is built):

- Real prices in MKD → Product pages
- Sizes / measurements → Product pages
- Fabric composition + care → Product pages
- Product photos → Catalog, Product

*Resolved this phase: **Vladimir's email** is now a live register row (#5). The **press links** are no
longer "coming" — all five are VERIFIED (`facts.md` §4, 2026-07-15) and cited on About as links, with
no placeholder (`D-1.05-5`).*

---

## Carryovers

- **`Z.01 — Order email (Resend)` is DONE on the code side** (this update; `D-1.07-8` satisfied). The
  sender is built and unit-tested against a mocked Resend; the order path fires it best-effort after
  `create_order()`. **What remains is real-world only, and it is owed to 1.08** (register #7): the operator
  prereqs (Resend account under Vladimir's email, API key, the two Vercel env vars) plus a live, priced
  drop and a real order, to prove an email actually lands in Vladimir's inbox. **This session had no
  independent confirmation that the operator prereqs are done** — the wiring + mocked tests are valid
  either way, and real delivery is (as designed) a 1.08 concern.
- **1.08 also needs a live drop.** Owed #5's remainder (does Cloudflare challenge a real bot), Z.01's
  register #7 (a real order emails Vladimir), and 1.08's own "one real order" DoD all require an **open,
  priced** drop. The only committed drop is `test-drop` — ended and null-priced (`D-1.04-12`) — and creating
  a live one is out of scope here. Prices/names come from Vladimir via `Y.01`.
- Prior: `D-1.04-16` (no real product→cart→checkout item flow) is **closed by Phase 1.06**: the
  cart flow is built, the stand-in is deleted, and an automated test proves the customer's chosen
  product+variant reaches the `order_items` row.

---

## Known issues / accepted risks

| # | Item | Ref | State |
|---|---|---|---|
| 1 | **Vercel Hobby ToS violation.** Commercial use prohibited; Vercel may pull the deployment without notice, explicitly including during traffic spikes — i.e. drop day. Accepted by Lazar. **Now materially live: 1.07 actually deployed the store to Hobby.** | `D-0-2` | Live. Mitigations: portability rule (**re-verified 1.07: nothing Vercel-specific added; no Postgres/Blob/KV; the only Vercel artifacts are the gitignored `.vercel/` link dir**), pre-written Pro migration (X.01), 2.06 contingency. |
| 2 | **No automated PR review.** House review gate waived for this project. Risk concentrated on 1.03/1.04 concurrency code. | `D-0-3` | Live. Mitigations: cross-review, fresh-session review on 1.03/1.04, concurrent-order test. |
| 3 | **Public repo.** One committed secret is scraped before you notice. | `D-0-1` | Live. Mitigation: hard rule in `CLAUDE.md`. Rotate, never just delete. |
| 4 | **Legal responsibility unconfirmed.** Minor, no registered entity, collecting consumer PII. 2.03 shipped Terms + Privacy naming **Vladimir alone** (`D-2.03-1`) and the pages have had **no legal review** (owed #9) — the underlying legal exposure is unchanged and still owed. | `facts.md` § 1 · `D-2.03-1` | **Cutover blocker.** Owner: Vladimir + parents. |
| 5 | **Product photos do not exist.** | `D-0-6` | **Blocks 1.06.** Owner: Vladimir. Critical path. |
| 6 | **Bar photos: model + venue permission unconfirmed**, and age-appropriateness of an alcohol backdrop for a 12+ audience is an open owner call. | `facts.md` § 8 | **No longer blocks 1.05** — `D-1.05-4` shipped Home + About with **no photo and no photo slot**. Still blocks any future photo hero / lifestyle imagery. Owner: Vladimir. |
| 7 | **A paused free-tier Supabase project silently pauses pg_cron.** Free projects pause after ~7 quiet days — and this store is quiet between drops **by design**. Paused cron means `expire_reservations` stops running, so lapsed 48h holds never return their stock: **the shirt is sold to nobody, forever.** Moved here from register #4 (it is a standing risk, not a verification debt — the schedule itself is proven live on hosted). | `D-1.04-2/3` · register #4 · `D-1.07-4` | **Live and unmitigated.** No uptime monitor exists (owed: L7). Real fix is Supabase Pro ($25/mo) — a decision and a phase, never a silent upgrade. |
| 8 | **`supabase db reset --linked` wipes the hosted database and cannot rebuild it.** It drops tables/types but not sequences, then fails its own re-apply on `order_number_seq already exists`. Recovered by hand this phase (`drop sequence` → `db push --include-all`) — harmless only because the DB was deliberately empty. | `D-1.07-15` | **Live.** **Never run against a database with real orders — the free tier has no backup.** |
| 9 | **The six Vercel env vars are marked Sensitive = write-only.** `vercel env pull` returns all six as empty strings, so no one can recover a credential from Vercel. The DB password and pepper are **unrecoverable if the password manager and `.env.hosted` are both lost**. | `D-1.07-12` · Cowork report §3.4 | **Live.** Cowork's "cosmetic only, no functional impact" is true for the deployed build, false for anyone working locally. Mitigation: L3. |

---

## Parallel track

Canonical table with gates: `Trajanov-V2-Plan.md` § 13. Status only:

| Task | Owner | Status |
|---|---|---|
| Buy `trajanov.com` | Lazar | Not started |
| **Product photos** | **Vladimir** | **Not started — critical path** |
| Vladimir's email | Lazar → Vladimir | **DONE (2026-07-18).** Address VERIFIED (`facts.md` §5); Z.01 code shipped against it; the operator prereqs are now **live** (Resend account under Vladimir's email + `RESEND_API_KEY`/`ORDER_NOTIFICATION_EMAIL` in Vercel, redeployed) and a real order (`TRJ-0001`) **delivered the MK notification to his inbox** (register #7 cleared, `D-1.08-4`). Still **not** published on Contact (`D-Z.01-3`, placeholder #5). |
| Real prices (MKD) | Vladimir | **This drop: 1199 MKD VERIFIED (2026-07-18)** — recorded in `facts.md` §7 + `src/config/products.ts`. Each future drop still needs its own price. |
| Sizes + fabric (read the labels) | Vladimir | **Sizes VERIFIED (2026-07-18):** S/M/L/XL, off-white XL-only (`facts.md` §7). **Still owed:** fabric/composition/care (from the labels) + a per-size measurement chart. |
| Legal responsibility w/ parents | Vladimir | **Still owed (cutover blocker).** 2.03 shipped Terms + Privacy naming **Vladimir Trajanov, Струмица, alone** as the responsible party (`D-2.03-1`, Lazar's call), with the `facts.md` §1 open flag kept — but no parent has confirmed legal responsibility and **no lawyer has read the pages** (new owed-verification row #9). |
| Model + venue permission | Vladimir | Not started |
| Verify press links | Lazar | **Done** — all 5 fetched, read, VERIFIED 2026-07-15 (`facts.md` §4); cited on About (`D-1.05-5`) |
| First drop date + products | Vladimir | Not started |
| MK copy review | Lazar + Petar | **150 strings DONE (2.02); +63 new legal strings OWED (2.03).** 2.02 was a clean pass on the original 150 (`docs/i18n/mk-review-2.02.md`, both signed). 2.03 added 63 new MK strings (Terms/Privacy/ShippingReturns + Nav/Meta/Placeholder) that **no native speaker has read** — pack **unsigned** at `docs/i18n/mk-review-2.03.md` (owed-verification row #10), verifies before 2.05 cutover. |

---

## Update rules

On closing every phase, Code must:

1. Rewrite **line 1** — `NEXT: <phase id> — <name>`
2. Update Last updated + By
3. Move completed work into **Built**
4. Add every owed item to the **owed-verification register**
5. Add every `[PLACEHOLDER: …]` shipped to the **placeholder register**
6. Record carryovers and new issues
7. Update the parallel-track status if anything landed

**Never delete a register row because it feels resolved. Remove it only when it is verified, and
say so in the completion report.**
