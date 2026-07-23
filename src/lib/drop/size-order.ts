// Canonical garment-size ordering (Phase 2.09, D-2.09-3). A PURE module — no `import "server-only"` —
// so the rule is unit-testable by a plain vitest run, unlike the server-only `state.ts` that consumes it.
//
// Sizes rank by their position in the clothing order below, NOT alphabetically. The old rule
// (`localeCompare`) sorted the labels as text and produced L · M · S · XL, which reads as broken on the
// product page. The comparator only ORDERS labels — it never rewrites one. Whatever the database stores
// (original case, original whitespace) is what the UI renders; normalisation is used solely to rank.

/** Clothing order, small to large. A label's rank is its index here. */
export const CANONICAL_SIZE_ORDER: readonly string[] = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

/**
 * Fold a label to its canonical form for ranking only (never for display): trim, upper-case, and treat
 * the numeric multi-XL spellings as their X-repeated equivalents (2XL → XXL, 3XL → XXXL). The result is
 * compared against CANONICAL_SIZE_ORDER; it is never shown to a user.
 */
function normaliseForRank(label: string): string {
  const upper = label.trim().toUpperCase();
  const numericXl = /^(\d+)XL$/.exec(upper); // "2XL" → 2, "3XL" → 3
  if (numericXl) return "X".repeat(Number(numericXl[1])) + "L";
  return upper;
}

/** Rank of a label in the canonical order, or -1 when it is not a known garment size. */
function rankOf(label: string): number {
  return CANONICAL_SIZE_ORDER.indexOf(normaliseForRank(label));
}

/**
 * Order two size labels by the canonical clothing order. Total and deterministic:
 *  • two known sizes  → by canonical index (XS < S < M < L < XL < XXL < XXXL);
 *  • known vs unknown → the known size always comes first (an unfamiliar label like "One size" or a
 *    numeric size never jumps to the front by accident);
 *  • two unknowns     → alphabetically among themselves (case-insensitively), so the result is stable.
 * Sizes are unique within a product (src/config/schema.ts), so equal ranks never arise for real data.
 */
export function compareSizeLabels(a: string, b: string): number {
  const ra = rankOf(a);
  const rb = rankOf(b);
  const aKnown = ra !== -1;
  const bKnown = rb !== -1;
  if (aKnown && bKnown) return ra - rb;
  if (aKnown) return -1;
  if (bKnown) return 1;
  return normaliseForRank(a).localeCompare(normaliseForRank(b));
}
