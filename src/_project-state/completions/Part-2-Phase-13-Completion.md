# Completion report — Part 2 Phase 13: Centre the header nav (Catalog · About · Contact)

| | |
|---|---|
| **Phase** | 2.13 |
| **Name** | Centre the header nav (Catalog · About · Contact) |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-24 |
| **Branch** | `phase-2.13-header-nav-centre` |
| **PR** | #25 |
| **Brief** | `briefs/Part-2-Phase-13-Code.md` |

---

## 1. What shipped

- The three header page links (Catalog · About · Contact) now sit on the header's **true page
  centreline** instead of jammed against MK·EN + the cart on the far right. The header row now reads
  brand-left / nav-centre / controls-right.
- `src/components/layout/SiteHeader.tsx` was restructured from one `justify-between` flex row of two
  groups into a **three-column CSS grid** whose outer columns are `minmax(0,1fr)` and whose middle
  column is `auto`, so the nav is centred on the container's centreline **regardless** of how wide the
  left (wordmark + long MK credit) and right (MK·EN + cart) groups are.
- Below `lg` (1024px) the nav drops to **its own centred second row** spanning both columns; at `lg` it
  becomes the middle column of the three-column desktop row.
- Everything else about the header is unchanged: reading order (wordmark → credit → Catalog → About →
  Contact → MK·EN → cart, cart last), the active-page mustard underline + `aria-current`, the cart's
  `h-11 w-11` tap target + badge, the build credit, the focus rings, non-sticky solid ground, client
  component. No new strings, tokens, dependencies, or placeholders.

---

## 2. Decisions I made on my own

