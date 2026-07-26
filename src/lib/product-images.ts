// Catalog photography, keyed by product SLUG (D-Y.03-1).
//
// Interim lifestyle frames, not the product set. `facts.md` §8 says the lifestyle photos "cannot carry
// Catalog or Product" — warm tungsten light shifts the garment colour, and on cash-on-delivery the
// customer pays at the door for what they saw. `D-Y.03-7` overrides that line for these two frames only,
// as a logged interim; placeholder register #2 stays OPEN and the neutral front/back/print-detail set is
// still OWED. When it lands, these entries are replaced, not extended.
//
// KEYED BY SLUG, NEVER BY INDEX OR POSITION. A photograph belongs to a product only because it shows
// that product's COLOURWAY, confirmed against the file by eye before wiring (D-Y.03-1). Index-based
// lookup would let a re-order in `products.ts` silently move a shirt's photo onto another colourway —
// which, on cash-on-delivery, means shipping a colour the customer did not choose.
//
// `test-baby-blue` is deliberately ABSENT → `getProductImage` returns null → the card and product page
// keep their `PhotoSlot` placeholders untouched. No baby-blue frame exists; putting another colourway's
// shirt there is exactly what placeholder register #8 forbids ("no stand-in, no generated image, no
// other shirt's photo") and what `D-0-6` prohibits. Do not add an entry until a real baby-blue
// photograph exists.

/**
 * Alt-text keys, as a closed union. This project has no next-intl message-key type augmentation, so
 * `t()` accepts any string and a typo here would silently render the key name to a screen reader.
 * Both keys must exist under `Product` in BOTH `src/messages/mk.json` and `en.json`.
 */
type AltKey = 'Product.photoAltOchre' | 'Product.photoAltOffWhite';

export type ProductImage = {
  /** Path under `public/`. `lifestyle/`, not `products/` — the latter is reserved for the neutral set (D-Y.03-4). */
  readonly src: string;
  /** Message-catalog key, resolved by the caller. Never a literal string — MK is the default build. */
  readonly altKey: AltKey;
  /**
   * Sources are 1333×2000 (2:3); the slot is `aspect-[4/5]`, so ~17% of the height is
   * cropped. These values keep the GARMENT in frame at 390px rather than centring on the whole figure.
   * Verified in-browser at 390px and 1280px, both locales (Y.03 Task 10).
   */
  readonly objectPosition: string;
};

const PRODUCT_IMAGES: Readonly<Record<string, ProductImage>> = {
  // Product 01 — mustard / ochre. Sampled garment RGB ~(213,163,58), saturated ochre.
  "test-mustard-ochre": {
    src: "/images/lifestyle/mustard-ochre-01.webp",
    altKey: "Product.photoAltOchre",
    objectPosition: "center 60%",
  },
  // Product 02 — off-white. Sampled garment RGB ~(199,188,181), near-white, very low saturation.
  "test-off-white": {
    src: "/images/lifestyle/off-white-01.webp",
    altKey: "Product.photoAltOffWhite",
    objectPosition: "center 65%",
  },
};

/** The photograph for a product slug, or null when none exists (the default — see the header note). */
export function getProductImage(slug: string): ProductImage | null {
  return PRODUCT_IMAGES[slug] ?? null;
}
