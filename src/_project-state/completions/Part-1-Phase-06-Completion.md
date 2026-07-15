# Completion report — Part 1 Phase 06: Cart flow

| | |
|---|---|
| **Phase** | 1.06 |
| **Name** | Cart flow |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-15 |
| **Branch** | `phase-1.06-cart-flow` |
| **PR** | #6 |
| **Brief** | Part 1 · Phase 06 · Code — Cart flow |

---

## 1. What shipped

- **Checkout now orders what the customer actually chose.** A product page's selected (product,
  variant, quantity) flows through a real cart, into checkout, into `create_order()`, and onto the
  `order_items` row. The stand-in — which submitted the active drop's first in-stock variant no matter
  what was picked — is **deleted**. This closes carryover `D-1.04-16`.
- **A client cart** that survives a refresh and product → cart → checkout navigation within a tab, and
  dies with the tab (sessionStorage). It never reserves, holds, or decrements stock, and never writes
  to `variants`/`orders`/`order_items`.
- **The buy path is wired**: pick a size (required before Add; sold-out sizes unselectable), Add to
  cart, see an inline confirmation. The 1.02 handover's six buy-button states and three size-picker
  states are connected, not redesigned.
- **The cart page** shows real lines, the 2-unit cap (disabled "+" + cap notice), and an empty state;
  **checkout** reads the cart and rejects an empty cart before `create_order()` is ever reached.
- **The client → server boundary carries `variant_id` + `qty` only** — never a price, never a name.
  The server still snapshots `unit_price_mkd` inside `create_order()`.

---

## 2. Decisions I made on my own

Logged in `Decisions.md`, `D-1.06-5` … `D-1.06-10` (the brief's own `D-1.06-1`…`4` were appended
verbatim first, before any code).

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| D-1.06-5 | Cart = a sessionStorage-backed module store via `useSyncExternalStore`; pure logic in `src/lib/cart/cart.ts`. **No new dependency.** | localStorage (outlives the drop); a state lib (dependency); Context + `useEffect` hydration (trips lint, flashes) | Per-tab only — no cross-tab sync; a new tab starts empty (allowed by the brief) |
| D-1.06-6 | Cap = **2 total units per order** (`MAX_UNITS_PER_ORDER`), mirroring `create_order()` step 3. | A per-line cap of 2 (would allow 4 units → `TR003`) | None of substance — records the Plan/DB agreement (see §3) |
| D-1.06-7 | Expose `variant_id` (`SizeOption.variantId`) + `dropSlug` to the client; submit `variant_id`+`qty` only | Resolve size→variant server-side at submit (more client data, a re-introduced server pick) | Variant UUIDs appear in page HTML — not secret (catalog is public-read via RLS) |
| D-1.06-8 | Empty-cart guard in `processOrder` (pure core) returning `{status:"empty"}` | Guard only in the server action (not unit-testable) or only client-side (bypassable) | A new `OrderOutcome` variant ripples into the checkout message switch |
| D-1.06-9 | Seed a 2nd product (`test-tee-two`, sort_order 2) so the phase test can discriminate against the stand-in | Rely on variant array order (fragile); insert fixtures in-test (leak on the shared DB) | `seed.sql` grows; needs a `supabase db reset` (done). Not a migration |
| D-1.06-10 | Product-page add feedback ("Added. View cart") + "Choose a size" gate via inline `aria-live`; header cart badge left unwired | Silent add (poor COD UX); wiring the header (out of scope) | A small affordance not drawn in the handover; no live header count |

---

## 3. Surprises and off-spec changes

- **Task 2 — the cap: the Plan and the database AGREE.** `create_order()` step 3 enforces that the
  **sum of quantities across the order is 1..2**. That is exactly the Plan's "max 2 units per order."
  The `order_items.qty` `1..2` CHECK is a looser per-row backstop that never binds once the total is
  capped at 2. The brief flagged a *possible* disagreement (two items × qty 2 = 4 units); that is real
  for the per-row CHECK but **not** for the order-level rule `create_order()` actually enforces. The
  cart mirrors the order-level rule: 2 total units. No disagreement to report; nothing in the Plan or
  `create_order()` was changed.
