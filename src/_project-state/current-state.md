NEXT: Z.01 — Order email (Resend), BLOCKED on Vladimir's email address (facts.md §5) → then 1.08 Verification gate. 1.08 CANNOT START until Z.01 ships (D-1.07-8): its DoD is a real order with a real email, end to end.

# Current state — Trajanov-V2

**This file is the single source of truth for project status.** The orchestrator reads it before
every brief. Nobody's memory outranks it. Line 1 is always the `NEXT:` line — Code updates it when
closing every phase.

Last updated: **2026-07-16** · By: **Claude Code (Phase 1.07 Code — deployed, hosted parity proven, real Turnstile live)**

---

## Status

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

**Resend is GONE from 1.07 (`D-1.07-8`)** — struck entirely, no key, no code, no stub. Order email is
now on-demand phase **`Z.01`**, **mandatory before 1.08**, triggered by Vladimir's email address
arriving. **The critical path now runs through a phone call nobody has made.**

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
| Part | 1 of 2 — Build |
| Phase | **1.07 complete (both halves)** — Cowork (accounts) + Code (deploy, hosted parity, real keys). Next: `Z.01` (blocked), then the 1.08 gate |
| Branch | `phase-1.07-deploy` → PR `#7` to `main` |
| Open PR | **`#7`** — no fresh-session review required (that gate is 1.03/1.04 only, `D-0-3`); Petar or Lazar cross-reviews. **Production already serves this commit** (`D-1.07-5`), so the merge is a redeploy of the same code |
| Deployed | **YES — https://trajanov-v2.vercel.app**, production, serving `/` (MK) + `/en` from the hosted Frankfurt DB. Deployed from the phase branch via `npx vercel --prod` **before** merge (`D-1.07-5`). `D-1.03-5` and `D-1.06-4` are closed |
| Domain | `trajanov.com` — **not purchased** (2.05) |

---

## Stack

**Canonical: `00_stack-and-config.md`.** Not restated here.

Installed and pinned in 1.01 (versions recorded there). Toolchain: Node `v24.17.0`, npm `11.13.0`.
Note: shadcn's default style is Base UI-based (`base-nova`), not Radix — see `D-1.01-1`.

---

## Built

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
| Resend | **NOT in this project yet — struck from 1.07 entirely (`D-1.07-8`).** No account, no `RESEND_API_KEY`, no `ORDER_NOTIFICATION_EMAIL`, no code, no stub. Now on-demand **`Z.01`**, **mandatory before 1.08**, blocked on Vladimir's email (`facts.md` §5; placeholder #5). |
| Turnstile | **REAL KEYS LIVE IN PRODUCTION** (1.07 Code) — "Trajanov store", **Managed** (`D-1.07-2`), hostnames `trajanov-v2.vercel.app` + `localhost` only (`D-1.07-6`). Deployed `/checkout` serves `0x4AAAAAAD23OFW7Ka1hTR1F`; **no dummy key anywhere in the deployed build** (`D-1.04-8` superseded). Widget **solves on the production hostname**; real token + real secret → Siteverify **`success: true`**. **Owed #5 NARROWED** — bot-vs-real-order still owed to 1.08 (`D-1.07-7`). |
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
| 1 | **Design direction sign-off.** Palette + fonts were *derived* from the handover ledger, not from a delivered filled `brand.md` (`D-1.02-1`). Lazar must eyeball the rendered site (now incl. `/about`, `/contact`) and approve/adjust the tokens. **Merge blocker on 1.05** (`D-1.05-2`). | 1.02 | Lazar review of the live site |
| 2 | **IG profile URL click-test.** `@trajanovv2026` handle is VERIFIED and the URL renders/links correctly (verified in-browser this phase: footer, drop-ended banner, **and now Contact**), but a human must click it and confirm it opens **Vladimir's actual profile** (`facts.md` §6). **Merge blocker on 1.05** (`D-1.05-2`). | 1.02 | Lazar click-test, pre-merge |
| ~~4~~ | ~~**Hosted-Supabase parity**~~ — **CLOSED by 1.07 Code, with evidence.** 8/8 migrations pushed to `kmuocwmevyyuhcvwoebf`; `migration list` shows local == remote, **no migration edited to force it**. **`npm test` against Frankfurt: 46/46**, incl. the **10-vs-3 oversell gate (exactly 3 succeed, 7 rejected, stock 0)** and both expiry tests. `cron.job` = **2 active rows**, extension created **by the migration, no dashboard step**. Rate-limit table + `check_order_rate_limit` present and exercised (20/21 test passed on hosted). RLS re-verified with the **real anon key**: `orders`/`order_items` deny select/insert/update (`42501`); functions `anon=false`, identical to local. Hosted then **reset and verified clean** (0 rows, TRJ-0001). **One real divergence was found and fixed, not waved through** (`D-1.07-14`). **Residual risk, NOT a verification debt — moved to Known issues #7:** a **paused free-tier project silently pauses pg_cron**, and reservations stop expiring. | 1.03/1.04 | **1.07 Code — DONE** |
| 5 | **Real Turnstile keys — NARROWED, still open** (`D-1.07-7`). **Proven in 1.07 Code:** the deployed `/checkout` serves the **real** site key `0x4AAAAAAD23OFW7Ka1hTR1F`; **no dummy key appears anywhere in the deployed build** (961 KB of JS + HTML scanned) — `D-1.04-8`'s "dummy keys until 1.07" is fully retired; the widget **renders and solves in Managed mode on `trajanov-v2.vercel.app`**, and a **real token + the real secret** returned Siteverify **`success: true, hostname: trajanov-v2.vercel.app`** (a wrong-secret control returned `invalid-input-secret`, so the pass is meaningful); Managed mode's silent auto-pass **matches** the local dummy-key behaviour (`D-1.07-2` confirmed). **STILL OWED:** whether Cloudflare actually **challenges a bot on a real order**. That needs a **live drop**, which 1.07 deliberately does not create (the only drop is `test-drop`, ended + null-priced, `D-1.04-12`). Also unexercisable on preview URLs at all (`D-1.07-6`). | 1.04 | **1.08** (needs a live drop + a real order) |
| 6 | **"Automatically expose new tables" is still ON** on the hosted project (`D-1.07-3`). `D-1.07-14` revoked the write grants on today's catalog tables, but **any table added in future** (e.g. `Y.01`'s photo/fabric work) will again be created with `anon` holding INSERT/UPDATE/DELETE/TRUNCATE, protected by RLS alone. Turning the toggle off does **not** retroactively revoke, so it must be paired with an explicit REVOKE in whatever migration adds the table. | 1.07 | Lazar (dashboard) + the next migration that adds a table |

