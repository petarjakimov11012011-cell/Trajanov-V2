# Completion report — Part 2 Phase 19: Wordmark hover shine

> **⚠️ ONE DEVIATION FROM THE BRIEF — read this first (`D-2.19-6`).**
> The brief's Task 1 says *"Use `--ease-out` (the site default) for the sweep."* **I shipped `linear`
> instead**, on measurement, not taste. Seeking the real animation frame by frame in the browser,
> `--ease-out` (`cubic-bezier(0.16, 1, 0.3, 1)`) drove `--wordmark-x` to **63.9% at t=112ms** and
> **108.6% at t=225ms** — the band of light had already passed the right edge of the glyphs a quarter of
> the way into the 900ms, so the *visible* sweep lasted **~150ms** and the remaining ~710ms was the band
> drifting off-screen where nobody sees it. That reads as a flick or a flash, which is the failure mode
> `D-2.19-4` and the reduced-motion rule both exist to avoid. On `linear` the same measurement gives
> **0% at 200ms, 50% at 450ms, 100% at 700ms** — 200ms lead-in, ~500ms actually crossing the letters,
> 200ms lead-out. `--motion-shine` stays at the brief's 900ms and no token was invented or repointed.
> **It is a one-word revert** (`linear` → `var(--ease-out)`) if the orchestrator prefers the brief's
> version. Owed **#36**. Everything else in the phase is orchestrator-specified and shipped as written.

| | |
|---|---|
| **Phase** | 2.19 |
| **Name** | Wordmark hover shine |
| **Executor** | Claude Code |
| **Operator** | Petar (Lazar reviews) |
| **Date** | 2026-07-25 |
| **Branch** | `phase-2.19-wordmark-shine` |
| **PR** | to `main`, **not self-merged** (`D-0-3`) |
| **Brief** | `briefs/` — Part-2-Phase-19-Code (wordmark hover shine) |

---

## 1. What shipped

- **The TRAJANOV wordmark now tells you it is a link.** Hover it — or tab onto it — and a single band of
  light travels once across the letters, ~0.9s, then stops. It is the link home on every page, and until
  now nothing said so except the cursor changing.
- **One sweep, never a loop.** No `infinite`, no mount animation, no tap scale (`D-2.19-4`). The header is
  sticky on every route in both locales, so a shimmering wordmark would be a permanently moving object in
  the corner of every page — the exact thing `brand.md` §6 exists to prevent.
- **Fine pointers only.** Gated on `@media (hover: hover) and (pointer: fine)`, which is what keeps it
  inert on touch — and inert in the mobile menu overlay, whose wordmark shares the same class string.
- **Removed entirely under reduced motion, not flattened.** The global reduced-motion rule would compress
  a 900ms travel into a single-frame flash; a dedicated rule drops the animation *and* the gradient, so
  the mark renders as a plain off-white wordmark instead.
- **No new dependency, no new string, no new fact, no commerce path touched.** Pure CSS (`D-2.19-2`), one
  new token, one new CSS block, and exactly **one changed line** of TSX.

---

