# Trajanov-V2 — Plan

**This document is aspirational. Live code wins on conflict.** Where this plan and the repo
disagree, the repo is right and this file is stale — fix the file.

**One fact, one file.** This plan does not restate business facts (`facts.md`), design tokens
(`brand.md`), decisions (`Decisions.md`), live status (`src/_project-state/current-state.md`), or
the phase index (`Trajanov-V2-Phase-Plan.md`). It links.

Created 2026-07-14 from intake · Orchestrator: Claude Chat

---

## 1. Goals and success criteria

A bilingual drop store for a brand-new Macedonian clothing label. It sits quiet and browsable
between drops, then takes real orders against real, limited stock when a countdown hits zero.

**The one number:** orders placed, fulfilled, and not refunded.

**"Launched" means all of the following — no partial credit:**

- [ ] A full drop runs — countdown → live → sold out — without manual intervention
- [ ] Stock is truthful. Zero oversells. Proven by the concurrent-order test, not by hope
- [ ] Orders reach Vladimir and he can fulfil directly from them
- [ ] MK and EN both live, both reviewed by a native speaker (Phase 2.02)
- [ ] **Placeholder register empty** (`current-state.md`)
- [ ] **Owed-verification register empty** (`current-state.md`)
- [ ] Lighthouse **95+ on desktop and mobile**, all four categories
- [ ] **WCAG 2.2 AA**
- [ ] `trajanov.com` live, DNS on Cloudflare, HTTPS
- [ ] Drop-day contingency written and Vladimir briefed (Phase 2.06)

Note: "GitHub Action reviews passing" is in the house definition of launched but does not apply —
see `D-0-3`. The replacement gate is in its place.

---

## 2. About the business

See **`facts.md`** — the only source. Do not restate facts here.

Short orientation only: a 2026 Strumica clothing brand founded by a secondary-school design
student who won a national t-shirt design competition in June 2026. No legal entity, no shopfront,
no staff, no reviews, no sales yet. Cash on delivery. Ships within North Macedonia.

**The brand's entire asset today is a clean reputation and real press.** Every content decision on
this project should be read against that sentence.

---

## 3. Audiences

| # | Who | What they need from the site |
|---|---|---|
| 1 | **12–25, MK, Instagram-native** | The drop audience. Follows him; buys because it's his. Mobile, impatient, decides in seconds. Needs: the countdown, the price, the buy button. Nothing between them and the order. |
| 2 | **25–40, MK** | Buys design, not hype. Needs: proper photographs of the garment, real fabric and size information, and a reason to trust that a package will actually arrive from a brand they've never heard of. |
| 3 | **Diaspora / press-curious, EN** | Arrived via the competition coverage. **Cannot buy — MK shipping only.** Needs: the story, the work, and an honest, early statement that shipping is Macedonia-only. Shapes perception; doesn't convert. |

**Design conflict, stated openly:** audience 1 wants the fewest possible steps; audience 2 wants
detail and reassurance. Resolution: the buy path is short and the detail sits below it. Nobody has
to scroll to buy; anybody can scroll to be convinced.

---

## 4. Information architecture

```
/mk  (default)                    /en
  /                                 /
  /katalog                          /catalog
  /proizvod/[slug]                  /product/[slug]
  /kosnicka                         /cart
  /plakanje                         /checkout
  /za-nas                           /about
  /kontakt                          /contact
  /uslovi · /privatnost · /isporaka-i-vrakjanje   (legal, both locales)
```

Route slugs localise; the codebase does not. Confirm MK slugs in Phase 2.02 with the native
reviewer — the ones above are a starting proposal, not gospel.

