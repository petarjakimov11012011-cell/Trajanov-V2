# File map — Trajanov-V2

**What lives where, and why.** Read this before creating a file — so the same thing does not get
built twice in two places under two names.

Updated by Code on every phase that adds, moves, or deletes a file. **A file map that lies is worse
than no file map.**

Last updated: **2026-07-18** · By: **Claude Code (Phase 1.08 — Verification gate, Code half)**

---

## Status

**Order email landed (Phase Z.01).** The reserved-and-empty `src/lib/email/` is now populated:
`order-notification.ts` (a pure MK composer + a best-effort Resend sender that never throws and bounds
itself). It is fired from the order path via an injected `notifyOrder` dep on `processOrder`, wired in
`actions.ts` (which also does the best-effort variant→product/size lookup). New test dir `tests/email/`.
New dep `resend 6.17.2`. `Order.success` copy extended (COD + call-to-confirm, both locales). **No
`supabase/migrations/` file, `create_order`, or `expire_reservations` touched.** See the 1.06/1.05/1.04
notes below.

**Cart flow landed (Phase 1.06).** New: `src/lib/cart/cart.ts` (pure reducer + 2-unit cap),
`src/components/cart/cart-store.ts` (sessionStorage `useSyncExternalStore`), and
`src/components/product/AddToCartPanel.tsx` (size → variant → add). `SizePicker`/`BuyButton` are now
wire-able; `CartView`, `checkout/CheckoutForm`, the cart/checkout pages read real cart state. The
`getActiveOrderContext` **stand-in** was deleted from `src/lib/drop/state.ts` (which now exposes
`variantId`/`dropSlug`); `processOrder` gained an empty-cart guard. Tests: `tests/cart/cart.test.ts`
and `tests/orders/checkout-items.test.ts` (+ empty-cart case). `seed.sql` gained a second product.
**No new dependency; no `supabase/migrations/` file touched.** See the 1.05/1.04 notes below.

**Drop engine landed (Phase 1.04).** The catalogue, countdown, and buy path are now driven by the
**database, on the server** — `src/lib/demo.ts` is deleted. The tree below is the real on-disk
structure. Notes:

- **Typed drop config in `src/config/`** (`D-0-4`): `schema.ts` (types + validators + constants),
  `time.ts` (DST-aware Europe/Skopje resolver), `drops.ts` (schedule) + `products.ts` (catalogue),
  `index.ts` (join). Committed rehearsal: one **ended** `test-drop`, now **priced 1199 MKD** with real sizes
  (two verified colourways: `test-mustard-ochre` S/M/L/XL, `test-off-white` XL-only; names still placeholder)
  as the 1.08 machinery-verification stand-in (`D-1.04-12`, `D-1.08-1`).
- **Config→DB sync** at `scripts/{sync-core.ts,sync-drop.ts}` — `npm run sync:drop`, a direct
  Postgres admin tool (`D-1.04-11`), not runtime code.
- **Server-only drop state** `src/lib/drop/state.ts` (`import "server-only"`, proven a client-import
  build error). **`src/lib/orders/`**: `process-order.ts` (testable pipeline core), `actions.ts`
  (`placeOrder` Server Action), `phone.ts`. **`src/lib/rate-limit/`**: `hash.ts` (pure, testable) +
  `ip.ts` (server-only). **`src/lib/turnstile/verify.ts`** (server-only Siteverify).
  **`src/lib/{social,format}.ts`** (facts-backed IG constants moved off `demo.ts`; MKD formatter).
- **UI now reads real data** (same components, same handover): home/catalog/product/checkout are
  `force-dynamic` (`D-1.04-9`). New `src/components/checkout/Turnstile.tsx` (real widget, replaces
  `TurnstilePlaceholder.tsx`, deleted) and `src/components/system/DevPreviewSwitch.tsx` (dev-only
  `?preview` state switch replacing the 1.02 client switcher, `D-1.04-13`).
- **4 migrations** under `supabase/migrations/` (price/name nullable, `create_order` `TR006`,
  rate-limit table + fn, `pg_cron`). **6 new test files** under `tests/{config,orders}/`.
- **`.gitkeep` removed** from now-populated dirs: `src/config`, `src/lib/drop`, `src/lib/rate-limit`.
- **Still reserved and empty** (`.gitkeep`): `src/components/ui`. (`src/lib/email` was populated in Z.01.)
- Carried from 1.02/1.03: route folders (non-localised slugs, `D-1.02-4`), component dirs, the typed
  Supabase clients + `order-errors.ts`, the test harness. The Phase 1.02 handover is at
  `docs/design-handovers/Part-1-Phase-02-Handover.md`.

