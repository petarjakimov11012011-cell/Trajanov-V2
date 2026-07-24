# Completion report — Part 2 Phase 12: Home hero sub-line

| | |
|---|---|
| **Phase** | 2.12 |
| **Name** | Home hero sub-line |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-24 |
| **Branch** | `phase-2.12-home-sub-line` |
| **PR** | #N (opened; **left for an operator to merge** — `D-0-3`) |
| **Brief** | `briefs/Part-2-Phase-12-Code.md` |

---

## 1. What shipped

- The paragraph under the Home headline is now a **brand line** in both languages instead of a facts
  line. MK „Пронајди сродна, во свет продадени души." / EN "Find a kindred soul, in a world full of
  sold souls." — **shipped byte-exact as the operator supplied them** (`D-2.12-2`); Code edited neither.
- The three VERIFIED facts the old line carried (drops of 3–5 pieces, real limited stock, cash on
  delivery) **left the hero** — they are still on the site, answered in the FAQ / About / metadata one
  scroll down (fact-loss trace, §8).
- **Two-string change, nothing else in code.** `Home.sub` renders at three sites in `HomeExperience.tsx`
  (no-view fallback, `ended`, `countdown`) × two locales = six rendered surfaces from two edited values;
  it is **absent** in the `live` state (product grid). No component, commerce, schema, or token touched.
- The search-result snippet (`Meta.homeDescription`) is **untouched** (`D-2.12-3`) — the hero and the
  snippet now say different things, deliberately.

---

## 2. Decisions I made on my own

**All three were pre-made by the orchestrator in the brief** and appended verbatim (shape only
reformatted to the `Decisions.md` block style). I made **no** independent judgement calls of my own —
this was a byte-exact copy drop with an explicit "Code edits neither language" instruction.

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| D-2.12-1 | Hero sub-line becomes a brand line, not a facts line | Keep the factual line; put the brand line elsewhere on Home | First-time visitor learns *how payment works* one scroll down (FAQ), not in the first screenful |
| D-2.12-2 | Both strings ship byte-exact; Code edits neither language | Code smooths the MK, or aligns the two languages word-for-word | If the MK reads wrong to a native eye it ships wrong, corrected in a follow-up — hence the MK review pack |
| D-2.12-3 | `Meta.homeDescription` (search snippet) not touched | Change the snippet to match the new hero line | Snippet and hero diverge — deliberate (snippet states what's for sale; hero doesn't) |

---

## 3. Surprises and off-spec changes

- **The metadata key is `Meta.homeDescription`, not `Metadata.homeDescription`.** The brief (and DoD)
  call it `Metadata.homeDescription`; the actual namespace in both catalogs is **`Meta`**. Same key,
  different label. It is byte-unchanged either way. Logged in `D-2.12-3`.
- **The brief's fact-loss trace cited two keys that don't exist as written.** The brief's illustrative
  middle column listed `Checkout.codNote` and `Cart.shippingBody`. Neither exists: `codNote` lives under
  **`Cart`** (and there is a `Checkout.codSummary`), and there is no `Cart.shippingBody` — the
  "shipping" body strings are `Product.shippingBody`, `Terms.shippingBody`, and `Common.shippingNotice`.
  The brief said to "find and cite the key," so §8 cites the **real, grep-proven** keys, which differ in
  namespace from the brief's examples. The facts are all still present; only the example labels were off.
- **`/` served the EN build in the dev preview.** The dev browser sends `Accept-Language: en`, so
  next-intl's locale detection served `/` as EN on first hit. To verify the **MK** build unambiguously I
  set the `NEXT_LOCALE=mk` cookie (via a `/mk` visit) and then read `/?preview=…`; `/en?preview=…` gives
  the EN build directly (its locale prefix survives, no redirect). Also worth noting for the next
  operator: navigating straight to `/mk?preview=countdown` **drops the query** in the default-locale
  redirect — use the cookie + `/` path, or `/en` for English.
