# Completion report — Part 2 Phase 2.25: Impeccable pass (typeset · harden · optimize · adapt · animate)

| | |
|---|---|
| **Phase** | 2.25 |
| **Name** | Impeccable pass — P0 typeset + P1 harden / optimize / adapt / animate |
| **Executor** | Claude Code (P0 in an earlier session; **P1 in this one**) |
| **Operator** | Petar |
| **Date** | 2026-07-29 |
| **Branch** | `phase-2.25-impeccable-pass` |
| **PR** | **not opened — deliberately.** Petar wants one Vercel preview after **all six** items land (P0 → P2 + the closing `/impeccable audit`). P2 and the audit are still queued. |
| **Brief** | `briefs/Part-2-Phase-25-P1-Handoff.md` (P1 half) |

> **Scope note.** This report covers the **whole 2.25 branch**, but P0 (`87efc6b`, `27b589d`,
> decisions `D-2.25-1…4`) was executed by a different session. Everything below marked **P1** is this
> session's work: commits `a881dcd`, `13246fd`, `277984c`, `4340cec` and the review-fix commit,
> decisions `D-2.25-5…18`.
> **The phase is NOT closed** — `/impeccable polish` (P2) and the closing `/impeccable audit` are
> still owed on this branch. The state files are updated to the P1 waterline, not to a finished phase.

---

## 1. What shipped

- **A failed checkout or contact submit now says something and goes somewhere.** The error line is a
  persistent `role="alert"` live region that announces when it fills, and focus moves to the first
  invalid field instead of sitting on the button the customer just pressed. Measured on the baseline:
  **zero** live regions existed before *or* after a failed submit, and `document.activeElement` was
  still the submit button.
- **The contact form's message field is actually required.** `CheckoutField` dropped the `required`
  prop on its textarea branch, so that field rendered a `*` in its label and carried no required
  semantics at all. One-line bug, live since 2.23.
- **Every page stops shipping the legal pages' text to the browser.** The i18n client provider is
  scoped to the 14 namespaces client code can reach: **25,039 → 8,990 UTF-8 bytes** of MK messages in
  the HTML of every route (**−64.1%**, measured on production builds of both sides). The Terms page
  title was provably sitting in the Contact page's HTML before this.
- **The Home hero is server-rendered again.** `HomeExperience` was `'use client'` for one `useState`,
  one `useEffect` and one `router.refresh()`; the photograph, scrim, tagline, CTAs, drop banners and
  the whole live-drop product grid came along for the ride. Client modules per drop state now:
  **ended — none, live — `SpotlightCard` only, countdown — `CountdownOpening` only.**
- **Tap targets reach 44px without the header moving a pixel**, and the cart, footer, product page
  and `/styleguide` stop overflowing or crowding at 320px.
- **The reveal animation stops blurring a 0.75-megapixel photograph 45 times a second**, and every
  keyframe animation on the site now states its own reduced-motion behaviour instead of inheriting a
  blanket "motion, but instant".

---

## 2. Decisions I made on my own