Carried from 1.01: `src/i18n/` (routing/request/navigation) and `src/proxy.ts` (`D-1.01-2`).

---

## Reserved paths — created in 1.01, never moved

| Path | Purpose |
|---|---|
| `briefs/` | Every phase brief, saved by Lazar. Versioned history of instructions. |
| `docs/design-handovers/` | Design handovers. Code reads the matching one before any UI work. |
| `src/_project-state/` | `current-state.md`, `file-map.md`, `00_stack-and-config.md`, `completions/` |
| `facts.md` | Verified business facts — **only source** (root) |
| `brand.md` | Design tokens — **only source** (root) |
| `Decisions.md` | Append-only decision log (root) |
| `CLAUDE.md` | Code's standing rules (root) |
| `Trajanov-V2-Plan.md` | Aspirational build plan (root). Live code wins on conflict. Committed 1.05 (`D-1.05-1`). |
| `Trajanov-V2-Phase-Plan.md` | Phase-by-phase plan (root). Live status lives in `current-state.md`. Committed 1.05 (`D-1.05-1`). |

---

## On-disk tree (real — Phase 1.01)

`node_modules/`, `.next/`, and `.DS_Store` are omitted (installed / build artifacts / gitignored).

```
Trajanov-V2/
├── CLAUDE.md                       # Code's standing rules
├── facts.md                        # verified facts — only source
├── brand.md                        # design tokens — only source (SEED — filled 1.02)
├── Decisions.md                    # append-only decision log
├── Trajanov-V2-Plan.md             # aspirational build plan (root, committed 1.05) — live code wins
├── Trajanov-V2-Phase-Plan.md       # phase-by-phase plan (root, committed 1.05) — status in current-state.md
├── README.md                       # short. points at the docs. no spec.
├── .env.example                    # KEY NAMES ONLY — never values
├── .gitignore                      # covers .env* (with !.env.example) — verified in 1.01
├── components.json                 # shadcn/ui config
├── next.config.ts                  # wrapped with next-intl plugin
├── postcss.config.mjs              # Tailwind v4
├── eslint.config.mjs               # ESLint flat config
├── tsconfig.json                   # @/* → ./src/*
├── next-env.d.ts                   # Next types (gitignored, generated)
├── package.json                    # name: trajanov-v2
├── package-lock.json
│
├── briefs/
│   └── Part-1-Phase-01-Code.md     # this phase's brief
├── docs/
│   └── design-handovers/
│       └── Part-1-Phase-02-Handover.md  # current UI spec — read before UI work
│
├── src/
│   ├── _project-state/
│   │   ├── current-state.md         # NEXT line first. registers.
│   │   ├── file-map.md              # this file
│   │   ├── 00_stack-and-config.md   # stack, pins, env var NAMES
│   │   └── completions/
│   │       └── _TEMPLATE.md         # completion-report template
│   │
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css              # brand.md tokens + shadcn semantic map (dark-only)
│   │   └── [locale]/               # mk (default, /) | en (/en/)
│   │       ├── layout.tsx           # <html>, Rubik+Inter fonts, header/footer, provider
│   │       ├── page.tsx             # home → HomeExperience (countdown / LIVE) + Home→About link (1.05)
│   │       ├── about/page.tsx       # STATIC — press story, facts.md §3/§4; setRequestLocale (1.05)
│   │       ├── contact/page.tsx     # STATIC — phone/IG + email placeholder, no form/address (1.05)
│   │       ├── catalog/page.tsx     # drop grid
│   │       ├── catalog/[slug]/page.tsx  # product page
│   │       ├── cart/page.tsx        # cart at 2-unit cap
│   │       ├── checkout/page.tsx    # one-screen checkout
│   │       └── styleguide/page.tsx  # component-state strip (review aid)
│   │
│   ├── i18n/                        # next-intl config (added 1.01)
│   │   ├── routing.ts               # locales, defaultLocale, as-needed prefix
│   │   ├── request.ts               # getRequestConfig → messages
│   │   └── navigation.ts            # locale-aware Link/redirect/…
│   │
│   ├── proxy.ts                     # next-intl request handler (D-1.01-2)
│   │
│   ├── components/                  # one component per file, PascalCase
│   │   ├── ui/                     # .gitkeep — shadcn-reserved, still empty
│   │   ├── drop/                   # Countdown, DropBanner, StockBadge
│   │   ├── product/                # ProductCard, BuyButton, SizePicker, AddToCartPanel (add-to-cart, 1.06)
│   │   ├── cart/                   # CartView, cart-store (sessionStorage useSyncExternalStore, 1.06)
│   │   ├── checkout/               # CheckoutField, CheckoutForm, Turnstile (real widget, 1.04)
│   │   ├── layout/                 # SiteHeader, SiteFooter, LanguageSwitch
│   │   ├── home/                   # HomeExperience (props-driven from server drop state, 1.04)
│   │   └── system/                 # Placeholder, PhotoSlot, PreviewNotice, DevPreviewSwitch (1.04)
│   │
│   ├── lib/
│   │   ├── utils.ts                 # cn() — shadcn helper
│   │   ├── social.ts                # facts-backed public contact constants: IG handle/URL + phone (1.04/1.05)
│   │   ├── format.ts                # formatMkd() price formatter (1.04)
│   │   ├── cart/
│   │   │   └── cart.ts              # PURE cart reducer + 2-unit cap + toOrderItems (React-free, testable, 1.06)
│   │   ├── supabase/
│   │   │   ├── client.ts            # browser client, anon key (1.03)
│   │   │   └── server.ts            # server client, service role — `import "server-only"` (1.03)
│   │   ├── drop/
│   │   │   └── state.ts             # SERVER-ONLY drop state + product mapping incl. variantId/dropSlug (1.04; stand-in order context removed 1.06)
│   │   ├── orders/
│   │   │   ├── order-errors.ts      # create_order() SQLSTATE → identifier vocabulary (1.03, +TR006)
│   │   │   ├── process-order.ts     # testable order pipeline core (turnstile→ratelimit→create_order)
│   │   │   ├── actions.ts           # "use server" placeOrder Server Action (1.04)
│   │   │   └── phone.ts             # MK phone → +389######## normaliser (1.04)
│   │   ├── rate-limit/
│   │   │   ├── hash.ts              # pure peppered SHA-256 IP hash — testable (1.04)
│   │   │   └── ip.ts                # server-only rate-limit RPC call (1.04)
│   │   ├── turnstile/
│   │   │   └── verify.ts            # server-only Cloudflare Siteverify (1.04)
│   │   └── email/                  # Resend side channel — order notification (Z.01)
│   │       └── order-notification.ts # MK composer + best-effort sender; never throws, bounded (Z.01)
│   │
│   ├── config/                     # typed drop config (1.04, D-0-4)
│   │   ├── schema.ts                # DropConfig/ProductConfig types + validators + constants
│   │   ├── time.ts                  # Europe/Skopje wall-clock → UTC instant, DST-aware (D-1.04-4)
│   │   ├── drops.ts                 # the schedule — the switch Lazar flips
│   │   ├── products.ts              # the catalogue — prices, names, stock
│   │   └── index.ts                 # joins drops+products; re-exports config surface
│   │
│   ├── messages/
│   │   ├── mk.json                  # default language — UI strings + About/Contact namespaces (1.05)
│   │   └── en.json                  # EN parity (identical key sets — verified)
│   │
│   └── types/
│       ├── drop.ts                  # DropState, StockLevel, ProductView/SizeOption (1.04; demo shapes retired)
│       └── database.ts              # GENERATED from local DB — `npm run gen:types` (1.03, regen 1.04)
│
├── public/
│   └── images/
│       ├── products/               # .gitkeep — REAL photos only — D-0-6
│       └── lifestyle/              # .gitkeep — the bar shoot — pending permissions
│
├── supabase/                       # LOCAL ONLY — no hosted project until 1.07 (D-1.03-5)
│   ├── config.toml                 # `supabase init`; trimmed stack for 8 GB host (D-1.03-10)
│   ├── .gitignore                  # created by `supabase init`
│   ├── seed.sql                    # dev/test fixtures — `test-` slugs, stock=3 target; 2 products in test-open-drop (test-tee-two added 1.06, D-1.06-9)
│   └── migrations/
│       ├── 20260715021215_schema.sql              # 5 tables, constraints, indexes, enum, RLS, grants
│       ├── 20260715021216_create_order.sql        # atomic conditional decrement — the heart
│       ├── 20260715021217_expire_reservations.sql # idempotent hold-release sweep
│       ├── 20260715120000_price_name_nullable.sql # products.price_mkd/name_* nullable (D-1.04-6/10)
│       ├── 20260715120001_create_order_tr006.sql  # +TR006 price_missing before any decrement
│       ├── 20260715120002_rate_limit.sql          # drops.rate_limit col + order_attempts + fn (D-1.04-7)
│       ├── 20260715120003_pg_cron.sql             # enable pg_cron; sweep + run-log prune (D-1.04-2/3)
│       └── 20260716120000_catalog_grant_hardening.sql # REVOKE anon writes on catalog (D-1.07-14)
│
├── scripts/                        # operator tooling (1.04) — direct-Postgres, not runtime code
│   ├── sync-core.ts                # config→DB sync logic (testable): idempotent, stock insert-only
│   └── sync-drop.ts                # `npm run sync:drop` CLI wrapper (tsx)
│
├── tests/                          # Vitest — DB integration; need a live local stack (D-1.03-12)
│   ├── setup.ts                    # loads .env.local (Node 24 process.loadEnvFile)
│   ├── helpers/db.ts               # anon/service supabase-js clients + direct pg admin conn
│   ├── cart/
│   │   └── cart.test.ts            # PURE cart reducer: choice recorded, 2-unit cap, toOrderItems boundary (1.06)
│   ├── email/
│   │   └── order-notification.test.ts # Z.01 sender — Resend MOCKED, no DB: sends once/right fields, throw+missing-env degrade, no PII in logs
│   ├── concurrency/
│   │   ├── oversell.test.ts        # 10 orders / 3 units → exactly 3 succeed, 7 insufficient_stock
│   │   └── expiry.test.ts          # stock returned exactly once, incl. 2 concurrent sweeps
│   ├── config/
│   │   ├── time.test.ts            # DST resolver — summer 18:00Z + winter 19:00Z (D-1.04-4)
│   │   ├── sync.test.ts            # no-reset-stock, idempotent, refuses null price / price-after-open
│   │   └── cron.test.ts            # both pg_cron jobs scheduled + active from db reset
│   ├── rls/anon-access.test.ts     # anon wall: orders unreadable, variants readable, no writes/rpc
│   └── orders/
│       ├── create-order.test.ts    # happy path, drop window (D-1.03-7), full error vocabulary
│       ├── checkout-items.test.ts  # cart→create_order: chosen variant reaches order_items, 2-items, cap, TR004 (1.06)
│       ├── price-missing.test.ts   # TR006 rejects null price, no decrement (D-1.04-6)
│       ├── rate-limit.test.ts      # 20 ok / 21st rejected; stored value is a hash, not an IP
│       └── process-order.test.ts   # turnstile/ratelimit/empty-cart gate create_order (Task 6, +empty 1.06, +Z.01 notify-after-success)
```

