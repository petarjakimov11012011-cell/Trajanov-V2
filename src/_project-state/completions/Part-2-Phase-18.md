# Completion report — Part 2 Phase 18: Header retime + credit drop-out on scroll

> **⚠️ ONE ITEM LAZAR HAS NOT EXPLICITLY APPROVED — read this first (`D-2.18-5`).**
> This phase folds **two** changes into one PR. The header fix (slower/smoother contract + the credit
> fading out of the pill + a further contract to 48rem) is the phase's subject and was fully specified.
> The **Home hero retime** — `--motion-drop` 480ms borrow → a dedicated `--motion-reveal` 760ms, and the
> stagger 70ms → 110ms — is the **"A" option put to Lazar after 2.16 and never separately answered**. The
> brief folded it in because both complaints are the same complaint (the motion is too quick to read), but
> **Lazar has not said yes to it.** It is **one token pair, isolated in Task 5, trivially revertible** (set
> `--motion-reveal` back to `var(--motion-drop)` and `--motion-stagger` back to `70ms`). **He can strike it
> in review** — owed **#35**. Everything else in the phase is orchestrator-specified and shippable as-is.

| | |
|---|---|
| **Phase** | 2.18 |
| **Name** | Header retime + credit drop-out on scroll (retune of 2.17 + 2.16) |
| **Executor** | Claude Code |
| **Operator** | Petar (Lazar reviews) |
| **Date** | 2026-07-25 |
| **Branch** | `phase-2.18-header-retime` |
| **PR** | to `main`, **not self-merged** (`D-0-3`) |
| **Brief** | `briefs/` — Part-2-Phase-18-Code (header retime + credit drop-out) |

---

## 1. What shipped

- **The scroll-reactive header now settles instead of snapping.** 2.17 contracted the pill in 220ms on
  `--ease-out`, a curve that front-loads almost all its movement — right for a hover, wrong for a bar
  changing width, radius, background and blur at once. It now runs on a dedicated **`--motion-slow` (420ms)**
  over a new symmetric **`--ease-smooth` (`cubic-bezier(0.65, 0, 0.35, 1)`)** — header only; `--ease-out`
  stays the site default (`D-2.18-1/2`).
- **The "Built by Vertex Consulting" build credit drops out of the pill as it contracts.** As the header
  scrolls into its pill, the desktop credit fades out and leaves the flex flow via `position: absolute`
  (no insets), so the left side stops looking heavy at the moment the bar is trying to look compact
  (`D-2.18-3`). `visibility: hidden` is transitioned in behind the fade so the Vertex link leaves the tab
  order once it's gone — an `opacity: 0` link would still be tabbable, a WCAG 2.2 failure (`D-2.18-4`).
- **The pill contracts a little further, 56rem → 48rem** — 56rem was sized when the credit was still in the
  bar (`D-2.18-5`).
- **The Home hero reveal is retimed** to read as deliberate: `--motion-reveal` 760ms (replacing the borrowed
  `--motion-drop`) and the stagger 70ms → 110ms. `--motion-drop` itself is left at 480ms (`D-2.18-5`).
- **Nothing structural changed.** No new element, link, string, state, listener, or dependency. The scroll
  mechanism, sticky positioning, `data-scrolled` switch and blur all stay exactly as 2.17 shipped. Catalogs
  stay at **243** keys. `SiteHeader.tsx` is a **one-line** diff (a single className).

---

## 2. Decisions I made on my own

**None this phase.** All five (`D-2.18-1…5`) were **pre-made by the orchestrator** in the brief and appended
to `Decisions.md` verbatim. Unlike 2.17 (where the brief's CSS contradicted its own DoD and forced a
judgement call, `D-2.17-7`), the 2.18 CSS was shippable exactly as written — the credit drop-out technique
(`position: absolute` with no insets over an fr-centred grid) reflows nothing at scroll-top, so the 2.17
resting invariant holds without any deviation, and no new decision was needed.

**Two implementation notes, both explicitly authorised by the brief and therefore not stand-alone decisions:**
- The credit block's `visibility 0s linear 0s` / `... var(--motion-slow)` uses the literal `0s`/`linear` —
  these are brief-specified verbatim (a zero-duration structural step for the visibility flip, not a design
  value being inlined), the same category as 2.17's authorised `0.5rem`/`1px`.
