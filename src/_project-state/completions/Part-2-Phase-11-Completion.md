# Completion report — Part 2 Phase 11: Home FAQ section

| | |
|---|---|
| **Phase** | 2.11 |
| **Name** | Home FAQ section |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-23 |
| **Branch** | `phase-2.11-home-faq` |
| **PR** | #23 (opened; **merged by an operator, not by Code** — `D-0-3`) |
| **Brief** | `briefs/Part-2-Phase-11-Code.md` |

---

## 1. What shipped

- The **Home page now answers the eight questions an Instagram buyer asks** — how do I pay, where do
  you ship, how long, how many, why so few (plus when can I buy, what happens after I order, what sizes)
  — in a section under the hero, both locales, without opening Terms or Shipping.
- The rows are **native `<details>`/`<summary>` disclosures** (zero JS, server-rendered), grouped under
  three quiet labels (Нарачка / Достава / Парчињата), one open at a time, with a `Plus` icon that
  rotates to × when open. A localised "Another question? Email or call →" link points to `/contact`.
- A **`FAQPage` JSON-LD node** is emitted on Home, built from the same message keys as the visible copy,
  so search/answer engines get the same eight Q&As the page shows — and they cannot drift.
- **44 new message keys** (22 MK + 22 EN) under a new `Faq` namespace; a regenerated string inventory
  (219 → 241) and an **unsigned MK review pack** for the 22 new Macedonian strings.
- **Nothing that sells changed** — hero, countdown, banners, cart, checkout, stock, drop logic, and all
  commerce code are byte-unchanged. `NEXT:` (the 2.06 rehearsal) is untouched.

---

## 2. Decisions I made on my own

The five below (`D-2.11-1…5`) were **pre-made by the orchestrator** in the brief and appended verbatim
(shape only reformatted). `D-2.11-6` and `D-2.11-7` are **mine**.

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| D-2.11-1 | FAQ lives on Home, not its own route | A `/faq` page linked from the footer | Home is no longer single-purpose; longer on mobile |
| D-2.11-2 | Three static group labels, no tab row | Interactive filter tabs as drawn | The pill row that balanced the heading is gone |
| D-2.11-3 | Native `<details>` + CSS | shadcn/Radix accordion (new dep + client cpt) | Height animation degrades where `::details-content` is unsupported — must not be "fixed" with JS |
| D-2.11-4 | Eight questions only | ~20-question grid with `[PLACEHOLDER]` fillers | Section is thinner than the mockup until Y.01 |
| D-2.11-5 | `FAQPage` JSON-LD from the same keys | No structured data | One more schema surface — mitigated by single-source |
| **D-2.11-6** | MK `a8` nested quote uses the repo's „…“ pair | ASCII / `U+201D` closing glyph | Native reviewer should confirm the glyph — flagged in the MK review pack §4 |
| **D-2.11-7** | JSON-LD rendered inside `HomeFaq`, co-located | Render `<JsonLd>` in `page.tsx` | A reader of `page.tsx` alone doesn't see the JSON-LD; it lives in `HomeFaq` |

---

## 3. Surprises and off-spec changes

- **Local seed shows a LIVE drop, not the committed ENDED one.** The dev DB seed carries a live
  `test-open-drop` (Tee 01 / Tee 03), so `/` renders the **live** state locally. This was useful — it
  let me verify the FAQ in the hardest state (product `<h2>`s coexisting with the FAQ `<h2>`, heading
  order intact). Production still ships the committed ENDED drop; nothing about the FAQ depends on drop
  state.
