# Facts audit — Phase 2.03

**Every rendered user-facing claim on `trajanov.com`, walked back to a source.** This is the phase's
audit deliverable (brief Task 2). It exists so that nothing on the site is there because it *sounded
right* — every factual assertion traces to a **VERIFIED** entry in `facts.md`, to shipped code / a
logged decision, to a logged placeholder, or it is pure UI copy that asserts nothing.

- **Scope:** every string in `src/messages/mk.json` + `src/messages/en.json` (150 pre-2.03 keys, MK
  and EN key sets identical), every page that renders one, plus rendered **non-catalog** data (the
  About press list, the phone, the Instagram handle). **Part A** is the pre-existing site, walked
  **before** the three legal pages were written (Task 2 ordering). **Part B** is the new legal-page
  copy this phase adds, appended after it was authored.
- **Sources cited:** `facts.md` §1–§10; migration files under `supabase/migrations/`; `src/lib/…`;
  `Decisions.md`.

## Status vocabulary

| Status | Meaning |
|---|---|
| **VERIFIED** | Traced to a **VERIFIED** `facts.md` entry (section cited), **or** — for operational commitments (48h hold, 2-per-order, COD, atomic stock, bot check, rate limit) — to **shipped code / a logged decision**, cited by file. Decision 5 of the brief explicitly sanctions *"what the store actually does … traceable to `facts.md` or to shipped code"* as the standard for these pages, so "code-traced" is a first-class VERIFIED basis, not a dodge. Rows carry `§n` (facts.md) or `code:` (source) so the two are never blurred. |
| **PLACEHOLDER** | A deliberate, logged `[PLACEHOLDER: …]` marker. Register row cited. |
| **NOT A CLAIM** | Pure UI copy — button/field/nav labels, generic errors, countdown units, internal styleguide. Asserts no brand/product/operational fact. |
| **UNSOURCED** | A factual assertion with no source. **Every one is a finding** and must be re-traced, reworded, removed, or converted to a logged placeholder. **Zero may remain.** |

---

## Part A — the pre-existing site (150 keys + rendered data)

To keep the table legible, runs of uniformly **NOT A CLAIM** UI labels are grouped by namespace with
their keys listed; every **claim-bearing** key gets its own row. All 150 keys are accounted for in the
counts below.

### A.1 — About page (the densest factual surface)

Every About claim is traced to a specific `facts.md` section by number, per the DoD.

| Claim (EN gloss) | Message key | Rendered on | `facts.md` source | Status |
|---|---|---|---|---|
| Clothing brand from Strumica, founded 2026 | `About.body1` | /about | §1 (Base; Founded) | VERIFIED |
| Run by one person — Vladimir Trajanov, founder + designer; student at SOU „Никола Карев", clothing-design technician; no team; makes oversized unisex tees | `About.body1` | /about | §2 (person, role, school, field; team = Vladimir only); §7 (product type) | VERIFIED |
| June 2026 — won **first place** in a t-shirt design competition for secondary-school students from NMK fashion/textile schools | `About.body2` | /about | §3 | VERIFIED |
| Organised by Креативен ден, Божиловиќ продукција, СОУ „Таки Даскало", EAM of Štip; judged by a jury from Kreativen den + EAM; aim = show ideas/talent + a portfolio reference | `About.body2` | /about | §3 | VERIFIED |
| Prize = 30 tees made with his design + a visit to the EAM factory | `About.body3` | /about | §3 | VERIFIED |
| Sells in drops of 3–5 pieces, real + limited stock; ships NMK only; cash on delivery | `About.body3` | /about | §7 (products/drop; shipping; payment) | VERIFIED |
| "Strumica · 2026" | `About.eyebrow` | /about | §1 (Base; Founded) | VERIFIED |
| "One brand, one designer." | `About.h1` | /about | §2 (team = Vladimir only) | VERIFIED |
| "In the press" (heads the coverage list) | `About.pressHeading` | /about | §4 (five outlets VERIFIED) | VERIFIED |
| The approved quote — „Мојот план е да започнам со свој бренд со наградата од ЕАМ" | `About.quote` | /about | §3 (approved quote; matches Трн.мк verbatim) | VERIFIED |
| Attribution — Владимир Трајанов, Трн.мк, 12.06.2026 | `About.quoteAttribution` | /about | §3 / §4 (Трн.мк, 12.06.2026) | VERIFIED |
| "Translated from Macedonian" (EN only; MK empty by design) | `About.quoteNote` | /about (EN) | `D-1.05-6` (marked translation) | NOT A CLAIM |
| "Browse the catalog" (link) | `About.toCatalog` | /about | — | NOT A CLAIM |
| **Press list — 5 outlet names + URLs + dates** (page constant, not a message key) | `PRESS[]` in `about/page.tsx` | /about | §4 (all five VERIFIED 2026-07-15; URLs char-exact; listed, never characterised — `D-1.05-5`) | VERIFIED |