The three governing decisions (`D-2.13-1/2/3`) were **pre-made by the orchestrator** in the brief and
appended to `Decisions.md` verbatim. The only judgement I exercised was the conditional the brief
**delegated** to me inside `D-2.13-3`:

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| `D-2.13-3` (execution note) | **Kept the switch breakpoint at `lg`; did not raise to `xl`.** Measurement showed the MK three-column row *fits* at 1024px (no overflow, nav offset 0px) with the left group wrapping to a clean two-line wordmark-over-credit block — the reference markup's `flex-wrap`, overflow-ladder rung 1. EN fits on one line at 1024px. | Raise the switch to `xl` (1280) so 1024–1279 gets the two-row (nav-below) layout in both locales. | Rejected because raising to `xl` would degrade **EN's** clean 1024px single-row to fix a **non-broken** MK wrap. Downside accepted: MK at 1024–~1150px shows a two-line brand block with the nav centred beside it; if unwanted, raising to `xl` is a one-line change (flagged to Lazar, owed #28). |

Logged as an **Execution note under `D-2.13-3`** in `Decisions.md` rather than as a new `D-2.13-4`,
because it is the resolution of the conditional `D-2.13-3` already delegated ("if measurement shows the
three-column row still does not fit at 1024px in MK, raise the switch to `xl`") — not a deviation from it.

---

## 3. Surprises and off-spec changes

- **The brief's reference implementation was already correct — no overflow ladder was needed.** The
  reference markup in Task 2 verified cleanly at every width in both locales; overflow-ladder **rung used
  = NONE** (no 320px overflow to clear). The file already carried the reference restructure when the
  session began; I finalised one comment and verified end-to-end.
- **One comment token reworded to make a DoD grep genuinely clean.** The DoD requires
  `grep "self-\|mt-\|items-baseline"` to return no match. The block comment described the invariant as
  "a self-* override" — a false positive (a comment, not a utility). I reworded it to "an alignment
  override" so the grep is truly empty. The `grep "order-"` DoD is inherently non-empty because the
  header must use `border-*` classes (`border-b`, `border-mustard`, …) — a precise grep
  (`\border-(first|last|none|[0-9]+)`) confirms **no `order-*` ordering utility** exists.
- **Pre-existing, out-of-scope hydration mismatch found while verifying (NOT introduced here).** The Next
  dev overlay flags one issue on the Home live-drop grid in **MK**: `ProductCard.tsx:59` renders the
  price "1,500 ден" server-side but "1.500 ден" client-side — a `formatMkd` locale thousands-separator
  divergence between the Node/ICU server and the browser. It originates entirely in
  ProductCard/HomeExperience/HomePage (zero header involvement), `ProductCard.tsx` is **byte-identical to
  `main`**, so it is present on `main` and unrelated to this phase. The **header itself produces zero
  console errors.** I did **not** touch it — `ProductCard` is out of scope (hard stop #6) — and flagged
  it as a separate background task. The orchestrator should schedule a fix before drop day (it fires in
  the live state with real MK prices).
- **`file-map.md` intentionally not updated.** Per the brief's Task 5 + DoD, file-map is touched only if
  a source file was added/moved/deleted (none was). The completion report is a new file but the brief's
  DoD explicitly lists it as an expected diff entry and gates file-map on "only if a file actually
  moved." So file-map stays out of the diff for this phase.

---

## 4. Files touched

`file-map.md` updated: **no** — per the brief's Task 5 / DoD, file-map is touched only if a source file
was added, moved, or deleted; none was. (The completion report is a new state artifact the brief scoped
out of file-map for this out-of-band UI phase.)

| File | Added / Modified / Deleted |
|---|---|
| `src/components/layout/SiteHeader.tsx` | Modified (grid restructure + comment) |
| `Decisions.md` | Modified (`D-2.13-1/2/3` appended verbatim; `D-2.08-6` Status → Superseded) |
| `src/_project-state/current-state.md` | Modified (2.13 Status block, Last-updated line, owed row #28; **line 1 unchanged**) |
| `src/_project-state/completions/Part-2-Phase-13-Completion.md` | Added (this report) |

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | **PASS** — exit 0, full route tree emitted |
| Types | `npx tsc --noEmit` | **PASS** — exit 0 |
| Lint | `npm run lint` | **PASS** — clean (no output) |
| Unit / integration | `npm test` | **PASS — 116/116** (19 files) |

**Concurrent-order test (untouched — no commerce code changed):**

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ tests/concurrency/oversell.test.ts > create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0 78ms` |

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| `git diff --name-only main` lists only SiteHeader.tsx, Decisions.md, current-state.md, the new completion report (no file-map — nothing moved) | ☑ |
| Line 1 of `current-state.md` byte-identical to `main` (`diff` confirmed) | ☑ |
| `mk.json` / `en.json` / `brand.md` / `globals.css` / `facts.md` / `package.json` / `package-lock.json` byte-unchanged (`git diff --quiet` each) | ☑ |
| `grep "order-"` → only `border-*` classes + reading-order comment; **no `order-*` ordering utility** (`\border-(first\|last\|none\|[0-9]+)` empty) | ☑ |
| `grep "sticky\|z-40\|backdrop-blur"` → only the comment line (no such utility) | ☑ |
| `grep "self-\|mt-\|items-baseline"` → **no match** (comment reworded) | ☑ |
| File still starts `'use client'`; `usePathname()` still drives `isActive` | ☑ |
| Diff contains no literal hex / `rgb()` / `hsl()` / raw px value added | ☑ |
| Accessibility-tree order unchanged: wordmark → Vertex Consulting link → Catalog → About → Contact → language switch → cart | ☑ (measured DOM order, EN + MK) |
| Cart link still `h-11 w-11` + badge markup unchanged; nav links still `min-h-6` | ☑ (inner markup moved verbatim) |
| **No horizontal overflow** at 320/390/768/1024/1280, both locales | ☑ — `scrollWidth == clientWidth` in all 10 |
| **Nav centre within ±4px of container content-box centre**, both locales | ☑ — offset **0px** in all 10 |
| Below 1024 the nav is on its own centred row | ☑ — `navOwnRow` true at 768/390/320 |
| Active link on `/catalog` shows mustard underline + `aria-current="page"` | ☑ — both locales |
| No console errors from the header | ☑ (the one overlay issue is pre-existing ProductCard, unrelated) |
| Build / tsc / lint / `npm test` (116/116, incl. oversell gate) | ☑ |
| Overflow-ladder rung used | **NONE** (no 320px overflow) |

**Measurement matrix (actual numbers, via `getBoundingClientRect()` — not summarised):**

| Width | Locale | scrollWidth==clientWidth | nav offset from content centre | nav own row | centreline notes |
|---|---|---|---|---|---|
| 1280 | MK | 1280 == 1280 | 0px | no (lg row) | all 7 items @ centre 34.0, delta **0** |
| 1280 | EN | 1280 == 1280 | 0px | no (lg row) | all 7 items @ centre 34.0, delta **0** |
| 1024 | MK | 1024 == 1024 | 0px | no (lg row) | left group **wrapped** (wordmark 24 / credit 60, rung 1); nav+MK·EN+cart @ 42 delta 0; 3 nav links delta 0 |
| 1024 | EN | 1024 == 1024 | 0px | no (lg row) | all 7 items @ centre 34.0, delta **0** (EN fits one line) |
| 768 | MK | 768 == 768 | 0px | **yes** | main row @ 34 (delta 0); nav row @ 81 (delta 0) |
| 768 | EN | 768 == 768 | 0px | **yes** | main row @ 34 (delta 0); nav row @ 81 (delta 0) |
| 390 | MK | 390 == 390 | 0px | **yes** | left wrapped: wordmark 24 / credit 69.75; MK·EN+cart @ 51.75; nav row @ 116.5 (delta 0) |
| 390 | EN | 390 == 390 | 0px | **yes** | left wrapped: wordmark 24 / credit 60; MK·EN+cart @ 42; nav row @ 97 (delta 0) |
| 320 | MK | 320 == 320 | 0px | **yes** | left wrapped: wordmark 24 / credit 69.75; MK·EN+cart @ 51.75; nav row @ 116.5 (delta 0) |
| 320 | EN | 320 == 320 | 0px | **yes** | left wrapped: wordmark 24 / credit 60; MK·EN+cart @ 42; nav row @ 97 (delta 0) |

*Left-group wrap (wordmark over credit) at 1024 MK and 390/320 both locales is overflow-ladder rung 1 —
the reference markup's `flex-wrap`, explicitly accepted. `grep` proves no `self-*`/`mt-`/`items-baseline`
utility exists, so there is no baseline-nudge regression; each row's items share one centreline.*

### Owed to Lazar (only he / a real device can confirm)

| # | Item | Exact URL / steps | What "pass" looks like |
|---|---|---|---|
| 28 | Header layout sign-off | View `https://www.trajanovv.com/` **and** `/en` on a **desktop browser and a phone** after the merge deploys | Nav reads as genuinely centred; the intentional wide-screen gap between the nav and MK·EN/cart (inherent to true centring, `D-2.13-1`) is acceptable; the MK-at-1024 two-line brand block (`D-2.13-3`) is acceptable — or request the one-line `xl` switch |

**Checklist for Lazar (5 items):** (1) desktop — Catalog·About·Contact sits centred on the page, not
pushed right; (2) desktop — the current page's link shows the mustard underline; (3) phone — the nav is
on its own centred row below the wordmark/credit and MK·EN/cart; (4) both — the credit and every nav
label are fully visible (nothing truncated or hidden), MK + EN; (5) both — the cart icon is last and
tappable.

---

## 7. Placeholders shipped

None. This phase adds no `[PLACEHOLDER: …]` marker and clears none. (The two `[PLACEHOLDER: фотографија —
Владимир]` product-photo markers visible in screenshots are pre-existing register entries, untouched.)

| Placeholder | Page | Waiting on | Owner |
|---|---|---|---|
| — | — | — | — |

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED entry in `facts.md` | ☑ (no new copy — zero strings added/changed) |
| `humanizer` pass run on user-facing copy | ☑ N/A — no user-facing copy produced |
| No fashion-magazine filler | ☑ N/A — no copy |
| No invented testimonials / reviews / counts / awards / partners / team / address | ☑ N/A — no copy |
| Template-propagated strings verified once against `facts.md` before generation | ☑ N/A — no strings |
| No AI-generated product imagery (`D-0-6`) | ☑ N/A — no imagery |
| No untranslated EN string in the MK build | ☑ — measured zero EN in MK build (and vice-versa); no string touched |

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ☑ |
| `.env*` still gitignored | ☑ |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ☑ |
| No order PII (phone, address) in logs | ☑ |

No secret was committed at any point in this branch's history.

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| Header layout sign-off (owed #28) | Lazar viewing the live deploy, desktop + phone, both locales | Lazar |
| Pre-existing MK price hydration mismatch in `ProductCard.tsx:59` (out of scope here; flagged as a separate task) | A follow-up fix before drop day | Orchestrator / Code |

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ☑ (byte-unchanged, verified by `diff`) |
| `current-state.md` — owed-verification register | ☑ (row #28 added) |
| `current-state.md` — placeholder register | ☑ (unchanged — none added/cleared) |
| `file-map.md` — matches what is actually on disk | ☑ (not touched — no source file added/moved/deleted; per brief Task 5) |
| `00_stack-and-config.md` — new deps / pins / config | ☑ (unchanged — no dependency/config change) |
| `Decisions.md` — every § 2 entry appended | ☑ (`D-2.13-1/2/3` verbatim; `D-2.08-6` Status → Superseded) |

**`NEXT:` line I set:** unchanged — `NEXT: 2.06 operator half — the LIVE drop rehearsal …` (out-of-band
phase; line 1 must not move).
