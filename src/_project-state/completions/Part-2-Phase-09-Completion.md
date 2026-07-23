# Completion report — Part 2 Phase 09: Size buttons in garment order (S · M · L · XL)

| | |
|---|---|
| **Phase** | 2.09 |
| **Name** | Size buttons in garment order (S · M · L · XL) |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-23 |
| **Branch** | `phase-2.09-size-order` |
| **PR** | [#21](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/21) — open to `main`, **NOT merged** (`D-0-3`) |
| **Brief** | `briefs/Part-2-Phase-09-Code.md` |

---

## 1. What shipped

- The product-page size buttons now render in **garment order — S · M · L · XL** — instead of the
  alphabetical **L · M · S · XL** they showed before. Fixed once, centrally, for every product.
- A new **pure, unit-tested comparator** `src/lib/drop/size-order.ts` — `CANONICAL_SIZE_ORDER`
  (`XS · S · M · L · XL · XXL · XXXL`) + `compareSizeLabels(a, b)`. Ranks by clothing position,
  case-insensitive and whitespace-trimmed, treats `2XL`→`XXL` / `3XL`→`XXXL`, and sorts any unknown
  label (e.g. "One size") after every known size — a total, deterministic order. It never mutates a
  label; the UI renders the original database string.
- `src/lib/drop/state.ts` — the single alphabetical sort in `toProductView()` swapped for the new
  comparator. This was the **only** place size order was decided anywhere in `src/`.
- A new test suite `tests/drop/size-order.test.ts` (8 cases), written **before** the fix and run RED,
  then GREEN.

---

## 2. Decisions I made on my own

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| D-2.09-1 | *(pre-decided)* Size-order fix runs as an out-of-band UI phase; `NEXT:` unchanged | Fold into Y.01 with the real content load | Another entry + deploy before the rehearsal, for a one-line behavioural change |
| D-2.09-2 | *(pre-decided)* One shared canonical size order for every product; no per-product override | Hardcode order per product; or reorder `products.ts` rows and hope Postgres preserves them | Product 02 (XL-only) runs through the same changed line — accepted because its single-variant sort is a provable no-op |
| D-2.09-3 | *(pre-decided)* Comparator lives in its own pure module + unit test, not inline in `state.ts` | Inline `.sort()` in `state.ts` (unreachable by a unit test — it's `server-only`) | One more file + test; the rule sits one import away from its caller |
| D-2.09-4 | **My own:** local render evidence via a hand-written **local** seed, because `sync:drop` is frozen | Run `sync:drop` against local (frozen); `db reset` (Task 6 forbids it + wipes the other operator); point dev at hosted (Task 6: local only) | Evidence rests on a hand seed mirroring `products.ts`, not the real config→DB path; disposable on `db reset`. Mitigated by shuffling the insert order so the render genuinely tests the fix |

All four are in `Decisions.md` with full context.

**Method note (not a decision):** the RED was made *behavioural* rather than a bare module-not-found.
I first committed the module with the OLD alphabetical rule (`localeCompare`), ran the test to watch
3 assertions fail with `L · M · S · XL`, then replaced it with the canonical comparator to go GREEN —
so the RED proves the test actually catches the bug, not just a missing import.

---

## 3. Surprises and off-spec changes

- **The local catalogue was empty of the three brief-named products, and the "normal local way" to
  seed them is frozen.** The DoD requires rendering `test-mustard-ochre`, `test-off-white`, and
  `test-baby-blue` locally. Those slugs live in `src/config/products.ts` and reach a database **only**
  via `npm run sync:drop` — which this phase's frozen list explicitly names, and which Task 6 forbids
  (no sync, no reset, no hosted). The local DB held only the test-suite seed products (`test-tee-*`).
  I resolved the tension by hand-seeding the three products into the **local** database with a
  one-off, idempotent SQL insert that mirrors `products.ts` exactly (same slugs, prices, sort order,
  sizes, and the past-dated `test-drop` so it renders ended like production). It is a local-only,
  non-committed data operation — **not** `sync:drop`, not `--linked`, not a reset, no hosted write,
  and it changes no git-tracked file. Logged as `D-2.09-4`. To make the render a *real* test I
  inserted the variants in a **deliberately non-canonical order** (`XL S L M` / `L XL S M`), so a page
  that renders `S M L XL` proves the comparator is ordering them and not Postgres.
- **Completion-report filename.** The brief's Outputs + DoD name it `Part-2-Phase-09.md`, but the
  template header and 19/20 existing reports use the `-Completion.md` suffix (2.08 hit the same
  mismatch and filed as `-Completion.md`). Filed here as `Part-2-Phase-09-Completion.md` to match
  convention; trivial to rename if the orchestrator fetches the brief's exact path.
- **A second dev-server launch config.** Next.js allows only one `next dev` per directory, and another
  session already held the lock on port 3000. To render in *this* session's Browser pane I added a
  `trajanov-dev-2909` config to `.claude/launch.json` (port 3011). `.claude/` is an untracked local
  tooling dir — **not committed**. In the end I verified against the already-running server (HMR had
  hot-reloaded my edits into it), which reached `localhost:3000` fine.
- **Product 02 is byte-identical, provably.** `test-off-white` has a single variant (XL). `Array.sort`
  on a one-element array never invokes the comparator, so the output is the same single `["XL"]` under
  either rule. Rendered `XL` in both locales, unchanged.

---

## 4. Files touched

`file-map.md` updated: **yes** (tree: `size-order.ts` under `src/lib/drop/`, new `tests/drop/`; plus a
change-log row + Last-updated bump).

| File | Added / Modified / Deleted |
|---|---|
| `src/lib/drop/size-order.ts` | **Added** (canonical list + `compareSizeLabels`) |
| `tests/drop/size-order.test.ts` | **Added** (8-case unit test) |
| `src/lib/drop/state.ts` | Modified (`toProductView` sort + comment; 1 import) |
| `Decisions.md` | Modified (`D-2.09-1…4`) |
| `src/_project-state/current-state.md` | Modified (2.09 status block; owed #22; Last-updated; `NEXT:` unchanged) |
| `src/_project-state/file-map.md` | Modified (tree + change-log row + Last-updated) |
| `src/_project-state/completions/Part-2-Phase-09-Completion.md` | **Added** (this file) |
| `briefs/Part-2-Phase-09-Code.md` | **Added** (the brief, committed on the branch) |
| `.claude/launch.json` | Modified — **NOT committed** (untracked local tooling dir) |

`git diff --stat main` (tracked files) shows exactly: `state.ts`, the two new files, the brief, and the
state/decision/report docs. Every frozen path is untouched.

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | **clean** — exit 0, "✓ Compiled successfully in 3.1s" |
| Types | `npx tsc --noEmit` | **clean** (exit 0) |
| Lint | `npm run lint` | **clean** (no output) |
| Unit / integration | `npm test` | **93/93 pass** (18 files) — was 85; +8 new size-order cases |

**RED → GREEN (the new suite), pasted:**

RED (temporary alphabetical stub in place — proves the test catches the bug):
```
 ❯ tests/drop/size-order.test.ts (8 tests | 3 failed)
     × orders a shuffled S/M/L/XL set to S, M, L, XL (the Product 01 / 03 case)
     × treats 2XL as XXL and 3XL as XXXL, keeping the original spelling
     × lands an unknown label after every known size, deterministically
 FAIL … > orders a shuffled S/M/L/XL set to S, M, L, XL
 AssertionError: expected [ 'L', 'M', 'S', 'XL' ] to deeply equal [ 'S', 'M', 'L', 'XL' ]
  Tests  3 failed | 5 passed (8)
```
GREEN (canonical comparator in place):
```
 Test Files  1 passed (1)
      Tests  8 passed (8)
```

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ tests/concurrency/oversell.test.ts > create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0 55ms` |

No commerce code was touched, so this gate is unchanged; re-run green to prove the size-order change
did not disturb it. **New total: 93** (was 85).

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| `tests/drop/size-order.test.ts` run RED before the fix, GREEN after (both outputs pasted §5) | ✅ |
| Product 01 (`test-mustard-ochre`) renders S M L XL, both locales | ✅ MK „Производ 01" + EN "Product 01" |
| Product 03 (`test-baby-blue`) renders S M L XL, both locales | ✅ MK „Производ 03" + EN "Product 03" |
| Product 02 (`test-off-white`) renders XL, unchanged — rendered size row identical to before | ✅ single-variant sort is a no-op (see §3) |
| Size selection + sold-out/unavailable styling + cart behave as before | ✅ (aria-pressed toggles on select; `?preview=live` → select L → "Add to cart" → "Added. View cart") |
| `grep -rn "localeCompare" src/` returns no hit in `src/lib/drop/state.ts` | ✅ (only 2 hits, both in `size-order.ts`: a comment + the unknown-vs-unknown tiebreak) |
| `npm run build` / `npx tsc --noEmit` / `npm run lint` clean | ✅ |
| `npm test` green incl. the 10-vs-3 oversell gate; new total recorded | ✅ 93/93 |
| `git diff --stat main` shows only the intended files; frozen paths untouched | ✅ |
| `package.json` + lockfile unchanged (no new dependency) | ✅ |
| No new `[PLACEHOLDER: …]`; no message-file edit; no `facts.md`/`brand.md` edit | ✅ |

**Render evidence — raw DB order (non-canonical, before the comparator runs):**
```
        slug        | raw_db_order
--------------------+--------------
 test-baby-blue     | L XL S M
 test-mustard-ochre | XL S L M
 test-off-white     | XL
```
**Rendered size row (after the comparator), both locales:**

| Page | lang | Size row |
|---|---|---|
| `/katalog/test-mustard-ochre` | mk | **S M L XL** |
| `/en/catalog/test-mustard-ochre` | en | **S M L XL** |
| `/katalog/test-baby-blue` | mk | **S M L XL** |
| `/en/catalog/test-baby-blue` | en | **S M L XL** |
| `/katalog/test-off-white` | mk | **XL** |
| `/en/catalog/test-off-white` | en | **XL** |

### Owed to Lazar / the operator

| # | Item | Exact URL / steps | What "pass" looks like |
|---|---|---|---|
| 22 | **Production size order** | After merge + deploy, on `https://www.trajanovv.com`, both locales: `/katalog/test-mustard-ochre` (+ `/en/catalog/...`), `/katalog/test-baby-blue` (+ `/en/...`), `/katalog/test-off-white` (+ `/en/...`) | Products 01 + 03 show **S M L XL**; Product 02 shows **XL**. Record it in `current-state.md` the way 2.08 recorded its production verification |

Only 1 owed item — no verification phase triggered. Code verified the behaviour in-browser against the
**local** DB (with deliberately shuffled rows); production can only be confirmed after the operator
deploys.

---

## 7. Placeholders shipped

**None.** No new `[PLACEHOLDER: …]` was introduced. The pre-existing product/legal placeholders
(#2/#3/#4/#7 and the Y.02 #8/#9/#10) are byte-unchanged — the `Placeholder.sizesSample` caption and the
design-preview banner were left exactly as they are (frozen; Y.01's job).

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED entry in `facts.md` | ✅ (no copy changed; the sizes S/M/L/XL are the same `facts.md` §7 VERIFIED sizes, only reordered) |
| `humanizer` pass run on user-facing copy | ✅ n/a — no user-facing string added or changed |
| No fashion-magazine filler | ✅ n/a |
| No invented testimonials / reviews / counts / awards / partners / team / address | ✅ n/a |
| Template-propagated strings verified once against `facts.md` before generation | ✅ n/a |
| No AI-generated product imagery (`D-0-6`) | ✅ n/a — no imagery |
| No untranslated EN string in the MK build | ✅ — no string touched; both locales render the same size labels |

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ✅ (the only new code is a size comparator + its test) |
| `.env*` still gitignored | ✅ (untouched) |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ✅ n/a — no env work |
| No order PII (phone, address) in logs | ✅ n/a — no logging touched |

No secret was committed at any point on this branch. (The local seed used only the standard local
Supabase dev keys, which are the CLI's public defaults, and was never committed.)

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| Production verification of the size order (owed #22) | The operator merges + deploys | Lazar / operator |

Frozen paths confirmed byte-unchanged vs `main`: `src/lib/orders/`, `create_order`,
`expire_reservations`, `supabase/migrations/`, `src/components/{cart,checkout}/`, `src/config/` (incl.
`products.ts`), `src/lib/site.ts` (`SITE_URL`), `SiteHeader.tsx`, `SiteFooter.tsx`, `src/lib/seo/`,
`src/app/sitemap.ts`, `src/app/llms.txt/`, `src/app/manifest.ts`, `src/messages/*`, `facts.md`,
`brand.md`. `package.json` + `package-lock.json` unchanged.

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ✅ (left unchanged — out-of-band; 2.09 summary added as a Status block, the 2.08 way) |
| `current-state.md` — owed-verification register | ✅ (#22) |
| `current-state.md` — placeholder register | ✅ (unchanged — no new placeholder) |
| `file-map.md` — matches what is actually on disk | ✅ (two files added to the tree + change-log row) |
| `00_stack-and-config.md` — new deps / pins / config | ✅ n/a — no dependency/config change |
| `Decisions.md` — every § 2 entry appended | ✅ (`D-2.09-1…4`) |

**`NEXT:` line I set:** unchanged — `NEXT: 2.06 operator half — the LIVE drop rehearsal …` (this phase
is out-of-band and does not touch the 2.06 → Y.01 critical path).