| Page | Job | Notes |
|---|---|---|
| **Home** | Countdown or LIVE. Nothing competes with it. | Hero from the bar shoot (pending the clearances in `facts.md` § 8). Current drop. The press win, once. |
| **Catalog** | 3–5 products, sold-out states honest | Trivial at this size. Do not build filtering, sorting, or pagination for five t-shirts. |
| **Product** | Convince and sell | Front / back / print detail / on-body. Real price. Real sizes. Real fabric. Live stock. Buy or SOLD OUT. |
| **Cart** | Hold, review, proceed | Max 2 units per order enforced here **and** server-side. |
| **Checkout** | One screen. Name, phone, address, city, notes. | No account. No card. No upsells. Confirm-on-delivery expectation stated plainly. |
| **About** | The story | Sourced entirely from `facts.md` § 3. It is a genuinely good story and needs no embellishment. |
| **Contact** | Reach him | Phone + email (email pending). Instagram. **No contact form** — the phone is the channel and adding a form means building a second inbox nobody reads. |
| **Legal** | Terms, Privacy, Shipping & Returns | Hand-written for a Macedonian COD micro-brand. Responsible party per `facts.md` § 1. |

**Not building:** accounts, login, wishlist, product reviews, blog, newsletter, discount codes,
gift cards, AI chat, search, filtering, multi-currency, guest order lookup. None were asked for and
each is a surface that can break on drop day.

---

## 5. Design direction

**Sketched in chat and approved by Lazar before the Phase 1.02 brief is written.** That step is not
skippable. What follows is the orchestrator's opening read, to be reacted to — not a spec.

- **Palette** pulled from the actual garments, not invented: mustard/ochre, off-white, the red of
  the print as the only accent, a deep near-black or teal ground borrowed from the shoot.
- **Type does the work.** The shirts are boxy, unfussy, confident. The site should be the same:
  big type, a lot of air, few elements, no decoration for its own sake.
- **The countdown is the loudest object on the site.** Everything else defers to it.
- **Mobile-first, genuinely.** Audience 1 arrives from an Instagram story on a phone, in a hurry.
  Desktop is the secondary case.
- **Restraint over effects.** Motion is for the countdown and the drop reveal. Not for everything
  else.

**Tokens live only in `brand.md`.** Design fills it in Phase 1.02; from then on nothing hardcodes
a colour, size, or spacing value. The handover and all code read from there.

**Voice:** punchy, present tense, direct address, Strumica confidence. *"Петок. 20:00. 40 парчиња."*
Not shouty, not luxury-brand fog. No "elevate", no "curated", no "essentials". If a sentence could
appear on any clothing site in the world, delete it.

---

## 6. Stack

Locked. **Canonical version, with pinned versions and rationale: `src/_project-state/00_stack-and-config.md`.**
Summary only, do not treat this table as the source:

Next.js (App Router) · TypeScript · Tailwind · shadcn/ui · Motion · Lucide · next-intl ·
**Supabase** (Postgres — orders, atomic stock) · **Resend** (email) · **Cloudflare Turnstile**
(bots) · **Cloudflare** (DNS, Web Analytics) · **Vercel Hobby** (`D-0-2`, accepted risk) ·
products and drop config in-repo, no CMS (`D-0-4`).

**Deliberately absent:** payment processor (COD), CMS, CRM, AI features, review platform.

**Total running cost: ~$13/year** (the domain). Everything else is on a free tier.

**Portability rule (mitigates `D-0-2`):** nothing Vercel-specific. No Vercel Postgres, Blob, or KV.
Data in Supabase, DNS in Cloudflare. Any host migration is a redeploy, not a rebuild. Enforced in
`CLAUDE.md`.

---

## 7. The drop engine

The hard part. Everything else on this site is a page.

### States

| State | Condition | Site behaviour |
|---|---|---|
| **Countdown** | now < drop start | Full site browsable. Products visible. **Nothing buyable.** Countdown prominent. |
| **Live** | drop start ≤ now, stock remains | Products buyable. Live stock. Sold-out items marked as they go. |
| **Ended** | now > drop end, or all stock gone | Items stay visible, marked **SOLD OUT**. Site returns to browsable-not-buyable. Next countdown if scheduled. |

