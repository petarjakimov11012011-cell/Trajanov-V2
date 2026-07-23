# brand.md — Trajanov

**This file is the only source of design tokens.** Nothing hardcodes a colour, size, spacing, or
font value anywhere in the codebase. The design handover and all code read from here.

**Status: FILLED — Phase 1.02.** Every `TBD-1.02` slot is now a committed value. Tokens are wired
into `src/app/globals.css` and consumed by the components. **From here, `globals.css` mirrors this
file — if a value changes, it changes here first, then there.**

Seeded 2026-07-14 · Filled by: **Claude Code (Phase 1.02 — design system)**, 2026-07-15

> **Provenance note.** The filled companion `brand.md` and `Trajanov Mockups.dc.html` referenced by
> the Phase 1.02 handover were never delivered to the repo — only the handover prose + its contrast
> ledger were. These tokens were **derived from the handover's contrast ledger and the garment
> palette** and verified pair-by-pair against WCAG 2.2 AA (see §3). Colours and fonts are a
> defensible reconstruction, not a pasted approval — Lazar should eyeball them on screen and adjust.
> Logged as `D-1.02-1`.

---

## 1. Brand in one line

Trajanov. A 2026 Strumica clothing brand. One designer, real work, a competition win, and drops
that sell out. See `facts.md` — the only source for anything factual.

---

## 2. Direction — the approved sketch

Reconstructed from the Phase 1.02 handover, which is itself downstream of the approved visual
direction. It matches the kickoff opening read; nothing in it was invented past the handover.

- **Palette from the actual garments, not invented.** Mustard/ochre and off-white from the shirts;
  the red of the print as the only accent; a deep near-black (a faint teal cast, borrowed from the
  shoot) as the ground. The whole site is dark — there is no light mode.
- **Type does the work.** The shirts are boxy, unfussy, confident. The site is too — big type, a
  lot of air, few elements, no decoration for its own sake.
- **The countdown is the loudest object on the site.** Everything defers to it.
- **Mobile-first, genuinely.** Audience 1 arrives from an Instagram story, on a phone, in a hurry.
- **Restraint over effects.** Motion belongs to the countdown and the drop reveal. Nothing else.

---

## 3. Colour

Sampled to the garment palette described in `facts.md` §7 (mustard/ochre, off-white) with a print
red and a near-black ground. **Every pair below was computed, not eyeballed** — the WCAG 2.2 AA
ledger at the end of this section is the proof, and it reproduces the handover's target ratios.

| Token | Value | Use |
|---|---|---|
| `--color-ground` | `#0F1210` | Page ground (the `background`) |
| `--color-surface` | `#171A18` | Cards, panels, live bar off-states |
| `--color-surface-2` | `#1F2320` | Input fills, disabled buttons, subtle tint blocks |
| `--color-foreground` | `#ECE8E0` | Body text, countdown digits — off-white |
| `--color-muted-foreground` | `#ABA79E` | Secondary text, labels |
| `--color-mustard` | `#E2A93C` | Brand — buy button, dots, accents from the garment |
| `--color-mustard-hover` | `#EFB94F` | Buy-button hover only |
| `--color-on-mustard` | `#0B0D0B` | Near-black label **on** mustard fills |
| `--color-live` | `#E2A93C` | Drop-is-open bar (= mustard) |
| `--color-accent` | `#E0492E` | Print red — **urgency only**: low-stock, countdown-critical. Used sparingly or it stops meaning anything. |
| `--color-on-accent` | `#0B0D0B` | Near-black label **on** red / sold-out fills |
| `--color-soldout` | `#8C8880` | Sold out — legible grey, **not decorative; permanent on the page** |
| `--color-error` | `#F0857A` | Form errors (a lighter red than accent, so the two never blur) |
| `--color-border` | `#2A2E2B` | Hairlines, dividers — quiet |
| `--color-border-strong` | `#686D67` | Hairlines that must be seen: fields, the cap notice |
| `--color-focus-ring` | `#F2C55A` | Focus ring (light mustard), 2px at 2px offset over ground |

