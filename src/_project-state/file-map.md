# File map — Trajanov-V2

**What lives where, and why.** Read this before creating a file — so the same thing does not get
built twice in two places under two names.

Updated by Code on every phase that adds, moves, or deletes a file. **A file map that lies is worse
than no file map.**

Last updated: **2026-07-15** · By: **Claude Code (Phase 1.02 — design system)**

---

## Status

**Design system + full clickable site (Phase 1.02).** The tree below is the **real on-disk
structure**. Notes:

- **Route folders now exist** for the visual pass: `catalog/`, `catalog/[slug]/`, `cart/`,
  `checkout/`, `styleguide/` under `app/[locale]/`. These use **non-localised slugs** — localised
  path slugs (katalog|catalog, …) are still Phase 2.01 (`D-1.02-4`).
- **New component dirs beyond the reserved three** (`D-1.02-6`): `components/{system,cart,checkout,
  layout,home}`. `components/ui/` is still shadcn-reserved and empty (brand components hand-authored).
- **Still reserved and empty** (`.gitkeep`): `src/lib/{supabase,drop,orders,email,rate-limit}`,
  `src/config`, `public/images/{products,lifestyle}`, `supabase/migrations`, `tests/concurrency`.
- **`src/lib/demo.ts` + `src/types/drop.ts`** are new: placeholder demo drop data + shared UI types
  for the 1.02 pass (`D-1.02-5`); the real typed drop config replaces `demo.ts` in 1.04.
- The Phase 1.02 handover is committed at `docs/design-handovers/Part-1-Phase-02-Handover.md`.

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
│   │   ├── supabase/               # .gitkeep — client + server (1.03)
│   │   ├── drop/                   # .gitkeep — state calc, reservations — SERVER ONLY
│   │   ├── orders/                 # .gitkeep — order creation, atomic decrement
│   │   ├── email/                  # .gitkeep — Resend side channel
│   │   └── rate-limit/             # .gitkeep
│   │
│   ├── config/                     # .gitkeep — drops.ts, products.ts (1.04)
│   │
│   ├── messages/
│   │   ├── mk.json                  # default language — all 1.02 UI strings
│   │   └── en.json                  # EN parity
│   │
│   └── types/
│       └── drop.ts                  # DropState, StockLevel, DemoProduct/Size
│
├── public/
│   └── images/
│       ├── products/               # .gitkeep — REAL photos only — D-0-6
│       └── lifestyle/              # .gitkeep — the bar shoot — pending permissions
│
├── supabase/
│   └── migrations/                 # .gitkeep — schema. atomic decrement (1.03)
│
└── tests/
    └── concurrency/                # .gitkeep — 10 orders / 3 units → exactly 3 succeed
```

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
