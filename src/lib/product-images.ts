// Catalog photography, keyed by product SLUG (D-Y.03-1).
//
// Interim lifestyle frames, not the product set. `facts.md` §8 says the lifestyle photos "cannot carry
// Catalog or Product" — warm tungsten light shifts the garment colour, and on cash-on-delivery the
// customer pays at the door for what they saw. `D-Y.03-7` overrides that line for these frames only,
// as a logged interim, and `D-Y.08-2` extends the same override to baby blue; placeholder register #2
// stays OPEN and the neutral front/back/print-detail set is still OWED for ALL THREE colourways. When
// it lands, these entries are REPLACED, not extended.
//
// KEYED BY SLUG, NEVER BY INDEX OR POSITION. A photograph belongs to a product only because it shows
// that product's COLOURWAY, confirmed against the file by eye before wiring (D-Y.03-1). Index-based
// lookup would let a re-order in `products.ts` silently move a shirt's photo onto another colourway —
// which, on cash-on-delivery, means shipping a colour the customer did not choose.
//
// BABY BLUE, added 2026-09-29 (Y.08). Product 03 now has TWO interim frames — the only product that
// does — so it is the only slug in `PRODUCT_SECOND_IMAGES` and the only product whose second slot is
// not a placeholder (D-Y.08-3). Two known defects are recorded, not fixed:
//   * Colour. Under the bar's warm tungsten light the baby-blue shirt reads PALE GREY — sampled
//     garment RGB ~(158,152,147) and ~(168,157,145). Worse than the mustard frame's shift, because
//     warm light neutralises a pale blue outright. `facts.md` §7 therefore keeps the colourway at
//     "VERIFIED (owner-stated)" and must NOT be upgraded to "VERIFIED (photos)" on these frames.
//   * Resolution. 640px wide, against 1333px for the other two. Fine for the ~280px desktop slot,
//     visibly soft full-width on a high-density phone. Do NOT upscale — upscaling invents pixels
//     (D-0-6 in spirit). Replacing these with the full-size originals is a file swap, nothing more.
//
// Adding `test-baby-blue` here also put Product 03 into the Home showcase, which selects on exactly
// this map (`src/lib/showcase.ts` rule 1). That front-door change is intended and logged as D-Y.08-6.

/**
 * Alt-text keys, as a closed union. This project has no next-intl message-key type augmentation, so
 * `t()` accepts any string and a typo here would silently render the key name to a screen reader.
 * Every key must exist under `Product` in BOTH `src/messages/mk.json` and `en.json`.
 */
type AltKey = 'Product.photoAltOchre' | 'Product.photoAltOffWhite' | 'Product.photoAltBabyBlue';

export type ProductImage = {
  /** Path under `public/`. `lifestyle/`, not `products/` — the latter is reserved for the neutral set (D-Y.03-4). */
  readonly src: string;
  /** Message-catalog key, resolved by the caller. Never a literal string — MK is the default build. */
  readonly altKey: AltKey;
  /**
   * The mustard/off-white sources are 1333×2000 (2:3) and the slot is `aspect-[4/5]`, so ~17% of the
   * height is cropped; these values keep the GARMENT in frame at 390px rather than centring on the
   * whole figure. `baby-blue-01` is already exactly 4:5, so nothing is cropped and "center" is
   * correct by construction. Verified in-browser at 390px and 1280px, both locales (Y.03 Task 10,
   * Y.08 Task 7).
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
  // Product 03 — baby blue. Sampled garment RGB ~(158,152,147) — reads grey under the venue's
  // tungsten light, see the colour note in the header. Source is already 640×800 (4:5), pre-cropped
  // above the legs on Vladimir's own instruction (D-Y.08-4); do not re-crop or re-expand it.
  "test-baby-blue": {
    src: "/images/lifestyle/baby-blue-01.webp",
    altKey: "Product.photoAltBabyBlue",
    objectPosition: "center",
  },
};

/**
 * Second product-page frame, keyed by slug. Separate map rather than an array on `ProductImage`, so
 * that adding a second frame for one product cannot disturb the first-frame lookup that the catalog
 * card and the Home showcase both depend on (D-Y.08-3). Products 01 and 02 are deliberately absent:
 * their second slot stays a visible placeholder, which is how the page says the back / print-detail
 * shot is still owed (register #2).
 */
const PRODUCT_SECOND_IMAGES: Readonly<Record<string, ProductImage>> = {
  // The adult model (facts.md §8.1 #2), standing, same shirt, same venue. Uncropped 640×960 (2:3)
  // into a 4:5 slot, so ~17% of the height goes; the offset keeps her face and the whole garment in
  // frame. One alt key serves both frames (D-Y.08-5).
  "test-baby-blue": {
    src: "/images/lifestyle/baby-blue-02.webp",
    altKey: "Product.photoAltBabyBlue",
    objectPosition: "center 40%",
  },
};

/** The photograph for a product slug, or null when none exists (the default — see the header note). */
export function getProductImage(slug: string): ProductImage | null {
  return PRODUCT_IMAGES[slug] ?? null;
}

/** The SECOND product-page photograph for a slug, or null — which is every product but Product 03. */
export function getProductSecondImage(slug: string): ProductImage | null {
  return PRODUCT_SECOND_IMAGES[slug] ?? null;
}
