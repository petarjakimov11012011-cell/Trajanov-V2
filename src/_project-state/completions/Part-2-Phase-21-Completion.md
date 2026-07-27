# Completion report — Part 2 Phase 21: Home showcase — the pieces under the hero

| | |
|---|---|
| **Phase** | 2.21 |
| **Name** | Home showcase — the pieces under the hero |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-27 |
| **Branch** | `phase-2.21-home-showcase` |
| **PR** | *(opened at close of phase — number in the PR link below)* |
| **Brief** | `briefs/` — Part 2 · Phase 2.21 · Code (delivered in-session) |

---

## 1. What shipped

- **The pieces are on the front door.** Between the hero and the FAQ, in the countdown / ended /
  no-view states, the home page now shows one large photograph at a time with the slide counter,
  the product name (the neutral slot until Y.01), the real VERIFIED price, the live stock state,
  and one link to the product page. Exactly two slides today — mustard and off-white.
- **A slide requires a real photograph, and the live state shows nothing.** Both rules live in
  `src/lib/showcase.ts` with a header comment saying why, and both are unit-tested. Baby blue is
  absent (no photo exists — register #8); during a live drop the section renders nothing at all,
  and the live `<main>` is sha256-identical to `main`'s in both locales.
- **Autoplay with a real pause mechanism** (WCAG 2.2 SC 2.2.2): 6s per slide; stops on hover, on
  focus-within, when the tab is hidden, on a visible pause button („Паузирај"⇄„Пушти"), and
  entirely under `prefers-reduced-motion` via a JS check. Swipe changes slides on touch without
  touching vertical scroll.
- **Seven new `Showcase` strings per locale** (inventory 248→255), an unsigned MK review pack, and
  the previously-unrendered `Home.browseWhileWait` back in render as the section's visually-hidden
  heading.

## 2. Decisions I made on my own

All logged in `Decisions.md`, append-only. `D-2.21-1` is the orchestrator's own motion exception
(brief decisions 6–7), logged as the brief instructed; the rest are mine.

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| D-2.21-1 | The autoplay ships as the fifth §6 motion exception, first that loops; cross-fade on `--motion-slow`/`--ease-smooth` per the brief | No autoplay; or a new motion token pair (brand.md is out of scope) | A permanently animating element on the front door; §6's "header only" scoping for those two tokens is now inaccurate |
| D-2.21-2 | Null price falls back to the ProductCard `Placeholder.price` treatment | Excluding unpriced products; non-null assertion | A bracketed placeholder could reach the front door if a price is ever nulled |
| D-2.21-3 | No pause button under reduced motion (it would control nothing) | A disabled/no-op toggle | Reduced-motion users see one fewer control |
| D-2.21-4 | Progress bar wraps to its own row below `sm:` | Inline labels truncating to „Пр…" at 45px | Controls block ~62px taller on phones |
| D-2.21-5 | Progress track on `--color-border-strong` (3.56:1) | `--color-border` (measured 1.37:1 — fails 1.4.11) | Track more prominent than the reference's hairline |
| D-2.21-6 | `--showcase-autoplay` set inline from the component's `AUTOPLAY_MS` constant | A `:root` token + brand.md §6 row (out of scope) | A motion duration lives in a component file, not the token sheet |
| D-2.21-7 | Verification maneuvers (DB window shift + byte-exact restore; temporary `view=null`; headless-pane simulations) | Verifying against a photo-less drop; skipping the unreachable behaviours | Simulation evidence, not real hardware — the real-device read is owed #49 |

## 3. Surprises and off-spec changes

- **The known MK-price hydration mismatch now also fires on non-live Home in the dev pane.** The
  brief mandates `formatMkd(priceMkd, t('Common.currency'), locale)` on the slide; that helper's
  `toLocaleString('mk-MK')` gives different grouping in Node (full ICU → „1.199") and in the
  pane's Chromium, which ships **no Macedonian locale data** — proven:
  `Intl.NumberFormat('mk-MK').resolvedOptions().locale === 'en-GB'`, so it groups „1,199". This is
  the **same recorded pre-existing issue** as `ProductCard.tsx:59` (on the Home live grid since
  1.04-era), not a new defect: the served SSR HTML is correct in both locales („1.199 ден" ×2 on
  `/`, „1,199 MKD" ×2 on `/en`, curl-proven), and any browser with mk ICU data agrees with the
  server. The root fix (a locale-data-independent formatter or the recorded follow-up) stays owed
  where it was; this phase followed the brief's letter and did not touch `format.ts`.
- **`brand.md` §6 is now slightly inaccurate and this phase may not fix it.** The brief instructs
  the cross-fade onto `--motion-slow` + `--ease-smooth`, but §6 letters both tokens "header only"
  (`D-2.18-1/2`). brand.md is explicitly out of scope, so the reuse is recorded in `D-2.21-1` and
  flagged here: **the orchestrator should decide whether a future phase updates §6's two token rows**
  (drop the "header only" scoping or grant the showcase its own tokens).
- **The brief's inline controls row cannot hold labelled progress items on a phone** — at 320px
  each label got ~45px and truncated to two letters. The progress bar wraps onto its own row below
  `sm:` (`D-2.21-4`); from `sm:` up it is the reference's inline row.
- **The headless pane reports `document.visibilityState === "hidden"` permanently**, which
  (correctly) suppressed autoplay — the tab-hidden pause working as designed, but it means
  autoplay timing in the pane is throttled to ~7s per tick (hidden-page timer alignment). The 6s
  cadence is exact on a visible tab; the advance/wrap/pause behaviours were all verified (§5).
- **The mid-maneuver test run went red — and that was the restore proving itself.** With the
  scratch-drop windows shifted (D-2.21-7a), `npm test` failed 10 order-flow tests; after the
  byte-exact restore it re-ran **129/129**. Recorded so nobody mistakes the interim red for a code
  fault.

## 4. Files touched

`file-map.md` updated: **yes** (status block, tree ×3, changelog row).

| File | Added / Modified |
|---|---|
| `src/components/home/HomeShowcase.tsx` | Added |
| `src/lib/showcase.ts` | Added |
| `tests/home/showcase.test.ts` | Added |
| `docs/i18n/mk-review-2.21.md` | Added (**unsigned**) |
| `src/app/[locale]/page.tsx` | Modified (mount + comment) |
| `src/app/globals.css` | Modified (scoped `.showcase-*` block after `.faq-item`) |
| `src/messages/mk.json` / `en.json` | Modified (+7 `Showcase` keys each) |
| `docs/i18n/string-inventory.md` | Modified (regen 248→255) |
| `Decisions.md` | Modified (append `D-2.21-1…7`) |
| `src/_project-state/current-state.md` | Modified (line 1, status, Built, owed #48–50, placeholder #4) |
| `src/_project-state/file-map.md` | Modified |
| `src/_project-state/00_stack-and-config.md` | Modified (no-change row) |
| `src/_project-state/completions/Part-2-Phase-21-Completion.md` | Added (this file) |

**Byte-unchanged, diff-proven:** `HomeExperience.tsx`, `HomeFaq.tsx`, `src/lib/faq.ts`,
`src/lib/product-images.ts`, `next.config.ts`, `src/config/`, `supabase/`, `package.json` +
lockfile, `facts.md`, `brand.md`, everything under `public/`.

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | ✓ Compiled successfully (Turbopack) |
| Types | `npx tsc --noEmit` | clean, exit 0 |
| Lint | `npm run lint` | clean, exit 0 |
| Unit / integration | `npm test` | **129/129** (20 files; 116 pre-phase + 13 new) |

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ tests/concurrency/oversell.test.ts > create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0  35ms` |

**Rendered and measured** (dev server + curl, both locales; widths 320/390/768/1024/1280; states
countdown / ended / live via `?preview=`, no-view via the reverted `view=null` maneuver):

- **Section height across slide changes — pixel-identical at every width** (slide 1 → 2 → 1):
  320: 865.195 / 390: 952.695 / 768: 1422.586 / 1024: 854 / 1280: 934 px. **Horizontal overflow: 0**
  (`scrollWidth − clientWidth`) at all five widths.
- **`<head>` preload count:** exactly **1** `rel="preload" as="image"` (the mustard
  `imageSrcSet`) on `/`, `/en`, and both `?preview=countdown|ended`; **0** on `?preview=live` —
  same as `main`. The live `<main>`: **sha256-identical to `main`'s** (MK 14,814 B
  `50b021a4…`; EN 12,563 B `53e9af0c…`; same dev server, same DB, curled on both branches).
- **Heading outline** (countdown + ended, both locales): one `<h1>` → `H2` „Разгледај додека
  чекаш"/"Browse while you wait" (sr-only) → `H3` slide titles → FAQ `H2`/`H3`s — no skipped
  level. DOM order hero < showcase < FAQ.
- **Contrast, computed in-page from rendered colours** (WCAG 2.2 formula): slide title / price /
  view-link label / active progress label (foreground on ground) **15.42:1**; counter + in-stock
  text + inactive label (muted) **7.85:1**; low pill text-on-fill **4.79:1**; view-link + icon-
  button borders and the empty track **3.56:1** (non-text, ≥3 — after `D-2.21-5`; it measured
  **1.37:1** on `--color-border` first); progress fill (mustard) **8.95:1**. Every text pair
  ≥4.5:1, every non-text ≥3:1.
- **Autoplay:** advances and wraps (0→1→0) on the timer; `aria-live` flips `off`⇄`polite` with
  the play state. Pauses verified each way: hover (the pane's parked cursor paused it — observed
  live), focus-within (focus the slide link → polite; blur → off), tab-hidden (visibility override
  both directions), toggle (label „Паузирај"→„Пушти", fill holds; press again → resumes). Timer
  cadence in the pane is ~7s because the headless document is permanently "hidden" (timer
  throttling); exact 6s on a visible tab.
- **Reduced motion** (matchMedia patch + client-side remount, `D-2.21-7`): **no autoplay at all in
  8s**, pause button not rendered, arrows and progress buttons still change slides. The cross-fade
  flattening rides the global `prefers-reduced-motion` rule (universal selector — provably covers
  `.showcase-slide`); the pane cannot toggle the real emulation (same 2.16–2.20 limit).
- **Keyboard:** tab order = active slide link → prev → next → pause → progress 1 → progress 2; a
  real Tab press renders the 2px `--color-focus-ring` ring (box-shadow verified,
  `:focus-visible` matched); the **inactive slide's link cannot receive focus** (`inert` — a
  forced `.focus()` leaves `document.activeElement` elsewhere).
- **Swipe** (synthetic `TouchEvent`s): left → next, right → prev; a vertical flick with 30px
  horizontal drift and a 30px sub-threshold drag change nothing; no `preventDefault` anywhere in
  the handlers.
- **Links, clicked:** MK `/katalog/test-mustard-ochre` („Производ 01") + `/katalog/test-off-white`
  („Производ 02"); EN `/en/catalog/test-mustard-ochre` ("Product 01") + `/en/catalog/test-off-white`
  ("Product 02").
- **Tap targets:** arrows/pause 50×50; progress items ≥45×50 (138×50 at 320 on their own row).
- **Console:** zero errors. The dev overlay's one issue is the known pre-existing MK price
  hydration mismatch (§3); the two warnings (hero `sizes`, hero LCP `loading="eager"` suggestion)
  are pre-existing, about the frozen `HomeExperience` image, and the second is exactly what
  `D-Y.05-11` rejected.
- **Grep gates:** zero hex / `rgb(` / `hsl(` / raw-ms / `cubic-bezier` literals in the diff (the
  one prose "6s" comment aside — no style value); zero `priority` / `loading=` / `fetchPriority`;
  zero Unsplash/remote-image URL; no new dependency.

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| Build / lint / tsc clean; tests 129/129 ≥ pre-phase 116 + new assertions; oversell gate green | ☑ |
| `catalog-parity` green — all 7 keys in both catalogs | ☑ |
| `i18n:inventory` re-run + committed; `Home.browseWhileWait` resolves to `HomeShowcase.tsx` | ☑ |
| Section between hero and FAQ on `/` + `/en` in countdown / ended / no-view | ☑ |
| Nothing renders in `live`; live `<main>` sha256-identical to `main`'s, both locales | ☑ |
| Exactly two slides (mustard, off-white); baby blue absent; no `PhotoSlot` hatch; counter `01 / 02` | ☑ |
| Neutral-slot titles; prices via `formatMkd` (SSR „1.199 ден" / „1,199 MKD"); `StockBadge` states | ☑ |
| Slide links resolve + clicked, both locales | ☑ |
| Exactly one preload (mustard hero), both locales; one `<h1>`; no heading skip | ☑ |
| `git diff --stat` zero on `HomeExperience.tsx` and every frozen file | ☑ |
| No `priority`/`fetchPriority`/`loading="eager"`; no hex/rgb/raw-ms/raw-easing; no remote host/dependency | ☑ |
| Height stable + no overflow at 320/390/768/1024/1280, both locales | ☑ |
| Autoplay 6s + all four pause paths + name flip; reduced-motion = no autoplay, controls still work | ☑ |
| Keyboard order + visible ring; no focus inside an inactive slide; swipe works, vertical scroll untouched | ☑ |
| Every text pair ≥4.5:1 (≥3:1 non-text) — ratios pasted in §5, measured not assumed | ☑ |
| State files + decisions + MK pack + this report filed | ☑ |

### Owed to Lazar (register rows #48–50 — added to `current-state.md`)

| # | Item | Exact steps | Pass looks like |
|---|---|---|---|
| 48 | Native MK review of the seven `Showcase` strings | Read `docs/i18n/mk-review-2.21.md` in context on the live site; sign both boxes | Both boxes checked, faults (not taste) corrected — specifically „парче/парчиња" + „Паузирај"/„Пушти". Before the first real drop |
| 49 | The showcase on a real phone, from an Instagram link, both locales | Open `https://www.trajanovv.com` and `/en` on a phone after the deploy; swipe the section; press pause; scroll past and back | Swipe works, pause reachable and obvious, nothing overlaps or shifts the hero/FAQ, page scrolls normally. Owner: Lazar |
| 50 | Front door still leads with the hero | Look at the deployed home page: does the showcase sit under the hero rather than competing, and is „Производ 01" acceptable there until Y.01 | A yes, or a named change. Owner: Lazar |

## 7. Placeholders shipped

**No new placeholder.** The neutral name slot („Производ 01…") — existing register row **#4** —
now also renders on Home; #4's Page column updated. Rows **#2/#8 unchanged** because photo-less
products are skipped (no hatched slot renders in the section). The `Placeholder.price` fallback
(`D-2.21-2`) is untriggerable today — all three prices are real and VERIFIED.

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to VERIFIED `facts.md` (prices §7; photos §8.1 via `product-images.ts`) | ☑ |
| `humanizer` pass run on the EN strings — nothing fired (2–3-word control labels) | ☑ |
| No fashion-magazine filler; no description paragraph at all (brief decision 3) | ☑ |
| No invented testimonials / reviews / counts / awards / names | ☑ |
| No AI-generated imagery — the two existing Y.03 frames only (`D-0-6`) | ☑ |
| No EN string in the MK build (inventory + parity test + in-pane read) | ☑ |

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ☑ |
| `.env*` still gitignored | ☑ |
| Nothing secret behind `NEXT_PUBLIC_` | ☑ |
| No order PII in logs | ☑ |

No secret was committed at any point in this branch's history.

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| Baby blue's slide (self-heals via `product-images.ts`) | The real baby-blue photograph (register #8, Y.01) | Vladimir |
| Real names replacing „Производ 01/02" on the slides | Y.01 content load (register #4) | Vladimir |
| brand.md §6 accuracy for `--motion-slow`/`--ease-smooth` (§3) | Orchestrator decision in a future phase | Orchestrator |
| MK price hydration root fix (pre-existing, recorded) | The already-owed follow-up phase | Orchestrator |

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — `NEXT:` line on line 1 | ☑ (unchanged in substance — Y.01 + the 2.06 operator half remain next; the 2.21 record prepended) |
| `current-state.md` — owed-verification register (#48–50) | ☑ |
| `current-state.md` — placeholder register (2.21 note; #4 Page column) | ☑ |
| `file-map.md` — matches disk | ☑ |
| `00_stack-and-config.md` — no dep/config change, stated explicitly | ☑ |
| `Decisions.md` — `D-2.21-1…7` appended | ☑ |

**`NEXT:` line I set:** unchanged — `NEXT: Y.01 (drop content load) + the placeholder register to
zero before the first REAL drop; also still open: the 2.06 operator half` (this phase does not
advance the critical path; the 2.21 record is prepended to line 1).