*Code verified directly (not owed) in 1.06 — carried forward; the 1.07 Cowork half is ops-only and
verified no code directly: `npm run build`, `npx tsc --noEmit`, `npm run lint`,
`npm test` (**46**) all green, incl. the re-run 10-vs-3 oversell gate; the phase test was confirmed to
**fail against the stand-in** (RED captured) before the stand-in was deleted; `/catalog`,
`/catalog/[slug]`, `/cart`, `/checkout` rendered in-browser at 390px + 1180px, both locales, against
the 1.02 handover; the cart writes to **no** DB table and reserves no stock (verified by reading — no
cart code path touches `variants`/`orders`/`order_items`); the stand-in grep returns nothing; no
`supabase/migrations/` file and neither `create_order` nor `expire_reservations` changed; no new
dependency (`package.json` unchanged). (Prior direct-verified items carry forward unchanged.)*

*Register is at **4 open items** (#1, #2, #5, #6) after 1.07 Code. **#4 (hosted-Supabase parity) is
CLOSED** — struck above with its evidence rather than deleted, per the rule. **#5 is NARROWED, not
closed** (`D-1.07-7`): 1.07 proved the real key is served and the real secret validates a real token,
but "does Cloudflare challenge a **bot** on a **real order**" needs a live drop and belongs to 1.08.
**#6 is NEW this phase** — the auto-expose toggle, surfaced by `D-1.07-14`'s finding. Item #3 (fresh-
session review of PR `#4`) was removed at the PR-#4 merge; the old #6 (fresh-session review of PR
`#6`, `D-1.06-2`) was **WAIVED** (`D-1.06-11`), not verified, and removed with a note — **the new #6
is a different item and reuses the number**; numbers are not otherwise renumbered (keeps `D-1.05-2`'s
references valid). **#1 (design sign-off) and #2 (IG click-test)** were merge blockers on 1.05
(`D-1.05-2`); **PR `#5` has since merged**, so they were either satisfied at that merge or this file is
stale — Lazar to confirm and clear (not removed here — this session did not perform them). **1.08
remains the hard gate — the register must be empty before Part 2, and #1, #2, #5 and #6 all sit in
front of it.***

**Owed to Lazar / the operator — dashboard + password-manager jobs only he can do:**

