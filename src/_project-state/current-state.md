NEXT: 1.04 — Drop engine (config→DB sync, server drop-state, schedule expire_reservations, Turnstile, IP rate-limit)

# Current state — Trajanov-V2

**This file is the single source of truth for project status.** The orchestrator reads it before
every brief. Nobody's memory outranks it. Line 1 is always the `NEXT:` line — Code updates it when
closing every phase.

Last updated: **2026-07-15** · By: **Claude Code (Phase 1.03 — data layer)**

---

## Status

**Data layer landed — "SOLD OUT" is now true, server-side.** Postgres schema (`drops` → `products`
→ `variants`, with stock **per size**; `orders` → `order_items`, the order *is* the reservation).
`create_order()` decrements stock with a **single conditional UPDATE** (never read-then-write), in
deterministic variant order (no deadlocks), and enforces the drop window (`D-1.03-7`), the 1–2 unit
cap, and one-live-order-per-phone-per-drop. `expire_reservations()` releases lapsed holds and returns
stock **exactly once**, safe under concurrency. RLS: orders/order_items are **deny-all** to anon;
catalog is read-only public; the two functions are `service_role`-only. Typed clients shipped
(`client.ts` anon, `server.ts` service-role behind `import "server-only"`), types generated.
**13 Vitest tests pass — including the gate: 10 orders vs 3 units → exactly 3 succeed, 7
insufficient_stock, stock 0** (watched failing against a naive read-then-write first). **Local only:
no hosted Supabase, no deploy (`D-1.03-5`); Docker via Colima (`D-1.03-8`). Zero UI change.** Branch
`phase-1.03-data-layer`; PR to `main`.

Prior (1.02): design system + full clickable site, MK default + EN, all product data placeholder
(`src/lib/demo.ts`, throwaway — dies in 1.04).

| | |
|---|---|
| Part | 1 of 2 — Build |
| Phase | 1.03 complete — PR open |
| Branch | `phase-1.03-data-layer` |
| Open PR | `#3` → `main` (1.01 `#1`, 1.02 `#2` merged) |
| Deployed | nowhere — Supabase runs **local only** (`D-1.03-5`) |
| Domain | `trajanov.com` — **not purchased** |

---

## Stack

**Canonical: `00_stack-and-config.md`.** Not restated here.

Installed and pinned in 1.01 (versions recorded there). Toolchain: Node `v24.17.0`, npm `11.13.0`.
Note: shadcn's default style is Base UI-based (`base-nova`), not Radix — see `D-1.01-1`.

---

## Built

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
| Supabase | **Local only (Docker/Colima)** — schema + `create_order` + `expire_reservations` + RLS + 13 tests. **No hosted project** (1.07). |
| Resend | Not created |
| Turnstile | **Placeholder UI only** (real widget 1.04) |
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
| 1 | **Design direction sign-off.** Palette + fonts were *derived* from the handover ledger, not from a delivered filled `brand.md` (`D-1.02-1`). Lazar must eyeball the rendered site and approve/adjust the tokens. | 1.02 | Lazar review of PR `#2` |
| 2 | **IG profile URL click-test.** `@trajanovv2026` handle is VERIFIED but the URL must be click-tested live before it ships (`facts.md` §6). It now appears in the footer + drop-ended banner. | 1.02 | Before cutover (2.05) |
| 3 | **Fresh-session review of PR `#3`** (`D-0-3`). A Claude Code session that did **not** write this code reviews the PR against the 1.03 brief before merge. **This is a downgrade on a real automated review gate**, not an equal substitute — it is the one replacement item with a chance of catching a concurrency bug the operators cannot. Clears at merge. | 1.03 | Fresh Claude Code session, pre-merge |
| 4 | **Migrations / RLS / keys unproven against *hosted* Supabase** (`D-1.03-5`). Everything is proven only against local Supabase (Colima). Hosted settings, extensions, and real keys may differ; the RLS wall and `create_order`/`expire_reservations` must be re-confirmed on the real project. | 1.03 | 1.07 (hosted project) |

*Code verified directly (not owed): `supabase db reset` clean from scratch; `npm run build`,
`npx tsc --noEmit`, `npm run lint`, `npm test` (13) all green; the 10-vs-3 concurrency gate proven
(and watched failing against a naive impl first); `server-only` guard proven by a failing build.*

*Register is now at **4 items** (was 2), crossing the 3-item line. But #3 clears at merge and #4 is
deferred to 1.07 **by design** (`D-1.03-5`) — neither is shaky work 1.04 builds on. Orchestrator to
decide whether any 1.04 scope becomes verification; nothing here blocks starting 1.04.*

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

*All four are placeholder-by-design for the 1.02 visual pass and are driven by `src/lib/demo.ts`
(throwaway). They are replaced by the real typed drop config in 1.04 and photos in 1.06. **The
register must be empty before cutover (2.05).***

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

None.

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
