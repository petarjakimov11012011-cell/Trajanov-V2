# Part 2 · Phase Y.04 · Code — Home hero photography

**Why this matters —** the Home page has shipped since 1.05 with no photograph, because the only
photography that existed was blocked on permissions. Those permissions landed on 2026-07-26
(`facts.md` §8.1, all five GIVEN). This phase puts a **real photograph** on the site's front door —
the use `facts.md` §8 always sanctioned — with the countdown above it and two calls to action
beneath it.

---

## Context

### What already exists

- **Phase 1.05** built the Home page as a **type-led countdown hero**, deliberately with no photo and
  no photo slot (`D-1.05-4`). That decision's own wording anticipated this phase: *"If the
  permissions land later, adding an image is a small, separate change."*
- **Phase Y.03** (merged 2026-07-26, PR #33) committed the **first images in this repo**:
  - `public/images/lifestyle/mustard-ochre-01.webp` — 1333×2000, ~209 KB
  - `public/images/lifestyle/off-white-01.webp` — 1333×2000, ~154 KB
  It also built `src/lib/product-images.ts` (binds an image to a product **by slug, never by index** —
  `D-Y.03-1`) and gave `PhotoSlot` an optional `image` prop backed by `next/image`.
- **`facts.md` §8.1** records five permissions as GIVEN (venue, adult model, Vladimir himself,
  the backdrop call, and **guardian consent for Vladimir's image**). Known Issue #6 is RESOLVED.
- **Phase 2.20** is the most recent merge — the header wordmark shine (`--color-shine`).

### Read first, by path

| Path | Why |
|---|---|
| `src/_project-state/current-state.md` | Live state, `NEXT:` line, both registers |
| `CLAUDE.md` | Repo standing rules — read in full before touching anything |
| `facts.md` §8 **and** §8.1 | What the photographs are, and exactly what is permitted |
| `Decisions.md` — `D-1.05-4`, `D-0-6`, `D-Y.03-1`, `D-Y.03-6`, `D-Y.03-7` | Why Home has no photo today, and the rules on imagery |
| `brand.md` §2, §3, §6 | Tokens. The countdown is the loudest object on the site |
| `src/components/home/HomeExperience.tsx` | The component this phase changes |
| `src/components/product/PhotoSlot.tsx` | The existing `next/image` pattern to follow |
| `src/lib/product-images.ts` | The slug-bound image pattern from Y.03 |
| `docs/design-handovers/` — the current handover | Home is specified there as *"type-led, works with no photo"* |

### The one thing to understand before you start

`facts.md` §8, in its original unamended sentence, reads: **"The lifestyle set is good and carries
the Home hero and the About page."** Home was always the sanctioned use for these frames. Y.03's
`D-Y.03-7` override was needed for **Catalog and Product**, which §8 explicitly excluded — it is
**not** needed here and **must not be extended**. This phase requires no new override of `facts.md`.

---

## Scope

### In scope

1. A real photographic hero on the Home page, in the **countdown**, **ended**, and **no-view** states.
2. Two calls to action beneath it: **Каталог** → `/katalog`, **Контакт** → `/kontakt` (MK), with EN
   parallel at `/en/catalog` and `/en/contact`.
3. New MK+EN message keys for the two buttons.
4. `Decisions.md`: supersede `D-1.05-4`.
5. State-file sync.

### Out of scope — do not touch

- **The `live` drop state.** When a drop is open, the product grid is the page. **No photograph may
  push a product card below the fold.** `HomeExperience`'s `view.state === 'live'` branch is
  byte-unchanged.
- `create_order`, `expire_reservations`, `supabase/migrations/`, cart, checkout, `src/config/`,
  `src/lib/drop/state.ts`, `SITE_URL`, `src/types/database.ts`.
- Any npm dependency. `next/image` is already in use.
- `HomeFaq`, the header, the footer, `globals.css` wordmark section.
- Product 03 (baby blue). No frame exists for it — placeholder #8 stays untouched.
- Catalog and Product pages. Y.03's wiring is final for this phase.
- `facts.md` §8 / §8.1. **No amendment, no new override.** If you believe one is needed, stop and
  say so in the report instead of writing it.
- **Any image not already committed to this repo.** No new asset is to be added, generated,
  composited, upscaled, or fetched. See the hard constraint below.

---

## Hard constraint — imagery

**`D-0-6` is in force and is not negotiable in this phase.** `facts.md` §8: *"The pixels must start
as the actual shirt."* Permitted post-processing is the named list only — background removal,
exposure, crop.

- Use **only** the two `.webp` files already committed at `public/images/lifestyle/`.
- **Do not** generate, in-paint, out-paint, upscale with a generative model, restyle, or composite
  any garment pixels.
- **Do not** add a wordmark, headline, or any text **into** an image file. All text is live DOM text.
- If a layout you are attempting seems to need a third frame, **stop and report it.** A third frame
  exists but is not in this repo (`facts.md` §8, `D-Y.03-8`); it is Vladimir's to supply.

---

## Tasks

### 1. Branch

Cut `phase-y.04-home-hero` from an up-to-date `main`. Nothing else is unmerged. One branch at a time
(`CLAUDE.md`).

### 2. Build the hero photograph block

Add it to `HomeExperience.tsx` in the **countdown**, **ended**, and **no-view (`!view`)** branches.
Order within each of those branches, top to bottom:

1. The existing eyebrow / banner (`DropCountdownEyebrow`, `DropEndedBanner`) — unchanged
2. The existing `<h1>` headline and `<p>` sub — unchanged
3. The existing `Countdown` where it already renders — unchanged
4. **NEW: the photograph block**
5. **NEW: the two buttons**
6. The existing `aboutLink` where it already renders — unchanged

**The countdown stays above the photograph and stays the largest type on the page.** `brand.md` §2:
the countdown is the loudest object; everything defers to it. If the photograph makes the countdown
read as secondary at any width, the photograph is wrong.

**Composition:**

| Viewport | Layout |
|---|---|
| Mobile (`< 640px`) | **One frame only — `mustard-ochre-01.webp`.** Full-bleed width, `aspect-[4/5]`. |
| `≥ 640px` | **Two frames side by side** — mustard left, off-white right, equal columns, `gap` from the token scale. |

Rationale for one frame on mobile: the frames are portrait 1333×2000. Two of them at 390px is ~190px
each, at which the garment and its print stop being legible — and audience 1 arrives on a phone from
an Instagram story (`Trajanov-V2-Plan.md` §3).

**Implementation notes:**

- Use `next/image` with `fill` + `object-cover` inside a fixed-aspect box, following the existing
  `PhotoSlot` pattern exactly.
- **`priority` is ON for the mobile-visible frame** — this is the LCP element on the site's front
  door. Set `sizes` honestly for the two-up: `(min-width: 640px) 50vw, 100vw`.
- Bind each file **by an explicit named constant, never by array index or position** — follow the
  `D-Y.03-1` principle so a future re-order cannot swap the frames.
- **Confirm each file against its colourway by eye before wiring it**, exactly as Y.03 did
  (mustard ≈ `rgb(213,163,58)`, off-white ≈ `rgb(199,188,181)`).

**Alt text — reuse, do not duplicate:** the correct strings already exist as `Product.photoAltOchre`
and `Product.photoAltOffWhite` (MK „Окер маица со црвен принт, носена." / „Крем-бела маица со црвен
принт, носена."). Read them via `useTranslations('Product')`. **Do not author new alt strings.**

**The alt-text rule from Y.03 stands: describe the garment, never the person.** Nobody in frame is
named, described, aged, or characterised — not in alt text, not in a caption, not in a comment, not
in a commit message. Two real people are in these photographs and one of them is a minor.

**No hero wordmark.** The header already carries the animated wordmark (2.19/2.20) and
`public/logo.svg` is the brand mark. A second wordmark directly beneath the first is redundant and
would compete with the countdown.

### 3. The two buttons

Directly beneath the photograph block, side by side on all widths.

| | MK | EN | Route |
|---|---|---|---|
| Primary | **Каталог** | **Catalog** | `/katalog` · `/en/catalog` |
| Secondary | **Контакт** | **Contact** | `/kontakt` · `/en/contact` |

- Use the **existing** button styling and the localised `Link` from `@/i18n/navigation`. Do not
  hand-roll a new button variant and do not hardcode a path.
- New keys `Home.ctaCatalog` and `Home.ctaContact` in **both** `src/messages/mk.json` and
  `src/messages/en.json`. Never ship an EN string into the MK build.
- Tap targets **≥ 44px** (WCAG 2.2, already the site standard).
- Run the `humanizer` pass on the two new strings. They are two words; expect it to fire nothing.
- Regenerate and commit `string-inventory.md`. It should move **245 → 247**.
- Add an **unsigned** `docs/i18n/mk-review-y04.md` for the two new strings, per the Y.03 pattern.

### 4. Log the decision

Append to `Decisions.md`:

> **`D-Y.04-1` · 2026-07-26 · Home gets a photographic hero; `D-1.05-4` superseded**
> **Decided by:** Lazar, 2026-07-26.
> **Context:** `D-1.05-4` kept Home type-led with no photo and no photo slot, because model and venue
> permission were unconfirmed and the alcohol-backdrop call was unmade. All five permissions were
> recorded GIVEN on 2026-07-26 (`facts.md` §8.1) and Known Issue #6 is resolved. `D-1.05-4` named
> this exact condition as the trigger for the change.
> **Decision:** Home renders `mustard-ochre-01.webp` (and `off-white-01.webp` at `≥640px`) in the
> countdown, ended, and no-view states. Live state unchanged.
> **Alternative rejected:** an AI-generated hero composite supplied on 2026-07-26, whose embedded
> C2PA credential recorded `c2pa.created` by `gpt-image 2.0` with
> `digitalSourceType: trainedAlgorithmicMedia` and no ingredient assertion — refused under `D-0-6`
> and `facts.md` §8 ("the pixels must start as the actual shirt"), and because §8.1's permissions
> were given for photographs of real people, one of them a minor, not for a synthetic likeness.
> **Downside accepted:** the mustard frame now appears on both the Home hero and the Product 01
> Catalog card, so one photograph carries two surfaces. Warm tungsten light still shifts the garment
> colour (`D-Y.03-7`). Both are properly fixed by the neutral set, still owed, still placeholder #2.

Then set `D-1.05-4`'s **Status** line — and only that line — to `Superseded by D-Y.04-1`. Do not edit
or delete any other part of that entry.

### 5. Verify in a browser

Render and check at **390px** and **1280px**, in **both locales**, in **all three drop states** using
the existing `?preview=` switch:

- `/` · `/en`
- `/?preview=countdown` · `/en?preview=countdown`
- `/?preview=live` · `/en?preview=live`
- `/?preview=ended` · `/en?preview=ended`

### 6. Close the phase

Per `CLAUDE.md` state duties: `current-state.md` (line 1 `NEXT:` + both registers), `file-map.md`,
`00_stack-and-config.md` if anything changed, completion report from the template, PR to `main`.

**Do not merge your own PR.** An operator authorises the merge (`D-0-3`).

---

## Definition of Done

### Verified by you

- [ ] `git diff main --stat` touches **only**: `HomeExperience.tsx`, `mk.json`, `en.json`,
      `Decisions.md`, `string-inventory.md`, `docs/i18n/mk-review-y04.md`, and the state files.
- [ ] **Zero** files added under `public/` — proven by `git diff main --name-only public/` returning
      nothing.
- [ ] `view.state === 'live'` branch of `HomeExperience.tsx` is **byte-unchanged** — proven by diff.
- [ ] Home at `?preview=live` renders an HTML `<main>` **identical** to `main`'s, byte for byte.
- [ ] Both `.webp` files render on `/` at 390px (mustard only) and 1280px (both), both locales.
- [ ] Alt text is the existing `Product.photoAlt*` strings, correct per locale; **no new alt string
      was authored**; no person is named or described anywhere in the diff.
- [ ] Каталог/Контакт buttons render and navigate correctly in **both** locales to the four routes.
- [ ] Tap targets measure ≥ 44px at 390px.
- [ ] No literal hex / `rgb(` / `hsl(` value in the diff — grep-proven. Tokens only.
- [ ] `prefers-reduced-motion` respected; no new animation added.
- [ ] `string-inventory.md` reads **247**.
- [ ] `npm run build`, `npx tsc --noEmit`, `npm run lint` all clean.
- [ ] `npm test` — **116/116**, including `10 simultaneous orders against 3 units → exactly 3 succeed`.
- [ ] **Lighthouse mobile Performance on `/` ≥ 94**, run locally and pasted as an actual number in the
      report. If the hero drops it below 94, fix it in this phase — do not defer it.
- [ ] Placeholder register is **unchanged** — this phase adds no placeholder and clears none.
- [ ] `Decisions.md`: `D-Y.04-1` appended; `D-1.05-4` Status line changed and nothing else.
- [ ] Secrets check clean (`CLAUDE.md`): no key, no order PII, `.env*` still gitignored.

### Owed to Lazar (goes on the register in `current-state.md`)

| # | Item | How to check | Pass looks like |
|---|---|---|---|
| next | Home hero on a real phone | Open `[www.trajanovv.com](https://www.trajanovv.com)` on an actual handset after deploy | Mustard frame fills the width, countdown clearly the largest thing, both buttons thumb-reachable |
| next | Lighthouse mobile Performance on `/` **on production** | PageSpeed Insights on `https://www.trajanovv.com` after deploy | ≥ 94 |
| next | MK review of the two new strings signed | `docs/i18n/mk-review-y04.md` | Signed by Lazar + Petar |

---

## Outputs

- Branch `phase-y.04-home-hero` → PR to `main`. **Operator merges, not you.**
- Completion report → `src/_project-state/completions/Part-2-Phase-Y04-Completion.md`

**Report honestly.** §2 (decisions you made alone) and §3 (surprises) are the two sections the
orchestrator actually reads. If you cut a corner, name it there.