### A.2 — Contact page

| Claim (EN gloss) | Message key | Rendered on | Source | Status |
|---|---|---|---|---|
| "Strumica, North Macedonia · Ships within NMK only · Cash on delivery." | `Contact.context` | /contact | §1 (base); §7 (shipping; payment) | VERIFIED |
| "Drops are announced here. This is the main channel." | `Contact.instagramNote` | /contact | §6 ("Instagram is the primary sales channel") | VERIFIED |
| Phone **078 820 520** → `tel:+38978820520` (page constant) | `PHONE_DISPLAY`/`PHONE_TEL` in `social.ts` | /contact, footer | §5 (VERIFIED; local display format is a §5-permitted choice, `D-1.05-9`) | VERIFIED |
| Instagram **@trajanovv2026** (page constant) | `INSTAGRAM_*` in `social.ts` | /contact, footer, drop-ended banner | §6 (handle VERIFIED; only social account) | VERIFIED |
| Email — visible `[PLACEHOLDER: е-пошта — Владимир]` | `Placeholder.email` | /contact | Register #5 (email exists, deliberately unpublished — `D-Z.01-3`) | PLACEHOLDER |
| Eyebrow / H1 / phone-label / IG-label / email-label | `Contact.eyebrow`, `Contact.h1`, `Contact.phoneLabel`, `Contact.instagramLabel`, `Contact.emailLabel` | /contact | — | NOT A CLAIM |

### A.3 — Home

| Claim (EN gloss) | Message key | Rendered on | Source | Status |
|---|---|---|---|---|
| "3 to 5 pieces. Real, limited stock. Cash on delivery." | `Home.sub` | / | §7 (products/drop; payment) | VERIFIED |
| "First place in a design competition" (About link) | `Home.aboutLink` | / (countdown + ended states) | §3 | VERIFIED |
| "When the timer hits zero, the drop is live." | `Home.headline` | / | code: server-computed drop window (`src/lib/drop/state.ts`, `D-1.04-9`) | VERIFIED |
| Title / tagline / eyebrow / "Opening…" / "Browse while you wait" | `Home.title`, `Home.tagline`, `Home.eyebrow`, `Home.opening`, `Home.browseWhileWait` | / | — | NOT A CLAIM |

### A.4 — Shipping / payment / commerce statements (site-wide)

| Claim (EN gloss) | Message key | Rendered on | Source | Status |
|---|---|---|---|---|
| "We ship inside North Macedonia only. We can't deliver outside the country. Cash on delivery." | `Common.shippingNotice` | product buy panel, checkout | §7 (shipping NMK only; payment COD) | VERIFIED |
| "North Macedonia only. Cash on delivery." | `Product.shippingBody` | product (below-fold) | §7 | VERIFIED |
| Currency label "ден" / "MKD" | `Common.currency` | product, cards | §7 (currency MKD, no USD — `D-2.01-8`) | VERIFIED |
| "You pay cash on delivery. No online payment." | `Checkout.codSummary` | checkout | §7 (payment); code: no payment integration exists | VERIFIED |
| "Cash on delivery." | `Cart.codNote` | cart | §7 | VERIFIED |
| "Your order reserves stock for 48 hours." | `Checkout.reserveNote` | checkout | code: `orders.reserved_until` + `create_order()` 48h hold + `expire_reservations()` pg_cron (`D-1.03-2`, `D-1.04-2`) | VERIFIED |
| "Order {n} received and reserved for 48 hours. You pay cash on delivery — we'll call you to confirm." | `Order.success` | checkout success | code: 48h reservation (above); §7 (COD); Z.01 notification email → Vladimir phones to confirm (`D-Z.01-5`) | VERIFIED |
| "Max 2 items per order — stock is limited and reserved when you order." | `Cart.capNotice` | cart | code: `create_order()` cap = 2 total units + reservation model (`D-1.06-6`) | VERIFIED |
| "Max 2 items per order." | `Product.oneUnitLimit`, `Order.capViolated` | product, checkout | code: `create_order()` cap = 2 | VERIFIED |
| "The drop is live — stock is real and limited." | `Catalog.live` | /catalog | §7 (limited drops); code: real per-size stock in `variants` | VERIFIED |
| "The drop isn't open yet … buying unlocks when the timer hits zero." | `Catalog.countdownIntro` | /catalog | code: server drop window (`D-1.04-9`) | VERIFIED |
| **"Shipping — calculated on delivery"** (order-summary value) | `Cart.shipping`, `Cart.shippingValue` | cart | §7 (COD — all money settled at the door); **see Finding F-2 — the delivery *cost* itself is an owed placeholder this phase** | VERIFIED (operational) · flagged |

