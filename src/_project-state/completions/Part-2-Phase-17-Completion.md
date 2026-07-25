# Completion report — Part 2 Phase 17: Scroll-reactive header (the floating nav bar)

| | |
|---|---|
| **Phase** | 2.17 |
| **Name** | Scroll-reactive header — sticky + contract-and-blur pill |
| **Executor** | Claude Code |
| **Operator** | Petar (Lazar reviews) |
| **Date** | 2026-07-25 |
| **Branch** | `phase-2.17-scroll-header` |
| **PR** | #29 (open to `main`, not self-merged — `D-0-3`) |
| **Brief** | `briefs/` — Part-2-Phase-17-Code (scroll-reactive header) |

---

## 1. What shipped

- The site header (`SiteHeader`, on **every** page in both locales) is now **`position: sticky; top: 0`** — it stays pinned instead of scrolling away. A customer reading the FAQ past the hero keeps the cart, the catalog link, and the way back.
- Once the page is scrolled past **32px**, the inner bar **contracts** into a floating pill: `max-width` 72rem → **56rem**, gains a **rounded** corner (`--radius-lg`), a **translucent** background (`--color-ground-translucent`, 82% ground), a hairline border, an 8px top margin, and a **`backdrop-filter: blur(12px)`**. The `<header>`'s own opaque background + bottom border fade to transparent so only the pill shows. Scrolling back to the top returns everything to the resting state.
- The effect is a **CSS transition** driven by **one `data-scrolled` attribute** — every value lives in `globals.css` as a token (three new ones), nothing raw in the component (`D-2.17-2`).
- It applies at **every width, phones included** (`D-2.17-4`), and **snaps instantly under `prefers-reduced-motion`** via the existing global rule (no second rule added).
- **Nothing else changed** — same wordmark, same three nav links, same MK·EN switch, cart, credit, burger, and the finished 2.15 overlay (`D-2.17-6`). Catalogs stay at **243** keys; no new dependency.

---

## 2. Decisions I made on my own

