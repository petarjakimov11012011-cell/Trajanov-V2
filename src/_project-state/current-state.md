NEXT: **⚠ RUN `supabase db push` — the Y.06 migration is NOT on hosted, and until it is, `main` and the production database disagree (owed **#68**, `D-Y.06-11`).** **Then [P2] `/impeccable polish` + the closing `/impeccable audit` — on a NEW branch (`D-2.25-26`).** **Phase Y.06 — Composition & care wiring + removal of the 2-item order cap — COMPLETE and MERGED (2026-08-27, PR [#41](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/41), merge `7ad80f1`, on Petar's explicit instruction — `D-Y.06-10`: operator-authorised per `D-0-3`, **without** the fresh-session review the brief required, so nobody should read "merged" as "reviewed"; branch deleted, refs pruned, one-branch rule re-armed; `D-Y.06-1…11`).** **Production deploy VERIFIED on `https://www.trajanovv.com` (2026-08-27, after merge):** the per-order-limit copy is **gone from every route, both locales** (16 routes swept, 0 hits) — Terms serves the shortened paragraph, Home serves the rewritten FAQ answer („Колку што има на залиха…" / "As many as are in stock…"), and the buy panel carries no standing line; **all six product pages still show the composition placeholder and still emit ZERO `Product` JSON-LD nodes** (the care half is byte-unchanged in production, exactly as `D-Y.06-2` intended). **⚠ THE HOSTED DATABASE STILL ENFORCES THE OLD CAP** — verified read-only: `schema_migrations` tops out at `20260716120000`, `create_order()` step 3 still reads `> 2`, `order_items_quantity_check` still reads `between 1 and 2`. **This is LATENT, not live:** the only hosted drop ended 2026-06-08, so nothing is buyable and every order is refused at `TR002` before `TR003` can fire. **It goes live the moment a drop opens** — a customer would be told nothing anywhere, fill in the whole checkout form, and be refused at the final click. `supabase db push` fixes it; **never** `supabase db reset --linked` (`D-1.07-15`), even though hosted `orders` is empty today. Owed rows **#66** (native MK review of the four changed strings) and **#67** (a real 3-unit order on production at the 2.06 rehearsal) carry forward. Placeholder rows **#3/#9** unchanged and still OPEN. Nothing on the critical path moved: **Y.01** (drop content load) is still the gate.

# Current state — Trajanov-V2

**This file is the single source of truth for project status.** The orchestrator reads it before
every brief. Nobody's memory outranks it. Line 1 is always the `NEXT:` line — Code updates it when
closing every phase.

Last updated: **2026-07-29** · By: **Claude Code (Phase 2.25 merged to `main` — PR #40, `daa91e6`, production verified; `D-2.25-26`)**

---

## Status

**Phase 2.25 — Impeccable pass — COMPLETE and MERGED (2026-07-29, PR
[#40](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/40), merge `daa91e6`, on Petar's
explicit instruction after his localhost review — `D-0-3`: operator-authorised, not Code; branch
deleted, remote + local refs pruned).** Merged **early, with four of its six planned items**
(`D-2.25-26`): P0 `typeset` + P1 `harden`/`optimize`/`adapt`/`animate` + the owner items
(`D-2.25-22…25`). **[P2] `/impeccable polish`** and the **closing `/impeccable audit`** move to a
future branch — the one-phase-branch rule is re-armed. Production deploy **VERIFIED** on
`https://www.trajanovv.com` ~5 min after merge (numbers in the `NEXT:` line above; both locales, one
preload, one `<h1>`, zero cross-locale leakage, catalog photo at its exact committed bytes).

**P0 — `/impeccable typeset` (earlier session, `87efc6b` + `27b589d`, `D-2.25-1…4`):** `cn()` in
`src/lib/utils.ts` now uses `extendTailwindMerge` to register the seven brand font-size tokens under
the `font-size` class group. Before this, `tailwind-merge` filed every brand size as a **colour**, so
`cn('text-small …', 'text-muted-foreground')` silently deleted the size — the countdown, header nav
and language switch had been rendering at the 16px body default **since Phase 1.04, in production**.
Measured `main` → branch: `/styleguide` countdown **16px → 88px**, nav **16px → 13px**, language
switch **16px → 13px**. All stock `text-sm` codemodded to `text-small`; `text-xs`/`text-base`/
`text-lg`/`text-3xl` deliberately left for P2 (`D-2.25-4`, owner's call).

**P1 — `/harden` · `/optimize` · `/adapt` · `/animate` (this session, `a881dcd` + `13246fd`,
`D-2.25-5…14`). Every number below was measured on BOTH sides — the P0 baseline was put back in the
tree with `git checkout 27b589d -- src/` after committing, measured, then restored `git checkout HEAD
-- src/` (diff-proven empty), the `D-2.24-2` loop.**

**`/harden`:** `CheckoutField` **passed `required` through its textarea branch** — the input branch
had it and the textarea did not, so `ContactForm`'s message field rendered a `*` in its label with
**no required semantics at all** (baseline: `textarea.required === false`). The error `<p>` became a
**PERSISTENT `role="alert"` region** — in the DOM from first paint, `sr-only` and empty until it has
something to say, with `aria-describedby` wired unconditionally. Baseline: **zero** `[role="alert"]`
elements existed **before or after** a failed submit, so a screen-reader user was told nothing at all.
`sr-only` is `position: absolute`, so the empty region costs no layout — field wrapper measured
**71.5px on both sides** with no error and **97px on both sides** with one. Both forms now **move
focus to the first invalid field in DOM order** (`src/lib/forms/first-invalid.ts`, pure + 7 unit
tests) rather than error-map insertion order; baseline focus stayed on the submit button. Checkout
also focuses `phone` when the **server** rejects a phone the client accepted. Error text **stays
13px** (`text-small`, `brand.md` §4, `D-2.25-6`) — measured 13px / 19.5px line-height /
`rgb(240,133,122)`; what it needed was announcement and focus, not size.

**`/optimize`:** `NextIntlClientProvider` is scoped to the **14 of 23** namespaces reachable from a
`'use client'` boundary (`src/i18n/client-namespaces.ts`), including modules that carry no directive
of their own and become client code when a client component imports them. Measured MK on **production builds of
both sides**: **25,039 → 8,990 UTF-8 bytes** of serialized messages in the HTML of `/`, `/kontakt`,
`/uslovi` and `/katalog` alike — **−16,049 B, −64.1%** (served HTML `/` 81,023 → 70,602, `/kontakt`
68,046 → 52,771). The `16,308 → 6,241` figure quoted in `D-2.25-7` and commit `a881dcd` is the
**character** count, corrected on the record by `D-2.25-18`; `Footer Faq About Terms Privacy ShippingReturns Catalog
Styleguide Meta` withheld. The Terms page title was provably sitting in the Contact page's HTML
before. All **28 routes** (15 MK + 13 EN, incl. all three `?preview=` states) return **200** with
**zero** `MISSING_MESSAGE`/`IntlError`. `tests/i18n/client-messages.test.ts` re-derives the required
set from the import graph on every run — **without it a missing namespace fails in the customer's
browser, not at build time** (`D-2.25-7`). `HomeExperience` is a **Server Component** again: the T-0
flag, its `setInterval(router.refresh)` and the `onComplete` handler moved to
`src/components/home/CountdownOpening.tsx`, and the photograph, scrim, tagline, both CTAs, all three
drop banners, the live-drop product grid and the about link are server-rendered and passed in as
children. Client modules per state, both sides: **ended** `HomeExperience+HomeShowcase+SiteHeader` →
`HomeShowcase+SiteHeader`; **live** → `+SpotlightCard` only; **countdown** → `+CountdownOpening`
only. **Drop state stays server-computed and `force-dynamic` is untouched (`D-1.04-9`)**; T-0 was
exercised end to end via a temporary `target={Date.now()+6000}` maneuver (reverted, diff-proven
empty) — "Opening…" replaced the tagline and both CTAs, the about link disappeared, the hero
photograph survived, and the 3s refresh interval kept firing.

**`/adapt`:** a new top-level `.tap-44` utility puts a transparent centred `::after` at
`max(100%, 44px)` on a target, raising the **hit area** without moving a rendered pixel — used on the
header nav links (whose `border-b-2` active indicator would otherwise drop 10px), the MK·EN switch,
the wordmark, the build credit, the product back-link and the Home about-link. Measured at 1280px MK,
both sides: **header bar 70px → 70px**, nav boxes **24px → 24px at identical x**, active underline
bottom **47 → 47**, MK/EN **24×24 → 24×24 at identical x** — the header is **pixel-identical**, with
hit areas now 44px and the two MK·EN hit areas **0.6px apart** (no overlap). Functional proof:
`elementFromPoint` **9px and 11px above** a nav link's box resolves to the link, **15px above** does
not. The **footer grows real boxes** (`min-h-11`, plus `min-w-11` for EN "About" 36.7px / "Terms"
38.3px) because its bottom row wraps and a pseudo-element would overlap the wrapped rows; footer
height 309.5 → 346.8 @1280, 482.9 → 547.1 @320. Cart controls **16/32/32 → 44/44/44**. **A
pre-existing defect surfaced and was fixed** (`D-2.25-12`): the cart row was **already 298px inside a
288px track** on the baseline, escaping by 10px, because `min-width: auto` on the `<ul>` **grid item**
held the track open; with `min-w-0` there, `min-w-0`+`break-words` on the details column and
`flex-wrap` on the row, at 320px the row is 288 in 288, the details column goes **68 → 208px**,
**zero** elements in `<main>` overflow their box and `document.scrollWidth` is 320 (the row is 48px
taller — 125 → 172 — because the controls take their own line). At 768px the row does not wrap and the
shipped control stack is unchanged. Product photo grid **collapses to one column below `sm:`** on
**Petar's call with the cost in hand** (`D-2.25-10`): photos **138×173 → 288×360** and the slot pair
**172.5 → 732px**, pushing the price down **559.5px** at 320px — measured in BOTH locales on the
production build (**MK 567.4 → 1126.9**, **EN 547.9 → 1107.4**; the earlier "567 → 1107" pair mixed an
MK before with an EN after, the `D-2.24-2` locale bounce, corrected by `D-2.25-21`). Two screens of
scroll to the buy path, past a hatched placeholder (register **#2**); one `sm:` reverses it. `/styleguide`'s countdown demo **card now scrolls**
(`D-2.25-11`) instead of letting the row escape it by **9.2px each side** — the row has a hard
**306.4px floor at every viewport ≤514px** because `--text-h1` bottoms out below 514px.

**`/animate`:** `filter: blur()` is **out of `@keyframes trajanov-reveal`** (`D-2.25-13`) — it was the
only one of the three animated properties that forces an offscreen buffer per element per frame, and
it ran on the hero's own child, the full-bleed photograph, measured **1152×648 = 0.75 megapixels** at
1280px, plus every live-drop product card at once. opacity + transform remain; duration, easing and
stagger unchanged. **`--motion-reveal-blur` is deliberately LEFT IN `globals.css` and `brand.md`,
unused — Petar's call**, because `globals.css` mirrors `brand.md` and one dead token beats the two
files disagreeing; **retiring it from both is a written proposal in the completion report, not
something this phase did.** **No FPS number is claimed and none could be measured** — this project's
verification pane is permanently hidden (`document.hidden === true`) so `requestAnimationFrame` never
fires, the `D-2.21-7` constraint; a real before/after on a device is **owed (#59)**. The blanket
`prefers-reduced-motion` rule is **reframed as a backstop** (`D-2.25-14`): each keyframe animation now
states its own behaviour — `.animate-spin`/`.animate-ping` stop outright (the LIVE dot's halo goes
static, which is what `brand.md` §6 asks for), `scroll-behavior` is pinned to `auto`, and the
`trajanov-reveal` / wordmark-shine rules stay as they were.

**A claim this phase made and presented as verified turned out to be FALSE, and is withdrawn
(`D-2.25-19`).** Mid-phase Code concluded that a hand-written rule placed inside `@layer base` after
`:focus-visible`, or inside the first `prefers-reduced-motion` block after the `*` selector, is
silently dropped by the Tailwind v4 pipeline, and wrote that into two `globals.css` comments and
`D-2.25-14` as "verified by serving the built CSS". Tested properly — probe rules at exactly those two
positions, `.next` deleted, one fresh `npm run build`, grep the emitted stylesheet — **both probes
compile through**. The real cause was a **dev-server caching artifact** (`@tailwindcss/postcss` caches
on the input path and rebuilds off mtime; the same dev server was separately caught serving `.tap-44`
twice then zero times from the same URL with no source change). The split `@media` block is folded
back into one, the false comments are deleted, and `.tap-44` stays top-level for the real reason —
that is where every other hand-written class in the file lives. **Zero user impact; the shipped CSS
was correct either way.** Operational lesson for the next phase: **do not measure CSS against
`next dev`** — grep `.next/static` after a clean build.

**Brief correction on the record:** the P1 brief calls 44px "the WCAG 2.2 (2.5.8) floor". **SC 2.5.8
*Target Size (Minimum)* is 24×24 CSS px at AA** (with a spacing exception); **44×44 is SC 2.5.5
*Target Size (Enhanced)*, AAA.** The footer links at 27.5px were already passing AA. The work was done
as briefed and the site is better for it, but the next brief should say **AAA / 2.5.5**.

**Also NOT done, deliberately:** the brief's `min-w-0` for footer links at 200% zoom. Measured MK at
320, 390 and 640px with the longest MK strings — **zero** elements with `scrollWidth > clientWidth`,
`document.scrollWidth == innerWidth` at every width — and in that DOM the `<a>`s are **not flex items**
(the `<li>`s are), so the class would be inert. Reported instead of cargo-culted.

**The finished diff was then adversarially re-reviewed** (four independent lenses — correctness,
CSS/layout, a11y, claims-vs-reality — each finding attacked by three refuters; 25 findings raised).
**It caught three defects this phase had introduced and two false claims this phase had made**, all
fixed or corrected here: `PhotoSlot`'s `sizes` was left at 50vw on a slot the collapsed grid made
100vw, so the product page would have shipped a **softer** photograph than before the change made to
show it bigger (`D-2.25-15`); the cart's **destructive remove button ended up flush on top of the `+`
stepper** at 768px, same x, both edges at 250.9, where before the phase they were ~40px apart
(`D-2.25-16`); the `/styleguide` scroll container **could not be scrolled by keyboard** at all
(`D-2.25-17`, WCAG 2.1.1); the two mis-stated claims are corrected by `D-2.25-18`; and the cart
comments **credited the wrong class** — reverting either `min-w-0` alone changes nothing measurable
while removing `flex-wrap` alone collapses the details column to 12px and clips three elements, so
`flex-wrap` is the fix and both `min-w-0`s are forward guards for the day Y.01 lands a real product
name (`D-2.25-20`, markup unchanged, comments rewritten with the measured table). Two further
findings were **refuted by measurement**: the wordmark/credit hit areas would clear each other by
**55.5px** even if that header group wrapped, and the MK·EN clearance comment (47.5px) was wrong and
now reads the measured **44.6px**.

Gates: `npm run build` / `npx tsc --noEmit` / `npm run lint` (**0 errors**, 143 warnings all inside
untracked `.claude/skills/impeccable/scripts/`) all clean; **`npm test` 166/166** (154 before + 7
focus-order + 5 i18n-scoping) incl. `✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7
rejected with insufficient_stock, stock 0`. Forbidden-area diff **empty** (`package.json` + lockfile,
`src/config/`, `supabase/`, `facts.md`, `brand.md`, `src/messages/`, `src/lib/drop/`,
`src/lib/orders/`, `src/lib/product-images.ts`, `next.config.ts`). **Zero user-facing strings added →
this phase creates no MK review debt.** Zero hex/`rgb(`/`hsl(` and zero raw px/ms literals in the
diff. **Placeholder register unchanged.** New owed **#59–#63**. Decisions `D-2.25-5…21`.

**Owner items — the showcase named per state, shown during live; the hero stays during live (this
session, 2026-07-29, on the same branch, `D-2.25-22…25`).** Petar's instruction, given directly:
(1) countdown/ended keep the products slider, named **„Последно спуштање" / "Last drop"**; (2) the
catalog keeps the product photos; (3) live keeps the slider too, named **„Ова спуштање" / "This
drop"**; (4) the hero photograph stays even when a drop is live. Landed as: the showcase `<h2>` is
now **visible** (FAQ's section-heading recipe, left-aligned) and picks its text from
`view.state` (`Showcase.headingLast`/`headingLive`, 2 new MK+EN keys → inventory **274**;
`Home.browseWhileWait` retired from render again, key kept, re-flagged) — `D-2.25-22`;
`showcaseSlides()` **no longer excludes `live`** (reverses 2.21 orchestrator decision 5; the
no-photograph rule is untouched, tests re-pinned) — `D-2.25-23`; the **live branch renders the same
`Hero`**, with `DropLiveBanner` inside it as the state element (`max-w-md`, no CTAs — the grid
below is the action; hero outside the reveal-group so T-0 shows the photograph instantly) —
`D-2.25-24`. **Item (2) was verified as already true** — the branch never touched the catalog
(`catalog/page.tsx` byte-unchanged vs `main`; probes: Производ 01→mustard, 02→off-white,
03→placeholder, both the DOM and a screenshot match Petar's reference). Verified in-browser against
the committed sample drop (scratch windows shifted −2 months and **restored byte-exact**,
`D-2.25-25`): all three `?preview=` states × both locales — heading text right in all six,
`lang` asserted per probe (`D-2.24-2`), **exactly one image preload (the mustard) in every state
incl. live** (was zero in live — `D-Y.05-4` now uniform), exactly one `<h1>`, SSR serves „1.199
ден" (the pane's „1,199" is the recorded ICU artifact), **zero horizontal overflow at 320 and
375** in all three states, catalog photos confirmed. **Semantic caveat flagged, owner should
reread when a SECOND drop is loaded:** during a countdown `view.products` belong to the drop being
counted down TO, so once a genuinely new drop is uploaded the countdown will tease the NEW pieces
under „Последно спуштање" (`D-2.25-22`). Gates re-run green: build / tsc / lint **0 errors** /
`npm test` **166/166** incl. the 10-vs-3 oversell gate. New owed **#64** (MK review of the 2
strings, `docs/i18n/mk-review-2.25.md` unsigned) + **#65** (the live-hero + named-showcase front
door on a real phone, Lazar's eyeball). Placeholder register unchanged.

**Phase 2.24 — Instagram glyph replaces the `@` icon — COMPLETE (2026-07-28, branch
`phase-2.24-instagram-icon`; PR [#39](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/39)
**MERGED** to `main`, merge `43a5384`, 2026-07-28, on Petar's explicit instruction — `D-0-3`:
operator-authorised, not Code; branch deleted, remote + local refs pruned).** **This merge is NOT a
no-op for the running site** — it changes `src/`, and the merge-triggered redeploy is the moment the
`@` stops standing in for Instagram on the public site. **Production deploy VERIFIED on
`https://www.trajanovv.com` (2026-07-28, ~1 min after merge):** `/`, `/en`, `/kontakt` and
`/en/contact` all serve **200** and carry the new glyph's exact geometry (`rx="5" ry="5"`, the lens
path `M16 11.37A4 4 0 1 1 12.63 8`, the flash `x1="17.5" x2="17.51"`) — **one icon on each Home
footer, two on each Contact page** (footer + rail); the Lucide `AtSign` signature (`cx="12" cy="12"
r="4"` and its `M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8` path) returns **zero occurrences on all
four URLs**. Measured live in-browser at **375px + 1280px × MK + EN**: computed
`stroke: rgb(171, 167, 158)` on the Instagram, `Mail` **and** `Phone` icons — **all three identical**;
boxes **16×16** (footer) / **20×20** (rail); footer social row **33.59px** and rail Instagram row
**110.5px @375 / 91px @1280** — **pixel-identical to the pre-merge `main` baseline**; zero horizontal
overflow; **zero console errors**; both links resolve to `https://instagram.com/trajanovv2026` with
`target="_blank"` + `rel="noopener noreferrer"`; **zero `aria-label` and zero `<title>`** on any of
the four URLs, so the icon still announces nothing. **Still owed and NOT verifiable from here: #58**
(Lazar's eyeball — does the mark read as *Instagram* to a human at 16px and 20px on a real screen).
**Out-of-band, one commit, zero critical-path movement — `NEXT:` on line 1 is byte-unchanged.** The
site's **two** Instagram links (the footer `СЛЕДИ`/FOLLOW column on every page, and the Contact
right-hand rail) showed a generic `@` and read as "an email address" at a glance; they now carry a
real Instagram mark. New `src/components/system/InstagramIcon.tsx` — a **local**, server-safe outline
glyph on the same 24px grid as the Lucide set, with the same call shape as a Lucide icon, so both
call sites changed **by name only** (`aria-hidden`, `strokeWidth={1.75}` and both classNames
byte-identical). `stroke="currentColor"` + `fill="none"` mean it inherits the parent's colour token
exactly as `Mail`/`Phone` do — **zero hex/`rgb(`/`hsl(`/named colour in the file** (grep-proven).
**`lucide-react` stays pinned at `^1.24.0` and no dependency was added** — that is the whole point of
a local component. **Zero user-facing text added: `src/messages/` is untouched, so this phase creates
no MK review debt.** `D-2.07-2` **superseded by `D-2.24-1`** (Status line only — append-only
respected); the reversal is **Lazar's owner-level visual call**, made 2026-07-28, and is exactly the
alternative `D-2.07-2` had rejected. **Verified in-browser at 375px + 1280px, both locales, on `/`
(footer) and `/kontakt` + `/en/contact` (rail):** the glyph renders (children `rect,path,line` vs.
`main`'s `circle,path`), computed `stroke: rgb(171, 167, 158)` and `fill: none` — **identical to the
`Mail` and `Phone` icons beside it** on all four renders; box sizes unchanged (footer 16×16, rail
20×20); **row heights pixel-identical to `main`, measured on both sides** via a temporary
`git checkout main -- <the two call sites>` (`D-2.24-2`) — footer social row **33.59px** at 375 and
1280; rail Instagram row **110.5px** at 375, **91px** at 1280; **zero console errors** on all four
renders; both links still resolve to
`https://instagram.com/trajanovv2026` with `target="_blank"` + `rel="noopener noreferrer"`; the
accessible name of each link is still the handle text **alone** (icon `aria-hidden`, no `aria-label`,
no `<title>`). Gates: build / `tsc --noEmit` / lint clean; `npm test` **154/154 — unchanged from
`main`**, incl. `✓ 10 simultaneous orders against 3 units → exactly 3 succeed` (no commerce code
touched). Forbidden-area diff (`package.json` + lockfile, `src/messages/`, `src/config/`,
`supabase/`, `facts.md`, `brand.md`, `src/lib/social.ts`) **empty**. **Downside on the record:** the
mark is a **recreated Instagram-style outline, not Meta's official brand asset**, used only to link
to the brand's own account (`facts.md` §6). Owed **#17 NARROWED** (icon half resolved; the 2.07
footer-redesign sign-off half stays open), new owed **#58** (Lazar eyeballs the glyph on the live
site). Placeholder register **unchanged**. Decisions `D-2.24-1/2/3`.

**Phase 2.23 — Contact page: message form + contact rail — COMPLETE (2026-07-28, branch
`phase-2.23-contact-form`; PR [#38](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/38)
**MERGED** to `main`, merge `cbd0d48`, 2026-07-28, on Petar's explicit instruction — `D-0-3`:
operator-authorised, not Code; branch deleted, remote + local refs pruned).** **This merge is NOT a
no-op for the running site** — it changes `src/`, and the merge-triggered redeploy is the moment the
site starts accepting messages from strangers. **Production deploy VERIFIED on
`https://www.trajanovv.com` (2026-07-28, ~45s after merge):** `/kontakt` and `/en/contact` both
serve **200** and carry all four fields (`contact-name`/`-email`/`-subject`/`-message`), **exactly
one `<h1>`** each, the three rail hrefs (`tel:+38978820520`, `mailto:info@trajanovv.com`,
`instagram.com/trajanovv2026`), the locale-correct consent link (MK `/privatnost`, EN
`/en/privacy`), and the **real 2.05 Turnstile site key with zero dummy-key occurrences**; the MK
build carries **zero** occurrences of "Get in touch" / "Required fields" / "Reach us directly" /
"Send us a message" / "By sending" / "fastest way" (no English leak). **The legal correction is live
and provable:** `/privatnost` serves **zero** „Не собираме е-пошта" and **zero** „Нема формулар",
`/en/privacy` serves **zero** "don't collect your email" and **zero** "No form, no portal", and both
render the new section („Што собираме кога ни пишуваш" / "What we collect when you write to us");
both corrected meta descriptions serve per-locale. **Owed #53–57 are now actionable on the live
deploy.** Out-of-band phase; does **not** advance the critical path (the `NEXT:` line is unchanged —
Y.01 and the 2.06 operator half remain next). Out-of-band
phase; does **not** advance the critical path (the `NEXT:` line is unchanged — Y.01 and the 2.06
operator half remain next). The Contact page is now a real two-column page: **message form left,
contact rail right** (~60/40 at `lg:`+, measured 624/416px = 1.50 at 1024 and 1280; stacked
form-first at 320/390/768), still **static** (`● SSG` both locales — the form is a client island,
no DB read, no `force-dynamic`). **The form ships on the owner's reversal of Plan §4 „No contact
form" (`D-2.23-1`)** — the Plan's Contact row is amended in place, old sentence quoted, not
deleted. Delivery is **email only, no database table** (brief decision 2 — „Auto-expose new
tables" is still ON, `D-1.07-14`): `ContactForm` (modelled on CheckoutForm — same fresh-token-at-
submit `D-1.04-8`, same `CheckoutField`s, same error/success discipline) → `sendContact` ("use
server", thin) → `processContact` (pure, injected deps, the `process-order.ts` convention) runs
**Turnstile → validate → send, failing closed at every step**: server-side length caps
**100/200/150/4000** (rejection, not truncation — client mirrors them via the same imported
`CONTACT_CAPS`), pragmatic email shape (same exported regex both sides), and **header-injection
rejection** (`\r`/`\n` + all control chars refused in name/email/subject — those three reach email
headers; the message body may contain newlines). The sender (`src/lib/email/contact-message.ts`,
mirroring `order-notification.ts`: env at call time, never throws, 8s ceiling, no `server-only`)
sends **from `ORDER_FROM_ADDRESS` (imported, never retyped) to `ORDER_NOTIFICATION_EMAIL` with
`replyTo` = the visitor**, subject prefixed **„[Контакт]"** so contact mail sorts away from
„Нова нарачка" order mail — and **unlike the order sender its result is NOT advisory**: the email
IS the record, so the UI renders success **only** on a Resend-confirmed send; every failure branch
(unconfigured/send_error/timeout/exception, all unit-tested with Resend mocked) renders the
failure state pointing at the phone and the email (verified live in both locales against the
unconfigured branch — no Resend key exists locally, so no real email could send). **The order rate
limiter is deliberately NOT reused** (brief decision 4 — contact attempts must never eat a
customer's drop-day order slots); Turnstile is the bot gate, the caps bound the damage. The rail
carries **exactly three rows — Phone, Email, Instagram** — all from `src/lib/social.ts`, with the
`AtSign`-for-Instagram substitution (`D-2.07-2`), rows ≥44px (measured 91/70/111px at 320), the
existing `context` line at the rail foot, and the consent line under the button linking the
**locale-aware** Privacy route (MK `/privatnost` / EN `/en/privacy`, via the i18n `Link` — brief
decision 9, never a hand-typed href).
**The Privacy page is corrected in the same PR (brief decision 7, hard stop 1):**
`Privacy.collectBody` rewritten (order-scoped, true again), a **new self-contained section**
(`contactFormHeading`/`contactFormBody` — what the form collects, used only to reply, **not stored
in the site's database**) rendered via the existing `LegalSection` between the order-collect and
Why sections, and `Privacy.deleteBody` rewritten (delete by phone **or** a reply in the email
thread) — verified live: the false claims („Не собираме е-пошта", „Нема формулар") have **zero
occurrences** in either locale's rendered page. **A THIRD false-once-this-ships statement was
found and fixed (`D-2.23-3`):** `Meta.privacyDescription` said „без е-пошта"/"no email" — both
Meta descriptions (privacy + contact) rewritten in both catalogs and added to the review pack.
**Two defects found by verification, fixed in-phase:** (a) a type-only re-export from the
"use server" module crashed every submit with a 500 (`ReferenceError` at runtime; tsc/build green
— Next compiles every export of an actions file into an action reference, `D-2.23-4`); (b) the
form now catches a rejected action call instead of stranding the button on „Се испраќа…"
(`D-2.23-5` — CheckoutForm carries the same latent defect, surfaced in report §3, NOT quietly
fixed there). **17 new strings MK+EN** (15 `Contact` + 2 `Privacy`; identical key sets, parity
suite green; humanizer run — nothing fired), inventory **255→272**;
`docs/i18n/mk-review-2.23.md` committed **unsigned** covering **21 rows** incl. the two rewritten
native-stamped Privacy strings and both Meta rewrites (owed **#56**). **Contrast measured, not
assumed** (transition-freeze artifact of the hidden pane worked around by disabling the transition
for the read, `D-2.23-7`): labels + consent + rail sub-lines **7.85:1**, error text **7.49:1**,
error border **6.32:1** vs field fill / **7.49:1** vs ground, default field border **3.01:1** vs
fill / **3.57:1** vs ground (≥3 floor, the shipped 1.06 treatment), submit label on mustard
**9.26:1**, rail values + consent link **15.42:1**, Turnstile-box text **7.31:1**; no placeholder
text is rendered anywhere on the page. **axe: ZERO violations of any impact on `/kontakt` and
`/en/contact`** (real in-browser run via a temporary `public/__axe-temp.js`, deleted before
staging, `D-2.23-7`); **exactly one `<h1>`**, rail heading the only `<h2>`; every control tabbable
with zero clipping ancestors, fields → 2px mustard focus border, button → the `#F2C55A`
ground-offset ring, links → the global 2px `#F2C55A` outline (programmatic `:focus-visible`
verification — the pane cannot traverse focus on synthesized Tab, `D-2.23-7`); **zero horizontal
overflow at 320/390/768/1024/1280, both locales; zero console errors** (the known MK-price
hydration warning does not fire on this route). Empty-required submit shows per-field errors and
provably makes **zero network calls**; a Turnstile-unresolved submit is refused with the retry
message, also zero calls. Gates: build / `tsc --noEmit` / lint clean; `npm test` **154/154**
(129 + 25 new: validation incl. every cap edge + header-injection + fail-closed order, sender
success/send_error/timeout/unconfigured/exception with **no PII in any log line**) incl.
`✓ 10 simultaneous orders against 3 units → exactly 3 succeed`; **zero** hex / `rgb(` / `hsl(` /
raw-ms / raw-easing literals in the diff; out-of-scope list byte-unchanged (diff-proven —
`SiteFooter`/`SiteHeader`/`HomeExperience`/`HomeShowcase`/`CheckoutForm`/`CheckoutField`/
`Turnstile`/`src/config/`/`supabase/`/orders/drop/cart paths/`package.json`+lockfile/`facts.md`/
`brand.md`/`site.ts` all untouched); **no new dependency, no new table, no migration**. Decisions
`D-2.23-1…7`. New owed **#53** (a real message delivers end-to-end on production, Reply goes back
to the sender) **#54** (Turnstile renders + solves on the real-domain `/kontakt`) **#55** (the
page on a real phone — tappable fields, keyboard doesn't cover submit) **#56** (MK review signed —
21 rows) **#57** (Lazar's sign-off that a contact form is what he wants on the site). Placeholder
register **unchanged** — no row added, cleared, or touched.

**Phase 2.22 — Showcase controls: chromeless — COMPLETE (2026-07-27, branch
`phase-2.22-showcase-controls`; PR [#37](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/37) **MERGED** to `main`, merge `a32ee5f`, 2026-07-27, on
Petar's explicit instruction — `D-0-3`: operator-authorised, not Code; branch deleted, remote +
local refs pruned).** **Production deploy VERIFIED on `https://www.trajanovv.com` (2026-07-27,
~1 min after merge):** `/` and `/en` both serve the chromeless controls — all three icon buttons
carry the new class string (**no** `border-border-strong`, **no** `font-display`,
`text-muted-foreground` + `p-3` + `rounded-[var(--radius-md)]` + the full `focus-visible:` ring
set present), the `-ml-3 flex items-center` wrapper appears **exactly once** per page, the
per-locale accessible names are correct (MK „Претходно парче" / „Следно парче" / „Паузирај"; EN
"Previous piece" / "Next piece" / "Pause" — **no EN string in the MK build**), the "View the
piece" `ctaSecondary` link **still** carries its border (untouched, as scoped), and **exactly
one** `rel="preload" as="image"` in `<head>` per locale (the mustard-hero invariant intact).
Owed **#51** (real-phone feel) + **#52** (Lazar's look sign-off) are now actionable on the live
deploy. Out-of-band
UI-only phase; does **not** advance the critical path (the `NEXT:` line is unchanged — Y.01 and
the 2.06 operator half remain next). The three carousel controls under the Home showcase (prev /
next / pause) are now **chromeless**: the `iconButton` constant in `HomeShowcase.tsx` drops
`border border-border-strong` + `hover:border-foreground` + `font-display`; the icons rest at
`text-muted-foreground` and go to `text-foreground` on hover **and** `:focus-visible`
(`D-2.22-2`); `p-3` + the 24px icon stay, so the buttons measure **48×48** at every width
(320/390/768/1024/1280 — the missing 2px vs 2.21's 50×50 is exactly the removed border;
`D-2.22-1`), above the 44px floor. `rounded-[var(--radius-md)]` stays because the focus ring is
now the only chrome and the radius shapes it (`D-2.22-3`). The three buttons sit in one new
`-ml-3 flex items-center` wrapper so the first **glyph** (not the invisible hit area) lands on the
column edge under the photograph (`D-2.22-4`); the outer control row and the progress container
class strings are byte-identical, so the mobile wrap (progress bar onto its own row below `sm:`)
is unchanged. **Measured, not assumed:** border widths 0px ×4 and fully transparent background at
rest **and** on real-pointer hover; rest colour `rgb(171,167,158)` = **7.85:1** on ground, hover +
focus `rgb(236,232,224)` = **15.42:1** (3:1 floor, WCAG 2.2 SC 1.4.11); real-Tab walk gives every
one of the three the `#F2C55A` ring (2px at 2px offset, box-shadow-verified) with **zero**
clipping ancestors and the ring outer edge landing exactly at x=0 at 320px (hit area starts at
x=4, `D-2.22-4`'s accepted downside — no overflow); focus still **cannot** land inside an
inactive slide (`inert` re-tab-walked); prev/next/pause all work, the pause name still flips
„Паузирај"⇄„Пушти", autoplay still pauses on hover / focus-within / hidden tab and is absent
entirely under reduced motion with arrows + progress still working (all re-proven via the
`D-2.21-7` simulations, logged `D-2.22-5`); **zero horizontal overflow at 320px both locales**;
section height **pixel-identical across slide changes** at all five widths (863.20 / 950.70 /
1422.59 / 854 / 934 px — exactly −2px vs 2.21's record below `sm:` where the button row is its own
flex line, **identical** at ≥768 where the 50px progress items govern the row); `/?preview=live` +
`/en?preview=live` render a `<main>` **sha256-identical to `main`'s** (18,281 B MK
`493e28ed…385b14` / 15,976 B EN `6087cb79…343fd8`, same dev server, same DB, deterministic across
repeated fetches); rendered at 390 + 1280, both locales, countdown + ended states, **zero console
errors** (the known pre-existing MK-price hydration mismatch in the pane's mk-ICU-less Chromium
fired as usual — SSR curl-proven correct „1.199 ден" / „1,199 MKD", not new, root fix still owed).
Gates: build / `tsc --noEmit` / lint clean; `npm test` **129/129** incl.
`✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0`
(re-run after each byte-exact scratch-drop restore, `D-2.22-5`); **zero** hex / `rgb(` / `hsl(` /
raw-ms / raw-easing literals in the diff; diff touches **only** `HomeShowcase.tsx`, `Decisions.md`,
`current-state.md`, and the completion report — `ctaSecondary`, the "View the piece" link, the
progress buttons, `HomeExperience.tsx`, `globals.css`, `showcase.ts`, both message catalogs,
`src/config/`, `supabase/`, `next.config.ts`, `package.json` + lockfile all **byte-unchanged**
(diff-stat-proven empty). No new string (inventory still **255**, no new `docs/i18n/` file), no
new token, no new CSS rule, no new dependency, no new motion exception
(`transition-colors duration-[var(--motion-fast)]` is already §6's "hover, focus" assignment).
Decisions `D-2.22-1…5`. New owed **#51** (the chromeless controls on a real phone) + **#52**
(Lazar's look sign-off). Placeholder register **unchanged** — no row added, cleared, or touched.

**Phase 2.21 — Home showcase: the pieces under the hero — CODE COMPLETE (2026-07-27, branch
`phase-2.21-home-showcase`; PR [#36](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/36) **MERGED** to `main`, merge `9b8511d`,
2026-07-27, on Petar's explicit instruction — `D-0-3`: operator-authorised, not Code; branch
deleted. **Production deploy VERIFIED** on `https://www.trajanovv.com` ~15s after merge — see
line 1 for the full record).** The pieces now sit on the front door: between the hero and the FAQ, in the
countdown / ended / no-view states, `HomeShowcase.tsx` renders one large photograph at a time with
the slide counter, the neutral-slot name, the real price, the live stock state, and one localised
link to the product page. `src/lib/showcase.ts` (pure, 13 unit assertions) decides which products
get a slide — **a slide requires a real photograph** (photo-less products are skipped; baby blue is
absent until Y.01) — and returns **nothing in the `live` state**: the live `<main>` is
sha256-identical to `main`'s, both locales. Exactly two slides today, counter `01 / 02`. Autoplay
6s with hover / focus / tab-hidden / button pauses and a full JS reduced-motion stop (WCAG 2.2
SC 2.2.2); swipe works; all slides stacked in the DOM (`inert` on inactive) so section height is
pixel-identical across slide changes at every width. Contrast measured pair-by-pair (worst text
4.79:1, worst non-text 3.56:1 after `D-2.21-5`). One preload (mustard hero) in `<head>`, one `<h1>`,
no skipped heading level. Seven new `Showcase` keys (inventory 248→255), MK pack unsigned (owed
#48). Gates: build/tsc/lint clean, `npm test` 129/129 incl. the 10-vs-3 oversell gate;
`HomeExperience.tsx` byte-unchanged; no new dependency, token, or hex/raw-ms literal. The fifth §6
motion exception, first that loops (`D-2.21-1`). Decisions `D-2.21-1…7`; new owed **#48–50**;
placeholder register: no new row, row #4 gains Home. See line 1 for the full record.

**Phase Y.05 — Home hero: full-bleed photograph with overlaid CTAs — COMPLETE (2026-07-27,
branch `phase-y.05-home-hero-overlay`; PR [#35](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/35) MERGED to `main`, merge `aa916cc`, 2026-07-27, on Petar's
explicit instruction — `D-0-3`: operator-authorised, not Code; branch deleted). Production deploy
VERIFIED on `https://www.trajanovv.com` ~36s after merge — see line 1 for the full record.** The Home hero
is now one image with the words on it: see line 1 for the full record. In brief — the composite
`trio-composite-01.webp` (1672×941, 16:9, 184,756 B; the same three §8.1-permitted frames, serif
TRAJANOV burned in) carries the hero from `640px` up over a ground-only scrim (wash 40% + bottom
gradient 92%→0% at **80%** height — deepened from the brief's 55% after the countdown digits measured
2.14:1; final worst-case: digits ≥3.34:1, tagline ≥7.82:1, CTA labels ≥9.26:1, all widths, both
locales); the mustard frame keeps the phone hero and the **only** image preload. `Home.headline`
retired from render (`D-Y.05-1`); `sr-only` H1 in all three non-live branches (`D-Y.05-2`); the
`live` branch byte-unchanged (rendered `<main>` sha256-identical to `main`'s, both locales). Two
pre-existing defects surfaced (tailwind-merge strips custom text-size utilities — the countdown has
rendered 16px since 1.04, on production too; and `--text-countdown` cannot physically fit a phone) —
worked around in-scope (`D-Y.05-9/10`), root fix owed to a follow-up phase. Lighthouse: desktop 99
(gate ≥95 met); **mobile 92 vs `main`'s own 91 on the same harness — the ≥94 gate is not
reproducible locally even for `main`; PSI on production is the binding number (owed #45)**.
Decisions `D-Y.05-1…12`. New owed **#44–47**; placeholder register **unchanged**.

**2.20 COMPLETE — the wordmark sweep is now a band of white light instead of a band of brand yellow, so
it reads as a reflection passing over the mark rather than as a mustard tint (this update, 2026-07-25).**
An out-of-band **UI-only recolour** of what 2.19 shipped, in the 2.16/2.17/2.18/2.19 shape — **no new
element, link, string, state, listener, dependency; no commerce, schema, or fact touched**, and **line 1
`NEXT:` is unchanged** (the 2.06 operator rehearsal remains next; this phase does not advance the critical
path). **`git diff main` is ONE file: `src/app/globals.css`** — `SiteHeader.tsx` is byte-unchanged. What
shipped:
- **One new `:root` token — `--color-shine: #FFFFFF` (`D-2.20-1`).** Read via `var()` in the
  `.wordmark-shine` block and **not** added to `@theme inline` (the `--glow-*` / `--header-*` /
  `--motion-shine` precedent). It is a **deliberate, narrowly-scoped exception to §3's "never pure white"
  rule** (`D-2.10-1`) — scoped to this ONE sweep. **`--color-glow` is unchanged** and the product-card
  spotlight stays off-white. Downside on the record: pure white on a near-black ground can bloom on OLED
  phones, which is most of audience 1.
- **One changed gradient stop.** The band centre went
  `color-mix(in srgb, var(--color-mustard) 65%, var(--color-foreground))` → `var(--color-shine)`. The two
  outer stops stay `var(--color-foreground)` (`D-2.20-2`) — **the sweep brightens only and never dims.**
  That is the whole functional change: 2.19's band centre measured **10.84:1** against the resting glyph's
  **15.42:1**, i.e. the sweep *darkened* the letters and tinted them yellow; white measures **18.85:1**, so
  it brightens them. Grep-proven **zero** literal hex / `rgb(` / `hsl(` / `--primary` **and zero remaining
  `--color-mustard`** anywhere in the wordmark section.
- **Everything else about the effect is byte-unchanged**, as the brief required: `@property --wordmark-x`,
  `@keyframes trajanov-wordmark-shine` (`-40% → 140%`), the `100deg` angle, the `±24%` band width,
  `background-clip: text`, the `@media (hover: hover) and (pointer: fine)` guard, the `:hover` /
  `:focus-visible` triggers, `animation-iteration-count: 1`, `--motion-shine` 900ms, `linear`, and the
  dedicated `prefers-reduced-motion` rule. Only two comments moved besides the two code changes: the
  block's colour paragraph (it still described a mustard `color-mix`, which the "no remaining
  `--color-mustard`" gate forbids and which is simply no longer true) and one added sentence recording
  that `D-2.20-3` ratified `linear`.
- **`D-2.19-6` is RATIFIED as `D-2.20-3` — the easing stays `linear`.** The "ratify or strike" item that
  was sitting in owed row **#36** is **closed**; #36's remaining scope is only the touch-device read and
  the live reduced-motion read.
- **`brand.md` §3.** `--color-shine` row in the colour table, a scoped-exception note under the
  derived-tints table (naming `--color-glow` as unchanged), and a contrast-ledger row. **§6's `D-2.19-1`
  paragraph rewritten from mustard to white** — no fifth motion exception was added (`D-2.19-1` already
  covers this effect; recolouring it is not a new motion request), so the count stays **four**.

**Gates:** `npm run build` (exit 0, "✓ Compiled successfully in 2.2s") / `npx tsc --noEmit` (exit 0) /
`npm run lint` (clean, exit 0); `npm test` **116/116** (19 files, unchanged count) incl. `✓ 10 simultaneous
orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0`. `git diff main --
package.json package-lock.json src/messages/ src/components/layout/SiteHeader.tsx` **empty** (still **243**
keys, no new dependency, zero TSX lines).

**Rendered and measured** (dev server, both locales, 320/390/768/1024/1280, Home + Catalog + Checkout;
served CSS bytes asserted by `curl` first, because 2.19 documented Turbopack serving stale CSS across an
edit): the band centre computes **`rgb(255, 255, 255)`** mid-sweep — **18.85:1** on `--color-ground`
against the resting glyph's **15.42:1**, so **the sweep brightens, it does not darken** (2.19's band centre
was `#E6BF75` at 10.84:1). Over the worst realistic backdrop — the translucent pill on the mustard live
banner, composited `#352D18` — the band is **13.64:1** against a resting **11.16:1**, i.e. **no longer
below the resting value** (2.19 was 7.84:1 there). Frame table on the paused, seeked animation is identical
to 2.19: `-40%` @0 · `0%` @200 · `50%` @450 · `100%` @700 · `136%` @880, `duration 0.9s`, `linear`,
`iteration-count 1`, `fill none`, `delay 0` — **one sweep, no loop**. `getBoundingClientRect()` is
**`89,23,135.039,24` at rest, at every seeked frame, and after** (scrolled: `281,31,135.039,24`) —
identical, nothing reflows. `<header>` computes **`transform: none`, `filter: none`,
`backdrop-filter: none`, `will-change: auto`, `contain: none`** on every route (2.17 hard stop #2 holds).
Keyboard: tabbing onto the wordmark with the mouse parked elsewhere fires the white sweep **and** renders
the `rgb(242,197,90)` focus ring, mid-sweep too. Scrolled pill (`max-width 768px`, `radius 14px`,
`blur(12px)`, `--color-ground-translucent`): the sweep still runs and is still visible. Overlay at 390:
both wordmarks carry the class, both are unanimated, plain `--color-foreground`, no gradient. **No
horizontal overflow** at 320/390/768/1024/1280 in either header state. Zero new console errors; the known
**`ProductCard.tsx:59` MK price hydration mismatch is pre-existing and recorded unchanged** (that file is
byte-unchanged). Screenshots captured **paired against their 2.19 equivalents**, shot from this branch's
parent commit before the edit: **MK 1280 mid-sweep**, **MK 1280 scrolled mid-sweep**, **EN 1280 mid-sweep**.

**One correction to flag: the brief's `18.4:1` for white on ground is arithmetically low — it is
`18.85:1`.** Recomputed with the same WCAG 2.2 relative-luminance formula that reproduces every other 2.19
number exactly (15.42 / 10.84 / 11.16 / 7.84 and the composited `#352D18`). `brand.md`'s ledger records the
measured **18.8**; `D-2.20-1` and `D-2.20-2` are logged **verbatim** as the brief wrote them, `18.4` and
all — the difference changes nothing about the decision, and both values pass AA by a factor of four.

**Two things the Browser pane still could not do, folded into owed #37:** (a) it advertises
`(hover: hover) and (pointer: fine)` at **every** viewport width and has no coarse-pointer emulation, so
the guard's inertness on a real touch device is proven only from the served CSS + CSSOM; (b) it cannot
toggle DevTools reduced-motion emulation — proven instead by CSSOM (**exactly two** `.wordmark-shine`
rules, the `prefers-reduced-motion` one ordered second so it wins on source order) plus a simulation
injecting those exact declarations, under which the focused wordmark had **zero** animations and rendered
plain `rgb(236,232,224)`. Both are the same limits 2.16–2.19 hit.

**Owed left to the live deploy (Lazar + Petar):** **#37** — white-shine sign-off on a real phone + desktop,
both locales, including whether the subtler white glint still reads (the `D-2.20-2` downside), the OLED
bloom read (the `D-2.20-1` downside), the touch-device inertness check and the live reduced-motion read.

**Frozen (byte-unchanged):** `src/components/layout/SiteHeader.tsx` (**zero lines**) /
`src/messages/{mk,en}.json` (still **243** keys) / `docs/i18n/string-inventory.md` / `facts.md` /
`ProductCard.tsx` / `SpotlightCard.tsx` / `HomeExperience.tsx` / `Countdown.tsx` / `SiteFooter.tsx` /
`LanguageSwitch.tsx` / cart / checkout / `src/lib/**` / `create_order` / `expire_reservations` /
`supabase/**` / `src/config/**` / `package.json` + lockfile (**no new dependency**) / every other colour
token including `--color-glow`, `--color-mustard`, `--color-foreground` / the `.header-shell` +
`.header-bar` + `.header-credit` + `.spotlight-card` CSS blocks. **No new placeholder; placeholder
register UNCHANGED; no new fact** (a gradient makes no factual claim). **Owed-verification register +1**
(#37), and **row #36's `D-2.19-6` ratify-or-strike item marked ratified**. Decisions `D-2.20-1…3` — all
three orchestrator-made and appended verbatim; **Claude Code made no on-the-fly decision this phase**.
**`file-map.md` needs no tree change**; **`00_stack-and-config.md` unchanged**. Branch
`phase-2.20-wordmark-shine-white`; **PR [#32](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/32)
MERGED to `main` (merge `e5c570c`, 2026-07-25) on Petar's explicit instruction (`D-0-3`: operator-authorised,
not Code); branch deleted** (clean GitHub PR merge, remote + local refs pruned). **Production deploy VERIFIED**
— the live `https://www.trajanovv.com/` CSS bundle (`/_next/static/chunks/2744txcsz25me.css`) carries
`--color-shine:#fff` and the shipped stop
`linear-gradient(100deg, var(--color-foreground) calc(var(--wordmark-x) - 24%), var(--color-shine)
var(--wordmark-x), var(--color-foreground) calc(var(--wordmark-x) + 24%))`, with **zero** occurrences of the
2.19 `color-mix(in srgb, var(--color-mustard) 65%, …)` stop — and, because there is no `color-mix` left in the
block, Lightning CSS no longer emits the `@supports` fallback pair, so the gradient now ships **once** (expected,
not a regression). `--color-glow` is unchanged on production (`color-mix(in srgb, var(--color-foreground) 100%,
transparent)`), as are `--motion-shine:.9s`, `--motion-slow:.42s`, `--motion-reveal:.76s` and
`--header-bar-max-scrolled:48rem`; the `@media (hover:hover) and (pointer:fine)` gate, the
`animation:trajanov-wordmark-shine var(--motion-shine) linear 1` and the dedicated
`@media (prefers-reduced-motion:reduce)` rule (`-webkit-text-fill-color:currentColor;background-image:none;
animation:none`) all serve intact. Driven live in-browser on production at 1280 in **both locales** (`lang=en`
on `/en`, `lang=mk` on `/`): hovering the wordmark produces an animation with `duration 0.9s`,
`timing-function linear`, `iteration-count 1`, frames `-40%` @0 · `0%` @200 · `50%` @450 · `100%` @700 ·
`136%` @880, the band centre computing **`rgb(255, 255, 255)`**, and `getBoundingClientRect()` **identical at
every frame** (`89,23,135.039,24`); `<header>` still computes `transform/filter/backdrop-filter: none`, and the
CSSOM carries **exactly two** `.wordmark-shine` rules with the reduced-motion one second. The **real-device
feel + the subtlety call + the OLED bloom read + the touch-device inertness read + the live reduced-motion read
stay owed #37** (Lazar + Petar). `NEXT:` line **unchanged** — out-of-band, does not touch the 2.06 → Y.01
critical path.

**2.19 COMPLETE — the TRAJANOV wordmark now takes a single band of light across its letters when you
hover or tab onto it, so the brand mark reads as the link home (this update, 2026-07-25).** An out-of-band
**UI-only** phase in the 2.16/2.17/2.18 shape — **no new element, link, string, state, listener, dependency;
no commerce, schema, or fact touched**, and **line 1 `NEXT:` is unchanged** (the 2.06 operator rehearsal
remains next; this phase does not advance the critical path). The header is sticky and site-wide in both
locales including Checkout (`D-2.17-1`), so this renders on every route. What shipped:
- **`src/app/globals.css` — one new `:root` token + one new CSS block + one dedicated reduced-motion rule.**
  `:root` gains **`--motion-shine: 900ms`** (`D-2.19-1`) — its own duration, because the sweep is a *travel*
  across the glyphs rather than a property transition, and borrowing `--motion-slow` would couple it to the
  header contract. Like `--glow-*` / `--header-*` it is read via `var()` and is **not** added to
  `@theme inline`. **No existing token is repointed** — `--motion-fast/base/slow/drop/reveal`, `--ease-out`,
  `--ease-smooth`, `--motion-stagger`, `--header-bar-max-scrolled`, `--header-blur` all keep their 2.18
  values, and the `.header-shell`/`.header-bar`/`.header-credit` blocks are **byte-unchanged**. The new
  `.wordmark-shine` block sits after `.header-credit` at the end of the file: a registered
  `@property --wordmark-x` (`<percentage>`, `initial-value: 100%`) animated `-40% → 140%` by a
  `@keyframes trajanov-wordmark-shine`, driving a `linear-gradient` that is clipped to the glyphs with
  `background-clip: text` + `-webkit-text-fill-color: transparent` (`D-2.19-2`). It is gated on
  **`@media (hover: hover) and (pointer: fine)`** and triggered by **`:hover` *and* `:focus-visible`**, with
  `animation-iteration-count: 1` — **one sweep per trigger, no loop, no mount animation, no tap scale**
  (`D-2.19-4`). Colours are tokens only: the glyph rests on `--color-foreground` and the band is
  `color-mix(in srgb, var(--color-mustard) 65%, var(--color-foreground))` (`D-2.19-5`) — **grep-proven zero
  literal hex / `rgb(` / `hsl(` and zero `--primary` in the block**.
- **Easing — the one Claude-Code decision this phase (`D-2.19-6`), flagged for ratification.** The brief's
  Task 1 said to use `var(--ease-out)`. Measured in-browser by seeking the real animation frame by frame,
  `--ease-out` (`cubic-bezier(0.16, 1, 0.3, 1)`) drove `--wordmark-x` to **63.9% at t=112ms** and **108.6%
  at t=225ms** — the band had already left the right edge of the glyphs a quarter of the way through, so the
  visible sweep lasted **~150ms** and the remaining ~710ms was invisible drift. That is a flick, not a shine.
  Shipped **`linear`** instead: 0% at 200ms, 50% at 450ms, 100% at 700ms — 200ms lead-in, ~500ms crossing the
  letters, 200ms lead-out. Same objection `D-2.18-2` raised against `--ease-out` on the header contract.
  `--motion-shine` stays 900ms; **one-word revert** if the orchestrator strikes it.
- **Reduced motion — a DEDICATED rule that removes the sweep, deliberately not covered by the global one.**
  The global `@media (prefers-reduced-motion: reduce)` block (~217) sets `animation-duration: 0.001ms
  !important`, which is right for the header's property transitions but would turn a 900ms travelling sweep
  into a **single-frame flash** — exactly what the preference exists to prevent. So a second rule sets
  `animation: none` **and** `background-image: none` + `-webkit-text-fill-color: currentColor`, leaving a plain
  `--color-foreground` wordmark on hover and focus. The CSS comment says why, so nobody deletes it as redundant.
- **`src/components/layout/SiteHeader.tsx` — ONE changed line.** `wordmark-shine ` prepended to the
  `wordmarkClass` constant (~157). `git diff main -- SiteHeader.tsx` is **one changed line**. The `<Link
  href="/">` elements themselves, `renderCredit()`, the overlay, focus trap, scroll lock, scroll effect,
  `data-scrolled`, `iconButtonClass`, `overlayRow` are all byte-unchanged; the wordmark stays a next-intl
  `<Link>` and does **not** become a `<button>` (`D-2.19-3`).
- **`brand.md` §6.** +1 token row (`--motion-shine` 900ms), a fourth-exception paragraph, and the closing
  count corrected to **four** exceptions (next request is the fifth). `brand.md` and `globals.css` `:root`
  agree on 900ms — checked, not assumed.

**Gates:** `npm run build` (exit 0, "✓ Compiled successfully in 2.4s") / `npx tsc --noEmit` (exit 0) /
`npm run lint` (clean, exit 0); `npm test` **116/116** (19 files, unchanged count) incl. `✓ 10 simultaneous
orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0`. `git diff main --
package.json package-lock.json src/messages/` **empty** (still **243** keys, no new dependency).

**Rendered and measured** (dev server, both locales, 320/390/768/1024/1280, Home + Catalog + Checkout):
at rest the wordmark is **byte-identical to pre-2.19** — `color rgb(236,232,224)`, `background-image: none`,
`animation-name: none` (the gradient and the transparent fill apply **only** while hovered/focused, so the
resting glyph's rendering is untouched). Hovered, one sweep runs and **stops** — after it finishes there is
no animation object left and `--wordmark-x` sits back at its specified `100%`, measured, not eyeballed.
`getBoundingClientRect()` is **`89,23,135.039,24` at rest, at every seeked frame mid-sweep, and after** —
identical; nav centre X pinned at 640 and the credit's X at 236.039 throughout. Scrolled
(`data-scrolled="true"`, bar `max-width 768px`, `border-radius 14px`, `blur(12px)`,
`--color-ground-translucent`): the sweep still runs and is still visible in the pill. `<header>` computes
**`transform: none`, `filter: none`, `backdrop-filter: none`, `will-change: auto`, `contain: none`** on every
route and both scroll states (2.17 hard stop #2 holds). Tab to the wordmark **with the mouse parked
elsewhere**: `:focus-visible` matches, the sweep fires **and** the focus ring renders
(`rgb(242,197,90) 0 0 0 2px` = `--color-focus-ring`), mid-sweep too. **Contrast:** the sweep has only two
stop colours, so every painted pixel is between them — rest/brightest `#ECE8E0` = **15.42:1** on
`--color-ground`, dimmest (band centre) `#E6BF75` = **10.84:1**; worst realistic backdrop (the translucent
pill over the mustard live banner, `#352D18`) **11.16:1 / 7.84:1**. All well above AA — the wordmark cannot
go illegible mid-sweep, as `D-2.19-5` predicted by construction. Mobile overlay at 390 opens, traps focus,
locks scroll, closes to the burger; its wordmark carries the class but renders plain off-white with no
gradient and no animation. **No horizontal overflow** at 320/390/768/1024/1280 in either header state.
Zero new console errors; the known **`ProductCard.tsx:59` MK price hydration mismatch is pre-existing and
recorded unchanged, not fixed** (`ProductCard.tsx` byte-unchanged; a static className on a constant string
cannot produce a hydration mismatch). Screenshots captured: **MK 1280 resting**, **MK 1280 mid-sweep**,
**MK 1280 scrolled mid-sweep**, **EN 1280 mid-sweep**, **MK 390 overlay open**.

**Two things the Browser pane could not do, folded into owed #36:** (a) it advertises
`(hover: hover) and (pointer: fine)` at **every** viewport width and has no coarse-pointer emulation, so the
`hover: hover` guard's inertness on a real touch device is proven only from the served CSS bytes + CSSOM, not
observed; (b) it cannot toggle DevTools reduced-motion emulation (same limit 2.16/2.17/2.18 hit) — the
reduced-motion outcome was proven by CSSOM (exactly one `.wordmark-shine` reduced-motion rule, after the hover
rules) plus a simulation injecting those exact declarations, under which the hovered wordmark had **zero**
animations and rendered plain `--color-foreground`. Both need a live read on a real phone.

**Owed left to the live deploy (Lazar + Petar):** **#36** — wordmark shine sign-off on a real phone + desktop,
both locales, including **ratify or strike `D-2.19-6`** (the `linear` easing deviation), the live
reduced-motion read, and the touch-device inertness check.

**Frozen (byte-unchanged):** `src/messages/{mk,en}.json` (still **243** keys) / `docs/i18n/string-inventory.md`
/ `facts.md` / `HomeExperience.tsx` / `Countdown.tsx` / `ProductCard.tsx` / `SpotlightCard.tsx` /
`SiteFooter.tsx` / `LanguageSwitch.tsx` / the overlay + focus trap + scroll lock in `SiteHeader.tsx` / cart /
checkout / `src/lib/**` / `create_order` / `expire_reservations` / `supabase/**` / `src/config/**` /
`package.json` + lockfile (**no new dependency**) / the `.header-shell`+`.header-bar`+`.header-credit` CSS
blocks. **No new placeholder, no `[PLACEHOLDER: …]` marker; placeholder register UNCHANGED; no new fact** (a
gradient makes no factual claim). **Owed-verification register +1** (#36). Decisions `D-2.19-1…6` — five
orchestrator-made and appended verbatim, **one (`D-2.19-6`) made by Claude Code from measurement and flagged
for ratification**. **`file-map.md` needs no tree change** (only the new completion report; the tree lists the
`completions/` directory, not each report). **`00_stack-and-config.md` unchanged** (no dependency, no config).
Branch `phase-2.19-wordmark-shine`; **PR [#31](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/31)
MERGED to `main` (merge `132e555`, 2026-07-25) on Petar's explicit instruction (`D-0-3`: operator-authorised,
not Code); branch deleted** (clean GitHub PR merge, remote + local refs pruned). **Production deploy VERIFIED**
— on the live `https://www.trajanovv.com/` the served CSS bundle carries `--motion-shine:.9s`, the registered
`@property --wordmark-x{syntax:"<percentage>";inherits:false;initial-value:100%}`,
`@keyframes trajanov-wordmark-shine{0%{--wordmark-x:-40%}to{--wordmark-x:140%}}`, the
`@media (hover:hover) and (pointer:fine)` gate on `.wordmark-shine:hover,.wordmark-shine:focus-visible`, the
shipped `animation:trajanov-wordmark-shine var(--motion-shine) linear 1`, and the dedicated
`@media (prefers-reduced-motion:reduce)` rule (`-webkit-text-fill-color:currentColor;background-image:none;
animation:none`) — with **zero literal hex/`rgb(`/`hsl(`/`--primary`** in the emitted block, and the 2.18
values (`--motion-slow:.42s`, `--ease-smooth`, `--motion-reveal:.76s`, `--header-bar-max-scrolled:48rem`)
all still intact. Driven live in-browser on production at 1280: hovering the wordmark produces an animation
with `duration 0.9s`, `timing-function linear`, `iteration-count 1`, frames `-40%` @0 · `0%` @200 · `50%`
@450 · `100%` @700 · `136%` @880, and `getBoundingClientRect()` **identical at every frame**
(`89,23,135.039,24`); `<header>` still computes `transform/filter/backdrop-filter: none`. The **real-device
feel + the `D-2.19-6` (linear easing) ratify-or-strike + the touch-device inertness read + the live
reduced-motion read stay owed #36** (Lazar + Petar). `NEXT:` line **unchanged** — out-of-band, does not touch
the 2.06 → Y.01 critical path.

**2.18 COMPLETE — the scroll-reactive header now settles instead of snapping, drops its build credit
out of the pill as it contracts, and contracts a little further; the Home hero reveal is retimed to read
as deliberate (this update, 2026-07-25).** An out-of-band **UI-only retune of 2.17 + 2.16** — **no new
element, link, string, state, listener, dependency; no commerce, schema, or fact touched**, and **line 1
`NEXT:` is unchanged** (the 2.06 operator rehearsal remains next; this phase does not advance the critical
path). The scroll mechanism, sticky positioning, `data-scrolled` switch and the blur all stay exactly as
2.17 shipped. **⚠️ One item Lazar has not explicitly approved (`D-2.18-5`):** the **hero retime** (`--motion-drop`
480ms borrow → dedicated `--motion-reveal` 760ms, stagger 70ms → 110ms) was folded in alongside the header
fix — it is the "A" option put to him after 2.16 and never separately answered; one token pair, isolated in
Task 5, trivially revertible, flagged for him to confirm or strike in review (owed **#35**). What shipped:
- **`src/app/globals.css` — three new `:root` tokens + retimed two existing blocks + one new credit block.**
  `:root` gains `--motion-slow: 420ms` (`D-2.18-1` — the header's own duration, **not** a change to the shared
  `--motion-base`, which also times the FAQ ~249 + the block ~358), `--ease-smooth: cubic-bezier(0.65,0,0.35,1)`
  (`D-2.18-2` — a symmetric ease-in-out, **header only**; `--ease-out` stays the site default), and
  `--motion-reveal: 760ms` (`D-2.18-5`). Two existing values change: `--header-bar-max-scrolled` **56rem → 48rem**
  (`D-2.18-5`, the credit no longer sits in the bar) and `--motion-stagger` **70ms → 110ms** (`D-2.18-5`). All
  three new tokens are read via `var()` and are **not** utilities (the `--glow-*`/`--motion-*` precedent — not
  added to `@theme inline`). In the `.header-shell`/`.header-bar` block, **all nine** `var(--motion-base)
  var(--ease-out)` transition pairs became `var(--motion-slow) var(--ease-smooth)` — nothing else in that block
  moved (same properties, order, scrolled values bar the max-width token). A new `.header-credit` block fades the
  credit out on scroll via **`position: absolute` (no insets) + `opacity` + `visibility` + `pointer-events`**
  (`D-2.18-3/4`): the element leaves the flex flow instantly at its static position, and `visibility` is
  transitioned with a `var(--motion-slow)` delay so the Vertex link stays focusable until the fade finishes then
  leaves the tab order (an opacity-0 link is still tabbable — a WCAG 2.2 failure otherwise). The `.reveal-group > *`
  animation duration went `var(--motion-drop)` → `var(--motion-reveal)`; the keyframes/easing/`both`/nth-child
  delays/reduced-motion rule are untouched (the 110ms stagger flows from the retimed token). **`--motion-fast`,
  `--motion-base`, `--motion-drop`, `--ease-out` all keep their pre-2.18 values** (120/220/480ms + the ease); this
  phase **adds** tokens, it does not repoint existing ones. No `!important`, no `display: none` on the credit, no
  literal hex/px/ms added beyond the brief-authorised `0s`/`linear` in the visibility step.
- **Reduced motion.** No new rule added (the credit fade + header contract are plain CSS transitions, flattened by
  the existing global `@media (prefers-reduced-motion: reduce)` ~217; the hero's own `animation: none` rule ~418 is
  unchanged). CSSOM-verified: exactly two reduced-motion blocks (global + `.reveal-group`), neither names the header.
- **`src/components/layout/SiteHeader.tsx` — ONE className.** `header-credit ` prepended to the header-bar credit
  `<p>` (~line 210). `git diff main -- SiteHeader.tsx` is **one changed line**. The overlay's own credit (~348) is
  **not** touched and does not carry the class; `renderCredit()`, the scroll effect, threshold, overlay, focus trap,
  scroll lock — all byte-unchanged. No conditional render, no new state, no `aria-hidden` in JSX (`visibility: hidden`
  handles the a11y tree).
- **`brand.md` §5/§6.** §5 `--header-bar-max-scrolled` 56rem → 48rem with a note that the width assumes the credit
  is not in the bar; §6 motion table +3 rows (`--motion-slow`, `--ease-smooth`, `--motion-reveal`) and `--motion-stagger`
  70 → 110ms; the §6 header-exception prose updated from "retimed to `--motion-base`" to the `--motion-slow`/`--ease-smooth`
  timing + the credit drop-out. `brand.md` and the `globals.css` `:root` agree on every value.

**Gates:** `npm run build` (exit 0, "✓ Compiled successfully in 2.4s", full route tree) / `npx tsc --noEmit` (exit 0)
/ `npm run lint` (clean, exit 0); `npm test` **116/116** (unchanged count — no test file touched) incl. `✓ 10
simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0` + the i18n
catalog-parity suite (still **243** keys; `git diff main -- package.json package-lock.json src/messages/` empty).
**Rendered + measured in-browser** (dev server, **both locales** via `/` (MK, `NEXT_LOCALE`) + `/en`, at
**320/390/768/1024/1280**, on **Home, Catalog, Checkout**), by `getBoundingClientRect()` + computed styles +
focus-reachability probes, not by eye (transitions neutralised with a temporary `transition:none` to read settled
targets past the pane's frozen compositor clock — the 2.17 method):
- **At `scrollY = 0`** (all three routes × both widths × both locales): `data-scrolled` **null**, `<header>` **71px**
  (= post-2.17 `main`, the +2px `D-2.17-7` carries forward unchanged), bar `max-width 1152px`, **credit `position:
  static`, opacity 1, visible** — the 2.17 `D-2.17-3` resting invariant holds. The `.header-bar` transitions now
  compute **`0.42s` on `cubic-bezier(0.65, 0, 0.35, 1)`** (×7), the credit **`0.42s` opacity + `0s` visibility on
  `cubic-bezier(0.65,0,0.35,1), linear`**.
- **Scrolled** (`data-scrolled="true"`): bar computes **`max-width 768px` (48rem)**, `border-radius 14px`,
  `margin-top 8px`, `background color(srgb …/0.82)` (82% translucent), `backdrop-filter blur(12px)`; `<header>`'s own
  bg + bottom border compute transparent and `filter/backdrop-filter/transform` all **`none`** (containing-block trap
  of hard stop #4/2.17-#2 avoided). The **credit computes `position: absolute`, `opacity 0`, `visibility hidden`,
  `pointer-events none`**.
- **Nothing but the credit moves during the contract.** Nav centre X stays on the container centreline (1280 MK/EN:
  640.0 vs 640; 1024 MK: 512 vs 512 — offset ≤ 0.01px); the cart's right edge tracks only the max-width change (1280:
  content-box right 1000, cart right 999; 1024: 872 / 871 — within the pill). **No wrap, no vertical movement, no
  header height change** — bar stays a single 70px row, header 79px scrolled (margin-top 8 + 70 + border, the 2.17
  float, unchanged).
- **Keyboard:** on a scrolled page `link.focus()` on the Vertex credit link is a **no-op** (`visibility: hidden`
  removed it from the tab order — `document.activeElement` stayed on `body`); scroll back to top and the same
  `focus()` **lands on the Vertex link** — reachable again. `D-2.18-4` proven both ways.
- **The 48rem pill does not crowd or wrap at 1024 and 1280, MK first** (MK strings are longer): at 1280 the wordmark
  (ends 416), centred nav (513–767, centre 640), MK·EN and cart (955–999) all sit inside the 768px pill with room;
  at 1024 the same, cart right 871 within content-box right 872. EN is shorter → safe. Single row, no wrap, no overflow.
- **Hero reveal (measured on the actual `.reveal-group` children, both preview states):** ended hero 4 children delays
  **0/110/220/330ms** → ends **1090ms (1.09s)**; countdown hero 6 children delays **0/110/220/330/440/550ms** → ends
  **1310ms (1.31s)**. Both **< 1.5s** (duration `760ms` confirmed on every child). Live-drop grid cascades at 0/110ms.
- **Reduced motion:** structurally confirmed (no header-specific rule; global rule + the hero's own `animation:none`
  cover it). The pane cannot toggle DevTools reduced-motion emulation → the *live* device read folds into owed **#35**.
- **Mobile overlay unaffected at 390:** the header-bar credit is `display:none` below `lg` (the class is inert there);
  only **one** element carries `header-credit`. Opening the burger **while the page is scrolled** still gives a
  `position: fixed` `z-40` opaque panel covering 390×844 with body scroll locked, and the overlay's **own** credit
  does **not** carry `header-credit` — its Vertex link stays focusable (verified: `overlayCreditHasHeaderCreditClass:
  false`, `overlayVertexLinkFocusable: true`). Close via the X returns focus to the burger and releases the scroll lock.
- **No horizontal overflow** at **320/390/768/1024/1280** in **both** states (`scrollWidth == clientWidth` throughout).
- **Console: zero new errors.** The only issue (Next dev "1 Issue") is the **pre-existing, out-of-scope**
  `ProductCard.tsx:59` MK price hydration mismatch on the Home live grid (server "1,500 ден" vs client "1.500 ден";
  stack roots `HomePage → HomeExperience → ProductCard → SpotlightCard`, **zero header involvement**;
  `ProductCard.tsx` byte-unchanged) — recorded unchanged, not fixed (hard stop mirrors 2.17).
Screenshots captured: **MK 1280 top** (credit „Изработено од Vertex Consulting" visible), **MK 1280 scrolled** (pill,
credit dropped out), **EN 1280 scrolled** (pill, „Catalog · About · Contact", credit gone), **MK 390 scrolled**
(full-width translucent pill, wordmark + burger). (Per 2.17, the sticky pill mis-composites in some scrolled
screenshots — a Browser-pane artifact; captured at a small offset over the mustard banner so the pill's appearance +
the credit's absence show correctly; the geometry is proven by `getBoundingClientRect` regardless.)

**Owed left to the live deploy (Lazar + Petar):** **#35** — retimed-header + hero sign-off on a real phone, both
locales (bar settles rather than snaps; credit fades cleanly with nothing else shifting; hero reads as deliberate;
**confirm or strike `D-2.18-5`, the hero retime**; the live reduced-motion read; a post-deploy PageSpeed re-run since
a local Lighthouse isn't comparable — a longer transition shouldn't cost anything, report if it does). This is the
brief's owed row (numbered "#34" in the brief); the register was already at **#34** because 2.17 shipped **+3**
(one more than its brief's "+2"), so the actual next number is **#35** — the "+1" count is right, the absolute number
in the brief was one behind.

**Frozen (byte-unchanged, `git diff --name-only main` lists only `brand.md`, `src/app/globals.css`,
`src/components/layout/SiteHeader.tsx` + the state/decision/report docs):** `src/messages/{mk,en}.json` (still **243**
keys) / `docs/i18n/string-inventory.md` / `HomeExperience.tsx` / `Countdown.tsx` / `ProductCard.tsx` / the overlay + focus
trap + scroll lock in `SiteHeader.tsx` / `SiteFooter.tsx` / `LanguageSwitch.tsx` / cart / checkout / `Turnstile.tsx` /
`src/lib/**` / `create_order` / `expire_reservations` / `supabase/**` / `src/config/**` / `facts.md` / `package.json` +
lockfile (**no new dependency**). **No new placeholder**, **no `[PLACEHOLDER: …]` marker**; **placeholder register
UNCHANGED**; **no new fact** (a timing curve + a fade make no factual claim). **Owed-verification register +1** (#35).
Decisions `D-2.18-1…5` (all five orchestrator-made, appended verbatim; no Claude-Code-only decision this phase — the CSS
was shippable as written, unlike 2.17). **`file-map.md` needs no tree change** (only the new completion report was added;
the tree lists the `completions/` directory, not each report). **`00_stack-and-config.md` unchanged** (no dependency, no
config). Branch `phase-2.18-header-retime`; **PR [#30](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/30)
MERGED to `main` (merge `8f19408`, 2026-07-25) on Petar's explicit instruction (`D-0-3`: operator-authorised, not Code);
branch deleted** (clean GitHub PR merge; PR #30 shows the "Merged" badge). **Production deploy VERIFIED** — on the live
`https://www.trajanovv.com/` the served CSS bundle carries the three new tokens (`--motion-slow:420ms`,
`--ease-smooth:cubic-bezier(.65,0,.35,1)`, `--motion-reveal:760ms`), the retimed values (`--header-bar-max-scrolled:48rem`,
`--motion-stagger:110ms`), the retimed `.header-shell`/`.header-bar` transitions on `var(--motion-slow) var(--ease-smooth)`,
the new `.header-credit` drop-out rule (scrolled → `position:absolute;opacity:0;visibility:hidden;pointer-events:none`), and
`.reveal-group>*{animation:trajanov-reveal var(--motion-reveal)…}` — the exact merged code is serving. The **real-device
feel + the `D-2.18-5` (hero retime) confirm/strike + the live reduced-motion read + the PageSpeed re-run stay owed #35**
(Lazar + Petar). `NEXT:` line **unchanged** — out-of-band, does not touch the 2.06 → Y.01 critical path.

**2.17 COMPLETE — the site header now sticks to the top and, once you scroll, contracts into a
translucent blurred pill (this update, 2026-07-25).** An out-of-band **UI-only** phase (the 2.07–2.16
shape) — **no commerce, no schema, no string, no fact, no dependency touched**, and **line 1 `NEXT:` is
unchanged** (the 2.06 operator rehearsal remains next; this phase does not advance the critical path).
`SiteHeader` renders on **every page in both locales**, so the blast radius is site-wide (incl. the
Checkout header) — verified accordingly. The header used to scroll away and never return; it now stays
pinned and, past a small offset, the inner bar narrows, rounds, gains a translucent blurred background,
and floats over the page. One behaviour was taken from Lazar's `hero-section-1.tsx` reference — the
scroll-reactive contract-and-blur — **reimplemented as a CSS transition on a `sticky` header**;
everything else in that reference (`framer-motion`, `AnimatedGroup`/`TextEffect`, shadcn/button, the
`Login`/`Sign Up`/`Get Started` buttons, `position: fixed`, the tailus logo, the reference's own
burger/`X`) was rejected and is **absent from the diff**. What shipped:
- **`src/app/globals.css` — three tokens + one scoped block.** `:root` gains `--color-ground-translucent`
  (`color-mix(in srgb, var(--color-ground) 82%, transparent)`, beside `--color-mustard-tint-*`) and
  `--header-blur: 12px` + `--header-bar-max-scrolled: 56rem` (beside `--radius-*`), each mirrored from
  `brand.md` §3/§5 with a reference comment. All three are **read via `var()`** in the CSS block and are
  **not** utilities (the `--glow-*` precedent — not added to `@theme inline`). A new **unlayered** block
  after `.reveal-group` styles `.header-shell` / `.header-bar`: at rest nothing changes; on
  `data-scrolled="true"` the shell's bg + bottom border fade transparent and the inner `.header-bar`
  contracts to `max-width 56rem`, gains `margin-top 0.5rem`, `background var(--color-ground-translucent)`,
  `border-color var(--color-border)`, `border-radius var(--radius-lg)`, and
  `backdrop-filter: blur(var(--header-blur))` (with the `-webkit-` prefix). **Every value in the block is
  a `var()`** except a `1px` hairline border (the same idiom as `.spotlight-card`) and a `0.5rem`
  margin — `--space-2` is **not** a real token here (Tailwind v4 emits `calc(var(--spacing) * n)`, not
  `--space-N`), so the literal was written per the brief rather than inventing a token. The transition is
  retimed to `--motion-base`; no `!important` anywhere.
- **Reduced motion.** The header transition is a plain CSS transition, so the **existing** global
  `@media (prefers-reduced-motion: reduce)` rule (~line 198) flattens `transition-duration` to 0.001ms —
  the header snaps instead of easing. **No second reduced-motion rule was added** (CSSOM-verified: zero
  reduced-motion rules mention `.header-shell`/`.header-bar`).
- **`src/components/layout/SiteHeader.tsx` — additions only** (`D-2.17-2/6`). One `const
  SCROLL_THRESHOLD_PX = 32` at module scope; one `const [scrolled, setScrolled] = useState(false)`; one
  **new, separate** `useEffect` that adds a `{passive:true}` `scroll` listener (`setScrolled(window.scrollY
  > SCROLL_THRESHOLD_PX)`) plus a `requestAnimationFrame(onScroll)` mount-sync for back/forward restored
  scroll positions (setState only inside the listener/rAF callbacks — clean under
  `react-hooks/set-state-in-effect`). Two className additions + one attribute: `<header>` gains
  `header-shell … sticky top-0 z-30` and `data-scrolled={scrolled ? 'true' : undefined}` (with a comment
  naming the CSS block); the inner grid `<div>` gets `header-bar` prepended. **The overlay, focus trap,
  scroll lock, resize effect, and render-time pathname reset are byte-unchanged** (hard stop #3).
- **`brand.md` §3/§5/§6.** §3 Derived-tints table +1 row (`--color-ground-translucent`), §5 radius/shadow
  table +2 rows (`--header-blur`, `--header-bar-max-scrolled`), §6 exception paragraph **extended** with
  a third, honestly-worded exception (`D-2.17-5`): the header transition is scroll-driven and site-wide,
  so §6 is now a *presumption against decoration*, not an absolute — a fourth motion request is an
  owner-level decision.

**⚠️ One operator-ratified deviation (`D-2.17-7`):** the base `.header-bar { border: 1px solid transparent }`
(present in **both** states, per Task 3, so the scrolled border is a colour transition not a box-model
jump) makes the **resting header 2px taller than `main`** (`<header>` 69px → 71px; content pushed down 2px
site-wide, incl. Checkout). This contradicts the letter of `D-2.17-3` ("scroll-top byte-identical to
`main`, to the pixel") and trips hard stop #4 — you cannot have both the border-in-both-states (no
inter-state jump) and a pixel-identical resting box. Code surfaced the measured numbers; **Petar chose to
ship the brief's CSS verbatim**, accepting the +2px (alternative — a layout-neutral edge via inset
`box-shadow`/`outline` — rejected). Flagged for Lazar's real-device sign-off (owed #32).

**Gates:** `npm run build` (exit 0, "✓ Compiled successfully") / `npx tsc --noEmit` (exit 0) / `npm run
lint` (clean, exit 0 — **no `react-hooks/set-state-in-effect`** violation from the new effect) all pass;
`npm test` **116/116** (unchanged count — the header carries no tests) incl. `✓ 10 simultaneous orders
against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0` + the i18n
catalog-parity suite (still **243** keys). **Rendered + measured in-browser** (dev server, **both
locales** via MK cookie + `/en`, at **320/390/768/1024/1280**, on **Home, Catalog, Product, Checkout**),
by `getBoundingClientRect()` + computed styles + `elementsFromPoint` hit-testing, not by eye:
- **At `scrollY = 0`, all four routes × both widths × both locales:** `<header>` computes `position:
  sticky`, `top: 0px`, `z-index: 30`, `bg rgb(15,18,16)`, `border-bottom rgb(42,46,43)`,
  `filter/backdrop-filter/transform none`, `will-change auto`; inner bar `max-width 1152px`,
  `border-radius 0px`, transparent bg/border; **nav centre offset 0px** (2.13 result intact both
  locales); `<main>` first child directly under the header (`y` == header height). Resting **height 71px**
  vs `main`'s **69px** — the +2px from `D-2.17-7`, the only scroll-top deviation.
- **Past the threshold:** `data-scrolled="true"`; `<header>` stays pinned (`elementFromPoint(centre,10)`
  returns the `.header-bar`, wordmark at viewport-y 21); the bar computes `max-width 896px` (56rem),
  `border-radius 14px`, `margin-top 8px`, `background color(srgb …/0.82)` (82% ground translucent),
  `border-color rgb(42,46,43)`, `backdrop-filter blur(12px)`; `<header>`'s own bg + bottom border compute
  transparent; `filter/backdrop-filter/transform none` on `<header>` (the containing-block trap of hard
  stop #2 avoided). **Applies at 390 too** (mobile, `D-2.17-4`): full-width rounded translucent pill.
- **Scroll back to top** returns every value to the resting set — no stuck pill, no residual blur.
- **No horizontal overflow** in **either** state at **320/390/768/1024/1280**, both locales
  (`scrollWidth == clientWidth`). **No layout shift** — sticky doesn't push content (in-flow).
- **Contrast, worst-case computed** (pill = 82% ground over the brightest realistic content, conservative
  since the blur averages content darker): nav muted text ≥ **5.68:1** over the mustard live banner
  (**4.58:1** even over hypothetical pure white), wordmark ≥ **11.16:1** — all ≥ 4.5 (nav) / ≥ 3 (wordmark
  large text). The 82% opacity holds text above AA over content; not raised.
- **2.15 mobile overlay while scrolled (390, both locales):** opening the burger with the page scrolled +
  header in pill state still gives `position: fixed`, inset 0, full **390×844** opaque `bg-ground` panel,
  `z-40`, **body scroll locked**, focus on the **X** („Затвори" MK / "Close" EN), 9 focusables; **Escape**
  closes it, returns focus to the burger, and **releases the scroll lock**. The `D-2.17-1` downside
  (overlay's `body{overflow:hidden}` un-sticks the header) is confirmed **harmless**.
- **Skip link:** with `focus:z-50` simulated, the skip-to-content link paints **above** the header's new
  `z-30` stacking context (index 0 in `elementsFromPoint`; z-50 sibling > z-30 sibling) — no regression.
  Live `:focus` render not capturable in-pane (the pane's window doesn't hold OS focus).
- **Console: zero new errors.** The only issue is the **pre-existing, out-of-scope** `ProductCard.tsx:59`
  MK price hydration mismatch on the Home live grid (server "1,500 ден" vs client "1.500 ден"; component
  stack roots in `HomePage → HomeExperience → ProductCard → SpotlightCard`, **zero header involvement**;
  `ProductCard.tsx` byte-unchanged) — hard stop #8, recorded unchanged, not fixed.
- **Reduced motion / Safari blur / Lighthouse:** structurally verified (no second RM rule; global rule
  covers; `-webkit-backdrop-filter` present in the served bytes) but the pane can't emulate DevTools
  reduced-motion, is Chromium (no WebKit), and a local Lighthouse isn't comparable to the production
  baseline — these live reads are **owed #32/#33/#34**.
Screenshots captured: **MK 390 top**, **MK 390 scrolled (pill)**, **MK 390 overlay-open-while-scrolled**,
**EN 1280 top**, **EN 1280 scrolled (pill)**. (The sticky pill's *vertical position* mis-composited in the
scrolled screenshots — a known Browser-pane sticky-layer screenshot artifact; the pill's appearance
renders correctly and `getBoundingClientRect` + hit-testing prove it is pinned at `top:0`.)

**Frozen (byte-unchanged, `git diff --name-only main` lists only `brand.md`, `src/app/globals.css`,
`src/components/layout/SiteHeader.tsx` + the state/decision/report docs):** `src/messages/{mk,en}.json`
(still **243** keys — `git diff main -- src/messages/` empty) / `docs/i18n/string-inventory.md` /
`src/app/[locale]/layout.tsx` / every page under `src/app/[locale]/` / `SiteFooter.tsx` /
`LanguageSwitch.tsx` / `src/components/home/*` (incl. `HomeExperience.tsx`, `Countdown.tsx`,
`ProductCard.tsx`) / cart / checkout / `Turnstile.tsx` / `src/lib/**` / `create_order` /
`expire_reservations` / `supabase/**` / `src/config/**` / `facts.md` / `package.json` + lockfile
(**no new dependency** — `grep -rn "from 'motion\|framer-motion\|AnimatedGroup\|TextEffect\|Sign Up\|Get
Started\|tailus\|unsplash" src/` returns nothing in shipped code). **No new placeholder**, **no
`[PLACEHOLDER: …]` marker**; **placeholder register UNCHANGED**; **no new fact** (a scroll behaviour makes
no factual claim). **Owed-verification register +3** (#32 sticky-header sign-off on a real phone incl. the
+2px feel + the live reduced-motion read; #33 Safari/iOS blur; #34 Lighthouse mobile perf re-run). This is
**one more than the brief's "+2"** — Code added #34 because a comparable Lighthouse number could not be
produced locally (post-deploy PageSpeed is the valid measurement). Decisions `D-2.17-1…6` (all six
orchestrator-made, appended verbatim) + `D-2.17-7` (Claude Code, operator-ratified — the +2px resting
delta). **`file-map.md` needs no tree change** (no file added, moved, or deleted); **`00_stack-and-config.md`
unchanged** (no dependency, no config). Branch `phase-2.17-scroll-header`; **PR
[#29](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/29) MERGED to `main` (merge
`cecc054`, 2026-07-25) on Petar's explicit instruction (`D-0-3`: operator-authorised, not Code); branch
deleted** (clean GitHub PR merge). **Production deploy VERIFIED** — on the live `https://www.trajanovv.com/`
the deployed home HTML carries `class="header-shell bg-ground border-border sticky top-0 z-30 border-b"`
on `<header>` and `header-bar` on the inner grid `<div>`, and the served CSS bundle
(`/_next/static/chunks/…css`) contains all three tokens (`--header-blur:12px`,
`--header-bar-max-scrolled:56rem`, and `--color-ground-translucent` as the 82% `color-mix` under an
`@supports` guard), the base `.header-shell`/`.header-bar` transition rules, and the scrolled pill rule
`.header-shell[data-scrolled=true] .header-bar{max-width:…;background-color:var(--color-ground-translucent);
border-radius:var(--radius-lg);-webkit-backdrop-filter:blur(var(--header-blur));backdrop-filter:blur(var(--header-blur));margin-top:.5rem}`
— with **both** the `-webkit-` and unprefixed `backdrop-filter`, and **no** header-specific
`prefers-reduced-motion` rule (the global rule covers it). The exact merged code is serving. The
**real-device feel + the +2px read + the iOS Safari blur + the Lighthouse re-run stay owed #32/#33/#34**
(Lazar + Petar). `NEXT:` line **unchanged** — out-of-band, does not touch the 2.06 → Y.01 critical path.
(Note: `main` had moved by one **empty `github-actions[bot]` keep-alive commit** `bd15ed1` `[skip ci]`
since PR #28; the branch was based on it — benign, not a concurrent phase.)

**2.16 COMPLETE — the Home hero now reveals with a short staggered blur-in on first paint (this update,
2026-07-25).** An out-of-band **UI-only** phase (the 2.07–2.15 / Y.02 shape) — **no commerce, no schema, no
string, no fact, no dependency touched**, and **line 1 `NEXT:` is unchanged** (the 2.06 operator rehearsal
remains next; this phase does not advance the critical path). The hero used to paint all at once with the
header; it now fades its children up 0.75rem and un-blurs, 70ms apart, so the countdown lands first and the
supporting copy follows — the `brand.md` §2 hierarchy ("the countdown is the loudest object; everything defers
to it"). One idea was taken from Lazar's 21st.dev reference block — a staggered blur-in — **reimplemented in
plain CSS**; everything else in that reference (framer-motion, `AnimatedGroup`/`TextEffect`, shadcn/button, the
pill link, the fabricated logo wall, the night-background/mail2/Unsplash imagery) was rejected and is **absent
from the diff**. What shipped:
- **`src/app/globals.css` — three tokens + one scoped block.** `:root` gains `--motion-stagger: 70ms`,
  `--motion-reveal-shift: 0.75rem`, `--motion-reveal-blur: 0.5rem` directly under `--ease-out` (mirrored from
  `brand.md` §6). A new documented block adds `@keyframes trajanov-reveal` (from `opacity:0` +
  `translateY(var(--motion-reveal-shift))` + `blur(var(--motion-reveal-blur))` → to full/`0`/`0`) and
  `.reveal-group > *` (`animation: trajanov-reveal var(--motion-drop) var(--ease-out) both`) with per-child
  `animation-delay: calc(var(--motion-stagger) * n)` for `nth-child(1..8)` and a shared last step for
  `nth-child(n+9)`. **Every value in the reveal block is a `var()`** — no literal hex/px/ms (the sole `70ms`
  literal is the `:root` token definition, exactly like `--motion-drop: 480ms`). The duration **reuses
  `--motion-drop` (480ms)** — no new duration token (`D-2.16-4`). Only opacity/transform/filter animate, so
  none of the three reflow → no layout shift.
- **Reduced motion (`D-2.16-3`, `brand.md` §6).** A dedicated `@media (prefers-reduced-motion: reduce) {
  .reveal-group > * { animation: none } }` immediately after the block — the global reduced-motion rule
  flattens `animation-duration` but keeps `animation-delay` + `animation-name`, so alone it would leave the
  hero invisible for the length of the stagger; `animation: none` resets name/duration/delay/fill in one
  declaration so every child renders in its final state on frame 1.
- **`src/components/home/HomeExperience.tsx` — four `className` additions, nothing else** (`D-2.16-2`). Diff
  is exactly `reveal-group ` prepended to: the no-view `<section>`, the **live product grid `<div>`** (`D-2.16-5`
  — **not** the section above it, so the LIVE banner + sr-only `<h1>` paint solid and only cards cascade), the
  ended `<section>`, and the countdown `<section>`. **No new import, prop, state, link, or re-order.** DOM is
  byte-identical to `main`, so `Countdown.tsx` / `DropBanner.tsx` / `ProductCard.tsx` stay byte-unchanged and
  the stagger is positional (`nth-child`, accepted downside of `D-2.16-2`).
- **`brand.md` §6 — three token rows + the exception paragraph extended** to record `D-2.16-3` alongside
  `D-2.10-1` (Code edits `brand.md`, precedented by `D-1.02-1`/`D-2.10-1`, `D-2.16-4`): the Home hero reveal is
  first-paint-only on the Home hero sections + the live-drop grid, disabled entirely under reduced motion, and
  **not** to be reused on any other page without a new owner-level decision.

**Gates:** `npm run build` (exit 0, "✓ Compiled successfully in 3.0s", full route tree) / `npx tsc --noEmit`
(exit 0) / `npm run lint` (clean, exit 0); `npm test` **116/116** (unchanged count — no commerce/test file
touched) incl. `✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with
insufficient_stock, stock 0` + the i18n catalog-parity suite (still **243** keys). **Rendered + measured
in-browser** (dev server, **both locales** via `/` (MK, `NEXT_LOCALE`) + `/en`, at **390** + **1280**, using
`?preview=` to reach each drop state), by the Web Animations API + `getBoundingClientRect()` + computed styles,
not by eye:
- **Countdown:** the section's six children carry `animation-name: trajanov-reveal`, `animation-delay`
  **0 / 70 / 140 / 210 / 280 / 350ms**, `duration 480ms`, `fill both`, easing `cubic-bezier(0.16,1,0.3,1)`, in
  order eyebrow → **countdown** → headline → sub → catalog link → about link; the last starts at 350ms, the
  sequence ends at **830ms (< 1s)**. Seeked to **t=100ms** the eyebrow is opacity 0.766, the **countdown is
  opacity 0.341 (animating second, after the eyebrow, before the headline)**, children 3–6 still at `from` —
  the positional stagger is proven.
- **Live:** only the product grid is `.reveal-group`; the grid's **own** `animation-name` is `none` and the
  LIVE banner + sr-only `<h1>` compute `animation-name: none` (paint solid on frame 1); the two product-card
  `<a>` children cascade at 0 / 70ms (`D-2.16-5`).
- **Ended:** four children stagger (banner 0, h1 70, p 140, **About link 210ms — last**).
- **No layout shift / rects identical to `main`:** seeked to settled (t=1000ms) every child reaches
  `matrix(1,0,0,1,0,0)` / `blur(0px)` / `opacity 1`, and **every settled rect equals the class-removed base
  layout to the pixel** (`settledEqualsBase: true` at 390 MK countdown, 1280 EN countdown, 1280 MK ended) —
  since `.reveal-group` adds only `animation` to children and no rule styles the parent, base == `main`.
  `scrollWidth == clientWidth` at 390 and 1280, both locales (no horizontal overflow).
- **Countdown digit shift:** inherited — `Countdown.tsx` (byte-unchanged) uses `tabular min-w-[2ch]`; the
  reveal animates the container only, not the digits, so the "must not shift as digits tick" rule is untouched.
- **Reduced motion:** the served stylesheet carries `@media (prefers-reduced-motion: reduce) { .reveal-group >
  * { animation: … none } }`; the behavioural outcome of `animation: none` (verified by cancelling the WAAPI
  animations) is **opacity 1 / transform none / filter none on frame 1 for all six children**. The Browser
  pane cannot toggle the DevTools media-emulation flag, so the *live* reduced-motion read folds into owed **#31**.
- **Keyboard:** both hero links are focusable (`tabIndex 0`, `pointer-events: auto`, no inert ancestor) — the
  `filter`/`opacity` animation traps nothing — and the global `:focus-visible` ring
  (`2px solid var(--color-focus-ring)`, offset 2px) is present.
- **Console: zero new errors.** The known **pre-existing, out-of-scope** `ProductCard.tsx:59` MK price
  hydration mismatch on the live grid is inherited (`ProductCard.tsx` byte-unchanged vs `main`); hard stop #6
  forbids touching it — recorded unchanged, not fixed.
Screenshots captured (all seeked to settled for visibility): **MK 390 countdown**, **MK 390 live**, **EN 1280
countdown**, **MK 1280 ended**.

**Frozen (byte-unchanged, `git diff --name-only main` lists only `brand.md`, `src/app/globals.css`,
`src/components/home/HomeExperience.tsx` + the state/decision/report docs):** `Countdown.tsx` / `DropBanner.tsx`
/ `ProductCard.tsx` / `src/components/layout/*` (`SiteHeader.tsx` etc.) / `HomeFaq.tsx` / cart / checkout /
`src/messages/{mk,en}.json` (still **243** keys) / `docs/i18n/string-inventory.md` / `facts.md` / `src/lib/**` /
`create_order` / `expire_reservations` / `supabase/**` / `src/config/**` / `src/lib/site.ts` / `sitemap.ts` /
`robots.ts` / `manifest.ts` / `package.json` + lockfile (**no new dependency** — `git diff main --
package.json package-lock.json` empty; `grep -rn "from 'motion" src/` still empty, `D-2.16-1`). **`grep -rn
"framer-motion\|AnimatedGroup\|TextEffect\|unsplash\|imagekit\|tailus" src/` returns nothing in shipped code**
(the one hit is pre-existing prose in this file noting framer-motion is *unused*). **No new placeholder**, **no
`[PLACEHOLDER: …]` marker**; **placeholder register UNCHANGED**; **no new fact** (a first-paint animation makes
no factual claim; `facts.md` byte-unchanged). **Owed-verification register +1** (#31 — hero reveal sign-off on
the live deploy, on a real phone, both locales; includes the live reduced-motion read the pane could not
emulate). Decisions `D-2.16-1…5` (all five orchestrator-made, appended verbatim; no `D-2.16-6`). **`file-map.md`
needs no tree change** (no file added, moved, or deleted); **`00_stack-and-config.md` unchanged** (no dependency,
no config). Branch `phase-2.16-hero-reveal`; **PR [#28](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/28)
MERGED to `main` (merge `1fe9dc4`, 2026-07-25) on Petar's explicit instruction (`D-0-3`: operator-authorised,
not Code); branch deleted** (clean GitHub PR merge; PR #28 shows the "Merged" badge). **Production deploy
VERIFIED** — on the live `https://www.trajanovv.com/` the deployed home HTML carries `reveal-group` on the hero
`<section>`, and the served CSS bundle (`/_next/static/chunks/…css`) contains `@keyframes trajanov-reveal`, all
three tokens (`--motion-stagger:70ms`, `--motion-reveal-shift:.75rem`, `--motion-reveal-blur:.5rem`), the base
`.reveal-group>*{animation:trajanov-reveal var(--motion-drop)…}` rule, the staggered `nth-child` delays, **and**
the reduced-motion `@media(prefers-reduced-motion:reduce){.reveal-group>*{animation:none}}` override — the exact
merged code is serving. (The committed drop is ENDED and `?preview=` is refused in production, so the *live*
product-grid cascade is not observable on prod HTML; it was fully driven on localhost against byte-identical
built code, and the reveal CSS above is deployed.) The **real-device feel + the live reduced-motion read stay
owed #31** (Lazar + Petar). `NEXT:` line **unchanged** — out-of-band, does not touch the 2.06 → Y.01 critical path.

**2.15 COMPLETE — the phone menu is now a full-screen opaque overlay drawer, not the 2.14 in-flow expand
(this update, 2026-07-25).** An out-of-band **UI-only** phase (the 2.07–2.14 shape) — **no commerce, no
schema touched**, exactly **one** new message key per catalog, and **line 1 `NEXT:` is unchanged** (the 2.06
operator rehearsal remains next; this phase does not advance the critical path). Below `lg` (1024px), tapping
the burger used to expand the three links in-flow and push the page down; it now opens a full-screen
`position: fixed inset-0`, opaque `bg-ground`, `role="dialog" aria-modal` panel that takes over the screen —
everything tucked inside except the TRAJANOV wordmark, matching the owner-approved reference. What shipped:
- **`src/components/layout/SiteHeader.tsx` — split into a desktop bar + a mobile bar + the overlay.** The one
  component now carries **two layouts** (`D-2.15-6`): at ≥ `lg` the finished **2.13 grid** (wordmark + credit ·
  centred Catalog·About·Contact nav · MK·EN + cart) renders **byte-identically** — the non-wordmark pieces are
  simply gated `hidden lg:*` (credit `hidden lg:block`; the centre `<nav>` `hidden lg:flex` keeping its 2.13
  grid placement + 2px `border-mustard` **bottom**-border active indicator; a `hidden lg:flex` cluster holds
  MK·EN + cart with `gap-6`). Below `lg` the header row is **wordmark (left) + burger (right)** only.
- **The burger** (`lg:hidden`, `h-11 w-11` = 44px, lucide `Menu`, `aria-label={t('menu')}` · `aria-expanded` ·
  `aria-controls="mobile-menu"`) **opens only** (`setOpen(true)`); the **X inside the overlay closes**
  (`D-2.15-1`, supersedes `D-2.14-2/6`).
- **The overlay** (`fixed inset-0 z-40 bg-ground overflow-y-auto lg:hidden`, mounted when open) renders its
  own top bar — wordmark home-link (left) + **X** close (right, `aria-label={t('close')}`) — then the stacked
  **large left-aligned** rows **Catalog · About · Contact · Cart** (`text-h2`, `min-h-11`, `border-l-2 pl-4`;
  active → **left** 2px `border-mustard` + `text-foreground`, `D-2.15-4` supersedes `D-2.14-7`; Cart carries the
  `ShoppingBag` icon + the verbatim count badge), a `border-t border-border` divider, the **centred** MK·EN, and
  the **centred** "Built by Vertex Consulting" credit (only the company name linked, `target="_blank"`). MK·EN,
  the cart, and the credit all moved **inside** — the closed bar is wordmark + burger only (`D-2.15-2`,
  supersedes `D-2.14-5`). The overlay is self-contained and simply covers the header bar behind it (`D-2.15-3`).
- **Modal contract** (`D-2.15-1`): `useState(false)`; open on the burger; **close** on the X, on **Escape**, on
  any link/cart/wordmark tap, and on route change (the **render-time reset** pattern from 2.14 kept — `D-2.14-9`;
  no pathname `useEffect`). On open, focus moves to the **X**; on close by Escape **or the X**, focus returns to
  the **burger**. **Focus trap** (Tab/Shift+Tab cycle only within the 9 overlay focusables, wrapping at the
  edges). **Scroll lock** (`document.body.style.overflow='hidden'`, restored on close/unmount). **Resize safety**
  — a `matchMedia('(min-width:1024px)')` `change` listener **plus** a plain `resize` re-check of the same query
  (`D-2.15-7`, belt-and-suspenders so a resize-to-desktop-while-open always closes it and releases the lock).
  **No animation** (`D-2.14-8` in force).
- **Strings:** exactly one key added per catalog — `Nav.close` (МК „Затвори" / EN "Close"), after `menu` in the
  `Nav` namespace (`D-2.15-5`). Catalogs **242 → 243**; `docs/i18n/string-inventory.md` regenerated (header reads
  **243**, only added row is `Nav.close`). **No `@base-ui/react` import, no shadcn primitive, no new dependency**
  (`package.json` + lockfile byte-unchanged); `src/components/ui/` still holds only `.gitkeep`.

**Gates:** `npm run build` (exit 0, "✓ Compiled successfully", full route tree) / `npx tsc --noEmit` (exit 0) /
`npm run lint` (clean, exit 0) all pass; `npm test` **116/116** (unchanged count — the header carries no tests)
incl. `✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock
0` (untouched — no commerce code changed) + the i18n catalog-parity suite, now covering **243** keys.
**Rendered + measured in-browser** (dev server, **both locales** via `/` (MK, `NEXT_LOCALE`) + `/en`, at **320 /
390 / 768 / 1024 / 1280**), by `getBoundingClientRect()` + computed styles, not by eye:
- **320 & 390, both locales, closed:** the header is **one row — only the wordmark + burger** (credit, nav, and
  the MK·EN/cart cluster all compute `display:none`); burger **44×44**; `scrollWidth == clientWidth`
  (320==320, 390==390).
- **320 & 390, both locales, open:** the overlay computes `position: fixed`, covers the viewport (390×844),
  opaque `bg-ground` (`rgb(15,18,16)` = `#0F1210`), `z-40`; order is **top bar → Catalog·About·Contact·Cart →
  divider → centred MK·EN → centred credit**; rows are `text-h2` (**24px** at ≤390) and **none wrap**;
  `scrollWidth == clientWidth`.
- **768, both locales, closed:** below `lg` → burger visible, nav + cluster `display:none`, no overflow.
- **1024 & 1280, both locales:** burger + overlay compute **`display:none`**; credit + centred nav + MK·EN +
  cart all render; nav centre X at **offset 0px** (≤ ±4px) from the container content-box centre; **at 1280 all
  8 header items share one centreline (cy 34, delta 0)** — the 2.13 desktop result is untouched;
  `scrollWidth == clientWidth`.
- **Interaction (MK/EN 390):** the burger sets `aria-expanded="true"`, mounts the dialog, moves focus to the
  **X** („Затвори"/"Close"), and locks body scroll. **Escape** closes it, sets `aria-expanded="false"`, restores
  body scroll, and returns focus to the **burger**; the **X** does the same (focus → burger). **Focus trap:**
  9 focusables, Tab at the last wraps to the first and Shift+Tab at the first wraps to the last. **Navigate:**
  tapping **Catalog** loads `/katalog` (`/en/catalog`) with the overlay **closed on arrival** and body scroll
  restored; tapping **Cart** loads `/kosnicka` (`/en/cart`) closed. **Active state:** on `/katalog` +
  `/en/catalog` the open-overlay Catalog row carries `aria-current="page"` + a **left** 2px `rgb(226,169,60)`
  accent; at 1280 the desktop Catalog link still shows the **bottom** 2px mustard border. **Resize safety:**
  opening at 390 then a viewport ≥ 1024 closes the overlay and restores body scroll (no stranded lock).
- **Header console errors: zero new.** The Next dev overlay still shows the **pre-existing, out-of-scope**
  `ProductCard.tsx:59` MK price hydration mismatch ("1,500 ден" server vs "1.500 ден" client) on the Home
  live-drop grid — confirmed via the dev-server log (stack roots in `HomePage → HomeExperience → ProductCard →
  SpotlightCard`, **zero header involvement**); `ProductCard.tsx` is **byte-unchanged** vs `main`, so it is
  inherited, not introduced. Hard stop #5 forbids touching it; still open, flagged for a separate task.
Screenshots captured: **MK 390 closed**, **MK 390 open**, **EN 390 open**, **MK 1280**, **EN 1280**.

**Frozen (byte-unchanged, `git diff --name-only main` lists only `SiteHeader.tsx`, `mk.json`, `en.json`,
`string-inventory.md` + the state/decision/report docs):** `ProductCard.tsx` / `HomeExperience.tsx` /
`SiteFooter.tsx` / `LanguageSwitch.tsx` (internals — reused only, passed no prop) / `src/app/[locale]/layout.tsx`
/ `src/app/globals.css` / `brand.md` / `facts.md` / `src/lib/orders/` / `create_order` / `expire_reservations` /
`supabase/` / cart / checkout / `Turnstile.tsx` / `src/config/` / `src/lib/drop/` / `src/lib/site.ts` /
`src/lib/seo/*` / `sitemap.ts` / `robots.ts` / `manifest.ts` / `llms.txt` / logo+icon assets / `package.json` +
lockfile (**no new dependency**). **No new token, no new CSS block in `globals.css`, no hex literal, no raw px
literal** in the diff (grep-proven; the precise `\border-(first|last|none|[0-9]+)` order-utility grep is empty).
**No new placeholder**, **no `[PLACEHOLDER: …]` marker**; **placeholder register UNCHANGED**; **no new fact** (a
menu label is not a factual claim; the credit still renders on every page, now inside the menu below `lg`).
**Owed-verification register +1** (#30 — full-screen menu sign-off on the live deploy, on a real phone, both
locales; the MK „Затвори" label is a new MK string not covered by the 2.03 review stamp). Decisions `D-2.15-1…6`
(all six orchestrator-made, appended verbatim) + `D-2.15-7` (Claude Code — the resize belt-and-suspenders);
`D-2.14-2/5/6/7` marked `Superseded by D-2.15-1/2/1/4` (bodies intact). **`file-map.md` needs no tree change**
(no file added, moved, or deleted). Branch `phase-2.15-mobile-overlay-menu`; **PR
[#27](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/27) MERGED to `main` (merge `5fb65d2`,
2026-07-25) on Petar's explicit instruction (`D-0-3`: operator-authorised, not Code); branch deleted** (clean
GitHub PR merge; PR #27 shows the "Merged" badge). **Production deploy VERIFIED — and this time the mobile
overlay was driven on the live site in BOTH locales** (unlike 2.14, the external-site pane shrank below 1024px):
on `https://www.trajanovv.com` the deployed header carries the **new** burger (`aria-controls="mobile-menu"`;
the old 2.14 `aria-controls="site-nav"` burger is gone), and at effective **1280** the desktop render is the
2.13 grid untouched (burger `display:none`, nav **Catalog · About · Contact** at **offset 0px**, all 8 items on
one centreline delta 0, no overflow). Resized to **390** the burger opens the full-screen overlay: `position:
fixed`, opaque `bg-ground` (`rgb(15,18,16)`), `z-40`, covers the viewport, body scroll locked, focus on the X;
order top-bar → **Catalog·About·Contact·Cart** (`text-h2` 24px) → divider → centred MK·EN → centred "Built by
Vertex Consulting"; no overflow. **EN** shows the X `aria-label` **"Close"**; **MK** (via `NEXT_LOCALE`) shows
**„Затвори"** and the localised rows (Каталог · За брендот · Контакт · Кошничка) — the new MK string is live.
The **real-phone feel + the native-MK „Затвори" read stay owed #30** (Lazar + Petar). `NEXT:` line **unchanged**
— out-of-band, does not touch the 2.06 → Y.01 critical path.

**2.14 COMPLETE — the phone header is now one clean line with the three page links behind a burger menu
(this update, 2026-07-24).** An out-of-band **UI-only** phase (the 2.07/2.08/2.09/2.10/2.11/2.12/2.13/Y.02
shape) — **no commerce, no schema touched**, exactly **one** new message key per catalog, and **line 1
`NEXT:` is unchanged** (the 2.06 operator rehearsal remains next; this phase does not advance the critical
path). Below `lg` (1024px) the nav used to drop to its own centred second row above every page; that row is
now replaced by the burger button people expect, one tap from the links. What shipped:
- **`src/components/layout/SiteHeader.tsx` — the burger button + the open/close state + the panel styling
  of the existing `<nav>`.** The burger is a `<button type="button" lg:hidden>` added as the **first child
  of the right-hand controls group, before `<LanguageSwitch />`**, so DOM/reading order becomes wordmark →
  credit → nav → **burger** → MK·EN → cart (cart still last). Its size/interaction classes are **identical
  to the cart control** (`h-11 w-11`, 44px WCAG-2.2 target; `rounded-[var(--radius-md)]`,
  `hover:bg-surface`, the shared focus ring); icon is lucide `Menu` when closed / `X` when open
  (`h-5 w-5`, `strokeWidth 1.75`, matching `ShoppingBag`); `aria-label={t('menu')}` · `aria-expanded` ·
  `aria-controls="site-nav"`. The gap to MK·EN reuses the group's existing `gap-6` (**no new gap value**).
- **The existing `<nav>` *is* the panel — DOM unchanged (`D-2.14-6`), `id="site-nav"` added** (grep-proven
  unused; `main-content` is still the only other id). Grid placement is byte-identical to 2.13
  (`col-span-2 col-start-1 row-start-2 lg:col-span-1 lg:col-start-2 lg:row-start-1`). Below `lg` it is
  `hidden` when closed / `flex` when open, plus `lg:flex` so it is **always** visible at `lg` regardless of
  state — every stacked style (`flex-col items-stretch`, full-width `w-full min-h-11 px-3
  rounded-[var(--radius-md)]` link rows) is reverted by an `lg:` variant, so the desktop render is correct
  whether open or closed. **No resize listener, no `matchMedia`, no state reset on resize.** Reuses the
  existing `gap-4` (2.13's "two gap tokens only" stays literally true). Active link in the open panel is a
  **filled `bg-surface` row with a transparent border** (`D-2.14-7`); at `lg` the 2px `--color-mustard`
  underline is unchanged. `isActive`/`aria-current`/type classes/focus ring untouched.
- **Behaviour:** `useState(false)`; the button toggles it. **On open** focus moves to the first link
  (`navRef.querySelector('a').focus()`); **Escape** (bound only while open, torn down on close) and the
  **button** return focus to the button. **Each link's `onClick` closes it**, and a **render-time reset**
  closes it on any route change (back/forward included). The route-change close uses React's documented
  "reset state when a value changes" render pattern, **not** a pathname `useEffect` — the naive
  `setOpen(false)` in an effect is a hard **lint error** here (`react-hooks/set-state-in-effect` in
  `eslint-config-next`, a Task 7 gate); the render-time pattern is the fix the lint message itself links to
  and is behaviourally identical (`D-2.14-9`). **No scroll lock, no body class, no portal, no overlay, no
  click-outside handler, no animation** (`D-2.14-2/8`).
- **Strings:** exactly one key added per catalog — `Nav.menu` (MK „Мени" / EN "Menu"), last in the `Nav`
  namespace (`D-2.14-4`). Catalogs **241 → 242**; `docs/i18n/string-inventory.md` regenerated (header reads
  **242**, the only added row is `Nav.menu`). **No `@base-ui/react` import, no shadcn primitive, no new
  dependency** (`package.json` + lockfile byte-unchanged); `src/components/ui/` still holds only `.gitkeep`.

**Gates:** `npm run build` (exit 0, "✓ Compiled successfully", full route tree) / `npx tsc --noEmit` (exit
0) / `npm run lint` (clean, exit 0 — the render-time reset is what makes it green) all pass; `npm test`
**116/116** (unchanged count) incl. `✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7
rejected with insufficient_stock, stock 0` (untouched — no commerce code changed) + the i18n catalog-parity
suite, now covering **242** keys. **Rendered + measured in-browser** (dev server, **both locales** via `/`
(MK, `NEXT_LOCALE`) + `/en`, at **320 / 390 / 768 / 1024 / 1280**), by `getBoundingClientRect()` + computed
styles, not by eye:
- **320 & 390, both locales, menu closed:** panel computes `display: none` (nav second row gone → the
  grid is one row) and `scrollWidth == clientWidth` (320==320, 390==390). Burger **44×44** and cart
  **44×44** (both ≥ WCAG 44); at 390 they share a centreline (cy 51.8).
- **320 & 390, both locales, menu open:** the three links are a vertical stack (`flex-direction: column`),
  each row **44px** tall, and **no overflow** (`scrollWidth == clientWidth`).
- **768, both locales, closed:** below `lg` → burger visible, panel `display: none`, no overflow.
- **1024 & 1280, both locales:** burger computes **`display: none`**, the nav is visible (`display: flex`),
  and the nav's centre X is **offset 0px** (≤ ±4px) from the container content-box centre. **At 1280 all 8
  header items share one vertical centre (cy 34, delta 0)** — the 2.13 desktop result is untouched.
- **Interaction (MK 390):** clicking the burger sets `aria-expanded="true"`, shows the panel (icon → `X`),
  and `document.activeElement` is the first link ("Каталог"). **Escape** closes it, sets
  `aria-expanded="false"` (icon → `Menu`), and `document.activeElement` is the burger button again.
- **Navigate:** tapping "Catalog" in the open panel loads the catalog page **with the panel closed** —
  verified both locales (`/katalog`, `/en/catalog`; menu `aria-expanded="false"`, `display: none` on
  arrival).
- **Active state:** on `/katalog` and `/en/catalog` the Catalog link carries `aria-current="page"` — a
  filled `bg-surface` (`rgb(23,26,24)` = `#171a18`) row with a transparent bottom border in the open panel
  at 390, and the 2px `rgb(226,169,60)` (`--color-mustard`) underline with transparent bg at 1280.
- **Header console errors: zero new.** The Next dev overlay still shows the **pre-existing, out-of-scope**
  `ProductCard.tsx:59` MK price hydration mismatch ("1,500 ден" server vs "1.500 ден" client) on the Home
  live-drop grid — confirmed via the dev-server log (stack trace roots in `HomePage → HomeExperience →
  ProductCard`, zero header involvement); `ProductCard.tsx` is **byte-unchanged** vs `main`, so it is
  inherited, not introduced. Hard stop #6 forbids touching it; still open, flagged for a separate task.
Screenshots captured: **MK 390 closed**, **MK 390 open**, **EN 390 open**, **MK 1280**, **EN 1280**.

**Frozen (byte-unchanged, `git diff --name-only main` lists only `SiteHeader.tsx`, `mk.json`, `en.json`,
`string-inventory.md` + the state/decision/report docs):** `ProductCard.tsx` / `HomeExperience.tsx` /
`SiteFooter.tsx` / `LanguageSwitch.tsx` / `src/app/[locale]/layout.tsx` / `src/app/globals.css` /
`brand.md` / `facts.md` / `src/lib/orders/` / `create_order` / `expire_reservations` / `supabase/` / cart /
checkout / `Turnstile.tsx` / `src/config/` / `src/lib/drop/` / `src/lib/site.ts` (`SITE_URL`) /
`src/lib/seo/*` / `sitemap.ts` / `robots.ts` / `manifest.ts` / `llms.txt` / logo+icon assets /
`package.json` + lockfile (**no new dependency**). **No new token, no new CSS block, no hex literal, no raw
px literal** in the diff (grep-proven; the only `order-`-substring hits are `border-*` classes, precise
grep `\border-(first|last|none|[0-9]+)` empty). **No new placeholder**, **no `[PLACEHOLDER: …]` marker**;
**placeholder register UNCHANGED**; **no new fact** (a menu label is not a factual claim). **Owed-verification
register +1** (#29 — burger menu sign-off on the live deploy, on a real phone, both locales; the MK label
„Мени" is a new MK string not covered by the 2.03 review stamp). Decisions `D-2.14-1…8` (all eight
orchestrator-made, appended verbatim) + `D-2.14-9` (Claude Code, the render-time-reset lint resolution).
**`file-map.md` needs no tree change** (no file added, moved, or deleted). Branch
`phase-2.14-mobile-nav-menu`; **PR [#26](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/26)
MERGED to `main` (merge `554ec04`, 2026-07-24) on Petar's explicit instruction (`D-0-3`: operator-authorised,
not Code); branch deleted** (clean fast-forward — the stale-head OID issue that hit 2.07/2.08 did not recur;
PR #26 shows the "Merged" badge). **Production deploy VERIFIED** — on the live `https://www.trajanovv.com`
the deployed HTML carries the burger button (`aria-controls="site-nav"`, lucide `Menu` icon, `lg:hidden`),
the panel (`id="site-nav"`), and the both-locale `aria-label` (MK **„Мени"** at `/`, EN **"Menu"** at
`/en`); and the live **desktop** render (browser pane, effective 1280px) shows the burger computing
**`display: none`**, the nav **Catalog · About · Contact** centred at **offset 0px**, all header items on one
centreline (delta 0), and no horizontal overflow — the 2.13 desktop result is untouched. The external-site
pane could **not** be shrunk below 1024px CSS width (its `innerWidth` stays 1280 regardless of the frame), so
the **mobile stacked-panel** render was not re-driven on production — but it is present in the deployed HTML
and was fully measured on localhost against byte-identical built code; the real-phone mobile confirmation
stays **owed #29**. `NEXT:` line **unchanged** — out-of-band, does not touch the 2.06 → Y.01 critical path.

**2.13 COMPLETE — the header nav (Catalog · About · Contact) is now on the true page centreline (this
update, 2026-07-24).** An out-of-band **UI-only** phase (the 2.07/2.08/2.09/2.10/2.11/2.12/Y.02 shape) —
**no commerce, no schema, no message key touched**, and **line 1 `NEXT:` is unchanged** (the 2.06 operator
rehearsal remains next; this phase does not advance the critical path). The three page links used to sit
jammed against MK·EN + cart on the far right; they now sit on the header's real centreline (brand left /
nav centre / controls right). What shipped:
- **`src/components/layout/SiteHeader.tsx` restructured to a CSS grid** — the one flat `justify-between`
  flex row of two groups became a three-child grid in reading order: LEFT (wordmark + credit) · `<nav>` ·
  RIGHT (MK·EN + cart). Container `grid-cols-[minmax(0,1fr)_auto]` below `lg`,
  `lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]` at `lg`. The two outer columns are `minmax(0,1fr)` and
  the middle is `auto`, so the nav is centred on the container's centreline regardless of how wide the left
  and right groups are (`D-2.13-1`). The inner markup of all three groups — links, link classes, the
  `isActive`/`aria-current` logic, the `t.rich` credit, the cart `h-11 w-11` tap target + count badge — was
  **moved verbatim**; only container classes + grid placement changed. Achieved with grid placement only
  (`col-start`/`row-start`/`col-span`), **never `order-*`**, so DOM/reading order stays wordmark → credit →
  Catalog → About → Contact → MK·EN → cart, cart last.
- **Below `lg` (1024px) the nav drops to its own centred row** (`col-span-2 row-start-2`), spanning both
  columns and `justify-center` (`D-2.13-2`); at `lg` it becomes the middle `auto` column of the
  three-column row (`D-2.13-3`: MK's long „Изработено од Vertex Consulting" credit + longer MK nav labels
  do not co-fit one row with the nav centred until `lg`). Two gap tokens only: `gap-4` between the nav
  links, `gap-6` between MK·EN and cart. Non-sticky, solid `bg-ground` (`D-2.08-3` carried forward); still
  a **client component** with `usePathname()` driving the active-link underline (`D-2.08-4`).
- **`D-2.13-3` `xl` conditional evaluated and `lg` retained** — at 1024px the MK three-column row fits
  (no overflow, nav offset 0px) with the left group wrapping to a clean two-line wordmark-over-credit block
  (the reference markup's `flex-wrap`, overflow-ladder rung 1); EN fits on one line at 1024. Raising to `xl`
  would degrade EN's clean 1024 single-row to fix a non-broken MK wrap, so `lg` stands. No type token
  shrunk, no label truncated/hidden/reworded.

**Gates:** `npm run build` (exit 0, full route tree) / `npx tsc --noEmit` (exit 0) / `npm run lint` clean;
`npm test` **116/116** incl. `✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with
insufficient_stock, stock 0` (untouched — no commerce code changed) + the i18n catalog-parity test.
**Rendered + measured in-browser** (dev server, **both locales** via `/` (MK, `NEXT_LOCALE`) + `/en`, at
**320 / 390 / 768 / 1024 / 1280**), by `getBoundingClientRect()` + computed styles, not by eye:
- **`scrollWidth == clientWidth` at every width, both locales** (320/390/768/1024/1280 all equal) — **no
  horizontal overflow anywhere; overflow-ladder rung used = NONE.**
- **Nav centre X within ±4px of the container content-box centre X at every width, both locales — measured
  offset was exactly 0px in all ten cases.** At ≥1024 the nav is the middle grid column; below 1024 it is
  on its own row (`navOwnRow` true at 768/390/320) and still centred (offset 0).
- **One centreline within each row:** at **1280 both locales + 1024 EN** all seven items share an identical
  vertical centre (delta **0**, e.g. all at 34.0px @ 1280). Where the left group wraps (1024 MK; 390/320
  both locales) the wordmark/credit stack by design (rung 1) — but the nav links share one centreline
  (delta 0) and the main-row controls share one centreline; `grep` proves **no `self-*`/`mt-`/
  `items-baseline` utility** anywhere, so there is no baseline-nudge regression.
- **Active link on `/catalog`** shows `aria-current="page"` + a 2px `--color-mustard` (`rgb(226,169,60)`)
  bottom border, inactive links transparent — verified **both** locales (`/katalog` + `/en/catalog`).
- **Header console errors: zero.** (The Next dev overlay shows **one pre-existing, out-of-scope** hydration
  mismatch in `ProductCard.tsx:59` — MK price "1,500 ден" server vs "1.500 ден" client, a `formatMkd`
  locale-separator divergence in the live-drop grid; it originates entirely in ProductCard/HomeExperience,
  `ProductCard.tsx` is byte-identical to `main`, so it is unrelated to the header and present on `main`.
  Flagged for a separate task; hard stop #6 forbids touching ProductCard here.)
Screenshots captured: **MK 390**, **MK 1280**, **EN 1280** (nav centred in each; MK 390 shows the nav on
its own centred second row with the credit wrapped under the wordmark).

**Frozen (byte-unchanged, `git diff --name-only main` lists only `SiteHeader.tsx` + the state/decision/report
docs):** `src/messages/{mk,en}.json` (zero new/changed strings — still **241** keys) / `brand.md` /
`src/app/globals.css` (zero new/changed tokens, no new CSS block) / `facts.md` / `SiteFooter.tsx` /
`LanguageSwitch.tsx` / `src/app/[locale]/layout.tsx` / `src/lib/orders/` / `create_order` /
`expire_reservations` / `supabase/` / cart / checkout / `Turnstile.tsx` / `src/config/` / `src/lib/drop/` /
`src/lib/site.ts` (`SITE_URL`) / `src/lib/seo/*` / `sitemap.ts` / `robots.ts` / `manifest.ts` / `llms.txt` /
logo+icon assets / `package.json` + lockfile (**no new dependency**). **No new placeholder**, **no
`[PLACEHOLDER: …]` marker**. **Owed-verification register +1** (#28 — Lazar header-layout sign-off on the
live deploy, desktop + phone, both locales). **Placeholder register UNCHANGED.** Decisions `D-2.13-1/2/3`
(all three orchestrator-made, appended verbatim; `D-2.08-6` marked `Superseded by D-2.13-1 (layout only —
the one-centreline fix stands)`). Branch `phase-2.13-header-nav-centre`; **PR
[#25](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/25) MERGED to `main` (merge `aa18746`,
2026-07-24) on Petar's explicit instruction (`D-0-3`: operator-authorised, not Code); branch deleted.**
(Clean GitHub PR merge — the stale-head OID issue that hit 2.07/2.08 did not recur; PR #25 shows the
"Merged" badge.) **Production deploy VERIFIED** — on the live `https://www.trajanovv.com` the header is now
a **three-column CSS grid** (`display: grid`, `grid-template-columns: 425.77px 204.47px 425.77px` — equal
outer `minmax(0,1fr)` columns + an `auto` middle), the nav is **Catalog · About · Contact** centred at
**offset 0px** from the container content-box centre, all header items report **one centreline (delta 0)**,
and there is **no horizontal overflow** — the old `justify-between` flex row is gone. (Production served the
**EN** render — its middleware honours the browser Accept-Language over the `NEXT_LOCALE` cookie; the header
is a single locale-shared component, so MK ships the same grid, and the **MK visual on a real device is
Lazar's owed #28 sign-off**, which covers both locales.) `NEXT:` line **unchanged** — out-of-band, does not
touch the 2.06 → Y.01 critical path.

**2.12 COMPLETE — the Home hero sub-line is now a brand line, not a facts line (this update, 2026-07-24).**
An out-of-band **copy-only** phase (the 2.07/2.08/2.09/2.10/2.11/Y.02 shape) — **no component, no commerce,
no schema touched**, and **line 1 `NEXT:` is unchanged** (the 2.06 operator rehearsal remains next; this
phase does not advance the critical path). The paragraph under the Home headline recited logistics (3–5
pieces, real stock, cash on delivery) — facts now answered eight ways in the FAQ directly below it (2.11).
What shipped:
- **`Home.sub` replaced in both catalogs** — MK „Пронајди сродна, во свет продадени души." / EN „Find a
  kindred soul, in a world full of sold souls." — **shipped byte-exact as the operator supplied them**
  (`D-2.12-2`). The MK is **deliberately not a word-for-word translation** of the EN and is deliberately
  shorter; the EN is deliberately a comma splice. Code edited neither language. This is a **two-string
  change**: `Home.sub` renders at **three sites in `HomeExperience.tsx`** (no-view fallback, `ended`,
  `countdown`) × two locales = **six rendered surfaces from two edited values**; it is **not** rendered in
  the `live` branch (that state shows the product grid). `grep -rn "'sub'" src/` returns **only**
  `HomeExperience.tsx`, three sites — confirmed before and after.
- **The new line makes no factual claim** — it is brand voice, so **no `facts.md` entry** was added and
  `facts.md` is **byte-unchanged**. The three VERIFIED facts the old line carried each still render
  elsewhere in **both** locales (grep-proven, §8 of the report): drops **3–5 pieces / limited** →
  `Faq.a8` + `About.body3` + `Meta.homeDescription`; **cash on delivery** → `Faq.a2` + `Cart.codNote` +
  `Checkout.codSummary` + `Common.shippingNotice` + `Meta.*`; **ships North Macedonia only** →
  `Common.shippingNotice` + `Product.shippingBody` + `About.body3` + `Faq.a4`.
- **`Meta.homeDescription` (the search snippet) is untouched** (`D-2.12-3`) — it still reads "Oversized
  unisex t-shirts from Strumica. Drops of 3 to 5 pieces, real limited stock, cash on delivery." The
  search snippet and the on-page hero now say different things, deliberately; **not** harmonised. (The
  brief calls this key `Metadata.homeDescription`; the actual namespace in the catalogs is `Meta`.)
- **Humanizer** run over the two new strings per Task 3 — **nothing acted on** (`D-2.12-2` ships them
  verbatim). Its pattern list fired **nothing** (no AI vocabulary, no em dash, no rule-of-three, no
  copula avoidance, no promo-vocab, no curly quotes, no filler/hedging); the only recorded observations
  are the two *deliberate* operator choices — the EN comma splice and the MK elided noun after „сродна".
- **Inventory regenerated** `docs/i18n/string-inventory.md` — header still **241 keys**; the `Home.sub`
  row shows the new MK+EN text and still points at `src/components/home/HomeExperience.tsx`; **one line
  changed**. **`docs/i18n/mk-review-2.12.md`** written **unsigned** — covers the one MK string, states it
  is operator-authored/shipped-verbatim, that the reviewer reads the Macedonian **on its own terms**
  (not against the EN), and asks the one question: **finished Macedonian, or a fragment?**

**Gates:** `npm run build` (exit 0, "✓ Compiled successfully") / `npx tsc --noEmit` / `npm run lint` clean;
`npm test` **116/116** incl. `✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected
with insufficient_stock, stock 0` (untouched — no commerce code changed) + the i18n catalog-parity test
(`has identical key sets`, `has no empty value`). **Rendered + verified in-browser** (dev server, **both
locales** via `/` (MK, `NEXT_LOCALE`) + `/en`, at **1280 + 390**, using `?preview=` to reach each state),
by the accessibility tree + computed styles, not by eye alone: **countdown** — the new line renders under
the headline, correct language in each build (MK „Пронајди сродна…", EN „Find a kindred soul…"); **ended**
— same; **live** — the sub-line is **absent** (product grid), unchanged from today. **Zero English in the
MK build / zero Macedonian in the EN build** for this string in every state checked. **No horizontal
overflow at 390** either locale (`scrollWidth == clientWidth == 390`); the paragraph wraps inside
`max-w-md` (448px) and clears the link below it by **24px** (no collision). **Exactly one `<h1>` per
state**; heading order unchanged (this phase touches no heading). Paragraph still uses
`text-muted-foreground` (`rgb(171,167,158)` = `#ABA79E`) on the same ground `#0F1210` — measured contrast
**7.85:1** (unchanged, ≥ 4.5). **No console errors.** Screenshots captured: **MK countdown 390**, **EN
countdown 390**, **MK countdown desktop 1280**.

**Frozen (byte-unchanged, `git diff --name-only main`):** `src/components/home/HomeExperience.tsx` /
`Countdown.tsx` / `DropBanner.tsx` / `HomeFaq.tsx` / `src/app/[locale]/page.tsx` / `src/app/globals.css` /
`src/lib/orders/` / `create_order` / `expire_reservations` / `supabase/` / cart / checkout / `src/config/` /
`src/lib/drop/` / `src/lib/site.ts` (`SITE_URL`) / `facts.md` / `brand.md` / `src/lib/seo/*` / `sitemap.ts` /
`robots.ts` / `manifest.ts` / `llms.txt` / logo+icon assets — and **every other message key in both
catalogs, including `Meta.homeDescription`**. The diff is only `src/messages/{mk,en}.json` (one value each),
`docs/i18n/string-inventory.md` (one row), the new `docs/i18n/mk-review-2.12.md`, and the
state/decision/report/file-map docs. **No new dependency** (`package.json` + lockfile unchanged); **no new
message key** (still **241**); **no new placeholder**, **no `[PLACEHOLDER: …]` marker**; **no new token**.
**Owed-verification register +1** (#27 native MK review of the new `Home.sub` string, owner Lazar + Petar).
**Placeholder register UNCHANGED** — this phase adds none and clears none. Decisions `D-2.12-1/2/3` (all
three pre-made by the orchestrator in the brief, appended verbatim). Branch `phase-2.12-home-sub-line`;
**PR [#24](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/24) MERGED to `main` (merge
`b92de08`, 2026-07-24) on Petar's explicit instruction (`D-0-3`: operator-authorised, not Code); branch
deleted.** (Clean GitHub PR merge — the stale-head OID issue that hit 2.07/2.08 did not recur; PR #24 shows
the "Merged" badge.) **Production deploy VERIFIED** — on the live `https://www.trajanovv.com/` the Home
hero renders the new brand line (MK „Пронајди сродна, во свет продадени души." at `/`, EN „Find a kindred
soul, in a world full of sold souls." at `/en`; the committed drop is ENDED so the hero shows the sub-line),
the **old facts line is gone** (no „3 до 5 парчиња. Вистински…" in the hero), and **`Meta.homeDescription`
is untouched** — the `<meta name="description">` still reads „…Спуштања од 3 до 5 парчиња, вистински
ограничени залихи, готовина при преземање." (hero and snippet diverge by design, `D-2.12-3`). `NEXT:` line
**unchanged** — out-of-band, does not touch the 2.06 → Y.01 critical path.

**2.11 COMPLETE — the Home page now answers the five questions every Instagram buyer asks, under the
hero (this update, 2026-07-23).** An out-of-band UI phase (the 2.07/2.08/2.09/2.10/Y.02 shape) — **no
commerce logic touched**, and **line 1 `NEXT:` is unchanged** (the 2.06 operator rehearsal remains
next; this phase does not advance the critical path). What shipped:
- **New server component `src/components/home/HomeFaq.tsx`** — `<section>` under the hero, both locales,
  rendering **eight questions in three static group labels** (Нарачка / Достава / Парчињата — `D-2.11-2`,
  no interactive tab row) as native **`<details name="home-faq">`/`<summary>`** disclosures (`D-2.11-3`):
  zero JS, server-rendered, correct keyboard + SR behaviour for free, every answer in the DOM for
  crawlers, and native **one-open-at-a-time** via the shared `name`. Each summary has the lucide `Plus`
  icon (`aria-hidden`) that rotates 45° → × when open. Heading is an **`<h2>`** (never a second `h1`),
  group labels are `<h3>` eyebrows — order stays h1→h2→h3. Below the list: `Faq.moreQuestion` + a
  localised `<Link href="/contact">` (`Faq.moreLink`) — **no email/phone printed** (footer + Contact
  already carry them). No `'use client'`, no state, no effects, no `view` prop — renders identically in
  all three drop states + preview.
- **New single source `src/lib/faq.ts`** — a typed, ordered structure of three groups (label key +
  ordered q/a key pairs) + a flattened `FAQ_ITEMS`. **Keys only, no translated strings.** Both the UI
  (`HomeFaq`) and the JSON-LD (`faq-jsonld`) iterate this — neither hand-lists keys, so the visible and
  structured answers cannot drift (`D-2.11-5`). Not `server-only`, so the test imports it directly.
- **New `src/lib/seo/faq-jsonld.ts`** — a pure `faqJsonLd(t)` that builds a `FAQPage` node (one
  `Question`/`acceptedAnswer` per item, in faq.ts order) from a passed-in translator, rendered on Home
  via the existing `<JsonLd>` **inside `HomeFaq`** (`D-2.11-7`). **New `tests/seo/faq-jsonld.test.ts`**
  (23 assertions): 8 questions, non-empty name/text, faq.ts order, node text byte-identical to the
  catalog, and every faq.ts-referenced key present + non-empty in **both** catalogs.
- **22 new message keys per locale (44 total)** under a new `Faq` namespace in `src/messages/{mk,en}.json`
  — 6 structure/label + 8 questions + 8 answers, MK+EN key sets identical (parity test green). MK is the
  source (shipped as written); the humanizer pass over the EN found nothing to change (tight brand-voice
  copy, ≤1 em dash per answer, real enumerations not padding). Every answer traces to a `facts.md`
  VERIFIED entry or an already-reviewed Terms/Shipping string (source-trace table in the brief); the two
  „сè уште не се потврдени/објавени" sentences in `a5`/`a7` are **deliberate honest prose, not a
  `[PLACEHOLDER: …]` marker** — no marker added anywhere. MK `a8` uses the repo's „…“ quote convention
  (`D-2.11-6`).
- **Scoped CSS in `src/app/globals.css`** — a `.faq-item` block (surface bg, `--color-border` hairline,
  `--radius-lg`, hover→`--color-surface-2`, summary marker removed, Plus rotation on `[open]`,
  `::details-content` block-size 0→auto via `interpolate-size: allow-keywords` +
  `transition-behavior: allow-discrete`). **Zero literal colour** — every value is an existing token, no
  new token introduced. The global `focus-visible` ring lands on `<summary>` (verified); the global
  reduced-motion rule already collapses the transitions (no second block added).
- **Mounted** `<HomeFaq />` in `src/app/[locale]/page.tsx` after `<HomeExperience>` and before
  `<DevPreviewSwitch>`. **`docs/i18n/string-inventory.md` regenerated 219 → 241**; **`docs/i18n/mk-review-2.11.md`**
  written **unsigned** (22 MK strings, flags the two deliberate "not confirmed yet" sentences).

**Gates:** `npm run build` (exit 0, "✓ Compiled successfully") / `npx tsc --noEmit` / `npm run lint`
clean; `npm test` **116/116** (was 93; +23 from the new FAQ JSON-LD suite) incl. `✓ 10 simultaneous
orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0` (untouched —
no commerce code changed) + the i18n catalog-parity test. **Rendered + verified in-browser** (dev
server, **both locales**, **all three drop states** via the preview switch, at **desktop 1280 + mobile
390**), by the accessibility tree + computed styles + a real axe run, not by eye alone: exactly **one
`h1`** and heading order **h1→h2→h3 no skips** in every state; **zero English in the MK build / zero
Macedonian in the EN build** (the FAQ strings); the disclosure opens (`::details-content` 0px→64px) and
the icon rotates (transform `none`→`rotate(45deg)`) — proven with transitions disabled to read the
resting target values; **native one-open-at-a-time** (opening a second row closes the first); real
click + Enter toggle; the global focus ring (`2px solid #F2C55A`) lands on `<summary>`; WCAG contrast
question **14.35** / answer **7.31** / group label + more-link **7.85** (all ≥ 4.5); **`axe` reports
zero violations** (not just zero serious/critical) on `/` **and** `/en`; no horizontal overflow at 390
or 1280; 56px summary tap target; **no console errors**. `FAQPage` JSON-LD verified by curl: node
present, **8 `Question`s**, answer text **byte-identical to the catalog** (MK). Screenshots captured:
desktop (FAQ heading below the product grid) + mobile closed (three group labels + `+` icons + contact
link) + mobile open ("Where do you ship?" open with the **× icon** + its revealed answer). (The
mid-page accordion rows resisted desktop screenshot capture on the long dark page — the same browser-
pane scroll/capture desync 2.07 documented; fully verified via the tree + computed styles + the mobile
captures instead.)

**Frozen (byte-unchanged, `git diff --name-only main`):** `src/components/home/HomeExperience.tsx` /
`Countdown.tsx` / `DropBanner.tsx` (hero/countdown/banners) / `src/lib/orders/` / `create_order` /
`expire_reservations` / `supabase/` / cart / checkout / `src/config/` / `src/lib/drop/` / `src/lib/site.ts`
(`SITE_URL`) / `facts.md` / `src/lib/seo/{site,product}-jsonld.ts` / `sitemap.ts` / `robots.ts` /
`llms.txt` / `manifest.ts` / logo+icon assets — the diff is only `src/app/[locale]/page.tsx`,
`src/app/globals.css`, `src/messages/{mk,en}.json`, `docs/i18n/string-inventory.md` (+ the four new files
HomeFaq.tsx / faq.ts / faq-jsonld.ts / faq-jsonld.test.ts) and the state/decision/report/mk-review docs.
**No new dependency** (`package.json` + lockfile unchanged); **no new placeholder** (`grep` clean — the
diff adds none), **no `[PLACEHOLDER: …]` marker in the section**; **no new token** (CSS + component diff
is hex/`rgb()`/`hsl()`-free). **Owed-verification register +3** (#24 native MK review of the 22 strings;
#25 the section on a real phone from an IG link; #26 sign-off that eight questions is the right amount).
**Placeholder register UNCHANGED** — this phase adds no marker and clears none. Decisions `D-2.11-1…7`
(five orchestrator + `D-2.11-6` MK quote glyph + `D-2.11-7` JSON-LD co-located in `HomeFaq`). Branch
`phase-2.11-home-faq`; **PR [#23](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/23)
MERGED to `main` (merge `ee3e89e`, 2026-07-23) on Petar's explicit instruction (`D-0-3`:
operator-authorised, not Code); branch deleted.** (Clean GitHub PR merge — the stale-head OID issue that
hit 2.07/2.08 did not recur; PR #23 shows the "Merged" badge.) **Production deploy VERIFIED** — on the
live `https://www.trajanovv.com/` the Home page renders the FAQ under the hero (h2 „Често поставувани
прашања" / "Frequently Asked Questions", the three group labels, all eight native `<details>` rows), and
the page HTML carries the `"@type":"FAQPage"` JSON-LD node with 8 `Question`s whose text matches the
rendered copy. `NEXT:` line **unchanged** — out-of-band, does not touch the 2.06 → Y.01 critical path.

**2.10 COMPLETE — product cards now carry a subtle white pointer spotlight (this update, 2026-07-23).**
An out-of-band UI phase (the 2.07/2.08/2.09/Y.02 shape) — **no commerce logic touched**, and **line 1
`NEXT:` is unchanged** (the 2.06 operator rehearsal remains next). The catalogue was a grid of flat dark
cards on a flat dark ground with nothing signalling which card the cursor is on. What shipped:
- **New client component `src/components/product/SpotlightCard.tsx`** — a thin `'use client'` wrapper that
  takes the card body as `children`, attaches **one `onPointerMove` to its own element** (never
  `document`/`window` — `grep -rn "document.addEventListener\|window.addEventListener"
  src/components/product/` is clean), and on move writes the pointer position to CSS vars `--glow-x`/
  `--glow-y` in px via `getBoundingClientRect()`, **rAF-throttled** (one write per frame, pending frame
  cancelled on unmount). It **bails before writing** on any non-mouse pointer and when
  `window.matchMedia('(hover: hover) and (pointer: fine)')` does not match — so a touch device does no
  work. No state, no document `useEffect`, no `dangerouslySetInnerHTML`, no inline `<style>`, no `aria-*`/
  `role` (it is decoration and never a focus target).
- **Scoped CSS in `src/app/globals.css`** — a single `.spotlight-card` class with a surface-wash `::after`
  and a 1px edge-light `::before` (the standard border-only mask, `mask-composite: exclude` /
  `-webkit-mask-composite: xor`), both a `radial-gradient` of `--color-glow` centred on `--glow-x`/
  `--glow-y`, revealed (`opacity 0→1`, `var(--motion-base)` fade) on `:hover` **and** on
  `:focus-visible > .spotlight-card` (keyboard users get the same affordance). The **whole block is gated
  in `@media (hover: hover) and (pointer: fine)`** — touch devices render/listen for nothing. The global
  reduced-motion rule already flattens the opacity transition; the glow itself is not disabled (a static
  glow is not motion). **Every colour in the effect is a token — the CSS + component + token diff has zero
literal hex/`rgb()`/`hsl()`** (the only hex in `git diff main` is doc prose explaining the gate, e.g. this
sentence and `D-2.10-3`).
- **Four new tokens** in **both** `brand.md` (§3 `--color-glow`; §5 a Spotlight table with `--glow-size`
  `240px`, `--glow-opacity-surface` `0.05`, `--glow-opacity-edge` `0.22`) **and** `globals.css` (`:root`,
  same order, right after `--color-mustard-tint-6`), identical values. Only `--color-glow` gets an
  `@theme inline` entry; the other three are read via `var()` and generate no utilities. **`--color-glow`
  is the off-white `--color-foreground`, never pure white** (`D-2.10-1`, decision A).
- **`ProductCard.tsx` stays a server component** (no `'use client'`). Only the **interactive** branch
  changed: `inner` is now wrapped in `<SpotlightCard>` **inside** the existing `<Link>`, so the Link keeps
  its own `focus-visible` ring + rounding. **The sold-out branch is byte-unchanged** — a sold-out card is
  the non-interactive `<div aria-disabled>` with no `.spotlight-card`, so it never glows (`D-2.10-1`,
  decision B).
- **`brand.md` §5 + §6 each gained a carve-out sentence** (`D-2.10-1`, decision C) so the next reader sees
  the "shadow is decoration-free" / "motion is countdown+reveal only" rules were **consciously** bent for
  this one effect, not forgotten.

**Notable brief-vs-repo differences (see report §3):** (1) Task 3 wrote the border mask as
`linear-gradient(#000,#000)`, but the DoD forbids any literal hex in the diff — used
`linear-gradient(var(--color-foreground),…)` instead (an **opaque token**; a mask reads only alpha, so it
is functionally identical and keeps the diff hex-free), logged `D-2.10-3`. (2) The DoD says `npm test`
**85/85**; the repo is at **93** since 2.09 added 8 size-order cases — so the real number is **93/93**.

**Gates:** `npm run build` (exit 0, "Compiled successfully") / `npx tsc --noEmit` / `npm run lint` clean;
`npm test` **93/93** incl. `✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with
insufficient_stock, stock 0` (untouched — no commerce code changed) + the i18n catalog-parity test.
**Rendered + verified in-browser** (dev server, both locales, **375px + desktop**), by computed styles +
the accessibility tree, not by eye alone: the `.spotlight-card` rule applies only under
`@media (hover: hover) and (pointer: fine)` (`position: relative`, `z-index: 0`, `--glow-x/y` default
`50%/0%`, `::after`/`::before` `border-radius: 14px` = `--radius-lg`, resting `opacity: 0`, `0.22s`
transition, `::before` masked to a 1px border with `mask-composite: exclude`); **hover reveals** the glow
(computed `::after`/`::before` opacity 0→1 on the hovered card only — no cross-card bleed); the
`onPointerMove` handler **writes `--glow-x/--glow-y` in px** on move (confirmed changing from the default);
**keyboard focus reveals** the glow via `:focus-visible > .spotlight-card` (proven with a temporary red
`::after` probe: the focused card filled red, the non-focused one did not) **and the focus ring is
unchanged** (the Link's `focus-visible:ring-2 ring-focus-ring ring-offset-2 ring-offset-ground` still
paints the `#F2C55A` ring — visually confirmed); the **sold-out card has no `.spotlight-card`** and no
glow (verified on `/styleguide`'s available/low/sold-out row); the **badges are not clipped** (wrapper
`overflow: visible`, the low-stock „УШТЕ 4"/"4 LEFT" pill visible at desktop + 375px); **no card shifts a
pixel** (the wrapper is exactly the size of the card body — `wrapsInnerExactly`); **no horizontal overflow
at 375px** (`scrollWidth == clientWidth == 375`); **no console or dev-server errors** on Home-live /
`/katalog` / `/en/catalog` / `/styleguide`. **Frozen:** `src/lib/orders/` / `create_order` /
`expire_reservations` / `supabase/migrations/` / cart / checkout / `src/config/` (incl. `products.ts`) /
`src/lib/site.ts` (`SITE_URL`) / `src/messages/{mk,en}.json` / `facts.md` / `src/lib/seo/` / `sitemap.ts` /
`llms.txt` / `manifest.ts` / logo+icon assets — `git diff --name-only main` shows only `brand.md`,
`src/app/globals.css`, `src/components/product/ProductCard.tsx` (+ the new `SpotlightCard.tsx`) and the
brief/state/decision/report docs; **no new dependency** (`package.json` + lockfile unchanged); **no new
placeholder, no message-file edit, zero new user-facing string**. **Owed to Lazar:** intensity sign-off —
eyeball the live glow and dial the three token values if wanted (register **#23**). Decisions `D-2.10-1/2/3`.
Branch `phase-2.10-card-glow`; **PR [#22](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/22)
MERGED to `main` (merge `8524198`, 2026-07-23) on Petar's explicit instruction (`D-0-3`: operator-authorised,
not Code); branch deleted.** (Clean GitHub PR merge — the stale-head OID issue that hit 2.07/2.08 did not
recur; PR #22 shows the "Merged" badge.) **Production deploy VERIFIED** — on the live `https://www.trajanovv.com`
the deployed CSS grep-matches the local production build exactly (12× `spotlight-card`, 8× `--color-glow`,
`--glow-size`, both opacity tokens, `mask-composite`), and in-browser on `/en/styleguide` the `.spotlight-card`
rule **applies under `@media (hover: hover) and (pointer: fine)`** (`position: relative`, `z-index: 0`,
`--glow-x/y` default `50%/0%`, `::after` = `radial-gradient(240px … #ece8e0 …)` at resting `opacity: 0`,
`::before` `mask-composite: exclude`, `--color-glow` = the foreground token); **2 interactive sample cards
carry the glow and the sold-out card has none.** The subjective feel/intensity eyeball on a real desktop
mouse + phone stays owed (register **#23**). `NEXT:` line **unchanged** — out-of-band, does not touch the
2.06 → Y.01 critical path.

**2.09 COMPLETE — the product-page size buttons now read in garment order S · M · L · XL (this update,
2026-07-23).** An out-of-band UI phase (the 2.07/2.08/Y.02 shape) — **no commerce logic touched**, and
**line 1 `NEXT:` is unchanged** (the 2.06 operator rehearsal remains next). The buy cluster previously
listed sizes **L · M · S · XL** (alphabetical), which reads as broken on the one screen where a customer
decides. What shipped:
- **New pure module `src/lib/drop/size-order.ts`** — `CANONICAL_SIZE_ORDER` (`XS · S · M · L · XL · XXL ·
  XXXL`) + `compareSizeLabels(a, b)`. It ranks by clothing position, **case-insensitive + whitespace-
  trimmed**, treats `2XL`→`XXL` and `3XL`→`XXXL`, and puts any **unknown** label (e.g. "One size") after
  every known size, alphabetically among themselves — a **total, deterministic** order. It **never mutates
  a label**: the UI renders the original DB string, unchanged. **No `import "server-only"`**, so it is
  unit-testable by a plain vitest run (`D-2.09-3`).
- **`src/lib/drop/state.ts`** — the one alphabetical sort in `toProductView()`
  (`.sort((a, b) => a.size.localeCompare(b.size))`, the ONLY place size order was decided anywhere in
  `src/`) replaced with `compareSizeLabels`; the surrounding comment now explains why the order is
  canonical, not alphabetical. **Nothing else in the file changed.** `grep -rn "localeCompare" src/`
  returns **no hit in `state.ts`**.
- **New test `tests/drop/size-order.test.ts`** (8 cases) written **first and run RED**, then GREEN — the
  RED was made behavioural: a temporary alphabetical stub produced `L · M · S · XL` and failed 3
  assertions (the S/M/L/XL ordering, the 2XL/3XL aliases, unknown-after-known), proving the test catches
  the real bug before the fix landed.
- **One shared code path for every product (`D-2.09-2`)** — the fix corrects Product 01
  (`test-mustard-ochre`) and Product 03 (`test-baby-blue`); Product 02 (`test-off-white`) runs through the
  same changed line but has a single XL variant, so the sort is a provable no-op and its rendered size row
  (**XL**) is byte-identical. **No per-product override.** `src/config/products.ts` untouched.

**Gates:** `npm run build` (exit 0, "✓ Compiled successfully") / `npx tsc --noEmit` / `npm run lint` clean;
`npm test` **93/93** (was 85; +8 new size-order cases) incl. `✓ 10 simultaneous orders against 3 units →
exactly 3 succeed, 7 rejected with insufficient_stock, stock 0` (untouched — no commerce code changed).
**Rendered in-browser against the LOCAL DB, both locales:** all three product pages verified —
`/katalog/test-mustard-ochre` + `/en/catalog/test-mustard-ochre` → **S M L XL**, `/katalog/test-baby-blue`
+ `/en/catalog/test-baby-blue` → **S M L XL**, `/katalog/test-off-white` + `/en/catalog/test-off-white` →
**XL, unchanged**. To exercise the fix, the local variants were seeded in a **deliberately non-canonical
order** (`XL S L M` / `L XL S M`), so the correct render proves the comparator orders them, not Postgres.
Size selection still toggles (`aria-pressed`), the selected-size mustard styling and the "Sold out"/ended
states are intact, and add-to-cart still works (forced `?preview=live`: select L → "Add to cart" → "Added.
View cart"). **Frozen:** `src/lib/orders/` / `create_order` / `expire_reservations` / `supabase/migrations/`
/ cart / checkout / `src/config/` (incl. `products.ts`) / `src/lib/site.ts` / `SiteHeader.tsx` /
`SiteFooter.tsx` / `src/lib/seo/` / `sitemap.ts` / `llms.txt` / `manifest.ts` / message files / `facts.md` /
`brand.md` — `git diff --stat main` shows only `src/lib/drop/state.ts`, the two new files, the brief, and
the state/decision/report docs; **no new dependency** (`package.json` + lockfile unchanged); **no new
placeholder, no message-file edit**. **Local-only note (`D-2.09-4`):** the three catalogue products live in
`products.ts` and only reach a DB via `npm run sync:drop`, which this phase freezes — so the local
catalogue was hand-seeded (local, non-committed, idempotent, mirrors `products.ts`; not sync, not reset,
not hosted) purely to render the evidence; a future `supabase db reset` reapplies `seed.sql` and drops it.
**Owed to the operator:** production verification of the size order on `https://www.trajanovv.com` after
merge, both locales — register **#22**. Decisions `D-2.09-1…4`. Branch `phase-2.09-size-order`; **PR #21
MERGED to `main` (merge `927381c`, 2026-07-23) on Petar's explicit instruction (`D-0-3`: operator-authorised,
not Code); branch deleted.** (Clean GitHub PR merge this time — the stale-head OID issue that hit 2.07/2.08
did not recur; PR #21 shows the "Merged" badge.) **Production deploy VERIFIED** — on `https://www.trajanovv.com`,
both locales, `/katalog/test-mustard-ochre` (+ `/en/catalog/…`) and `/katalog/test-baby-blue` (+ `/en/…`)
render **S M L XL**, and `/katalog/test-off-white` (+ `/en/…`) renders **XL** — so **owed #22 is CLEARED**.
(The check is conclusive: the old `localeCompare` rule can only ever emit `L · M · S · XL`, so `S M L XL`
on the live site proves the new comparator is deployed.) `NEXT:` line **unchanged** — out-of-band, does not
touch the 2.06 → Y.01 critical path.

**2.08 COMPLETE — the site-wide header is redesigned (this update, 2026-07-23).** An out-of-band UI
phase (the 2.07/Y.02 precedent) — **no commerce logic touched**, and **line 1 `NEXT:` is unchanged**
(2.06 operator rehearsal remains next). What shipped:
- **`src/components/layout/SiteHeader.tsx` rebuilt** to the target layout: wordmark → build credit →
  **Catalog · About · Contact** → **MK · EN** → cart, in that exact left-to-right order (**cart last**),
  on **every** page in both locales. The three page links reuse the reviewed `Nav.catalog/about/contact`
  keys — **no** Home/Reviews/Blog/Book link (the wordmark is the only route to Home; grep-proven). An
  **active-page underline** (mustard `border-b-2`, space reserved so the row can't shift) + `aria-current`
  marks the current page. Every colour/size/spacing/radius/type value is a `brand.md` token — **zero hex,
  zero raw px literal**.
- **Build credit** „Изработено од **Vertex Consulting**" / "Built by **Vertex Consulting**", subordinate +
  muted, baseline-aligned to the wordmark. **Only "Vertex Consulting" is the link** → `https://www.vertexconsulting.mk/en`,
  `target="_blank" rel="noopener noreferrer"`, mustard, with a locale-correct **visually-hidden** "opens in
  a new tab" / „се отвора во нов прозорец". The credit is a **`facts.md` § 11 VERIFIED** fact (`D-2.08-2`) —
  a build credit **only**, contained to the header: grep-proven **zero** "vertex" in JSON-LD, OG/twitter
  meta, `llms.txt`, `sitemap.xml`, `robots.txt`, the footer, and the legal pages (source **and** emitted).
- **`LanguageSwitch` restyled** to the `MK · EN` dot pattern (active full-contrast, inactive muted, `·`
  separator) — **behaviour unchanged** (switches locale in place, preserves page + query/`?preview`;
  re-verified live: `/en/contact` → `/kontakt`, `/en/catalog` → `/katalog`).
- **Non-sticky** (`D-2.08-3`): the old `sticky top-0 … backdrop-blur` was dropped for a **static** header
  on a **solid** `--color-ground` — **this is the notable brief-vs-repo difference** (the brief lists a
  sticky header as out of scope; the repo had one), so on long pages the nav/cart now scroll away with the
  page. **`SiteHeader` is now a client component** (`D-2.08-4`) so the nav can read `usePathname()`.
  **Mobile** is a deterministic 3-row grid — row 1 wordmark | MK·EN·cart, row 2 nav, row 3 the credit on
  its own full width above the hairline — so the long MK credit is never shrunk or hidden (`D-2.08-5`).
- **Strings:** new `Credit` namespace (`builtBy` next-intl rich-text + `opensInNewTab`) in
  `src/messages/{mk,en}.json`; MK+EN parity driven **RED→GREEN**; `string-inventory.md` regenerated
  **217 → 219**.

**Gates:** `npm run build` (exit 0, "Compiled successfully") / `npx tsc --noEmit` / `npm run lint` clean;
`npm test` **85/85** incl. `✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with
insufficient_stock, stock 0` (untouched — no commerce code changed) + the i18n catalog-parity test.
**Rendered + measured in-browser** (dev server, both locales, at **desktop + 375px + 320px**): correct
L-to-R order + cart-last (accessibility tree), active underline + `aria-current` on the current page (row
does not shift), `header{position:static}` on `#0F1210`, **no horizontal overflow at 320/375 either
locale**, no console errors on Home/Catalog/About/Contact both locales. **WCAG 2.2 AA contrast (measured on
ground `#0F1210`):** credit muted **7.85**, Vertex link (mustard) **8.95**, nav default **7.85**, nav active
**15.42**, lang active **15.42**, lang inactive **7.85** — all ≥ 4.5. Tap targets: all interactive ≥ 24px
(lang buttons 24×24 via `min-w-6`/`min-h-6`), **cart 44×44**. **Frozen:** `src/lib/orders/` /
`create_order` / `expire_reservations` / `supabase/migrations/` / cart / checkout / `src/config/` /
`src/lib/site.ts` (`SITE_URL`) / **the footer** / `src/lib/seo/` / `sitemap.ts` / `llms.txt` / `manifest.ts`
/ logo+icon assets **byte-unchanged** (`git diff --stat main`); **no new dependency** (`package.json` +
lockfile unchanged); **no new placeholder**. **Owed to Lazar:** native MK review of the 2 new `Credit`
strings (register **#19**), **click-test `https://www.vertexconsulting.mk/en`** (register **#20** — a link
to a page that does not resolve is a broken fact on every page of the site), and **client sign-off**
(Vladimir + parents) on a third-party credit + outbound link in the top nav of the store on every page
(register **#21**). Decisions `D-2.08-1…5`. Branch `phase-2.08-header-redesign`; **PR #19 MERGED to `main`
(merge `d40541b`, 2026-07-23) on Petar's explicit instruction (`D-0-3`: operator-authorised, not Code);
branch deleted.** (Merge completed via a local `--no-ff` merge commit: GitHub's PR API was stuck on a stale
head OID — its merge endpoint kept returning "head branch is out of date" while the authoritative ref was
current — so the GitHub PR shows **Closed** rather than the "Merged" badge, but **all 2.08 commits are on
`main`**, verified reachable from `d40541b`.) **Production deploy VERIFIED** — `https://www.trajanovv.com`
now renders the redesigned header: **non-sticky** (`position: static`) with „Built by Vertex Consulting"
linking `https://www.vertexconsulting.mk/en` (`target="_blank"`) and exactly **Catalog · About · Contact**;
the 2.07 footer is intact. `NEXT:` line **unchanged** — out-of-band, does not touch the 2.06 → Y.01 critical
path.

**2.08 ALIGNMENT FIX — the header is now on one shared centerline (`D-2.08-6`, supersedes `D-2.08-5`; this
update, 2026-07-23).** After 2.08 merged, Petar reported the header rendered but **nothing was aligned**: on
the desktop row the wordmark, credit and three nav links floated on the text **baseline** while MK·EN and the
cart sat on the vertical **center** (the D-2.08-5 layout used `sm:items-baseline` + a `sm:self-center` on the
controls), and the gaps were uneven. **Fix:** `SiteHeader.tsx` is rebuilt as **one flex row, `items-center` +
`justify-between`**, two groups — LEFT (wordmark + credit), RIGHT (nav, then MK·EN, then cart). Every
container is `items-center`; **no baseline nudge, no `self-*` override, no margin-top on any item.** The cart
keeps its 44px target but is centered (sets row height, not anyone's offset). Gaps are exactly two tokens:
**`gap-4` (16px)** between the three nav links, **`gap-6` (24px)** used identically for nav → MK·EN and
MK·EN → cart. Narrow screens wrap (`flex-wrap` / `sm:flex-nowrap`). **Verified by computed geometry (not by
eye):** at 1280px all seven items report an identical vertical center **34.0px, max delta 0**; gaps measured
**16 / 16 / 24 / 24 px**. Contrast re-measured on `#0F1210` (credit 7.85 · Vertex link 8.95 · nav default
7.85 · nav active 15.42 · lang active 15.42 · lang inactive 7.85 — all ≥ 4.5); active underline + `aria-current`
intact; header still `position: static`; **no horizontal overflow at 320px or 375px, both locales**; no console
errors. **Only `SiteHeader.tsx` changed** (`git diff --stat main`) — **no** frozen path, **no** message/`facts.md`
edit, **no** new dependency (`package.json` + lockfile unchanged), **no** new placeholder. `npm run build`
(exit 0) / `npx tsc --noEmit` / `npm run lint` clean; `npm test` **85/85** incl. the 10-vs-3 oversell gate.
Decision `D-2.08-6` (D-2.08-5 marked Superseded). Shipped on a **recreated** `phase-2.08-header-redesign`
branch (the original merged + was deleted); **PR #20 MERGED to `main` (merge `7a16221`, 2026-07-23) on
Petar's explicit instruction (`D-0-3`: operator-authorised, not Code); branch deleted.** (Merge completed via
a local `--no-ff` merge commit — GitHub's PR API was again stuck on a stale head OID and rejected its own
merge endpoint; PR #20 was **closed** with a note pointing to `7a16221`, so it shows **Closed** not the
"Merged" badge, but all fix commits are on `main`.) **Production deploy VERIFIED** — on `https://www.trajanovv.com`
(desktop, both locales) all seven header items report an **identical vertical center (34.0px, delta 0)**, gaps
**16 / 16 / 24 / 24 px**, header `position: static`. `NEXT:` line **unchanged**.

**2.07 COMPLETE — the site-wide footer is redesigned (this update, 2026-07-23).** An out-of-band UI phase
(the Y.02 precedent): the session was handed the original **Phase 1.05** footer brief, but that footer
shipped long ago and the project is ~15 phases past it (live on `www.trajanovv.com`, real 2.03 Privacy page,
published `info@trajanovv.com`). Rather than execute the stale brief literally — which would **overwrite the
real Privacy page** with a `[PLACEHOLDER: … 2.03]` stub and **re-introduce the email placeholder** 2.05 already
cleared — **Petar chose to apply the brief's richer two-zone design as a new phase, preserving the real
Privacy page + the published email** (`D-2.07-1`). **No commerce logic touched.** What shipped:
- **`src/components/layout/SiteFooter.tsx` rebuilt** to two zones. **Zone 1** — two columns: `КОНТАКТ`
  (email `info@trajanovv.com` + phone `078 820 520`) and `СЛЕДИ` (`@trajanovv2026`), each a real `<h2>`
  eyebrow heading with a 16px Lucide line icon per item. **Zone 2** — a 1px hairline rule, then a
  `© 2026 Трајанов. Сите права задржани.` row carrying **all five** page links
  (About/Contact/Terms/Privacy/Shipping) so no live link is dropped. Single stacked column at 375px, two
  columns at `sm`. Every colour/size/spacing/type value is a `brand.md` token — zero hardcoded values.
- **Instagram icon:** this `lucide-react` dropped its brand icons, so the social row uses **`AtSign`** (`@`)
  paired with the handle — honest, no fabricated brand glyph (`D-2.07-2`).
- **Strings:** a new `Footer` namespace (`contact`/`social`/`rights`) in `src/messages/{mk,en}.json`;
  page-link labels **reuse** the reviewed `Nav` keys (`D-2.07-3`). MK+EN parity green; `string-inventory.md`
  regenerated **214 → 217**.
- **Preserved:** the real 2.03 Privacy page (`/privatnost` + `/en/privacy` → **200** with real „Приватност"
  content, **not** a stub) and the published email — **no placeholder re-introduced**.

**Gates:** `npm run build` / `npx tsc --noEmit` / `npm run lint` clean; `npm test` **85/85** incl. the
10-vs-3 oversell gate (untouched — no commerce code changed) + the i18n catalog-parity test. **Rendered +
measured in-browser** (dev server, both locales, 375px + desktop): real `<h2>` headings, 3 icons; MK
`КОНТАКТ`/`СЛЕДИ`/`© 2026 Трајанов…` + MK slugs (`/privatnost` etc.); EN `CONTACT`/`FOLLOW`/`© 2026 Trajanov…`
+ `/en/*`; IG `rel="noopener noreferrer" target="_blank"`; phone `tel:+38978820520`. **WCAG 2.2 AA contrast
(measured on ground `#0F1210`):** muted headings/© row/page-links `#ABA79E` = **7.85:1**; full-contrast
contact items `#ECE8E0` = **15.42:1** — both pass (need 4.5). Tap targets ≥24px (email 178×34, Privacy 46×28).
Mobile: single column, sections stack, © row vertical, **no horizontal overflow**. No console errors. (The
footer-band *screenshot* was blocked by a browser-pane scroll timeout on the dark page; the page paints —
hero captured — and the footer is fully verified via the accessibility tree + computed styles.) **Frozen:**
`create_order`/`expire_reservations`/`supabase/migrations/`/cart/checkout/`src/config/` byte-unchanged; **no
new dependency**; `SITE_URL` unchanged; **no new placeholder** (email published, Privacy real). **Owed to
Lazar:** design sign-off incl. the `@`-for-Instagram icon (register **#17**) + native review of the 3 new MK
strings (register **#18**). Decisions `D-2.07-1/2/3`. Branch `phase-2.07-footer-redesign`; **PR #18 MERGED to `main` (merge `27b51ea`,
2026-07-23) on Petar's explicit instruction (`D-0-3`: operator-authorised, not Code); branch deleted.**
Production deploy VERIFIED — `https://www.trajanovv.com` footer now renders the two-zone design (MK
`КОНТАКТ`/`СЛЕДИ` + `© 2026 Трајанов…`, EN `CONTACT`/`FOLLOW`), publishes `info@trajanovv.com` as a
`mailto:`, and links Privacy to `/privatnost` (MK) / `/en/privacy` (EN). `NEXT:` line **unchanged** —
out-of-band, does not touch the 2.06 → Y.01 critical path.

**Y.02 COMPLETE — a third product, "Product 03" (baby blue), is now a visible, honest catalog stub
(this update, 2026-07-22).** An owner-authorised out-of-order insert (`D-Y.02-1`, Lazar, 2026-07-22) —
it does **NOT** replace the 2.06 operator rehearsal on the critical path (line 1 `NEXT:` is unchanged).
**No commerce logic touched.** What shipped:
- **`facts.md` §7** gained a `### Product 03 — baby blue` sub-block: **price 1999 MKD** + **sizes
  S/M/L/XL** marked **VERIFIED (owner, 2026-07-22)**; the **colourway is owner-stated, NOT photographed**
  (deliberately *not* "VERIFIED (photos)" like mustard/ochre + off-white); **photos + fabric/care OWED**
  (Vladimir); the real name OWED.
- **`src/config/products.ts`** — a **third** product, `test-baby-blue`, added to the existing **ENDED**
  `test-drop`, mirroring the two colourways there exactly: `name_* = null` (→ neutral slot "Производ 03",
  `sort_order` 3), `priceMkd: 1999`, `photoPath`/`careMk`/`careEn` null, sizes **S/M/L/XL** (stock 3 each,
  nominal — the drop is ended, nothing is buyable). It renders **browsable-but-not-buyable** (the site's
  default state between drops). It is **NOT** in a live/real drop — `drops.ts` (the schedule) is untouched;
  true drop assignment is `Y.01` (`D-Y.02-2`).
- **No migration** (`D-Y.02-3`): the product + its per-size variant rows land via the existing typed config
  + `npm run sync:drop` (INSERT-only, `D-1.04-5`/`D-1.04-11`) — a data operation, not a schema change. The
  `products`/`variants` tables, `create_order`, `expire_reservations`, the atomic decrement + reservation
  logic, cart, checkout, `SITE_URL`, and the drop schedule are all **byte-unchanged** (grep-proven in the
  report).
- **Product JSON-LD stays suppressed** for Product 03 (its name is a placeholder → `productJsonLd` returns
  null), consistent with the existing two.
- **No new user-facing string:** Product 03 reuses the existing shared placeholder keys
  (`Placeholder.productPhoto` / `Placeholder.composition` / the `Placeholder.productName` neutral slot) and
  the shared MKD price format — both locales already carry them, so no MK/EN catalog change was needed.

**Gates:** `npm run build` / `npx tsc --noEmit` / `npm run lint` clean; `npm test` **85/85** incl. the
10-vs-3 oversell gate (the concurrency test targets the seed's `test-open-drop`/`test-tee-black`, wholly
independent of `src/config/products.ts`, so adding a catalog product cannot disturb the oversell
guarantee — proven, not assumed). Rendered in-browser (see the report): the catalog lists **three**
products with Product 03 the baby-blue one, and its product page shows price **1.999 ден** / **1,999 MKD**,
selectable sizes S/M/L/XL, visible photo + composition placeholders, the neutral name "Производ 03" /
"Product 03", and the browsable-but-not-buyable (ended, no live drop) state. **Placeholder register +3
rows** (#8 photo, #9 fabric/care, #10 real name — all Product 03, owner Vladimir); **owed-verification
register unchanged**. Decisions `D-Y.02-1/2/3`. Branch `phase-y.02-product-03-stub`; **PR #17 MERGED to
`main` (merge `25573de`, 2026-07-22) on Petar's explicit instruction (`D-0-3`: operator-authorised, not
Code); branch deleted.** ✅ **HOSTED SYNC DONE — Product 03 is LIVE (2026-07-22, the `D-Y.02-3` deferred
sync, on Petar's instruction; NOT Y.01/the real content load).** `npm run sync:drop` was run against the
hosted Frankfurt DB (`SUPABASE_DB_URL` from gitignored `.env.hosted`; confirmed host
`aws-0-eu-central-1.pooler.supabase.com`, not local — no silent no-op). **Purely additive, INSERT-only
(`D-1.04-5`):** report `products inserted: 1` (`test-baby-blue`), `variants inserted: 4` (S/M/L/XL stock
3), `products updated: 2` (mustard/off-white re-written to the same null names / 1199 MKD), `variants
untouched: 5` (**existing stock preserved**), `rows deleted: 0`. Hosted `test-drop` now carries **3**
products, **stays ENDED** (window June 2026), **orders = 0**. **No code / migration / `create_order` /
`expire_reservations` / cart / checkout / `src/config/` edit / new dependency.** Verified on the live
domain: `www.trajanovv.com/katalog` (+ `/en/catalog`) now lists **three** boxes — `Производ 03` /
`Product 03`, **1.999 ден / 1,999 MKD**, S/M/L/XL, the same `[PLACEHOLDER: …]` photo slot + box styling
as the other two, **browsable-but-not-buyable** („Распродадено" / "Sold out"); the product page
`/katalog/test-baby-blue` loads and emits **no** Product JSON-LD (name still a placeholder). Placeholders
#8/#9/#10 (photo/fabric/name) remain **open** — the stub is visible, its owed content is still owed.

**2.06 CODE HALF COMPLETE — drop day is now a script, and the rehearsal is ready to run (this update,
2026-07-22).** A Code + operator phase like the 1.08 gate: Code shipped the two repo documents, the safe
open/reset tooling, and the Code-verifiable gates; the **live rehearsal is owed to Lazar + Vladimir** and
is what clears owed **#15** + **#16**. **No commerce logic touched.** Shipped under `docs/ops/`:
- **`drop-day-contingency.md`** — the `D-0-2` plan for the site going down mid-drop: **detection** (no
  uptime monitor yet — customer report or a manual mobile-data check of `https://www.trajanovv.com`;
  register **L7**), a pre-written **bilingual (MK+EN) Instagram hold post** (story + feed caption) that says
  the drop is paused for a technical reason, is **not** cancelled, and points buyers to **DM `@trajanovv2026`
  or phone `078 820 520`, cash on delivery, same prices, while stock lasts** — every claim traced to
  `facts.md`, humanizer pass run, **no** invented delivery cost/courier/stock; the **manual order channel**
  (six recorded fields: name/phone/city/address/size/qty, max 2) with an **anti-oversell written tally**
  (last-known stock per size, decrement per manual order, never below zero, reconcile into the DB before
  reopening); the **X.01** recovery trigger (Vercel Pro, Lazar-decides/Code-runs, an afternoon because of
  the portability rule); **roles**; and the **hard don'ts** (no unbacked delivery promise, no unbacked
  stock claim, no false urgency, no card/online payment, don't lose the DMs, don't ship outside NMK).
  **Lazar signs off the MK+EN copy** (owed — client-facing brand copy).
- **`drop-rehearsal-runbook.md`** — a plain-language, non-coder script for a full fake drop on the real
  domain: **pre-flight** (site up, Turnstile renders on `/naracka`, `info@trajanovv.com` routes to
  Vladimir), **open hosted-only** (a 5-minute countdown + the whole drop constrained to **one** sellable
  unit so a single order sells it out — never committed to `main`), **walk the lifecycle on a phone**
  (countdown→LIVE; one real order through a browser-solved Turnstile = **#15**; stock→0→SOLD OUT; the
  notification email from `info@trajanovv.com` = **#16**; Vladimir phones the "customer" and records the
  order = the fulfilment walk), **rehearse expiry** (backdate the hold, watch the `*/5` `expire-reservations`
  job return the unit — the 1.08 method), **contingency dry-run** (a walk-through, no public post), the
  **mandatory teardown** (targeted deletes, restore stock, reset `TRJ-####`, re-sync ENDED — **explicit ban
  on `db reset --linked`**), and the **evidence** to capture.
- **`docs/ops/rehearsal-sql/`** — seven copy-paste SQL files for the Supabase SQL Editor
  (`00-baseline` → `01-open-rehearsal-drop` → `02-verify-live` → `03-verify-order` → `04-backdate-hold` →
  `05-verify-expiry` → `06-teardown` → `07-verify-clean`), each touching only `test-drop`. Plus a tracked
  `docs/ops/rehearsal-evidence/` folder (with a PII-caution README, `D-0-1`).

**Gates:** `npm run build` / `npx tsc --noEmit` / `npm run lint` clean; `npm test` **85/85** incl. the
10-vs-3 oversell gate. **Frozen:** `create_order` / `expire_reservations` / `supabase/migrations/` / cart /
checkout / `src/config/` byte-unchanged; **no new npm dependency**; the committed `test-drop` stays ENDED
(past window) — grep-proven that no live/priced drop and no new placeholder ship to `main`. **Flagged
(`D-2.06-2`):** the **X.01 brief is not yet written** — the contingency plan points at X.01 as-planned and
recommends authoring `briefs/Part-X-Phase-01-*.md` before the first real drop. Decisions `D-2.06-1/2`.
Branch `phase-2.06-rehearsal-contingency`; **PR #16 MERGED to `main` (merge `20e5d3d`, 2026-07-22) on
Petar's explicit instruction (`D-0-3`: operator-authorised, not Code); branch deleted — docs-only, so the
redeploy is a no-op for the running site.** The owed-verification register gains no new rows (the rehearsal is what verifies the existing #15/#16); the
placeholder register is unchanged (#2/#3/#4/#7 still open — the register must reach zero before the first
real drop).

**2.05 COMPLETE — the store now speaks in its real identity (this update, 2026-07-22).** Cutover to the
live domain, **no commerce logic touched.** `SITE_URL` (`src/lib/site.ts`) flipped to
**`https://www.trajanovv.com`** — the canonical, non-redirecting host (the apex `trajanovv.com` and the
old `trajanov-v2.vercel.app` both 308→www; the brief said the apex, but live production canonicalises on
www, so `SITE_URL` uses www to keep every derived URL off a redirect — `D-2.05-6`). After build,
`/sitemap.xml`, `/robots.txt`, every `canonical` + `hreflang`, the OG image URLs, the Organization JSON-LD
`@id`/`logo`, and `/llms.txt` links all emit `www.trajanovv.com`; the **grep gate is GREEN** — zero
`trajanov-v2.vercel.app` and zero single-v `trajanov.com` in any emitted URL/canonical/OG/schema (prose
mentions in docs remain, allowed). **Order email:** `ORDER_FROM_ADDRESS` → `info@trajanovv.com` for the
(only) Vladimir notification — there is **no customer-confirmation email** (no customer email is collected,
`D-Z.01-1`), so Task 3's "both … and …" is one from-address change; `ORDER_NOTIFICATION_EMAIL` (recipient)
untouched; the mocked-Resend email tests were updated and pass. **Contact publishes `info@trajanovv.com`**
in both locales as a real `mailto:` (shared `EMAIL` constant in `src/lib/social.ts`; the `Placeholder.email`
key removed from both catalogs) — placeholder **#5 cleared**. **Shipping & Returns** gained the reviewed
delivery-time line (**„Рок на достава: 3–5 работни дена." / „Delivery time: 3–5 business days."**); the
courier placeholder **#6 narrowed** to courier + cost (dropped „време"/"time"); returns-window **#7**
unchanged; `deliveryBody` reworded to scope the "unconfirmed" statement to courier + cost since the time is
now VERIFIED (`D-2.05-7`). **Turnstile:** server-side `verifyTurnstile` **does not assert hostname** (checks
`success` only — hostname allowlisting is the Cloudflare widget's job), so **no code change**; the site key
rotated to `0x4AAAAAAD6pSIvEa1p8GkZX` (env-only, `D-2.05-4`). **`facts.md` §5/§7/§9** updated (email
published; delivery time VERIFIED, courier+cost OWED; domain `trajanovv.com` VERIFIED — PURCHASED).
**`docs/i18n/mk-review-2.03.md` stamped** (Lazar + Petar, 2026-07-21; 63 strings + `Common.skipToContent`;
passed, no changes) — owed **#10 cleared**; owed **#8** (branded from-address) and **#9** (a lawyer read the
pages, operator 2026-07-21) also cleared; owed **#11/#12** re-pointed to `www.trajanovv.com`; **new owed
#15** (live captcha on the real-domain checkout) + **#16** (a real order email delivering from `info@` end
to end), both for the 2.06 rehearsal. Cutover proceeded with placeholders **#2/#3/#4/#7 still open** —
Lazar's override (`D-2.05-2`); the register must reach zero **before the first REAL drop opens**, not
before cutover. Known issue **#10 RESOLVED** (SITE_URL/facts reconciled); **#1** updated (the store is now
on its real public domain — the Hobby drop-day takedown risk is fully live). `create_order` /
`expire_reservations` / migrations / cart / `src/config/` **untouched**; `npm test` **85/85** incl. the
10-vs-3 oversell gate, build / lint / tsc clean. Decisions `D-2.05-1…7`. Branch `phase-2.05-cutover`; **PR
#15 MERGED to `main` (merge `49fe2ca`, 2026-07-22) on Petar's instruction (`D-0-3`: operator-authorised,
not Code); branch deleted; production deploy VERIFIED** — live `www.trajanovv.com` emits the new host on
every SEO surface, Contact publishes `info@`, Shipping shows the delivery time, grep-clean of the old
hosts.

**2.04b COMPLETE — Trajanov now has a face: a real logo, a full icon set, an `llms.txt`, and an
IndexNow key (2026-07-22).** A small pre-cutover polish closing the three GEO/SEO gaps
2.04 left open — **no commerce logic touched.** (1) **`llms.txt`** serves at the root
(`src/app/llms.txt/route.ts`, `force-static`): an `# H1` + `>` blockquote + link sections, English
prose, every claim traced to `facts.md` (brand/Strumica/2026/Vladimir/the one competition win/oversized
unisex tees/limited drops/COD/NMK-only/max-2/IG/phone — and **nothing** excluded: no price, size,
fabric, email, address, or review/partner claim). Its links are both-locale **absolute** URLs pulled
from a **new shared module** `src/lib/seo/routes.ts` (`INDEXABLE_STATIC_HREFS` + `absoluteUrl`) that
`src/app/sitemap.ts` was refactored onto — so the sitemap and llms.txt read **one** route list and
cannot drift; the response carries `X-Robots-Tag: noindex` and is **absent from the sitemap** (not a
page). (2) A **real brand wordmark** (`D-2.04b-1`, owner-level, flagged for sign-off): "Trajanov" set in
Rubik 700 + brand mustard/ground, as `public/logo.svg` (Rubik embedded as base64 so it renders anywhere)
and `public/logo-512.png` (on a solid ground square). `src/lib/seo/site-jsonld.ts` now emits
`logo: ${SITE_URL}/logo-512.png` on the Organization node — the 2.04 "NO logo, no real asset exists"
refusal is **resolved and its comment rewritten to say why**; still no address, no SearchAction, no
partner. This is a legitimate typographic mark, **not** the AI product imagery barred by `D-0-6`. (3) A
**modern icon set + manifest**: `src/app/icon.svg` + `src/app/apple-icon.png` are a geometric **"T"
monogram** derived from the wordmark (`D-2.04b-4` — a wordmark is illegible at favicon size); `public/
icon-{192,512}.png` + `src/app/manifest.ts` (name/short_name "Trajanov", brand-token colours, `lang:
"mk"`, `start_url: "/"`, `display: standalone`, maskable-safe icon) make it installable; the legacy
`favicon.ico` stays as fallback. (4) An **IndexNow** key (32-char hex) served bare at
`public/78dec4b97e3fbb0f22d1c8df38050f74.txt`, plus `pingIndexNow(urls)` in `src/lib/seo/indexnow.ts`
built from `SITE_URL` — **deliberately wired to nothing** (`D-2.04b-6`; a preview host can't own
submissions). The key is **public by design and NOT a secret under `D-0-1`**. All four PNGs are
generated by a committed, manually-run script (`scripts/generate-brand-assets.ts` / `npm run
assets:brand`) using **`next/og` — no new dependency** (`D-2.04b-5`), reusing the Rubik woff already
vendored for the OG cards. **Verified by Code (curl + in-browser):** `/llms.txt` headers + facts-clean
body + absolute bilingual URLs matching the sitemap's slugs; the key file returns the bare 32-byte key;
`/logo-512.png`, `/icon.svg`, `/apple-icon.png`, `/icon-{192,512}.png` all 200 with correct types; the
homepage HTML carries `"logo":"…/logo-512.png"` in the JSON-LD and the manifest/icon/apple `<link>`s in
`<head>`; `/manifest.webmanifest` is valid JSON; **sitemap.xml has 0 llms.txt entries** and still lists
all 7 routes × 2 locales + DB products; Home + About render with **no console errors**; the `logo.svg`
embedded-font wordmark renders correctly in-browser. **Gates:** `npm test` **85/85** (84 + 1 new
JSON-LD-logo assertion) incl. `✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected
…, stock 0`; `npm run build` / `npx tsc --noEmit` / `npm run lint` clean. `SITE_URL` unchanged; **no
`supabase/`, `create_order`, `expire_reservations`, cart, stock, `src/config/`, `src/types/database.ts`,
or npm dependency touched.** No new placeholder; none cleared/reworded/hidden (#2–#7 byte-unchanged).
Owed-verification register **+2 rows** (#13 wordmark sign-off; #14 register IndexNow key in Bing) and #11
extended to cover the logo; placeholder register unchanged. Decisions `D-2.04b-1…6`. Branch
`phase-2.04b-seo-geo-polish`; **PR #14 MERGED to `main` (merge `c562195`, 2026-07-22) on Petar's explicit
instruction (`D-0-3` — an operator, not Code, authorised it); branch deleted; production deploy VERIFIED**
(`/llms.txt`, the JSON-LD `logo`, and the manifest/icon `<link>`s serve on production). **⚠️ Discovered at
merge: production `trajanov-v2.vercel.app` now 308-redirects to `https://www.trajanovv.com` — a real
custom domain (`trajanovv.com`, double-v) attached outside the repo; Petar confirmed it is his and chose
to leave `SITE_URL` for 2.05.** So the served absolute URLs still reference the vercel.app origin, and
`facts.md` §9 (single-v, "not purchased") is stale — both are 2.05 reconciliation items. See line 1 + the
Known-issue below.

**2.04 COMPLETE — the store is fast, accessible, and survives being pasted into an Instagram story
(2026-07-20).** Discoverability + share surfaces shipped, none of which 2.03 touched:
a dynamic **`/sitemap.xml`** (both locales, every indexable route absolute on `SITE_URL` via next-intl
`getPathname` + each DB product; Cart/Checkout/`/styleguide` absent), **`/robots.txt`** (Sitemap +
`Disallow /styleguide`), and per-page **`noindex`** on Cart/Checkout/`/styleguide` while the content
routes stay indexable. **Structured data:** site-wide Organization + WebSite JSON-LD in the locale
layout (`src/lib/seo/site-jsonld.ts`) — **no address (`facts.md` §1), no fabricated logo, no
SearchAction, no EAM/partner**, `sameAs` = the one Instagram URL from `src/lib/social.ts`; and a
Product JSON-LD generator (`src/lib/seo/product-jsonld.ts`) that **emits no node while product names
are placeholders (register #4)** and, once a product has a real name, carries the real `price` + `MKD`
and an availability **derived from `src/lib/drop/state.ts`** (never a hardcoded `InStock`), with
`image`/`description` omitted while #2/#3 stand. Verified end-to-end against the local seed DB (which
carries real test names) — a real `Product` node rendered with `availability InStock`, `price "999"`,
`priceCurrency MKD`, no image/description; on production (null names) no node ships. **Share cards:** a
per-locale, **type-only** `next/og` card (`src/app/og/route.tsx`, 1200×630, brand ground + mustard
wordmark + the page's `Meta` title + the `@trajanovv2026` handle) rendered with a **vendored Rubik
Cyrillic woff** so the MK card shows native Cyrillic (screenshot in the report) — no photo, no baked
countdown. Every route's metadata now flows through one helper `pageMetadata()` (`src/lib/metadata.ts`),
so an **absolute** `og:image` + `twitter:card="summary_large_image"` is present on **every** route
(grep-confirmed across all 10 routes × both locales), reusing the 2.01 hreflang/canonical. **a11y —
WCAG 2.2 AA:** axe (axe-core 4.10 in a headless Chromium, tall viewport) returns **zero
serious/critical** on Home (live), Catalog, Product, Checkout (form populated), and Terms; a
skip-to-content link + `<main id="main-content">`, one H1 per page with no skipped levels (ProductCard
`h3`→`h2`; a visually-hidden H1 on the live home), checkout **real `<label>`s** + `aria-invalid` /
`aria-describedby` (triggered and confirmed) + a polite `aria-live` region, a global `:focus-visible`
ring on the brand focus-ring token, `lang` on the language switch + the About quote, WCAG-2.2 **24px**
footer targets + a **44px** cart icon, and the `prefers-reduced-motion` rule shipping in the CSS
(neutralises the live-dot pulse; the countdown is value-updates-only and the drop reveal is a plain
swap — framer-motion unused). **Two real a11y bugs were found and fixed:** the low-stock card count
was accent-red on the surface card (**4.31:1**, fails AA) → now the near-black-on-red pill (4.8:1,
`D-2.04-4`); the footer nav links were under the 24px target size (`D-2.04-5`). **Lighthouse (real
scores, pasted per route/form-factor in the completion report): Accessibility 100 + Best-Practices 100
on all five routes; Desktop Performance 100 on all five; SEO 100 on the live production origin** — the
localhost SEO **92** on content routes is purely the cross-origin `canonical` audit artifact (canonical
points at `SITE_URL` while Lighthouse runs on `127.0.0.1`), **verified 100 on
`https://trajanov-v2.vercel.app/en` with the canonical audit passing**; Checkout SEO **58** is the
deliberate `noindex` correctly failing the is-crawlable audit. **Owed:** mobile Performance **94** on
Catalog + Checkout (throttled-mobile SSR — re-check on PageSpeed Insights post-2.05), and the human
**OG paste-test** into Instagram + Viber (code cannot confirm a real link preview). **Standing gates:**
`npm test` **84/84** (69 prior + 15 new SEO/JSON-LD) incl. the **10-vs-3 oversell gate** (re-run GREEN),
build / lint / tsc clean; `vitest.config.ts` gained the `@`→`src` alias (`D-2.04-8`), no new dependency,
`package.json` runtime deps unchanged, `SITE_URL` unchanged. **No `supabase/migrations/`, `create_order`,
`expire_reservations`, cart, `src/config/`, `src/types/database.ts`, or hosted DB touched.** **No new
placeholder shipped and none cleared/reworded/hidden (#2–#7 byte-unchanged).** Branch
`phase-2.04-perf-a11y-seo`; **PR #13 MERGED to `main` (merge `6375a0d`, 2026-07-20) on Petar's explicit
instruction (`D-0-3` — an operator, not Code, authorised it); branch deleted; production deploy VERIFIED**
(sitemap/robots/OG card/site JSON-LD serve on `https://trajanov-v2.vercel.app`; the product page correctly
ships no Product node while names are placeholders, with a neutral non-placeholder OG title). Owed-verification
register **+2 rows** (#11 OG paste-test; #12 the mobile-Perf/SEO Lighthouse gaps).

**2.03 COMPLETE — the store has honest legal pages and every rendered claim is now audited
(2026-07-19).** Three **static** pages joined the site in both locales, built from the same
editorial pattern as `/about`+`/contact` through a shared `src/components/legal/LegalPage.tsx` shell:
**Terms** (`/uslovi` · `/en/terms`), **Privacy** (`/privatnost` · `/en/privacy`), and **Shipping &
Returns** (`/isporaka-i-vrakjanje` · `/en/shipping-returns`) — all prerendered `●` SSG per locale, no
`force-dynamic`. Every line is written to a source: `facts.md §1/§7`, shipped code (the 48h reservation,
the 2-per-order cap, COD, the one-way IP hash, the `orders`-column field list, the notification email),
or a logged decision. **No statute, article, directive, or statutory withdrawal period is cited**
(Decision 5); **no cookie banner** was added (Decision 4); the **email is not published** on any page
(register #5 intact). The responsible party displayed on Terms + Privacy is **Vladimir Trajanov,
Струмица, alone** (`D-2.03-1`, Lazar's call) — **no parent or guardian name appears anywhere in the
diff.** Delivery cost/time and the returns/exchange window ship as **visible `[PLACEHOLDER: …]`** markers
(register #6, #7 — owner Vladimir), never estimated. The **full `facts.md` audit** is committed at
`docs/legal/facts-audit-2.03.md`: every rendered claim traced, **2 findings surfaced** (F-1 the §1
responsible-party contradiction — resolved by amending §1; F-2 the cart's "calculated on delivery" —
surfaced, not reworded, `D-2.03-6`), **zero UNSOURCED rows remain**, and the §10 "do-NOT-have" list
(reviews, counts, partners, team, second location) `grep`-confirmed **absent**. `facts.md` §1 amended so
the file and the site agree (displayed party + intake fact both kept; the open parental-confirmation flag
**unchanged**). Message catalogs grew **150 → 213 keys** (63 new, MK+EN identical, no empty value); a
`humanizer` pass ran over every new string; `docs/i18n/mk-review-2.03.md` is committed **unsigned** for
the native review; `docs/i18n/string-inventory.md` regenerated (213) and committed. **69 tests pass** (63
+ 6 new legal-route pathname assertions) incl. the **10-vs-3 oversell gate**; build/lint/tsc clean;
parity driven **RED→GREEN**. **Nothing touched** in `supabase/migrations/`, `create_order`,
`expire_reservations`, the cart, `src/config/`, the hosted DB, or dependencies. All three pages rendered
in-browser at 390px + 1180px in both locales (Cyrillic native, placeholders visible, footer links resolve
to the localised slugs). **The owed-verification register is NO LONGER EMPTY** — 2.03 added rows **#9**
(no human legal review) and **#10** (MK legal copy unreviewed), both owner-verifiable by the 2.05 cutover.
Branch `phase-2.03-legal-facts`; **PR #12 MERGED to `main` (merge `4fcc0bd`, 2026-07-19)** on Petar's instruction and the production deploy verified live (six legal URLs serve; MK Terms renders MK). Code did not self-merge — an operator authorised it (`D-0-3`).

**2.02 COMPLETE — the native MK review passed clean (2026-07-19).** Two native Macedonian
speakers, Lazar and Petar, read all **150** MK strings and all **8** URLs in both locales against
`docs/i18n/string-inventory.md`, plus the six MK route slugs. Verdict: **every string OK — no
spelling / grammar / agreement / terminology fault, no English-in-MK leak, and no style change — and all six
slugs confirmed Keep** (`/katalog`, `/katalog/[slug]`, `/kosnicka`, `/naracka`, `/za-nas`, `/kontakt`; the
Latin transliteration, `D-2.01-1`, and the shared product slug, `D-2.01-2`, both stand — `D-2.02-3`). The
working record is `docs/i18n/mk-review-2.02.md`: the how-to, the URL walk, the slug question, the full
150-row table with a verdict on every row, and **both sign-off blocks filled** (the two reviewed **jointly**
and Code transcribed the verdicts, `D-2.02-2`; provenance noted in the file). Because nothing was a fault,
**`src/messages/{mk,en}.json` are untouched** (Task 3 a no-op — no string changed, so no humanizer pass and
no `facts.md` re-verify was needed); because every slug is Keep, **`next.config.ts`, the redirect table,
`src/i18n/routing.ts` `pathnames`, and `tests/i18n/` are unchanged** — the only code change in the whole
phase is the `routing.ts` comment flipping from "provisional" to "confirmed", and the removal of "provisional"
slug language from `routing.ts` and this file. **63 tests pass** (unchanged from 2.01) incl. the 10-vs-3
oversell gate; build / lint / tsc clean; the parity test was driven **RED then GREEN**; `npm run i18n:inventory`
regenerated `docs/i18n/string-inventory.md` **byte-identical** (no commit — no string changed). **No
`supabase/migrations/`, `src/config/`, `create_order`, `expire_reservations`, hosted DB, or npm dependency
touched.** Branch `phase-2.02-mk-review`. **Owed-verification register stays EMPTY; placeholder register
unchanged.**

**2.01 COMPLETE — the store is bilingual down to the URL (2026-07-19).** next-intl `pathnames`
localise the MK route slugs (Latin transliteration, `D-2.01-1`) while the internal route folders are
unchanged; the product slug is single/shared across locales (`D-2.01-2`). Old English MK paths **308** to
the new slugs (`next.config.ts`, kept in lockstep with `routing.ts`), `/en/*` untouched (`D-2.01-3`). Every
user-facing string lives in `src/messages/{mk,en}.json` — the only literals left to extract were the cart
quantity-stepper `aria-label`s (`Cart.decrease`/`increase`); a new `Meta` namespace drives per-locale
`<title>`/description on every route. Reciprocal **hreflang** (mk/en/x-default→MK) + a self-referencing
`canonical`, all absolute on the single `SITE_URL` constant (`src/lib/site.ts`, `TODO(2.05): trajanov.com`),
are emitted per page via `src/lib/metadata.ts`'s `localeAlternates` + next-intl `getPathname`. The MK-only
**shipping statement** (one shared key `Common.shippingNotice`, traced to `facts.md` §7 VERIFIED) renders
above Add-to-cart on the product page and in the checkout COD block, both locales; the EN wording is
explicit that we do not deliver outside North Macedonia (`ShippingNotice.tsx`, `D-2.01-7`). `formatMkd` is
now locale-aware (MK `1.199 ден` / EN `1,199 MKD`; MKD always, **no currency conversion anywhere**,
`D-2.01-8`). The `LanguageSwitch` switches locale in place and preserves the page + query/`?preview` across
the slug change (`D-2.01-6`). A committed `docs/i18n/string-inventory.md` (regen `npm run i18n:inventory`)
lists every key/MK/EN/where + two flag sections for the 2.02 reviewers. **63 tests pass** (56 + 7 new i18n:
catalog parity + pathname coverage; the parity test was confirmed RED when a key was removed from `en.json`,
then restored). Verified in-browser both locales at 390px + 1180px: redirects (308 + Location), MK slugs 200,
`/en/*` 200, reciprocal hreflang, the shipping notice, and the language switch on a dynamic product page with
`?preview`. **No `supabase/migrations/`, `create_order`, `expire_reservations`, component-of-record, or
hosted DB touched; no new npm dependency** (added the `i18n:inventory` script only). Branch
`phase-2.01-bilingual`. **Owed-verification register stays EMPTY.**

**1.08 CODE HALF PASSED against hosted (2026-07-18); operator half + email prereq still OWED.**
The gate ran its Code-verifiable half against the live Frankfurt DB and returned it clean (`D-1.08-3`):
- **Real content recorded.** `facts.md` §7 marks **1199 MKD** + currency **MKD** + sizes **S/M/L/XL
  (off-white XL-only)** VERIFIED (owner via Lazar, 2026-07-18); the old ~$65/3,700 MKD indicative ceiling is
  SUPERSEDED; fabric/care + per-size measurements stay OWED. `src/config/products.ts` now prices the two
  verified colourways at 1199 MKD — `test-mustard-ochre` (S/M/L/XL) and `test-off-white` (XL-only, the
  single-variant path) — names still `null`/placeholder. No USD anywhere.
- **Concurrent oversell re-run on hosted (DoD):** `10 simultaneous orders against 3 units → exactly 3 succeed,
  7 rejected with insufficient_stock, stock 0` (726 ms). Full suite **56/56 against `kmuocwmevyyuhcvwoebf`**
  (25 s), incl. both expiry tests.
- **Reservation expiry observed LIVE on hosted** (no 48h wait): a backdated hold was expired by the scheduled
  `*/5` pg_cron job at the 10:00:00 cycle (`cron.job_run_details`: succeeded, "1 row"), stock returned; **2
  active cron jobs**; test row cleaned.
- **Turnstile enforced (real production secret):** Siteverify rejected a **missing** token
  (`missing-input-response`) and an **invalid** token (`invalid-input-response`); wrong-secret control
  (`invalid-input-secret`) proves the real secret is genuinely validated. Hosted `orders=0` — no order row, no
  stock change. Closes register #5 per the brief's Task 5 (`D-1.07-7`, `D-1.08-3`).
- **Rate limits fire:** IP limit (`check_order_rate_limit`, max=5) → 5 allowed, 6th–7th rejected; phone limit
  (`create_order` one-live-order-per-phone) → 2nd same-phone order rejected `TR005`, stock decremented only by
  the 1st. Test rows cleaned.
- **Hosted returned to pre-session clean:** seed fixtures removed; `orders/order_items/order_attempts = 0`;
  only the ended `test-drop` (still its old `test-piece-01..04` placeholder products — the new priced config
  was **not** synced, because the live order is deferred); `order_number_seq` reset to **1/false → TRJ-0001**.
- **NOT done this session (operator half, deferred to the runbook — `D-1.08-3`):** publishing the buyable
  rehearsal drop + the **one real phone order**; the **notification email landing in Vladimir's inbox** (#7);
  the **design sign-off** (#1); the **Instagram click-test** (#2); the **auto-expose toggle** (#6); and the
  Z.01 email prereqs (Resend account + Vercel keys) are **UNCONFIRMED**. The register is therefore **not at
  zero** and `NEXT:` stays `1.08`. Method note: Turnstile + rate-limit enforcement were proven at the exact
  server-side calls the Server Action makes (Siteverify with the real secret; the `check_order_rate_limit`
  RPC; `create_order` `TR005`), not by hand-driving the deployed Next Server Action (which needs a
  browser-solved token / an open drop — the operator path). Branch `phase-1.08-verification-gate`.

**Z.01 SHIPPED — the order-notification email is built (Phase Z.01, prior update).** When `create_order()`
returns success, the order path fires a **best-effort** MK notification to Vladimir via **Resend** (SDK
`resend 6.17.2`), so he can phone the customer to confirm. It is wired as an injected, awaited-but-guarded
`notifyOrder` dep on the pure `processOrder` core (`D-Z.01-5`): a Resend outage, timeout, thrown error, or
**missing env var never fails, delays past ~8s, or rolls back the order** — the DB is the record, the email
is a side channel (Plan §8, `D-0-5`). Sender in `src/lib/email/order-notification.ts`; from
`onboarding@resend.dev` until `trajanov.com` (`D-Z.01-2`); **no customer email collected** (`D-Z.01-1`).
Vladimir's address lives **only** in `ORDER_NOTIFICATION_EMAIL` and is **not** published on Contact
(`D-Z.01-3`; placeholder #5 stays). **56 tests pass** (46 + 6 email, Resend mocked + 4 notify-wiring),
incl. the re-run 10-vs-3 oversell gate; build/lint/tsc clean. **What is owed to 1.08:** that a real order
actually *delivers* to Vladimir's inbox — needs the live Vercel keys (operator prereq) + a live, priced
drop. Branch `phase-Z01-order-email`. **`create_order`/`expire_reservations`/migrations untouched; the only
new dependency is `resend`.**

**THE STORE IS LIVE ON A PUBLIC URL — https://trajanov-v2.vercel.app — running against the real
Frankfurt database with real bot-protection keys.** Phase 1.07 (Code) linked the repo to hosted
Supabase (`kmuocwmevyyuhcvwoebf`, `eu-central-1`, Postgres 17.6), pushed the schema, proved parity,
deployed, and verified production. **Six phases of "local only" (`D-1.03-5`) are over.**

**Hosted parity is PROVEN, not asserted (owed #4 CLOSED).** All **8** migrations pushed; `migration
list` shows local and remote carrying the same 8 with **no migration edited to make that true**.
**pg_cron came up from the migration with no dashboard step** — `cron.job` returns **2 active rows**
in the `postgres` database (the phase's biggest named risk, and it was a non-event). The **real
46-test suite ran against Frankfurt and all 46 passed**, including the **10-vs-3 oversell gate
(exactly 3 succeed, 7 cleanly rejected, stock 0)** and both expiry tests — **the atomic decrement
holds on the real host, under real latency**. Hosted was then **reset clean and verified**: 0 rows in
all 6 tables, `TRJ-####` back to **TRJ-0001**, 2 cron jobs still active. Local re-run: **46 still
pass**, `.env.local` untouched and still pointing at Colima (`D-1.07-9`).

**The phase found a real bug and fixed it (`D-1.07-14`).** The parity run failed **1 of 46**:
hosted `anon` held `INSERT/UPDATE/DELETE/TRUNCATE` on `drops`/`products`/`variants`; local held
none of them. Cause: `schema.sql:150-152` assumes *"a table is unreachable until GRANTed here"* —
true locally (`auto_expose_new_tables` unset), **false on hosted**, where Cowork left
**"Automatically expose new tables" ON** (`D-1.07-3`). **No data was ever exposed** — RLS with
SELECT-only policies blocked every write (verified: stock 5→5, INSERT rejected `42501`) — but hosted
had **one barrier where local has two**. New migration `20260716120000_catalog_grant_hardening.sql`
REVOKEs those privileges from `anon`/`authenticated`/`public`; **both environments now report
`REFERENCES,SELECT,TRIGGER`** and the test passes for the right reason. Everywhere the migrations
already revoked explicitly (`orders`, `order_items`, `order_attempts`, all 3 functions), hosted
matched local exactly.

**Real Turnstile is live and proven end to end (owed #5 NARROWED, not closed — `D-1.07-7`).** The
deployed `/checkout` serves site key **`0x4AAAAAAD23OFW7Ka1hTR1F`**; **no dummy key appears anywhere
in the deployed build** (961 KB of JS + HTML scanned). A widget mounted on the production hostname
**solved in Managed mode and minted a real token**, which Siteverify accepted with the real secret:
**`success: true`, `hostname: trajanov-v2.vercel.app`**. A wrong-secret control returned
`invalid-input-secret`, so the pass is meaningful. **Still owed to 1.08:** whether Cloudflare
actually challenges a *bot* on a *real order* — that needs a live drop, which 1.07 deliberately does
not create.

**`test-drop` published to hosted** via `npm run sync:drop` — **stock INSERT-only (16 inserted, 0
overwritten), 0 rows deleted** (`D-1.04-5`). It is **ended and null-priced** (`D-1.04-12`), so the
site renders the *ended* state and **nothing is buyable**. **0 orders on production.**

**Resend was struck from 1.07 (`D-1.07-8`) and BUILT in Z.01 (this update).** 1.07 shipped no key, no
code, no stub; Z.01 added the SDK + sender. The email code is done and unit-tested; the remaining Resend
work is real-world only (live keys + a live drop), owed to 1.08 — see the register.

**Two credential facts the operator must know (`D-1.07-12`):** (1) the Vercel env vars are marked
**Sensitive**, which makes them **write-only** — `vercel env pull` returns all six as empty strings,
so Cowork's "no functional impact" is true for the build and **false** for anyone working locally;
(2) **the Supabase DB password was RESET this phase at the operator's instruction** — the password
manager's entry is now **stale and wrong**; the new one exists only in gitignored `.env.hosted` on
Petar's machine and is **unrecoverable if lost**. A Supabase **account access token**
(`claude-code-phase-1.07`, expires 2026-08-15) was minted to drive the CLI and **should be revoked**.

**`supabase db reset --linked` is broken against this schema (`D-1.07-15`)** — it drops tables but not
sequences, then fails its own re-apply on `order_number_seq already exists`, leaving the database
wiped. Recovered by hand (drop sequence → `db push --include-all`). **Never run it against a database
with real orders — on the free tier there is no backup.**

Prior (1.07 Cowork): the accounts — Vercel project, hosted Supabase (Frankfurt), Turnstile widget,
and six env vars set in Vercel (Production + Preview, Sensitive). Reports:
`completions/Part-1-Phase-07-Cowork-Completion.md` + `Ops-Handoff-Phase-1.07.md`.

Prior (1.06): the cart flow —

**The cart flow is real — checkout now orders what the customer actually chose (`D-1.04-16` closed).**
A client-side cart (a pure reducer in `src/lib/cart/cart.ts` + a sessionStorage `useSyncExternalStore`
store in `src/components/cart/cart-store.ts`) carries the chosen **(product, variant, qty)** from the
product page through the cart to checkout and into `create_order()`. The **stand-in** that submitted
the active drop's first in-stock variant is **deleted** (`getActiveOrderContext` gone; grep clean); the
client sends **`variant_id` + `qty` only** — never a price or a name. `SizePicker`/`BuyButton` are
wired via a new `AddToCartPanel` (size required before Add; sold-out sizes unselectable; the six buy
states); `CartView` and `CheckoutForm` read real cart state; empty checkout is rejected before
`create_order()` (client empty state + `processOrder` `"empty"` guard). The cart **never** writes to
`variants`/`orders`/`order_items` and never reserves stock. The cap mirrors what `create_order()`
enforces — **2 total units per order** (not per line), which agrees with the Plan. **No new dependency;
no `supabase/migrations/` file touched; `create_order`/`expire_reservations` unchanged.** `seed.sql`
gained a second product (`test-tee-two`) so a test can prove the *chosen* product (not the drop's
first) reaches the order row. **46 Vitest tests pass** (31 + 15 new), incl. the re-run 10-vs-3 oversell
gate; the phase test was confirmed to fail against the stand-in before it was deleted. Pages rendered
in-browser both locales at 390px + 1180px. Branch `phase-1.06-cart-flow`; PR `#6` to `main`.

Prior (1.05): About + Contact —

**About + Contact are live, sourced entirely from `facts.md`.** Two **static** editorial pages
(`/about`, `/contact`, both locales, prerendered `●`/SSG via `setRequestLocale`) join the site. About
tells the competition story from `facts.md` §3 and lists **all five** press outlets as links (Трн.мк,
Струмица Денес, Бизнис Вести, Cultural Chat, Република) under a plain heading — no count, no adjective
(`D-1.05-5`); the one approved quote renders in MK and as a marked EN translation (`D-1.05-6`). Contact
carries the phone (`078 820 520` → `tel:+38978820520`), the single Instagram account, and a visible
email `[PLACEHOLDER]` — **no form, no address** (`facts.md` §1). The phone joined `src/lib/social.ts`
as a shared constant (`D-1.05-9`); the footer now links About + Contact and shows a **translated**
location (fixed a pre-existing EN-in-MK leak, `D-1.05-10`); Home shows one quiet About link in its
**countdown** and **ended** states only (`D-1.05-7`). **No hero photo and no photo slot** (`D-1.05-4`).
The header is unchanged. **31 tests still pass; build/tsc/lint clean.** Branch
`phase-1.05-about-contact`. **No `src/lib/{drop,orders}`, `src/config/`, `supabase/`, or `tests/` file
was touched.**

Prior (1.04): the drop engine —

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
| Part | 2 of 2 — Launch prep |
| Phase | **2.06 Code half complete — Drop rehearsal + contingency** (two `docs/ops/` docs: the `D-0-2` contingency plan + the operator rehearsal runbook; seven `rehearsal-sql/` helpers; no commerce/dep change; gates 85/85; `D-2.06-1/2`). **Operator half owed** — the live rehearsal (Lazar + Vladimir) clears #15/#16. Prior: **2.05 — Cutover**; **2.04b — SEO/GEO polish**. Next: **Y.01** (drop content) then the first REAL drop, gated on placeholder-register-to-zero |
| Branch | `phase-2.06-rehearsal-contingency` → **PR #16 MERGED to `main`** (merge `20e5d3d`, 2026-07-22) on Petar's instruction; branch deleted. Prior: `phase-2.05-cutover` → PR **#15 MERGED** (`49fe2ca`, 2026-07-22); `phase-2.04b-seo-geo-polish` → PR `#14`, merged `c562195` (2026-07-22) |
| Open PR | **None.** `#16` merged (2026-07-22). Prior merged: 1.01–1.07 `#1`–`#7`; Z.01 `#8`; 1.08 `#9`; 2.01 `#10`; 2.02 `#11`; 2.03 `#12`; 2.04 `#13`; 2.04b `#14`; 2.05 `#15`; 2.06 `#16` |
| Deployed | **YES — served + canonicalised on `https://www.trajanovv.com`** (real custom domain, double-v; the apex `trajanovv.com` + `trajanov-v2.vercel.app` both 308-redirect to it). **2.05 is LIVE and smoke-verified by Code (2026-07-22):** the deployed build now emits `www.trajanovv.com` in the home canonical, `/sitemap.xml`, `/robots.txt`, the Organization JSON-LD `@id`/`logo`, `og:image`, and `/llms.txt`; Contact publishes `info@trajanovv.com` (MK „Е-пошта" + EN "Email"); Shipping shows „3–5 работни дена" / "3–5 business days"; **zero** `trajanov-v2.vercel.app` / single-v `trajanov.com` on any live surface. Prior smoke-verifications (2.04b/2.04/2.01) stand. `D-1.03-5`/`D-1.06-4` closed |
| Domain | **`trajanovv.com` (double-v) — PURCHASED + LIVE** (`facts.md` §9 now **VERIFIED — PURCHASED**, reconciled from the stale single-v "not purchased" entry, 2.05). Served/canonicalised on **`https://www.trajanovv.com`** (apex + vercel.app 308→www). **`SITE_URL` flipped to `https://www.trajanovv.com` (2.05, `D-2.05-6`)** — deploys on merge |

---

## Stack

**Canonical: `00_stack-and-config.md`.** Not restated here.

Installed and pinned in 1.01 (versions recorded there). Toolchain: Node `v24.17.0`, npm `11.13.0`.
Note: shadcn's default style is Base UI-based (`base-nova`), not Radix — see `D-1.01-1`.

---

## Built

### Composition & care wiring + cap removal (Y.06) — a slot to fill, and a rule retired

**(a) The care slot — plumbing, invisible on production.**
- `src/lib/product-care.ts` — `getProductCare(slug)` → `{mk, en}` or `null`, resolved against `PRODUCTS`
  in `src/config/products.ts` across all drops. **Keyed by slug, never by index** (`D-Y.06-1`), for the
  same reason `product-images.ts` is (`D-Y.03-1`) — except a misfiled fabric claim is a false material
  claim, not a wrong picture. Blank/whitespace config values are treated as "not supplied" (`D-Y.06-9`).
- `/katalog/<slug>` renders the real per-locale string styled like the adjacent Shipping body
  (`text-muted-foreground text-small`) when non-null; **null → the byte-identical placeholder**.
- **Every `careMk`/`careEn` is still `null`.** `facts.md` §7 untouched, placeholder rows **#3/#9 OPEN**.
  Proven both ways: with a throwaway `"ТЕСТ"`/`"TEST"` the real copy replaced the placeholder in both
  locales (and `test-off-white` beside it kept its placeholder — the slug keying working); reverted to
  null, the rendered section HTML **diffs identically against `main`** in both locales.
- `tests/config/product-care.test.ts` goes RED if composition text is ever committed without a label.

**(b) The 2-unit cap is gone (`D-Y.06-3`, Petar, 2026-08-27 — supersedes `D-1.06-6`).** Removed from:
`src/lib/cart/cart.ts` (`MAX_UNITS_PER_ORDER = 2` → `SANITY_MAX_UNITS_PER_ORDER = 99`), `create_order()`
step 3 (`1..2` → `1..99`), the `order_items.quantity` CHECK (`between 1 and 99`, dropped by **discovered**
constraint name — `D-Y.06-5`), the standing line under the buy button, the cart summary banner, and four
message keys × two catalogs (`D-Y.06-6`). A **seventh** site the brief did not list — the Home FAQ answer
`Faq.a3`, which also ships inside the **FAQPage JSON-LD** — was found by the closing grep and rewritten
(`D-Y.06-8`).

**What now limits an order: real stock, the per-drop rate limit (`D-1.04-7`), and `TR005`.** Nothing else.
**One person can take an entire drop having paid nothing up front** — that is the accepted cost, written
into `cart.ts` and the migration header so it is not rediscovered as a surprise. The 99-unit ceiling is
input validation only (`D-Y.06-4`); no customer-facing string states it, so it cannot go stale.

**Proven, not asserted:** 176/176 tests across 25 files (166/24 before); 10 simultaneous orders vs 3 units
→ exactly 3 succeed; **NEW** 5 simultaneous 3-unit orders vs one 3-unit variant → exactly 1 succeeds, 4 ×
`TR004`, stock 0, zero orphan rows; a **real 3-unit order through the MK checkout form** (TRJ-0055, one
`order_items` row of quantity 3 — the row shape the old CHECK forbade); `productJsonLd` still emits
nothing for all three products. **⚠ Owed row #68: the migration is not on hosted yet.**

### Contact form + rail (2.23) — a way to write to Vladimir
- `/kontakt` · `/en/contact` rebuilt: two columns at `lg:`+ (form 60 / rail 40), stacked form-first
  below; still static SSG — the form is a client island.
- `src/components/contact/ContactForm.tsx` — CheckoutForm-patterned client form (CheckoutField ×4,
  fresh Turnstile token at submit, per-field errors, caps mirrored from `CONTACT_CAPS`, consent
  line → locale-aware Privacy link). Success renders ONLY on a Resend-confirmed send.
- `src/lib/contact/process-contact.ts` — pure pipeline (Turnstile → validate → send), injected
  deps, unit-tested: caps 100/200/150/4000, email shape, `\r`/`\n` + control-char rejection in
  name/email/subject (header-injection), newlines allowed in the body.
- `src/lib/contact/actions.ts` — "use server" thin wrapper; exports the action only (`D-2.23-4`).
- `src/lib/email/contact-message.ts` — second Resend sender: from `ORDER_FROM_ADDRESS`, to
  `ORDER_NOTIFICATION_EMAIL`, `replyTo` = visitor, subject prefix „[Контакт]", plain text, 8s
  ceiling, never throws — result NOT advisory (the email is the record; no DB table by design).
- Privacy corrected in the same PR: `collectBody`/`deleteBody` rewritten, new contact-form section
  rendered, both `Meta` descriptions fixed (`D-2.23-3`); Plan §4 Contact row amended (`D-2.23-1`).

### Home showcase (2.21) — the pieces, under the hero

- **`src/lib/showcase.ts`** — pure, no React, no I/O; the single source for which products get a
  slide and in what order. `showcaseSlides(view)` → `[]` when `view` is null; otherwise the
  products **with a photograph** (`getProductImage` by slug, `D-Y.03-1`) in `view.products` order —
  **every state incl. `live` since `D-2.25-23` (owner, 2026-07-29; reverses this phase's original
  decision 5)**. `wrapIndex` wraps both directions, safe at `length <= 0`. Header comment records
  why photo-less products are skipped and records the live-hide reversal, so neither gets "fixed"
  back silently. Tested: `tests/home/showcase.test.ts` (live-yields-slides re-pinned).
- **`src/components/home/HomeShowcase.tsx`** — `'use client'`, one prop `{view: DropView | null}`
  (the same shape the hero takes; **no new query** — mounted in `page.tsx` between
  `<HomeExperience>` and `<HomeFaq>`). Renders null on an empty slide list. Structure:
  `<section aria-labelledby>` → **visible `<h2>` named per drop state since `D-2.25-22`
  („Ова спуштање" live / „Последно спуштање" otherwise; `Home.browseWhileWait` retired from render
  again, key kept)** →
  carousel `role="group"`/`aria-roledescription="carousel"` → stacked slides (each
  `role="group"`/`"slide"`, `aria-label` „n од N", `aria-hidden` + `inert` when inactive) →
  controls (prev/next/pause `<button>`s at 50×50 with lucide icons `aria-hidden`, + the labelled
  progress bar — one button per slide, product title as label, mustard fill tracking the timer).
  Photograph via `next/image` in `aspect-[4/5]` on `bg-surface-2`, the slug's own
  `objectPosition`, `sizes="(min-width: 1024px) 560px, 100vw"`, **no
  `priority`/`loading`/`fetchPriority`** (`D-Y.05-4/11` — the mustard hero keeps the only
  preload). Autoplay `AUTOPLAY_MS = 6000` (one constant feeding both the JS timer and, via the
  inline `--showcase-autoplay` custom property, the CSS fill — `D-2.21-6`); stops on hover,
  focus-within, hidden tab, the toggle (name flips „Паузирај"⇄„Пушти"), and entirely under
  reduced motion (JS `matchMedia` — commented as NOT a duplicate of the global CSS rule). With one
  slide: no controls at all. Swipe via touchstart/touchend deltas, horizontal-dominant, ≥48px, no
  `preventDefault`.
- **`.showcase-*` block in `globals.css`** (after `.faq-item`, commented in the house style):
  `grid-area 1/1` stacking, opacity cross-fade on `--motion-slow`/`--ease-smooth`, transform-only
  progress fill (`linear` — it tracks a constant-speed timer, the `D-2.20-3` rationale). Every
  value a `var(--…)`; the global reduced-motion rule flattens the fade (deliberately no second
  rule).
- **Strings:** seven new `Showcase` keys MK+EN; everything else on a slide reuses existing
  reviewed keys (`Placeholder.productName`, `Common.currency`, `Stock.*`, `Product.photoAlt*`).
- **Decisions:** `D-2.21-1` (the fifth §6 motion exception — first that loops; brand.md §6 not
  updated, out of scope), `D-2.21-2…7` (null-price fallback, no pause button under reduced motion,
  progress row wrap below `sm:`, track on border-strong after measuring 1.37:1, the inline
  autoplay custom property, the verification maneuvers).

### Home hero photography (Y.04) — a real photograph on the front door

- **`src/components/home/HomeExperience.tsx`** — the countdown, ended, and no-view branches now render
  a photograph block + two CTAs between the existing hero text and the `aboutLink`; the **`live` branch
  is byte-unchanged** (proven by diff hunks + a byte-identical rendered `<main>` against `main`, both
  locales). Frames bound by explicit named constants (`D-Y.03-1` principle), `next/image` `fill` +
  `object-cover` in `aspect-[4/5]` boxes per the `PhotoSlot` pattern; mobile = one full-bleed mustard
  frame with `priority` (LCP), `≥640px` = two equal columns (mustard left, off-white right);
  `sizes="(min-width: 640px) 50vw, 100vw"`. Alt text reuses `Product.photoAlt*` — no new alt string.
- **CTAs:** `Home.ctaCatalog` „Каталог"/"Catalog" (mustard fill) → `/katalog`·`/en/catalog`;
  `Home.ctaContact` „Контакт"/"Contact" (bordered) → `/kontakt`·`/en/contact`; existing button classes
  only (`D-Y.04-4`), 48/50px tall, localised `Link`. The countdown `browseWhileWait` text link retired
  (`D-Y.04-2`, key kept).
- **No new asset, no `public/` change, no new dependency, no new token, no new animation.** Lighthouse
  mobile Performance on `/` (ended-state hero, production build): **98**.
- **Decisions:** `D-Y.04-1` (the hero itself; supersedes `D-1.05-4`; the AI-composite alternative
  refused under `D-0-6`), `D-Y.04-2…5` (link retirement, full-bleed mechanics, button composition,
  Lighthouse methodology).

### Drop rehearsal + contingency (2.06, Code half) — drop day as a script

- **`docs/ops/drop-day-contingency.md`** — the `D-0-2` drop-day contingency plan. Detection · bilingual
  (MK+EN) Instagram hold post [story + feed caption, humanizer pass, Lazar sign-off owed] · manual DM/phone
  order channel + anti-oversell tally · X.01 recovery trigger · roles · hard don'ts. Every fact traced to
  `facts.md` (phone `078 820 520`, IG `@trajanovv2026`, `info@trajanovv.com`, COD, NMK-only, delivery 3–5
  business days); no invented courier/cost/stock.
- **`docs/ops/drop-rehearsal-runbook.md`** — plain-language operator script: pre-flight → open (hosted only,
  one sellable unit, never committed to `main`) → lifecycle on a phone (countdown→LIVE→order [#15]→SOLD
  OUT→email [#16]→fulfilment walk) → expiry (backdated hold, `*/5` job) → contingency dry-run → mandatory
  teardown (ban on `db reset --linked`) → evidence.
- **`docs/ops/rehearsal-sql/`** — `00-baseline` · `01-open-rehearsal-drop` · `02-verify-live` ·
  `03-verify-order` · `04-backdate-hold` · `05-verify-expiry` · `06-teardown` · `07-verify-clean` (+
  `README`). Supabase SQL Editor, `test-drop` only, reusing the 1.08 open→order→verify→close method.
- **`docs/ops/rehearsal-evidence/`** — evidence drop folder (README with the `D-0-1` PII caution).
- **Decisions:** `D-2.06-1` (one order against a one-unit drop, reused for the expiry test),
  `D-2.06-2` (contingency points at X.01; the X.01 brief is flagged-not-written, out of 2.06 scope).
- **No code:** `create_order`/`expire_reservations`/`supabase/migrations/`/cart/checkout/`src/config/`
  untouched; no new dependency; committed drop stays ENDED.

### Cutover (2.05) — the real domain, the branded email, the published contact

- **`SITE_URL`** `src/lib/site.ts` → `https://www.trajanovv.com` (the canonical 200-serving host; apex +
  `trajanov-v2.vercel.app` 308→www, `D-2.05-6`). Single source — every canonical/hreflang/OG/JSON-LD/
  sitemap/robots/llms.txt/IndexNow URL rebuilds from it. Grep gate: **zero** `trajanov-v2.vercel.app` /
  single-v `trajanov.com` in emitted URLs/canonicals/OG/schema.
- **Order-email from-address** `src/lib/email/order-notification.ts` — `ORDER_FROM_ADDRESS` →
  `info@trajanovv.com` (the one Vladimir notification; no customer email exists, `D-Z.01-1`).
  `ORDER_NOTIFICATION_EMAIL` (recipient) untouched. Email unit tests (mocked Resend) assert the new
  from-address.
- **Contact publishes the email** `src/app/[locale]/contact/page.tsx` — a real
  `mailto:info@trajanovv.com` in both locales via the shared `EMAIL`/`EMAIL_MAILTO` constants
  (`src/lib/social.ts`); the `<Placeholder>` + `Placeholder.email` key are gone (removed from both
  catalogs). Placeholder **#5 cleared**.
- **Shipping delivery time** `src/app/[locale]/shipping-returns/page.tsx` + `ShippingReturns.deliveryTime`
  — „Рок на достава: 3–5 работни дена." / „Delivery time: 3–5 business days." (verbatim reviewed strings).
  `Placeholder.courier` **narrowed** to courier + cost; `deliveryBody` reworded to match (`D-2.05-7`);
  returns-window placeholder unchanged.
- **Turnstile** — `src/lib/turnstile/verify.ts` unchanged: it verifies `success` only and **does not
  assert hostname**, so the new domain needs no code allowlist. Site key rotated to
  `0x4AAAAAAD6pSIvEa1p8GkZX` (env-only, `D-2.05-4`); secret in Vercel, never in the repo.
- **Facts + review** — `facts.md` §5 (email published), §7 (delivery time VERIFIED; courier + cost OWED),
  §9 (domain `trajanovv.com` VERIFIED — PURCHASED, serving host www). `docs/i18n/mk-review-2.03.md`
  sign-off blocks filled (Lazar + Petar, 2026-07-21, passed no changes).
- **Decisions:** `D-2.05-1…5` (verbatim: domain, placeholder override, info@ routing, Turnstile rotation,
  analytics deferral), `D-2.05-6` (SITE_URL = www), `D-2.05-7` (shipping copy + single from-address).

### SEO/GEO polish (2.04b) — a face for the brand: llms.txt, logo, icons, IndexNow

- **`llms.txt`** `src/app/llms.txt/route.ts` (`force-static`, served at `/llms.txt`): `# Trajanov` H1, a
  one-paragraph `>` blockquote summary, a details paragraph, and `## Pages` / `## Legal` / `## Contact`
  link sections. English prose (LLM lingua franca); every claim traced to `facts.md` (see the file header
  for the line-by-line trace); **excludes** price/size/fabric/email/address/review/partner (`facts.md`
  §7/§10). Links are both-locale **absolute** URLs from the shared route list; `Content-Type: text/plain;
  charset=utf-8` + **`X-Robots-Tag: noindex`**; **not** in the sitemap (not a page).
- **Shared route module** `src/lib/seo/routes.ts` — `INDEXABLE_STATIC_HREFS` (the 7 static indexable
  routes, `as const`) + `absoluteUrl(href, locale)`. `src/app/sitemap.ts` was **refactored** onto it
  (dropping its inline `STATIC_HREFS`/`abs`/`Href`), and `llms.txt` reads the same, so the two route sets
  **cannot drift**; adding a route forces a compile-time label in llms.txt's exhaustive `PAGE_META`.
- **Brand wordmark** `public/logo.svg` (Rubik 700 embedded as base64 → renders anywhere; transparent
  ground) + `public/logo-512.png` (mustard wordmark on a solid ground square). `src/lib/seo/site-jsonld.ts`
  Organization node now carries **`logo: ${SITE_URL}/logo-512.png`** (absolute); the "NO logo" comment was
  rewritten to explain a real mark now exists — still **no** address / SearchAction / partner. `tests/seo/
  site-jsonld.test.ts` gained a positive `logo` assertion (and dropped the stale "no logo" one) → 85 tests.
- **Icon set + manifest** — `src/app/icon.svg` (geometric "T" monogram, brand colours, crisp at any size,
  font-independent) + `src/app/apple-icon.png` (180); `public/icon-192.png` + `public/icon-512.png` for the
  manifest; `src/app/manifest.ts` (`name`/`short_name` "Trajanov", facts-clean description, `lang: "mk"`,
  `start_url: "/"`, `display: "standalone"`, `theme`/`background` = ground token, icons incl. a
  maskable-safe 512). Next auto-injects the `manifest`/`icon`/`apple-touch-icon` `<link>`s; the legacy
  `favicon.ico` remains as fallback.
- **IndexNow** `public/78dec4b97e3fbb0f22d1c8df38050f74.txt` (the bare 32-char hex key) + `src/lib/seo/
  indexnow.ts` — `INDEXNOW_KEY` + a best-effort `pingIndexNow(urls)` that builds `host`/`keyLocation` from
  `SITE_URL` and POSTs to `api.indexnow.org`. **Exported, wired to nothing** (`D-2.04b-6`) — a preview host
  can't own submissions; a post-2.05 hook fires it. Key is **public by design, not a `D-0-1` secret.**
- **Asset generator** `scripts/generate-brand-assets.ts` (`npm run assets:brand`) — renders the four PNGs +
  the embedded-font `logo.svg` via **`next/og`** (satori + resvg, already in Next) from the vendored Rubik
  woff and brand token literals. **No new dependency** (`D-2.04b-5`); run by hand, outputs committed.
- **Gates**: `npm run build` / `npx tsc --noEmit` / `npm run lint` clean; `npm test` **85/85** (84 + 1) incl.
  the 10-vs-3 oversell gate. Verified by curl + in-browser (see the register's 2.04b note). **No `supabase/`,
  `create_order`, `expire_reservations`, cart, stock, `src/config/`, `src/types/database.ts`, or npm
  dependency touched; `SITE_URL` unchanged.**
- **Decisions:** `D-2.04b-1` (introduce the wordmark — owner-level, sign-off owed), `D-2.04b-2` (ship
  `llms.txt`), `D-2.04b-3` (shared route module + sitemap refactor), `D-2.04b-4` ("T" monogram favicon),
  `D-2.04b-5` (`next/og` generator, no dep; token values mirrored as literals), `D-2.04b-6` (IndexNow key
  public + `pingIndexNow` un-wired).

### Perf, a11y, SEO (2.04) — discoverable, accessible, and shareable

- **Sitemap** `src/app/sitemap.ts` (dynamic): one `<url>` per (route, locale) with reciprocal
  `alternates.languages`, every URL absolute on `SITE_URL` + next-intl `getPathname` (grep: no hand-typed
  slug), plus each real product from `listCatalogProductSlugs()` (new export on `src/lib/drop/state.ts`,
  reads the DB). **Home, Catalog, About, Contact, Terms, Privacy, Shipping & Returns + each Product** in
  both locales; **Cart, Checkout, `/styleguide` excluded.** DB read wrapped in try/catch → static routes
  still serve if the product read fails.
- **robots** `src/app/robots.ts`: `Allow /`, `Disallow /styleguide` + `/en/styleguide`, `Host` +
  `Sitemap: ${SITE_URL}/sitemap.xml`.
- **noindex** on Cart, Checkout, `/styleguide` (both locales) via `pageMetadata({index:false})` →
  `<meta name="robots" content="noindex, nofollow">`; the content routes carry no robots meta (indexable).
  Verified by curl on all routes.
- **Site JSON-LD** `src/lib/seo/site-jsonld.ts` + `src/components/seo/JsonLd.tsx`, rendered in the locale
  layout: an `@graph` of **Organization** (`@id #organization`, `sameAs` = `INSTAGRAM_URL` only) +
  **WebSite** (`inLanguage ["mk","en"]`, `publisher` → the org). **No `address`, no `logo`, no
  `potentialAction`/SearchAction, no EAM/partner** (asserted by `tests/seo/site-jsonld.test.ts`).
- **Product JSON-LD** `src/lib/seo/product-jsonld.ts`, rendered on `/catalog/[slug]` **only when the
  product has a real name**. `brand` = Trajanov; `offers` with real `price` (string) + `priceCurrency
  "MKD"` + `availability` from `availabilityFor(dropState, stock)` (live+stock → InStock, live+soldout →
  SoldOut, countdown → PreOrder, ended+stock → OutOfStock — never hardcoded InStock, `D-2.04-3`);
  `image`/`description` omitted while #2/#3. `tests/seo/product-jsonld.test.ts` (12 cases) proves the
  placeholder gate + real-name node + the mapping. Exercised live: the seed's real-named product rendered
  a valid node; production's null-named `test-drop` renders none.
- **OG share cards** `src/app/og/route.tsx` (`next/og`, Node runtime): 1200×630, brand ground + mustard
  wordmark + the page's `Meta` title + `@trajanovv2026`, type-only (no photo, no baked countdown). Rubik
  700 latin + cyrillic loaded from **vendored woff** (`src/app/og/*.woff`, SIL OFL) via `readFileSync(new
  URL(...))` — no runtime Google request; MK renders native Cyrillic (screenshot). `/og` excluded from the
  proxy matcher (`src/proxy.ts`) so next-intl doesn't 404 it.
- **Central metadata** `src/lib/metadata.ts` — new `pageMetadata()` + `ogImageUrl()`: title/description +
  `localeAlternates` (2.01 hreflang/canonical, unchanged) + absolute `openGraph.images` +
  `twitter.card:"summary_large_image"` + optional noindex. **All 11 pages + the layout default** switched
  to it, so `og:image` + `twitter:image` are absolute on **every** route (grep-verified, 10 routes × 2
  locales). The product page passes a neutral brand `ogTitle` while names are placeholders, so **no
  placeholder value is baked into a card**.
- **a11y (WCAG 2.2 AA)** — axe-core 4.10 (headless Chromium, tall viewport so off-screen sampling doesn't
  false-positive) = **zero serious/critical** on Home (live), Catalog, Product, Checkout (form populated),
  Terms. Changes: skip-to-content link + `<main id="main-content">` (`layout.tsx`, new `Common.skipToContent`);
  `ProductCard` heading `h3`→`h2` + a visually-hidden `h1` on the live home (no heading skips); the
  low-stock card count → the `StockBadge` red pill (AA contrast, `D-2.04-4`); footer link 24px targets +
  44px cart icon (`D-2.04-5`); a global `:focus-visible` ring (`globals.css`, `D-2.04-6`); `lang` on the
  language-switch buttons + the About quote; `PhotoSlot` label 11.2px→12px (legible). Checkout already had
  real `<label>`s + `aria-invalid`/`aria-describedby` + `aria-live` — **triggered and confirmed** (error
  submit flips `aria-invalid="true"` + wires `aria-describedby` → the error text). `prefers-reduced-motion`
  rule ships in the CSS bundle; countdown is value-updates-only, reveal is a plain swap.
- **Lighthouse** (actual scores in `completions/Part-2-Phase-04-Completion.md`): Desktop **P/A/BP = 100**
  on all five routes; Mobile **A/BP = 100** on all five, Mobile **P** = Home 98 / Product 97 / Legal 95 /
  Catalog 94 / Checkout 94; **SEO 100 on the production origin** (localhost 92 = cross-origin canonical
  artifact, proven 100 on prod; Checkout 58 = intentional noindex).
- **Gates**: `npm run build` / `npx tsc --noEmit` / `npm run lint` clean; `npm test` **84/84** (69 + 15
  new) incl. `✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected …, stock 0`; the
  catalog-parity test stays GREEN (both catalogs gained `Common.skipToContent`). `docs/i18n/string-inventory.md`
  regenerated (213 → 214). **No `supabase/migrations/`, `create_order`, `expire_reservations`, cart,
  `src/config/`, `src/types/database.ts`, hosted DB, or npm dependency touched; `SITE_URL` unchanged.**
- **Decisions:** `D-2.04-1` (dynamic `/og` + central `pageMetadata`), `D-2.04-2` (brand hex literals +
  vendored Rubik woff), `D-2.04-3` (availability mapping), `D-2.04-4` (low-stock pill for AA contrast),
  `D-2.04-5` (24px/44px tap targets), `D-2.04-6` (global focus-visible), `D-2.04-7` (skip link + new MK
  string), `D-2.04-8` (vitest `@` alias).

### Legal pages + facts audit (2.03) — three honest pages, every claim traced

- **Three static legal pages**, both locales, all `●` SSG (`setRequestLocale`, no `force-dynamic`):
  `src/app/[locale]/terms/page.tsx` (`/uslovi` · `/en/terms`), `privacy/page.tsx` (`/privatnost` ·
  `/en/privacy`), `shipping-returns/page.tsx` (`/isporaka-i-vrakjanje` · `/en/shipping-returns`). Built
  from the `/about`+`/contact` editorial pattern through a **shared shell** `src/components/legal/LegalPage.tsx`
  (`LegalPage` + `LegalSection`, `D-2.03-3`); brand.md tokens only. Each carries a per-locale `Meta`
  title/description + `localeAlternates` (canonical + reciprocal hreflang) and a fixed, per-locale-formatted
  **last-updated date** (`Common.lastUpdated` + a `LAST_UPDATED` constant, `D-2.03-4`).
- **Terms** — who you buy from (**Vladimir Trajanov, Струмица, alone** — `D-2.03-1`; no company, no
  address), reach us (phone + IG from `social.ts`, email unpublished), COD-only, NMK-only, the 48h
  reservation + 2-per-order + call-to-confirm flow, MKD prices/no conversion, and "what we don't do".
- **Privacy** — collected fields **matched to the real `orders` columns** in
  `supabase/migrations/20260715021215_schema.sql` (name/phone/city/address/note, **no email** — `D-Z.01-1`);
  why/who (notification email to Vladimir, `D-Z.01-5`); Frankfurt storage; the **one-way IP hash, raw IP
  never stored** (`src/lib/rate-limit/hash.ts`); `sessionStorage` cart + **no advertising/tracking/analytics/
  social cookies** (no consent banner — Decision 4); deletion by phone; responsible party Vladimir alone.
- **Shipping & Returns** — reuses the shared `ShippingNotice` (`Common.shippingNotice`, §7); pay-courier-on-
  arrival; **two visible `[PLACEHOLDER: …]`** (courier/time/cost, returns window — register #6/#7, owner
  Vladimir), never estimated; "call the phone, Vladimir sorts it" and a plain statement that there is no
  online returns portal / prepaid label. **No statutory withdrawal period cited** (Decision 5).
- **Facts audit** `docs/legal/facts-audit-2.03.md` — Part A walks all 150 pre-2.03 keys + rendered
  constants; Part B the 63 new keys. Status per row (VERIFIED `facts.md` / VERIFIED code / PLACEHOLDER /
  NOT A CLAIM / UNSOURCED). **2 findings:** F-1 (`facts.md` §1 responsible-party contradiction → resolved
  by the §1 amendment) and F-2 (cart "calculated on delivery" → surfaced, not reworded, `D-2.03-6`).
  **Zero UNSOURCED remain.** §10 "do-NOT-have" list `grep`-confirmed absent (EAM appears only as the
  competition organiser/prize factory on About).
- **`facts.md` §1 amended** so file and site agree (displayed party = Vladimir alone `D-2.03-1`; intake
  fact kept; **open parental-confirmation flag unchanged**); dated change-log row added.
- **Strings**: `Terms`/`Privacy`/`ShippingReturns` namespaces + `Nav.terms/privacy/shipping` + 6 `Meta`
  + `Common.lastUpdated` + `Placeholder.courier`/`returnsWindow` — **63 new, MK+EN key sets identical
  (150 → 213)**, no empty value. `humanizer` pass run (cut a stiff "Here is exactly" and a self-praising
  "Short and honest:" opener; the "no X, no Y, no Z" negations match the established voice and stayed).
  `docs/i18n/string-inventory.md` regenerated (213) + committed; `docs/i18n/mk-review-2.03.md` committed
  **unsigned** (63-row table + 3-slug question + two sign-off blocks).
- **Routing**: three `pathnames` entries (MK Latin transliteration, `D-2.01-1`); **no 308 redirects**
  (new paths, nothing to redirect from); lockstep comment updated. Footer links all three (locale-aware
  `Link`, `Nav.*` keys). `tests/i18n/pathnames.test.ts` gained explicit both-locale assertions for the
  three routes.
- **Gates**: `npm run build` / `npx tsc --noEmit` / `npm run lint` clean; `npm test` **69/69** incl.
  `✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock,
  stock 0`; parity driven **RED** (`Terms.sellerHeading` removed from `en.json`) **→ GREEN**. Rendered
  in-browser at 390px + 1180px, both locales. **No `supabase/migrations/`, `create_order`,
  `expire_reservations`, cart, `src/config/`, hosted DB, or npm dependency touched.**
- **Decisions:** `D-2.03-1` (responsible party — Lazar), `D-2.03-2` (audit treats operational claims as
  code-VERIFIED), `D-2.03-3` (shared `LegalPage` shell), `D-2.03-4` (fixed last-updated date), `D-2.03-5`
  (placeholders in the `Placeholder` namespace), `D-2.03-6` (cart F-2 surfaced, not reworded).

### Native MK review (2.02) — clean pass, no source change

- **Review record** `docs/i18n/mk-review-2.02.md`: the instrument the two reviewers worked from **and** the
  recorded result. Six sections — a plain-language how-to, an 8-page URL walk (both locales, live absolute
  links on `https://trajanov-v2.vercel.app`, checked 200 before writing), the six-slug Keep/Change question,
  the full **150-key** MK/EN table with a verdict on every row, the "intentionally not translated" list, and
  two sign-off blocks. The 150 keys were diffed against `docs/i18n/string-inventory.md` — **150 = 150**, exact.
- **Result: clean pass.** All 150 strings `OK` (no faults, no style notes); all six MK slugs `Keep`. Both
  reviewers (Lazar + Petar) signed off; they reviewed **jointly** and Code transcribed the verdicts, with the
  provenance stated in the file's Section 6 (`D-2.02-2`).
- **What that means for the code:** nothing to fix. `src/messages/{mk,en}.json` are **unchanged** (Task 3 a
  no-op); `next.config.ts`, the redirect table, `src/i18n/routing.ts` `pathnames`, and `tests/i18n/` are
  **unchanged** (all six slugs Keep, `D-2.02-3`). The only code edit in the phase is the `routing.ts` comment
  flipping "provisional"→"confirmed"; the word "provisional" is now gone from `routing.ts` and this file
  (`D-2.01-5` in `Decisions.md` is left intact as the historical record).
- **Decisions:** `D-2.02-1` (review pack in English prose, MK strings verbatim, dev-path column dropped),
  `D-2.02-2` (joint review transcribed by Code), `D-2.02-3` (all six slugs confirmed Keep).
- **Gates re-run (standing protection, none skipped):** `npm run build` / `npx tsc --noEmit` / `npm run lint`
  clean; `npm test` **63/63** incl. `✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected
  with insufficient_stock, stock 0`; the catalog-parity test driven **RED** (removed `Nav.contact` from
  `en.json` → `keys present only in mk.json: [ 'Nav.contact' ]`) **then GREEN** (restored); `npm run
  i18n:inventory` regenerated `string-inventory.md` **byte-identical** (no string changed → nothing to commit).

### Bilingual (2.01) — Macedonian down to the URL

- **Localised route slugs** (`src/i18n/routing.ts`): `pathnames` maps each internal route to its MK Latin
  slug (`/katalog`, `/kosnicka`, `/naracka`, `/za-nas`, `/kontakt`) and EN English slug (`/en/catalog`, …);
  `localePrefix: 'as-needed'`, `defaultLocale: 'mk'` unchanged. Route **folders** under `src/app/[locale]/`
  are NOT renamed. Product route `/catalog/[slug]` keeps a single shared slug in both locales (`D-2.01-2`).
  `src/proxy.ts` consumes `routing` unchanged — **no edit needed**.
- **Redirects** (`next.config.ts`): six **308** rules from the old English MK paths to the new MK slugs
  (`/catalog→/katalog`, `/catalog/:slug→/katalog/:slug`, `/cart→/kosnicka`, `/checkout→/naracka`,
  `/about→/za-nas`, `/contact→/kontakt`). `/en/*` is not matched. Runs before the next-intl middleware.
  Carries a "keep in lockstep with `routing.ts`" comment (`D-2.01-3`).
- **Typed navigation everywhere**: `ProductCard`'s dynamic link uses the object form
  `{pathname:'/catalog/[slug]', params:{slug}}` so next-intl emits the localised URL; `HomeExperience`'s
  `useRouter` moved to `@/i18n/navigation`. The only remaining `next/navigation` imports are `notFound`
  (layout, product page — not a route link) and `useParams` (LanguageSwitch — a param reader with no
  next-intl equivalent). No hand-written MK slug in any component.
- **String extraction**: the only user-facing literals still inline were the cart quantity-stepper
  `aria-label`s → `Cart.decrease` / `Cart.increase`. Everything else was already in the catalogs.
- **Per-locale metadata** (`Meta` namespace): `generateMetadata` on every route (+ the layout default)
  sets a locale-distinct `<title>` + description from the catalog; nothing hardcoded in `layout.tsx`.
  `<html lang>` renders `mk`/`en` correctly.
- **hreflang + canonical** (`src/lib/site.ts` + `src/lib/metadata.ts`): a single `SITE_URL` constant
  (`https://trajanov-v2.vercel.app`, `TODO(2.05): trajanov.com` — **not** from a Vercel var, no new env
  var). `localeAlternates(href, locale)` builds `alternates` via next-intl `getPathname`: `canonical` in
  the page's own locale, `languages.mk`/`languages.en`/`languages['x-default']`(→MK), all absolute and
  reciprocal (EN↔MK point at each other for the same page, incl. the shared product slug).
- **Shipping statement** (`src/components/system/ShippingNotice.tsx`, `Common.shippingNotice`): one shared
  key, traced to `facts.md` §7 ("Shipping — North Macedonia only", VERIFIED). Renders above Add-to-cart on
  the product page and in the checkout COD block, both locales. EN: "We ship inside North Macedonia only.
  We can't deliver outside the country. Cash on delivery." (`D-2.01-7`). The product page's existing
  below-fold Shipping detail (`Product.shippingBody`) is unchanged, so shipping shows twice there.
- **Locale-correct formatting** (`src/lib/format.ts`): `formatMkd(amount, currency, locale)` groups per
  locale (MK `1.199`, EN `1,199`), MKD always. Dates already go through the next-intl formatter (About).
  **No currency conversion exists anywhere** (`D-2.01-8`).
- **Language switch** (`src/components/layout/LanguageSwitch.tsx`): `router.replace({pathname, params,
  query}, {locale})` keeps the customer on the same page across the slug change; query + `?preview` read
  from `window.location.search` at click time (avoids a CSR bail-out on the static pages, `D-2.01-6`).
- **String inventory** (`scripts/i18n-inventory.ts`, `npm run i18n:inventory` → `docs/i18n/string-inventory.md`,
  committed): 150 keys with MK/EN/where + "Intentionally not translated" + "byte-identical" (4) sections.
  Flags ~12 apparently-unused keys carried from earlier phases (e.g. `Home.title`, `Product.details`) for
  2.02 — **not removed** (out of scope).
- **Tests** (`tests/i18n/`): catalog parity (identical key sets, no empty value bar the deliberate
  `About.quoteNote`, `D-2.01-10`) + pathname coverage (route folders ⇔ `pathnames`, both-locale slugs,
  `D-2.01-9`). **63 pass** total; parity confirmed RED then GREEN. No DB needed for the i18n suites.

### Order notification email (Z.01) — the side channel, best-effort

- **Sender** `src/lib/email/order-notification.ts`: `composeOrderNotification()` (pure MK subject + body —
  order number, each product/size/qty, customer name/phone/city/address/notes) and `sendOrderNotification()`
  (reads `RESEND_API_KEY` + `ORDER_NOTIFICATION_EMAIL` at call time, sends via `resend`, **never throws**,
  bounds the call at 8s, logs failures **without PII** — only the order number + Resend error code). From
  `onboarding@resend.dev` (`D-Z.01-2`). **No `import "server-only"`** — deliberately, so it stays unit-
  testable; it is only ever imported by the "use server" action + tests, never a client component.
- **Wiring**: optional `notifyOrder(input, orderNumber)` on `ProcessDeps`; `processOrder` calls it **only**
  after `create_order()` succeeds, awaited inside a `try/catch` so the order outcome is fixed before the
  email is attempted (`D-Z.01-5`). `actions.ts` supplies the closure: `resolveOrderLines()` does one bounded
  (4s abort), best-effort `service_role` SELECT (`variants` embed `products.name_mk/name_en/slug`) to name
  the lines, degrading to quantity-only on failure (`D-Z.01-6`); then `sendOrderNotification`.
- **Customer confirmation** (Task 5): `Order.success` extended in **both** locales to state the order number,
  the 48h reservation, **COD**, and **"we'll call you to confirm"** (`D-Z.01-7`). No new message key — MK/EN
  key sets stay identical. No customer email is collected (`D-Z.01-1`).
- **Tests**: `tests/email/order-notification.test.ts` (Resend **mocked**, no DB) proves: one email to the
  right recipient from `onboarding@resend.dev` with the right fields; a thrown Resend error and a missing
  env var both degrade silently (no throw); **no PII in any log line**; and the null-line fallback fabricates
  nothing. `tests/orders/process-order.test.ts` (+4) proves notify fires exactly once after success, never on
  failure/empty, and a throwing notify still returns success. **56 pass** incl. the re-run oversell gate.
- **Dep**: `resend 6.17.2` — the only new dependency; no new `npm audit` advisory. **No migration,
  `create_order`, `expire_reservations`, component, route, or existing test changed.**

### Deploy + hosted Supabase + real keys (1.07 Code) — the store left the laptop

- **Live**: `https://trajanov-v2.vercel.app`, Vercel Hobby, project `trajanov-v2`, `main` =
  production. Deployed from the phase branch via CLI **before** the PR merged (`D-1.07-5`) — Turnstile
  will not accept preview hostnames (`D-1.07-6`), so production is the only place it can be proven.
- **Hosted DB**: Frankfurt `eu-central-1`, ref `kmuocwmevyyuhcvwoebf`, **Postgres 17.6** (= local
  major). **8/8 migrations pushed**; local and remote lists match; no migration edited to force it.
  `config.toml`'s `major_version = 17` agreed with hosted — no mismatch warning.
- **New migration** `20260716120000_catalog_grant_hardening.sql` (`D-1.07-14`) — the phase's one code
  change. REVOKEs `insert/update/delete/truncate` on `drops`/`products`/`variants` from
  `anon`/`authenticated`/`public`; re-asserts `grant select`. Idempotent; `db reset` reproduces it.
  **No function, table shape, component, string, or test changed.**
- **pg_cron on hosted**: `create extension if not exists pg_cron` **worked straight from the
  migration** — no dashboard step. 2 active jobs (`expire-reservations` `*/5 * * * *`,
  `prune-cron-run-details` `17 3 * * *`) in the `postgres` database. **Named risk: a PAUSED free-tier
  project silently pauses pg_cron, and reservations then stop expiring** (register #4).
- **Parity method** (`D-1.07-4`): ran the **real** suite against Frankfurt while empty, then reset.
  `seed.sql` applied for the run against its own "never on a deployed database" header (`D-1.07-13`)
  — the only way to reach the fixtures; erased by the reset, which was **verified**, not assumed.
  All four hosted vars exported together, not just `SUPABASE_DB_URL` (`D-1.07-10`) — exporting only
  the DB URL would have run the RLS suites against **local** and reported a **false** 46/46.
- **Connection**: the **session pooler** (`aws-0-eu-central-1.pooler.supabase.com:5432`), not the
  direct host (`D-1.07-11`). Direct is **IPv6-only** and this machine has **no IPv6** — `dns.resolve6`
  finds the AAAA, `getaddrinfo` refuses it, so every tool fails `ENOTFOUND`. Session mode keeps
  prepared statements (transaction mode on 6543 would have forced a test-helper edit). **The app never
  uses `SUPABASE_DB_URL`** — it is admin/test only (`D-1.03-12`), so nothing in production depends on
  this.
- **RLS on hosted, real anon key** (Task 6, `D-1.07-3`): `orders`/`order_items` deny **select, insert,
  update** — all `42501`. Catalog **readable, not writable** (verified against ground truth: stock
  5→5, row counts unchanged). `create_order`/`expire_reservations`/`check_order_rate_limit`
  **`anon=false, authenticated=false, service_role=true`** — **identical to local**.
- **Types**: `gen types --linked` schema content is identical to committed (6 tables, 4 functions,
  2 enums), and committed matches `--local` **byte-for-byte** (sha256 equal). `--linked` adds a
  cloud-only `__InternalSupabase { PostgrestVersion: "14.5" }` block that `--local` never emits — so
  the DoD's "byte-identical to `--linked`" is **unmeetable as worded**, for a non-schema reason.
  `src/types/database.ts` left untouched, as the brief instructs.
- **Rehearsal drop**: `npm run sync:drop` → 1 drop, 4 products, **16 variants INSERT-only, 0
  overwritten, 0 deleted** (`D-1.04-5`). `test-drop` is **ended + null-priced** (`D-1.04-12`) — the
  site renders the ended state, nothing is buyable, **0 orders** on production.
- **Turnstile proven end to end**: deployed `/checkout` carries `0x4AAAAAAD23OFW7Ka1hTR1F`; **no dummy
  key in 961 KB of deployed JS + HTML**; no `service_role`/secret/pepper/connection-string in the
  client payload. A widget on the production hostname **solved in Managed mode** and its **real token
  + the real secret** returned Siteverify **`success: true, hostname: trajanov-v2.vercel.app`**
  (wrong-secret control: `invalid-input-secret`).
- **Credentials**: hosted values live in gitignored **`.env.hosted`** (`D-1.07-9`), NOT in
  `.env.local` — pointing `.env.local` at Frankfurt would aim `npm run dev`/`test`/`sync:drop` at
  **production** by default. Verified: exported vars beat `process.loadEnvFile`, so both coexist.

### Cart flow (1.06) — the customer's choice reaches the order row

- **Pure cart** `src/lib/cart/cart.ts` — React-free reducer: `addItem`/`setItemQty`/`removeItem`/
  `toOrderItems` + `MAX_UNITS_PER_ORDER = 2` (total units, mirrors `create_order()` step 3, `D-1.06-6`).
  Node-testable; never touches the DB.
- **Cart store** `src/components/cart/cart-store.ts` — a module-singleton external store via
  `useSyncExternalStore`, **sessionStorage**-backed (`D-1.06-5`): survives refresh + in-session
  navigation, dies with the tab. Null server snapshot → a clean `hydrated` flag, no hydration flash, no
  setState-in-effect. No new dependency.
- **Add to cart** `src/components/product/AddToCartPanel.tsx` — owns the selected variant; wires
  `SizePicker` (available/selected/unavailable) + `BuyButton` (six states). Size required before Add
  (`Product.chooseSize`), sold-out sizes unselectable, cap enforced, inline `aria-live` feedback
  ("Added. — View cart"), header cart badge left unwired (header out of scope, `D-1.06-10`).
- **Wiring**: `SizePicker` (controllable) + `BuyButton` (real `onClick`) wired without breaking the
  styleguide; `CartView` reads the store (steppers/cap/empty); `catalog/[slug]` passes
  `variantId`/`dropSlug`; `cart`/`checkout` pages read real state; `CheckoutForm` submits
  `variant_id`+`qty` only.
- **Stand-in deleted**: `getActiveOrderContext`/`CheckoutContext` removed from `src/lib/drop/state.ts`
  (now exposes `variantId` on `SizeOption` + `dropSlug` on the product view, `D-1.06-7`); grep clean.
- **Empty-cart guard**: `processOrder` rejects `items: []` with `"empty"` before `create_order()`
  (`D-1.06-8`), plus the client's own empty checkout state.
- **Tests**: `tests/cart/cart.test.ts` (pure reducer) + `tests/orders/checkout-items.test.ts` (chosen
  variant → order_items, two items, cap client+server, TR004 sellout) + empty-cart case in
  `process-order.test.ts`. `seed.sql` gained `test-tee-two` (`D-1.06-9`). **46 pass; the phase test
  confirmed to fail against the stand-in (RED captured), then pass against the cart.**
- **Strings**: `Buy.added`, `Buy.viewCart`, `Order.emptyCart` in both catalogs (**130 keys each,
  identical**). Humanizer pass run.

### About + Contact (1.05) — static editorial pages

- **About** `src/app/[locale]/about/page.tsx` — **static** (`setRequestLocale`, no `force-dynamic`).
  Eyebrow → H1 → 3 body paragraphs (brand, competition, prize) → pull-quote → coverage list → link to
  `/catalog`. Every claim traced to `facts.md` §1/§2/§3/§4/§7. Quote renders in MK (original) and EN
  (marked translation, `D-1.05-6`). Coverage = all five outlets as links, dates via the next-intl
  formatter, **no count/adjective** (`D-1.05-5`, `D-1.05-11`). Press URLs copied character-exact from
  `facts.md` §4 (Cultural Chat's Cyrillic path keeps its stripped `fbclid`); all five verified live
  (HTTP 200) and confirmed as the competition article.
- **Contact** `src/app/[locale]/contact/page.tsx` — **static**. Phone (`078 820 520` →
  `tel:+38978820520`, ≥44px tap target), Instagram (`@trajanovv2026`, ≥44px), email
  `[PLACEHOLDER]` via the `<Placeholder>` component. Context line (Strumica · ships NMK only · COD).
  **No form, no address.**
- **`src/lib/social.ts`** gained `PHONE_DISPLAY` + `PHONE_TEL` (`D-1.05-9`) — single source for the
  phone, imported by the footer + Contact, never retyped.
- **`SiteFooter.tsx`** — About + Contact links (locale-aware `Link`), phone imported from `social.ts`,
  location now translated via `Nav.location` (`D-1.05-10`). Header untouched (`D-1.05-7`).
- **`HomeExperience.tsx`** — one quiet About link in the **countdown** and **ended** states; **none** in
  live/opening (verified in-browser).
- **Strings**: new `About` + `Contact` namespaces and `Nav.about/contact/location`, `Placeholder.email`
  in **both** catalogs — **identical key sets (126 each), verified**. Humanizer pass run.
- Rendered in-browser at 390px + 1180px, both locales (Task 8). `completions/_TEMPLATE.md` filename
  corrected to `Part-X-Phase-YY-Completion.md`.

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
  CheckoutForm. `contact/` — ContactForm (2.23). `layout/` — SiteHeader, SiteFooter,
  LanguageSwitch. `system/` — Placeholder, PhotoSlot, PreviewNotice. `home/` — HomeExperience.
  (`components/ui/` still shadcn-reserved, empty.)

### Integrations wired
- **next-intl** — MK default (`/`), EN (`/en/`), `localePrefix: as-needed`; message catalogs
  expanded for all UI strings (full extraction/hreflang still 2.01).
- **shadcn/ui** — config + `cn()` only; brand components hand-authored (`D-1.02-6`). No `ui/` yet.

| Integration | Status |
|---|---|
| Supabase | **HOSTED + MIGRATIONS PUSHED + PARITY PROVEN** (1.07 Code) — Frankfurt `eu-central-1`, ref `kmuocwmevyyuhcvwoebf`, **Postgres 17.6**. 8/8 migrations; local == remote. **46/46 tests pass against hosted**, incl. the 10-vs-3 oversell gate; pg_cron = **2 active jobs**; RLS verified with the real anon key; DB left **clean, TRJ-0001**. `test-drop` published (ended, null-priced). **Owed #4 CLOSED.** Legacy keys (`D-1.07-1`) confirmed in use. Admin access via the **session pooler** (`D-1.07-11`, IPv6). ⚠ **"Auto-expose new tables" is still ON** — future tables land anon-writable (`D-1.07-14`); ⚠ **`db reset --linked` is broken here** (`D-1.07-15`). |
| Resend | **BUILT (Z.01).** SDK `resend 6.17.2`; server-side best-effort order-notification sender in `src/lib/email/order-notification.ts`, fired after `create_order()` succeeds (`D-Z.01-5`), never affecting the order (Plan §8). From `onboarding@resend.dev` (`D-Z.01-2`); recipient in `ORDER_NOTIFICATION_EMAIL`, not published on Contact (`D-Z.01-3`). Unit-tested with **Resend mocked**. ✅ **Real inbox delivery VERIFIED — 1.08 operator (2026-07-18, `D-1.08-4`):** prereqs live (Resend account under Vladimir's email + `RESEND_API_KEY`/`ORDER_NOTIFICATION_EMAIL` in Vercel, redeployed); a real order (`TRJ-0001`) delivered the MK notification to Vladimir's inbox from `onboarding@resend.dev` with the correct order number / line / customer block / COD copy. Register #7 cleared. Branded from-address on `trajanov.com` still owed (#8 → 2.05, `D-Z.01-2`). **2.23:** a second sender, `src/lib/email/contact-message.ts` — the contact form's messages to the same inbox, from `ORDER_FROM_ADDRESS`, `replyTo` = the visitor, subject prefix „[Контакт]"; **result NOT advisory** (the email is the record — no DB table, brief decision 2). Real end-to-end delivery owed (#53). |
| Turnstile | **REAL KEYS LIVE IN PRODUCTION** (1.07 Code) — "Trajanov store", **Managed** (`D-1.07-2`), hostnames `trajanov-v2.vercel.app` + `localhost` only (`D-1.07-6`). Deployed `/checkout` serves `0x4AAAAAAD23OFW7Ka1hTR1F`; **no dummy key anywhere in the deployed build** (`D-1.04-8` superseded). Widget **solves on the production hostname**; real token + real secret → Siteverify **`success: true`**. **Owed #5 CLEARED — 1.08 Code (2026-07-18):** the real secret also *rejects* a missing token (`missing-input-response`) and an invalid token (`invalid-input-response`), wrong-secret control → `invalid-input-secret`; `orders=0`, no stock change. Server-side enforcement proven both directions (`D-1.07-7`, `D-1.08-3`). |
| Cloudflare DNS | Not configured (2.05) |
| Cloudflare Analytics | Not configured (2.05) |
| Vercel project | **DEPLOYED** (1.07 Code) — `trajanov-v2`, Hobby, `main` = production, live at `https://trajanov-v2.vercel.app` serving both locales from the hosted DB. 6 env vars in effect. ⚠ All six are **Sensitive = write-only**: `vercel env pull` returns them **empty** (`D-1.07-12`). ⚠ Stray **`trajanov`** project still exists — one repo, two projects (Lazar). |

---

## Owed-verification register

Things claimed done that only Lazar (or a real device / real account) can confirm. **At 3+ items,
or before any phase that builds on unverified work, the next phase is a verification phase.**
**Must be empty before Part 2 — hard gate at 1.08.**

| # | Item | Owed since | Phase that verifies |
|---|---|---|---|
| ~~1~~ | **Design direction sign-off** — **CLEARED — 1.08 operator (2026-07-18).** Lazar reviewed the live site (`/`, `/about`, `/contact`, `/catalog`, product, `/cart`, `/checkout`) and **signed off on the tokens** (palette + fonts derived from the handover ledger, `D-1.02-1`). No changes requested. | 1.02 | **CLEARED — Lazar review of the live site** |
| ~~2~~ | **IG profile URL click-test** — **CLEARED — 1.08 operator (2026-07-18).** A human clicked `@trajanovv2026` and confirmed it opens **Vladimir's actual profile** (`facts.md` §6). The handle was already VERIFIED and the link renders correctly (footer, drop-ended banner, Contact). | 1.02 | **CLEARED — Lazar click-test** |
| ~~4~~ | ~~**Hosted-Supabase parity**~~ — **CLOSED by 1.07 Code, with evidence.** 8/8 migrations pushed to `kmuocwmevyyuhcvwoebf`; `migration list` shows local == remote, **no migration edited to force it**. **`npm test` against Frankfurt: 46/46**, incl. the **10-vs-3 oversell gate (exactly 3 succeed, 7 rejected, stock 0)** and both expiry tests. `cron.job` = **2 active rows**, extension created **by the migration, no dashboard step**. Rate-limit table + `check_order_rate_limit` present and exercised (20/21 test passed on hosted). RLS re-verified with the **real anon key**: `orders`/`order_items` deny select/insert/update (`42501`); functions `anon=false`, identical to local. Hosted then **reset and verified clean** (0 rows, TRJ-0001). **One real divergence was found and fixed, not waved through** (`D-1.07-14`). **Residual risk, NOT a verification debt — moved to Known issues #7:** a **paused free-tier project silently pauses pg_cron**, and reservations stop expiring. | 1.03/1.04 | **1.07 Code — DONE** |
| 5 | **Real Turnstile keys — NARROWED, still open** (`D-1.07-7`). **Proven in 1.07 Code:** the deployed `/checkout` serves the **real** site key `0x4AAAAAAD23OFW7Ka1hTR1F`; **no dummy key appears anywhere in the deployed build** (961 KB of JS + HTML scanned) — `D-1.04-8`'s "dummy keys until 1.07" is fully retired; the widget **renders and solves in Managed mode on `trajanov-v2.vercel.app`**, and a **real token + the real secret** returned Siteverify **`success: true, hostname: trajanov-v2.vercel.app`** (a wrong-secret control returned `invalid-input-secret`, so the pass is meaningful); Managed mode's silent auto-pass **matches** the local dummy-key behaviour (`D-1.07-2` confirmed). **STILL OWED:** whether Cloudflare actually **challenges a bot on a real order**. That needs a **live drop**, which 1.07 deliberately does not create (the only drop is `test-drop`, ended + null-priced, `D-1.04-12`). Also unexercisable on preview URLs at all (`D-1.07-6`). **CLEARED — 1.08 Code (2026-07-18):** against the deployed **real production secret**, Siteverify rejected a **missing** token (`missing-input-response`) and an **invalid** token (`invalid-input-response`), and a wrong-secret control returned `invalid-input-secret` — so the real gate genuinely validates; hosted `orders=0`, no stock change. Per the brief's Task 5 this is what closes #5 (the load-bearing server-side gate is proven; a browser-solved bot on a *real* order is exercised whenever the operator runs the runbook order). | 1.04 | **CLEARED — 1.08 Code** |
| ~~6~~ | **"Automatically expose new tables"** — **CLEARED — 1.08 operator (2026-07-18).** Lazar turned the toggle **OFF** on `kmuocwmevyyuhcvwoebf`. **Standing caveat (not a debt):** turning it off does **not** retroactively revoke, so any future migration that adds a table (e.g. `Y.01`'s photo/fabric work) must still pair it with an explicit `REVOKE` — carry this into that migration's DoD (`D-1.07-3/14`). | 1.07 | **CLEARED — Lazar (dashboard)** |
| ~~7~~ | **A real order sends a notification email that arrives in Vladimir's inbox** — **CLEARED — 1.08 operator (2026-07-18).** The Z.01 email prereqs were set up (Resend account under Vladimir's email + `RESEND_API_KEY`/`ORDER_NOTIFICATION_EMAIL` in Vercel, redeployed), the rehearsal drop was opened, and **a real order (`TRJ-0001`) was placed end to end on a phone.** The MK notification **arrived in Vladimir's inbox** from `onboarding@resend.dev` — subject "Нова нарачка TRJ-0001 — Trajanov", listing the ordered line (`test-mustard-ochre — величина L — 1 бр.`), the full customer block (name/phone/city/address/notes), and the COD + call-to-confirm + "Supabase is the record" lines. DB side confirmed: order row, atomic decrement (3→2), 48h reservation. Order + reservation then deleted; hosted returned clean (`D-1.08-4`). | Z.01 | **CLEARED — 1.08 operator (real order + email)** |
| ~~8~~ | **Branded from-address — CLEARED 2026-07-22 (2.05 Code).** `ORDER_FROM_ADDRESS` is now `info@trajanovv.com` (`src/lib/email/order-notification.ts`); the domain is verified in Resend in the same account that holds `RESEND_API_KEY`, so a `from: info@trajanovv.com` delivers (`D-2.05-3`). Email unit tests (mocked Resend) assert the new from-address and pass. That a *real* order delivers from `info@` end to end is tracked as **new owed #16** (needs an open drop, 2.06). | Z.01 → | **CLEARED — 2.05 Code** |
| ~~9~~ | **Human legal review — CLEARED (operator, 2026-07-21).** A lawyer read Terms, Privacy, and Shipping & Returns; **no changes were reported.** Recorded at the 2.05 cutover on the operator's report; the pages are unchanged. | 2.03 | **CLEARED — operator (lawyer read, 2026-07-21)** |
| ~~10~~ | **MK legal copy native review — CLEARED (2.05 Code, stamped 2026-07-22).** Two native speakers (Lazar + Petar) reviewed all 63 new 2.03 `Terms`/`Privacy`/`ShippingReturns` (+ `Nav`/`Meta`/`Placeholder`) MK strings **plus `Common.skipToContent`** (the 2.04 skip link, `D-2.04-7`) — **passed, no changes**. `docs/i18n/mk-review-2.03.md` sign-off blocks are now filled (dated 2026-07-21). | 2.03 | **CLEARED — 2.05 Code (stamped)** |
| 11 | **OG paste-test — the real traffic path (Plan §10).** Lazar pastes the deployed **MK + EN Home and Product** URLs into an Instagram story/DM **and** Viber and confirms the branded card renders — image **and** title, Cyrillic intact on the MK card. Code proved the card serves at 1200×630 and renders native Cyrillic (screenshot), and that `og:image`/`twitter:image` are absolute on every route — but **only a human with those apps can confirm the actual in-app link preview**; a link-preview/OG-debugger check by Code is **not** a substitute. **2.04b adds the brand `logo`** to this check — the same paste should confirm the wordmark reads well where a platform shows the Organization logo, and Lazar should run the deployed Home URL through **Google's Rich Results Test** to see the `logo` resolve/preview. Verifies **after the 2.05 deploy** — the URLs to paste are now on **`https://www.trajanovv.com`** (`SITE_URL` flipped this phase). Owner: **Lazar**. | 2.04 / 2.04b / 2.05 | **after 2.05 deploy (real domain)** |
| 12 | **Lighthouse categories that could not reach 95 in-phase** (measured on `next start` + local seed DB, headless Chrome). **(a)** Mobile **Performance 94** on Catalog + Checkout (throttled-mobile SSR with a DB read; Desktop is 100, mobile Home/Product/Legal are 98/97/95). **(b)** Content-route **SEO 92 on localhost is a cross-origin `canonical` artifact** — Code verified **SEO 100 with the canonical audit passing on the real origin `https://trajanov-v2.vercel.app/en`**, so this should read 100 once 2.04 deploys; **(c)** Checkout **SEO 58** is the intentional `noindex` correctly failing the crawlable audit (not a defect). Lazar re-checks (a) + (b) on **PageSpeed Insights** against the live **`www.trajanovv.com`** deploy (2.05). Owner: **Lazar**. | 2.04 | **after 2.05 deploy (PageSpeed Insights, real domain)** |
| 13 | **Wordmark brand-direction sign-off** (`D-2.04b-1`). Code shipped a real typographic wordmark ("Trajanov" in Rubik 700 + brand colours) as `public/logo.svg` / `public/logo-512.png` and wired it into the Organization JSON-LD `logo`, **outside a Design phase**. It invents nothing (the brand's own name in the brand font) and is `D-0-6`-clean, but the *visual-brand call* is Lazar's/Design's. If a properly designed mark is wanted instead, regenerate via `npm run assets:brand` after editing `scripts/generate-brand-assets.ts` (or drop in a hand-made asset at the same paths) — one commit. Owner: **Lazar / Design**. | 2.04b | **2.05 shipped with the wordmark live — sign off anytime, before the first real drop** |
| 14 | **Register the IndexNow key in Bing Webmaster Tools** (`D-2.04b-6`). Key `78dec4b97e3fbb0f22d1c8df38050f74`, served at `${SITE_URL}/78dec4b97e3fbb0f22d1c8df38050f74.txt`. **Public by design, NOT a secret (`D-0-1`).** Ops-only, and only meaningful **after the real domain is live** (2.05) — the key file must resolve on the final host before Bing accepts it, and `pingIndexNow()` stays un-wired until a post-2.05 hook. **Now actionable — the domain is live and `SITE_URL` is flipped (2.05); the key file resolves on `https://www.trajanovv.com`.** Owner: **Lazar (ops)**. | 2.04b | **post-2.05 (domain live — now actionable)** |
| 15 | **Live Turnstile captcha renders + solves on the real-domain checkout.** The site key rotated to `0x4AAAAAAD6pSIvEa1p8GkZX` (new Managed widget, hostnames `trajanovv.com` + `www`, `D-2.05-4`); the server-side `verifyTurnstile` **does not assert hostname** (it checks `success` only), so no code gate depends on the host. But a real browser render + solve on `https://www.trajanovv.com/checkout` needs an **open drop** — deferred to the 2.06 rehearsal. **2.06 Code (2026-07-22): the runbook is ready** — `docs/ops/drop-rehearsal-runbook.md` step 2b (open drop via `docs/ops/rehearsal-sql/01-open-rehearsal-drop.sql`, solve the real Turnstile on `/naracka`, place one order). Still owed until Lazar + Vladimir run it. Owner: **Lazar / 2.06 rehearsal**. | 2.05 | **2.06 rehearsal (runbook ready; operator runs it)** |
| 16 | **A real order email delivers from `info@trajanovv.com` end to end.** `ORDER_FROM_ADDRESS` is now `info@trajanovv.com` and the domain is Resend-verified (`D-2.05-3`); unit tests (mocked Resend) assert the new from-address. That a live order's notification actually **arrives** in Vladimir's inbox `from: info@trajanovv.com` needs a real order → the 2.06 rehearsal. **2.06 Code (2026-07-22): the runbook is ready** — `docs/ops/drop-rehearsal-runbook.md` step 2d (confirm the email in Vladimir's inbox: subject "Нова нарачка TRJ-0001 — Trajanov", ordered line, customer block, COD copy) + step 0 pre-flight (test that `info@` routes to his inbox). Still owed until the operator runs it. Owner: **Lazar / 2.06 rehearsal**. | 2.05 | **2.06 rehearsal (runbook ready; operator runs it)** |
| 17 | **Footer redesign — Lazar design sign-off (2.07). NARROWED by 2.24 — still OPEN.** The footer was rebuilt to the two-zone design (contact/social columns + © row) **outside a Design phase**. Code verified structure, contrast (every pair passes WCAG 2.2 AA), tap targets (≥24px), MK+EN strings, and mobile stacking — but the **visual-brand call on the redesign itself** is Lazar's/Design's and is the half that stays open. Eyeball the `https://www.trajanovv.com` footer (any page), **MK + EN, 375px + desktop**. ~~*Second half — the `@`-mark standing in for Instagram (`D-2.07-2`) — **RESOLVED by Phase 2.24** (2026-07-28): Lazar instructed a real Instagram logo, a local outline glyph now ships on both social rows (`D-2.24-1`, superseding `D-2.07-2`). That the new mark reads correctly on a real screen is a fresh eyeball, tracked separately as row **#58** — do not re-open it here.*~~ Owner: **Lazar / Design**. | 2.07 | **after 2.07 deploy — sign off anytime before the first real drop** |
| 18 | **New MK footer strings — native review (2.07).** Three MK strings post-date the 2.02 native review and ship exactly as the 1.05 brief proposed them: `Footer.contact` „КОНТАКТ", `Footer.social` „СЛЕДИ", `Footer.rights` „© 2026 Трајанов. Сите права задржани." A native speaker (Lazar/Petar) confirms spelling / agreement / tone — same process as `docs/i18n/mk-review-2.03.md`. Owner: **Lazar / Petar**. | 2.07 | **before the first real drop (MK review pass)** |
| 19 | **New MK `Credit` strings — native review (2.08).** Two strings post-date the 2.02/2.03 reviews and render on **every** page: `Credit.builtBy` „Изработено од Vertex Consulting" (rich-text; only the company name is linked, and it stays untranslated) and `Credit.opensInNewTab` „се отвора во нов прозорец" (the visually-hidden new-tab announcement). Two native speakers read both **in context, in the browser**, and sign the review pack — same process as `docs/i18n/mk-review-2.03.md`. Owner: **Lazar + Petar**. | 2.08 | **before the first real drop (MK review pass)** |
| 20 | **Click-test `https://www.vertexconsulting.mk/en`** (`facts.md` § 11, marked VERIFIED — **must be click-tested before it ships**). The credit link opens a **working** page in a **new tab** from the **live** header, on a **phone and on desktop**, in **both locales**. Same rule as the Instagram URL in `facts.md` § 6 — a link to a page that does not resolve is a **broken fact on every page of the site**. Code confirmed the anchor is correct (`target="_blank" rel="noopener noreferrer"`, hidden new-tab text, mustard link) but **cannot confirm the destination resolves**. Owner: **Lazar**. | 2.08 | **before the first real drop (live click-test, both platforms + locales)** |
| 21 | **Client sign-off on the header build credit (2.08).** Vladimir (and his parents) confirm they are content for a **third-party company name + outbound link** (Vertex Consulting → an off-site page) to sit in the **top nav of the store on every page** — client-facing and prominent (`D-2.08-2`). Easy to move to the footer later if they'd rather: one component edit. Owner: **Lazar → Vladimir**. | 2.08 | **before the first real drop (client confirms placement)** |
| ~~22~~ | **Production size order (2.09) — CLEARED 2026-07-23 (post-merge, PR #21 `927381c`).** On `https://www.trajanovv.com`, both locales, all three product pages verified: `/katalog/test-mustard-ochre` + `/en/catalog/test-mustard-ochre` → **S M L XL**; `/katalog/test-baby-blue` + `/en/catalog/test-baby-blue` → **S M L XL**; `/katalog/test-off-white` + `/en/catalog/test-off-white` → **XL**. Conclusive because the pre-fix `localeCompare` rule can only emit `L · M · S · XL`, so `S M L XL` live proves the new comparator is deployed. | 2.09 | **CLEARED — production verified (both locales)** |
| 23 | **Glow sign-off (2.10).** Eyeball the live glow on `https://www.trajanovv.com/katalog` and `/en/catalog` on a desktop mouse (the white spotlight should follow the cursor and read as a quiet wash, not a halo; sold-out cards must not glow), and confirm on a **phone** that nothing sticks or flickers (touch devices should get nothing — the effect is gated to fine pointers). The intensity is three token values (`--glow-size`, `--glow-opacity-surface`, `--glow-opacity-edge`, mirrored in `brand.md` §5 + `globals.css`) — dial it up or down in one commit. **Hard stop already respected:** `--glow-opacity-surface` ships at `0.05`; anything above `0.10` is an owner call, not Code's. Code verified the effect end-to-end in-browser (hover + keyboard-focus reveal, pointer tracking, no shift, no overflow, both locales) but only a human on a real desktop mouse + a real phone confirms the *feel* and the touch-device no-op. Owner: **Lazar**. | 2.10 | **before the first real drop (live eyeball, desktop mouse + phone)** |
| 24 | **Native MK review of the 22 new FAQ strings (2.11).** The `Faq` namespace (6 labels + 8 questions + 8 answers) post-dates every prior MK review and renders on the front door. Two native speakers (Lazar + Petar) read all 22 in context and sign `docs/i18n/mk-review-2.11.md` — same process as `mk-review-2.03.md`; the two „сè уште не се потврдени/објавени" sentences (`a5`/`a7`) are deliberately unfinished and must not be polished. Code ran the humanizer over the EN and machine-checked parity, but a machine wrote the MK. Owner: **Lazar + Petar**. | 2.11 | **before the first real drop (both sign-off boxes filled)** |
| 25 | **The FAQ on a real phone, from an Instagram link (2.11).** Open `https://www.trajanovv.com` on a phone (both locales): rows tap open/closed, text readable, animation smooth, and **nothing overlaps or shifts the hero/countdown**. Code verified structure + no-overflow + 56px tap target + the open/close animation at 390px in the pane, but only a human on a real device confirms the feel and that the hero is undisturbed. Owner: **Lazar**. | 2.11 | **after 2.11 deploys — before the first real drop** |
| 26 | **Sign-off that eight questions is the right amount for the front door (2.11).** Lazar looks at the rendered Home FAQ and either says yes, or names what to add — the five deliberately-omitted answers (returns window, fabric/care, courier name, delivery cost, exact size measurements) do not exist in `facts.md` yet and their additions come from **Y.01** content, not from Code inventing them. Owner: **Lazar → Vladimir (content)**. | 2.11 | **before the first real drop (content sign-off)** |
| 27 | **Native MK review of the new Home hero sub-line (2.12).** `Home.sub` is now the brand line „Пронајди сродна, во свет продадени души." — **operator-authored and shipped byte-exact** (`D-2.12-2`), so this is its **first** native read. Unlike every other MK string on the site, it is **deliberately not a word-for-word translation** of the English and is deliberately shorter (the noun after „сродна" is elided). Two native speakers (Lazar + Petar) read it **in place on the Home hero** (countdown + ended states, phone + desktop) and answer the one question in `docs/i18n/mk-review-2.12.md`: **does it read as correct, finished Macedonian, or as a fragment?** — then sign or return a correction. Owner: **Lazar + Petar**. | 2.12 | **before the first real drop (both sign-off boxes filled)** |
| 28 | **Header layout sign-off (2.13).** The header nav was moved onto the true page centreline via a three-column grid, **outside a Design phase**. Code measured it end-to-end (no horizontal overflow at 320/390/768/1024/1280, both locales; nav centre at offset 0px everywhere; active-link underline + `aria-current` intact both locales) but the **visual-brand call** — does the centred nav read right, and is the large intentional gap between the nav and the MK·EN/cart cluster on wide screens (inherent to true centring, `D-2.13-1`) acceptable — is Lazar's. View `https://www.trajanovv.com/` **and** `/en` on a **desktop browser and a phone** after the merge deploys and confirm the nav position reads right. Note the deliberate MK-at-1024 behaviour: the credit wraps under the wordmark while the nav stays centred (`D-2.13-3`, `lg` kept not raised to `xl`) — if the two-line MK block at 1024–~1150 is unwanted, raising the switch to `xl` is a one-line change. Owner: **Lazar**. | 2.13 | **after 2.13 deploys — before the first real drop (desktop + phone, both locales)** |
| 29 | **Burger menu sign-off on the live deploy, on a real phone, both locales (2.14).** Open `https://www.trajanovv.com` on a phone. Tap the burger; tap each of the three links; use the back button; switch to EN and repeat. Pass = the header is one line with the menu closed; the menu opens and closes cleanly; every link goes to the right page and the menu is **closed on arrival**; nothing overflows sideways; and the MK label **„Мени"** reads correctly to a native speaker (it is a **new MK string, not covered by the 2.03 review stamp**). Code measured this end-to-end in the pane (burger + cart both ≥ 44×44, no overflow closed/open at 320/390, focus → first link on open, Escape → button, link-tap closes on arrival, active filled `bg-surface` row at 390 + 2px mustard underline at 1280 — both locales) — but the real-device feel + the native-MK read are Lazar's. Owner: **Lazar** (+ **Petar** for the MK label). | 2.14 | **after 2.14 deploys — before the first real drop (real phone, both locales)** |
| 30 | **Full-screen menu sign-off on the live deploy, on a real phone, both locales (2.15).** Open `https://www.trajanovv.com` on a phone. Tap the burger; confirm the menu takes the **whole screen**; tap each row (Catalog, About, Contact, Cart); use the **X** and the **back button**; switch to EN and repeat. Pass = the closed header is **wordmark + burger only**; the menu is a full-screen **opaque** panel matching the reference (wordmark + X top bar, left-aligned links with a **left** accent on the active one, divider, centred MK·EN, centred credit); every row navigates correctly and closes the menu; nothing overflows sideways; and the MK **„Затвори"** label reads correctly to a native speaker (a **new MK string, not covered by the 2.03 review stamp**). Code measured this end-to-end in the pane (both locales, 320/390/768/1024/1280): closed = wordmark + burger only, no overflow; open = fixed opaque `bg-ground` dialog covering the viewport, correct order, `text-h2` rows with no wrap/overflow; focus → X on open, Escape/X → burger, focus trap wraps, link/cart taps navigate + close on arrival, active left 2px mustard accent; desktop unchanged (burger `display:none`, nav offset 0px, one centreline); resize-to-desktop closes + releases the scroll lock — but the real-device feel + the native-MK read are Lazar's/Petar's. Owner: **Lazar** (+ **Petar** for the MK label). | 2.15 | **after 2.15 deploys — before the first real drop (real phone, both locales)** |
| 31 | **Hero reveal sign-off on the live deploy, on a real phone, both locales (2.16).** Open `https://www.trajanovv.com` and `/en` on a phone after the deploy. Pass = **the countdown arrives first and reads immediately; the sequence feels quick, not staged; nothing jumps or reflows as it settles.** Also confirm the **reduced-motion** behaviour on a device with "Reduce Motion" enabled (iOS Settings → Accessibility → Motion; Android → Remove animations): the hero should appear **fully visible on the first frame with no fade** — Code verified the served CSS rule + the `animation: none` outcome (opacity 1 / transform none / filter none on frame 1 for all six children) but the in-app Browser pane could not toggle the DevTools reduced-motion emulation, so the live device read is owed. Code measured the reveal end-to-end in the pane (both locales, 390 + 1280, all three drop states via `?preview=`): delays 0/70/140/210/280/350ms, last ends at 830ms; live banner + heading paint solid, only cards cascade; ended About-link last; **settled rects identical to `main` to the pixel** (`settledEqualsBase: true`), no overflow/shift at 390 & 1280; countdown digits still tabular; both links keyboard-focusable with the focus ring; zero new console errors — but the real-device *feel* + the live reduced-motion read are Lazar's/Petar's. Owner: **Lazar** (+ **Petar**). | 2.16 | **after 2.16 deploys — before the first real drop (real phone, both locales)** |
| 32 | **Scroll-reactive header sign-off on a real phone, both locales (2.17).** Open `https://www.trajanovv.com` and `/en` on a phone after the deploy; scroll the Home page down past the FAQ and back up. Pass = the bar **contracts smoothly into the rounded translucent pill and stays readable over content**, and it does **not** feel like it is eating the screen (`D-2.17-4` — a permanently sticky ~60px bar on a 390px viewport; if it does feel too heavy, the fix is one `lg:`-gating media query). Three things fold into this row: (a) the real-device **feel** of the sticky pill at every width; (b) confirm the **+2px resting-height delta is imperceptible** — the resting header is 2px taller than the pre-2.17 geometry because `.header-bar` carries a transparent 1px border in both states (`D-2.17-7`, operator-accepted, ship-verbatim); (c) the **reduced-motion** read — with "Reduce Motion" enabled (iOS Settings → Accessibility → Motion; Android → Remove animations) the header should **snap** between states with no ease (the global `prefers-reduced-motion` rule flattens the transition; Code confirmed no second rule was added and the global rule exists, but the in-app Browser pane could not toggle the DevTools reduced-motion emulation, so the live read is owed). Code measured the header end-to-end in the pane (both locales, 320/390/768/1024/1280, all four routes Home/Catalog/Product/Checkout): at `scrollY 0` sticky `top:0` `z-30`, opaque ground, square, `max-w-6xl`, nav centre offset 0px, `filter/backdrop-filter/transform none`; past the threshold `data-scrolled="true"`, bar `max-width 896px`, `border-radius 14px`, `margin-top 8px`, translucent `background 82%`, `backdrop-filter blur(12px)`, `<header>` bg + bottom border transparent; scroll-back fully resets; no horizontal overflow in either state at any width; 2.15 overlay still fixed inset-0 opaque full-viewport with scroll lock + focus-on-X while scrolled; contrast worst-case (pill over the mustard live banner) 5.68:1 nav / 11.16:1 wordmark — but the real-device *feel*, the +2px read, and the live reduced-motion read are Lazar's/Petar's. Owner: **Lazar** (+ **Petar**). | 2.17 | **after 2.17 deploys — before the first real drop (real phone, both locales)** |
| 33 | **Safari / iOS `backdrop-filter` blur check (2.17).** On the same phone, in **Safari** (not just Chrome), scroll the Home page down. Pass = the scrolled bar is **genuinely blurred**, not merely translucent — the content behind it goes soft. Code confirmed the served CSS pill rule carries **both** `-webkit-backdrop-filter: blur(var(--header-blur))` and `backdrop-filter: blur(var(--header-blur))` (verified against the raw served CSS bytes), but the in-app Browser pane is Chromium, so **no WebKit engine was available** to confirm the blur actually renders on iOS Safari. Owner: **Lazar**. | 2.17 | **after 2.17 deploys — before the first real drop (iOS Safari)** |
| 34 | **Lighthouse mobile Performance re-run on Home + Catalog (2.17).** After the deploy, run PageSpeed Insights (mobile) on `https://www.trajanovv.com/` and `/en/catalog` and record the Performance number; compare to the pre-2.17 baseline (mobile **94** on Catalog + Checkout, per 2.04). `backdrop-filter` on a sticky element repaints on scroll and is the one realistic way this phase could cost points — though the blur is on the small ~896px pill only, active only while scrolled, so the risk is low. Code could **not** produce a comparable number locally: a dev/localhost Lighthouse is not comparable to the production PageSpeed baseline (no CDN, different throttling), and the meaningful measurement is on the deployed build — the same "re-check on PageSpeed after deploy" pattern 2.04 used for the 94 mobile scores. **If it drops below 94, report it — do not absorb it silently** (`D-2.17-4`'s media-query fallback also removes the mobile blur if needed). Owner: **Lazar / Petar**. | 2.17 | **after 2.17 deploys — before the first real drop** |
| 35 | **Retimed header + hero sign-off on the live deploy, both locales (2.18).** On `https://www.trajanovv.com` and `/en`, desktop and phone, scroll Home down and back up. Pass = **the bar settles rather than snaps** (now `--motion-slow` 420ms on the symmetric `--ease-smooth`, `D-2.18-1/2`); **the "Built by Vertex Consulting" credit fades cleanly out of the pill with nothing else shifting** (`D-2.18-3/4` — desktop `lg:` only; on a phone the credit already lives in the burger overlay, untouched); and **the Home hero reads as deliberate rather than hurried** (`--motion-reveal` 760ms, stagger 110ms). Three things fold into this row: **(a) confirm or strike `D-2.18-5` — the hero retime was folded in without an explicit yes** (it is one token pair, isolated in Task 5, trivially revertible); (b) the **live reduced-motion read** — with "Reduce Motion" on, the header should snap and the hero render final-state on frame 1 (Code confirmed no new reduced-motion rule and the global rule covers, but the in-app Browser pane can't toggle the DevTools emulation); (c) a **post-deploy PageSpeed (mobile) re-run** on `/` + `/en/catalog` vs the pre-2.17 baseline (**94**) — a longer transition should not cost anything, report it if it does. Code measured the header + hero end-to-end in the pane (both locales, 320/390/768/1024/1280, Home/Catalog/Checkout): at `scrollY 0` credit `position: static`/visible, bar `max-width 1152px`, transitions `0.42s` on `cubic-bezier(0.65,0,0.35,1)`; scrolled bar `max-width 768px` (48rem), credit `absolute`/`opacity 0`/`visibility hidden`/`pointer-events none`, `<header>` `filter/transform none`; nav centred (offset ≤ 0.01px), no wrap/overflow, 48rem pill fits MK + EN at 1024 + 1280; Vertex link unreachable scrolled / reachable at top; ended hero 1.09s, countdown 1.31s, both < 1.5s; mobile overlay + its own credit unaffected while scrolled — but the real-device *feel*, the `D-2.18-5` call, the live reduced-motion read, and the PageSpeed number are Lazar's/Petar's. Owner: **Lazar** (+ **Petar**). | 2.18 | **after 2.18 deploys — before the first real drop (real phone, both locales)** |
| 36 | **Wordmark hover shine sign-off on the live deploy (2.19).** On `https://www.trajanovv.com` and `/en`, **on a desktop with a mouse** and **on a real phone**. Desktop pass = hovering the TRAJANOV wordmark in the top-left runs **one** band of light across the letters (~0.9s) and then **stops** — no shimmer, no loop, nothing moving when the pointer is elsewhere; it works both at the top of the page and inside the scrolled pill; tabbing onto the wordmark does the same **and** still shows the mustard focus ring. Three things folded into this row; **(a) is now CLOSED.** **(a) `D-2.19-6` — RATIFIED 2026-07-25 as `D-2.20-3` (Phase 2.20). The easing stays `linear`. Nothing is owed on it; the original wording is kept below for the record only.** ~~ratify or strike `D-2.19-6`~~ — the brief specified `var(--ease-out)` and Code shipped **`linear`** instead, because measurement showed `--ease-out` puts the band past the right edge of the glyphs by t=225ms of the 900ms, making the visible sweep a ~150ms flick followed by ~710ms of invisible drift; `linear` gives 200ms in, ~500ms across the letters, 200ms out. It is a **one-word revert** (`linear` → `var(--ease-out)` in the `.wordmark-shine` block) if Lazar prefers the brief's version. **(b) The touch-device read** — on a phone, tap the wordmark and confirm **nothing shines and no hover state sticks** afterwards; the effect is gated on `@media (hover: hover) and (pointer: fine)`, and Code verified that guard in the served CSS + CSSOM, but the in-app Browser pane reports a fine pointer at **every** viewport width and has no coarse-pointer emulation, so the inertness was never actually observed. **(c) The live reduced-motion read** — with "Reduce Motion" enabled (iOS Settings → Accessibility → Motion; Android → Remove animations), hovering/focusing the wordmark should produce **no sweep, no flash, no single-frame flicker** — just a plain off-white wordmark; Code proved this by CSSOM (exactly one dedicated `.wordmark-shine` reduced-motion rule, ordered after the hover rules, setting `animation: none` + `background-image: none` + `-webkit-text-fill-color: currentColor`) and by injecting those exact declarations as a simulation (hovered wordmark → **zero** animations, plain `--color-foreground`), but the pane cannot toggle the real DevTools emulation. Code measured the rest end-to-end in the pane (both locales, 320/390/768/1024/1280, Home/Catalog/Checkout): resting wordmark byte-identical to pre-2.19 (`color rgb(236,232,224)`, no background-image, no animation); one sweep per hover that finishes and does not restart; `getBoundingClientRect()` **identical** at rest / every mid-sweep frame / after (`89,23,135.039,24`), nav centre 640 and credit X 236.039 unchanged throughout; `<header>` still `transform/filter/backdrop-filter: none`; sweep visible in the scrolled pill; keyboard focus fires the sweep **and** renders the `#F2C55A` ring; contrast 15.42:1 rest / 10.84:1 at the band centre on ground, 11.16:1 / 7.84:1 over the pill on the mustard banner; overlay wordmark unanimated; no horizontal overflow; zero new console errors — but the real-device *feel*, the touch read, and the live reduced-motion read are Lazar's/Petar's (**the `D-2.19-6` call is CLOSED — ratified as `D-2.20-3`**). **Note:** 2.20 recoloured the band from mustard to white, so the live read of this row happens against the **2.20** effect — see row **#37**, which supersedes the colour-dependent parts of this one. Owner: **Lazar** (+ **Petar**). | 2.19 | **after 2.19 deploys — before the first real drop (real phone + a desktop mouse, both locales)** |
| 37 | **White wordmark-shine sign-off on the live deploy (2.20).** On `https://www.trajanovv.com` and `/en`, **on a desktop with a mouse** and **on a real phone**, at the top of the page and inside the scrolled pill. Desktop pass = hovering (or tabbing onto) the TRAJANOV wordmark runs **one** band of **white** light across the letters (~0.9s) and stops — and the letters get **brighter** as it passes, never yellower and never darker. This row supersedes the colour-dependent parts of **#36**. Four things fold into it. **(a) Does the white glint still read?** `D-2.20-2` keeps the trough at `--color-foreground`, so the visible step is only 15.42:1 → 18.85:1 — **deliberately subtler than 2.19's mustard version**. If it now reads as *too* subtle, that is an operator call about band width or duration, **not** something Code should tune (2.20 hard stop #1); say so and it gets its own phase. **(b) The OLED bloom read** — `D-2.20-1`'s accepted downside is that pure white on a near-black ground can bloom on an OLED phone, which is most of audience 1. Look at the wordmark on a real OLED handset and confirm the band does not halo or smear. **(c) The touch-device read** (carried over from #36, still unobserved) — on a phone, tap the wordmark and confirm **nothing shines and no hover state sticks**; the `@media (hover: hover) and (pointer: fine)` guard is byte-unchanged from 2.19 and was verified in the served CSS + CSSOM, but the in-app Browser pane reports a fine pointer at **every** viewport width and has no coarse-pointer emulation. **(d) The live reduced-motion read** (carried over from #36) — with "Reduce Motion" enabled (iOS Settings → Accessibility → Motion; Android → Remove animations), hovering/focusing the wordmark should produce **no sweep, no flash, no single-frame flicker**, just a plain off-white wordmark; Code proved this by CSSOM (**exactly two** `.wordmark-shine` rules, the `prefers-reduced-motion` one ordered second so it wins on source order, setting `animation: none` + `background-image: none` + `-webkit-text-fill-color: currentColor`) and by injecting those exact declarations as a simulation (focused wordmark → **zero** animations, plain `rgb(236,232,224)`), but the pane cannot toggle the real DevTools emulation. Code measured the rest end-to-end in the pane against the served CSS bytes (both locales, 320/390/768/1024/1280, Home/Catalog/Checkout): band centre computes **`rgb(255,255,255)`** = **18.85:1** on ground vs the resting **15.42:1** (2.19 was 10.84:1 — it darkened), and **13.64:1** vs a resting **11.16:1** over the pill on the mustard live banner (2.19 was 7.84:1); frame table, duration 0.9s, `linear`, iteration-count 1 all identical to 2.19; `getBoundingClientRect()` **identical** at rest / every seeked frame / after (`89,23,135.039,24`; scrolled `281,31,135.039,24`); `<header>` still `transform/filter/backdrop-filter: none`; keyboard focus fires the sweep **and** renders the `#F2C55A` ring; sweep visible in the scrolled pill; overlay wordmarks unanimated and plain; no horizontal overflow; zero new console errors — but the real-device *feel*, the subtlety call, the OLED read, the touch read and the live reduced-motion read are Lazar's/Petar's. Owner: **Lazar** (+ **Petar**). | 2.20 | **after 2.20 deploys — before the first real drop (real phone + a desktop mouse, both locales)** |
| 38 | **Photographs render correctly on a real phone, on the live domain (Y.03).** Both interim frames are 2:3 sources cropped into a `4/5` slot via `object-cover` + `object-position` (mustard `center 60%`, off-white `center 65%`), tuned in the in-app Browser pane at 390px and 1280px — **not on real hardware**. Walk `https://www.trajanovv.com/katalog` and `/en/catalog` on an actual phone, and open both product pages. **Pass:** both shirts visible and in frame, **no stretched, beheaded, or garment-cropped-out card**. If a crop is wrong it is a one-line `objectPosition` change in `src/lib/product-images.ts` — no layout work. Owner: **Lazar**. | Y.03 | **after the Y.03 deploy — before the first real drop** |
| 39 | **Lighthouse mobile Performance on Catalog has not regressed (Y.03).** This phase put the **first images on the site** (`next/image`, two WebP files, 209 KB + 154 KB). Pre-phase mobile Performance on Catalog was **94** (2.04 — already an owed re-check). Re-run **PageSpeed Insights** against live `https://www.trajanovv.com/katalog`. **Pass: not below 94.** `priority` is deliberately off and `sizes` is set for the grid (`(min-width: 1024px) 280px, 50vw`), and the pane confirmed the browser picks the **640px** candidate at 390px rather than the 3840px one — so LCP should be unaffected. That is a prediction from the served srcset, **not a Lighthouse measurement**. Owner: **Lazar**. | Y.03 | **after the Y.03 deploy — before the first real drop** |
| 40 | **MK alt-text review signed (Y.03).** Two new MK strings — `Product.photoAltOchre` „Окер маица со црвен принт, носена." and `Product.photoAltOffWhite` „Крем-бела маица со црвен принт, носена." — ship **unreviewed** by a native speaker. Pack committed **unsigned** at `docs/i18n/mk-review-y03.md` (same process as 2.02/2.03/2.11). Two things to confirm beyond spelling: the **colour words match the actual shirts** („Крем-бела" is the one most worth a second opinion — a wrong colour on cash-on-delivery is a wrong promise made at the door), and the alt text **names and describes nobody** in frame. Owner: **Lazar + Petar**. | Y.03 | **before the first real drop (MK review pass)** |
| 41 | **Home hero on a real phone, on the live domain (Y.04).** Open `https://www.trajanovv.com` on an actual handset after the deploy, both locales. **Pass:** the mustard frame fills the width edge to edge, the **countdown is clearly the largest thing on the page**, and both buttons are thumb-reachable. The crop was tuned in the in-app Browser pane at 390px (`objectPosition` `center 60%`), **not on real hardware** — if the garment crops wrong it is a one-line `objectPosition` change in `HomeExperience.tsx`. Owner: **Lazar**. | Y.04 | **after the Y.04 deploy — before the first real drop** |
| 42 | **Lighthouse mobile Performance on `/` on production ≥ 94 (Y.04).** This phase put the **first photograph on the front door** with `priority` ON (it is the LCP element). Local production-build measurement: **98** (LCP 2.5s, TBT 50ms, CLS 0) — but the number that matters is **PageSpeed Insights against live `https://www.trajanovv.com/`** after the deploy. **Pass: ≥ 94.** If it drops below, the brief's own rule applies: fix it, do not absorb it. Owner: **Lazar / Petar**. | Y.04 | **after the Y.04 deploy — before the first real drop** |
| 43 | **MK review of the two new CTA strings signed (Y.04).** `Home.ctaCatalog` „Каталог" and `Home.ctaContact` „Контакт" ship unreviewed (they mirror the 2.02-reviewed `Nav` labels, but they are **new keys** post-dating every review). Pack committed **unsigned** at `docs/i18n/mk-review-y04.md`. Owner: **Lazar + Petar**. | Y.04 | **before the first real drop (MK review pass)** |
| 44 | **Full-bleed hero on a real phone, on the live domain (Y.05).** Open `https://www.trajanovv.com` and `/en` on an actual handset, portrait **and** landscape. **Pass:** the photo fills the width, the tagline and both buttons read clearly over it, nothing overlaps, both buttons are easy to hit with a thumb. The crops and the scrim were tuned in the in-app Browser pane (390px/1280px + a measured contrast matrix), **not on real hardware**. Owner: **Lazar**. | Y.05 | **after the Y.05 deploy — before the first real drop** |
| 45 | **PageSpeed Insights mobile on production `/` ≥ 94 (Y.05).** The brief's local gate could not be met **or refuted** locally: branch measured **92/92/91** vs `main`'s own **91/91** on the same machine/harness (LH 13.4.1, `next start`, ended-state DB) — the phase costs 0–1 pt locally and Y.04's recorded 98 is not reproducible in this environment even for `main` (both builds report the header wordmark, not the hero, as the LCP element under current LCP heuristics). The binding number is PSI against live `https://www.trajanovv.com/`. **Pass: ≥ 94. If it lands below, that is a real finding — fix, do not absorb** (and note the pre-Y.05 PSI baseline #42 was also still owed, so run both before/after comparisons from PSI history). Owner: **Lazar / Petar**. | Y.05 | **after the Y.05 deploy — before the first real drop** |
| 46 | **MK review of the composite alt string signed (Y.05).** `Product.photoAltComposite` „Окер и крем-бели маици со црвен принт, носени." ships unreviewed. Pack committed **unsigned** at `docs/i18n/mk-review-y05.md`. Beyond spelling: the **colour words must match the shirts in the composite**, and the string must **name and describe nobody** in frame. Owner: **Lazar + Petar**. | Y.05 | **before the first real drop (MK review pass)** |
| 47 | **Brand-direction sign-off on the burned-in serif wordmark (Y.05).** The composite carries a **serif** TRAJANOV inside the photograph; the site header carries the **Rubik 700** wordmark (2.04b) with the 2.20 white shine. **Two wordmarks in two typefaces now appear on the same first screen** from `640px` up. Lazar confirms he wants that — or supplies a composite without the burned-in text (one-file swap, same filename, one commit). Owner: **Lazar**. | Y.05 | **after the Y.05 deploy — before the first real drop** |
| 48 | **Native MK review of the seven new `Showcase` strings (2.21).** All seven are short control labels (`regionLabel`/`prev`/`next`/`pause`/`play`/`slideLabel`/`view`); pack committed **unsigned** at `docs/i18n/mk-review-2.21.md`. Lazar + Petar read them **in context on the live site** (most are `aria-label`s — devtools or VoiceOver) and sign both boxes. Check specifically: the word **„парче/парчиња"** for the garment (incl. the definite form in „Види го парчето"), and the imperative forms **„Паузирај" / „Пушти"** on the play/pause control. Owner: **Lazar + Petar**. | 2.21 | **before the first real drop (both sign-off boxes filled)** |
| 49 | **The showcase on a real phone, from an Instagram link, both locales (2.21).** Open `https://www.trajanovv.com` and `/en` on a phone after the deploy. Swipe the section left and right; press the pause button; scroll past it and back. **Pass:** swipe changes the slide, the pause button is reachable and obvious, nothing overlaps or shifts the hero or the FAQ, and the page still scrolls vertically without fighting the carousel. The swipe/pause/reduced-motion behaviours were verified via synthetic events in the headless pane (`D-2.21-7`), **not on real hardware** — this row is the real-device read. Owner: **Lazar**. | 2.21 | **after the 2.21 deploy — before the first real drop** |
| 50 | **Sign-off that the front door still leads with the hero (2.21).** Lazar looks at the deployed home page and answers two things: (a) does the showcase sit **under** the hero rather than competing with it, and (b) is the neutral slot name („Производ 01" / "Product 01") acceptable on the front door until Y.01 fills in real names. **Pass: a yes, or a named change.** Owner: **Lazar**. | 2.21 | **after the 2.21 deploy — before the first real drop** |
| 51 | **The three chromeless controls on a real phone, `https://www.trajanovv.com` (2.22).** The boxes around prev / next / pause are gone; the buttons keep their full 48×48 hit area (the padding is the tap target) but draw only the glyph. On an actual handset, both locales: tap each of the three several times. **Pass: each is easy to hit first time with a thumb despite having no visible box; nothing looks mis-aligned under the photograph.** The 48×48 rects, the 320px edge fit (hit area starts 4px from the viewport edge, `D-2.22-4`) and all behaviours were measured in the headless pane (`D-2.22-5`), **not on real hardware** — this row is the real-device read. Owner: **Lazar**. | 2.22 | **after the 2.22 deploy — before the first real drop** |
| 52 | **Lazar's look sign-off on the chromeless row (2.22).** The change is his ask — the bordered boxes read as form furniture next to the full-bleed photograph. He looks at the deployed row (390-ish phone + desktop, both locales, countdown + ended): icons rest muted and light up on hover/focus (`D-2.22-2`), first glyph on the column edge (`D-2.22-4`), progress bar unchanged. **Pass: he confirms this is the "cleaner" he asked for, or names what to change.** Owner: **Lazar**. | 2.22 | **after the 2.22 deploy — before the first real drop** |
| 53 | **A real contact message delivers end to end on production (2.23).** Send one from `https://www.trajanovv.com/kontakt`. **Pass: it lands in Vladimir's inbox, from `info@trajanovv.com`, subject prefixed „[Контакт]", and pressing Reply addresses the sender's own email.** Code proved every branch with Resend **mocked** and the live failure state against the locally-unconfigured sender — a real delivery needs the production keys, which exist only in Vercel. Owner: **Lazar**. | 2.23 | **after the 2.23 deploy — before the first real drop** |
| 54 | **Turnstile renders and solves on the real-domain Contact page (2.23).** Load `https://www.trajanovv.com/kontakt`, submit a message. **Pass: the widget appears/resolves and a submit without it is refused.** Locally the documented dummy pass key solved and a sabotaged widget was refused with the retry message (zero server calls) — the real-key render on the real hostname is the owed half, same shape as checkout's row #15. Owner: **Lazar**. | 2.23 | **after the 2.23 deploy — before the first real drop** |
| 55 | **The Contact page on a real phone (2.23).** Open `/kontakt` on an actual handset, both locales. **Pass: fields are tappable, the on-screen keyboard does not cover the submit button, nothing overflows, and every focusable control shows the ring on an external-keyboard Tab walk.** The pane proved geometry (44px+ targets, zero overflow 320–1280) and per-element `:focus-visible`, but not real hardware and not a real Tab traversal (`D-2.23-7`). Owner: **Lazar**. | 2.23 | **after the 2.23 deploy — before the first real drop** |
| 56 | **Native MK review of the 2.23 strings — 21 rows (2.23).** `docs/i18n/mk-review-2.23.md`, committed unsigned: 15 new `Contact` strings, 2 new + **2 rewritten** `Privacy` strings (the rewrites were previously stamped in the 2.03 pack — they carry legal weight), and both rewritten `Meta` descriptions. Check specifically: „контакт-форма(та)", the imperative „Испрати"/„Се испраќа…", and „Побарај нè директно" in UPPERCASE. Owner: **Lazar + Petar**. | 2.23 | **before the first real drop (both sign-off boxes filled)** |
| 57 | **Lazar's sign-off that a contact form is what he wants living on the site (2.23).** The form ships on the owner's reversal of Plan §4 (`D-2.23-1`) relayed through the brief — Lazar looks at the live page and confirms, or it is reverted before the first real drop. The accepted downside stands on the record: a second inbox that must actually be read. Owner: **Lazar**. | 2.23 | **after the 2.23 deploy — before the first real drop** |
| 58 | **The Instagram glyph on a real screen (2.24).** Lazar eyeballs the new mark on `https://www.trajanovv.com` after deploy — **both surfaces (the footer `СЛЕДИ`/FOLLOW column on any page, and the `/kontakt` + `/en/contact` right-hand rail), MK + EN, 375px + desktop**. **Pass: it reads as *Instagram* at its rendered size (16px in the footer, 20px in the rail), it sits right beside `Mail`/`Phone` as one icon set — same colour, same line weight, same optical size — and the row height has not moved.** What ships is a **recreated outline mark drawn to the house 24px grid, not Meta's official brand asset** (`D-2.24-1`, superseding `D-2.07-2`); Code measured geometry, colour and row height in the pane, but "does it read as Instagram" is an eyeball, not a measurement. Owner: **Lazar**. | 2.24 | **after the 2.24 deploy — before the first real drop** |
| 59 | **A real before/after on the Home reveal (2.25 `/animate`).** `filter: blur()` was removed from `@keyframes trajanov-reveal` because it forces an offscreen buffer per element per frame on a **1152×648 = 0.75 megapixel** photograph and on every live-drop product card at once. **No FPS delta was measured and none is claimed** — this project's verification pane is permanently hidden (`document.hidden === true`), so `requestAnimationFrame` never fires in it (`D-2.21-7`). Load `/` in the countdown or ended state on a **real mid-range Android**, before and after this branch. **Pass: the hero entrance is at least as smooth as it was, and no less** — the entrance still rises and fades on the same 760ms / `--ease-out` / 110ms stagger, it has simply stopped blurring. Owner: **Lazar**. | 2.25 | **after the 2.25 preview / deploy** |
| 60 | **The 44px targets and the wrapped cart row on a real phone (2.25 `/adapt`).** Code measured every box and hit area in the pane and proved the header is **pixel-identical** (bar 70px, boxes 24px, underline y=47 on both sides) with hit areas raised to 44px by an **invisible pseudo-element** — but a thumb is not `getBoundingClientRect()`. Walk `/`, `/katalog/<slug>`, `/kosnicka` **with 2 items**, `/naracka` and `/kontakt` at 320–390px, **MK and EN**. **Pass: every control is comfortably tappable one-handed; the cart's wrapped `× − 2 +` line does not mis-fire (the `×` is destructive and now sits beside the `−`); the header nav links and MK·EN are hittable without hitting each other (their hit areas are 0.6px apart).** Owner: **Lazar**. | 2.25 | **after the 2.25 preview / deploy** |
| 61 | **A real screen-reader pass on checkout + contact (2.25 `/harden`).** VoiceOver (iOS) or TalkBack. Submit `/naracka` and `/kontakt` **empty**. **Pass: the failure is announced, focus lands on the first invalid field, and the simultaneous per-field alerts are informative rather than a burst.** This is the one thing `D-2.25-5` explicitly gambled on — the alternative (a single form-level error-summary region) was rejected only because it needs a new MK+EN string, and it is written up in `Decisions.md` ready to take if the burst is worse than the silence it replaced. Owner: **Lazar** (or anyone with a real screen reader). | 2.25 | **before the first REAL drop** |
| 62 | **Lazar's call on the one-column product photo grid (2.25 `/adapt`, `D-2.25-10`).** Petar approved it with the cost in hand; Lazar has not seen it. `/katalog/test-mustard-ochre` at 320–390px. **Pass: he accepts that the photos are now 288×360 instead of 138×173 AND that the price sits ~560px further down — measured MK 567.4 → 1126.9, EN 547.9 → 1107.4 at 320px (`D-2.25-21`) — i.e. two screens of scroll to the buy path, the second screen being a hatched placeholder (register #2), until Y.01 lands real photography.** Reverses by deleting one `sm:`. Owner: **Lazar**. | 2.25 | **before the first REAL drop** |
| 63 | **`/styleguide` is a visible change nobody has signed off (2.25 P0 + P1).** P0 restored the countdown digits from an accidental **16px to 88px** (they had rendered at the body default since 1.04); P1 then made the demo card **scroll horizontally at ≤514px** rather than let the 306.4px row escape it by 9.2px a side. Dev-only page, but it is the design-system reference. `/styleguide` on desktop **and** at 320px. **Pass: the countdown reads as the loudest object on desktop, and a scrolling demo card at phone widths is acceptable for a dev-only page.** Owner: **Lazar**. | 2.25 | **before the first REAL drop** |
| 64 | **Native MK review of the two showcase section names (2.25 owner items).** `Showcase.headingLast` „Последно спуштање" + `Showcase.headingLive` „Ова спуштање" post-date every native review and render as the **visible h2 on the front door**. Review pack: `docs/i18n/mk-review-2.25.md` (**unsigned**; specifically: the indefinite „Последно" vs „Последното", and „Ова спуштање" standing alone as a heading). Two native speakers, in the browser, all three `?preview=` states. Owner: **Lazar + Petar**. | 2.25 | **before the first real drop (MK review pass)** |
| 65 | **The live-state front door on a real screen (2.25 owner items, `D-2.25-22…24`).** Petar instructed the change; nobody has *seen* it on a device: (a) `/?preview=live` — the hero photograph with the mustard LIVE banner riding on it, the buyable grid one scroll down, then the showcase named „Ова спуштање"; (b) `/?preview=countdown` + `/?preview=ended` — the showcase now carries a **visible** „Последно спуштање" heading; (c) phone + desktop, both locales. **Pass: the banner reads on the photo, the grid is comfortably reachable during the buy hour, and the duplicated products (cards above, slides below) read as intentional.** Also reread `D-2.25-22`'s countdown-label caveat the day a second drop is loaded. Owner: **Lazar**. | 2.25 | **before the first REAL drop (eyeball, phone + desktop)** |
| 66 | **Native MK review of the four strings Y.06 changed.** All four post-date every native review (`mk-review-2.02/2.03/2.11`) and three of them render on live pages: **`Product.quantityLimit`** „Ја достигна максималната количина за една нарачка." (inline, product page — only ever seen at 99 units, i.e. effectively never), **`Order.quantityInvalid`** „Провери ја количината во кошничката и обиди се повторно." (the `TR003` message at checkout), the **shortened `Terms.orderingBody2`** on `/uslovi` (first sentence removed; the rest is byte-identical and keeps its 2.02/2.03 review), and **`Faq.a3`** „Колку што има на залиха. Нема ограничување по нарачка — залихата е вистинска и ограничена, па кога ќе се распродаде, готово е." on the **home page and inside the FAQPage JSON-LD** (`D-Y.06-8`). **Pass: all four read as natural Macedonian in the site's ти-form register, and `Faq.a3` does not over-promise — it must not read as "buy as much as you like" when stock is 3–5 pieces.** Owner: **Lazar / Petar**. | Y.06 | **before the first real drop (MK review pass)** |
| 67 | **A real 3-unit order placed end to end on `https://www.trajanovv.com`.** Only provable against a **live drop** — the cap removal is proven locally (176 tests, two concurrency gates, and a real 3-unit order through the MK checkout form on localhost, TRJ-0055) but never once against hosted Supabase on the production domain. **Pass: one order of 3 units of a single variant is accepted, the confirmation names a real `TRJ-####`, `order_items` holds one row of quantity 3 (the row shape the old 1..2 CHECK forbade), stock decrements by exactly 3, and the notification email arrives.** **Also the first live test of the removed cap's downside** — watch whether one person takes the whole drop. Owner: **Lazar + Vladimir**, at the **2.06 rehearsal**. | Y.06 | **at the 2.06 rehearsal, before the first REAL drop** |
| 68 | **⚠ THE Y.06 MIGRATION IS NOT ON HOSTED — an ACTION, not a check. VERIFIED still outstanding 2026-08-27, after merge `7ad80f1`.** Read-only queries against hosted: `supabase_migrations.schema_migrations` tops out at **`20260716120000`**; `create_order()` step 3 still reads `v_total_qty > 2`; `order_items_quantity_check` still reads `CHECK ((quantity >= 1) AND (quantity <= 2))`. The merge-triggered redeploy **has** landed, so the live site now shows **no per-order limit anywhere** while the database still enforces one. **LATENT, NOT LIVE:** the only hosted drop (`test-drop`) ended **2026-06-08** → `open_now = false`, so every order is refused at `TR002` before `TR003` could fire and no customer can reach the disagreement today. **It goes live the instant a drop opens** — the customer is told nothing, fills in the entire checkout form, and is refused at the final click with „Провери ја количината во кошничката…". **Fix: `supabase db push`** (`20260827120000_remove_order_quantity_cap.sql` is the only unapplied migration). **NEVER `supabase db reset --linked`** (`D-1.07-15`) — hosted `orders` is empty today, which makes that command survivable, not safe. **Pass: on hosted, `create_order` signature unchanged with EXECUTE for `service_role` only, and `order_items_quantity_check` reads `between 1 and 99`.** `D-Y.06-11`. Owner: **Lazar / Petar**. | Y.06 | **BEFORE any drop is opened — this is the gate, not the deploy** |

*Code verified directly (not owed) in 1.06 — carried forward; the 1.07 Cowork half is ops-only and
verified no code directly: `npm run build`, `npx tsc --noEmit`, `npm run lint`,
`npm test` (**46**) all green, incl. the re-run 10-vs-3 oversell gate; the phase test was confirmed to
**fail against the stand-in** (RED captured) before the stand-in was deleted; `/catalog`,
`/catalog/[slug]`, `/cart`, `/checkout` rendered in-browser at 390px + 1180px, both locales, against
the 1.02 handover; the cart writes to **no** DB table and reserves no stock (verified by reading — no
cart code path touches `variants`/`orders`/`order_items`); the stand-in grep returns nothing; no
`supabase/migrations/` file and neither `create_order` nor `expire_reservations` changed; no new
dependency (`package.json` unchanged). (Prior direct-verified items carry forward unchanged.)*

*Code verified directly in **Z.01** (not owed): `npm run build`, `npx tsc --noEmit`, `npm run lint`, and
`npm test` (**56** — 46 + 6 email + 4 notify) all green, incl. the re-run 10-vs-3 oversell gate; the email
sender's best-effort guarantees (sends once on success with the right recipient/fields; a thrown Resend
error, a Resend error object, and a missing env var all leave the order successful; **no PII in any log
line**) are proven by unit tests against a **mocked** Resend — the real API is never called; the diff was
grepped clean of any email literal, key, or PII, and `.env.local`/`.env.hosted` remain gitignored; no
`supabase/migrations/` file, `create_order`, `expire_reservations`, component, or route changed; the only
new dependency is `resend 6.17.2`.*

*Code verified directly in **1.08** (not owed): local `npm run build`, `npx tsc --noEmit`, `npm run lint`, and
`npm test` (**56**) all green; and **against the live Frankfurt DB**: the full suite **56/56** incl. the
**10-vs-3 oversell gate** (exactly 3 succeed, 7 `insufficient_stock`, stock 0), **live pg_cron expiry** (a
backdated hold expired by the scheduled `*/5` job at the 10:00:00 cycle — `cron.job_run_details` succeeded,
"1 row" — stock returned; **2 active cron jobs**), **Turnstile enforcement with the real production secret**
(missing→`missing-input-response`, invalid→`invalid-input-response`, wrong-secret control→`invalid-input-secret`;
`orders=0`, no stock change), and **rate limits** (IP `check_order_rate_limit` max=5 → 5 allowed / 6th–7th
rejected; phone `create_order` → 2nd same-phone `TR005`). All hosted writes were seed/test fixtures, removed
after; hosted left at `orders=0`, only the ended `test-drop`, **2 cron jobs**, `order_number_seq` reset to
**TRJ-0001**. No `supabase/migrations/` file, `create_order`, `expire_reservations`, component, or route
changed; the only source changes are `facts.md` §7, `src/config/products.ts`, `src/config/drops.ts` (comment),
plus state/decision/report docs. **Then verified by the operator, same session (`D-1.08-4`):** the Z.01 email
prereqs were set up, the rehearsal drop was opened, a **real phone order (`TRJ-0001`)** was placed, the **MK
notification email arrived in Vladimir's inbox**, and the order + reservation were deleted (hosted re-verified
clean); the **design sign-off**, **IG click-test**, and **auto-expose toggle OFF** were all done by Lazar. The
hosted `test-drop` is left **ended** and carrying the two real-priced colourways (`test-mustard-ochre`
S/M/L/XL, `test-off-white` XL-only, 1199 MKD, stock 3) — matching the committed config, nothing buyable.*

*Code verified directly in **2.04b** (not owed): `npm run build`, `npx tsc --noEmit`, `npm run lint`, and
`npm test` (**85/85**) all green, incl. the re-run **10-vs-3 oversell gate** (exactly 3 succeed, 7 rejected,
stock 0). Against the dev server (curl + in-browser): `/llms.txt` returns `200` with `content-type:
text/plain; charset=utf-8` + `x-robots-tag: noindex`, a valid `# H1`/`>`-blockquote/link-section body,
facts.md-clean claims only, and both-locale **absolute** URLs whose slugs match the sitemap
(`/katalog`·`/za-nas`·`/kontakt`·`/uslovi`·`/privatnost`·`/isporaka-i-vrakjanje` + `/en/*`); the IndexNow
key file returns the **bare 32-byte key**; `/logo-512.png` `200 image/png`, `/icon.svg` `image/svg+xml`,
`/apple-icon.png` + `/icon-{192,512}.png` `image/png`; the MK homepage HTML carries
`"logo":"https://trajanov-v2.vercel.app/logo-512.png"` in the Organization JSON-LD (still no address / no
SearchAction / `sameAs` = the one IG) and the `manifest`/`icon`/`apple-touch-icon` `<link>`s in `<head>`;
`/manifest.webmanifest` is valid JSON (name/short_name/lang mk/start_url/display standalone/brand colours/
icons); **`sitemap.xml` contains 0 `llms.txt` occurrences** and still lists 7 routes × 2 locales + the seed
DB products. Home + About rendered with **no console errors**; the `logo.svg` embedded-font wordmark and the
`logo-512.png`/`icon-512.png` marks were eyeballed. The only non-doc source changes are the four new SEO/
asset files + the shared `routes.ts`, the `site-jsonld.ts` `logo` line (+ its test), `sitemap.ts` refactor,
`manifest.ts`, `indexnow.ts`, the generator script, `package.json` (`assets:brand` script only), and the
generated binary assets. **No `supabase/`, `create_order`, `expire_reservations`, cart, stock, `src/config/`,
`src/types/database.ts`, or npm dependency touched; `SITE_URL` unchanged.**

***2.03 update (2026-07-19): the register is NO LONGER EMPTY.*** Phase 2.03 added rows **#9** (the legal
pages have had no human legal review) and **#10** (the new MK legal copy is unreviewed by a native
speaker). Neither is a build blocker; **both are 2.05-cutover blockers**, owned jointly by Lazar +
Vladimir (#9) and Lazar + Petar (#10). This is expected — the phase brief said this register "is why it
stops being empty." The 1.08 note below stands as the historical record of how the **Part 2 hard gate**
(register-to-zero before Part 2) was met; that gate is unaffected — it fired before 2.01 and passed.

*After **1.08 (Code + operator, 2026-07-18) the register's zero-condition was MET — the register was EMPTY.**
Cleared/moved this session: **#5 CLEARED** (Code — real-secret Siteverify enforcement); **#1** design sign-off,
**#2** IG click-test, **#6** auto-expose toggle OFF, and **#7** real-order-delivers-email-to-Vladimir's-inbox
all **CLEARED by the operator** (`D-1.08-4`, evidence in each row above); **#8 RECLASSIFIED to the 2.05 cutover
track** (`D-1.08-2`); **#4 remains CLOSED** (1.07, struck above). Item #3 (fresh-session review of PR `#4`) was
removed at the PR-#4 merge; the old #6 (review of PR `#6`, `D-1.06-2`) was **WAIVED** (`D-1.06-11`). **1.08 was
the hard gate before Part 2, and it has now PASSED — nothing sits in front of 2.01.** The only operator items
still open are **recommended housekeeping** (L1–L4, L7), which are explicitly **not** part of the gate's
zero-condition.*

**Owed to Lazar / the operator — dashboard + password-manager jobs only he can do:**

| # | Item | What "pass" looks like |
|---|---|---|
| L1 | **Delete the stray Stockholm Supabase project.** **Confirmed still live this phase**: ref `ewcqwbuvbbfduytiiaxy`, region `eu-north-1`, name "petarjakimov11012011-cell's Project", status ACTIVE_HEALTHY, empty. | Only `kmuocwmevyyuhcvwoebf` (Frankfurt) remains in the Supabase account |
| L2 | **Review/remove the stray `trajanov` Vercel project.** Confirmed still present alongside `trajanov-v2`. | Exactly one Vercel project points at this repo, so one push cannot trigger two deployments |
| L3 | **SAVE THE NEW DB PASSWORD — CHANGED THIS PHASE (`D-1.07-12`).** The password manager's entry is **stale and wrong**: the DB password was **reset** at the operator's instruction. The new value exists **only** in gitignored `.env.hosted` on Petar's machine. **Unrecoverable if that file is lost** (another reset would be needed). Also confirm `ORDER_IP_HASH_PEPPER` is saved — the **Vercel** value must never change or every rate-limit window resets (`D-1.04-7`). | Both retrievable from the password manager, and the DB password matches `.env.hosted` |
| L4 | **Revoke the Supabase access token `claude-code-phase-1.07`** (Account → Access Tokens; expires 2026-08-15). It controls the **whole Supabase account** and was only needed for `link`/`db push`/`gen types --linked`. | Token no longer listed |
| ~~L5~~ | **DONE (2026-07-18).** Lazar turned OFF "Automatically expose new tables" on `kmuocwmevyyuhcvwoebf` (register #6 cleared). Standing caveat: does not retroactively revoke — pair with an explicit REVOKE in any migration that adds a table. | ✅ Toggle off |
| ~~L6~~ | **DONE (2026-07-18).** Register #1 (design sign-off) and #2 (Instagram click-test) both cleared by Lazar against the live site. | ✅ Both confirmed |
| L7 | **Uptime monitor** — a paused free-tier project silently pauses pg_cron and takes the store offline (Known issues #7). Not set up this phase (out of scope). | A monitor hits the URL ≥ every 5 min, alerting two inboxes |

---

## Placeholder register

Every visible `[PLACEHOLDER: …]` on the site. **Cutover (2.05) proceeded with #2/#3/#4/#7 still open —
Lazar's explicit override (`D-2.05-2`).** The zero-condition is **re-pointed to the first REAL drop
(2.06 gate)**, not cutover: nothing is buyable on day one, so the consumer-protection exposure the rule
prevents is not triggered by cutover alone — it IS the moment a drop opens. **The register must reach
zero before the first real drop.**

*Y.06 update (2026-08-27): **no new row, no row cleared — the table below is byte-unchanged.** Rows **#3** and **#9** (fabric/care for the two verified colourways and for Product 03) are **still OPEN and unchanged**. Y.06 built the SLOT those rows will eventually fill — `src/lib/product-care.ts` is now read by the product page (`D-Y.06-1`) — but every `careMk`/`careEn` in `src/config/products.ts` is still `null`, so both rows render exactly the placeholder they rendered on `main`, **byte-identically, proven by diffing the rendered section HTML in both locales** (`D-Y.06-2`). `facts.md` §7 is untouched and still says `UNVERIFIED — OWED (Vladimir)`. **No composition or care text of any kind was committed**, and `tests/config/product-care.test.ts` now fails the build if any ever is without a label to read it off (`D-Y.06-9`). What changed is the cost of clearing these rows: it is now a one-line config edit plus a **deploy** (care copy is not in the database — that column is Y.01's, `D-1.06-3`), not another code phase.*

*2.25 P1 update (2026-07-29): **no new row, no row cleared — the register is byte-unchanged.** This
phase added no placeholder and removed none. Two existing rows became MORE PROMINENT as a side effect
and are recorded here rather than in the table: **#2** (the back / print-detail photo) now occupies a
**full screen** on a 320px product page instead of a 138px thumbnail, because the photo grid collapsed
to one column (`D-2.25-10`, Petar's call) — so the "we do not have this photograph yet" statement is
now unmissable on a phone, which is honest but loud; and **#4/#7** (the price pill) is what set the
102px min-content floor that forced the cart row to wrap at 320px (`D-2.25-12`) — when real prices land
the cart's width budget changes again and that wrap point should be re-measured.*

*2.21 update (2026-07-27): **no new row; row #4's Page column gains Home.** The showcase renders the
neutral name slot („Производ 01" / "Product 01") on the front door — the same #4 mechanism, one more
page, no new placeholder string. **#2 and #8 are unchanged BECAUSE photo-less products are skipped**
(brief decision 2, `src/lib/showcase.ts`): no hatched `PhotoSlot` placeholder and no baby-blue slide
appears anywhere in the section, so neither photo row gains a surface. The price placeholder (#1,
cleared) exists only as the untriggerable `D-2.21-2` fallback — all three prices are real. Cleared,
reworded, hid, or filled none — #2–#10 byte-unchanged.*

*Y.05 update (2026-07-27): **no change to the register.** The full-bleed hero phase shipped **no new
placeholder and cleared, reworded, hid, or filled none** — #2–#10 are byte-unchanged. The composite is
built from the same three permitted lifestyle frames; **placeholder #2 (the neutral product set) and #8
(baby blue's photo) are untouched and still gate the first real drop.** No placeholder value appears on
the hero: the one new string is a real garment alt text.*

*Y.04 update (2026-07-26): **no change to the register.** The Home hero phase shipped **no new
placeholder and cleared, reworded, hid, or filled none** — #2–#10 are byte-unchanged. The photographs it
renders are the same two interim frames Y.03 committed; **placeholder #2 (the neutral product set) and
#8 (baby blue's photo) are untouched and still gate the first real drop.** No placeholder value appears
on the hero: the two CTAs are real strings, the alt text is the existing reviewed-pattern garment
description, and no product name/price/fabric surfaces on Home.*

*Y.02 update (2026-07-22): **+3 rows — #8, #9, #10 — all for Product 03 (baby blue).** The new catalog
stub (`D-Y.02-1`) ships with the SAME visible placeholders as the two existing colourways: a photo slot
(#8), a fabric/care slot (#9), and the neutral name slot (#10). These are **not new placeholder strings** —
Product 03 reuses the exact shared keys the generic rows #2/#3/#4 already cover (`Placeholder.productPhoto`
/ `Placeholder.composition` / the `Placeholder.productName` neutral slot); the new rows make **baby blue's
own** owed photo + fabric + name explicit, so the "register to zero before the first REAL drop" gate counts
three products' worth of owed content, not two. **Cleared / reworded / hid none** — #2–#7 are
byte-unchanged. Product 03's price (1999 MKD) and sizes (S/M/L/XL) are VERIFIED and render as real facts, so
they are **not** placeholders.*

*2.06 update (2026-07-22): **no change to the register.** The Code half of 2.06 shipped only ops docs +
SQL helpers under `docs/ops/` — no new placeholder, and #2/#3/#4/#7 are byte-unchanged. The rehearsal runs
against the existing `test-drop` (placeholder names, no photos) and does **not** fill any product
placeholder; the register must still reach **zero before the first REAL drop** (`Y.01` content), which the
rehearsal is explicitly **not**.*

*2.05 update (2026-07-22): **#5 CLEARED, #6 NARROWED.** The contact email `info@trajanovv.com` is now
published on Contact in both locales (a real `mailto:`, `EMAIL` in `src/lib/social.ts`; `Placeholder.email`
removed) — **#5 struck**. Delivery **time** is now VERIFIED (3–5 business days, `facts.md` §7) and renders
on Shipping & Returns, so **#6 narrowed** to courier + delivery cost (dropped „време"/"time"). #2/#3/#4/#7
remain open; cutover shipped with them open per `D-2.05-2` (see the header note).*

*2.04b update (2026-07-22): **no change to the register.** Phase 2.04b shipped **no new placeholder** and
**cleared, reworded, hid, or filled none** — #2–#7 are byte-for-byte unchanged. The load-bearing rule
carried over from 2.04 holds: **no placeholder value reaches `llms.txt`, the logo, or the manifest.**
`llms.txt` writes only facts.md-VERIFIED claims (no product name/price/photo/fabric slot appears — it
links the catalog page, not individual products), the manifest description is a facts-clean one-liner, and
the marks are pure brand typography. The still-null product **names** (#4) never surface in any 2.04b file.*

*2.04 update (2026-07-20): **no change to the register.** Phase 2.04 shipped **no new placeholder** and
**cleared, reworded, hid, or filled none** — #2–#7 are byte-for-byte unchanged. The load-bearing rule
for this phase: **no placeholder value reaches any JSON-LD or OG image.** The Product JSON-LD emits **no
node** while product names are placeholders (#4) — proven both by unit test (null name → null) and by
grep across the rendered pages — and the OG card falls back to a neutral brand title rather than baking
the neutral slot ("Производ NN"). (Note: this phase's font-size fix bumped the `PhotoSlot` placeholder
label from 11.2px to 12px for legibility — the placeholder **text is unchanged**, only its size.)*

*2.03 update (2026-07-19): **+2 rows** — #6 (courier / delivery time / delivery cost) and #7
(returns/exchange window), both on the new Shipping & Returns page, owner Vladimir. 2.03 **cleared,
reworded, or hid no existing placeholder** (#2–#5 are byte-for-byte unchanged); it added two honest
`[PLACEHOLDER: …]` markers rather than guessing a delivery cost or a returns window.*

*2.01 shipped **no new placeholder** and **cleared/reworded/hid none** — the existing rows below are
unchanged. The placeholder strings themselves (`Placeholder.*`) were already in the catalogs; 2.01 only
confirmed they are translated in both locales.*

| # | Placeholder | Page | Waiting on | Owner |
|---|---|---|---|---|
| ~~1~~ | ~~`[PLACEHOLDER: цена MKD]` (product price)~~ | ~~Catalog cards, Product, Cart, Checkout~~ | **CLEARED 2026-07-18** — a real price now exists: **1199 MKD** VERIFIED (`facts.md` §7), set in `src/config/products.ts`, and **synced to hosted** (the rehearsal `test-drop` products carry 1199 MKD). When the drop was briefly opened for the gate's real order, the checkout/cart/confirmation rendered **1199 ден** (no placeholder, no USD). Each *future* drop still needs its own real price, but that is per-drop, not a standing placeholder. | — |
| 2 | `[PLACEHOLDER: фотографија — Владимир]` (product photo) | Catalog cards, Product | **STILL OPEN — NARROWED 2026-07-26 (Y.03, `D-Y.03-3`):** the **neutral-background front / back / print-detail set is still owed for every colourway**; an **interim lifestyle frame** now renders for **Products 01 and 02** only (catalog card + **first** product-page slot). The **second product-page slot is still this placeholder**, and Product 03 still shows it in both slots. A styled bar frame is **not** the product photography this row waits for (`facts.md` §8 — the "cannot carry Catalog or Product" defect is overridden for two frames as an interim, **not retracted**). **Nothing here is cleared and this row does not shrink the pre-drop gate** (`D-0-6`) | Vladimir |
| 3 | `[PLACEHOLDER: состав и нега — од етикетата]` (fabric/care) | Product | Composition from the labels | Vladimir |
| 4 | Product **names** render as neutral slots ("Производ 01…") — **NARROWED to names-only 2026-07-18**: sizes are now **real** (S/M/L/XL, off-white XL-only, VERIFIED `facts.md` §7), no longer a flagged sample. Per-size **measurements** (cm/fit chart) are still owed. | Catalog, Product, **Home (showcase slide titles, 2.21)** | Real product **names** + a size-**measurement** chart | Vladimir |
| ~~5~~ | ~~`[PLACEHOLDER: е-пошта — Владимир]` (contact email)~~ | ~~Contact~~ | **CLEARED 2026-07-22 (2.05).** `info@trajanovv.com` is now published on Contact in both locales (a real `mailto:`, `EMAIL` constant in `src/lib/social.ts`); the `Placeholder.email` key was removed from both catalogs. VERIFIED for public display (Lazar/Vladimir, 2026-07-21, `facts.md` §5). It is a **domain** address (Cloudflare Email Routing → Vladimir's inbox), **not** his personal email — so the `D-Z.01-3` concern (publishing a minor's personal address) does not apply. | — |
| 6 | `[PLACEHOLDER: курир и цена на испорака — Владимир]` (courier + delivery cost) | **Shipping & Returns** (`/isporaka-i-vrakjanje`, `/en/shipping-returns`) | **NARROWED 2026-07-22 (2.05):** delivery **time** is now VERIFIED (3–5 business days, `facts.md` §7) and shows on the page, so this placeholder dropped „време"/"time" — only **courier + delivery cost** remain, neither in `facts.md`. Deliberately **not** estimated: on cash-on-delivery a wrong delivery cost is money asked for at the door on a promise nobody made (`D-2.03` Task 5) | Vladimir |
| 7 | `[PLACEHOLDER: рок за враќање и замена — Владимир]` (returns/exchange window) | **Shipping & Returns** | The returns/exchange **window** — not in `facts.md`; **no statutory withdrawal period is cited** (Decision 5). A real number comes from Vladimir | Vladimir |
| 8 | `[PLACEHOLDER: фотографија — Владимир]` — **Product 03 (baby blue)** photo | Catalog card, Product (`/katalog/test-baby-blue`, `/en/catalog/test-baby-blue`) | A **real baby-blue product photo** (`D-0-6`, `D-Y.02-1`) — no stand-in, no generated image, no other shirt's photo. Same shared key as #2, scoped to the new colourway | Vladimir |
| 9 | `[PLACEHOLDER: состав и нега — од етикетата]` — **Product 03 (baby blue)** fabric/care | Product | Composition + care **read off baby blue's label** — never guessed (`D-Y.02-1`). Same shared key as #3, scoped to the new colourway | Vladimir |
| 10 | Product 03 **name** renders as the neutral slot "Производ 03" / "Product 03" | Catalog, Product | The **real customer-facing name** for baby blue — no invented name (`D-Y.02-1`). Same neutral-slot mechanism as #4, scoped to the new colourway | Vladimir |

*#5 (email) was a pure UI placeholder via `<Placeholder>` (`Placeholder.email` key), shipped by 1.05
(`D-1.05-3`) and held pending Vladimir's OK to publish a contact email (`D-Z.01-3`). **That sign-off came
(Lazar/Vladimir, 2026-07-21), and 2.05 published `info@trajanovv.com` on Contact** — a **domain** address
(Cloudflare Email Routing → Vladimir), not his personal inbox — so #5 is **cleared** and `Placeholder.email`
is removed from the catalogs. **Every remaining placeholder below is publicly visible on
`https://www.trajanovv.com`.**
#1–#4 are now driven by the **DB via the typed drop config** (not `demo.ts`, deleted): a null
`price_mkd`/`name_*` renders the price/name placeholder (`D-1.04-6/10`); photo + fabric/care have **no
DB column yet** — those columns land with **`Y.01 — Drop content load`** (`D-1.06-3`), not 1.06 — and
render as pure UI placeholders. The price (#1) and neutral-name (#4) placeholders also surface on the
new **Cart** rows (existing placeholders, no new one shipped by 1.06). When
Vladimir supplies real prices/names, filling `src/config/products.ts` + `npm run sync:drop` clears #1
and #4 (for a drop). Sizes for a real drop come from config (the rehearsal's are a flagged sample).
**The register must be empty before the first REAL drop opens (2.06 gate), not before cutover — cutover
shipped with #2/#3/#4/#7 open per `D-2.05-2`.***

**Already known to be coming** (from `facts.md`, will become entries the moment the relevant page
is built):

- Real prices in MKD → Product pages
- Sizes / measurements → Product pages
- Fabric composition + care → Product pages
- Product photos → Catalog, Product

*Resolved this phase: **Vladimir's email** is now a live register row (#5). The **press links** are no
longer "coming" — all five are VERIFIED (`facts.md` §4, 2026-07-15) and cited on About as links, with
no placeholder (`D-1.05-5`).*

---

## Carryovers

- **`Z.01 — Order email (Resend)` is DONE on the code side** (this update; `D-1.07-8` satisfied). The
  sender is built and unit-tested against a mocked Resend; the order path fires it best-effort after
  `create_order()`. **What remains is real-world only, and it is owed to 1.08** (register #7): the operator
  prereqs (Resend account under Vladimir's email, API key, the two Vercel env vars) plus a live, priced
  drop and a real order, to prove an email actually lands in Vladimir's inbox. **This session had no
  independent confirmation that the operator prereqs are done** — the wiring + mocked tests are valid
  either way, and real delivery is (as designed) a 1.08 concern.
- **1.08 also needs a live drop.** Owed #5's remainder (does Cloudflare challenge a real bot), Z.01's
  register #7 (a real order emails Vladimir), and 1.08's own "one real order" DoD all require an **open,
  priced** drop. The only committed drop is `test-drop` — ended and null-priced (`D-1.04-12`) — and creating
  a live one is out of scope here. Prices/names come from Vladimir via `Y.01`.
- Prior: `D-1.04-16` (no real product→cart→checkout item flow) is **closed by Phase 1.06**: the
  cart flow is built, the stand-in is deleted, and an automated test proves the customer's chosen
  product+variant reaches the `order_items` row.

---

## Known issues / accepted risks

| # | Item | Ref | State |
|---|---|---|---|
| 1 | **Vercel Hobby ToS violation.** Commercial use prohibited; Vercel may pull the deployment without notice, explicitly including during traffic spikes — i.e. drop day. Accepted by Lazar. **Now materially live: 1.07 deployed the store to Hobby, and 2.05 put it on its real public domain `www.trajanovv.com` — the drop-day takedown risk is fully live.** | `D-0-2` | Live. Mitigations: portability rule (**re-verified 1.07: nothing Vercel-specific added; no Postgres/Blob/KV; the only Vercel artifacts are the gitignored `.vercel/` link dir**), the X.01 Pro migration, the 2.06 contingency — **the contingency plan is now WRITTEN (`docs/ops/drop-day-contingency.md`, 2.06 Code); the X.01 *brief* is flagged not-yet-written (`D-2.06-2`) — author `briefs/Part-X-Phase-01-*.md` before the first real drop.** |
| 2 | **No automated PR review.** House review gate waived for this project. Risk concentrated on 1.03/1.04 concurrency code. | `D-0-3` | Live. Mitigations: cross-review, fresh-session review on 1.03/1.04, concurrent-order test. |
| 3 | **Public repo.** One committed secret is scraped before you notice. | `D-0-1` | Live. Mitigation: hard rule in `CLAUDE.md`. Rotate, never just delete. |
| 4 | **Legal responsibility unconfirmed.** Minor, no registered entity, collecting consumer PII. 2.03 shipped Terms + Privacy naming **Vladimir alone** (`D-2.03-1`) and the pages have had **no legal review** (owed #9) — the underlying legal exposure is unchanged and still owed. **+ Line item added 2026-07-26 (Y.03):** Vladimir's **own photograph now publishes commercially** on the Catalog card and product page for Product 01, where his face is fully identifiable. Guardian consent for that specific use was **given by his parents 2026-07-26** and is recorded as permission #5 in `facts.md` §8.1 — but that consent covers **this publication only** and does **not** close this issue. Put his image on the agenda for the parental conversation alongside legal responsibility. **Y.04 (2026-07-26) additionally places the same mustard frame on the Home hero — the site's front door and the surface every Instagram link lands on.** This is the use `facts.md` §8 always named for the lifestyle set and sits inside the same §8.1 permissions ("his own instruction to publish **these pictures**" + guardian consent), but it raises the visibility of his identifiable image from a catalog card to the first thing every visitor sees — worth naming in that same parental conversation. | `facts.md` § 1 · § 8.1 · `D-2.03-1` · `D-Y.03-7` · `D-Y.04-1` | **Cutover blocker — STILL OPEN.** Owner: Vladimir + parents. |
| 5 | **Product photos do not exist.** | `D-0-6` | **Blocks 1.06.** Owner: Vladimir. Critical path. |
| ~~6~~ | **Bar photos: model + venue permission — RESOLVED 2026-07-26 (Y.03 Code).** All **five** permissions are GIVEN and recorded in **`facts.md` §8.1** by fact/date/channel only (no message text, screenshot, handle, or the model's name — `D-0-1`; evidence held by Lazar and Petar outside the repo): venue („Вторник"), the **adult model (21, her own consent is sufficient)**, Vladimir's own instruction, the **backdrop call (Vladimir, in favour** — written to cover **a person in frame holding a drink**, not only a backdrop, `D-Y.03-6`), and **guardian consent from Vladimir's parents for his own image**, which is what makes the mustard frame — where his face is fully identifiable — publishable. **The forward-written block on future lifestyle imagery is LIFTED.** `D-1.05-4` stays **Accepted and unmodified**: Home and About still ship with no photo, untouched by Y.03. | `facts.md` § 8.1 · `D-Y.03-6/7` | **RESOLVED — Y.03 Code, 2026-07-26.** Interim frames now render on Catalog + Product 01/02. The **neutral product set is still OWED** (issue #5, placeholder #2). |
| 7 | **A paused free-tier Supabase project silently pauses pg_cron.** Free projects pause after ~7 quiet days — and this store is quiet between drops **by design**. Paused cron means `expire_reservations` stops running, so lapsed 48h holds never return their stock: **the shirt is sold to nobody, forever.** Moved here from register #4 (it is a standing risk, not a verification debt — the schedule itself is proven live on hosted). | `D-1.04-2/3` · register #4 · `D-1.07-4` | **Live and unmitigated.** No uptime monitor exists (owed: L7). Real fix is Supabase Pro ($25/mo) — a decision and a phase, never a silent upgrade. |
| 8 | **`supabase db reset --linked` wipes the hosted database and cannot rebuild it.** It drops tables/types but not sequences, then fails its own re-apply on `order_number_seq already exists`. Recovered by hand this phase (`drop sequence` → `db push --include-all`) — harmless only because the DB was deliberately empty. | `D-1.07-15` | **Live.** **Never run against a database with real orders — the free tier has no backup.** |
| 9 | **The six Vercel env vars are marked Sensitive = write-only.** `vercel env pull` returns all six as empty strings, so no one can recover a credential from Vercel. The DB password and pepper are **unrecoverable if the password manager and `.env.hosted` are both lost**. | `D-1.07-12` · Cowork report §3.4 | **Live.** Cowork's "cosmetic only, no functional impact" is true for the deployed build, false for anyone working locally. Mitigation: L3. |
| ~~10~~ | **Live domain ≠ `SITE_URL` ≠ `facts.md` — RESOLVED 2026-07-22 (2.05 Code).** 2.05 flipped `SITE_URL` → **`https://www.trajanovv.com`** (`D-2.05-6`; the canonical 200-serving host — apex + vercel.app both 308→www), so every emitted absolute URL — canonical, hreflang, JSON-LD `@id`/`logo`, sitemap, OG images, llms.txt links, IndexNow host — now points at the non-redirecting host. `facts.md` §9 reconciled (spelling `trajanovv.com` + status **VERIFIED — PURCHASED**). The **grep gate is GREEN** — zero `trajanov-v2.vercel.app` and zero single-v `trajanov.com` in any emitted URL/canonical/OG/schema. | `SITE_URL` (`src/lib/site.ts`) · `facts.md` §9 · line 1 | **RESOLVED — 2.05 Code.** Takes effect on the merge-triggered redeploy; registering the IndexNow key in Bing stays owed (#14, ops). |

---

## Parallel track

Canonical table with gates: `Trajanov-V2-Plan.md` § 13. Status only:

| Task | Owner | Status |
|---|---|---|
| Buy the domain | Lazar / Petar | **⚠️ DONE, but as `trajanovv.com` (double-v), NOT `trajanov.com` (single-v).** Live + attached to Vercel (`www.trajanovv.com`; the vercel.app URL 308-redirects to it), Petar-confirmed his 2026-07-22. **`facts.md` §9 still says single-v "not purchased" — STALE.** 2.05 must flip `SITE_URL` to `https://www.trajanovv.com` + reconcile `facts.md` §9. See Known issues #10. |
| **Product photos** | **Vladimir** | **Not started — critical path** |
| Vladimir's email | Lazar → Vladimir | **DONE (2026-07-18).** Address VERIFIED (`facts.md` §5); Z.01 code shipped against it; the operator prereqs are now **live** (Resend account under Vladimir's email + `RESEND_API_KEY`/`ORDER_NOTIFICATION_EMAIL` in Vercel, redeployed) and a real order (`TRJ-0001`) **delivered the MK notification to his inbox** (register #7 cleared, `D-1.08-4`). Still **not** published on Contact (`D-Z.01-3`, placeholder #5). |
| Real prices (MKD) | Vladimir | **This drop: 1199 MKD VERIFIED (2026-07-18)** — recorded in `facts.md` §7 + `src/config/products.ts`. Each future drop still needs its own price. |
| Sizes + fabric (read the labels) | Vladimir | **Sizes VERIFIED (2026-07-18):** S/M/L/XL, off-white XL-only (`facts.md` §7). **Still owed:** fabric/composition/care (from the labels) + a per-size measurement chart. |
| Legal responsibility w/ parents | Vladimir | **Still owed (cutover blocker).** 2.03 shipped Terms + Privacy naming **Vladimir Trajanov, Струмица, alone** as the responsible party (`D-2.03-1`, Lazar's call), with the `facts.md` §1 open flag kept — but no parent has confirmed legal responsibility and **no lawyer has read the pages** (new owed-verification row #9). |
| ~~Model + venue permission~~ | Vladimir | **DONE 2026-07-26 (Y.03)** — all five permissions GIVEN, recorded in `facts.md` §8.1 by fact/date/channel only. Known Issue #6 resolved. |
| Verify press links | Lazar | **Done** — all 5 fetched, read, VERIFIED 2026-07-15 (`facts.md` §4); cited on About (`D-1.05-5`) |
| First drop date + products | Vladimir | Not started |
| MK copy review | Lazar + Petar | **150 strings DONE (2.02); +63 new legal strings OWED (2.03).** 2.02 was a clean pass on the original 150 (`docs/i18n/mk-review-2.02.md`, both signed). 2.03 added 63 new MK strings (Terms/Privacy/ShippingReturns + Nav/Meta/Placeholder) that **no native speaker has read** — pack **unsigned** at `docs/i18n/mk-review-2.03.md` (owed-verification row #10), verifies before 2.05 cutover. |

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