### A.5 — Order/checkout system messages

Error and status copy that asserts an operational fact is **VERIFIED (code)**; a generic error or a
bare field/interaction label is **NOT A CLAIM**.

| Claim (EN gloss) | Message key | Source | Status |
|---|---|---|---|
| "Someone got there first. The last one just went." | `Order.soldOut` | code: atomic conditional decrement, `create_order()` (`D-1.03-11`) | VERIFIED |
| "You already have a live order with this number for this drop." | `Order.duplicatePhone` | code: `orders_one_live_per_phone_per_drop` unique index | VERIFIED |
| "Too many attempts from this network…" | `Order.rateLimited` | code: `check_order_rate_limit()` (`D-1.04-7`) | VERIFIED |
| "The drop isn't open right now." | `Order.notOpen` | code: server drop window | VERIFIED |
| "Our mistake: no price is set. You weren't charged. Try later." | `Order.priceMissing` | code: `TR006 price_missing` before any decrement (`D-1.04-6`); COD → nothing charged | VERIFIED |
| Bot-check copy: "Bot protection." / "Confirm you're not a robot." / "That check didn't pass." | `Order.protected`, `Checkout.botCheck`, `Order.turnstileFailed` | code: real Turnstile Siteverify (`D-1.07-7`) | VERIFIED |
| Generic errors / empty-cart / no-drop | `Order.genericError`, `Order.emptyCart`, `Order.noDrop` | — | NOT A CLAIM |
| Checkout field labels + validation: contact/name/phone/city/address/note/notePlaceholder/errorRequired/errorPhone/verifying/summary/placeOrder/title | `Checkout.*` (14 keys) | — | NOT A CLAIM |

### A.6 — Metadata (`<title>` / `<meta description>`, both locales)

Meta strings are user-facing (SERP + social share) and carry claims; all trace to §1/§3/§7.

| Claim cluster | Message keys | Source | Status |
|---|---|---|---|
| "Oversized unisex t-shirts from Strumica, limited drops, 3–5 pieces, real limited stock, cash on delivery" | `Meta.siteTitle`, `Meta.siteDescription`, `Meta.homeTitle`, `Meta.homeDescription`, `Meta.catalogTitle`, `Meta.catalogDescription`, `Meta.productDescription`, `Meta.checkoutDescription`, `Meta.cartTitle`, `Meta.cartDescription`, `Meta.checkoutTitle` | §1 (base); §7 (product type, drops, shipping, payment, currency) | VERIFIED |
| "One brand, one designer from Strumica. The story behind Trajanov." | `Meta.aboutTitle`, `Meta.aboutDescription` | §1; §2; §3 | VERIFIED |
| "Get in touch: phone and Instagram. Strumica, NMK." | `Meta.contactTitle`, `Meta.contactDescription` | §1; §5; §6 | VERIFIED |
| Internal design-system meta | `Meta.styleguideTitle`, `Meta.styleguideDescription` | internal surface (`D-2.01-4`) | NOT A CLAIM |

### A.7 — Navigation, brand, countdown, stock, buy, cart-UI (labels)

