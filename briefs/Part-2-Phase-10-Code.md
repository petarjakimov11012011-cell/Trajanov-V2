# Part 2 · Phase 2.10 · Code — Product-card spotlight (subtle white glow)

> Faithful working copy of the brief handed to Claude Code (saved into `briefs/` per `D-1.01-5`).
> If it diverges from the orchestrator's canonical file, the canonical file wins.

**Why this matters —** the catalogue is a grid of flat dark cards on a flat dark ground, and nothing
signals which card the cursor is on. A quiet white spotlight that follows the pointer makes the grid
feel alive and makes the hover target obvious, without adding a single new colour, dependency, or
line of commerce logic.

**This is an out-of-band UI phase** — the same shape as 2.07 (footer), 2.08 (header), 2.09 (size
order) and Y.02. It does **not** advance the critical path and it **does not touch line 1 of
`current-state.md`.** The `NEXT:` line stays exactly as you found it.

---

## Context

### What already exists
- `src/components/product/ProductCard.tsx` — a **server component**. It renders the card body
  (`PhotoSlot`, `StockBadge`, `h2` title, price / placeholder, stock line) into a local `inner`
  variable and then does one of two things:
  - **sold out** → wraps `inner` in a non-interactive `<div aria-disabled className="cursor-default">`
  - **anything else** → wraps `inner` in the localised next-intl `<Link>` with the
    `focus-visible:ring-focus-ring` ring.
- The card surface is `bg-surface` + `rounded-[var(--radius-lg)]`, with `hover:bg-surface-2` applied
  only when not sold out.
- `ProductCard` is rendered in exactly **three** places: `catalog/page.tsx`, `HomeExperience.tsx`
  (`'use client'`), `styleguide/page.tsx` (noindex).
- Tokens live in **two mirrored places**: `brand.md` (§3 colour, §5 radius/shadow, §6 motion) and
  `src/app/globals.css` (`:root` + `@theme inline`). Change `brand.md` first, then `globals.css`,
  identical values.
- `globals.css` already ships a global `prefers-reduced-motion: reduce` block.
- Stack: Next 16.2.10, React 19.2.4, Tailwind v4 (CSS-first, no `tailwind.config`), next-intl 4,
  `motion` 12 installed. Nothing needs installing.

### The source, and why not copy-paste it
The operator supplied a 21st.dev "spotlight card" (`GlowCard`). Do not paste it. It is the reference
for the effect, not the implementation. Rejected as-is for six reasons: (1) `document`-level
`pointermove` per card; (2) `background-attachment: fixed`; (3) per-card
`<style dangerouslySetInnerHTML>` with unscoped `[data-glow]`; (4) hardcoded `hsl()` + a 3px border;
(5) fixed `sizeMap`/`aspect` fighting the grid; (6) no reduced-motion / coarse-pointer guard, colourful.

**The requirement is a subtle white glow, keyed to the pointer, on hover only.**

## Orchestrator decisions — build to them
- **A.** The glow colour is `--color-foreground` (`#ECE8E0`), not pure `#FFFFFF`, at very low alpha.
- **B.** Sold-out cards do not glow. Only the interactive `<Link>` variant gets the spotlight.
- **C.** This is a logged exception to `brand.md` §5 (shadow = overlays only) and §6 (motion =
  countdown + reveal only). Log as `D-2.10-1`; add a carve-out sentence to §5 and §6.
- **D.** `ProductCard` stays a server component. The pointer tracking goes in a thin new client
  component that takes the card body as `children`.

## Scope
**In:** new client component `SpotlightCard.tsx`; a scoped CSS block in `globals.css`; four new tokens
in `brand.md` + `globals.css`; wiring the interactive branch of `ProductCard.tsx`; the state/decision/
report docs.
**Out (do not touch):** `src/lib/orders/`, `create_order`, `expire_reservations`, `supabase/migrations/`,
the hosted DB; `src/config/`, drop/stock/reservation/cart/checkout/`Turnstile.tsx`;
`src/messages/{mk,en}.json` (zero new strings); `facts.md`; `SITE_URL`, metadata, JSON-LD, sitemap, OG;
`package.json` (no new dependency); the sold-out path, `StockBadge`, `PhotoSlot`, the focus ring, the
headings; line 1 (`NEXT:`) of `current-state.md`.