**Computed server-side from config.** The browser never decides whether a drop is open. A client
clock is a suggestion, not a fact — and a determined 16-year-old will change theirs.

### Stock

- **Atomic decrement in Postgres.** A single statement, or a transaction with the row locked.
  Never read-then-write in application code.
- **Reservation, not sale.** An order **holds** the unit for 48h. Vladimir confirms by phone;
  unconfirmed reservations expire and the unit returns to stock.
- **Expiry runs server-side on a schedule.** Not on page load — an item nobody views must still
  come back.

### Abuse controls — not optional

**Cash on delivery means ordering is free, so sabotage is free.** There is no card to charge, so
there is no cost to a fake order. One person with a script can reserve all 40 shirts to a fake
address in three minutes: real stock decrements, the site shows SOLD OUT, real buyers leave, and
Vladimir ships nothing. This is the specific, predictable failure mode of COD + hype + scarcity,
and it is why `D-0-5` exists.

- **Turnstile** on the order form — kills scripted ordering
- **Rate limit by IP and by phone number** — one person, one order per drop
- **Max 2 units per order** — enforced client-side for UX and server-side for truth
- **The 48h reservation** — the real protection: a fake order costs the attacker a phone number and
  buys them 48 hours, not a drop

### The test that matters

**10 simultaneous orders against 3 units → exactly 3 succeed, 7 cleanly rejected.** Automated,
committed, in the Definition of Done for 1.03 and 1.04, re-run in 1.08. This bug cannot be found by
clicking, because one person cannot click twice at once. It appears in public, on drop day, or not
at all.

---

## 8. Orders and notification

1. Customer submits checkout → Turnstile → server action
2. Server validates, decrements stock atomically, writes the order, creates the 48h reservation
3. **Resend** → Vladimir gets the order; customer gets a confirmation stating COD and that Vladimir
   will call to confirm
4. Vladimir works from the Supabase order table, not his inbox. **The email is a notification, not
   the record.**

**Email is a best-effort side channel. The database is the truth.** If Resend fails, the order
still exists. Never make order integrity depend on an email being delivered.

**Blocked on Vladimir's email address** (`facts.md` § 5) — the pipeline cannot be verified
end-to-end without it. See Phase 1.08.

---

## 9. Bilingual

- **MK default at `/mk/`, EN parallel at `/en/`.** Real URLs. Both indexed. `hreflang` both ways.
- **MK is the selling language. EN is reach.**
- **EN must state, early and plainly, that shipping is North Macedonia only.** Not in the footer,
  not on the legal page — on the product page and at checkout. An English reader who reaches
  checkout and *then* discovers they can't buy is a bad experience we chose to create.
- **Native review is Phase 2.02, a build phase, before cutover** — not a post-launch wish. Owners:
  Lazar and Petar.
- Never ship an untranslated English string into the MK build. A half-translated store reads as
  abandoned.

---

## 10. SEO

Nobody has searched "Trajanov" yet. Ranking is not the near-term game; **not being the weak link
when he posts to Instagram** is.

- **OG images that survive an Instagram/Messenger/Viber paste.** Highest-value item on this list by
  a distance — it is the actual traffic path.
- Product schema (price, availability, currency) and Organization schema. Availability must track
  real stock, not a hardcoded `InStock`.
- Sitemap, both locales. `robots.txt`. Canonicals.
- The press links as real citations, **once each of the three unverified ones is confirmed live**
  (`facts.md` § 4).
- **No content marketing, no blog, no keyword pages.** He has no time and the audience is on
  Instagram.

---

## 11. Analytics

Cloudflare Web Analytics. Free, no cookies, **no consent banner needed** — which matters, because a
cookie banner on a drop landing page is a tax on the one moment that counts.

The only question it needs to answer: **did the drop work?** Visitors, drop-page views, checkout
starts, orders. Nothing else.

---

## 12. Legal