- The three new tokens (`--motion-slow`, `--ease-smooth`, `--motion-reveal`) live in `:root` only, **not**
  `@theme inline`, following the `--glow-*` / existing-`--motion-*` "read via `var()`, not a utility"
  precedent. `--ease-out` is in `@theme inline` for a legacy `ease-out` utility; `--ease-smooth` is consumed
  only via `var()` in the header block, so it stays out.

---

## 3. Surprises and off-spec changes

- **The brief's owed-row number is one behind — I shipped it as `#35`, not `#34`.** The brief (Task 7 + DoD)
  numbers the new owed item **#34** and says the register grows **+1**. But the register was already **at #34**:
  2.17 shipped **+3** owed rows (#32/#33/#34), one more than *its* brief's "+2", because Code added a
  Lighthouse row (#34) that the 2.18 brief author didn't know about. So the correct next number is **#35**.
  I added **one** row (the "+1" count is right) numbered **#35**. This is the same class of off-by-one 2.17
  itself flagged. Nothing is lost; the brief's absolute number was simply stale.
- **`--ease-out` appears in `@theme inline`; `--ease-smooth` deliberately does not.** Worth stating explicitly
  so a future reader doesn't "fix" the apparent asymmetry: `--ease-smooth` is header-only and read via `var()`,
  so per the codebase's own precedent it is not a utility. Adding it to `@theme inline` would be the change to
  revert, not the omission.
- **Browser-pane rendering quirks (test harness, not the product) — same three 2.17 hit, same workarounds.**
  (a) A programmatic `window.scrollTo()` doesn't dispatch scroll events to the SiteHeader listener in the pane
  — I drove `data-scrolled` with `scrollTo` + an explicit `dispatchEvent(new Event('scroll'))`, reading the
  result in a *separate* call so React's state update had flushed. (b) The pane's compositor clock freezes
  between pure-JS calls, so a mid-transition `getComputedStyle` reads the *start* value — I measured settled
  targets by injecting a temporary `transition: none` and removing it after. (c) The sticky pill mis-composites
  vertically in some scrolled screenshots — I captured the scrolled pill at a small offset over the mustard
  banner so its appearance + the credit's absence show correctly; the geometry is proven by
  `getBoundingClientRect`/`elementFromPoint` regardless. A real wheel-scroll gesture also hung the pane once
  (30s timeout) — switched to the JS-driven scroll.
- **`main` had not moved.** `origin/main` was at `76f964f` (PR #29 record); no keep-alive bot commit this time.
  Clean base, no second phase branch open.

---

## 4. Files touched

`file-map.md` updated: **no** — no file was added, moved, or deleted that the tree tracks (the three code
files already exist; only docs were appended to, and the tree lists the `completions/` directory, not each
report). `00_stack-and-config.md`: **no change** (no dependency, no config, no pin).

| File | Added / Modified / Deleted |
|---|---|
| `brand.md` | Modified (§5 max-width 56→48rem + note; §6 +3 token rows, stagger 70→110ms, header-exception prose) |
| `src/app/globals.css` | Modified (3 `:root` tokens + 2 existing value changes; retimed 9 transition pairs; new `.header-credit` block; hero duration token) |
| `src/components/layout/SiteHeader.tsx` | Modified (**one line** — `header-credit ` on the bar credit `<p>`) |
| `Decisions.md` | Modified (appended `D-2.18-1…5`) |
| `src/_project-state/current-state.md` | Modified (2.18 Status block; owed #35; `NEXT:` unchanged) |
| `src/_project-state/completions/Part-2-Phase-18.md` | Added (this file) |

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | ✅ exit 0 — "✓ Compiled successfully in 2.4s", full route tree |
| Types | `npx tsc --noEmit` | ✅ exit 0 |
| Lint | `npm run lint` | ✅ exit 0, clean |
| Unit / integration | `npm test` | ✅ **116/116** (19 files), unchanged count |

**Concurrent-order gate:**

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0` |

---

## 6. Definition of Done

### Verified here (by me) — gates

| Item | Result |
|---|---|
| `npm run build` / `npx tsc --noEmit` / `npm run lint` all clean | ☑ |
| `npm test` — **116/116**, incl. the concurrent-order test | ☑ |
| `git diff --name-only main` = only `brand.md`, `globals.css`, `SiteHeader.tsx` + state/decision/report docs | ☑ |
| `git diff main -- package.json package-lock.json src/messages/` empty — catalogs stay at **243** | ☑ |
| `git diff main -- src/components/layout/SiteHeader.tsx` is **one line** | ☑ |
| `--motion-fast`, `--motion-base`, `--motion-drop`, `--ease-out` all still hold their pre-2.18 values (120/220/480ms + the ease) | ☑ |
| No literal hex/`px`/`ms` added inside any CSS block; no `!important`; no `display: none` on the credit | ☑ (only the brief-authorised `0s`/`linear` visibility step) |
| `brand.md` and the `globals.css` `:root` agree on every value | ☑ |
| `facts.md` untouched; placeholder register unchanged | ☑ |

### Rendered and measured in-browser (both locales, 320/390/768/1024/1280; Home, Catalog, Checkout)

| Item | Result |
|---|---|
| At `scrollY = 0` every header rect + computed style identical to `main`'s (credit `position: static`, header 71px, bar 1152px) — 2.17 `D-2.17-3` invariant holds | ☑ |
| Scrolled: bar computes `max-width 768px`, transitions run at **420ms** on `cubic-bezier(0.65,0,0.35,1)`; credit `opacity 0` / `visibility hidden` / `position absolute` | ☑ |
| Nothing but the credit moves during the contract — nav on the centreline (≤ 0.01px), cart right edge tracks only the max-width change, no vertical movement / wrap / height change | ☑ |
| Keyboard: on a scrolled page the Vertex link is **not** reachable (`focus()` no-op under `visibility: hidden`); reachable again at scroll-top | ☑ |
| The 48rem bar does not crowd or wrap at 1024 and 1280, **MK first** (MK longer) — fits both locales, single row, no overflow | ☑ |
| Hero reveal: ended hero **1.09s**, countdown hero **1.31s**, both under 1.5s (measured on the children) | ☑ |
| Reduced motion: no new rule added — global rule + hero's own `animation: none` cover it (CSSOM-verified) | ☑ (live emulation owed #35) |
| Mobile overlay unaffected at 390: overlay + its own credit visible/focusable, scrolled or not; open/close/Escape/focus-return/scroll-lock all pass | ☑ |
| No horizontal overflow at 320/390/768/1024/1280 in either state | ☑ |
| Lighthouse mobile Performance re-run vs 2.17's 94 | ☐ — **not comparable locally**; owed #35 (post-deploy PageSpeed) |
| Console: zero new errors (`ProductCard.tsx:59` MK price mismatch inherited, out of scope) | ☑ |
| Screenshots: MK 1280 top, MK 1280 scrolled, EN 1280 scrolled, MK 390 scrolled | ☑ |

---

## 7. Placeholders shipped

**None.** This phase adds no `[PLACEHOLDER: …]` and clears none. Placeholder register **unchanged**.

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to VERIFIED in `facts.md` | ☑ (no copy/fact touched; `facts.md` byte-unchanged) |
| `humanizer` pass run on user-facing copy | n/a (no user-facing copy changed) |
| No fashion-magazine filler | ☑ (no copy) |
| No invented testimonials / reviews / counts / awards / partners / team / address | ☑ |
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
| Retimed-header + hero real-device feel; **confirm/strike `D-2.18-5`**; live reduced-motion read; PageSpeed re-run (#35) | Deploy + a phone | Lazar / Petar |

Nothing blocks the merge. The one owed row is a post-deploy real-device confirmation, consistent with every
out-of-band UI phase since 2.13 — with the added, explicit ask that Lazar **confirm or strike the hero retime**.

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ☑ (unchanged, as required) |
| `current-state.md` — owed-verification register | ☑ (+1: **#35**; note the brief's "#34" was one behind) |
| `current-state.md` — placeholder register | ☑ (unchanged) |
| `file-map.md` — matches disk | ☑ (no tree change) |
| `00_stack-and-config.md` — new deps / pins / config | ☑ (unchanged — none) |
| `Decisions.md` — every §2 entry appended | ☑ (`D-2.18-1…5`) |

**`NEXT:` line I set:** unchanged — `NEXT: 2.06 operator half — the LIVE drop rehearsal …` (2.18 is
out-of-band and does not advance the critical path).
