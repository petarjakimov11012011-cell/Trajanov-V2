NEXT: PR #4 fresh-session review (required, D-0-3) before merge → then Part 1 Phase 05

# Current state — Trajanov-V2

**This file is the single source of truth for project status.** The orchestrator reads it before
every brief. Nobody's memory outranks it. Line 1 is always the `NEXT:` line — Code updates it when
closing every phase.

Last updated: **2026-07-15** · By: **Claude Code (Phase 1.04 — drop engine)**

---

## Status

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
| Phase | 1.04 complete — PR open |
| Branch | `phase-1.04-drop-engine` |
| Open PR | `#4` → `main` (1.01 `#1`, 1.02 `#2`, 1.03 `#3` merged) |
| Deployed | nowhere — Supabase runs **local only** (`D-1.03-5`) |
| Domain | `trajanov.com` — **not purchased** |

---

## Stack

**Canonical: `00_stack-and-config.md`.** Not restated here.

Installed and pinned in 1.01 (versions recorded there). Toolchain: Node `v24.17.0`, npm `11.13.0`.
Note: shadcn's default style is Base UI-based (`base-nova`), not Radix — see `D-1.01-1`.

---

## Built

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
| Supabase | **Local only (Docker/Colima)** — schema + `create_order`(+TR006) + `expire_reservations` (pg_cron-scheduled) + rate-limit + RLS + 31 tests. **No hosted project** (1.07). |
| Resend | Not created (1.07) |
| Turnstile | **Real widget + server Siteverify** wired, against Cloudflare **dummy test keys** (`D-1.04-8`); real keys 1.07/2.05 |
| Cloudflare DNS | Not configured |
| Cloudflare Analytics | Not configured |
| Vercel project | Not created |

---

## Owed-verification register

Things claimed done that only Lazar (or a real device / real account) can confirm. **At 3+ items,
or before any phase that builds on unverified work, the next phase is a verification phase.**
**Must be empty before Part 2 — hard gate at 1.08.**

| # | Item | Owed since | Phase that verifies |
|---|---|---|---|
| 1 | **Design direction sign-off.** Palette + fonts were *derived* from the handover ledger, not from a delivered filled `brand.md` (`D-1.02-1`). Lazar must eyeball the rendered site and approve/adjust the tokens. | 1.02 | Lazar review of the live site |
| 2 | **IG profile URL click-test.** `@trajanovv2026` handle is VERIFIED but the URL must be click-tested live before it ships (`facts.md` §6). It appears in the footer + drop-ended banner. | 1.02 | Before cutover (2.05) |
| 3 | **Fresh-session review of PR `#4`** (`D-0-3`). A Claude Code session that did **not** write this code reviews the PR against the 1.04 brief before merge. **A downgrade on a real automated review gate**, not an equal substitute. **Required for 1.04**; must specifically cover the **modified `create_order()` (TR006)** and the **sync's stock behaviour** (`D-1.04-5`). Clears at merge. | 1.04 | Fresh Claude Code session, pre-merge |
| 4 | **Hosted-Supabase parity** (`D-1.03-5`, extended by `D-1.04-1`). Migrations, RLS, real keys, **the pg_cron schedule, and the rate-limit table** are proven only against local Supabase (Colima). A **paused free-tier project silently pauses pg_cron** (reservations stop expiring). Re-confirm all of it on the real project. | 1.03/1.04 | 1.07 (hosted project) |
| 5 | **Real Turnstile keys.** Siteverify is proven only against Cloudflare's **dummy** keys (`D-1.04-8`); "is Cloudflare actually challenging bots" is unanswerable until real keys. Test keys must never reach production. | 1.04 | 1.07 / 2.05 |

*Code verified directly (not owed): `supabase db reset` clean from scratch (incl. a working pg_cron
schedule — `cron.job` shows 2 jobs); `npm run build`, `npx tsc --noEmit`, `npm run lint`, `npm test`
(31) all green; the re-run 10-vs-3 concurrency gate proven (3 succeed, 7 TR004, stock 0); the
sync-never-resets-stock test; the `server-only` guard on `src/lib/drop` proven by a failing build; a
full order placed end-to-end in-browser (Turnstile → Siteverify → rate limit → `create_order`).*