Root additions (1.03): `vitest.config.ts` (serial file execution — one shared local DB).
`.env.local` (gitignored) holds the local Supabase URL/keys + `SUPABASE_DB_URL`.

---

## Rules

- **One component per file**, PascalCase, in `src/components/`.
- **`src/lib/drop/` and `src/lib/orders/` are server-only.** Drop state and stock must never be
  computed or trusted client-side. A client clock is a suggestion; a client stock count is a lie
  waiting to happen.
- **`SUPABASE_SERVICE_ROLE_KEY` is server-only.** Never behind `NEXT_PUBLIC_`.
- **`src/components/ui/` is shadcn-generated.** Don't hand-edit; re-generate.
- **`public/images/products/` holds real photographs only** (`D-0-6`).
- **Never hardcode a colour, size, or spacing value.** `brand.md` → tokens → Tailwind config.
- **Never hardcode a factual claim.** `facts.md` or `[PLACEHOLDER: …]` + register entry.
- **Never hardcode a user-facing string.** `src/messages/`.

---

## Update rules

On every phase that adds, moves, or deletes a file:

1. Update the tree to **what is actually on disk** — not what the brief intended
2. Update Last updated + By
3. Note anything that moved, and why, in the completion report

**If the tree and the disk disagree, the map is broken.** Fix it in the same PR.