**Derived tints** (never hardcode — use `color-mix` against the token):

| Token | Value | Use |
|---|---|---|
| `--color-mustard-tint-8` | `color-mix(in srgb, var(--color-mustard) 8%, transparent)` | Size-picker selected fill |
| `--color-mustard-tint-6` | `color-mix(in srgb, var(--color-mustard) 6%, transparent)` | Cart cap-notice fill |
| `--color-glow` | `color-mix(in srgb, var(--color-foreground) 100%, transparent)` | Product-card pointer spotlight — the off-white foreground, never pure white (`D-2.10-1`) |

### Contrast ledger — WCAG 2.2 AA, all computed and passing

| Pair | Ratio | Needs |
|---|---|---|
| foreground / muted on ground | **15.4 / 7.9** | 4.5 |
| countdown digits (foreground) on ground | **15.4** | 4.5 |
| accent (red) on ground | **4.6** | 4.5 |
| mustard on ground | **9.0** | 4.5 |
| on-mustard (near-black) on mustard | **9.3** | 4.5 |
| on-accent (near-black) on red | **4.8** | 4.5 |
| error on ground | **7.5** | 4.5 |
| sold-out on ground / surface | **5.3 / 5.0** | 4.5 |
| border-strong on ground / surface | **3.6 / 3.3** | 3.0 |
| focus-ring on ground | **11.6** | 3.0 |

**Never use (all computed < AA, all avoided in code):** red on mustard **1.9** · off-white on
mustard **1.7** · white on red **4.24**. On mustard and on red, labels are always the near-black
`--color-on-mustard` / `--color-on-accent`.

---

## 4. Type

Both families ship a full, well-drawn Cyrillic — MK is the default language, not an afterthought.
Both are **SIL Open Font License**; commercial web use is permitted. Self-hosted at build via
`next/font/google` (no runtime request to Google — matters for the portability rule and for privacy).

| Token | Value | Use |
|---|---|---|
| `--font-display` | **Rubik** (600/700/800) | Countdown, headlines — boxy, confident, wide |
| `--font-body` | **Inter** (400/500/600) | Everything else — neutral, excellent Cyrillic, `tnum` |

Checked at display size against the Macedonian glyphs ѓ ќ љ њ џ ѕ ж ч ш — both render native forms,
not fallbacks. The countdown uses `--font-display` with `font-variant-numeric: tabular-nums` **and**
fixed-width cells, so no digit change shifts layout.

| Token | Size (clamp: mobile → desktop) | Line height | Use |
|---|---|---|---|
| `--text-countdown` | `clamp(2.75rem, 13vw, 5.5rem)` | `1` | The loudest thing on the site |
| `--text-h1` | `clamp(2.25rem, 7vw, 4rem)` | `1.04` | Page headlines |
| `--text-h2` | `clamp(1.5rem, 4vw, 2.25rem)` | `1.1` | Section headlines |
| `--text-body` | `1rem` | `1.6` | Body |
| `--text-small` | `0.8125rem` | `1.5` | Labels, helper text |
| `--text-price` | `1.25rem` | `1.2` | Prices — tabular |
| `--text-eyebrow` | `0.75rem` (uppercase, `0.14em` tracking) | `1.4` | Eyebrows, stock lines |

---

## 5. Spacing, radius, shadow

**Spacing:** Tailwind v4's default 4px scale is the one scale — no off-scale values. Use the utility
steps (`p-2`=8px, `p-4`=16px, `p-6`=24px, `p-8`=32px, `p-12`=48px, `p-16`=64px, `p-24`=96px). A
value that isn't a scale step is a bug.

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | `0.25rem` | Chips, badges |
| `--radius-md` | `0.5rem` | Buy button, fields |
| `--radius-lg` | `0.875rem` | Product cards, panels |
| `--radius-full` | `9999px` | Language pill, dots |
| `--shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.4)` | Raised chips (rare) |
| `--shadow-lg` | `0 16px 40px -12px rgb(0 0 0 / 0.7)` | Overlays: cart drawer, dialogs |