| # | Item | What "pass" looks like |
|---|---|---|
| L1 | **Delete the stray Stockholm Supabase project.** **Confirmed still live this phase**: ref `ewcqwbuvbbfduytiiaxy`, region `eu-north-1`, name "petarjakimov11012011-cell's Project", status ACTIVE_HEALTHY, empty. | Only `kmuocwmevyyuhcvwoebf` (Frankfurt) remains in the Supabase account |
| L2 | **Review/remove the stray `trajanov` Vercel project.** Confirmed still present alongside `trajanov-v2`. | Exactly one Vercel project points at this repo, so one push cannot trigger two deployments |
| L3 | **SAVE THE NEW DB PASSWORD — CHANGED THIS PHASE (`D-1.07-12`).** The password manager's entry is **stale and wrong**: the DB password was **reset** at the operator's instruction. The new value exists **only** in gitignored `.env.hosted` on Petar's machine. **Unrecoverable if that file is lost** (another reset would be needed). Also confirm `ORDER_IP_HASH_PEPPER` is saved — the **Vercel** value must never change or every rate-limit window resets (`D-1.04-7`). | Both retrievable from the password manager, and the DB password matches `.env.hosted` |
| L4 | **Revoke the Supabase access token `claude-code-phase-1.07`** (Account → Access Tokens; expires 2026-08-15). It controls the **whole Supabase account** and was only needed for `link`/`db push`/`gen types --linked`. | Token no longer listed |
| L5 | **Turn OFF "Automatically expose new tables"** on `kmuocwmevyyuhcvwoebf` (register #6). Does not retroactively revoke — pair with an explicit REVOKE in any migration that adds a table. | Toggle off; next new table is not anon-writable |
| L6 | **Register #1 (design sign-off) and #2 (Instagram URL click-test)** — owed since 1.02. **1.08 cannot pass while they sit.** The site is now on a public URL, so both are finally doable: `https://trajanov-v2.vercel.app`. | Both confirmed or cleared |
| L7 | **Uptime monitor** — a paused free-tier project silently pauses pg_cron and takes the store offline (Known issues #7). Not set up this phase (out of scope). | A monitor hits the URL ≥ every 5 min, alerting two inboxes |

---

## Placeholder register

Every visible `[PLACEHOLDER: …]` on the site. **Must be empty before cutover (2.05). Launch
blocker.**

| # | Placeholder | Page | Waiting on | Owner |
|---|---|---|---|---|
| 1 | `[PLACEHOLDER: цена MKD]` (product price) | Catalog cards, Product, Cart, Checkout | Real MKD prices per drop | Vladimir |
| 2 | `[PLACEHOLDER: фотографија — Владимир]` (product photo) | Catalog cards, Product | Real product photos (`D-0-6`) | Vladimir |
| 3 | `[PLACEHOLDER: состав и нега — од етикетата]` (fabric/care) | Product | Composition from the labels | Vladimir |
| 4 | Product **names** render as neutral slots ("Производ 01…"); sizes shown are a flagged **sample** | Catalog, Product | Real names + sizes/measurements | Vladimir |
| 5 | `[PLACEHOLDER: е-пошта — Владимир]` (contact email) | **Contact** (1.05) — **now live at `https://trajanov-v2.vercel.app/contact`** | Vladimir's email (`facts.md` §5). **Also the trigger for `Z.01`, which is mandatory before the 1.08 gate (`D-1.07-8`)** — this row is no longer just a UI placeholder, it is on the critical path | Lazar → Vladimir |

*#5 (email) is a pure UI placeholder via `<Placeholder>` (`Placeholder.email` key), shipped by 1.05
(`D-1.05-3`) — and it now **gates `Z.01`, which gates the 1.08 verification gate** (`D-1.07-8`;
formerly "Phase 1.08" here, corrected: Resend was struck from 1.07 and is not built by 1.08 either,
because a gate that builds the feature it verifies is not a gate). **Every placeholder below is now
publicly visible on `https://trajanov-v2.vercel.app`.**
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

- **`Z.01 — Order email (Resend)` is now a hard dependency of the 1.08 gate** (`D-1.07-8`). 1.07
  shipped **without** Resend — no account, no key, no code, no stub. `Z.01` is triggered by Vladimir's
  email address arriving (`facts.md` §5; placeholder register #5) and is **mandatory before 1.08**,
  whose DoD is a real order with a real email end to end. **Nobody has made that phone call.** This is
  the single thing standing between a deployed store and the gate.
- **1.08 also needs a live drop.** Owed #5's remainder (does Cloudflare challenge a real bot) and
  1.08's own "one real order" DoD both require an **open, priced** drop. The only committed drop is
  `test-drop` — ended and null-priced (`D-1.04-12`) — and creating a live one was **out of scope** for
  1.07. Prices/names come from Vladimir via `Y.01`.
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
| 4 | **Legal responsibility unconfirmed.** Minor, no registered entity, collecting consumer PII. | `facts.md` § 1 | **Cutover blocker.** Owner: Vladimir + parents. |
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
| Vladimir's email | Lazar → Vladimir | **Not started — NOW THE CRITICAL PATH.** Triggers `Z.01` (`D-1.07-8`), which is mandatory before the 1.08 gate. Everything else in Part 1 is done and deployed; this is the blocker. |
| Real prices (MKD) | Vladimir | Not started |
| Sizes + fabric (read the labels) | Vladimir | Not started |
| Legal responsibility w/ parents | Vladimir | Not started |
| Model + venue permission | Vladimir | Not started |
| Verify press links | Lazar | **Done** — all 5 fetched, read, VERIFIED 2026-07-15 (`facts.md` §4); cited on About (`D-1.05-5`) |
| First drop date + products | Vladimir | Not started |
| MK copy review | Lazar + Petar | Scheduled — Phase 2.02 |

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
