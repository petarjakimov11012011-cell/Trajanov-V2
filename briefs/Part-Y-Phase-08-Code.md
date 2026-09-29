# Part Y · Phase 08 · Code — Product 03 (baby blue): first photographs on Catalog and Product

**Why this matters —** Product 03 is the only shirt on the site still showing an empty photo box.
Vladimir has now supplied two real frames of the baby-blue shirt; this phase puts them on the
catalog card and on both product-page slots, so all three shirts can be seen before anyone buys.

**Model & effort —** Claude Opus, reasoning effort **medium**. Asset + config + one component change;
no database, no order path.

**Mandatory skills —** `designing-and-coding-branded-web-ui` (image framing against `brand.md`),
`test-driven-development` (the slug→image map and the showcase source are logic with tests),
`logging-project-decisions`, `writing-completion-reports`, `syncing-project-state`.

---

## Context

### Why this phase exists now
Out of order, on **Lazar's instruction, 2026-09-29**. Line 1 of `current-state.md` names the
`/impeccable polish` pass as NEXT; this phase runs **before** it and does **not** replace it. Leave
the NEXT target unchanged (update only the status text in line 1 to record that Y.08 shipped).

### Read first, by path
- `CLAUDE.md` — standing rules, especially **§ Branch & PR rules**.
- `facts.md` — **§7 "Product 03 — baby blue"** (colourway, price 1999 MKD, sizes S/M/L/XL — all
  VERIFIED) and **§8 Photography + §8.1 Permissions** (the interim-lifestyle override `D-Y.03-7`, the
  frame count, and the guardian-consent rule for Vladimir's own image).
- `src/_project-state/current-state.md` — NEXT line, **placeholder register rows #2 and #8**, the
  owed-verification register.
- `Decisions.md` — `D-Y.03-1` (images keyed by SLUG, never index), `D-Y.03-3`, `D-Y.03-6`,
  `D-Y.03-7`, `D-Y.03-8`, `D-0-6` (no AI imagery), `D-2.21-*` (showcase).
- `src/_project-state/completions/Part-2-Phase-Y03.md` — how the first two frames were wired and
  verified. This phase follows the same pattern.

### The code as it stands (verified against `main`, 2026-09-29)
- `src/lib/product-images.ts` — `PRODUCT_IMAGES` maps slug → one `ProductImage`
  (`src`, `altKey`, `objectPosition`). Entries exist for `test-mustard-ochre` and `test-off-white`
  only. The header comment says `test-baby-blue` is deliberately absent. `AltKey` is a closed union.
- `src/components/product/ProductCard.tsx` — card uses `getProductImage(slug)`.
- `src/app/[locale]/catalog/[slug]/page.tsx` (~line 136–165) — slot 1 uses `getProductImage`; slot 2
  is always a `PhotoSlot` placeholder.
- `src/lib/showcase.ts` — Home showcase includes only products that have a frame in
  `product-images.ts`. **Adding a baby-blue entry makes Product 03 appear in the Home showcase
  automatically** (template-propagated — see Task 5).
- `tests/home/showcase.test.ts` — asserts `test-baby-blue` is never in the showcase (lines ~26, 71–74,
  96). That assertion becomes wrong after this phase.
- `src/config/products.ts` — `test-baby-blue` already has sizes **S, M, L, XL** (stock 3 each) and
  `photoPath: null`. **Nothing in this file changes.**
- `src/messages/{mk,en}.json` — existing alt keys under `Product`: `photoAltOchre`,
  `photoAltOffWhite`, `photoAltComposite`.

### The two new image files (supplied, already prepared)
Lazar places both in `public/images/lifestyle/` before this session starts.

| File | Size (px) | Bytes | What it is |
|---|---|---|---|
| `baby-blue-01.webp` | **640 × 800** (exactly 4:5) | 90,910 | Vladimir seated at the bar, baby-blue shirt. **Already cropped** to remove his legs — **Vladimir's own instruction** (via Lazar, 2026-09-29). Do not re-crop, re-expand or replace it with an uncropped version. |
| `baby-blue-02.webp` | **640 × 960** (2:3) | 53,876 | The adult model (§8.1 #2) standing, same shirt. Uncropped. |

Both are real photographs from the same venue as the existing frames (§8.1 #1). Not generated,
not retouched beyond the crop and WebP conversion.

**Known limits — record, do not fix:**
- **Resolution.** 640 px wide (the existing frames are 1333 px). Fine for the 280 px desktop slot;
  visibly soft full-width on a high-density phone. **Do not upscale** — upscaling invents pixels.
  Replacing them with full-size originals later is a file swap.
- **Colour.** Under the bar's warm tungsten light the baby-blue shirt reads **pale grey** — sampled
  shirt RGB ≈ (158, 152, 147) / (168, 157, 145). This is the same defect `facts.md` §8 records for
  the mustard frame, and it is **worse** here because warm light neutralises a pale blue. The §7
  colourway row therefore stays **"VERIFIED (owner-stated)"** — it must **not** be upgraded to
  "VERIFIED (photos)".

---

## Scope

**In scope**
- Wire `baby-blue-01.webp` to Product 03's catalog card and first product-page slot.
- Wire `baby-blue-02.webp` to Product 03's **second** product-page slot.
- One new alt-text key (MK + EN).
- Showcase test updated for Product 03 now having a frame.
- `facts.md` §7 / §8 / §8.1 + changelog, `Decisions.md`, `current-state.md`, `file-map.md`.

**Out of scope — do not touch**
- `src/config/products.ts`, `src/config/drops.ts`, `supabase/`, `create_order`,
  `expire_reservations`, cart, checkout, `src/lib/drop/`, `npm run sync:drop`. Sizes and stock for
  Product 03 are **already** S/M/L/XL — no change.
- The mustard and off-white entries and their second slots (they stay placeholders).
- `PhotoSlot.tsx` internals, `globals.css`, `brand.md`, `next.config.ts`, any npm dependency.
- `HomeExperience.tsx` / the hero.
- Product 03's **name** — it stays the neutral slot "Производ 03" (placeholder register #4).
- Any new copy beyond the one alt string.

---

## Tasks

1. **Preflight.** Confirm `main` is clean and no other phase branch is unmerged. Cut
   `phase-Y.08-baby-blue-photos`. Confirm both files exist at `public/images/lifestyle/` with the
   exact dimensions and byte sizes in the table above. If either is missing or differs, stop and
   file a BLOCKED report — do not substitute any other image.

2. **Tests first (red).** In a new or existing test for `product-images.ts`, assert:
   `getProductImage("test-baby-blue")` returns `/images/lifestyle/baby-blue-01.webp`;
   `getProductSecondImage("test-baby-blue")` returns `/images/lifestyle/baby-blue-02.webp`;
   `getProductSecondImage` returns `null` for `test-mustard-ochre`, `test-off-white` and an unknown
   slug. In `tests/home/showcase.test.ts`, replace the "never includes test-baby-blue" assertions
   with (a) Product 03 **is** included when present, and (b) a product with **no** frame is still
   skipped — use a slug that has no entry (e.g. `test-no-photo`), so the skip rule stays covered.
   Watch them fail.

3. **Wire the images** in `src/lib/product-images.ts`:
   - Add a `test-baby-blue` entry to `PRODUCT_IMAGES`: `baby-blue-01.webp`, alt key
     `Product.photoAltBabyBlue`, `objectPosition: "center"` (the file is already 4:5, so nothing is
     cropped).
   - Add a **separate** slug-keyed map `PRODUCT_SECOND_IMAGES` containing **only** `test-baby-blue`
     → `baby-blue-02.webp`, same alt key, starting `objectPosition: "center 40%"`, and export
     `getProductSecondImage(slug): ProductImage | null`. Keyed by slug, never by index
     (`D-Y.03-1`). `getProductImage`'s signature does not change, so `ProductCard` and
     `showcase.ts` need no edit.
   - Extend the `AltKey` union with `'Product.photoAltBabyBlue'`.
   - Rewrite the header comment: baby blue now has two interim lifestyle frames; the neutral
     front/back/print-detail set is still owed for all three colourways; these frames are
     **replaced**, not extended, when it lands.

4. **Product page second slot.** In `src/app/[locale]/catalog/[slug]/page.tsx`, pass
   `getProductSecondImage(product.slug)` into the second `PhotoSlot` the same way slot 1 receives
   its image. When it returns `null` the slot renders exactly as today. Update the comment above the
   slots: Product 03 now fills both; Products 01/02 keep a placeholder in slot 2.

5. **Showcase (template-propagated).** No code change expected — confirm Product 03 now appears in
   the Home showcase using `baby-blue-01.webp`, in both locales. This is a front-door change
   caused by a Catalog edit; record it in the report and as a decision.

6. **Alt text.** Add `Product.photoAltBabyBlue` to both catalogs:
   - MK: `Светлосина маица со црвен принт, носена.`
   - EN: `Baby-blue t-shirt with red print, worn.`
   The colour word comes from `facts.md` §7 ("baby blue"), the print description matches the two
   existing alt strings. One key serves both frames. Regenerate `docs/i18n/string-inventory.md`.
   Commit an **unsigned** MK review pack at `docs/i18n/mk-review-y08.md` with this one string.

7. **Framing check.** Render at 390 px and 1280 px, both locales:
   `/katalog`, `/en/catalog`, `/katalog/test-baby-blue`, `/en/catalog/test-baby-blue`, `/`, `/en`.
   Card and slot 1: face and full shirt visible, **no legs anywhere**. Slot 2: the model's face and
   the whole shirt in frame; tune only `objectPosition` on the second entry if needed. Record the
   final value.

8. **`facts.md`** (dated 2026-09-29, with changelog row):
   - §7 Product 03, `Photos` row → "**Two interim lifestyle frames on hand** (bar location) —
     `baby-blue-01`, `baby-blue-02`, received via Lazar 2026-09-29. Neutral front/back/print-detail
     set **still OWED** (Vladimir)." Colourway row: **unchanged** — add one sentence that under warm
     light the shirt reads pale grey, so the colourway stays owner-stated.
   - §8 asset table: frame count **3 → 5** (two baby-blue frames added); the "no baby-blue frame"
     sentence is updated, not deleted, with the date. Record the crop as Vladimir's instruction.
   - §8.1: add a dated note that the two new frames are from the same venue (#1) and show the same
     adult model (#2) and Vladimir (#3 — his instruction to publish, with the leg crop). Record
     **#5 guardian consent for the new frame of Vladimir as OWED — merge gate** (it was recorded for
     the July frames only). No names, no message text, no screenshots (PII rule, `D-0-1`).

9. **State + decisions.** Log in `Decisions.md` (append-only):
   - `D-Y.08-1` Phase run out of order ahead of NEXT, on Lazar's instruction; NEXT target unchanged.
   - `D-Y.08-2` `D-Y.03-7`'s interim-lifestyle override extended to Product 03, Lazar's call. Downside:
     the shirt reads grey, not baby blue, under tungsten light; on cash on delivery the customer may
     receive a colour bluer than what they saw.
   - `D-Y.08-3` Product 03's second slot is filled via a separate slug map; Products 01/02 unchanged.
     Downside: Product 03's page no longer visibly signals that the back/print-detail shot is owed.
   - `D-Y.08-4` Frame 01 cropped to 4:5 above the legs on Vladimir's instruction.
   - `D-Y.08-5` One alt key for both frames. Downside: a screen reader hears the same sentence twice.
   - `D-Y.08-6` Product 03 enters the Home showcase automatically (template-propagated).
   - `D-Y.08-7` Merge is gated on guardian consent for the new frame of Vladimir.
   Plus any decision you make on your own — surface each one in the report.

   `current-state.md`: line 1 status text; placeholder **#8 NARROWED** (interim frames exist,
   neutral set still owed — **not cleared**); #2 note mentions Product 03; add owed rows:
   (a) **guardian consent for the new Vladimir frame — merge gate**, owner Lazar;
   (b) Product 03 photos on a real phone on the live domain, both locales, owner Lazar;
   (c) MK review of `Product.photoAltBabyBlue`, owners Lazar + Petar.
   Update `file-map.md` (tree + change-log row).

10. **Verify, PR, report.** `npm run lint`, typecheck, `npm test`, `npm run build` all pass. Diff
    proves the out-of-scope list untouched. Open the PR from `phase-Y.08-baby-blue-photos` with the
    merge gate stated at the top of the description. Do **not** merge.

---

## Definition of Done

**Verifiable by Code**
- [ ] `public/images/lifestyle/baby-blue-01.webp` is 640×800, 90,910 bytes; `baby-blue-02.webp` is
      640×960, 53,876 bytes — byte-identical to what was supplied.
- [ ] New tests watched red, then green; showcase "no frame → skipped" rule still covered.
- [ ] `/katalog` and `/en/catalog`: Product 03's card shows `baby-blue-01`; Products 01/02 unchanged.
- [ ] `/katalog/test-baby-blue` and `/en/catalog/test-baby-blue`: slot 1 = `baby-blue-01`,
      slot 2 = `baby-blue-02`; both products 01/02 still show a placeholder in slot 2.
- [ ] Product 03 page lists sizes S, M, L, XL; price 1999 MKD; name is still "Производ 03" /
      "Product 03".
- [ ] No bare legs visible in any rendering of `baby-blue-01`, at 390 px and 1280 px.
- [ ] Home showcase includes Product 03 in both locales.
- [ ] `Product.photoAltBabyBlue` exists in MK and EN; key counts MK ⇔ EN identical; inventory
      regenerated; `mk-review-y08.md` committed unsigned.
- [ ] `git diff main --` on every out-of-scope path is empty.
- [ ] lint, typecheck, test, build all pass.
- [ ] `facts.md`, `Decisions.md` (`D-Y.08-1…7`+), `current-state.md`, `file-map.md` updated.
- [ ] PR open, not merged, merge gate in the description.

**Owed to Lazar (goes on the register)**
- [ ] Vladimir's parents confirm the new frame of him may be used commercially — **before merge**.
- [ ] Petar reviews the PR (`D-0-3`).
- [ ] After deploy: Product 03 card, product page and showcase on a real phone, both locales.
- [ ] MK alt string reviewed.

If Code has no browser tool, the report lists the six URLs from Task 7 and this checklist:
1. Product 03's card shows Vladimir in the baby-blue shirt, face and shirt fully visible.
2. No legs are visible on the card or on the product page.
3. Product 03's page shows two photos; the second shows the model's face and the whole shirt.
4. Products 01 and 02 look exactly as before.
5. Product 03 appears in the Home showcase in both MK and EN.

---

## Outputs & where they go
- Code, assets, tests → branch `phase-Y.08-baby-blue-photos`, one PR.
- MK review pack → `docs/i18n/mk-review-y08.md`.
- Completion report → `src/_project-state/completions/Part-Y-Phase-08-Completion.md`.
