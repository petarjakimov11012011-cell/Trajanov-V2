# Trajanov-V2 — Phase Plan

The canonical phase index. **Live status is not here** — read
`src/_project-state/current-state.md`, whose first line is always `NEXT:`. If this file and that
file disagree, that file is right.

Scope detail per phase lives in the phase's brief in `briefs/`. This is the index and the critical
path, not the spec.

Created 2026-07-14 · Orchestrator: Claude Chat

---

## Part 1 — Build

Goal: a working drop store on a preview URL, with one real order proven end-to-end.

| # | Name | Type | Scope | Depends on |
|---|---|---|---|---|
| **1.01** | Scaffold | Code | Next.js + TS + Tailwind + shadcn on `/Users/petarjakimov/Projects/Trajanov-V2`. Public repo. All reserved paths created. `CLAUDE.md`, `facts.md`, `brand.md`, `Decisions.md`, state files in place. `.gitignore` covering `.env*` **verified by attempting to stage a dummy env file**. **No GitHub Action — see `D-0-3`.** | — |
| **1.02** | Design system | Design | Fills `brand.md`: palette from the garments, type scale, spacing, component specs (countdown, product card, sold-out state, buy button, checkout field). Handover to `docs/design-handovers/`. **Direction sketched in chat and approved by Lazar before this brief is written.** | 1.01 |
| **1.03** | Data layer | Code | Supabase schema: products, stock, orders, reservations. **Atomic decrement.** RLS. Typed client. **DoD: concurrent-order test — 10 orders / 3 units → exactly 3 succeed.** Fresh-session PR review (`D-0-3`). | 1.01 |
| **1.04** | Drop engine | Code | Server-computed drop state. Countdown. 48h reservations + server-side expiry. Turnstile. Rate limits (IP + phone). 2-unit cap. Drop config format. **DoD: concurrent test re-run + expiry proven.** Fresh-session PR review (`D-0-3`). | 1.03 |
| **1.05** | Home + About | Code | Countdown/LIVE home. Hero. The press story, sourced from `facts.md` § 3. **Blocked on: model/venue permission; 3 unverified press links.** Placeholders + register entries if unresolved. | 1.02, 1.04 |
| **1.06** | Catalog + Product | Code | Product listing, product detail, real photos, real prices, sizes, fabric, live stock, sold-out states. **Blocked on: product photos, prices, sizes, fabric — all owed by Vladimir.** | 1.02, 1.03 |
| **1.07** | Cart + Checkout + email | Code | Cart, one-screen checkout, server action, Resend to Vladimir + customer. **Email is a side channel; the DB is the record.** **Blocked on: Vladimir's email.** | 1.04, 1.06 |
| **1.08** | **VERIFICATION GATE** | Code + Lazar | **No new features.** One real order, real phone, real email, end to end. Concurrent test re-run. Reservation expiry observed. Turnstile + rate limits confirmed live. Owed-verification register cleared to zero. | 1.07 |

**Batching candidate:** 1.05 + 1.06 — same templates, low decisions. **Only batch if the parallel-track
assets (photos, prices, sizes, fabric, permissions) have landed.** Batching a phase that is blocked
on missing assets produces one large PR full of placeholders, which is worse than two small ones.

**1.08 is a hard gate.** Part 2 does not start until the owed-verification register is empty.
Verification debt does not accumulate silently on this project.

---

## Part 2 — Ship

Goal: bilingual, legal, fast, on the real domain, with a drop-day plan.

| # | Name | Type | Scope | Depends on |
|---|---|---|---|---|
| **2.01** | Bilingual | Code | next-intl. MK default, EN at `/en/`. Every string extracted. `hreflang`. Localised route slugs. **EN states MK-only shipping on product + checkout, not just the footer.** | 1.08 |
| **2.02** | Native MK review | Lazar + Petar → Code | Native speakers read every MK string in context, in the browser. Slugs confirmed. Fixes shipped. **Externally paced — start the read the day 2.01 merges.** | 2.01 |
| **2.03** | Legal + facts audit | Code | Terms, Privacy, Shipping & Returns — hand-written. **Full `facts.md` audit: every rendered claim traced to a VERIFIED entry.** **Blocked on: legal responsibility confirmed with parents.** | 2.02 |
| **2.04** | Perf, a11y, SEO | Code | Lighthouse 95+ desktop **and** mobile. WCAG 2.2 AA. Product + Organization schema with real availability. Sitemap, robots, canonicals. **OG images tested by actually pasting a link into Instagram and Viber** — the real traffic path. | 2.03 |
| **2.05** | Cutover | Cowork + Code | Buy/point `trajanov.com`. Cloudflare DNS. HTTPS. Env vars in prod. Cloudflare Web Analytics. **Placeholder register must be empty — launch blocker.** | 2.04 |
| **2.06** | Drop rehearsal + contingency | Lazar + Vladimir | Full dress rehearsal against a fake drop: countdown → live → order → sold out → expiry. Vladimir walks his own fulfilment path. **Written contingency: what he posts, and where, if the site is pulled mid-drop (`D-0-2`).** | 2.05 |

### On demand — pre-written, not scheduled

| # | Name | Type | Trigger |
|---|---|---|---|
| **X.01** | Migrate to Vercel Pro | Code | A Vercel notice arrives, or a drop spikes, or Lazar decides. Written in advance so it is an afternoon, not a scramble. See `D-0-2`. |

---

## Critical path

```
1.01 → 1.02 → 1.03 → 1.04 → 1.06 → 1.07 → 1.08 → 2.01 → 2.02 → 2.03 → 2.04 → 2.05 → 2.06
                                    ↑
                        PRODUCT PHOTOS (Vladimir)
                        prices · sizes · fabric
                        ── the real critical path ──
```

**The build is not the bottleneck. Vladimir is.** 1.06 cannot close without photos, prices, sizes,
and fabric, and 1.07 cannot be verified without his email. Every one of those is his to supply and
none of them can be worked around, invented, or generated (`D-0-6`).

**Escalate at the first slip, not the third.** A phase that sits blocked is a phase that quietly
becomes a placeholder.

---

## Verification gates

| Gate | Where | Rule |
|---|---|---|
| Concurrent-order test | 1.03, 1.04, re-run 1.08 | 10 orders / 3 units → exactly 3 succeed |
| Owed-verification register | 1.08 | Must be zero before Part 2 |
| Placeholder register | 2.05 | Must be zero before cutover |
| Fresh-session PR review | 1.03, 1.04 | `D-0-3` replacement gate |
| UI seen before close | Every UI phase | 1.05, 1.06, 1.07, 2.04 |
| Native MK review | 2.02 | Before cutover, not after |

**House rule reinstated locally:** the register triggers a verification phase at 3+ items, or
before any phase that builds on unverified work — whichever comes first.

---

## What is NOT in this plan

Accounts, login, wishlist, reviews, blog, newsletter, discount codes, gift cards, AI chat, search,
filtering, multi-currency, international shipping, CMS, card payments.

None were asked for. Each is a surface that can break on drop day. If one becomes necessary, it is
a new phase and a decision entry — not a quiet addition to an existing brief.
