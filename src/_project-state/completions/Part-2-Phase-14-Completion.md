# Completion report — Part 2 Phase 14: Mobile menu (burger) in the site header

| | |
|---|---|
| **Phase** | 2.14 |
| **Name** | Mobile menu (burger) in the site header |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-24 |
| **Branch** | `phase-2.14-mobile-nav-menu` |
| **PR** | [#26](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/26) → `main`, **left unmerged** (an operator merges, `D-0-3`) |
| **Brief** | Part 2 · Phase 14 · Code — Mobile menu (burger) in the site header |

---

## 1. What shipped

- Below `lg` (1024px) the three page links (Catalog · About · Contact) no longer sit on their own
  centred second header row above every page. They now live behind a **burger button**, so the phone
  header is **one clean line** (wordmark + credit · burger · MK·EN · cart) and the links are one tap away.
- **`src/components/layout/SiteHeader.tsx`** — the only component changed:
  - A `<button type="button" lg:hidden>` burger added as the **first child of the right-hand controls
    group, before `<LanguageSwitch />`** → DOM/reading order is now wordmark → credit → nav → **burger** →
    MK·EN → cart (cart still last). Its size/interaction classes are **identical to the cart control**
    (`h-11 w-11`, 44px; `rounded-[var(--radius-md)]`, `hover:bg-surface`, the shared focus ring). Icon:
    lucide `Menu` closed / `X` open (`h-5 w-5`, `strokeWidth 1.75`). `aria-label={t('menu')}`,
    `aria-expanded`, `aria-controls="site-nav"`. The gap to MK·EN is the group's existing `gap-6` (no new
    gap value).
  - **The existing `<nav>` *is* the panel (`D-2.14-6`)** — `id="site-nav"` added, DOM position and grid
    placement byte-identical to 2.13. Below `lg` it is `hidden` closed / `flex` open, plus `lg:flex` so it
    is always visible at `lg` regardless of state; every stacked style (`flex-col items-stretch`, full-width
    `w-full min-h-11 px-3 rounded-[var(--radius-md)]` link rows) is reverted by an `lg:` variant. Reuses the
    existing `gap-4`. Active link in the open panel is a **filled `bg-surface` row, transparent border**
    (`D-2.14-7`); the 2px `--color-mustard` underline is unchanged at `lg`.
  - **Behaviour:** `useState(false)`; the button toggles. On open, focus moves to the first link; **Escape**
    (bound only while open) and the button return focus to the button. Each link's `onClick` closes it; a
    **render-time reset** closes it on any route change (back/forward included). No scroll lock, body class,
    portal, overlay, click-outside handler, or animation.