## 2. Decisions I made on my own

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| `D-2.19-6` | The sweep runs **`linear`**, not `var(--ease-out)` — a deliberate deviation from the brief's Task 1, made from in-browser measurement | `var(--ease-out)` as the brief instructs. Measured: it puts the band past 100% by t=225ms of 900ms, so the visible sweep is ~150ms followed by ~710ms of invisible drift — a flick, not a shine. Same objection `D-2.18-2` raised against `--ease-out` on the header contract, applied to a travel rather than a settle | The sweep is now the one animation on the site using neither `--ease-out` nor `--ease-smooth`, so §6's "default easing for all of the above" no longer covers every animation literally. `linear` is a CSS keyword, not an inlined design value (same category as 2.18's brief-authorised `visibility 0s linear`) — no token invented, none repointed. **One-word revert.** |

`D-2.19-1` … `D-2.19-5` were **pre-made by the orchestrator** in the brief and appended to `Decisions.md`
verbatim; they are not my decisions and are not listed above.

**Two implementation notes, both inside what the brief authorised, so not stand-alone decisions:**
- **I picked `background-clip: text` over the masked-overlay route.** The brief said either was acceptable
  and to say which and why. A mask overlay needs *glyphs to mask*, which means re-emitting the wordmark's
  text (`content: attr()` or a duplicate node) — that pushes a translated string into CSS and a duplicate
  into the accessibility tree. `background-clip: text` needs neither, and its `-webkit-` form is the
  oldest and most uniformly supported of the two in WebKit; `mask-composite` is the part of the mask
  route Safari has historically been weakest on, which `D-2.10-3` already notes for the spotlight card.
  **Caveat, stated plainly: the in-app Browser pane is Chromium, so this is a reasoned choice about
  Safari, not a Safari observation.** No WebKit engine was available — same limit as owed #33.
- **A graceful-degradation guard the brief did not ask for.** `--wordmark-x: 100%` is declared in the rule
  itself as well as being registered via `@property`. Without it, a browser lacking `@property` would drop
  the at-rule, leave `var(--wordmark-x)` invalid, take `background-image` down with it — and, because
  `-webkit-text-fill-color: transparent` would still apply, render an **invisible wordmark**. With it, such
  a browser gets a plain off-white wordmark and no sweep.

---

## 3. Surprises and off-spec changes

- **The brief's easing instruction did not survive measurement.** Covered above and in `D-2.19-6`. Worth
  the orchestrator's attention as a pattern: `--ease-out` is the right default for *settling* a property,
  and the wrong default for *travelling* something across a surface. `D-2.18-2` reached the same
  conclusion for the header six hours earlier in project time. If a fifth motion request involves travel,
  the brief should probably not prescribe `--ease-out` by reflex.
- **Lightning CSS rewrote my `color-mix` into a fallback pair — automatically, and correctly.** The served
  CSS carries the gradient twice: once with a plain `var(--color-mustard)` stop, then an
  `@supports (color: color-mix(in lab, red, red))` block with the real
  `color-mix(in srgb, var(--color-mustard) 65%, var(--color-foreground))`. Both are tokens only, so the
  §3 "no literal colour" rule holds in the emitted bytes as well as the source. Flagging it so nobody
  reads the built CSS, sees two gradients, and thinks a duplicate was committed.
- **Turbopack's dev CSS cache served stale bytes across an edit to `globals.css`.** After changing the
  easing, the browser kept getting `var(--ease-out)` — through a `touch`, a hard reload, *and* a dev-server
  restart. `rm -rf .next` plus a restart fixed it. **This is a real trap for a CSS-only phase: I would have
  "verified" the old code and reported it as the new code.** The tell was that
  `getComputedStyle(...).animationTimingFunction` still read `cubic-bezier(0.16, 1, 0.3, 1)` after the
  edit. Anyone verifying CSS in the pane should assert the served bytes (`curl` the emitted chunk) against
  the source before trusting a measurement.
- **`requestAnimationFrame` samplers do not work in the Browser pane** — the compositor clock freezes
  between JS calls (2.18 hit the same wall), so an rAF loop armed in one call collects **zero** samples
  while a `computer` hover happens in the next. I switched to the Web Animations API instead: pause the
  animation with an injected `animation-play-state: paused`, then set `Animation.currentTime` and read the
  computed style at each seeked time. That is *more* rigorous than sampling, not less — it is deterministic
  and reproducible, and it is how the frame tables in §6 were produced. Recommend future motion briefs ask
  for this method by name.
- **The pane reports a fine pointer at every viewport width.** `matchMedia('(hover: hover) and (pointer:
  fine)')` matched even at 390px, and there is no coarse-pointer emulation available. So the DoD line
  *"the overlay wordmark does not animate — the `hover: hover` guard holds"* could **not** be observed the
  way it was written. What I could prove: the overlay wordmark is unanimated and plain off-white when not
  hovered/focused, and the guard is present in the served CSS and in the CSSOM. The touch-device inertness
  itself folds into owed **#36**.
- **The pane's default locale is EN, and `/` redirects to `/en`.** My first pass of measurements was
  silently all-EN — I caught it when a check returned `path: "/en"`. MK needs `document.cookie =
  'NEXT_LOCALE=mk'` then a navigation to `/`. Every measurement in §6 was re-run on MK after that. Worth
  putting in a brief: *"confirm `document.documentElement.lang` before recording a locale measurement."*
- **`main` had not moved.** `origin/main` was at `c3d5673` (the PR #30 record). Clean base, no second phase
  branch open.

---

## 4. Files touched

`file-map.md` updated: **no** — no file was added, moved, or deleted that the tree tracks (the three code
files already exist; the tree lists the `completions/` directory, not each report).
`00_stack-and-config.md`: **no change** (no dependency, no config, no pin).

| File | Added / Modified / Deleted |
|---|---|
| `src/app/globals.css` | Modified (1 new `:root` token; new `@property` + `@keyframes` + `.wordmark-shine` block; dedicated reduced-motion rule) |
| `src/components/layout/SiteHeader.tsx` | Modified (**one line** — `wordmark-shine ` on `wordmarkClass`) |
| `brand.md` | Modified (§6: +1 token row, fourth-exception paragraph, exception count corrected to four) |
| `Decisions.md` | Modified (appended `D-2.19-1…6`) |
| `src/_project-state/current-state.md` | Modified (2.19 Status block; owed #36; `NEXT:` unchanged) |
| `src/_project-state/completions/Part-2-Phase-19-Completion.md` | Added (this file) |

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | ✅ exit 0 — "✓ Compiled successfully in 2.4s", full route tree |
| Types | `npx tsc --noEmit` | ✅ exit 0 |
| Lint | `npm run lint` | ✅ exit 0, clean |
| Unit / integration | `npm test` | ✅ **116/116** (19 files), unchanged count — no test file touched |

**Concurrent-order gate:**

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ tests/concurrency/oversell.test.ts > create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0 113ms` |

---

## 6. Definition of Done

### Verified here (by me) — gates

| Item | Result |
|---|---|
| `npm run build` / `npx tsc --noEmit` / `npm run lint` all exit 0 | ☑ |
| `npm test` **116/116**, unchanged, incl. the 10-vs-3 oversell gate | ☑ |
| `git diff main -- package.json package-lock.json` **empty** — no new dependency | ☑ |
| `git diff main -- src/messages/` **empty** — still **243** keys | ☑ |
| `git diff main -- src/components/layout/SiteHeader.tsx` is **one changed line** (`git diff --numstat` → `1  1`) | ☑ |
| `grep` over the new CSS block: **no** literal hex, **no** `rgb(`, **no** `hsl(`, **no** `--primary` | ☑ |
| `--motion-fast/base/slow/drop/reveal`, `--ease-out`, `--ease-smooth`, `--motion-stagger`, `--header-bar-max-scrolled`, `--header-blur` all hold their pre-2.19 values — this phase **adds** a token, repoints none | ☑ |
| `.header-shell` / `.header-bar` / `.header-credit` blocks byte-unchanged | ☑ |
| `brand.md` and `globals.css` `:root` agree on `--motion-shine` = **900ms** (checked, not assumed) | ☑ |
| `facts.md` untouched; placeholder register unchanged | ☑ |

### Rendered and measured in-browser (both locales, 320/390/768/1024/1280; Home, Catalog, Checkout)

**Method note:** the pane's compositor clock freezes between JS calls, so timings were not sampled — the
animation was paused via an injected `animation-play-state` and seeked with `Animation.currentTime`, then
computed style read at each time. Deterministic, and reproducible from the tables below.

| Item | Result |
|---|---|
| At `scrollY = 0`, fine pointer: hovering runs **one** sweep, it ends, and it does not restart — after completion there is **no animation object** and `--wordmark-x` sits at its specified `100%` | ☑ |
| Frame table (`linear`, 900ms): `-40%` @0 · `-20%` @100 · `0%` @200 · `20%` @300 · `50%` @450 · `80%` @600 · `100%` @700 · `120%` @800 · `140%` @880 — band on the glyphs from ~200ms to ~700ms | ☑ |
| `animation-duration 0.9s`, `animation-iteration-count 1`, `fill none`, `direction normal`, `delay 0` | ☑ |
| Resting wordmark **byte-identical to pre-2.19**: `color rgb(236,232,224)`, `background-image: none`, `animation-name: none` — the gradient and transparent fill apply **only** while hovered/focused | ☑ |
| Scrolled (`data-scrolled="true"`, bar `max-width 768px`, `radius 14px`, `blur(12px)`, translucent): the sweep still runs and is visible in the pill | ☑ |
| `getBoundingClientRect()` **identical** at rest / every seeked mid-sweep frame / after: `89,23,135.039,24` (scroll-top) and `281,31,135.039,24` (scrolled). Nav centre X pinned at **640**, credit X at **236.039** throughout | ☑ |
| `<header>` computes `transform: none`, `filter: none`, `backdrop-filter: none`, `will-change: auto`, `contain: none` — on every route, both scroll states (2.17 hard stop #2) | ☑ |
| Tab to the wordmark **with the mouse parked elsewhere**: `:focus-visible` matches, the sweep fires **and** the ring renders (`rgb(242,197,90) 0 0 0 2px` = `--color-focus-ring`), mid-sweep too | ☑ |
| The Vertex credit link, tabbed to, gets **no** gradient and **no** animation — the effect is scoped to the wordmark only | ☑ |
| At 390 with the overlay open: overlay wordmark carries the class but is unanimated, `background-image: none`, plain `--color-foreground`. Overlay opens, is `fixed inset-0` `role="dialog" aria-modal`, focuses the X, locks body scroll, Escape closes and returns focus to the burger | ☑ (touch inertness itself → owed #36, see below) |
| The `hover: hover` guard **observed** on a coarse pointer | ☐ — **not possible**: the pane reports `(hover: hover) and (pointer: fine)` at every width and has no coarse-pointer emulation. Guard verified in the served CSS + CSSOM. Owed **#36** |
| `prefers-reduced-motion: reduce`: **no sweep, no flash, no flicker** | ☑ *by CSSOM + simulation* — exactly **one** dedicated `.wordmark-shine` reduced-motion rule, ordered **after** the hover rules, setting `animation: none` + `background-image: none` + `-webkit-text-fill-color: currentcolor`; injecting those exact declarations gives a hovered wordmark with **zero** animations and plain `--color-foreground`. The pane cannot toggle real DevTools emulation → live read owed **#36** |
| Contrast, three measured ratios on `--color-ground` `#0F1210`: **rest 15.42:1** (`#ECE8E0`) · **brightest frame 15.42:1** (the sweep has only two stop colours, so the brightest painted pixel is the resting off-white) · **dimmest frame 10.84:1** (band centre `#E6BF75` = `color-mix(--color-mustard 65%, --color-foreground)`) | ☑ |
| Same three over `--color-ground-translucent`: **15.42 / 15.42 / 10.84** composited over ground; worst realistic backdrop (the pill over the mustard live banner, `#352D18`): **11.16 / 11.16 / 7.84** | ☑ — all well above 4.5 |
| No horizontal overflow at 320 / 390 / 768 / 1024 / 1280, in both header states, both locales | ☑ |
| Zero **new** console errors | ☑ — console buffer had no errors at all. The Next dev overlay shows "1 Issue" on **MK routes only**, consistent with the documented `ProductCard.tsx:59` MK price hydration mismatch. **Pre-existing, recorded unchanged, not fixed** — `ProductCard.tsx` is byte-unchanged and a static className on a compile-time constant cannot produce a hydration mismatch |
| Screenshots: **MK 1280 resting**, **MK 1280 mid-sweep**, **MK 1280 scrolled mid-sweep**, **EN 1280 mid-sweep**, **MK 390 overlay open** | ☑ |

### Owed to Lazar (only he / a real device can confirm)

| # | Item | Exact URL / steps | What "pass" looks like |
|---|---|---|---|
| 36 | Wordmark shine sign-off — **incl. ratify or strike `D-2.19-6`** | `https://www.trajanovv.com` and `/en`, on a desktop **with a mouse** and on a **real phone**, at the top of the page and scrolled | Desktop: hovering TRAJANOV runs **one** band of light (~0.9s) and stops; nothing moves when the pointer is elsewhere; works in the scrolled pill; Tab does the same **and** shows the mustard ring. **(a)** Confirm the `linear` easing reads right, or ask for the brief's `var(--ease-out)` back (one-word revert). **(b)** On a phone: tapping the wordmark shines **nothing** and leaves no stuck hover state. **(c)** With "Reduce Motion" on: no sweep, **no flash**, no flicker — plain off-white wordmark |

---

## 7. Placeholders shipped

**None.** This phase adds no `[PLACEHOLDER: …]` and clears none. Placeholder register **unchanged**.

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to VERIFIED in `facts.md` | ☑ (`facts.md` byte-unchanged; a gradient makes no factual claim) |
| `humanizer` pass run on user-facing copy | n/a (no user-facing copy changed) |
| No fashion-magazine filler | ☑ (no copy) |
| No invented testimonials / reviews / counts / awards / partners / team / address | ☑ |
| Template-propagated strings verified once against `facts.md` | n/a (no string added) |
| No AI-generated product imagery (`D-0-6`) | ☑ |
| No untranslated EN string in the MK build | ☑ (zero string change — catalogs byte-identical, 243 keys) |

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ☑ |
| `.env*` still gitignored | ☑ |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ☑ (none added) |
| No order PII in logs | ☑ (no logging added) |

No secret was committed at any point in this branch's history.

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| Wordmark-shine real-device feel; **ratify or strike `D-2.19-6`**; touch-device inertness read; live reduced-motion read (#36) | Deploy + a phone + a desktop mouse | Lazar / Petar |
| Safari/WebKit confirmation that `background-clip: text` renders the sweep correctly | An actual WebKit engine — the pane is Chromium (same limit as owed #33) | Lazar |

Nothing blocks the merge. Both items are post-deploy confirmations, consistent with every out-of-band UI
phase since 2.13 — with the added, explicit ask that Lazar **ratify or strike the `linear` easing**.

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ☑ (byte-unchanged, as required — verified by diff) |
| `current-state.md` — owed-verification register | ☑ (+1: **#36**, matching the brief's number — the register stood at #35 after 2.18) |
| `current-state.md` — placeholder register | ☑ (unchanged) |
| `file-map.md` — matches disk | ☑ (no tree change) |
| `00_stack-and-config.md` — new deps / pins / config | ☑ (unchanged — none) |
| `Decisions.md` — every §2 entry appended | ☑ (`D-2.19-1…6`, append-only; nothing edited or deleted) |

**`NEXT:` line I set:** unchanged — `NEXT: 2.06 operator half — the LIVE drop rehearsal …` (2.19 is
out-of-band and does not advance the critical path).
