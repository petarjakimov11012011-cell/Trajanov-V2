import type {Locale} from 'next-intl';
import {getPathname} from '@/i18n/navigation';
import {SITE_URL} from '@/lib/site';

// The ONE list of static, indexable routes — as next-intl typed hrefs — that both the sitemap
// (`src/app/sitemap.ts`) and the llms.txt route (`src/app/llms.txt/route.ts`) read. Keeping it here,
// not copied into each, means adding or removing a route (or renaming a slug in routing.ts) flows to
// both surfaces automatically; neither can silently drift from the other.
//
// Cart / Checkout / Styleguide are ABSENT by design — they are noindex (Task 3 of 2.04), so they must
// not appear in the sitemap or llms.txt. `/catalog/[slug]` (per real product) is added by the sitemap
// from the DB; llms.txt links only the static catalog page, so it does not need the product list.
export const INDEXABLE_STATIC_HREFS = [
  '/',
  '/catalog',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
  '/shipping-returns',
] as const;

export type Href = Parameters<typeof getPathname>[0]['href'];

/** A typed href resolved to an ABSOLUTE URL in `locale`, built from `SITE_URL` + next-intl's
 *  `getPathname` — never a hand-typed slug or a hardcoded domain, so a routing.ts change is picked up
 *  here for free. */
export function absoluteUrl(href: Href, locale: Locale): string {
  return SITE_URL + getPathname({href, locale});
}