- **EN copy: humanizer pass, zero changes.** The brief's English is already tight brand-voice copy
  (≤1 em dash per answer, real enumerations not padding, no filler/hedging, no copula avoidance). The
  humanizer audit turned up nothing to change, so the EN ships as the brief specified — which also keeps
  it aligned with the mandated table and preserves the two deliberate "not confirmed yet" sentences. I
  used straight quotes/apostrophes in the EN (as the brief's table did, and as the humanizer prefers),
  though earlier repo copy (About) uses curly ones — a minor, deliberate, non-retrofitting choice.
- **String-inventory "Where" column is blank for the FAQ keys.** By design, `HomeFaq` pulls keys from
  `faq.ts` (`t(item.answerKey)`) rather than writing literal `'a1'` strings, so the inventory's static
  heuristic can't trace them to a file. This is the single-source-of-truth trade-off, not a dead key —
  every key is exercised (the JSON-LD test asserts each exists in both catalogs).
- **Browser-pane screenshots of the mid-page accordion rows were flaky on desktop** — the same long-
  dark-page scroll/capture desync 2.07 documented. Fully verified via the accessibility tree, computed
  styles, a real axe run, and clean **mobile** captures (closed + open state) instead.

---

## 4. Files touched

`file-map.md` updated: **yes**.

| File | Added / Modified / Deleted |
|---|---|
| `src/components/home/HomeFaq.tsx` | Added |
| `src/lib/faq.ts` | Added |
| `src/lib/seo/faq-jsonld.ts` | Added |
| `tests/seo/faq-jsonld.test.ts` | Added |
| `docs/i18n/mk-review-2.11.md` | Added (unsigned) |
| `src/_project-state/completions/Part-2-Phase-11-Completion.md` | Added |
| `src/app/[locale]/page.tsx` | Modified (mount `<HomeFaq />`) |
| `src/app/globals.css` | Modified (appended `.faq-item` block) |
| `src/messages/mk.json` · `src/messages/en.json` | Modified (`Faq` namespace, 22 keys each) |
| `docs/i18n/string-inventory.md` | Modified (regen 219 → 241) |
| `Decisions.md` | Modified (`D-2.11-1…7`) |
| `src/_project-state/current-state.md` | Modified (status + owed register #24/#25/#26; **line 1 untouched**) |
| `src/_project-state/file-map.md` | Modified |

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | **exit 0 — "✓ Compiled successfully"** |
| Types | `npx tsc --noEmit` | **clean (exit 0)** |
| Lint | `npm run lint` | **clean (exit 0)** |
| Unit / integration | `npm test` | **116/116 passed** (was 93; +23 new FAQ JSON-LD) |

**Concurrent-order test (untouched — no commerce code changed):**

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ tests/concurrency/oversell.test.ts > create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0` |

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| Build exit 0, tsc clean, lint clean | ☑ |
| `npm test` 116/116 incl. oversell gate + catalog-parity | ☑ |
| FAQ renders under the hero on `/` and `/en` in **all three** drop states (countdown/live/ended), no hero shift/overlap | ☑ |
| MK build zero English / EN build zero Macedonian in the section | ☑ |
| Exactly 8 questions in 3 groups, correct order; **no `[PLACEHOLDER]` in the diff** | ☑ |
| Every answer traced to its source row; `facts.md` byte-unchanged | ☑ |
| Keyboard: Tab reaches every summary, Enter/Space + click toggle, focus ring visible (`2px #F2C55A`), one-open-at-a-time | ☑ |
| Rows animate open (`::details-content` 0→64px) + icon rotates (0→45°); reduced-motion collapses via the global rule | ☑ |
| **axe zero violations** on `/` and `/en`; exactly one `h1`; order h1→h2→h3 no skips | ☑ |
| `FAQPage` JSON-LD present, 8 questions, text byte-identical to the rendered/catalog copy | ☑ |
| `git diff main` has no hex/`rgb()`/`hsl()` in code, no `package.json` change, no `supabase/`/`src/config/`/`src/lib/orders/`/`src/lib/drop/`/cart/checkout change | ☑ |
| Line 1 of `current-state.md` unchanged (`NEXT: 2.06 …`) | ☑ |
| Screenshots: desktop + mobile (closed + open) captured & described | ☑ (desktop mid-rows flaky — see §3) |

### Owed to Lazar (on the owed-verification register)

| # | Item | Exact URL / steps | What "pass" looks like |
|---|---|---|---|
| 24 | Native MK review of the 22 new strings | `docs/i18n/mk-review-2.11.md`, with Petar | Both boxes signed; faults (if any) listed |
| 25 | The section on a real phone, from an IG link | Open `https://www.trajanovv.com` on a phone | Rows tappable, text readable, animation smooth, nothing overlaps the hero |
| 26 | Sign-off that eight questions is right for the front door | Look at the rendered Home FAQ | He says yes, or names additions (they come from Y.01 content) |

---

## 7. Placeholders shipped

**None.** This phase added **no** `[PLACEHOLDER: …]` marker and cleared none. The placeholder register
is **unchanged**. The two „сè уште не се потврдени/објавени" sentences in `a5`/`a7` are honest prose
copied from already-reviewed pages (the owed items are tracked as register rows #4/#6), **not**
markers.

| Placeholder | Page | Waiting on | Owner |
|---|---|---|---|
| — | — | — | — |

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED entry in `facts.md` (or an already-reviewed Terms/Shipping string) | ☑ |
| `humanizer` pass run on user-facing copy (EN) | ☑ (no changes needed — see §3) |
| No fashion-magazine filler | ☑ |
| No invented testimonials / reviews / counts / awards / partners / team / address | ☑ |
| Template-propagated strings verified once against `facts.md` before generation | ☑ (source-trace table) |
| No AI-generated product imagery (`D-0-6`) | ☑ (no imagery added) |
| No untranslated EN string in the MK build | ☑ (verified in-browser, zero leak) |

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ☑ |
| `.env*` still gitignored | ☑ |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ☑ |
| No order PII (phone, address) in logs | ☑ (no logging added) |

No secret was committed at any point in this branch's history.

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| The five deliberately-omitted answers (returns window, fabric/care, courier name, delivery cost, exact size measurements in cm) | Y.01 content load — facts do not exist yet | Vladimir |

Nothing else is blocked. The section is complete and correct for the facts we have.

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ☑ (unchanged — verified `NEXT: 2.06 …`) |
| `current-state.md` — owed-verification register | ☑ (#24/#25/#26 added) |
| `current-state.md` — placeholder register | ☑ (recorded UNCHANGED) |
| `file-map.md` — matches disk | ☑ |
| `00_stack-and-config.md` — new deps / pins / config | ☑ n/a (no dependency/config change) |
| `Decisions.md` — every § 2 entry appended | ☑ (`D-2.11-1…7`) |

**`NEXT:` line I set:** unchanged — `NEXT: 2.06 operator half — the LIVE drop rehearsal …` (this is an
out-of-band UI phase and does not advance the critical path).