| Key group | Keys | Status |
|---|---|---|
| Brand wordmark / trading name | `Nav.brand` (TRAJANOV) | VERIFIED (§1 trading name) |
| Location line | `Nav.location` (Strumica, North Macedonia) | VERIFIED (§1) |
| Nav labels | `Nav.home`, `Nav.catalog`, `Nav.cart`, `Nav.about`, `Nav.contact` | NOT A CLAIM |
| Countdown units + banner | `Drop.days/hours/minutes/seconds/nextDrop/live/ended/remaining/liveNow` | NOT A CLAIM |
| Follow-for-next (uses IG handle) | `Drop.endedFollow` | VERIFIED (§6 handle) |
| Stock status labels (driven by real stock) | `Stock.inStock/low/soldOut` | NOT A CLAIM |
| Buy-button states | `Buy.add/adding/comingSoon/soldOut/viewProduct/added/viewCart` | NOT A CLAIM |
| Catalog labels/status | `Catalog.title/empty/ended` | NOT A CLAIM |
| Product labels | `Product.back/size/sizeGuide/details/chooseSize/composition` | NOT A CLAIM |
| Cart labels | `Cart.title/empty/backToDrop/size/qty/remove/decrease/increase/subtotal/total/checkout` | NOT A CLAIM |
| Language switch | `Common.languageMk/languageEn/switchLanguage` | NOT A CLAIM |

### A.8 — Placeholders (logged) and internal-only strings

| Key | Register row | Status |
|---|---|---|
| `Placeholder.productPhoto` | #2 (product photos — Vladimir) | PLACEHOLDER |
| `Placeholder.composition` | #3 (fabric/care from labels) | PLACEHOLDER |
| `Placeholder.productName` | #4 (real names) | PLACEHOLDER |
| `Placeholder.sizesSample` | #4 (size-measurement chart) | PLACEHOLDER |
| `Placeholder.email` | #5 (email, unpublished — `D-Z.01-3`) | PLACEHOLDER |
| `Placeholder.price` | #1 **(cleared 2026-07-18 — 1199 MKD real);** the string is the null-price fallback mechanism, still present | PLACEHOLDER (mechanism; #1 cleared) |
| `Placeholder.notice` + all `Styleguide.*` (13 keys) | internal design-system surface, never a customer page (`D-2.01-4`) | NOT A CLAIM |

---

## §10 fabrication check (`grep`-verified)

`facts.md` §10 lists what the brand does **not** have; none of it may appear on the site. Checked
across `src/messages/*` and `src/app/*`:

| §10 item | Present on site? | Evidence |
|---|---|---|
| Customer reviews / ratings / stars | **No** | `grep` "review/rating/star" → only "p**review**" (styleguide-internal) and "**star**t" (in the About quote). No review widget, no stars, no counts. |
| Testimonials | **No** | none. |
| Awards beyond the single 2026 win | **No** | only the one competition win (§3) on About; no "award-winning". |
| Stockists / retailers / partners | **No** | EAM appears **only** on About, as the competition organiser + the factory Vladimir visited as prize + the quote (§3) — never as partner, sponsor, or stockist. `grep` "partner/stockist" → none. |
| Sustainability / ethical / manufacturing claims | **No** | `grep` "sustainab/ethical/одржлив/еколош" → none. |
| Customer / order counts ("X sold", "join N") | **No** | none. `Buy.soldOut` / `Order.soldOut` are per-item states, not counts. |
| Founding story beyond the sourced win | **No** | About tells only the §3 competition story. |
| Second location / atelier / studio | **No** | `grep` "atelier/studio/ателје/студио" → none. |
| A team | **No — the opposite** | About states "No team" / "Нема тим" (matches §2, "Vladimir only"). Honest negation, not an invented team. |

**Result: clean.** Nothing from §10 is asserted anywhere on the site.

---

## Findings

The audit's most valuable output is any claim the live site makes that its sources do not support.
Two are surfaced here (and in the completion report — **not fixed quietly**).

### F-1 — `facts.md` §1 and the site disagreed on the responsible party *(resolved this phase)*

