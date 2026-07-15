# Part 1 · Phase 02 — Design handover

**Phase:** 1.02 Design system · **Delivered by:** Claude Design · **Date:** 2026-07-15
**Companion files:** filled `brand.md` (tokens), `Trajanov Mockups.dc.html` (interactive mocks +
live countdown + colour/type/glyph reference), `Part-1-Phase-02-Completion.md` (decisions).

This document specs **every state** in `brand.md §7`. All values reference tokens — **no raw
values**. The interactive mocks show the primary states in context; this is the exhaustive list.

---

## Screen mocks delivered (in `Trajanov Mockups.dc.html`)

Mobile-first (390px) + widened desktop (1180px), MK reference with EN parity where string length
matters:

- **Home — countdown** (MK + EN) · live ticking countdown, type-led, works with no photo.
- **Home — LIVE drop** (MK) · live banner, product grid with available / low-stock / sold-out.
- **Catalog grid** (MK) · 4-piece drop incl. a sold-out card.
- **Product page** (MK) · buy path above the fold, detail below (audience 1 vs 2, Plan §3).
- **Cart at the 2-unit cap** (MK) · cap notice, COD note.
- **Checkout — one screen** (MK) · fields + error state + Turnstile resolving + COD summary.
- **Desktop cases** · Home countdown, Product page.
- **Component-state strip** · buy button (all 6 states) + size picker (3 states).

Use the demo buttons under the Home-countdown mock (2d / <1h / <1min / LIVE) to see the countdown
cross its thresholds live.

---

## Component specs

### 1. Countdown
- **Layout:** four fixed-width digit cells (ДЕНА/ЧАСА/МИН/СЕК · DAYS/HRS/MIN/SEC), each a flex
  cell, `--font-display`, `--text-countdown`, `font-variant-numeric: tabular-nums`. Separators are
  static colons in `--color-border-strong`. **No layout shift across any digit change** (equal
  digit advance + fixed cells).
- **Default (>1h):** digits `--color-foreground`, labels `--color-muted-foreground`.
- **Under 1h:** seconds cell switches to `--color-accent` (urgency begins). No size change.
- **Under 1min:** whole time uses `--color-accent`; optional 1px `--color-accent` underline. Still
  no reflow.
- **Zero → LIVE:** at 00:00:00:00 the countdown is replaced in place by the Drop banner LIVE state
  (see below) via the `--motion-drop` reveal. Reduced-motion: swap with no transform/fade.
- **Reduced motion:** digits still update (value change, not animation); no flip/spinner.

### 2. Drop banner
- **Countdown state:** eyebrow "Следно спуштање / Next drop" `--color-muted-foreground` + the
  Countdown component.
- **LIVE state:** full-width `--color-live` (mustard) bar, near-black text `--color-on-mustard`,
  a pulsing near-black dot (`--motion-drop`/pulse), label "СПУШТАЊЕТО Е ВО ЖИВО / DROP IS LIVE",
  remaining count right-aligned (tabular).
- **Ended state:** `--color-surface` bar, `--color-muted-foreground` text
  "Спуштањето заврши / Drop ended", link to follow `@trajanovv2026` for the next.
- **Reduced motion:** dot is static (no pulse).

### 3. Product card
- **Available:** `--color-surface` card, `--radius-lg`; photo slot (placeholder until 1.06);
  title `--font-display` `--color-foreground`; price `--text-price` tabular; "На залиха" in
  `--color-muted-foreground` with a `--color-mustard` dot.
- **Low stock:** adds a `--color-accent` badge ("УШТЕ n / n LEFT") top-left of the image and a
  `--color-accent` stock line.
- **Sold-out:** image desaturated (`grayscale`, reduced opacity), all text `--color-soldout`,
  `--color-soldout` "РАСПРОДАДЕНО / SOLD OUT" chip (near-black label). Card is non-interactive.

### 4. Stock badge
- **Count (n≥ low threshold):** not shown, or subtle `--color-muted-foreground`.
- **Low (≤ threshold):** `--color-accent` fill, `--color-on-accent` label — urgency.
- **Sold-out:** `--color-soldout` fill, `--color-on-accent`(=near-black) label — permanent, never
  decorative.

### 5. Buy button
- **Default:** `--color-mustard` fill, `--color-on-mustard` label, `--font-display`, `--radius-md`.
- **Hover:** `--color-mustard-hover` (`--motion-fast`).
- **Focus:** 2px `--color-focus-ring` at 2px offset over ground.
- **Loading:** fill held, near-black spinner, label "Се додава… / Adding…", control disabled.
- **Disabled (pre-drop):** `--color-surface-2` fill, `--color-muted-foreground` label,
  `cursor:not-allowed` — "Наскоро / Coming soon".
- **Sold-out:** transparent fill, 1px `--color-soldout` border + label, non-interactive.

### 6. Size picker
- **Available:** 1px `--color-border-strong`, `--color-foreground` label.
- **Selected:** 2px `--color-mustard`, `--color-mustard` label, 8%-mustard tint fill.
- **Unavailable:** 1px `--color-border`, `--color-muted-foreground` struck-through, non-interactive.

### 7. Cart
- **Empty:** centered `--color-muted-foreground` message + link back to the drop.
- **Items:** rows (thumb, title `--font-display`, size `--color-muted-foreground`, price tabular,
  qty stepper, remove ×); sticky summary footer on `--color-surface`.
- **At the 2-unit cap:** the "+" stepper is disabled (`--color-muted-foreground`); a
  `--color-border-strong` notice on 6%-mustard tint states the ≤2-per-order limit. Total tabular;
  shipping "се пресметува при подигање" (COD).

### 8. Checkout field
- **Default:** `--color-surface-2` fill, 1px `--color-border-strong`, `--color-foreground` value,
  `--color-muted-foreground` label.
- **Focus:** 2px `--color-mustard` border, no outline.
- **Error:** 1px `--color-error` border + `--color-error` helper text below.
- **Disabled:** `--color-surface` fill, `--color-muted-foreground` text, `not-allowed`.

### 9. Turnstile
- **Placement:** directly above the summary/place-order block in the one-screen checkout, full
  width, inside a `--color-border` box on `--color-surface`/ground tint.
- **Resolving state:** the place-order button stays disabled; a `--color-mustard` spinner +
  "се проверува / verifying" is shown until Turnstile resolves. Reduced-motion: static ring.

### 10. Language switch
- Pill (`--radius-full`) with a 1px `--color-border-strong` outline; active segment
  `--color-mustard` fill + `--color-on-mustard`, inactive `--color-muted-foreground`. Shows
  **МК / EN**. MK is default; layouts tolerate MK↔EN length differences (see EN home mock — the
  longer "COMING SOON · NOT ON SALE YET" fits the same button box as the MK string).

---

## Contrast ledger (WCAG 2.2 AA — all pass)

| Pair | Ratio | Needs |
|---|---|---|
| body / muted off-white on ground | 15.0 / 7.6 | 4.5 |
| **countdown digits on ground** | **15.0** | 4.5 |
| countdown critical (red) on ground | 4.5 | 4.5 |
| mustard on ground | 8.3 | 4.5 |
| buy label (near-black) on mustard | 8.3 | 4.5 |
| red-fill label (near-black) on red | 4.5 | 4.5 |
| error text on ground | 6.2 | 4.5 |
| **sold-out on ground / surface** | **5.4 / 4.9** | 4.5 |
| border-strong on ground / surface | 3.4 / 3.0 | 3.0 |

**Never use (fail):** red on mustard 1.82 · off-white on mustard 1.82 · white on red 4.24.
