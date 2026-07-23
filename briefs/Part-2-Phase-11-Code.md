# Part 2 · Phase 11 · Code — Home FAQ section
**Why this matters —** a buyer arriving from an Instagram story has the same five questions every
time (how do I pay, where do you ship, how long, how many can I take, why so few) and today has to
open Terms or Shipping & Returns to answer any of them. This puts eight honestly-sourced answers on
the front door, under the hero, without touching the countdown or anything that sells.
---
## Context
**This is an out-of-band UI phase — the same shape as 2.07 / 2.08 / 2.09 / 2.10 / Y.02.** It ships
UI and copy only. **`NEXT:` on line 1 of `current-state.md` stays exactly as it is** (the 2.06
operator rehearsal remains next); this phase does not advance it.
### Read first, by path
| Path | Why |
|---|---|
| `CLAUDE.md` | Standing rules — secrets, branches, content truth, state duties |
| `src/_project-state/current-state.md` | Live state, both registers, known issues |
| `facts.md` | The only legal source for any factual claim. **Do not edit it in this phase.** |
| `brand.md` | Tokens — §3 colour, §4 type, §5 spacing/radius, §6 motion |
| `src/app/[locale]/page.tsx` | Where the new section is mounted |
| `src/components/home/HomeExperience.tsx` | The existing hero — **not modified by this phase** |
| `src/messages/mk.json` · `en.json` | Message catalogs (219 keys today) |
| `src/lib/seo/site-jsonld.ts` + `src/components/seo/JsonLd.tsx` | The existing JSON-LD pattern to follow |
| `src/app/globals.css` | Token block and the global `prefers-reduced-motion` rule (line ~194) |
| `docs/i18n/mk-review-2.03.md` | The format for the MK review pack you will produce |
### What already exists that this phase leans on
- **Terms** (`Terms.*`) and **Shipping & Returns** (`ShippingReturns.*`) already carry MK copy that
  was **read and signed off by native speakers** (`docs/i18n/mk-review-2.03.md`, stamped 2026-07-21).
  Every FAQ answer below is either a `facts.md` VERIFIED entry or a restatement of one of those
  reviewed strings. **This is the entire reason the section is allowed to ship.**
- `src/lib/drop/state.ts` computes drop state server-side; `src/lib/social.ts` holds `EMAIL`/phone.
- `lucide-react`, `motion`, `next-intl` are installed. **shadcn has generated no components yet**
  (`src/components/ui/` holds only `.gitkeep`) — and this phase does not change that.