- **Exercised the live buy path via the seed's `test-open-drop`, not by shifting the config drop.**
  The brief suggested shifting the committed `test-drop` window locally. After `supabase db reset`, the
  DB holds the **seed** fixtures, and `test-open-drop` is already open and priced — a cleaner live drop
  to render against (a full priced order completes, vs. the config `test-drop` which is ended and
  null-priced → `TR002`/`TR006`). **`src/config/drops.ts` was never touched**, so the DoD item "the
  committed `test-drop` window is unchanged" holds trivially.
- **The cart shows neutral slot names ("Производ 02"), not the product name.** This matches the
  original 1.02 cart and placeholder register #4 (names render as neutral slots while OWED). With the
  *seed's* test names present, the product page shows "TEST — Tee 03" while the cart shows "Product 02";
  in production (null names) both render neutral slots. The cart intentionally never stores or sends a
  product name.
- **Pre-existing observation, not fixed (out of scope): `create_order()` does not assert that a
  submitted `variant_id` belongs to the named drop.** It enforces the *named* drop's window + the
  variant's stock + price, but a crafted client could name an open drop while submitting a variant from
  a different (e.g. ended) drop. This is unchanged by this phase (the old stand-in derived both from the
  same active drop server-side; the cart now provides both, both server-sourced at add time). Oversell
  is still impossible (atomic decrement); the gap is a *window-bypass* edge. Touching `create_order()`
  is explicitly out of scope — flagging it as a candidate hardening for a future phase (add a
  `variant → product → drop` membership check).
- **No React `CartProvider` in the end state.** I first wired a Context+effect provider; ESLint's
  `react-hooks/set-state-in-effect` (React 19) correctly flagged the hydration `setState`. The
  idiomatic fix is `useSyncExternalStore` with a null server snapshot, which also removed the need for a
  provider entirely (`src/app/[locale]/layout.tsx` is back to its `main` state — net unchanged).

---

## 4. Files touched

`file-map.md` updated: **yes**.

| File | A/M/D |
|---|---|
| `src/lib/cart/cart.ts` | Added — pure cart reducer + cap + `toOrderItems` |
| `src/components/cart/cart-store.ts` | Added — sessionStorage `useSyncExternalStore` store |
| `src/components/product/AddToCartPanel.tsx` | Added — size→variant→add cluster |
| `tests/cart/cart.test.ts` | Added — pure cart reducer tests |
| `tests/orders/checkout-items.test.ts` | Added — cart→create_order integration |
| `src/types/drop.ts` | Modified — `SizeOption.variantId` |
| `src/lib/drop/state.ts` | Modified — expose `variantId`/`dropSlug`; **deleted the stand-in** |
| `src/components/product/SizePicker.tsx` | Modified — controllable (selected/onSelect) |
| `src/components/product/BuyButton.tsx` | Modified — real `onClick` (keeps demo fallback) |
| `src/components/cart/CartView.tsx` | Modified — reads the store |
| `src/components/checkout/CheckoutForm.tsx` | Modified — reads the cart; empty state |
| `src/app/[locale]/catalog/[slug]/page.tsx` | Modified — uses `AddToCartPanel` |
| `src/app/[locale]/cart/page.tsx` | Modified — no hard-coded lines |
| `src/app/[locale]/checkout/page.tsx` | Modified — passes only `siteKey` |
| `src/app/[locale]/styleguide/page.tsx` | Modified — `variantId` on sample sizes |
| `src/lib/orders/process-order.ts` | Modified — empty-cart guard + `"empty"` outcome |
| `src/lib/orders/actions.ts` | Modified — delegates empty case to `processOrder` |
| `src/messages/{mk,en}.json` | Modified — `Buy.added`, `Buy.viewCart`, `Order.emptyCart` |
| `supabase/seed.sql` | Modified — added `test-tee-two` (2nd product in test-open-drop) |
| `tests/orders/process-order.test.ts` | Modified — empty-cart case |
| `Decisions.md`, `Trajanov-V2-Phase-Plan.md`, `current-state.md`, `file-map.md` | Modified — state/index/decisions |

