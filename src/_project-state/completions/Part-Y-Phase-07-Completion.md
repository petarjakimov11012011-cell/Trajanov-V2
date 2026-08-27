# Part Y · Phase 07 · Code — Completion Report

**Date:** 2026-08-27 · **Executing model:** Claude Opus 5, medium effort
**Branch:** `phase-Y.07-care-copy` · **Commit range:** `f916178..3e8bed6` · **PR:** [#42](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/42) — open, awaiting operator review, **not merged**
**Outcome (one line):** Every product page now tells the customer what the shirt is made of and how to wash it — `100% cotton, 30 °C` — on Vladimir's own statement, recorded as his statement and not as a label read.

---

## 0. Decisions surfaced (read this first)

Four were pre-made in the brief; **one (`D-Y.07-5`) is mine.** All five are logged in `Decisions.md`.

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| `D-Y.07-1` | `facts.md` §7 fabric/composition/care → **VERIFIED** on the **owner's statement** (Vladimir, via Petar, 2026-08-27), with "owner's statement, NOT a label read" written into the row. | Holding at OWED until a label is photographed. | **A label read would be stronger.** If a label later disagrees, the label wins and `D-Y.07-1` is the entry that gets superseded — which is why the provenance is in the row, not smoothed into a generic "VERIFIED". |
| `D-Y.07-2` | The one statement covers **all three colourways**; `D-Y.02-1` marked **`Amended by D-Y.07-2`** (amended, not superseded; body byte-unchanged). | Leaving baby blue null while the other two render. | The inheritance `D-Y.02-1` forbade has effectively happened — by the owner's word rather than by assumption, which is the whole difference. If baby blue is a different cloth, all three rows are wrong together. |
| `D-Y.07-3` | The two exact strings, U+00A0 included, written as `\u00A0` escapes; set **per product**, no shared constant/default/fallback. | (a) A plain space before `°C`. (b) One exported constant referenced three times. | Four literals to keep in step instead of one. The allowlist test is what keeps them identical. |
| `D-Y.07-4` | Y.06's "no care copy committed" guard is **replaced** by an exact-string allowlist, not deleted; `D-Y.06-9` marked **`Superseded by D-Y.07-4`** (its part (a), blank-safe trimming, is untouched and still live). | Deleting Group 2 now that the fact is verified. | The test hard-codes copy, so a future care-copy change is a two-file edit — `facts.md` first, then the test. That friction is the feature. |
| **`D-Y.07-5`** | **MINE, on the spot.** The brief scoped Task 4 to the main §7 row + its paragraph. I also corrected **four other places that still asserted the fact was owed**: the `### Product 03` sub-table's own fabric row, the baby-blue paragraph under it, and three comment blocks in `src/config/products.ts`. | Changing only the row the brief listed and flagging the rest. | This phase edited more of `facts.md` and more comment prose than the brief enumerated. **No factual claim beyond `D-Y.07-1`'s was added anywhere** — every edit either restates that one fact or removes a now-false "still owed". Flagged here so the reviewer reads the diff rather than trusting this summary. |

**Why `D-Y.07-5` was not optional.** `facts.md` is the only legal source for factual claims on this site. Left alone, it would have said in §7 that baby blue's composition is VERIFIED and, eleven lines later in the Product 03 sub-block, that it is `UNVERIFIED — OWED (Vladimir; read off the label)`. A later reader landing on the second one would reasonably conclude the rendered composition on `/katalog/test-baby-blue` was invented.

---

## 1. What shipped (plain language)

Vladimir told us the shirts are 100% cotton and wash at 30 °C. That is now written down as a verified fact, and it appears on all three product pages in both Macedonian and English, where the page used to say `[PLACEHOLDER: состав и нега — од етикетата]`. Nothing was built — Phase Y.06 built the mechanism last week and deliberately left it empty; this phase supplied the words.

Two things were deliberately **not** done. Nothing beyond "100% cotton" and "wash at 30 °C" was written — no fabric weight, no drying or ironing instruction, no "premium", no country of manufacture, because none of that is known. And the fact is recorded as **Vladimir's statement**, not as something read off a label, because nobody on this project has seen a label. If a label ever turns up saying something else, the label wins and the entry that recorded this gets superseded.

**This is not live yet.** Care copy is config, not a database row, so it reaches a customer only when `main` is deployed. Merging is not shipping.

---

## 2. Definition of Done

**Verifiable in this session — 21 of 21 ✅**

- ✅ **`facts.md` §7 row reads VERIFIED, carries 100% cotton; wash at 30 °C, names Owner (Vladimir, via Petar), 2026-08-27, says owner's statement not a label read, says all three colourways.** Evidence: `facts.md:172` — Status cell reads `**VERIFIED** — **Owner (Vladimir, via Petar), 2026-08-27.** **This is the owner's statement, NOT a label read** — no label has been photographed or read by anyone on this project`; Value cell carries both rendered strings and `**Covers all three colourways** — mustard/ochre, off-white and baby blue — on the one statement`.
- ✅ **The "read the label" paragraph amended so it no longer contradicts the row, and still forbids weight, drying, ironing, bleach, fibre origin, country of manufacture.** Evidence: `facts.md` §7, paragraph now headed **"Fabric and care are two facts now, and only two."** followed by **"Everything beyond those two facts is still unknown and still must not be written"** — enumerating weight/GSM, drying, ironing, bleach, fibre origin, country of manufacture **and every adjective** ("not 'premium', not 'heavyweight', not 'soft'").
- ✅ **§ Change log has a dated entry.** Evidence: `facts.md` change log, row `| 2026-08-27 | **§ 7 Fabric / composition / care → VERIFIED (Phase Y.07 Code, Task 4, D-Y.07-1/2/3)** … | Claude Code (per Y.07 brief) |`.
- ✅ **`careMk` is exactly `100% памук. Перење на 30 °C.` and `careEn` exactly `100% cotton. Wash at 30 °C.` on all three, U+00A0 before `°C` — verified by reading, not by memory.** Evidence: the values were read back **at runtime** through the actual import and dumped as codepoints. All six identical, tail reads `33 30 a0 b0 43 2e` = `3`,`0`,**U+00A0**,`°`,`C`,`.`; head reads `31 30 30 25 20` = `1`,`0`,`0`,`%`,space — `%` tight against `100`. MK `памук` at `43f 430 43c 443 43a` — lower case.
- ✅ **No shared constant, default, or fallback — four values set per product.** Evidence: `src/config/products.ts:58,59,75,76,93,94` — six literal assignments, three products; `grep` finds no `const CARE`, no spread, no `??` default in the file.
- ✅ **`src/lib/product-care.ts` byte-unchanged from `main`.** Evidence: `git diff origin/main -- src/lib/product-care.ts` → empty.
- ✅ **`Placeholder.composition` still in both catalogs; null → placeholder branch still in the product page.** Evidence: `src/messages/mk.json:277` `"composition": "[PLACEHOLDER: состав и нега — од етикетата]"`, `src/messages/en.json:277` `"composition": "[PLACEHOLDER: composition & care — from the label]"`; `src/app/[locale]/catalog/[slug]/page.tsx:216` `<Placeholder>{t('Placeholder.composition')}</Placeholder>`. `git diff origin/main` on the page file and on both catalogs → **empty**.
- ✅ **Test Group 1 unchanged; Group 2 is the new allowlist; both new assertions exist.** Evidence: `tests/config/product-care.test.ts` — Group 1 (`getProductCare — keyed by slug, never by position`) byte-identical to `main` in both its `it` blocks; Group 2 renamed to `care copy is the approved facts.md §7 string, or nothing at all` with (a) `expect([null, APPROVED_CARE_MK]).toContain(p.careMk)` + the EN twin, and (b) `expect(p.careMk === null).toBe(p.careEn === null)`. Approved strings defined once at the top with `facts.md` §7 and the date named as their source.
- ✅ **The new guard was watched failing on a deliberately wrong string, and the probe was reverted.** See §3 below for the full transcript.
- ✅ **`npm test` passes; new total stated against Y.06's 176/176 across 25 files.** Evidence: `Test Files 25 passed (25) · Tests 177 passed (177)`. **176 → 177 across the same 25 files:** Group 2 went from one test to two (the allowlist test plus the both-locales-or-neither test).
- ✅ **`npm run build && npm run lint && npx tsc --noEmit` all clean.** Evidence: build completed with the full route table (no errors); `tsc --noEmit` produced **no output**; `eslint` → `✖ 143 problems (0 errors, 143 warnings)` — **every one of the 143 is in the untracked `.claude/skills/impeccable/scripts/` directory**, which is not part of this PR. Filtering `.claude/` out leaves **zero** files with findings.
- ✅ **All six product pages rendered locally, both locales, 390px and 1180px.** Full per-page results in §4.
- ✅ **`productJsonLd` still emits nothing for all three products.** Evidence: `git diff origin/main -- src/lib/seo/` → **empty**; and on every one of the six rendered pages, the check `[...document.querySelectorAll('script[type="application/ld+json"]')].some(s => /"@type"\s*:\s*"Product"/.test(s.textContent))` returned **`false`**. The only JSON-LD on a product page is the site-wide `@graph` opening `{"@type":"Organization", …}`.
- ✅ **Placeholder rows #3 and #9 struck as CLEARED with a dated note naming the source; no other row's wording changed.** Evidence: both rows now `| ~~3~~ | ~~…~~ | ~~Product~~ | **CLEARED 2026-08-27 (Y.07).** …` in the style of struck rows #1 and #5 — visible, not deleted. `git diff` on `current-state.md` shows exactly two table rows replaced; rows **#2, #4, #6, #7, #8, #10 are byte-unchanged**.
- ✅ **Two new owed-verification rows exist.** Evidence: `#69` (the two strings on production, both locales, all six pages, after deploy — with the pass condition spelled out) and `#70` (native MK check, pointing at `#66` as the still-open precedent).
- ✅ **NEXT line still names `supabase db push` (owed #68), the `/impeccable` branch (`D-2.25-26`) and Y.01 as the standing gate.** Evidence: `current-state.md:1` opens with the `supabase db push` warning and the explicit note that **Y.07 did not touch it and did not run it**, then `/impeccable polish` + `audit` on a new branch, and closes `Nothing on the critical path moved: **Y.01** (drop content load) is still the gate.`
- ✅ **`D-Y.07-1…4` logged.** Evidence: `Decisions.md` — plus `D-Y.07-5` (mine).
- ✅ **`D-Y.02-1` marked `Amended by D-Y.07-2`; body not edited.** Evidence: Status line now `Accepted. **AMENDED by D-Y.07-2** (2026-08-27) — … **Amended, not superseded** — the rest of this entry … stands unchanged.`
- ✅ **`D-Y.06-9` marked `Superseded by D-Y.07-4`; body not edited.** Evidence: Status line replaced; the entry also records that part (a) (blank-safe trimming) survives.
- ✅ **Neither old entry's body edited.** Evidence: `git diff origin/main -- Decisions.md | grep '^-'` returns **exactly two lines**, both `- **Status:** Accepted`. Nothing else in the file was removed.
- ✅ **`supabase/migrations/` untouched and `supabase db push` was not run.** Evidence: `git diff origin/main -- supabase/` → **empty**; no `supabase` command was run this session other than a read-only `supabase status`.
- ✅ **One PR open from `phase-Y.07-care-copy`, body quoting both strings and the `facts.md` source line.** Evidence: [#42](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/42) — body carries both `careMk`/`careEn` literals in their `\u00A0`-escaped source form, the full `facts.md` §7 row quoted verbatim, and a "what to actually check" section naming the character-for-character match as the whole risk of the phase.

**Owed to Lazar / Petar (register, not this checklist):** rows **#69** and **#70**.

---

## 3. The guard, watched failing

`D-Y.06-9`(b) asserted every product's care copy was still null. Filling the config makes it fail for the right reason, so Task 2 replaced it **before** the config was touched. Both observations the brief asked for:

**Observation 1 — the new guard is GREEN against the still-null config.** Written first, run against three products with all six values still `null`: `Test Files 1 passed (1) · Tests 4 passed (4)`. Correct — `null` is permitted by the allowlist, so a guard that went red here would have been wrong.

**Observation 2 — the new guard is RED on a deliberately wrong string.** I set `test-mustard-ochre.careMk` to `"100% cotton"` — the right composition, the **wrong locale**, and no non-breaking space. **Both** new assertions tripped:

```
FAIL  care copy is the approved facts.md §7 string, or nothing at all
      > every configured product carries only the approved MK/EN strings, or null
AssertionError: expected [ Array(2) ] to include '100% cotton'

FAIL  care copy is the approved facts.md §7 string, or nothing at all
      > states the composition in both locales or in neither — never one and not the other
AssertionError: expected false to be true

Test Files  1 failed (1) · Tests  2 failed | 2 passed (4)
```

**The probe was reverted** before the real values went in. Proof that it is gone rather than merely overwritten: the string `"100% cotton"` (no wash temperature, no trailing period) appears **nowhere** in `src/config/products.ts` — `git diff origin/main -- src/config/products.ts` shows six assignments and not one of them is the probe — and the suite is back to 177/177. A guard nobody has watched fail is not a guard.

---

## 4. Rendered, and looked at

Dev server on `localhost:3011`. Six pages × two widths. Measured in the page, not eyeballed: the care `<p>`'s class list compared to the adjacent Shipping `<p>`'s, and the care paragraph's client rects counted (more than one rect = it wrapped).

| # | URL | 390px | 1180px |
|---|---|---|---|
| 1 | `/katalog/test-mustard-ochre` | ✅ placeholder gone · `100% памук. Перење на 30 °C.` · **1 line, 198px** · same class as Shipping | ✅ same · **1 line** |
| 2 | `/katalog/test-off-white` | ✅ · MK string · **1 line, 198px** · same class | ✅ · **1 line** |
| 3 | `/katalog/test-baby-blue` | ✅ · MK string · **1 line, 198px** · same class | ✅ · **1 line** |
| 4 | `/en/catalog/test-mustard-ochre` | ✅ · `100% cotton. Wash at 30 °C.` · **1 line, 176px** · same class | ✅ · **1 line** |
| 5 | `/en/catalog/test-off-white` | ✅ · EN string · **1 line, 176px** · same class | ✅ · **1 line** |
| 6 | `/en/catalog/test-baby-blue` | ✅ · EN string · **1 line, 176px** · same class | ✅ · **1 line** |

**Per-page checks, all six:** the placeholder string is **gone** (`!/PLACEHOLDER: (состав|composition)/.test(document.body.innerText)` → `true`); the **correct locale's** string is present and the heading beside it reads „Состав и нега" / "Composition & care" as appropriate; the string contains U+00A0 (`text.includes(String.fromCharCode(0xA0))` → `true`); and no `Product` JSON-LD node exists.

**Styling.** `careP.className === shipP.className` → `true` on all six: `text-muted-foreground text-small`. Computed on both, identical: **13px / 19.5px line-height / `rgb(171, 167, 158)` / weight 400**. It reads as body copy sitting beside the Shipping paragraph — not a heading, not a badge, not the bordered `<Placeholder>` treatment it replaced.

**`30 °C` does not wrap.** One client rect at 390px on all six. I also checked **320px** — the width the non-breaking space exists for — and it is still one line (198px inside a ~288px column). The NBSP is belt-and-braces at today's copy length; it earns its keep the moment the string grows or the column narrows.

Screenshots taken: `/katalog/test-baby-blue` at 1180px (the care line and the Shipping line side by side, visibly the same treatment) and `/katalog/test-mustard-ochre` at 390px (the two sections stacked). **The photo placeholders are still there in both, correctly** — rows #2 and #8 are not this phase's to clear.

---

## 5. `humanizer` pass

Run against both strings, scoped as the brief instructed. **There is nothing to humanize** — four words and a number per locale, no AI tells to remove, and they are the approved copy, so "improving" them would be the failure mode, not the work.

The pass that mattered was the `facts.md` check: **every word in both strings traces to the row I just wrote.** `100% cotton` ↔ `100% памук`; `Wash at 30 °C` ↔ `Перење на 30 °C`. No adjective, no fibre origin, no weight, no drying or ironing instruction, no bleach symbol, no country of manufacture — nothing in either string that §7 does not carry. (The MK wording itself is owed a native reading — owed row **#70**.)

---

## 6. Changed files

Six files, one commit `f916178`. **No file added, renamed or deleted. No dependency, no config, no migration.**

| File | Change |
|---|---|
| `src/config/products.ts` | `careMk`/`careEn` filled on all three products (6 values); a comment above the first pair naming `facts.md` §7 and the owner-statement provenance; the file's three stale header/inline comment blocks corrected (`D-Y.07-5`). |
| `tests/config/product-care.test.ts` | Group 2 replaced by the exact-string allowlist + both-locales-or-neither assertion; approved strings defined once at the top with their source. Group 1 untouched. |
| `facts.md` | §7 fabric row → VERIFIED; the "read the label" paragraph rewritten; Product 03 sub-table fabric row + its paragraph corrected; change-log row added; `Last updated` → 2026-08-27. |
| `Decisions.md` | `D-Y.07-1…5` appended; `D-Y.02-1` and `D-Y.06-9` Status lines replaced (bodies untouched — only two lines removed in the whole diff). |
| `src/_project-state/current-state.md` | NEXT line rewritten; Status block gains Y.07; new `### Composition & care copy (Y.07)` under Built; placeholder rows #3/#9 struck; owed rows #69/#70 added; register note added. |
| `src/_project-state/file-map.md` | Two descriptions corrected (`product-care.ts` no longer says "all null today"; `products.ts` now mentions care copy). No structural change — no file moved. |

**No secret, key, phone number or address appears in any of it.**

---

## 7. State updates done

- ✅ `current-state.md` — NEXT line (line 1), Status, Built, placeholder register (#3/#9 struck + a dated Y.07 note), owed-verification register (+#69, +#70), `Last updated`.
- ✅ `file-map.md` — two stale one-liners corrected. No add/rename/delete this phase, so no structural change was owed.
- ✅ `00_stack-and-config.md` — **not touched, correctly.** No dependency and no config changed: `git diff origin/main -- package.json package-lock.json next.config.ts` is empty.

---

## 8. Risks and what the next phase needs to know

1. **The fact is one person's recollection.** Everything on those six pages rests on Vladimir saying "100% cotton, 30 °C" to Petar on 2026-08-27. That is the strongest source available and it is the owner's own product — but it is not a label. **Ask him to photograph one label.** If it disagrees, `D-Y.07-1` gets superseded, `facts.md` §7 changes, the two literals in `products.ts` change, and the two literals in the test change with them. That is four places, all named in the test file's own comment.
2. **Owed #68 is unchanged and still the top of the NEXT line.** The Y.06 migration is still not on hosted; `main` and the production database still disagree about the order cap. Y.07 did not touch `supabase/`, did not run `db push`, and did not make #68 better or worse. It is latent only because no drop is open.
3. **Owed #69 is the one that matters for this phase.** Care copy is config. Until `main` deploys, a customer on `https://www.trajanovv.com` still sees `[PLACEHOLDER: состав и нега — од етикетата]`. **Do not tick "the site now states the composition" off the merge — tick it off the deploy.**
4. **The placeholder register is at 6 open rows, down from 8** (#2, #4, #6, #7, #8, #10). It must reach **zero** before the first real drop. Four of the six are Vladimir's photos and names; two are shipping facts.
5. **The allowlist test is now the copy's owner.** Anyone changing a care string will get a red suite before a red review. That is intended — the sequence is `facts.md` first, then the test, then the config, and never the config alone.
6. **`D-Y.02-1`'s slug-keying rationale survives its own amendment.** Baby blue inherits the *claim* because the owner said so; it does not inherit it *structurally*. The lookup is still keyed by slug and the values are still set per product, so a fourth product added tomorrow gets `null` and an honest placeholder — not a fabric claim nobody gave it.

---

## 9. What's now possible that wasn't before

A customer deciding whether to pay 1199 денари in cash at their own front door can find out what the shirt is made of before they decide.

---

## Note for the reviewer

**The whole risk of this phase is one sentence: the two strings in the diff must match the two strings in `facts.md` §7 character for character, and nothing beyond "100% cotton" and "wash at 30 °C" may appear anywhere in the diff.**

Two things worth a second look beyond that:

- **`D-Y.07-5` is mine and it widened the `facts.md` edit** past what the brief enumerated — the Product 03 sub-block, its paragraph, and three comment blocks in `products.ts`. Please check that none of those edits added a claim rather than removing a stale "still owed".
- The MK wording is **not** yet native-reviewed (owed **#70**). If „Перење на 30 °C." is not how a Macedonian care label actually phrases it, that is a copy fix, not a fact fix — `facts.md` stays as it is.
