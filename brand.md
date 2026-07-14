# brand.md — Trajanov

**This file is the only source of design tokens.** Nothing hardcodes a colour, size, spacing, or
font value anywhere in the codebase. The design handover and all code read from here.

**Status: SEED — not filled in.** Claude Design fills it in **Phase 1.02**, after Lazar approves a
visual direction sketched in chat. Everything below marked `TBD-1.02` is a slot, not a value.
**Do not build UI against this file until 1.02 closes.**

Seeded 2026-07-14 · Filled by: *(Phase 1.02)*

---

## 1. Brand in one line

Trajanov. A 2026 Strumica clothing brand. One designer, real work, a competition win, and drops
that sell out. See `facts.md` — the only source for anything factual.

---

## 2. Direction — the approved sketch

> **Phase 1.02: paste the direction Lazar approved in chat here, then fill the tokens against it.**
> The orchestrator's opening read is below **as a starting point to react to, not a spec.** If the
> approved direction differs, replace this section entirely — do not try to reconcile them.

**Opening read (unapproved):**

- **Palette from the actual garments, not invented.** Mustard/ochre and off-white from the shirts;
  the red of the print as the only accent; a deep near-black or teal ground borrowed from the shoot.
- **Type does the work.** The shirts are boxy, unfussy, confident. The site should be too — big
  type, a lot of air, few elements, no decoration for its own sake.
- **The countdown is the loudest object on the site.** Everything defers to it.
- **Mobile-first, genuinely.** Audience 1 arrives from an Instagram story, on a phone, in a hurry.
- **Restraint over effects.** Motion belongs to the countdown and the drop reveal. Nothing else.

---

## 3. Colour

**Sample from the real photographs — do not eyeball a hex from memory.** Note that the bar's warm
lighting shifts the mustard; the daylight product shots (owed by Vladimir, `D-0-6`) are the truer
reference. **Where they disagree, the garment wins** — the site's yellow should match the shirt a
customer will actually open, not the shirt as the bar lit it.

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `TBD-1.02` | Page ground |
| `--color-surface` | `TBD-1.02` | Cards, panels |
| `--color-fg` | `TBD-1.02` | Body text |
| `--color-fg-muted` | `TBD-1.02` | Secondary text |
| `--color-brand` | `TBD-1.02` | Mustard/ochre — from the garment |
| `--color-accent` | `TBD-1.02` | Print red — **used sparingly, or it stops meaning anything** |
| `--color-live` | `TBD-1.02` | Drop is open |
| `--color-soldout` | `TBD-1.02` | Sold out — **legible, not decorative; this state is permanent on the page** |
| `--color-border` | `TBD-1.02` | |
| `--color-error` | `TBD-1.02` | Form errors |

**Contrast is not negotiable — WCAG 2.2 AA.** Mustard-on-white and red-on-mustard are both
plausible from this palette and both likely to fail. **Check every pair before committing it**,
including the sold-out state and the countdown. A countdown nobody can read is a countdown that
does not work.

---

## 4. Type

| Token | Value | Use |
|---|---|---|
| `--font-display` | `TBD-1.02` | Countdown, headlines |
| `--font-body` | `TBD-1.02` | Everything else |

**Must support Cyrillic properly.** MK is the default language — not an afterthought. A font whose
Cyrillic is an automated afterthought will look wrong to every primary customer and right to
nobody who matters. **Check the actual Macedonian glyphs** (ѓ, ќ, љ, њ, џ, ѕ, ж, ч, ш) rendered at
display size, not a Latin sample.

Licence must permit commercial web use. Record the licence here.

| Token | Size | Line height | Use |
|---|---|---|---|
| `--text-countdown` | `TBD-1.02` | | The loudest thing on the site |
| `--text-h1` | `TBD-1.02` | | |
| `--text-h2` | `TBD-1.02` | | |
| `--text-body` | `TBD-1.02` | | |
| `--text-small` | `TBD-1.02` | | |
| `--text-price` | `TBD-1.02` | | |

---

## 5. Spacing, radius, shadow

| Token | Value |
|---|---|
| `--space-*` | `TBD-1.02` — one scale, no off-scale values |
| `--radius-*` | `TBD-1.02` |
| `--shadow-*` | `TBD-1.02` |

---

## 6. Motion

| Token | Value | Use |
|---|---|---|
| `--motion-fast` | `TBD-1.02` | Hover, focus |
| `--motion-base` | `TBD-1.02` | Transitions |
| `--motion-drop` | `TBD-1.02` | The drop reveal — the one moment worth animating |

**`prefers-reduced-motion` is respected everywhere.** No exceptions, including the countdown.

---

## 7. Components — specs land in the handover

Tokens here; full specs in `docs/design-handovers/`.

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
Sold-out is not an edge case here — it is the intended end state of every product. Design it as
carefully as the available state.

---

## 8. Rules

- **Never hardcode a value.** If it is not a token, it is a bug.
- **Contrast checked on every pair, WCAG 2.2 AA.** Including sold-out and countdown.
- **Cyrillic checked at display size**, not Latin.
- **Mobile-first.** Design the phone, then widen.
- **Do not design a state that needs a fact we do not have.** No review stars, no "X sold", no
  testimonials — see `facts.md` § 10. If a component needs one to look right, the component is
  wrong.
- **Photography:** real only (`D-0-6`). The lifestyle set is pending model and venue permission and
  an age-appropriateness call — see `facts.md` § 8. **Do not design a hero that only works with an
  image we may not be allowed to use.**

---

## 9. Change log

| Date | Change | By |
|---|---|---|
| 2026-07-14 | Seeded at kickoff. **Empty — awaiting Phase 1.02.** | Claude Chat |
