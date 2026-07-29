import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * The brand type scale (brand.md §4 / globals.css `@theme inline`), registered with tailwind-merge.
 *
 * WHY THIS EXISTS. tailwind-merge cannot read our CSS. Its default `text-color` group matches any
 * `text-<word>` it does not already know as a font size, so it filed every brand size token as a
 * COLOUR — putting `text-countdown` and `text-foreground` in the same conflict group. Inside `cn()`
 * the later class then won and the size was silently deleted:
 *
 *   cn('text-countdown … ', 'text-foreground')  →  'text-foreground'   (size gone, digits at 16px)
 *   cn('font-display text-small …', 'text-muted-foreground')  →  size gone, nav at 16px
 *
 * That is why the countdown had rendered at the 16px body default since Phase 1.04 — on `main` and
 * in production — and why several call sites carry hand-written notes about avoiding `cn()` for
 * class strings that contain a brand size. Registering the seven tokens under `font-size` puts them
 * in the right group: a size and a colour are different CSS properties and no longer collide, while
 * two sizes (`text-h1 text-h2`) still resolve last-wins as they should.
 *
 * KEEP IN SYNC. This list must match the `--text-*` tokens in `globals.css` `@theme inline`, which
 * mirror brand.md §4. Adding a type token to the brand scale without adding it here reintroduces the
 * same silent-strip bug for that token only.
 */
const BRAND_FONT_SIZES = [
  "countdown",
  "h1",
  "h2",
  "body",
  "small",
  "price",
  "eyebrow",
] as const

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...BRAND_FONT_SIZES] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