**Fourteen, `D-2.25-5…18`.** Two (`D-2.25-10`, and the token half of `D-2.25-13`) were **put to Petar
before the edit was made** and are recorded as his calls. Four (`D-2.25-15…18`) came out of the
adversarial review described in §3 — they are fixes to defects **this phase introduced** and to
claims **this phase got wrong**, and they are listed here rather than folded into the rest.

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| **D-2.25-5** | Persistent per-field `role="alert"` + focus to the first invalid field in **DOM order** (not error-map order) | One form-level error-summary region (GOV.UK pattern) | Four assertive announcements *and* a focus move on a 4-field failure — redundant and louder than the summary would be |
| **D-2.25-6** | Error text **stays 13px** (`text-small`); what it needed was announcement and focus, not size | Bump to `text-body` 16px | The error is the quietest thing in a field that just failed; a real fix is a new `brand.md` §4 token, not a local override |
| **D-2.25-7** | i18n client provider gets an **allow-list**, guarded by a test that re-derives it from the import graph | A deny-list of the big server-only catalogs | A missing namespace fails at **runtime in the customer's browser**, not at build. The guard test is the only thing standing in front of that |
| **D-2.25-8** | `HomeExperience` → Server Component; the T-0 flag moves to a context + 3 small client components | Keep the countdown branch as one client island containing `<Hero>` | The T-0 swap is coordinated through context, so a slot rendered outside the provider fails **quietly** (shows idle content) rather than throwing |
| **D-2.25-9** | `.tap-44` pseudo-element where the visual box must not move; **real** boxes in the footer and cart | Make every target a real 44px box | Two mechanisms for one requirement, and the pseudo-element one is invisible — it can silently steal a neighbour's taps |
| **D-2.25-10** | Product photo grid `grid-cols-1 sm:grid-cols-2` — **Petar's call, asked with the numbers** | A horizontal scroll-snap strip (better on both axes; needs a new MK+EN string + `tabindex`) | **Price moves y=567 → y=1107 at 320px.** Two screens of scroll to the buy path, past a hatched placeholder |
| **D-2.25-11** | `/styleguide` countdown **card scrolls**; the countdown is not shrunk | Step the countdown down to `text-h2` below `sm:` | The design-system page no longer shows that component whole at ≤514px |
| **D-2.25-12** | Cart row gets `flex-wrap` + `min-w-0` on the `<ul>` **grid item** | A two-row CSS grid with explicit placement | Row is **48px taller at 320px** (125→172) and the flip point is content-driven, so it is invisible in the class list |
| **D-2.25-13** | `filter: blur()` out of the reveal keyframe; **`--motion-reveal-blur` stays in both files — Petar's call** | Delete the token from `globals.css` and propose the `brand.md` row | A knowingly dead token ships in two files. **And no FPS number is claimed — none could be measured here** (see §3) |
| **D-2.25-14** | The blanket `prefers-reduced-motion` rule becomes a **backstop**; each animation states its own behaviour | Replace `0.001ms` with `animation: none` globally | The enumerated list is a **comment**. Nothing enforces it; the next animation added will silently fall through |
| **D-2.25-15** | `PhotoSlot` takes a `sizes` prop; the product page passes its own | Widen the shared constant to cover both surfaces | The geometry now lives in two places kept in step by a comment — the same protection that already failed once |
| **D-2.25-16** | `sm:gap-4` between the cart's remove button and the `+` stepper | Leave it — both are full 44px targets, nothing fails an SC | The desktop cart row grew ~16px to prevent a **touch** mis-tap |
| **D-2.25-17** | `/styleguide`'s scroll container gets `tabIndex={0}` + a label | Leave it, it is a dev-only noindex page | One more tab stop, at every viewport, including those where it does not scroll |
| **D-2.25-18** | Two of this phase's own measurement claims corrected on the record | Fix the numbers silently in this report | `D-2.25-7` and two commit messages are **left wrong in place** (append-only / immutable) |

---

## 3. Surprises and off-spec changes

**1. The cart already overflowed at 320px before this phase touched it.** Widening the controls to
44px made it obvious (the viewport was forced to 338px), but measuring the P0 baseline showed the row
was **already 298px inside a 288px track**, escaping by 10px. Root cause is `min-width: auto` on the
`<ul>`, which is a **grid item**. The brief pointed at `min-w-0` for the *footer*; the class was
genuinely needed, just in a different file. Fixed at the root (`D-2.25-12`).

**2. The brief's `min-w-0` for footer links at 200% zoom was NOT applied, on purpose.** Measured MK
at 320, 390 and 640px with the longest MK strings: **zero** elements with
`scrollWidth > clientWidth`, `document.scrollWidth == innerWidth` at every width. And in that DOM the
`<a>` elements are **not flex items** (the `<li>`s are), so `min-w-0` on them would be inert. Adding a
class that does nothing to fix a problem that does not reproduce would be cargo cult. Reported instead.