Dark, flat design — shadow is for overlays only, never decoration.

**Spotlight (product-card pointer glow) — one logged, narrowly-scoped exception (`D-2.10-1`).** The
interactive product card carries a subtle glow of the `--color-glow` token that follows the pointer.
That glow is decoration, so it is a deliberate, operator-approved exception to the "shadow is for
overlays only, never decoration" rule directly above — carved out **only** for product cards, on
hover/focus, fine-pointer only, with no animation loop and no transform. Nothing else on the site
may use it.

| Token | Value | Use |
|---|---|---|
| `--glow-size` | `240px` | Spotlight radius on the card surface |
| `--glow-opacity-surface` | `0.05` | Surface wash under the pointer |
| `--glow-opacity-edge` | `0.22` | The 1px card edge, lit under the pointer |

---

## 6. Motion

| Token | Value | Use |
|---|---|---|
| `--motion-fast` | `120ms` | Hover, focus |
| `--motion-base` | `220ms` | Transitions |
| `--motion-drop` | `480ms` | The drop reveal — the one moment worth animating |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Default easing for all of the above |

**`prefers-reduced-motion` is respected everywhere** — including the countdown (digits still update
as values, never as a flip/spinner) and the drop reveal (swap in place, no transform/fade). The live
dot is static under reduced motion.

**One logged, narrowly-scoped exception to "motion belongs to the countdown and the drop reveal,
nothing else" (§2 direction) — the product-card pointer spotlight (`D-2.10-1`).** The card glow is
pointer-tracked, so it is motion, and it is a deliberate, operator-approved exception carved out
**only** for product cards, on hover/focus, fine-pointer only. It is a plain opacity fade of a wash
whose position follows the cursor — no keyframe loop, no transform — so under
`prefers-reduced-motion: reduce` the global rule flattens its opacity transition to nothing and the
glow simply becomes static (a static glow is not motion); the glow itself is not disabled.

---

## 7. Components — specs land in the handover

Tokens here; full specs in `docs/design-handovers/Part-1-Phase-02-Handover.md`.

| Component | States that must be specified |
|---|---|
| **Countdown** | Days/hours/minutes/seconds. Under 1h. Under 1min. Zero → live. **Must not shift layout as digits change.** |
| **Drop banner** | Countdown / LIVE / ended |
| **Product card** | Available / low stock / sold out |
| **Stock badge** | Count / low / sold out |
| **Buy button** | Default / hover / focus / loading / disabled (pre-drop) / sold out |
| **Size picker** | Available / unavailable / selected |
| **Cart** | Empty / items / **at the 2-unit cap** |
| **Checkout field** | Default / focus / error / disabled |
| **Turnstile** | Where it sits, and what the form looks like while it resolves |
| **Language switch** | MK / EN |

**Every state above will actually occur, most of them on drop day, most of them on a phone.**
Sold-out is not an edge case here — it is the intended end state of every product.

---

## 8. Rules

- **Never hardcode a value.** If it is not a token, it is a bug.
- **Contrast checked on every pair, WCAG 2.2 AA.** Including sold-out and countdown (see §3 ledger).
- **Cyrillic checked at display size**, not Latin.
- **Mobile-first.** Design the phone, then widen.
- **Do not design a state that needs a fact we do not have.** No review stars, no "X sold", no
  testimonials — see `facts.md` §10. If a component needs one to look right, the component is wrong.
- **Photography:** real only (`D-0-6`). No hero that only works with an image we may not use.

---

## 9. Change log

| Date | Change | By |
|---|---|---|
| 2026-07-14 | Seeded at kickoff. **Empty — awaiting Phase 1.02.** | Claude Chat |
| 2026-07-15 | **Filled.** Palette derived from the handover ledger + garment colours, verified pair-by-pair against WCAG 2.2 AA. Type: Rubik (display) + Inter (body), both OFL, Cyrillic-checked. Spacing = Tailwind 4px scale. Provenance + derivation logged `D-1.02-1`. | Claude Code |