---
## Orchestrator decisions — already made, do not revisit
Append all five to `Decisions.md` (append-only, `D-<phase>-<n>`), each with the alternative rejected
and the downside accepted as written here.
**`D-2.11-1` · The FAQ lives on the Home page, not on its own route.**
Alternative rejected: a dedicated `/chesti-prashanja` · `/en/faq` page linked from the footer
(the orchestrator's recommendation). Downside accepted: Home is no longer a single-purpose page —
the countdown shares it — and the page gets longer on mobile. **Lazar's call, 2026-07-23.**
**`D-2.11-2` · The reference design's category tab row is replaced by three static group labels.**
The mockup filters questions through pill-shaped tabs. With eight questions, tabs would hide
two-thirds of the answers behind a tap on the one page whose job is to convert, and would add client
state to a section that otherwise needs none. Instead: three quiet uppercase labels — **Нарачка /
Достава / Парчињата** — sit inside the list, with every question visible. Alternative rejected:
interactive filter tabs as drawn. Downside accepted: the horizontal pill row that visually balanced
the big heading is gone, so the heading now sits closer to the first question — handled with spacing,
not with a decorative row.
**`D-2.11-3` · Native `<details>`/`<summary>` + CSS, not a Radix/shadcn accordion.**
Alternative rejected: `npx shadcn@latest add accordion`, which pulls in `@radix-ui/react-accordion`
— a new dependency and a client component on a page that does not otherwise need one for this.
Native `<details>` gives correct keyboard and screen-reader behaviour for free, ships zero JS, stays
server-rendered, and keeps every answer in the DOM for crawlers. Downside accepted: the open/close
height animation depends on `::details-content` + `interpolate-size`, which some browsers do not yet
support — there the panel snaps open while the icon still animates. **That is acceptable and must not
be "fixed" by adding a dependency or a JS fallback.**
**`D-2.11-4` · Eight questions only. Returns window, fabric/care, courier name, delivery cost and
size measurements are deliberately not asked.**
Those five answers do not exist in `facts.md` (placeholder register #3, #6, #7, #9 and the
measurements half of #4). Alternative rejected: mirroring the reference's ~20-question grid and
filling the gaps with `[PLACEHOLDER: …]` markers, which would add rows to a register that must reach
**zero before the first real drop**. Downside accepted: the section looks thinner than the mockup
until Vladimir supplies that content in Y.01.
**`D-2.11-5` · A `FAQPage` JSON-LD node is emitted on Home, built from the same message keys as the
visible copy.**
Alternative rejected: no structured data. Downside accepted: one more schema surface to keep honest —
mitigated by building it from the same single source (`src/lib/faq.ts`), so the visible answer and the
structured answer cannot drift.
---
## Scope
**In scope**
- One new server component rendering an eight-question FAQ under the hero on Home, both locales.
- 22 new message keys per locale (44 total), MK and EN, exactly as written in Task 2.
- Scoped CSS in `globals.css` for the disclosure rows, using existing tokens only.
- A `FAQPage` JSON-LD node on Home, generated from the same key list.
- An MK review pack (`docs/i18n/mk-review-2.11.md`), committed **unsigned**.
- State-file duties, `Decisions.md` entries, completion report.
**Out of scope — do not touch**
- `src/components/home/HomeExperience.tsx`, `Countdown.tsx`, `DropBanner.tsx` — the hero, the
  countdown and the drop banners are byte-unchanged.
- **The heading text and the accordion animation as specified are fixed by the owner.** The section
  heading is "Frequently Asked Questions" (in MK: „Често поставувани прашања") and the rows animate
  open. Do not restyle the heading, do not remove the animation.
- `supabase/`, `src/config/`, `create_order`, `expire_reservations`, cart, checkout, stock, order
  email, rate limiting, Turnstile — **no commerce logic in this phase, at all.**
- `facts.md` — read-only here. If you believe an answer needs a fact that is not in it, **drop that
  question and say so in the completion report**; do not add the fact yourself and do not reword the
  answer to sneak past the gap.
- `src/lib/site.ts` / `SITE_URL`, `sitemap.ts`, `robots.ts`, `llms.txt` — this phase adds **no new
  route**, so none of them change.
- `package.json` — **no new dependency.**
- Line 1 (`NEXT:`) of `current-state.md`.
- Both registers: this phase adds **no `[PLACEHOLDER: …]` marker** and clears none.
---
## Tasks
### Task 1 — Branch
Confirm no other phase branch is unmerged (`CLAUDE.md`: one phase branch at a time). Then:
```zsh
cd /Users/petarjakimov/Projects/Trajanov-V2
git checkout main && git pull
git checkout -b phase-2.11-home-faq
```
### Task 2 — The copy (namespace `Faq`)
Add exactly these keys to **both** `src/messages/mk.json` and `src/messages/en.json`. The key sets
must stay identical (`tests/i18n/catalog-parity.test.ts` enforces it). Run the `humanizer` skill over
the English before committing; the Macedonian is the source language and is written below as it must
ship.
**Structure keys**
| Key | MK | EN |
|---|---|---|
| `Faq.h2` | Често поставувани прашања | Frequently Asked Questions |
| `Faq.groupOrdering` | Нарачка | Ordering |
| `Faq.groupDelivery` | Достава | Delivery |
| `Faq.groupPieces` | Парчињата | The pieces |
| `Faq.moreQuestion` | Друго прашање? | Another question? |
| `Faq.moreLink` | Пиши или јави се | Email or call |
**Group 1 — `Faq.groupOrdering`**
| Key | MK | EN |
|---|---|---|
| `Faq.q1` | Кога можам да купам? | When can I buy? |
| `Faq.a1` | Само додека трае спуштање. Меѓу спуштањата сè може да се разгледа, но ништо не може да се купи. Тајмерот на почетната страница покажува кога се отвора следното. | Only while a drop is on. Between drops you can look at everything, but nothing is buyable. The timer on the home page shows when the next one opens. |
| `Faq.q2` | Како плаќам? | How do I pay? |
| `Faq.a2` | Готовина при преземање, кога пратката ќе пристигне. Нема картички, нема банкарски трансфер, нема плаќање однапред. | Cash on delivery, when the package arrives. No cards, no bank transfer, no paying up front. |
| `Faq.q3` | Колку парчиња можам да нарачам? | How many pieces can I order? |
| `Faq.a3` | Најмногу 2 парчиња по нарачка. Залихата е вистинска и ограничена — кога ќе се распродаде, готово е. | Two pieces per order, maximum. The stock is real and limited — once it's sold out, it's gone. |
**Group 2 — `Faq.groupDelivery`**
| Key | MK | EN |
|---|---|---|
| `Faq.q4` | Каде испорачувате? | Where do you ship? |
| `Faq.a4` | Само во Северна Македонија. Нема испорака во странство. | Within North Macedonia only. No international shipping. |
| `Faq.q5` | Колку трае доставата? | How long does delivery take? |
| `Faq.a5` | Рок на достава: 3–5 работни дена. Курирот и цената на испораката сè уште не се потврдени и нема да ги погодуваме — плаќаш готовина на врата. | Delivery takes 3 to 5 business days. The courier and the delivery cost aren't confirmed yet and we're not going to guess them — you pay cash at the door. |
| `Faq.q6` | Што се случува откако ќе нарачам? | What happens after I order? |
| `Faq.a6` | Нарачката ја резервира залихата 48 часа — не се продава веднаш. Те бараме телефонски за да ја потврдиме. Ако не те фатиме, резервацијата истекува и парчето се враќа во продажба. | Your order holds the stock for 48 hours — it isn't sold on the spot. We call you to confirm it. If we can't reach you, the hold expires and the piece goes back on sale. |
**Group 3 — `Faq.groupPieces`**
| Key | MK | EN |
|---|---|---|
| `Faq.q7` | Кои величини ги има? | What sizes are there? |
| `Faq.a7` | Величините стојат на страницата на секое парче, заедно со тоа што е сè уште достапно. Маиците се оверсајз унисекс крој. Точни мерки во сантиметри сè уште не се објавени. | Sizes are listed on each piece's own page, along with what's still available. The t-shirts are an oversized unisex cut. Exact measurements in centimetres aren't published yet. |
| `Faq.q8` | Зошто парчињата се толку малку? | Why are there so few pieces? |
| `Faq.a8` | Секое спуштање е од 3 до 5 парчиња, во ограничен број. Кога ќе пишува „Распродадено", навистина е распродадено — залихата се води на серверот, не на екранот. | Each drop is 3 to 5 pieces, in limited numbers. When it says "Sold out", it really is sold out — the stock is counted on the server, not on the screen. |
**Source trace — verify each one before you commit the copy.** If any row fails to trace, drop that
question entirely and report it; do not reword it into something you can defend.
| Answer | Traces to |
|---|---|
| `a1` | Drop mechanic — `src/lib/drop/state.ts`, `Home.headline`/`Home.browseWhileWait`, `Terms.orderingBody2` |
| `a2` | `facts.md` §7 *Payment — cash on delivery only, VERIFIED*; restates `Terms.paymentBody` |
| `a3` | `Terms.orderingBody2` (reviewed); 2-unit cap enforced in `src/lib/orders/` |
| `a4` | `facts.md` §7 *Shipping — North Macedonia only, VERIFIED*; restates `Terms.shippingBody` |
| `a5` | `facts.md` §7 *3–5 business days, VERIFIED*; restates `ShippingReturns.deliveryTime` + `deliveryBody` |
| `a6` | `Terms.orderingBody1` (reviewed); 48h hold + expiry in `create_order` / `expire_reservations` |
| `a7` | `facts.md` §7 *oversized unisex t-shirts, VERIFIED*; sizes read per product from the DB; measurements are owed (register #4) and the answer says so |
| `a8` | `facts.md` §7 *3–5 products per drop, VERIFIED*; server-side stock (`D-0-5`); sold-out string is `Stock`/`Buy` |
**Note on `a5` and `a7`:** both state plainly that something is not confirmed yet. That is prose
copied from an already-reviewed page, **not** a `[PLACEHOLDER: …]` marker — the owed items are
already tracked as register rows #4 and #6. **This phase must not add a `[PLACEHOLDER: …]` marker
anywhere**, and the placeholder register is unchanged.
### Task 3 — One source of truth for the list
Create `src/lib/faq.ts` exporting a typed, ordered structure of three groups, each with its label key
and its ordered question/answer key pairs. Both the UI (Task 4) and the JSON-LD (Task 7) import this
— neither hand-lists keys. Keep it free of translated strings; it holds keys only.
### Task 4 — The component
Create `src/components/home/HomeFaq.tsx` as a **server component** (no `'use client'`, no state, no
effects, no event handlers).
Markup:
- `<section>` in the same container as the hero: `mx-auto w-full max-w-6xl px-4 sm:px-6`, with
  generous vertical padding, and an inner `max-w-3xl` column so lines stay readable.
- `<h2>` with `Faq.h2` — `font-display`, `text-h2`, bold, centred, matching the hero's heading
  treatment. **This must be an `h2`, never an `h1`:** Home already renders exactly one `h1` in all
  three drop states and the a11y gate forbids a second one or a skipped level.
- Per group: an `<h3>` group label styled as an eyebrow — `text-eyebrow`, uppercase, wide tracking,
  `text-muted-foreground` — then the group's rows. Heading order is h1 → h2 → h3, no skips.
- Per question: `<details name="home-faq" class="faq-item">` containing `<summary>` (the question,
  plus the icon) and a content wrapper holding `<p>` (the answer). The shared `name` gives native
  one-open-at-a-time behaviour where the browser supports it.
- Icon: the lucide `Plus` icon inside the summary, right-aligned, `aria-hidden`, rotating 45° when
  the row is open (so it reads as ×). It is decoration — the `<summary>` already announces its own
  expanded state.
- Below the list: `Faq.moreQuestion` followed by a localised `<Link href="/contact">` labelled
  `Faq.moreLink`, styled like the existing `Home.aboutLink`. Use the `Link` from `@/i18n/navigation`
  — never a bare `<a href>`. **Do not print the email or phone number here**; the footer and Contact
  already carry them and a fourth copy is a fourth thing to keep in sync.
### Task 5 — The CSS
Add a scoped block to `src/app/globals.css`, after the existing component blocks.
- `.faq-item` — `--color-surface` background, `--color-border` hairline, `--radius-lg` corners, the
  spacing scale for padding. `<summary>` gets `cursor: pointer`, `list-style: none` and
  `::-webkit-details-marker { display: none }` so only our icon shows.
- Hover: lift the surface one step (`--color-surface-2`), transition `var(--motion-fast)`.
- Focus: the existing global `focus-visible` ring must land on `<summary>`. Verify it does; if the
  global rule does not reach it, extend the rule rather than inventing a second ring style.
- Open/close animation: `::details-content` with `block-size: 0` → `auto`, `interpolate-size:
  allow-keywords` on the root of the block, `overflow: hidden`, and a `var(--motion-base)
  var(--ease-out)` transition with `transition-behavior: allow-discrete`. Icon rotation transitions
  on `transform` over `var(--motion-fast)`.
- The global `prefers-reduced-motion` rule already collapses these transitions — **do not add a
  second reduced-motion block**, and do not exempt this one.
- **Zero literal colour values.** No hex, no `rgb()`, no `hsl()` anywhere in the diff except prose in
  comments or docs. Every colour, radius, duration and easing is an existing token from `brand.md` —
  **this phase introduces no new token.**
### Task 6 — Mount it
In `src/app/[locale]/page.tsx`, render `<HomeFaq />` after `<HomeExperience view={view} />` and
before `<DevPreviewSwitch />`. It renders identically in all three drop states (countdown / live /
ended) and in preview mode — it is static content and takes no props from `view`.
### Task 7 — `FAQPage` JSON-LD
Create `src/lib/seo/faq-jsonld.ts` following the shape of `src/lib/seo/site-jsonld.ts`: build a
`FAQPage` node whose `mainEntity` is one `Question`/`acceptedAnswer` pair per item, with the
translated strings for the current locale, iterating `src/lib/faq.ts`. Render it on Home only, via
the existing `<JsonLd>` component. Add `tests/seo/faq-jsonld.test.ts` asserting: exactly 8 questions,
every `name` and `text` non-empty, the order matches `src/lib/faq.ts`, and every key referenced by
`src/lib/faq.ts` exists in **both** catalogs.
### Task 8 — i18n housekeeping
- `npm run i18n:inventory` — the inventory goes from 219 to 241 keys; commit the regenerated
  `docs/i18n/string-inventory.md`.
- Write `docs/i18n/mk-review-2.11.md` on the model of `mk-review-2.03.md`: same three review columns
  (Verdict / Corrected MK / Reviewer), the same "faults not taste" instruction, scoped to the 22 new
  MK strings, and **committed unsigned**. State in it that the two "not confirmed yet" sentences in
  `a5` and `a7` are deliberate and must not be polished into finished-sounding text.
- `tests/i18n/catalog-parity.test.ts` must stay green.
### Task 9 — Close the phase
`Decisions.md` (the five entries above, plus any of your own), `current-state.md` (Status section,
Last updated + By, **line 1 untouched**, both registers explicitly recorded as unchanged),
`file-map.md` (four new files), and the completion report at
`src/_project-state/completions/Part-2-Phase-11-Completion.md` from the template. Open a PR to
`main` from `phase-2.11-home-faq`. **Do not merge it yourself** — an operator authorises the merge
(`D-0-3`).
---
## Definition of Done
### Verified by you
- [ ] `npm run build` exits 0, `npx tsc --noEmit` clean, `npm run lint` clean.
- [ ] `npm test` green, including `10 simultaneous orders against 3 units → exactly 3 succeed`
      (it must be untouched — no commerce code changed) and the i18n catalog-parity test. Report the
      real total; it was 93/93 before this phase and the new SEO test adds to it.
- [ ] The FAQ renders under the hero on `/` and `/en` in **all three** drop states — check with the
      dev preview switch (countdown, live, ended) — and does not shift or overlap the hero.
- [ ] MK build shows **zero** English strings in the section; EN build shows zero Macedonian.
- [ ] Exactly 8 questions in 3 groups, in the order specified. No `[PLACEHOLDER: …]` marker anywhere
      in the diff (`grep -rn "PLACEHOLDER" src/messages/ src/components/home/`).
- [ ] Every answer traced to its row in the source-trace table; any row you could not trace was
      dropped and named in the report. `facts.md` is byte-unchanged.
- [ ] Keyboard: Tab reaches every question, Enter and Space toggle it, focus ring is visible on every
      `<summary>`, and focus never gets trapped. Opening one row closes the previously open one in a
      browser that supports `name` on `<details>`.
- [ ] Rows animate open and the icon rotates; with `prefers-reduced-motion: reduce` set in the OS,
      both are effectively instant.
- [ ] axe reports **zero serious/critical** on `/` and `/en`; exactly one `h1` on the page; heading
      order h1 → h2 → h3 with no skips.
- [ ] `curl -s localhost:3000/ | grep -o '"@type":"FAQPage"'` matches, the node carries 8 questions,
      and the answer text in it is identical to the rendered text.
- [ ] `git diff main` contains **no** literal hex / `rgb()` / `hsl()` outside comment prose, **no**
      new entry in `package.json`, and **no** change under `supabase/`, `src/config/`,
      `src/lib/orders/`, `src/lib/drop/`, cart or checkout.
- [ ] Line 1 of `current-state.md` is unchanged and still reads `NEXT: 2.06 …`.
- [ ] Screenshots taken at 390px wide and at desktop width, both locales, with at least one row open,
      and described in the completion report.
### Owed to Lazar (goes on the owed-verification register)
| # | Item | How he checks it | Pass looks like |
|---|---|---|---|
| 1 | Native MK review of the 22 new strings | `docs/i18n/mk-review-2.11.md`, with Petar | Both boxes signed, faults listed |
| 2 | The section on a real phone, from an Instagram link | Open `https://www.trajanovv.com` on a phone | Rows tappable, text readable, animation smooth, nothing overlaps the hero |
| 3 | Sign-off that eight questions is the right amount for the front door | Look at the rendered page | He says yes, or names what to add — the additions come from Y.01 content |
---
## Outputs & where they go
| Output | Path |
|---|---|
| Component | `src/components/home/HomeFaq.tsx` |
| Key list (single source) | `src/lib/faq.ts` |
| Structured data | `src/lib/seo/faq-jsonld.ts` + `tests/seo/faq-jsonld.test.ts` |
| Copy | `src/messages/mk.json`, `src/messages/en.json` |
| Styles | `src/app/globals.css` (appended block) |
| MK review pack | `docs/i18n/mk-review-2.11.md` (unsigned) |
| Regenerated inventory | `docs/i18n/string-inventory.md` |
| Completion report | `src/_project-state/completions/Part-2-Phase-11-Completion.md` |
| Branch / PR | `phase-2.11-home-faq` → PR to `main`, **merged by an operator, not by you** |
