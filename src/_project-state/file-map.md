# File map — Trajanov-V2

**What lives where, and why.** Read this before creating a file — so the same thing does not get
built twice in two places under two names.

Updated by Code on every phase that adds, moves, or deletes a file. **A file map that lies is worse
than no file map.**

Last updated: **2026-07-15** · By: **Claude Code (Phase 1.03 — data layer)**

---

## Status

**Data layer landed (Phase 1.03).** The tree below is the **real on-disk structure**. Zero UI change
this phase — nothing under `src/app`, `src/components`, or `src/messages` was touched. Notes:

- **Supabase is real (local only, `D-1.03-5`):** `supabase/config.toml`, `supabase/seed.sql`, and
  three migrations under `supabase/migrations/` (schema, `create_order`, `expire_reservations`).
  `supabase/.gitignore` was created by `supabase init`.
- **`src/lib/supabase/{client,server}.ts`** (typed browser + server-only clients),
  **`src/lib/orders/order-errors.ts`** (the `create_order` error vocabulary), and
  **`src/types/database.ts`** (generated types) now fill previously-reserved dirs.
- **Tests are real:** `tests/setup.ts`, `tests/helpers/db.ts`, `tests/concurrency/{oversell,expiry}
  .test.ts`, `tests/rls/anon-access.test.ts`, `tests/orders/create-order.test.ts`; `vitest.config.ts`
  at the root.
- **`.gitkeep` removed** from the now-populated dirs: `supabase/migrations`, `tests/concurrency`,
  `src/lib/supabase`, `src/lib/orders`, `src/types`.
- **Still reserved and empty** (`.gitkeep`): `src/lib/{drop,email,rate-limit}`, `src/config`,
  `public/images/{products,lifestyle}`, `src/components/ui`.
- Carried from 1.02: route folders (non-localised slugs, `D-1.02-4`), component dirs
  `components/{system,cart,checkout,layout,home}`, `src/lib/demo.ts` + `src/types/drop.ts` (both
  throwaway; `demo.ts` dies in 1.04). The Phase 1.02 handover is at
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

---

## On-disk tree (real — Phase 1.01)

`node_modules/`, `.next/`, and `.DS_Store` are omitted (installed / build artifacts / gitignored).

```
Trajanov-V2/
├── CLAUDE.md                       # Code's standing rules
├── facts.md                        # verified facts — only source
├── brand.md                        # design tokens — only source (SEED — filled 1.02)
├── Decisions.md                    # append-only decision log
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
│   │       ├── page.tsx             # home → HomeExperience (countdown / LIVE)
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
│   │   ├── product/                # ProductCard, BuyButton, SizePicker
│   │   ├── cart/                   # CartView
│   │   ├── checkout/               # CheckoutField, CheckoutForm, TurnstilePlaceholder
│   │   ├── layout/                 # SiteHeader, SiteFooter, LanguageSwitch
│   │   ├── home/                   # HomeExperience
│   │   └── system/                 # Placeholder, PhotoSlot, PreviewNotice
│   │
│   ├── lib/
│   │   ├── utils.ts                 # cn() — shadcn helper
│   │   ├── demo.ts                  # PLACEHOLDER demo drop data (1.02) — replaced by config in 1.04
│   │   ├── supabase/
│   │   │   ├── client.ts            # browser client, anon key (1.03)
│   │   │   └── server.ts            # server client, service role — `import "server-only"` (1.03)
│   │   ├── orders/
│   │   │   └── order-errors.ts      # create_order() SQLSTATE → identifier vocabulary (1.03)
│   │   ├── drop/                   # .gitkeep — state calc, reservations — SERVER ONLY (1.04)
│   │   ├── email/                  # .gitkeep — Resend side channel (1.07)
│   │   └── rate-limit/             # .gitkeep (1.04)
│   │
│   ├── config/                     # .gitkeep — drops.ts, products.ts (1.04)
│   │
│   ├── messages/
│   │   ├── mk.json                  # default language — all 1.02 UI strings
│   │   └── en.json                  # EN parity
│   │
│   └── types/
│       ├── drop.ts                  # DropState, StockLevel, DemoProduct/Size (1.02)
│       └── database.ts              # GENERATED from local DB — `npm run gen:types` (1.03)
│
├── public/
│   └── images/
│       ├── products/               # .gitkeep — REAL photos only — D-0-6
│       └── lifestyle/              # .gitkeep — the bar shoot — pending permissions
│
├── supabase/                       # LOCAL ONLY — no hosted project until 1.07 (D-1.03-5)
│   ├── config.toml                 # `supabase init`; trimmed stack for 8 GB host (D-1.03-10)
│   ├── .gitignore                  # created by `supabase init`
│   ├── seed.sql                    # dev/test fixtures — `test-` slugs, stock=3 target
│   └── migrations/
│       ├── 20260715021215_schema.sql              # 5 tables, constraints, indexes, enum, RLS, grants
│       ├── 20260715021216_create_order.sql        # atomic conditional decrement — the heart
│       └── 20260715021217_expire_reservations.sql # idempotent hold-release sweep
│
├── tests/                          # Vitest — DB integration; need a live local stack (D-1.03-12)
│   ├── setup.ts                    # loads .env.local (Node 24 process.loadEnvFile)
│   ├── helpers/db.ts               # anon/service supabase-js clients + direct pg admin conn
│   ├── concurrency/
│   │   ├── oversell.test.ts        # 10 orders / 3 units → exactly 3 succeed, 7 insufficient_stock
│   │   └── expiry.test.ts          # stock returned exactly once, incl. 2 concurrent sweeps
│   ├── rls/anon-access.test.ts     # anon wall: orders unreadable, variants readable, no writes/rpc
│   └── orders/create-order.test.ts # happy path, drop window (D-1.03-7), full error vocabulary
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