---

## Change log

| Date | Phase | Change | By |
|---|---|---|---|
| 2026-07-14 | — | Template seeded at kickoff. Nothing built. | Claude Chat |
| 2026-07-14 | 1.01 | Replaced the intended tree with the real on-disk tree. Scaffolded Next.js/TS/Tailwind/shadcn/next-intl. Added `src/i18n/` + `src/proxy.ts` (not in the kickoff sketch). Route folders deferred to 2.01. | Claude Code |
| 2026-07-15 | 1.02 | Added routes (`catalog`, `catalog/[slug]`, `cart`, `checkout`, `styleguide`), component dirs `{system,cart,checkout,layout,home}`, `lib/demo.ts`, `types/drop.ts`, and the committed handover. Filled `globals.css` from `brand.md`; loaded Rubik+Inter. Non-localised slugs (2.01 localises). `D-1.02-4/5/6`. | Claude Code |
| 2026-07-15 | 1.03 | Added `supabase/` (config.toml, seed.sql, 3 migrations), `src/lib/supabase/{client,server}.ts`, `src/lib/orders/order-errors.ts`, `src/types/database.ts` (generated), `tests/` suites + `tests/{setup.ts,helpers/db.ts}`, `vitest.config.ts`. Removed now-stale `.gitkeep` from `supabase/migrations`, `tests/concurrency`, `src/lib/{supabase,orders}`, `src/types`. **Zero change under `src/app`/`src/components`/`src/messages`.** `D-1.03-*`. | Claude Code |
| 2026-07-15 | 1.05 | Added `src/app/[locale]/{about,contact}/page.tsx` (both STATIC via `setRequestLocale`). Added `Trajanov-V2-Plan.md` + `Trajanov-V2-Phase-Plan.md` at root (operator-committed, `D-1.05-1`) + to reserved paths. Extended `src/lib/social.ts` (phone constants). Modified `SiteFooter.tsx` (About/Contact links + translated location + phone import), `HomeExperience.tsx` (Home→About link in countdown/ended), `src/messages/{mk,en}.json` (About/Contact/Nav/Placeholder keys), `completions/_TEMPLATE.md` (filename fix). **No `src/lib/{drop,orders}`, `src/config/`, `supabase/`, `tests/` change.** `D-1.05-*`. | Claude Code |
| 2026-07-15 | 1.04 | Added `src/config/` (5 files), `src/lib/drop/state.ts`, `src/lib/orders/{process-order,actions,phone}.ts`, `src/lib/rate-limit/{hash,ip}.ts`, `src/lib/turnstile/verify.ts`, `src/lib/{social,format}.ts`, `scripts/{sync-core,sync-drop}.ts`, 4 migrations, `src/components/checkout/Turnstile.tsx`, `src/components/system/DevPreviewSwitch.tsx`, 6 test files under `tests/{config,orders}/`. **Deleted** `src/lib/demo.ts` and `src/components/checkout/TurnstilePlaceholder.tsx`. Rewired `src/app/[locale]/{page,catalog,catalog/[slug],checkout,styleguide}` + several components to real DB data. Removed `.gitkeep` from `src/config`, `src/lib/{drop,rate-limit}`. `D-1.04-*`. | Claude Code |
| 2026-07-18 | Z.01 | Added `src/lib/email/order-notification.ts` (composer + best-effort Resend sender) and `tests/email/order-notification.test.ts` (Resend mocked). Removed `.gitkeep` from now-populated `src/lib/email`. Modified `src/lib/orders/process-order.ts` (optional `notifyOrder` dep, awaited best-effort after success), `src/lib/orders/actions.ts` (enrichment + wire the sender), `src/messages/{mk,en}.json` (`Order.success` copy), `tests/orders/process-order.test.ts` (+4 notify cases). Added dep `resend 6.17.2`. **No `supabase/migrations/`, `src/app`, or component file touched; `create_order`/`expire_reservations` unchanged.** `D-Z.01-1…7`. | Claude Code |
| 2026-07-16 | 1.07 (Code) | Added **one migration** `supabase/migrations/20260716120000_catalog_grant_hardening.sql` (REVOKE anon/authenticated/public write privileges on `drops`/`products`/`variants` — closes the hosted-only grants gap, `D-1.07-14`) and `briefs/Part-1-Phase-07-Code.md`. Modified `Trajanov-V2-Phase-Plan.md` (Resend struck from 1.07, `Z.01` added + on the critical path), `src/_project-state/00_stack-and-config.md` (Pinned corrections + appended change-log row), `Decisions.md` (`D-1.07-4`…`D-1.07-15`), `current-state.md`. **No `src/` application code, no component, no message-catalog, no test file, and no existing migration changed. `create_order`/`expire_reservations` untouched. No new npm dependency.** New untracked local files (gitignored, never committed): `.env.hosted` (`D-1.07-9`), `.vercel/`. | Claude Code |
| 2026-07-18 | 1.08 (Code) | **No new source files.** Modified `facts.md` §7 (real price 1199 MKD + sizes VERIFIED), `src/config/products.ts` (rehearsal now priced 1199 MKD; two verified colourways `test-mustard-ochre` S/M/L/XL + `test-off-white` XL-only; names still null), `src/config/drops.ts` (rehearsal comment), `Decisions.md` (`D-1.08-1/2/3`), `current-state.md`, `file-map.md`. Added root docs `Part-1-Phase-08-Operator-Runbook.md` + `completions/Part-1-Phase-08-Code-Completion.md`. **No `supabase/migrations/`, `src/app`, component, or test file changed; `create_order`/`expire_reservations` untouched; no new dependency.** Hosted verification used seed/test fixtures only, removed after (hosted left clean, TRJ-0001). `D-1.08-*`. | Claude Code |