**Not touched (out of scope, confirmed):** any `supabase/migrations/` file, `create_order`,
`expire_reservations`, Turnstile, the IP rate limit, `facts.md`, `src/config/drops.ts`, the header,
`src/app/[locale]/layout.tsx` (net unchanged). **No new dependency** (`package.json` unchanged).

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | ✅ Compiled + TypeScript pass; 17 static pages generated |
| Types | `npx tsc --noEmit` | ✅ clean |
| Lint | `npm run lint` | ✅ clean (0 problems) |
| Unit / integration | `npm test` | ✅ **46 passed** (12 files); 31 prior + 15 new |

**New tests (15):** `tests/cart/cart.test.ts` (10 — choice recorded, 2-unit cap across/within lines,
`setItemQty` clamp/remove, `toOrderItems` carries only `{variantId, quantity}`);
`tests/orders/checkout-items.test.ts` (4 — chosen `test-tee-two/L` reaches `order_items`; two items →
two rows; cap client+server (`TR003`); sellout → clean `TR004`, no partial order); `process-order.test.ts`
(1 — empty cart rejected before `create_order`).

**The phase test was confirmed to FAIL against the stand-in before deletion.** A temporary throwaway
(`_red-standin.test.ts`, deleted after) reproduced the deleted stand-in (the drop's first product's
first in-stock variant) and ran the phase assertion against it:

```
FAIL  tests/orders/_red-standin.test.ts > RED: the stand-in submits the wrong product
AssertionError: expected [ { slug: 'test-tee-black', …(2) } ] to deeply equal [ { slug: 'test-tee-two', …(2) } ]
- Expected  + Received
      "size": "L",
-     "slug": "test-tee-two",
+     "slug": "test-tee-black",
```

The customer chose `test-tee-two/L`; the stand-in submitted `test-tee-black` (the drop's first
product). Against the cart, the same assertion passes. A test that passed both ways would be testing
nothing.

