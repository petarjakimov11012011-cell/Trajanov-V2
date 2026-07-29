/**
 * The message namespaces that are allowed to reach the browser.
 *
 * WHY THIS EXISTS. `NextIntlClientProvider` with no `messages` prop hands the client the ENTIRE
 * catalog for the active locale, on every route. Measured on the MK build before this list existed:
 * **16,308 bytes of serialized messages in the HTML of `/`, `/kontakt`, `/uslovi` and `/katalog`
 * alike** — all 23 namespaces — even though `/kontakt` has no reason to carry the Terms body and
 * `/uslovi` has no reason to carry the checkout strings. The Terms page title was provably sitting in
 * the Contact page's HTML.
 *
 * WHAT IS ON THE LIST. Exactly the namespaces reachable from a `'use client'` boundary — a client
 * component itself, or any module it imports (`DropBanner`, `StockBadge`, `ProductCard`,
 * `ShippingNotice` and `product-images.ts` carry no directive of their own but become client code the
 * moment a client component imports them). Everything else is read only by Server Components and
 * `generateMetadata`, which use the server catalog and never touch this list.
 *
 * KEEP IT HONEST. `tests/i18n/client-messages.test.ts` re-derives the required set by walking the
 * import graph out from every client boundary and fails if this list is missing one. A namespace a
 * client component needs but that is not listed here does not fail the build — it fails at RUNTIME,
 * as a `MISSING_MESSAGE` in the customer's browser. That is why the guard is a test and not a comment.
 */
export const CLIENT_NAMESPACES = [
  'Buy',
  'Cart',
  'Checkout',
  'Common',
  'Contact',
  'Credit',
  'Drop',
  'Home',
  'Nav',
  'Order',
  'Placeholder',
  'Product',
  'Showcase',
  'Stock',
] as const;

export type ClientNamespace = (typeof CLIENT_NAMESPACES)[number];

/**
 * Narrow a full message catalog to the client-visible namespaces.
 *
 * A namespace that is on the list but absent from the catalog is skipped rather than serialized as
 * `undefined` — the guard test is what catches that case, at a point where someone can read the
 * failure.
 */
export function pickClientMessages(
  messages: Record<string, unknown>,
): Record<string, unknown> {
  const picked: Record<string, unknown> = {};
  for (const namespace of CLIENT_NAMESPACES) {
    if (namespace in messages) picked[namespace] = messages[namespace];
  }
  return picked;
}