The six `D-2.17-1…6` were **pre-made by the orchestrator** in the brief and appended verbatim (they are not my calls, but are logged as required). The one genuine judgement call is **`D-2.17-7`**, which I surfaced and Petar ratified in-session.

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| D-2.17-7 | Ship the brief's Task-3 CSS **verbatim** — `.header-bar` keeps `border: 1px solid transparent` in **both** states — accepting that this makes the **resting header 2px taller than `main`** (69→71px) site-wide, incl. Checkout. | A layout-neutral pill edge (inset `box-shadow` / `outline`) that keeps the resting box pixel-identical to `main` **and** avoids the inter-state jump. | The resting header is 2px taller than the 2.13/2.15 signed-off geometry and content sits 2px lower — a real, measured deviation from `D-2.17-3`'s "byte-identical to the pixel". Invisible to the eye, consistent across routes, flagged for Lazar (owed #32). Not compensated with negative margin/padding (hard stop #4). |

(Two other implementation notes, both explicitly authorised by the brief and therefore not stand-alone decisions: `margin-top: 0.5rem` written as a literal because `--space-2` is not a real token; the three new tokens live in `:root` only, not `@theme inline`, following the `--glow-*` "read via `var()`, not a utility" precedent.)

---

## 3. Surprises and off-spec changes

- **The brief contradicts itself between Task 3 and `D-2.17-3`/hard-stop-#4 (the big one).** Task 3's CSS puts a transparent 1px border on `.header-bar` in both states so the scrolled border is a colour transition, not a box-model jump. But with `box-sizing: border-box` and auto height, that border makes the resting header 2px taller than `main` — which the DoD's scroll-top row and hard stop #4 forbid ("byte-identical to the pixel"). **They cannot both hold.** I measured it (`main` header 69px / bar 68px / border 0px vs branch 71 / 70 / 1px, and `<main>`'s first child `y` 69 → 71), stopped per hard stop #4, and put it to Petar, who chose "ship the brief's CSS verbatim" (`D-2.17-7`). **Recommendation for the next brief:** if a future header brief wants the pill *and* a pixel-identical resting box, specify a layout-neutral edge (inset `box-shadow`/`outline`) instead of a real border — that satisfies both goals the current brief tries and fails to satisfy at once.
- **`main` had moved by one commit** since PR #28 — an **empty `github-actions[bot]` keep-alive commit** (`bd15ed1`, `[skip ci]`, zero files changed). Not a concurrent phase branch, not a collision; I based the branch on it. Noted here for transparency (hard stop #1 is about real movement).
- **Browser-pane rendering quirks (test harness, not the product).** Three surfaced, all worked around: (a) programmatic `window.scrollTo()` doesn't dispatch scroll events to page listeners in the pane — I drove the state with real wheel gestures / `dispatchEvent`; (b) the pane's compositor clock freezes between pure-JS calls, so a mid-transition `getComputedStyle` reads the *start* value — I measured settled state via `transition:none` and confirmed the transition runs by catching it mid-flight (blur 0→12); (c) the sticky pill's *vertical position* mis-composites in screenshots (paints mid-viewport) — `getBoundingClientRect` + `elementFromPoint` prove it's pinned at `top:0`; the pill's appearance renders correctly. None of these are product bugs.
- **Turbopack CSS caching** got confused after a `git stash`/`pop` cycle (I stashed to measure the `main` baseline) and silently dropped the new CSS block; a `rm -rf .next` + dev-server restart fixed it. The committed code is correct — this only affected a mid-session measurement.

---

## 4. Files touched

`file-map.md` updated: **no** — no file was added, moved, or deleted (the three code files already exist; only docs were appended to).

| File | Added / Modified / Deleted |
|---|---|
| `brand.md` | Modified (§3 +1 token, §5 +2 tokens, §6 exception paragraph extended) |
| `src/app/globals.css` | Modified (3 tokens in `:root`, one unlayered `.header-shell`/`.header-bar` block) |
| `src/components/layout/SiteHeader.tsx` | Modified (1 const, 1 `useState`, 1 `useEffect`, 2 classNames, 1 attribute) |
| `Decisions.md` | Modified (appended `D-2.17-1…7`) |
| `src/_project-state/current-state.md` | Modified (2.17 Status block; owed #32/#33/#34; `NEXT:` unchanged) |
| `src/_project-state/completions/Part-2-Phase-17-Completion.md` | Added (this file) |

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | ✅ exit 0 — "✓ Compiled successfully", full route tree |
| Types | `npx tsc --noEmit` | ✅ exit 0 |
| Lint | `npm run lint` | ✅ exit 0, clean — **no `react-hooks/set-state-in-effect`** violation |
| Unit / integration | `npm test` | ✅ **116/116** (19 files), unchanged count |

**Concurrent-order gate:**

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ tests/concurrency/oversell.test.ts > create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0 122ms` |

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| `npm run build` / `npx tsc --noEmit` / `npm run lint` clean (no set-state-in-effect) | ☑ |
| `npm test` 116/116 incl. the 10-vs-3 oversell gate | ☑ |
| `git diff --name-only main` = only `brand.md`, `globals.css`, `SiteHeader.tsx` + state/decision/report docs | ☑ |
| `git diff main -- package.json package-lock.json src/messages/` empty; catalogs **243** | ☑ |
| `grep framer-motion\|AnimatedGroup\|TextEffect\|Sign Up\|Get Started\|tailus\|unsplash` + `from 'motion` — nothing in shipped code | ☑ |
| No literal hex/`px`/`ms` in the new CSS block (only the `1px` hairline border + `0.5rem` margin the brief authorised); no `!important` in the diff | ☑ |
| `brand.md` and the `globals.css` `:root` carry the **same three values** | ☑ |
| `facts.md` untouched; no `[PLACEHOLDER: …]` added; placeholder register unchanged | ☑ |
| Scroll-top: sticky/`top:0`/`z-30`, opaque, square, `max-w-6xl`, nav offset 0px — all 4 routes × 2 widths × 2 locales | ☑ |
| **Scroll-top height identical to `main`** | **☒ — 71px vs 69px (+2px), operator-accepted `D-2.17-7`** |
| Scrolled: `data-scrolled="true"`, pinned, bar `max-width 896px`, `radius 14px`, `blur(12px)`, 82% translucent bg; `<header>` bg + border transparent; `filter/backdrop-filter/transform/will-change` all clear (hard stop #2) | ☑ |
| Scroll-back returns every value; no stuck pill / residual blur | ☑ |
| No horizontal overflow either state at 320/390/768/1024/1280, both locales | ☑ |
| No layout shift (sticky doesn't push content) | ☑ |
| Contrast worst-case computed ≥ 4.5 nav / ≥ 3 wordmark (5.68 / 11.16 over the mustard banner; 4.58 over pure white) | ☑ |
| 2.15 overlay while scrolled: fixed inset-0 full-viewport opaque, scroll lock, focus-on-X, Escape closes + returns focus + releases lock | ☑ |
| Skip link (z-50) paints above the header (z-30) | ☑ (stacking-proven) |
| Reduced motion — no second rule added; global rule covers | ☑ (live emulation owed #32) |
| `-webkit-backdrop-filter` present in served CSS | ☑ (Safari render owed #33) |
| Console: zero new errors (known `ProductCard.tsx:59` inherited, untouched) | ☑ |

### Owed to Lazar (only he / a real device confirms) — register #32/#33/#34

| # | Item | Steps | Pass |
|---|---|---|---|
| 32 | Sticky-header sign-off on a real phone, both locales | Open `www.trajanovv.com` + `/en` on a phone; scroll Home past the FAQ and back. Confirm (a) the pill feels good, not screen-eating; (b) the +2px resting delta is imperceptible; (c) with Reduce Motion on, the header snaps. | Bar contracts smoothly, readable over content, doesn't eat the screen; +2px unnoticeable; snaps under reduced motion |
| 33 | Safari / iOS blur check | Same phone, **Safari**, scroll Home | The scrolled bar is genuinely blurred, not just translucent |
| 34 | Lighthouse mobile Performance re-run | PageSpeed mobile on `/` + `/en/catalog` post-deploy; record + compare to pre-2.17 (94) | ≥ ~94; if it drops, report (fix = one `lg:` media query removing mobile blur) |

**5-item checklist for Lazar (since the live-device visual is his call):** ① at the top the header looks exactly like it does today (opaque, square, full-width); ② scrolling down contracts it into a rounded translucent blurred pill that stays pinned; ③ the pill text (wordmark, nav, cart) stays readable over cards / the mustard banner / the checkout form; ④ the mobile burger menu still opens full-screen and works while scrolled; ⑤ on both `/` (MK) and `/en` it behaves identically.

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
| Template-propagated strings verified once against `facts.md` | n/a (no strings) |
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
| Real-device sticky/pill feel + +2px read + live reduced-motion read (#32) | Deploy + a phone | Lazar / Petar |
| iOS Safari blur render (#33) | Deploy + iPhone Safari | Lazar |
| Lighthouse mobile perf re-run (#34) | Deploy + PageSpeed | Lazar / Petar |

Nothing blocks the merge. All three are post-deploy real-device/real-account confirmations, consistent with every out-of-band UI phase since 2.13.

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ☑ (unchanged, as required) |
| `current-state.md` — owed-verification register | ☑ (+3: #32/#33/#34) |
| `current-state.md` — placeholder register | ☑ (unchanged) |
| `file-map.md` — matches disk | ☑ (no tree change — nothing added/moved/deleted) |
| `00_stack-and-config.md` — new deps / pins / config | ☑ (unchanged — none) |
| `Decisions.md` — every § 2 entry appended | ☑ (`D-2.17-1…7`) |

**`NEXT:` line I set:** unchanged — `NEXT: 2.06 operator half — the LIVE drop rehearsal …` (2.17 is out-of-band and does not advance the critical path).