**Concurrent-order test — mandatory (order path changed):**

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ tests/concurrency/oversell.test.ts > create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0 101ms` — `Tests 1 passed (1)` |

Re-run in the full suite as well (`npm test` → 46 passed). The 7 rejections are each specifically
`insufficient_stock` (`TR004`), stock ends at 0, exactly 3 orders written.

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| Selecting a specific product + size → `order_items` row names that product+variant; test failed against the stand-in first | ✅ |
| Two items in one cart → two `order_items` rows, correct variants + quantities | ✅ |
| Stand-in deleted, not bypassed — `grep getActiveOrderContext\|CheckoutContext` returns nothing | ✅ |
| `placeOrder` accepts `variant_id` + `qty` only (no price, no name crosses the boundary) | ✅ (read the Server Action input type + `toOrderItems`) |
| Client cap matches `create_order()` (2 total units); Plan agrees | ✅ (§3) |
| Empty cart rejected before `create_order()` (client empty state + `processOrder` `"empty"`) | ✅ |
| Variant selling out mid-flow → clean `TR004`, no partial order | ✅ |
| No cart code path writes to `variants`/`orders`/`order_items` | ✅ (verified by reading — the only DB write is `create_order` via `placeOrder`) |
| No `supabase/migrations/` file added/modified; `create_order`/`expire_reservations` unchanged | ✅ |
| Concurrent test re-run: 10/3 → exactly 3 | ✅ (§5) |
| `npm run build` / `tsc` / `lint` / `test` green | ✅ |
| Pages rendered both locales, 390 + 1180, vs the handover + `brand.md` | ✅ (§ below) |
| Committed `test-drop` window unchanged | ✅ (config never touched; live path used the seed drop) |
| New strings in both catalogs, identical key sets (130 each); humanizer pass | ✅ |
| No colour/size/spacing value outside `brand.md` (reused tokenised classes) | ✅ |
| No new placeholder shipped; register unchanged at rows #1–#5 | ✅ |
| No new factual claim; `facts.md` untouched | ✅ |
| Secrets clean | ✅ (§9) |

**Render check (in-browser, dev server against the live seed drop):**
`/catalog` (EN 390, MK 1180), `/catalog/[slug]` (EN 390 with live interaction, MK 1180),
`/cart` (EN 390 at the 2-unit cap, MK 1180 two-column), `/checkout` (EN 390 form + empty state).
Verified: size picker available/selected (2px mustard)/unavailable (struck-through, disabled) states;
"Choose a size" gate; "Added. View cart" confirmation; cart persisted exactly `{variantId, dropSlug,
productSlug, productIndex, size, qty}` (no price/name); cap notice + disabled "+"; empty checkout shows
no form. No console errors.

### Owed to Lazar

| # | Item | Steps | What "pass" looks like |
|---|---|---|---|
| ~~6~~ | ~~Fresh-session PR review of PR #6 (`D-1.06-2`)~~ | **WAIVED by the operator (`D-1.06-11`)** — PR #6 merged without it | n/a — waived, not verified |

**Update (post-report):** the operator chose to **waive** the fresh-session review (`D-1.06-2`) and
merge PR #6. Logged as `D-1.06-11`; `D-1.06-2` marked superseded; owed-verification register item #6
removed as *waived* (not verified). The author's work merged with no independent check — mitigations
that remain: the automated phase test (RED against the stand-in, GREEN against the cart), the 46-test
suite incl. the oversell gate, and the render check. Registers #1/#2 (1.05 merge-blockers) and #4/#5
(deferred to 1.07) carry forward unchanged — see the register note.

---

## 7. Placeholders shipped

**None new.** The cart and checkout surface the **existing** price placeholder (register #1, which
already lists Cart/Checkout) and the **existing** neutral-slot product name (register #4, which the
1.02 cart already used). No new `[PLACEHOLDER: …]` text was added; the register stays at 5 rows. The
photo + fabric/care **DB columns** remain deferred to `Y.01` (`D-1.06-3`), not built here.

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED `facts.md` entry | ✅ (this phase makes no factual claim; `facts.md` untouched) |
| `humanizer` pass run on user-facing copy | ✅ (`Buy.added` "Added.", `Buy.viewCart` "View cart", `Order.emptyCart` "Your cart is empty.") |
| No fashion-magazine filler | ✅ |
| No invented testimonials / reviews / counts / awards / partners / team / address | ✅ |
| Template-propagated strings verified against `facts.md` | n/a — no facts strings |
| No AI-generated product imagery (`D-0-6`) | ✅ (photo slots remain placeholders) |
| No untranslated EN string in the MK build | ✅ (both new keys present in `mk.json`; verified 130/130 identical key sets) |

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ✅ |
| `.env*` still gitignored | ✅ (`.env.local` untracked) |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ✅ (only the public Turnstile sitekey, unchanged) |
| No order PII in logs | ✅ (no logging added; cart holds no PII) |

No secret was committed at any point on this branch.

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| Fresh-session PR review of PR #6 | a fresh Claude Code session | reviewer, pre-merge |
| Order-confirmation email / Resend | Vladimir's email | 1.07 |
| Hosted Supabase + Vercel project + real Turnstile keys | 1.07 accounts | Cowork + Code (1.07) |
| Photos / prices / names / sizes / fabric → `Y.01` | Vladimir | Vladimir (critical path) |

`D-1.04-16` is **closed** (removed from Carryovers). No new build-side blockers introduced by this phase.

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ✅ |
| `current-state.md` — owed-verification register | ✅ (added #6) |
| `current-state.md` — placeholder register | ✅ (note updated; no new rows) |
| `file-map.md` — matches disk | ✅ |
| `00_stack-and-config.md` — new deps / pins / config | n/a — **no dependency added** |
| `Decisions.md` — `D-1.06-1`…`4` verbatim + `D-1.06-5`…`10` | ✅ |

**`NEXT:` line I set:** `NEXT: 1.07 — Deploy + hosted Supabase + Resend + real keys`
