// Single source of truth for the Home showcase (Phase 2.21): WHICH products get a slide and in
// WHAT order. Pure — no React, no I/O — so both HomeShowcase.tsx and a plain vitest run can import
// it (the src/lib/faq.ts precedent, D-2.11-5).
//
// TWO RULES LIVE HERE ON PURPOSE — do not "fix" either later:
//
// 1. A slide requires a real photograph (orchestrator decision 2, Phase 2.21 brief). Products with
//    no frame in src/lib/product-images.ts are SKIPPED, not shown with a placeholder box. A
//    showcase whose job is to show the garment cannot show a hatched empty slot on the front door,
//    and skipping keeps placeholder-register rows #2 and #8 off the home page. It self-heals: the
//    moment Y.01 commits a product's photograph and product-images.ts gains its entry, the product
//    appears here with zero code change.
//
// 2. The `live` state returns NO slides (orchestrator decision 5). During a live drop the buyable
//    grid IS the page; a second, non-buyable gallery of the same shirts competes with the only
//    thing that matters that hour. HomeShowcase renders null on an empty list, so the live page's
//    markup stays exactly what it was before this phase.

import { getProductImage, type ProductImage } from "@/lib/product-images";
// Type-only: erased at compile time, so the "server-only" guard inside drop/state never runs here.
import type { DropView } from "@/lib/drop/state";

/** Everything a showcase slide renders. All facts we hold — nothing invented (facts.md §10). */
export interface ShowcaseSlide {
  slug: string;
  /** 1-based position (products.sort_order) — drives the neutral slot name when nameMk/En is null. */
  index: number;
  nameMk: string | null;
  nameEn: string | null;
  /** Whole MKD, or null when OWED (facts.md §7) — the UI falls back to the price placeholder. */
  priceMkd: number | null;
  stock: DropView["products"][number]["stock"];
  remaining: number;
  /** Non-null by construction: a product with no photograph gets no slide (rule 1 above). */
  image: ProductImage;
}

/**
 * The slides the Home showcase renders, in `view.products` order. Empty when there is no drop at
 * all, when the drop is `live` (rule 2), or when no product has a photograph — HomeShowcase
 * renders nothing in all three cases.
 */
export function showcaseSlides(view: DropView | null): ShowcaseSlide[] {
  if (!view || view.state === "live") return [];
  const slides: ShowcaseSlide[] = [];
  for (const p of view.products) {
    const image = getProductImage(p.slug); // by SLUG, never by index (D-Y.03-1)
    if (!image) continue; // rule 1: no photograph, no slide
    slides.push({
      slug: p.slug,
      index: p.index,
      nameMk: p.nameMk,
      nameEn: p.nameEn,
      priceMkd: p.priceMkd,
      stock: p.stock,
      remaining: p.remaining,
      image,
    });
  }
  return slides;
}

/** Wrap a slide index in both directions. Safe at length <= 0 (returns 0, never NaN or negative). */
export function wrapIndex(i: number, length: number): number {
  if (length <= 0) return 0;
  return ((i % length) + length) % length;
}