Three hand-written pages: Terms, Privacy, Shipping & Returns. **Not generated** — a generator
produces American SaaS boilerplate about a Macedonian teenager's t-shirts, which is worse than
nothing because it looks like diligence.

Must cover honestly: who the seller is (`facts.md` § 1 — pending the parents confirmation), COD
terms, delivery expectations within North Macedonia, returns, and what happens to the customer's
name, phone, and address.

**Nobody on this project is a lawyer, and this plan is not legal advice.** The site collects
personal data from consumers, some of whom will be minors, under a minor's brand name with no
registered entity. Confirming the responsible party is on the parallel track and is a **cutover
blocker**, not a build blocker.

---

## 13. Parallel track — starts now, gates the build

| Task | Owner | Gates | Status |
|---|---|---|---|
| Buy **trajanov.com** | Lazar | Cutover (2.05) | Not started |
| **Product photos**, neutral background | **Vladimir** | **Catalog + Product (1.06)** | Not started — **critical path** |
| Vladimir's **business email** | Lazar → Vladimir | Contact, order pipeline, **1.08 verification** | Not started |
| **Real prices** in MKD, per product | Vladimir | Product pages (1.06) | Not started |
| **Sizes + fabric/care** — read the labels | Vladimir | Product pages (1.06) | Not started |
| **Legal responsibility** confirmed with parents | Vladimir | Legal (2.03), cutover | Not started |
| **Model + venue permission** for the bar photos | Vladimir | Home, About (1.05) | Not started |
| Verify the **3 unconfirmed press links** | Lazar | About (1.05) | Not started |
| **First drop date + which 3–5 products** | Vladimir | Drop config (1.04) | Not started |
| **MK copy review** | Lazar + Petar | Cutover (2.02) | Scheduled as a phase |

**The photos are the critical path. Everything else is a phone call.** Start the slow clocks first.

---

## 14. Phases

**Canonical index: `Trajanov-V2-Phase-Plan.md`.** Not restated here.

---

## 15. Known risks

| Risk | Severity | Mitigation |
|---|---|---|
| **Vercel Hobby takedown on drop day** | High impact, low-ish probability | `D-0-2`. Portability rule, pre-written Pro migration phase, 2.06 contingency |
| **Concurrency bug ships unreviewed** | High | `D-0-3` replacement gate + concurrent-order test in 1.03/1.04/1.08 |
| **COD sabotage on drop day** | High | Turnstile, rate limits, 2-unit cap, 48h reservations (§ 7) |
| **Product photos never arrive** | **Blocks launch** | `D-0-6`. Owner: Vladimir. Gates 1.06. Escalate at the first slip, not the third |
| **Secret committed to a public repo** | High | `D-0-1`. Hard rule in `CLAUDE.md`. Rotate, don't delete |
| **Legal responsibility unresolved** | Blocks cutover | Parallel track, owner Vladimir |
| **Bar photos: model/venue permission** | Medium | Parallel track. Also an age-appropriateness call for Vladimir — the audience starts at 12 |
| **Two operators, one repo** | Medium | One phase branch at a time (`CLAUDE.md`) |
| **Drop day is the first real load test** | Medium | 1.08 verification gate; rehearsal in 2.06 |

---

## 16. Where everything lives

| What | File |
|---|---|
| Verified facts | `facts.md` |
| Design tokens | `brand.md` |
| Why the project is like this | `Decisions.md` |
| Live status, NEXT line, registers | `src/_project-state/current-state.md` |
| Stack + pinned versions | `src/_project-state/00_stack-and-config.md` |
| File map | `src/_project-state/file-map.md` |
| Phase index | `Trajanov-V2-Phase-Plan.md` |
| Orchestrator rules | `Trajanov-V2-Project-Instructions.md` |
| Code's standing rules | `CLAUDE.md` |
| Phase briefs | `briefs/` |
| Design handovers | `docs/design-handovers/` |
| Completion reports | `src/_project-state/completions/` |