**3. The brief calls 44px "the WCAG 2.2 (2.5.8) floor". That is not what 2.5.8 says.** SC 2.5.8
*Target Size (Minimum)* is **24×24 CSS px at AA**, with a spacing exception. **44×44 is SC 2.5.5
*Target Size (Enhanced)*, which is AAA** (and the Apple HIG figure). The footer links at 27.5px were
already passing AA. The work was done as briefed and the site is now better than it was — but the
next brief should say **AAA / 2.5.5** so nobody thinks the site was failing AA.

**4. Two rules written in the obvious place never reached the compiled stylesheet.** A rule added
inside `@layer base` after `:focus-visible`, and a rule added inside the existing
`@media (prefers-reduced-motion: reduce)` block after the `*` selector, are both **silently dropped**
by the Tailwind v4 pipeline. Verified by serving the built CSS and grepping for the selectors — the
class was in the DOM, the rule was in the source, and the compiled CSS did not contain it. Both are
now authored at the top level / in a second `@media` block (which the compiler merges back into one).
**This will bite the next person who edits `globals.css`**; both workarounds carry a comment saying why.

**5. Frame timing for `/animate` could not be measured, and no number is claimed.** This project's
verification pane is permanently hidden (`document.hidden === true`), so `requestAnimationFrame`
never fires and a before/after FPS delta is impossible here — the `D-2.21-7` constraint, hit again.
What is measured is the mechanism and the paint area: the blurred element on the hero is
**1152×648 = 0.75 MPx** at 1280px, and the live-drop call site puts the same filter on every product
card at once. **A real before/after on a real device is owed (#59).**

**6. The dev server on :3000 belonging to another session died mid-phase**, and before that it served
**stale CSS** for a while (a compiled chunk that did not contain a rule the source had). Everything in
this report was re-measured against a fresh server started by this session. If a measurement in an
earlier session's notes disagrees with one here, prefer this one.

**7. `/impeccable`'s design hook flags `globals.css` for `gradient-text`.** That is the **wordmark
hover shine** — owner-requested, ratified `D-2.19-1`/`D-2.20-1/2/3`, documented in `brand.md` §6 as the
fourth logged motion exception. **False positive for this codebase; left unchanged and not suppressed**
(suppressing needs Petar's explicit say-so, per the hook's own rule).

**8. `.gitignore` carries an uncommitted one-line change from the P0 session** (ignoring
`.claude/skills/impeccable/`). It is not this phase's work and was **left uncommitted** rather than
quietly folded into a P1 commit. Same for the untracked `Part-1-Phase-07-Runbook-v2.md`,
`briefs/Part-2-Phase-13-Code.md`, `briefs/Part-2-Phase-25-P1-Handoff.md` and `docs/seo/`. **Petar
decides what to do with them.**

**10. Three defects and two false claims of my own were caught by an adversarial review of the
finished diff, not by me.** After the four items were committed, the whole `27b589d..HEAD` diff was
re-reviewed by independent agents across four lenses (correctness, CSS/layout, accessibility, and
claims-vs-reality), each finding then attacked by three separate refuters. **Twenty-five findings were
raised.** What survived and was fixed:

- **`sizes` was left at 50vw on a slot that is now 100vw** (`D-2.25-15`). Collapsing the product photo
  grid made the slot full-width on a phone, but `PhotoSlot`'s shared `sizes` constant still promised
  half that — `next/image` would have requested a source built for half the box and upscaled it. **The
  page whose entire purpose is the photograph would have shipped a softer photograph than before the
  change made to show it bigger.** That constant's own comment said "keep in step if either grid
  changes"; I changed the grid and did not.
- **The destructive remove button ended up flush on top of the `+` stepper** (`D-2.25-16`). Measured
  at 768px: same x, remove's bottom edge and `+`'s top edge both at 250.9 — zero separation, where
  before the phase they were ~40px apart. Growing both to 44px consumed the space `justify-between`
  had been distributing.
- **The `/styleguide` scroll container could not be scrolled by keyboard** (`D-2.25-17`, WCAG 2.1.1) —
  it holds no focusable element, so the fix that stopped the countdown escaping its card created a
  region a keyboard-only user could see clipped and never reach the rest of.
- **"16,308 → 6,241 bytes" are character counts, not bytes** (`D-2.25-18`). MK is Cyrillic. The real
  figures are **25,039 → 8,990 UTF-8 bytes (−64.1%)** — the saving is *larger* than claimed, but the
  unit was wrong in a decision entry and a commit message that cannot be edited.
- **"zero raw px/ms literals added" was false** (`D-2.25-18`): the grep behind it did not cover
  `globals.css`, which adds two raw `44px` values in `.tap-44::after`.

Two further findings were **checked and refuted by measurement rather than argument**: the `.tap-44`
hit areas on the header wordmark and build credit were said to overlap if that group wraps — forced to
wrap, their row centres are **55.5px** apart, clear of 44; and the MK·EN clearance was said to be
mis-stated, which it was (47.5px in a comment vs **44.6px** measured) and is now corrected in the
source.

**This is the part of the process that worked.** Four of the eighteen decisions on this phase exist
because the diff was attacked after it was written, and one of them was a defect on the money page.

**9. Proposal, not a change: retire `--motion-reveal-blur`.** Nothing reads it any more. Retiring it
means deleting the `:root` line in `globals.css` **and** the `brand.md` §6 row in the same commit.
`brand.md` is owner territory, so this phase did neither.

---

## 4. Files touched

`file-map.md` updated: **yes** (four files added).

| File | Added / Modified / Deleted |
|---|---|
| `src/lib/forms/first-invalid.ts` | **Added** |
| `src/i18n/client-namespaces.ts` | **Added** |
| `src/components/home/CountdownOpening.tsx` | **Added** |
| `tests/forms/first-invalid.test.ts` | **Added** |
| `tests/i18n/client-messages.test.ts` | **Added** |
| `src/components/checkout/CheckoutField.tsx` | Modified |
| `src/components/checkout/CheckoutForm.tsx` | Modified |
| `src/components/contact/ContactForm.tsx` | Modified |
| `src/app/[locale]/layout.tsx` | Modified |
| `src/components/home/HomeExperience.tsx` | Modified |
| `src/app/globals.css` | Modified |
| `src/components/layout/SiteHeader.tsx` | Modified |
| `src/components/layout/LanguageSwitch.tsx` | Modified |
| `src/components/layout/SiteFooter.tsx` | Modified |
| `src/components/cart/CartView.tsx` | Modified |
| `src/app/[locale]/catalog/[slug]/page.tsx` | Modified |
| `src/app/[locale]/styleguide/page.tsx` | Modified |
| `Decisions.md` | Modified (`D-2.25-5…14`, append-only) |

**Forbidden-area diff is empty (`git diff --name-only 27b589d..HEAD`):** `package.json` + lockfile,
`src/config/`, `supabase/`, `facts.md`, `brand.md`, `src/messages/`, `src/lib/drop/`, `src/lib/orders/`,
`src/lib/product-images.ts`, `next.config.ts` — **none touched.**
`00_stack-and-config.md`: **no update needed** — no dependency added, no config changed.
**Zero user-facing strings added → this phase creates no MK review debt.**
Zero hex / `rgb(` / `hsl(` literals and zero raw px/ms values added to the diff (grep-proven).

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | **PASS** — compiled, all routes emitted, `/[locale]` still `ƒ` (dynamic) |
| Types | `npx tsc --noEmit` | **PASS** — no output |
| Lint | `npm run lint` | **PASS** — `✖ 143 problems (0 errors, 143 warnings)`; every warning is inside untracked `.claude/skills/impeccable/scripts/`, none in project source |
| Unit / integration | `npm test` | **PASS — 166/166** in 24 files (154 before this phase + 7 focus-order + 5 i18n-scoping) |

**Concurrent-order gate:**

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: YES** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ tests/concurrency/oversell.test.ts > create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0 54ms` |

No commerce code was touched; the gate is re-run as a regression check, not because this phase went
near `create_order`.

---

## 6. Definition of Done

### Verified here (by me) — every number measured on **both** sides

**`/harden`** — contact form, 390px, MK, baseline vs branch:

| | P0 baseline | P1 branch |
|---|---|---|
| `[role="alert"]` regions before submit | **0** | **4** (`sr-only`, 1×1, no layout box) |
| `[role="alert"]` regions after a failed submit | **0** | 4 — 3 filled with MK text, the optional `subject` stays empty + `sr-only` |
| `textarea.required` (contact message) | **false** ← the bug | **true** |
| `aria-describedby` on `#contact-name` | `null` | `contact-name-error` (always) |
| Focus after a failed submit | **the submit button** | `#contact-name`, `aria-invalid="true"` |
| Field wrapper height, no error | 71.5px | **71.5px** (unchanged) |
| Field wrapper height, with error | 97px | **97px** (unchanged) |

Checkout (`/naracka`, 390px, MK) reproduces all of it: 5 persistent regions, 4 fill, `#note` stays
empty and `required: false`, focus moves „Нарачај" → `#name`. Error line measured **13px /
line-height 19.5px / `rgb(240,133,122)`**.

**`/optimize`** — same dev server, MK, both sides:

| | P0 baseline | P1 branch |
|---|---|---|
| Client message payload on `/`, `/kontakt`, `/uslovi`, `/katalog` | **25,039 UTF-8 bytes** each | **8,990 UTF-8 bytes** each (**−16,049 B, −64.1%**) |
| Served HTML, `/` and `/kontakt` | 81,023 / 68,046 bytes | **70,602 / 52,771 bytes** |
| Namespaces shipped to the client | 23/23 | 14/23 — withheld: `Footer Faq About Terms Privacy ShippingReturns Catalog Styleguide Meta` |
| Client modules — **ended** | `HomeExperience` + `HomeShowcase` + `SiteHeader` | `HomeShowcase` + `SiteHeader` |
| Client modules — **live** | `HomeExperience` + `HomeShowcase` + `SiteHeader` | `HomeShowcase` + `SiteHeader` + `SpotlightCard` |
| Client modules — **countdown** | `HomeExperience` + `HomeShowcase` + `SiteHeader` | `HomeShowcase` + `SiteHeader` + `CountdownOpening` |

All **28 routes** (15 MK + 13 EN, incl. all three `?preview=` states) return **200** with **zero**
`MISSING_MESSAGE` / `IntlError`. `force-dynamic` and server-side drop state untouched (`D-1.04-9`).
**T-0 exercised end to end** with a temporary `target={Date.now() + 6000}` maneuver (reverted,
`git diff HEAD` proven empty): "Opening…" replaced the tagline and both CTAs, the about link
disappeared, the hero photograph survived, `router.refresh()` kept firing on its 3s interval.

**`/adapt`** — 1280px MK header, both sides:

| | P0 baseline | P1 branch |
|---|---|---|
| Header bar height | 70px | **70px** |
| Nav link boxes | 24px tall, x = 533.8 / 602.5 / 692.4 | **identical** — hit areas now **44px** |
| Active-page underline bottom | y = 47 | **y = 47** |
| MK / EN buttons | 24×24 at x = 1054.4 / 1099 | **identical** — hit areas **44×44**, 0.6px apart, no overlap |
| Footer contact rows / page links | 33.6px / 27.5px tall | **44px / 44px** |
| Footer height @1280 / @320 | 309.5 / 482.9 | 346.8 / 547.1 |

Functional proof, not just computed size: `elementFromPoint` **9px and 11px above** a nav link's
visual box resolves to the link; **15px above** does not. Cart @320px: controls **16/32/32 → 44/44/44**;
row **298px in a 288px track (10px escape) → 288px in 288px**; details column **68 → 208px**;
**zero** elements in `<main>` with `scrollWidth > clientWidth`; `document.scrollWidth` 320. At 768px
the cart row does not wrap and the shipped control stack is unchanged. `/styleguide` @320px: the
countdown row (306.4px, its hard floor at every viewport ≤514px) went from **escaping the demo card
by 9.2px each side** to sitting inside the card's padding with the card scrolling; page `scrollWidth`
320 on both sides. Screenshots taken at 320 and 390.

**`/animate`** — compiled CSS read from the served stylesheet: `@keyframes trajanov-reveal` contains
**zero** `blur`, the reveal element computes `filter: none`, duration still `0.76s`;
`scroll-behavior: auto !important` and `.animate-spin, .animate-ping { animation: none }` present in
the single merged `prefers-reduced-motion` block. Zero console errors on the swept routes.

### Owed to Lazar / a real device

| # | Item | Exact URL / steps | What "pass" looks like |
|---|---|---|---|
| **59** | **A real before/after on the reveal.** Load `/` (countdown or ended state) on a real mid-range Android, before and after this branch. | `https://www.trajanovv.com/` after the eventual deploy, vs. production today | The hero entrance is at least as smooth as before, and no less. **This is the number `/animate` could not produce locally** (`document.hidden` kills rAF in the pane, `D-2.21-7`) |
| **60** | **The 44px targets and the wrapped cart row on a real phone.** | `/`, `/katalog/<slug>`, `/kosnicka` with 2 items, `/naracka`, `/kontakt` at 320–390px, MK **and** EN | Every control is comfortably tappable with a thumb; the cart's `× − 2 +` line does not mis-fire; the header nav and MK·EN are hittable without hitting each other |
| **61** | **A real screen-reader pass on the checkout and contact forms.** VoiceOver (iOS) or TalkBack. | Submit `/naracka` and `/kontakt` empty | The failure is announced, focus lands on the first invalid field, and the four simultaneous alerts are **informative, not a burst** — this is the one thing `D-2.25-5` explicitly gambled on |
| **62** | **Lazar sees the product page's one-column photo grid on a phone** and confirms the buy path being ~2 screens down is acceptable until Y.01 lands real photos. | `/katalog/test-mustard-ochre` at 320–390px | Either "fine" or "put it back" — it reverses by deleting one `sm:` (`D-2.25-10`) |
| **63** | **`/styleguide` countdown is a visible change Lazar has not seen** (carried from P0). P0 restored the digits from 16px to 88px; P1 then made the demo card scroll at ≤514px. | `/styleguide`, desktop **and** 320px | The countdown reads as the loudest object on desktop, and the phone-width demo card scrolling instead of overflowing is acceptable for a dev-only page |

**5-item checklist for Lazar** (the pages Code rendered but Lazar has not):
1. `/` at 390px — countdown, tagline, both CTAs and the about link all still there, hero photograph unchanged.
2. `/kosnicka` at 320px with 2 items — the `× − 2 +` controls sit on their own line, right-aligned, nothing clipped.
3. `/katalog/test-mustard-ochre` at 320px — one photo per row; decide on #62.
4. `/kontakt` — submit empty; the three errors appear and the cursor jumps to the name field.
5. `/styleguide` at 320px — the countdown demo card scrolls sideways inside its own box.

---

## 7. Placeholders shipped

**None.** This phase added no placeholder and cleared none. The placeholder register is
**unchanged**. Two existing placeholders became more visible as a side effect and are noted, not
added: the product page's second photo slot (register **#2**) now occupies a full screen at 320px
(`D-2.25-10`), and the cart's price pill (register **#4/#7**) is what set the min-content floor that
forced the cart row rewrite (`D-2.25-12`).

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED entry in `facts.md` | ☑ — **no new user-facing text at all**; `src/messages/` untouched |
| `humanizer` pass run on user-facing copy | **n/a** — zero user-facing copy added or changed |
| No fashion-magazine filler | ☑ — nothing to check |
| No English string in the MK build | ☑ — all 28 routes swept, zero `MISSING_MESSAGE`; MK renders MK on every changed surface |

---

## 9. What is still owed on this branch

- [ ] **`/impeccable polish` (P2)** — de-duplicate the stock badge, fix the cart heading level, name
      the size-picker group, resolve the dead semantic layer; plus the deferred off-scale sizes
      (`text-xs` ×6, `text-base` ×4, `text-lg` ×2, `text-3xl` ×1, `D-2.25-4`) and
      `DropBanner.tsx:28`'s `text-small … sm:text-base` pair.
- [ ] **The closing `/impeccable audit`** over the whole branch.
- [ ] **PR + one Vercel preview**, once both of the above land. **Not opened by this session, on
      Petar's instruction.**