- **`src/messages/{mk,en}.json`** — exactly one key added each: `Nav.menu` (MK „Мени" / EN "Menu"), last in
  `Nav`. Catalogs **241 → 242**.
- **`docs/i18n/string-inventory.md`** regenerated — header reads **242**; the only added row is `Nav.menu`.

No new dependency, no `@base-ui/react` import, no shadcn primitive, no new token, no new CSS block, no new
placeholder, no new fact.

---

## 2. Decisions

The eight governing decisions (`D-2.14-1 … D-2.14-8`) were **pre-made by the orchestrator** in the brief
and appended to `Decisions.md` verbatim. I made **one** on-the-fly decision, `D-2.14-9`, forced by a lint
gate — surfaced here per `CLAUDE.md` (the orchestrator ratifies nothing silently):

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| `D-2.14-9` | **Close the menu on route change with React's render-time "reset state when a value changes" pattern, not a pathname `useEffect`.** Track `lastPathname` in state; during render, if `pathname !== lastPathname`, `setLastPathname` + `setOpen(false)`. | Keep the brief's literal `useEffect` on `usePathname()` and silence the lint rule with an inline `eslint-disable`. | Deviates from the brief's literal "useEffect" wording and adds one state variable; a reader expecting an effect must read the comment to see why there isn't one. |

**Why this was necessary, not a preference:** Task 5 says "a `useEffect` on `usePathname()` closes it on
any route change." The naive form — an effect body that synchronously calls `setOpen(false)` — is a **lint
error** here: `react-hooks/set-state-in-effect` (bundled in `eslint-config-next`) flags it, and `npm run
lint` **must** exit 0 (Task 7 gate; a red lint is not a PR per `CLAUDE.md`). The repo has **no precedent**
for a synchronous setState in an effect — every existing effect (`Countdown`, `HomeExperience`) calls
setState only inside a callback. The render-time pattern is the exact fix the lint message links to
(react.dev/learn/you-might-not-need-an-effect); it closes the menu on **any** route change (a link tap to a
different page *and* a browser back/forward) **identically** to the effect the brief describes, so every DoD
observable is met. Each link *also* closes the menu in its `onClick` (the brief requires this too), which
additionally covers the one case pathname can't catch — a tap on the **current** page's own link.

---

## 3. Surprises and off-spec changes

- **The lint gate vs the brief's `useEffect` (the `D-2.14-9` deviation above).** This is the one place the
  implementation departs from the brief's literal wording. It does **not** change observable behaviour or
  scope; it is the mechanism, chosen so the required lint gate stays green without suppressing a real rule.
- **The `computer` automation click did not toggle the button; a DOM `.click()` did.** During browser
  verification the pane's synthetic `left_click` on the burger did not fire React's `onClick` (focus stayed
  on `<body>`, `aria-expanded` stayed false) — a harness/timing quirk, not a code fault. Dispatching a real
  DOM `.click()` proved the handler is attached and correct: `aria-expanded="true"`, panel `display: flex`,
  icon → `X`, and `document.activeElement` = the first link. All interaction checks below were driven this
  way.
- **Pre-existing, out-of-scope hydration mismatch (NOT introduced here).** The Next dev overlay shows one
  issue on the Home live-drop grid in **MK**: `ProductCard.tsx:59` renders "1,500 ден" server-side but
  "1.500 ден" client-side — a `formatMkd` thousands-separator divergence. The dev-server log's stack trace
  roots in `HomePage → HomeExperience → ProductCard` with **zero header involvement**, and `ProductCard.tsx`
  is **byte-unchanged** vs `main` (it is not in the diff), so it is inherited, not introduced. It does not
  reproduce in **EN** (EN prices use a comma both sides). Hard stop #6 forbids touching it; still open,
  flagged as a separate task. **The header itself produces zero console errors.**
- **`file-map.md` intentionally not updated.** No source file was added, moved, or deleted (the completion
  report is a new state artifact the brief scoped out of file-map for this out-of-band UI phase). Stated
  explicitly per Task 9.

---

## 4. Files touched

`file-map.md` updated: **no** — no source file was added, moved, or deleted.

| File | Added / Modified / Deleted |
|---|---|
| `src/components/layout/SiteHeader.tsx` | Modified (burger button + open/close state + panel styling of the existing `<nav>`) |
| `src/messages/en.json` | Modified (one key: `Nav.menu` = "Menu") |
| `src/messages/mk.json` | Modified (one key: `Nav.menu` = „Мени") |
| `docs/i18n/string-inventory.md` | Modified (regenerated → 242; one added row) |
| `Decisions.md` | Modified (`D-2.14-1…8` appended verbatim; `D-2.14-9` appended) |
| `src/_project-state/current-state.md` | Modified (2.14 Status block, Last-updated line, owed row #29; **line 1 unchanged**) |
| `src/_project-state/completions/Part-2-Phase-14-Completion.md` | Added (this report) |

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | **PASS** — exit 0, "✓ Compiled successfully", full route tree emitted |
| Types | `npx tsc --noEmit` | **PASS** — exit 0 |
| Lint | `npm run lint` | **PASS** — clean, exit 0 (the render-time reset is what makes it green) |
| Unit / integration | `npm test` | **PASS — 116/116** (19 files, unchanged count) |

**Concurrent-order test (untouched — no commerce code changed):**

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: yes** |
| Output | `✓ tests/concurrency/oversell.test.ts > … > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0` |
| **i18n catalog parity (now 242 keys)** | `✓ has identical key sets` · `✓ has no empty value in either catalog (except the deliberate About.quoteNote)` |

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| `git diff --name-only main` lists only SiteHeader.tsx, mk.json, en.json, string-inventory.md + the state/decision/report docs | ☑ |
| Line 1 of `current-state.md` byte-identical to `main` (`diff` confirmed) | ☑ |
| `npm run build`, `npx tsc --noEmit`, `npm run lint` all exit 0 | ☑ |
| `npm test` **116/116**, incl. the 10-vs-3 oversell test and 242-key catalog parity | ☑ |
| Catalogs **242** keys each; `string-inventory.md` header reads 242; the only added key is `Nav.menu` = „Мени" / "Menu" | ☑ |
| **320 & 390, both locales, menu closed:** header is one row — panel computes `display: none` — and `scrollWidth == clientWidth` | ☑ (320==320, 390==390) |
| **320 & 390, both locales:** burger's rect ≥ 44×44, and so is the cart's | ☑ (both exactly 44×44) |
| **320 & 390, both locales, menu open:** three links stacked, each row ≥ 44px, `scrollWidth == clientWidth` | ☑ (column, each 44px, no overflow) |
| **1024 & 1280, both locales:** burger computes `display: none`, nav visible, nav centre within ±4px of container content-box centre | ☑ (offset **0px** everywhere) |
| **1280, both locales:** every header item shares one vertical centre (delta 0) | ☑ (all 8 at cy 34, delta 0) |
| **Open:** clicking the burger sets `aria-expanded="true"`, shows the panel, `document.activeElement` is the first link | ☑ (MK 390) |
| **Escape:** closes the panel, `aria-expanded="false"`, `document.activeElement` is the burger button again | ☑ (MK 390) |
| **Navigate:** tapping "Catalog" in the open panel loads the catalog page with the panel closed — both locales | ☑ (`/katalog`, `/en/catalog`; `aria-expanded="false"`, `display:none` on arrival) |
| **Active state:** on `/katalog` and `/en/catalog`, Catalog carries `aria-current="page"` — filled `bg-surface` row in the open panel at 390, 2px `rgb(226,169,60)` underline at 1280 | ☑ |
| `grep` proves **no `order-*` utility** in SiteHeader.tsx (precise `\border-(first\|last\|none\|[0-9]+)` empty); **no hex, no raw px literal** in the diff | ☑ |
| `package.json` + lockfile **byte-unchanged**; `@base-ui/react` imported nowhere in `src/` code; `components/ui/` still only `.gitkeep` | ☑ |
| `brand.md`, `globals.css`, `facts.md`, `SiteFooter.tsx`, `LanguageSwitch.tsx`, `layout.tsx`, `ProductCard.tsx` + every § Out-of-scope path **byte-unchanged** | ☑ |
| No new `[PLACEHOLDER: …]`; placeholder register unchanged | ☑ |
| Header console errors: **zero new** (the pre-existing `ProductCard.tsx:59` MK price hydration warning reproduces via `main`-identical code and is left) | ☑ |
| Screenshots captured: MK 390 closed, MK 390 open, EN 390 open, MK 1280, EN 1280 | ☑ (in the report / session) |
| PR opened to `main`, **not merged** | ☑ |

**Measurement matrix (actual numbers, via `getBoundingClientRect()` + computed styles):**

| Width | Locale | closed: panel display / no-overflow | burger / cart rect | open: stack + row height / no-overflow | lg: burger display / nav offset |
|---|---|---|---|---|---|
| 320 | MK | none / 320==320 | 44×44 / 44×44 | column, 44px rows / 320==320 | — (below lg) |
| 320 | EN | none / 320==320 | 44×44 / 44×44 | column, 44px rows / 320==320 | — (below lg) |
| 390 | MK | none / 390==390 | 44×44 (cy 51.8) / 44×44 (cy 51.8) | column, 44px rows (y 104/164/224) / 390==390 | — (below lg) |
| 390 | EN | none / 390==390 | 44×44 / 44×44 | column, 44px rows (y 104/164/224) / 390==390 | — (below lg) |
| 768 | MK | none / 768==768 | burger visible | — | — (below lg) |
| 1024 | MK | — | — | — | **none** / offset **0px** |
| 1280 | MK | — | — | — | **none** / offset **0px**, one centreline delta 0 (all 8 @ cy 34) |
| 1280 | EN | — | — | — | **none** / offset **0px**, one centreline delta 0 (all 8 @ cy 34) |

**Interaction (MK 390):** open → `aria-expanded="true"`, panel `flex`, icon `X`, `activeElement` = "Каталог"
(first link). Escape → `aria-expanded="false"`, panel `none`, icon `Menu`, `activeElement` = burger button.
Navigate tap "Каталог" → `/katalog`, menu closed on arrival, Catalog `aria-current="page"`. Active open row =
`bg-surface` (`#171a18`) + transparent bottom border. **EN 1280** active Catalog underline =
`rgb(226,169,60)` 2px, transparent bg.

### Owed to Lazar (only he / a real device can confirm)

| # | Item | Steps | What "pass" looks like |
|---|---|---|---|
| 29 | Burger menu sign-off on the live deploy, **on a real phone**, both locales | Open `https://www.trajanovv.com` on a phone. Tap the burger; tap each of the three links; use the back button; switch to EN and repeat | Header is one line with the menu closed; the menu opens and closes cleanly; every link goes to the right page and the menu is closed on arrival; nothing overflows sideways; MK label „Мени" reads correctly to a native speaker (a new MK string, not covered by the 2.03 review stamp) |

---

## 7. Placeholders shipped

None. This phase adds no `[PLACEHOLDER: …]` marker and clears none. A menu label is not a factual claim, so
`facts.md` gets no entry and the placeholder register does not change.

| Placeholder | Page | Waiting on | Owner |
|---|---|---|---|
| — | — | — | — |

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED entry in `facts.md` | ☑ N/A — the only new copy is a UI label (`Nav.menu`), not a factual claim |
| `humanizer` pass run on user-facing copy | ☑ N/A — a one-word UI label |
| No fashion-magazine filler | ☑ |
| No invented testimonials / reviews / counts / awards / partners / team / address | ☑ |
| No AI-generated product imagery (`D-0-6`) | ☑ N/A — no imagery |
| No untranslated EN string in the MK build | ☑ — MK build shows „Мени" (measured `aria-label` = „Мени"); EN build shows "Menu" |

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
| Burger menu sign-off (owed #29) | Lazar viewing the live deploy on a real phone, both locales | Lazar (+ Petar for the MK label) |
| Pre-existing MK price hydration mismatch in `ProductCard.tsx:59` (out of scope here; flagged as a separate task) | A follow-up fix before drop day | Orchestrator / Code |

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ☑ (byte-unchanged — out-of-band phase) |
| `current-state.md` — § Status 2.14 entry | ☑ |
| `current-state.md` — owed-verification register | ☑ (row #29 added) |
| `current-state.md` — placeholder register | ☑ (unchanged — none added/cleared) |
| `file-map.md` — matches disk | ☑ (not touched — no source file added/moved/deleted) |
| `00_stack-and-config.md` — new deps / pins / config | ☑ (unchanged — no dependency/config change) |
| `Decisions.md` — every entry appended | ☑ (`D-2.14-1…8` verbatim; `D-2.14-9` for the render-time-reset resolution) |

**`NEXT:` line I set:** unchanged — `NEXT: 2.06 operator half — the LIVE drop rehearsal …` (out-of-band
phase; line 1 must not move).
