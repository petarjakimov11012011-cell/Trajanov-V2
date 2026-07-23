Part 2 · Phase 09 · Code — Size buttons in garment order (S · M · L · XL)

Why this matters — the size buttons on the product page currently read L · M · S · XL. That is alphabetical order, not clothing order, and it makes the buy cluster look broken on the one screen where a customer decides. This phase makes every product list its sizes the way a shirt label does — S, M, L, XL — with nothing else on the site touched.

## Context

This is an out-of-band UI phase, the same shape as 2.07 (footer), 2.08 (header) and Y.02. It is not on the critical path. Line 1 of `current-state.md` — the `NEXT:` line — is not changed by this phase; the 2.06 operator rehearsal remains next.

Read first, by path:

* `src/_project-state/current-state.md` — live state and registers; the 2.08 block is the pattern for how an out-of-band UI phase is recorded
* `CLAUDE.md` — repo rules: no secret, no hardcoded token value, no invented fact, PR not direct-to-`main`
* `src/lib/drop/state.ts` — where the bug is (see below)
* `src/components/product/SizePicker.tsx` — renders the sizes in array order; no change needed
* `src/components/product/AddToCartPanel.tsx` — the consumer; selection starts `undefined`, so nothing depends on which size is first
* `src/config/products.ts` — the catalogue; already lists sizes in the right order. It is not the source of the display order and must not be edited this phase
* `src/app/[locale]/styleguide/page.tsx` — its fixtures are already S/M/L/XL; leave them alone

## The bug, exactly

`src/lib/drop/state.ts`, in `toProductView()`:

```ts
const sizes: SizeOption[] = p.variants
  .slice()
  .sort((a, b) => a.size.localeCompare(b.size))
  .map((v) => ({ variantId: v.id, label: v.size, available: v.stock > 0 }));
```

`localeCompare` sorts the labels as text: L, M, S, XL. This is the only place size order is decided anywhere in the codebase (`grep -rn "localeCompare" src/` returns this one line). The order in `src/config/products.ts` is already S/M/L/XL, but the site reads variants back out of Postgres, where row order is not guaranteed, so this explicit sort is doing the ordering — it is just sorting by the wrong rule.

Consequence worth knowing before you start: this is one shared code path for every product. Fixing it fixes Product 01 (`test-mustard-ochre`) and Product 03 (`test-baby-blue`), and Product 02 (`test-off-white`) passes through the same changed line — but Product 02 has a single variant (XL only), so sorting a one-item list is a no-op and its rendered output must be byte-identical. That is required and checked in the Definition of Done. Do not add a per-product override (`D-2.09-2`).

## Scope

### In scope

* A canonical garment-size ordering rule, as a pure, unit-tested function.
* Wiring it into `toProductView()` in `src/lib/drop/state.ts`, replacing the alphabetical sort.
* A new unit test, written before the fix (`test-driven-development`).
* Rendered evidence on all three product pages, both locales.

### Out of scope — frozen, and `git diff --stat main` must prove untouched