- **The local seed drop is LIVE, not the committed ENDED one** (same as the 2.11 report noted). Reaching
  `countdown` / `ended` needs the `?preview=` override; `live` is the raw state. All three were exercised.

---

## 4. Files touched

`file-map.md` updated: **yes** (change-log row + tree entries for `mk-review-2.11.md` and `2.12.md` —
the 2.11 file was on disk but had never been added to the tree; corrected here).

| File | Added / Modified / Deleted |
|---|---|
| `src/messages/mk.json` | Modified (`Home.sub` value only) |
| `src/messages/en.json` | Modified (`Home.sub` value only) |
| `docs/i18n/string-inventory.md` | Modified (regenerated — one row, still 241) |
| `docs/i18n/mk-review-2.12.md` | Added (unsigned) |
| `src/_project-state/completions/Part-2-Phase-12-Completion.md` | Added |
| `Decisions.md` | Modified (`D-2.12-1/2/3` appended) |
| `src/_project-state/current-state.md` | Modified (status block + owed register #27; **line 1 untouched**) |
| `src/_project-state/file-map.md` | Modified (tree + change-log row) |

**Not committed (pre-existing untracked, not this phase's work):** `.claude/launch.json`,
`Part-1-Phase-07-Runbook-v2.md`, `docs/seo/Ranking-Playbook.md` — untracked at session start, left
untracked.

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | **exit 0 — "✓ Compiled successfully in 2.6s"** |
| Types | `npx tsc --noEmit` | **clean (exit 0)** |
| Lint | `npm run lint` | **clean (exit 0)** |
| Unit / integration | `npm test` | **116/116 passed** (19 files) |

**Concurrent-order test (untouched — no commerce code changed):**

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ tests/concurrency/oversell.test.ts > create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0 75ms` |

Catalog parity (both green): `✓ catalog parity — mk.json ⇔ en.json > has identical key sets` ·
`✓ … > has no empty value in either catalog`.

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| `grep -rn "'sub'" src/` returns **only** `HomeExperience.tsx`, three sites | ☑ |
| `git diff --name-only main` lists only the two catalogs, the inventory, the MK pack, and state/decision/report/file-map docs — nothing under `src/components/`, `src/app/`, `src/lib/`, `supabase/`, `src/config/`, `public/`, `package.json`, or lockfile | ☑ |
| Both new strings byte-identical to Task 2 (diffed the JSON values, not eyeballed) | ☑ |
| `Meta.homeDescription` byte-unchanged in both catalogs | ☑ |
| Key count **241** both catalogs; key sets identical; `catalog-parity.test.ts` green | ☑ |
| Build exit 0 · tsc clean · lint clean | ☑ |
| `npm test` **116/116** incl. the 10-vs-3 oversell line (pasted above) | ☑ |
| Rendered both locales (`/` MK via cookie + `/en`) at 1280 & 390: **countdown** new line correct language; **ended** same; **live** sub-line **absent** | ☑ |
| Zero English in the MK build / zero Macedonian in the EN build for this string, every state checked | ☑ |
| No horizontal overflow at 390 either locale; wraps in `max-w-md`; 24px clear of the link below (no collision) | ☑ |
| Exactly one `<h1>` per state; heading order unchanged | ☑ |
| No console errors; contrast unchanged — `text-muted-foreground` `#ABA79E` on `#0F1210` = **7.85:1** (measured) | ☑ |
| Screenshots captured: MK countdown @390, EN countdown @390, MK countdown desktop @1280 | ☑ |
| `docs/i18n/mk-review-2.12.md` exists and is **unsigned** | ☑ |
| Fact-loss trace table completed (§8), every row grep-proven | ☑ |
| Secrets check clean — no value/key/PII in the diff | ☑ |

### Owed to Lazar (on the owed-verification register)

| # | Item | Exact URL / steps | What "pass" looks like |
|---|---|---|---|
| 27 | Native MK read of the new `Home.sub` | Open `docs/i18n/mk-review-2.12.md`, read the one MK line in place on the Home hero (countdown + ended, phone + desktop) with Petar | Both boxes signed — "finished Macedonian", or a returned correction |

---

## 7. Placeholders shipped

**None.** This phase added **no** `[PLACEHOLDER: …]` marker and cleared none. The placeholder register
is **unchanged**.

| Placeholder | Page | Waiting on | Owner |
|---|---|---|---|
| — | — | — | — |

---

## 8. Content truth check

**Fact-loss trace (Task 3).** The old `Home.sub` carried three `facts.md` VERIFIED claims. Each still
renders somewhere on the site in **both** locales — proven by `grep` over `src/messages/{mk,en}.json`;
the cited keys are the **real** namespaces (the brief's example labels `Checkout.codNote` /
`Cart.shippingBody` do not exist — see §3):

| Fact leaving the hero | Where it still renders (grep-proven, both locales) |
|---|---|
| Drops are 3–5 pieces, limited | `Faq.a8` ("Each drop is 3 to 5 pieces, in limited numbers") · `About.body3` ("drops of 3 to 5 pieces, with real, limited stock") · `Meta.homeDescription` ("Drops of 3 to 5 pieces, real limited stock") · also `Faq.a3` ("real and limited") |
| Cash on delivery | `Faq.a2` ("Cash on delivery, when the package arrives") · `Cart.codNote` ("Cash on delivery.") · `Checkout.codSummary` ("You pay cash on delivery. No online payment.") · `Common.shippingNotice` · `Product.shippingBody` · `Meta.homeDescription`/`productDescription`/`checkoutDescription`/`termsDescription`/`shippingDescription` |
| Ships North Macedonia only | `Common.shippingNotice` ("We ship inside North Macedonia only…") · `Product.shippingBody` ("North Macedonia only.") · `About.body3` ("Shipping within North Macedonia only") · `Faq.a4` ("Within North Macedonia only. No international shipping.") · `Terms.shippingBody` |

The new line makes **no factual claim** — it is brand voice, not a statement about the product — so it
needs **no `facts.md` entry** and none was added (`facts.md` byte-unchanged).

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED entry in `facts.md` | ☑ (the new line makes none; the departed facts still trace + render — table above) |
| `humanizer` pass run on the two new strings | ☑ — **nothing acted on** (`D-2.12-2` ships them verbatim); its pattern list fired nothing; the only observations are the two *deliberate* operator choices (EN comma splice, MK elided „душа" after „сродна") |
| No fashion-magazine filler ("elevate", "curated", "essentials", "vibrant") | ☑ (neither string uses any) |
| No invented testimonials / reviews / counts / awards / partners / team / address | ☑ |
| Template-propagated strings verified **once** against source before generation | ☑ (one value, propagated across 3 states × 2 locales; verified byte-exact) |
| No AI-generated product imagery (`D-0-6`) | ☑ (no imagery) |
| No untranslated EN string in the MK build | ☑ (verified in-browser — MK build shows zero Latin in the sub, EN build zero Cyrillic) |

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
| Native MK read of the new sub-line (register #27) | Lazar + Petar reading `docs/i18n/mk-review-2.12.md` | Lazar + Petar |

Nothing else. The change is complete and correct for the facts we have.

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ☑ (unchanged — verified `NEXT: 2.06 …`) |
| `current-state.md` — owed-verification register | ☑ (#27 added) |
| `current-state.md` — placeholder register | ☑ (recorded UNCHANGED) |
| `file-map.md` — matches disk | ☑ (tree + change-log row) |
| `00_stack-and-config.md` — new deps / pins / config | ☑ n/a (nothing installed or configured) |
| `Decisions.md` — every § 2 entry appended | ☑ (`D-2.12-1/2/3`) |

**`NEXT:` line I set:** unchanged — `NEXT: 2.06 operator half — the LIVE drop rehearsal …` (this is an
out-of-band copy phase and does not advance the critical path).
