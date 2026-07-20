import type {MetadataRoute} from 'next';
import type {Locale} from 'next-intl';
import {routing} from '@/i18n/routing';
import {getPathname} from '@/i18n/navigation';
import {SITE_URL} from '@/lib/site';
import {listCatalogProductSlugs} from '@/lib/drop/state';

// Sitemap (Task 1). Both locales, every INDEXABLE route, each URL absolute from SITE_URL + next-intl
// `getPathname(pathnames, locale)` — never a hand-typed slug, so a slug change in routing.ts flows here
// automatically. Cart, Checkout and /styleguide are excluded (they are noindex; Task 3). Products come
// from the SERVER product list (the DB), not a static list.
//
// Read from the DB per request (the product list changes with drops), so this route is dynamic — same
// reason the drop-state pages are `force-dynamic`; it also keeps the build from needing DB credentials.
export const dynamic = 'force-dynamic';

// The static, indexable routes, as next-intl typed hrefs. Cart / Checkout / Styleguide are absent by
// design (Task 1). `/catalog/[slug]` is added per real product below.
const STATIC_HREFS = [
  '/',
  '/catalog',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
  '/shipping-returns',
] as const;

type Href = Parameters<typeof getPathname>[0]['href'];

const locales = routing.locales;

function abs(href: Href, locale: Locale): string {
  return SITE_URL + getPathname({href, locale});
}

// One <url> entry per (route, locale), each carrying the reciprocal mk/en alternates (hreflang sitemap
// shape). Both language versions of a page therefore appear and point at each other.
function entriesFor(href: Href): MetadataRoute.Sitemap {
  const languages = {
    mk: abs(href, 'mk'),
    en: abs(href, 'en'),
  };
  return locales.map((locale) => ({
    url: abs(href, locale),
    alternates: {languages},
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = STATIC_HREFS.flatMap((href) => entriesFor(href));

  // Product pages from the DB. If the read fails, still serve the static routes rather than a 500 — a
  // missing product row is not worth a broken sitemap.
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const slugs = await listCatalogProductSlugs();
    productEntries = slugs.flatMap((slug) =>
      entriesFor({pathname: '/catalog/[slug]', params: {slug}}),
    );
  } catch {
    productEntries = [];
  }

  return [...staticEntries, ...productEntries];
}
