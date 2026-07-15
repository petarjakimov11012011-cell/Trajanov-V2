NEXT: 1.03 — Data layer (Supabase schema + atomic stock)

# Current state — Trajanov-V2

**This file is the single source of truth for project status.** The orchestrator reads it before
every brief. Nobody's memory outranks it. Line 1 is always the `NEXT:` line — Code updates it when
closing every phase.

Last updated: **2026-07-15** · By: **Claude Code (Phase 1.02 — design system)**

---

## Status

**Design system built + full clickable site.** `brand.md` is filled (palette derived from the
handover ledger, verified WCAG 2.2 AA pair-by-pair; type Rubik + Inter, Cyrillic-checked) and wired
into `globals.css`. All 10 handover components are built with every state, and every mockup screen is
a real route — home (countdown + LIVE), catalog, product, cart-at-cap, checkout, plus `/styleguide`.
MK default + EN parity; live ticking countdown. **No real data yet:** stock/drop/order truth is
server-side and deferred to 1.03/1.04; product data is placeholder pending Vladimir. Rendered and
verified in-browser (desktop + 375px mobile). Branch `phase-1.02-design-system`; PR to `main`.

| | |
|---|---|
| Part | 1 of 2 — Build |
| Phase | 1.02 complete — PR open |
| Branch | `phase-1.02-design-system` |
| Open PR | `#2` → `main` (1.01 `#1` merged) |
| Deployed | nowhere |
| Domain | `trajanov.com` — **not purchased** |

---

## Stack

**Canonical: `00_stack-and-config.md`.** Not restated here.

Installed and pinned in 1.01 (versions recorded there). Toolchain: Node `v24.17.0`, npm `11.13.0`.
Note: shadcn's default style is Base UI-based (`base-nova`), not Radix — see `D-1.01-1`.

---

## Built

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
| Supabase | Not created |
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

*Code verified directly (not owed): build/lint/types green; all pages rendered in-browser (desktop
+ 375px mobile); Cyrillic checked at display size; every contrast pair computed against AA. At 2
items — below the 3-item threshold that would force a verification phase.*

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