## Tasks (abridged)
1. Branch `phase-2.10-card-glow` off `main`.
2. Add tokens: `brand.md` §3 `--color-glow`
   (`color-mix(in srgb, var(--color-foreground) 100%, transparent)`); §5 Spotlight table `--glow-size`
   `240px`, `--glow-opacity-surface` `0.05`, `--glow-opacity-edge` `0.22`. Mirror all four into
   `globals.css` `:root` after `--color-mustard-tint-6`; only `--color-glow` gets an `@theme inline`
   entry.
3. CSS block in `globals.css` (not JSX): `.spotlight-card` + `::after` (surface wash) + `::before`
   (edge light, 1px transparent border with the border-only `mask` + `mask-composite: exclude` /
   `-webkit-mask-composite: xor`). Both pseudo-elements: `pointer-events:none`, `content:""`,
   `position:absolute`, `border-radius: var(--radius-lg)`, `opacity:0`,
   `transition: opacity var(--motion-base) var(--ease-out)`. Radials at
   `radial-gradient(var(--glow-size) circle at var(--glow-x) var(--glow-y), color-mix(... calc(opacity*100%) ...), transparent 72%)`.
   `--glow-x`/`--glow-y` default `50% 0%`. Reveal on `:hover` **and** `:focus-visible`. Gate the whole
   block in `@media (hover: hover) and (pointer: fine)`. No literal hex/`rgb()`/`hsl()`.
4. `SpotlightCard.tsx` — `'use client'`, `({children, className})`; one `<div ref className=cn('spotlight-card',className)>`;
   `onPointerMove` on that element only (never document/window); write `--glow-x`/`--glow-y` in px via
   `getBoundingClientRect()`; rAF-throttle, cancel pending frame on unmount; bail when
   `matchMedia('(hover: hover) and (pointer: fine)')` fails or `pointerType !== 'mouse'`; no state, no
   document `useEffect`, no `dangerouslySetInnerHTML`, no inline `<style>`, no `aria-*`/`role`.
5. Wire into `ProductCard.tsx`: wrap `inner` in `<SpotlightCard>` **inside** the existing `<Link>`.
   Sold-out branch untouched. Must not clip the badge at `absolute left-2 top-2`.
6. Verify in-browser at 375px + desktop, both locales: `/styleguide`, `/katalog`, `/en/catalog`, the
   home live grid. Glow tracks the pointer, subtle, sold-out doesn't glow, badges unclipped, focus ring
   unchanged, no pixel shift on hover.
7. Close the phase: `Decisions.md` (`D-2.10-1`, `D-2.10-2`), the three state files, completion report,
   one PR to `main` (operator merges, not Code).

## Definition of Done (key gates)
- `SpotlightCard.tsx` `'use client'`, listener on its own element, rAF-throttled.
- `grep -rn "document.addEventListener\|window.addEventListener" src/components/product/` empty.
- `ProductCard.tsx` still a server component; sold-out branch unchanged (no glow).
- Four tokens in **both** `brand.md` + `globals.css`, identical values.
- `git diff main` has zero literal hex/`rgb()`/`hsl()`.
- Effect CSS in `globals.css`; no `dangerouslySetInnerHTML` in `src/components/product/`.
- Whole effect inside `@media (hover: hover) and (pointer: fine)`.
- `git diff --name-only main` touches none of `supabase/`, `src/lib/orders/`, `src/config/`,
  `src/messages/`, `facts.md`, `package.json`, `package-lock.json`.
- Line 1 of `current-state.md` byte-identical to `main`.
- `npm run build` · `npx tsc --noEmit` · `npm run lint` clean; `npm test` green incl. the 10-vs-3
  oversell gate.
- Rendered + eyeballed per Task 6; report names the URLs, states the focus ring is unchanged and the
  badges are unclipped.
- Owed row to Lazar: glow sign-off (2.10).

## Hard stops
1. Making the glow visible requires `--glow-opacity-surface` above `0.10` (owner call).
2. The effect requires a new npm package.
3. The effect requires `ProductCard` to become a client component.
4. Any test fails, or the concurrent-order test does not run.
5. You find yourself editing anything out of scope.