`facts.md` §1 read `Responsible party | Vladimir Trajanov and his parents | VERIFIED`, but no page
had ever named a responsible party — and the orchestrator (with Lazar) has now decided the legal
pages name **Vladimir Trajanov alone**, no parent (`D-2.03-1`). Left unamended, the file and the new
Terms/Privacy pages would contradict each other on the single most consequential identity claim on
the site.

**Resolution:** `facts.md` §1 amended (Task 7) so the **displayed** responsible party (Vladimir
Trajanov alone, `D-2.03-1`) and the underlying VERIFIED intake fact both stand in the row without
either being deleted; the §1 open flag (confirm legal responsibility with the parents) is **kept** as
an owner item. A new owed-verification row records that **no lawyer has read these pages and the named
party is a minor.**

### F-2 — the cart's "Shipping — calculated on delivery" rides against an owed fact *(surfaced; not resolved in code this phase)*

The cart order-summary shows `Shipping: calculated on delivery` (MK `се пресметува при подигање`).
It is not *false* — the app computes no shipping fee and everything is settled at the door under COD
(§7) — and it states **no amount**, so it is not the dangerous case (an invented delivery cost the
customer is asked for at the door). But this same phase adds a **visible placeholder** on
`/shipping-returns` admitting we do **not** know the courier, delivery time, or delivery cost. The
cart's confident "calculated on delivery" and the shipping page's "we don't know the delivery cost
yet" sit in tension.

**Why not fixed here:** the cart is explicitly **out of scope** for this phase, the string passed the
2.02 native-MK review, and the only *correct* rewrite depends on the very courier terms Vladimir still
owes. Rewording it now would either invent detail or replace one hedge with another.

**Recommendation (for the orchestrator):** when Vladimir supplies courier + delivery-cost terms (the
`/shipping-returns` placeholder, register), revisit the cart's shipping line in the same pass so the
two surfaces state the same true thing. Logged as `D-2.03-6`.

*No bare `UNSOURCED` row remains: F-1 is resolved by the §1 amendment; F-2 is a true-but-watch
operational line, surfaced rather than hidden.*

---

## Counts — Part A (150 pre-2.03 message keys + 3 rendered constants)