* `src/lib/orders/`, `create_order`, `expire_reservations`, `supabase/migrations/`, any hosted or local DB write, `npm run sync:drop`
* Cart, checkout, `src/config/` (including `products.ts`), `src/lib/site.ts`
* `SiteHeader.tsx`, `SiteFooter.tsx`, `src/lib/seo/`, `sitemap.ts`, `llms.txt`, `manifest.ts`
* `src/messages/mk.json` / `en.json` — no new user-facing string is needed this phase
* `facts.md`, `brand.md` — no fact and no token changes
* The `Placeholder.sizesSample` caption („величини — примерок…" / "sizes — sample, pending Vladimir") and the design-preview notice banner. Both are stale relative to `facts.md` § 7 and both are Y.01's job, not this phase's. Leave the strings exactly as they are.
* No new npm dependency. `package.json` and the lockfile stay unchanged.

## The rule to implement

Sizes sort by their position in this canonical list, not alphabetically:

```
XS · S · M · L · XL · XXL · XXXL
```

* Match is case-insensitive and whitespace-trimmed (`" s "` sorts as `S`), but the label the UI renders is the original string from the database, unmodified — never a normalised copy.
* `2XL` is treated as `XXL`; `3XL` as `XXXL`.
* Any label not in the list sorts after every label that is, and unknown labels sort alphabetically among themselves. This keeps the order total and deterministic if Vladimir ever supplies "One size" or a numeric size, instead of the new label vanishing to the front by accident.
* Sizes are unique within a product (`src/config/schema.ts`), so there are no ties to break.

## Tasks

1. Cut branch `phase-2.09-size-order` from an up-to-date `main`. One branch at a time (`CLAUDE.md`).
2. Write `tests/drop/size-order.test.ts` first, and run it RED. It must assert at minimum:
   * a shuffled `["XL","L","S","M"]` orders to `["S","M","L","XL"]`
   * a single `["XL"]` is returned unchanged (the Product 02 case)
   * `["XXL","S","XL"]` orders to `["S","XL","XXL"]`
   * an unknown label (e.g. `["M","One size","S"]`) lands after the known sizes, deterministically
   * lowercase/padded input (`["m"," s "]`) orders correctly and the returned labels keep their original spelling
3. Add `src/lib/drop/size-order.ts` exporting the canonical list and a comparator (e.g. `compareSizeLabels(a: string, b: string): number`). This file must not import `server-only` — it has to be importable by a plain vitest run. Drive the test GREEN.
4. In `src/lib/drop/state.ts`, replace `.sort((a, b) => a.size.localeCompare(b.size))` with the new comparator. Update the surrounding comment so it says why the order is canonical rather than alphabetical. Nothing else in that file changes.
5. Run the gates (below).
6. Start the local stack (`supabase start`) and the dev server, and render all three product pages in both locales. Local database only — never `--linked`, never the hosted project, no sync, no reset. No DB change is needed for this fix; if the local catalogue is empty, seed it the normal local way and say so in the report.
   * `/katalog/test-mustard-ochre` and `/en/catalog/test-mustard-ochre` → S M L XL
   * `/katalog/test-baby-blue` and `/en/catalog/test-baby-blue` → S M L XL
   * `/katalog/test-off-white` and `/en/catalog/test-off-white` → XL, unchanged
7. Log the decisions below in `Decisions.md`, plus any of your own as `D-2.09-4` onward.
8. Sync `current-state.md` (2.08-style block; `NEXT:` line on line 1 unchanged) and `file-map.md`, file the completion report, open the PR. Do not merge — an operator merges on explicit instruction (`D-0-3`).

## Decisions to log in `Decisions.md`

Pre-decided by the orchestrator. Log each with its alternative and its downside.

* `D-2.09-1` — The size-order fix runs as an out-of-band UI phase, `NEXT:` unchanged. Alternative rejected: fold it into Y.01 with the real content load. Downside accepted: another entry and another deploy between now and the rehearsal, for a one-line behavioural change.
* `D-2.09-2` — One shared canonical size order for every product; no per-product override. Alternatives rejected: hardcode the order per product, or reorder rows in `products.ts` and hope Postgres returns them that way. Downside accepted: the operator scoped the change to Products 01 and 03, and Product 02 nonetheless passes through the same changed line — accepted because its single XL variant makes the sort provably a no-op, and because a per-product order would silently break the moment Vladimir's real drop adds a product.
* `D-2.09-3` — The comparator lives in its own pure module with a unit test, not inline in `state.ts`. Alternative rejected: an inline sort in `state.ts` (one file, no new test), which cannot be unit-tested because `state.ts` is `server-only`. Downside accepted: one more file and one more test to maintain, and the ordering rule now sits one import away from the code using it.

## Definition of Done

Every line provably true or false. Paste the evidence in the report.

### Behaviour

* [ ] `tests/drop/size-order.test.ts` was run RED before the fix and GREEN after — paste both outputs.
* [ ] Product 01 (`test-mustard-ochre`) renders S M L XL, left to right, in both locales. Evidence: screenshot or accessibility tree per locale.
* [ ] Product 03 (`test-baby-blue`) renders S M L XL, left to right, in both locales.
* [ ] Product 02 (`test-off-white`) renders XL and is unchanged — state explicitly that its rendered size row is identical to before the fix.
* [ ] Size selection, the sold-out/unavailable styling, and the cart still behave exactly as before: pick a size on a product page and confirm the existing behaviour is untouched.
* [ ] `grep -rn "localeCompare" src/` returns no hit in `src/lib/drop/state.ts`.

### Gates

* [ ] `npm run build` (exit 0), `npx tsc --noEmit`, `npm run lint` — all clean.
* [ ] `npm test` green, including `10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected`. Record the new total (was 85).
* [ ] `git diff --stat main` shows only `src/lib/drop/state.ts`, the new `src/lib/drop/size-order.ts`, the new test, and the state/decision files — every frozen path above untouched.
* [ ] `package.json` and the lockfile unchanged.
* [ ] No new `[PLACEHOLDER: …]` anywhere; no message-file edit; no `facts.md` or `brand.md` edit.

### State

* [ ] `Decisions.md` appended (`D-2.09-1…3`, plus any of your own).
* [ ] `current-state.md` updated with a 2.09 block in Status, in the 2.08 style, with line 1 `NEXT:` left exactly as it is.
* [ ] `file-map.md` synced — two files added.
* [ ] Completion report filed at `src/_project-state/completions/Part-2-Phase-09.md` from the template.

### After an operator merges (not before)

* [ ] Confirm on production `https://www.trajanovv.com`, both locales: Products 01 and 03 show S M L XL, Product 02 shows XL. Record it in the state file the way 2.08 recorded its production verification.

## Outputs & where they go

* Code → branch `phase-2.09-size-order`, PR to `main`. Do not merge.
* Completion report → `src/_project-state/completions/Part-2-Phase-09.md`
* This brief → `briefs/Part-2-Phase-09-Code.md`
