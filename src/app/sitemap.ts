import type {MetadataRoute} from 'next';
import {routing} from '@/i18n/routing';
import {listCatalogProductSlugs} from '@/lib/drop/state';
import {INDEXABLE_STATIC_HREFS, absoluteUrl, type Href} from '@/lib/seo/routes';

// Sitemap (Task 1). Both locales, every INDEXABLE route, each URL absolute from SITE_URL + next-intl
// `getPathname(pathnames, locale)` — never a hand-typed slug, so a slug change in routing.ts flows here
// automatically. The static, indexable route list lives in `src/lib/seo/routes.ts` and is SHARED with
// llms.txt (2.04b) so the two never drift; Cart, Checkout and /styleguide are excluded there (noindex;
// Task 3). Products come from the SERVER product list (the DB), not a static list.
//
// Read from the DB per request (the product list changes with drops), so this route is dynamic — same
// reason the drop-state pages are `force-dynamic`; it also keeps the build from needing DB credentials.
export const dynamic = 'force-dynamic';

const locales = routing.locales;

const abs = absoluteUrl;

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
  const staticEntries = INDEXABLE_STATIC_HREFS.flatMap((href) => entriesFor(href));

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