*Register is at **5 items**. **#3 clears at merge** (as 1.03's did — 1.03's PR-#3 review is now
resolved and removed). After merge the register is 4: #1/#2 are 1.02 UI checks 1.05+ does not build
on, and #4/#5 are deferred to 1.07 **by design**. None is shaky work the next phase stands on, but the
count is above the 3-item line — **orchestrator to decide** whether 1.05 absorbs a verification pass.*

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

*All four are now driven by the **DB via the typed drop config** (not `demo.ts`, deleted): a null
`price_mkd`/`name_*` renders the price/name placeholder (`D-1.04-6/10`); photo + fabric/care have **no
DB column yet** (they land with 1.06 photos / a later phase) and render as pure UI placeholders. When
Vladimir supplies real prices/names, filling `src/config/products.ts` + `npm run sync:drop` clears #1
and #4 (for a drop). Sizes for a real drop come from config (the rehearsal's are a flagged sample).
**The register must be empty before cutover (2.05).***

**Already known to be coming** (from `facts.md`, will become entries the moment the relevant page
is built):

- Vladimir's email → Contact page, order emails
- Real prices in MKD → Product pages
- Sizes / measurements → Product pages
- Fabric composition + care → Product pages
- Product photos → Catalog, Product
- 3 unverified press links → About

---

## Carryovers

- **No real product→cart→checkout item flow** (`D-1.04-16`). 1.02 never built cart state, and 1.04 did
  not add it (out of scope). The order Server Action + all its guards are real and tested, and the
  checkout submits a **stand-in** item (the active drop's first in-stock variant). A real cart flow
  (selected product/size/qty flowing to checkout) must be built before a real drop can sell what a
  customer actually chose. Owner: a future phase.

---

## Known issues / accepted risks

| # | Item | Ref | State |
|---|---|---|---|
| 1 | **Vercel Hobby ToS violation.** Commercial use prohibited; Vercel may pull the deployment without notice, explicitly including during traffic spikes — i.e. drop day. Accepted by Lazar. | `D-0-2` | Live. Mitigations: portability rule, pre-written Pro migration (X.01), 2.06 contingency. |
| 2 | **No automated PR review.** House review gate waived for this project. Risk concentrated on 1.03/1.04 concurrency code. | `D-0-3` | Live. Mitigations: cross-review, fresh-session review on 1.03/1.04, concurrent-order test. |
| 3 | **Public repo.** One committed secret is scraped before you notice. | `D-0-1` | Live. Mitigation: hard rule in `CLAUDE.md`. Rotate, never just delete. |
| 4 | **Legal responsibility unconfirmed.** Minor, no registered entity, collecting consumer PII. | `facts.md` § 1 | **Cutover blocker.** Owner: Vladimir + parents. |
| 5 | **Product photos do not exist.** | `D-0-6` | **Blocks 1.06.** Owner: Vladimir. Critical path. |
| 6 | **Bar photos: model + venue permission unconfirmed**, and age-appropriateness of an alcohol backdrop for a 12+ audience is an open owner call. | `facts.md` § 8 | Blocks 1.05 hero. Owner: Vladimir. |

---

## Parallel track

Canonical table with gates: `Trajanov-V2-Plan.md` § 13. Status only:

| Task | Owner | Status |
|---|---|---|
| Buy `trajanov.com` | Lazar | Not started |
| **Product photos** | **Vladimir** | **Not started — critical path** |
| Vladimir's email | Lazar → Vladimir | Not started |
| Real prices (MKD) | Vladimir | Not started |
| Sizes + fabric (read the labels) | Vladimir | Not started |
| Legal responsibility w/ parents | Vladimir | Not started |
| Model + venue permission | Vladimir | Not started |
| Verify 3 press links | Lazar | Not started |
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
