# Completion report — Part 2 Phase Y.03: Interim catalog photography (Products 01 + 02)

| | |
|---|---|
| **Phase** | Y.03 |
| **Name** | Interim catalog photography — Products 01 + 02 |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-26 |
| **Branch** | `phase-y.03-catalog-photography` |
| **PR** | *(opened at the end of this phase — see §12)* |
| **Brief** | The superseding Y.03 Code brief supplied in chat 2026-07-26 (supersedes the version this branch's `Part-2-Phase-Y03-BLOCKED.md` refused) |

---

## 1. What shipped

- **The first images ever committed to this repo render on the live catalog.**
  `public/images/lifestyle/mustard-ochre-01.webp` (209 KB) and `off-white-01.webp` (154 KB), both
  1333×2000, on the **Catalog card** and the **first product-page slot** for **Products 01 and 02**.
  Before this phase, `grep` for `<img|next/image` over `src/` returned zero lines.
- **A photograph is bound to a product by slug, not by position.** New `src/lib/product-images.ts`;
  a re-order of `src/config/products.ts` cannot move a shirt's photo onto another colourway.
- **`PhotoSlot` renders either a photograph or the placeholder, in the same box.** Optional `image`
  prop backed by `next/image` (`fill` + `object-cover`, `priority` off, `sizes` set for the grid). The
  no-image branch is behaviourally unchanged, so nothing shifted on the pages that still have none.
- **Product 03 (baby blue) is untouched**, and the second product-page slot on 01/02 is still a visible
  placeholder — the back / print-detail shot is genuinely still owed and the page says so.
- **The permissions that blocked all lifestyle imagery are recorded and Known Issue #6 is resolved.**
  New `facts.md` §8.1, five permissions, fact/date/channel only — no PII.
- **Two new MK+EN alt strings that describe the garment and name nobody.**

---

## 2. Decisions I made on my own

Eight of these (`1`–`8`) were **pre-written in the brief** and are logged as instructed. Three
(`9`–`11`) are mine and are the ones worth the orchestrator's attention.

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| `D-Y.03-1` | Map by **colourway**, verified against the file; slug-keyed, never index | The positional mapping originally requested | Overrides the operator's stated order; a wrong colour read would be a wrong mapping, so each file was confirmed by eye first |
| `D-Y.03-2` | Product 03 ships with **no photograph** | Using the third frame (warm grey) as a stand-in | Uneven catalog — two photos, one hatched box — until baby blue is shot |
| `D-Y.03-3` | Placeholder #2/#8 stay **open**; #2 narrowed only | Clearing #2 now a real photo renders | The register looks unmoved after visible work. That is the point |
| `D-Y.03-4` | Files in `public/images/lifestyle/` | `public/images/products/` (reserved for the neutral set) | An extra directory and a later move |
| `D-Y.03-5` | `next/image`, local files, no `images` config, no new dep | Plain `<img>`; or a remote image host | First image path on the site; mobile Perf on Catalog (already only 94) must be re-measured |
| `D-Y.03-6` | The bar backdrop is acceptable brand imagery | Reshooting somewhere neutral | A venue with alcohol is the front door of a brand whose youngest customers are 12 |
| `D-Y.03-7` | **Override `facts.md` §8's "cannot carry Catalog or Product"** for two frames, as an interim | Waiting for the neutral set — which is owed anyway, and was the recommendation twice | Warm light shifts the garment colour, so on COD what the customer sees is not exactly what arrives. **Plus: this is Lazar's call while §8 assigns it to Vladimir** — see §3 |
| `D-Y.03-8` | §8 frame count corrected **4 → 3** | Leaving the record as-is | A fact marked VERIFIED since the scaffold was wrong, which weakens what VERIFIED means |
| **`D-Y.03-9`** | **Guardian consent recorded as a FIFTH permission; the mustard frame was not wired until it existed** | **The brief's explicit instruction** to treat Vladimir's own instruction as covering his image and to *not* block on guardian consent | Contradicts a direct instruction and cost a round-trip before any code. See §3 |
| **`D-Y.03-10`** | The backdrop call **widened in writing** to cover a person in frame holding a drink | Leaving `D-Y.03-6` at "a wall of spirits *behind* the models" and reading the glass into "backdrop" | Widens, on the record, what the owner is documented as approving for a 12+ audience |
| **`D-Y.03-11`** | Verification **reseeded the LOCAL scratch DB**; hosted never touched | Verifying against stale data (proves nothing); or repointing dev at **hosted** | Deviates from a literal reading of the brief's "No sync" |

---

## 3. Surprises and off-spec changes

Five things. The first three are the ones to read.

### (a) The brief told me to publish a minor's identifiable face on a minor's own consent. I refused and asked.

The brief's precondition table applies the correct legal test to one model — *"**She is 21** — an
adult, so her own consent is sufficient and no guardian consent is required"* — and then abandons that
same test one paragraph later for the other person in frame, whom it identifies as **Vladimir, a
minor**, asserting that *"his own instruction to publish these pictures covers his image"* and
instructing me: *"do **not** treat it as a fifth consent and do not block on it."*

That does not hold. A minor's self-consent is not valid consent for commercial use of their likeness;
that is a guardian's call. The repo agrees independently — Known Issue #4 reads "**Minor**, no
registered entity", `facts.md` §1 records the underlying responsible party as "Vladimir Trajanov **and
his parents**", and `D-Z.01-3` already set the precedent of handling a minor's details carefully.
Recording it as a satisfied consent would have written a **false clearance into `facts.md`**, the only
legal source.

I also checked which frame the problem actually lives in, which narrowed it usefully: **his face is
fully identifiable only in `mustard-ochre-01.webp`.** In `off-white-01.webp` he is shot from behind and
is not identifiable.

**Resolution:** I stopped before cutting a branch and asked. Petar confirmed **the parents have given
consent**; it is recorded as permission **#5** in `facts.md` §8.1, sourced honestly to "his parents,
confirmed by the orchestrator (Petar) in session" — **not** to a repo artifact, because none exists.
Only then was the mustard frame wired.

**For the next brief:** the instruction "do not re-verify these, and do not treat X as a blocker" is
the shape of instruction most likely to be wrong, because it removes the check that would catch it. In
this case it was wrong.

### (b) `off-white-01.webp` shows a person in frame holding a spirits tumbler. The brief never mentions it.

I zoomed in to confirm rather than assume: a cut-crystal rocks glass containing liquid, held in his
hand on the bar. **The contents are not determinable from the pixels and I make no claim about them.**

The authorisation on record was scoped to alcohol **as backdrop** — precondition 4 and the brief's own
`D-Y.03-6` both describe *"a wall of spirits **behind** two young models."* A person in frame holding a
tumbler in a bar is not backdrop. Since the brief never mentions the glass, `D-Y.03-6` as drafted would
have recorded owner approval for something narrower than what actually ships.

**Resolution:** Petar confirmed the existing call covers it. Rather than let that be read into the word
"backdrop", I **widened the wording** of `D-Y.03-6` and `facts.md` §8.1 #4 to say so explicitly
(`D-Y.03-10`). A decision that understates what it authorises is not a decision.

### (c) `D-Y.03-7` reproduces the exact defect the brief's preamble faults its predecessor for.

The brief opens by listing three defects in the version it supersedes. Defect #1: *"it routed the
consents through Lazar when `facts.md` §8 assigns them to Vladimir."*

Then `D-Y.03-7` — the load-bearing override, the one whose absence was item (d) of the original
refusal — is attributed to **"Lazar's call, 2026-07-26."** `facts.md` §8 says: *"Both are owner-level
calls **for Vladimir**."*

I logged it **as stated** (Lazar's) rather than quietly upgrading it to Vladimir's, and wrote the
mismatch into `facts.md` §8 and into `D-Y.03-7`'s downside. **It is not resolved and I could not
resolve it** — only the operators can say whether Vladimir made this call.

### (d) The brief's DoD says `npm test` — **85/85**. The real number is **116/116**.

Not a regression: **`main` is also 116/116** (I checked out `main` and re-ran). The 85 figure was
accurate around 2.06 and went stale across 2.07–2.20. This phase **adds no test and changes no test**,
so 116 → 116. The mandatory gate passes by name:
`✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0`.

I deliberately did **not** add a test, even though one is warranted (see (e)), because the DoD pinned a
count — adding tests would have made the count claim unverifiable either way. Flagging instead.

### (e) The local dev database could not render the committed catalog at all, and there is no message-key typing.

Two smaller findings the next phase should know:

1. **The local scratch DB serves a different catalog than the repo.** It holds two leftover drops that
   are **not** in `src/config/drops.ts` — `test-open-drop` (with products `test-tee-black`,
   `test-tee-two`) and `test-upcoming-drop`. `test-open-drop`'s window is currently **open**, and
   `pickActiveDrop` prefers a live drop, so `/katalog` rendered *those* products and no photograph could
   possibly appear. I reseeded local via `npm run sync:drop` (host-guarded to `127.0.0.1`), temporarily
   moved the two scratch drops into the past, and **restored everything from a saved backup**
   (`D-Y.03-11`). **This will bite the next phase that verifies the catalog locally.** Worth a cleanup
   task: either delete the two scratch drops or add them to `drops.ts`.
2. **`t()` is not key-typed in this project.** There is no next-intl `Messages` augmentation, so
   `t('Product.typo')` typechecks fine and would render the key name to a screen reader. I made `altKey`
   a closed literal union in `product-images.ts` so the map is self-checking, but the general gap
   remains. A `Messages` augmentation, or a test asserting every `altKey` resolves in both catalogs, is
   the real fix — both out of scope here.

---

## 4. Files touched

`file-map.md` updated: **yes** (tree entry, two standing rules, Status paragraph, change-log row,
`Last updated` header — which was itself stale at 2.11).

| File | Added / Modified / Deleted |
|---|---|
| `public/images/lifestyle/mustard-ochre-01.webp` | Added |
| `public/images/lifestyle/off-white-01.webp` | Added |
| `src/lib/product-images.ts` | Added |
| `src/components/system/PhotoSlot.tsx` | Modified (optional `image` prop; no-image branch behaviourally unchanged) |
| `src/components/product/ProductCard.tsx` | Modified (slug lookup → pass image) |
| `src/app/[locale]/catalog/[slug]/page.tsx` | Modified (**first** slot only) |
| `src/messages/mk.json`, `src/messages/en.json` | Modified (`Product.photoAltOchre`, `Product.photoAltOffWhite`) |
| `docs/i18n/string-inventory.md` | Modified (regenerated, 243 → 245) |
| `docs/i18n/mk-review-y03.md` | Added (**unsigned**) |
| `facts.md` | Modified (§8 frame count, §8 override note, new §8.1, change-log row) |
| `Decisions.md` | Modified (`D-Y.03-1…11`) |
| `src/_project-state/current-state.md` | Modified (`NEXT:`, KI #6 resolved, KI #4 line item, placeholder #2 narrowed, parallel-track row, owed #38–40) |
| `src/_project-state/file-map.md` | Modified |
| `src/_project-state/00_stack-and-config.md` | Modified (`next/image` now in use) |
| `src/_project-state/completions/Part-2-Phase-Y03-BLOCKED.md` | Added (preserved refusal) |
| `src/_project-state/completions/Part-2-Phase-Y03.md` | Added (this file) |

**Diff-proven untouched against `main`:** `supabase/`, `src/config/`, `src/components/cart/`,
`src/lib/cart/`, `src/lib/orders/`, cart + checkout pages, `src/types/database.ts`, `next.config.ts`,
`src/lib/site.ts`, `package.json`, `package-lock.json`, `tests/`. `git diff --stat` over that path list
returns **empty**. `D-1.05-4` unmodified; Home and About untouched.

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | **PASS** — `✓ Compiled successfully in 3.9s`, `✓ Generating static pages (29/29)` |
| Types | `npx tsc --noEmit` | **PASS** — no output |
| Lint | `npm run lint` | **PASS** — no findings |
| Unit / integration | `npm test` | **PASS — 116/116, 19 files** (see §3(d): the brief's "85/85" is stale; `main` is also 116) |

**Concurrent-order gate:**

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: YES** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ tests/concurrency/oversell.test.ts > create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0 133ms` |

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| Both files opened and **visually confirmed** to show the stated colourway before wiring | ☑ mustard = saturated ochre; off-white = near-white. Mapping in the brief is correct |
| Both committed, each **under 300 KB** | ☑ 209 KB / 154 KB |
| **No ~33 MB original** anywhere in this branch's history | ☑ largest blob added is 209 KB (`rev-list` + `cat-file --batch-check`, zero blobs >1 MB) |
| `/katalog` + `/en/catalog`: card 01 ochre, card 02 off-white, card 03 unchanged hatch | ☑ screenshotted at **390px and 1280px, both locales** |
| Product pages 01/02: **first** slot photo, **second** still `[PLACEHOLDER: …]` | ☑ screenshotted; DOM-asserted `["IMAGE:…","PLACEHOLDER:…"]` |
| `/katalog/test-baby-blue` renders **identically to before** | ☑ **HTML diff of rendered `<main>`: byte-identical, 6843 bytes both sides** |
| Sold-out styling still applies to the photographs | ☑ proven end-to-end: zeroed `test-off-white` stock locally → card computed `grayscale(1)` + `opacity 0.6`; screenshotted; stock restored |
| Alt text renders in **both locales** from the catalogs; **zero hardcoded strings** | ☑ MK „Окер маица…"/„Крем-бела маица…", EN "Ochre…"/"Off-white…" read from the DOM |
| No person named or described in any alt text | ☑ garment + colour + print + "worn" only |
| No layout shift — image occupies the same `aspect-[4/5]` box | ☑ measured box `149×186` at 390px, `aspect-[4/5]` unchanged; hatch style left unconditional so the empty branch is untouched |
| Product JSON-LD still emits **no** `Product` node and **no** `image` property | ☑ `hasProductNode:false`, `hasImageProp:false` on rendered pages, both locales |
| Placeholder register: **#8 byte-unchanged, #2 narrowed only**, nothing struck or cleared | ☑ |
| `facts.md` §8 records permissions by fact/date/channel with **no PII** | ☑ no message text, screenshot, handle, phone, or model's name committed |
| Known Issue #6 resolved and dated; Known Issue #4 line item added | ☑ |
| `npm run build` / `npx tsc --noEmit` / `npm run lint` clean | ☑ |
| `npm test` incl. the 10-vs-3 oversell gate | ☑ **116/116** (not 85 — §3(d)) |
| Frozen paths byte-unchanged | ☑ diff-proven empty (§4) |
| `D-1.05-4` unmodified; Home and About untouched | ☑ |
| No new npm dependency; `package.json` + lockfile unchanged | ☑ diff-proven |
| `docs/i18n/mk-review-y03.md` unsigned; `string-inventory.md` regenerated | ☑ 243 → 245 |
| `Part-2-Phase-Y03-BLOCKED.md` preserved in `completions/` | ☑ committed as the branch's first commit |
| **`sizes` actually works** (not an assumption) | ☑ browser picks the **640px** candidate at 390px, not 3840px |

### Owed to Lazar

| # | Item | Exact URL / steps | What "pass" looks like |
|---|---|---|---|
| **38** | Photographs on a **real phone**, live domain | [www.trajanovv.com/katalog](https://www.trajanovv.com/katalog) + `/en/catalog` + both product pages | Both shirts visible and in frame; no stretched, beheaded, or garment-cropped-out card. A wrong crop is a one-line `objectPosition` fix |
| **39** | Lighthouse **mobile Performance** on Catalog | PageSpeed Insights, live `/katalog` | **Not below the pre-existing 94.** `priority` off + `sizes` set, but that is a prediction from the srcset, not a measurement |
| **40** | MK alt-text review **signed** | `docs/i18n/mk-review-y03.md` | Lazar + Petar sign, dated. Confirm the colour words match the real shirts („Крем-бела" most worth a second opinion) and that nobody is named |

**Rendered the pages myself**, both locales, 390px + 1280px, all five URLs — so this phase does not
close sight-unseen. What I could not do is hold a real phone.

---

## 7. Placeholders shipped

This phase **shipped no new placeholder** and **cleared none**.

| Placeholder | Page | Waiting on | Owner |
|---|---|---|---|
| `[PLACEHOLDER: фотографија — Владимир]` (#2, **narrowed, still OPEN**) | Product 01/02 **second slot**; Product 03 both slots; card 03 | The **neutral front / back / print-detail set**, every colourway | Vladimir |
| `[PLACEHOLDER: фотографија — Владимир]` (#8, **byte-unchanged**) | Product 03 card + page | A **real baby-blue** photo — no stand-in | Vladimir |

**The register did not move toward zero and the pre-drop gate is unchanged.** A styled lifestyle frame
in a bar is not the product photography #2 waits for. If this phase made the register look closer to
empty, that would be a defect — it does not.

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED entry in `facts.md` | ☑ colourways from §7; the two frames now recorded in §8 + §8.1 |
| `humanizer` pass run on user-facing copy | ☑ run — **no changes; nothing fired.** No significance inflation, promo adjectives, `-ing` filler, rule-of-three, em dashes, or hedging in a 6-word alt string. „носена"/"worn" was pressure-tested and kept: it conveys on-body without describing a person |
| No fashion-magazine filler | ☑ |
| No invented testimonials / reviews / counts / awards / partners / team / address | ☑ |
| Template-propagated strings verified once against `facts.md` | ☑ n/a — two hand-written strings |
| No AI-generated product imagery (`D-0-6`) | ☑ both files are real photographs of the real shirts, retouched only |
| No untranslated EN string in the MK build | ☑ both keys exist in `mk.json`; MK verified in-browser |

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ☑ |
| `.env*` still gitignored | ☑ untouched |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ☑ untouched |
| No order PII (phone, address) in logs | ☑ |

**Additionally, on the PII risk specific to this phase** (`D-0-1`): `facts.md` §8.1 records only the
**fact, date and channel** of each permission. **No message text, no screenshot, no sender handle, no
phone number, and no name for the model** is committed anywhere. Evidence stays with Lazar and Petar,
outside the repo, and is referenced as held. Note that the committed photographs do themselves contain
**identifiable faces** of two real people — that is the publication the permissions authorise, not an
accident, but it is worth stating plainly in a secrets section.

**No secret was committed at any point in this branch's history.**

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| **Neutral product photo set** — front / back / print detail, neutral background, every colourway | Vladimir shooting it. Blocks the first real drop (placeholder #2, Known Issue #5) | Vladimir |
| **Baby-blue photograph** — Product 03 has none | Vladimir shooting it; he confirmed only three frames exist | Vladimir |
| **`D-Y.03-7`'s authority mismatch** — the §8 override is Lazar's; §8 assigns these calls to Vladimir (§3(c)) | An operator confirming whether Vladimir made this call | Lazar / Petar |
| **Known Issue #4** — legal responsibility, now with Vladimir's own photograph as a line item | The parental conversation. Still a **cutover blocker** | Vladimir + parents |
| **Local scratch DB divergence** (§3(e)1) — two drops not in `drops.ts`, one of them live | A cleanup decision: delete them or add them to config | Next phase / Lazar |

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ☑ |
| `current-state.md` — owed-verification register | ☑ rows **#38–40** (numbered from the real max of 37 — my first attempt collided with 2.08's #20/#21 and was corrected) |
| `current-state.md` — placeholder register | ☑ #2 narrowed, #8 untouched, nothing cleared |
| `file-map.md` — matches what is actually on disk | ☑ + two standing rules + stale `Last updated` header fixed |
| `00_stack-and-config.md` — new deps / pins / config | ☑ `next/image` in use, **no new dependency**, no `images` block |
| `Decisions.md` — every §2 entry appended | ☑ `D-Y.03-1…11` (217 → 228 entries) |

**`NEXT:` line I set:** `NEXT: **Y.01** (drop content load) + the placeholder register to **zero**
before the first REAL drop — the neutral front / back / print-detail photo set is the critical path…`

---

## 12. PR

Branch `phase-y.03-catalog-photography` → PR to `main`. **Not merged by me — an operator merges
(`D-0-3`).** There is no GitHub review Action on this project; the other operator reviews before merge.

**Read §3(a), §3(b) and §3(c) before merging.** (a) and (b) were resolved by the orchestrator in
session and the resolutions are in the record. **(c) is unresolved and only an operator can close it.**