| Category | Count | Notes |
|---|---|---|
| **Examined** | **153** | 150 message keys + PRESS list + phone + IG (3 rendered non-catalog constants) |
| **VERIFIED — `facts.md`-traced** | 40 | About (13) + Contact (4) + Home (2) + shipping/COD/currency (5) + Meta claim clusters (counted as their keys, 13) + Nav brand/location (2) + Drop.endedFollow (1); press/phone/IG constants (3) |
| **VERIFIED — code/decision-traced** | 15 | 48h reservation, 2-per-order (×2), COD-no-online-payment, live-stock, countdown-unlock, sold-out, duplicate-phone, rate-limited, not-open, price-missing, 3× bot-check, home headline |
| **PLACEHOLDER (logged)** | 6 | `Placeholder.productPhoto/composition/productName/sizesSample/email/price` (registers #1–#5) |
| **NOT A CLAIM** | 92 | nav/buttons/fields/errors/countdown/stock/labels/styleguide (13 internal) |
| **UNSOURCED — found** | **2** | F-1 (`facts.md` §1 contradiction); F-2 (cart shipping line, flagged) |
| **UNSOURCED — resolved** | **2 → 0 remain** | F-1 by the §1 amendment (`D-2.03-1`); F-2 surfaced as a true-but-watch operational line + recommendation (`D-2.03-6`). No bare UNSOURCED row stands. |

*(Category totals sum to more than 153 only where a single Meta/press cluster row covers several keys;
every one of the 150 keys + 3 constants falls into exactly one status. The takeaway the DoD asks for:
**zero claims on the live site are unsupported once F-1 and F-2 are resolved.**)*

---

## Part B — the new legal pages (this phase)

*Appended after the Terms / Privacy / Shipping & Returns copy was authored (Task 2 ordering: Part A
first, then the pages, then this section). Every new claim is written to a source by construction: no
statute is cited (Decision 5), the responsible party is Vladimir Trajanov alone (`D-2.03-1`), the
email stays unpublished, and no cookie banner is added (Decision 4).*

### B.1 — Terms (`/terms` · `/uslovi`)

| Claim (EN gloss) | Message key | Source | Status |
|---|---|---|---|
| "A small brand with no company behind it." | `Terms.intro` | §1 (legal entity: none) | VERIFIED |
| Run by **Vladimir Trajanov, Strumica**; no registered company; no shop with an address | `Terms.sellerBody` | §1 (base; legal entity none; no address — a VERIFIED absence); `D-2.03-1` (Vladimir alone) | VERIFIED |
| Reach us by phone or Instagram (rendered from `social.ts`; email NOT shown) | `Terms.contactBody` | §5 (phone); §6 (IG); register #5 keeps the email unpublished | VERIFIED |
| COD only — no cards, no bank transfer, no paying in advance | `Terms.paymentBody` | §7 (payment COD); code: no payment integration exists | VERIFIED |
| Ships North Macedonia only, no delivery abroad | `Terms.shippingBody` | §7 (shipping) | VERIFIED |
| Order reserves stock 48h (not sold on the spot); we call to confirm; if unreachable the reservation lapses and stock returns | `Terms.orderingBody1` | code: `create_order()` 48h hold + `orders.reserved_until` + `expire_reservations()` (`D-1.03-2`); Z.01 call-to-confirm (`D-Z.01-5`) | VERIFIED |
| Max 2 items per order; drops limited, stock real — "when it's gone, it's gone" | `Terms.orderingBody2` | code: `create_order()` cap = 2; §7 (limited drops) | VERIFIED |
| Prices in MKD, on the product page, what you pay the courier; no currency conversion | `Terms.pricesBody` | §7 (MKD; no USD — `D-2.01-8`) | VERIFIED |
| No accounts, no saved cards, no subscriptions, no discount codes | `Terms.noBody` | code: none of these exist in the codebase | VERIFIED |
| Eyebrow / h1 / section headings | `Terms.eyebrow/h1/*Heading` | — | NOT A CLAIM |

### B.2 — Privacy (`/privacy` · `/privatnost`)

Every collected-field claim was checked against the actual `orders` table in
`supabase/migrations/20260715021215_schema.sql`: columns `customer_name`, `phone` / `phone_normalized`,
`city`, `address`, `notes` — and **no email column** (`D-Z.01-1`).

| Claim (EN gloss) | Message key | Source | Status |
|---|---|---|---|
| "We collect only what we need … nothing more." | `Privacy.intro` | schema (below) | VERIFIED |
| Collects name, phone, city, address, optional note — and **no email** (no email field) | `Privacy.collectBody` | `20260715021215_schema.sql` (`orders` columns); `D-Z.01-1` (no email collected) | VERIFIED |
| Used only to deliver + call to confirm | `Privacy.whyBody` | operational (order path + Z.01) | VERIFIED |
| Seen by Vladimir + the courier; order details emailed to Vladimir so he can call | `Privacy.whoBody` | `D-Z.01-5` (order-notification email to Vladimir) | VERIFIED |
| Stored in a database hosted in **Frankfurt, Germany** | `Privacy.storageBody` | infra: hosted Supabase `eu-central-1` Frankfurt (`current-state` / 1.07) | VERIFIED |
| Ordering is free, so a **one-way hashed** IP is stored to rate-limit; the **raw IP is never stored** | `Privacy.abuseBody` | code: `src/lib/rate-limit/hash.ts` (SHA-256 + pepper, hash only to DB — `D-1.04-7/14`) | VERIFIED |
| Cart lives in `sessionStorage`, dies with the tab; **no advertising / tracking / analytics / social cookies** | `Privacy.browserBody` | code: `cart-store.ts` sessionStorage (`D-1.06-5`); Decision 4 (no cookies set) | VERIFIED |
| Delete your data by phone; no form, no portal | `Privacy.deleteBody` | §5 (phone); operational: no portal exists (no invented form/email/portal) | VERIFIED |
| Responsible: **Vladimir Trajanov, Strumica, North Macedonia** | `Privacy.responsibleBody` | §1; `D-2.03-1` | VERIFIED |
| Eyebrow / h1 / section headings | `Privacy.eyebrow/h1/*Heading` | — | NOT A CLAIM |

### B.3 — Shipping & Returns (`/shipping-returns` · `/isporaka-i-vrakjanje`)

| Claim (EN gloss) | Message key | Source | Status |
|---|---|---|---|
| Ships NMK only (reuses the shared `ShippingNotice`) | `ShippingReturns.whereHeading` + `Common.shippingNotice` | §7 (already VERIFIED in Part A; reused, not re-worded) | VERIFIED |
| Pay the courier in cash on arrival | `ShippingReturns.paymentBody` | §7 (COD) | VERIFIED |
| "We don't have courier / time / cost confirmed yet; we won't guess" | `ShippingReturns.deliveryBody` | states an **owed** fact honestly (does not assert a time or cost) | NOT A CLAIM |
| Visible `[PLACEHOLDER: courier, delivery time and delivery cost — Vladimir]` | `Placeholder.courier` | **new register row** (owner Vladimir) | PLACEHOLDER |
| Wrong size / damaged / not arrived → call the phone, Vladimir sorts it directly | `ShippingReturns.problemBody` | §5 (phone); operational (honest — no formal returns process claimed) | VERIFIED |
| No online returns portal, no prepaid return label; returns go through the phone | `ShippingReturns.limitsBody` | operational: neither exists (stated plainly, per brief) | VERIFIED |
| "We don't have the exact returns/exchange window confirmed yet" | `ShippingReturns.returnsBody` | states an **owed** fact honestly (**no** statutory withdrawal period cited — Decision 5) | NOT A CLAIM |
| Visible `[PLACEHOLDER: returns and exchange window — Vladimir]` | `Placeholder.returnsWindow` | **new register row** (owner Vladimir) | PLACEHOLDER |
| Eyebrow / h1 / intro / section headings | `ShippingReturns.eyebrow/h1/intro/*Heading` | — | NOT A CLAIM |

### B.4 — Metadata + nav for the new pages

| Claim cluster | Message keys | Source | Status |
|---|---|---|---|
| "How ordering works: COD, NMK only, 48h reservation" | `Meta.termsTitle`, `Meta.termsDescription` | §7; code (48h) | VERIFIED |
| "What we collect … name, phone, city, address — no email, no advertising cookies" | `Meta.privacyTitle`, `Meta.privacyDescription` | schema; `D-Z.01-1`; Decision 4 | VERIFIED |
| "Shipping NMK only, cash on delivery. If something is wrong, call us." | `Meta.shippingTitle`, `Meta.shippingDescription` | §7; §5 | VERIFIED |
| Footer nav labels | `Nav.terms`, `Nav.privacy`, `Nav.shipping`; `Common.lastUpdated` | — | NOT A CLAIM |

### Counts — Part B (63 new keys)

| Category | Count |
|---|---|
| **Examined** | **63** (new message keys) |
| VERIFIED — `facts.md`-traced | 14 (Terms 6, Privacy 3, Shipping 2, Meta clusters 3) |
| VERIFIED — code / infra / decision-traced | 12 (48h, cap, no-payment, no-accounts, schema-field-list, notification-email, Frankfurt, IP-hash, sessionStorage/no-cookies, no-portal, delivery-honesty operational) |
| PLACEHOLDER (new register rows) | 2 (`Placeholder.courier`, `Placeholder.returnsWindow`) |
| NOT A CLAIM | 35 (eyebrows, h1s, intros, section headings, nav labels, last-updated) |
| **UNSOURCED** | **0** — every new claim is written to a source by construction |

**No statute, article, directive, or statutory withdrawal period is cited on any of the three pages**
(`grep`-verified across the new strings — see the completion report). **No cookie banner or consent UI
was added** — the Privacy page only *states* what is and is not stored. **The email is not published**
on any of the three pages.

---

## Bottom line

- **Existing site (Part A):** 2 findings — F-1 (the `facts.md` §1 responsible-party contradiction,
  resolved by the §1 amendment) and F-2 (the cart's "calculated on delivery", surfaced not reworded).
  **Zero bare UNSOURCED rows remain.**
- **New legal pages (Part B):** every claim traces to `facts.md`, shipped code/infra, or a logged
  decision; the two genuine unknowns (delivery cost/time, returns window) ship as visible, registered
  placeholders rather than guesses. **Zero UNSOURCED.**
- **§10 check:** clean — no reviews, ratings, testimonials, counts, stockists, partners, sustainability
  claims, team, or second location anywhere on the site.
