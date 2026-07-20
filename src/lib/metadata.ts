import type {Metadata} from 'next';
import type {Locale} from 'next-intl';
import {getPathname} from '@/i18n/navigation';
import {SITE_URL} from './site';

// The href a page identifies itself by, in the SAME shape next-intl's typed navigation uses: a static
// pathname string (`/catalog`) or, for dynamic routes, `{pathname: '/catalog/[slug]', params: {slug}}`.
type Href = Parameters<typeof getPathname>[0]['href'];

/**
 * Reciprocal hreflang + a self-referencing canonical for a page, as ABSOLUTE URLs on `SITE_URL`
 * (D-2.01, Task 6). Every page emits `hreflang="mk"`, `hreflang="en"`, and `hreflang="x-default"`
 * (pointing at MK), plus `canonical` in the page's OWN locale. Both directions are present and
 * reciprocal: the EN page points at the MK page for the SAME href, and back — because both are built
 * from the one `href` via next-intl's `getPathname`, which applies each locale's slug + prefix.
 */
export function localeAlternates(href: Href, currentLocale: Locale): Metadata['alternates'] {
  const absolute = (locale: Locale) => SITE_URL + getPathname({href, locale});
  const mk = absolute('mk');
  const en = absolute('en');
  return {
    canonical: currentLocale === 'mk' ? mk : en,
    languages: {
      mk,
      en,
      'x-default': mk,
    },
  };
}

/** Absolute URL of the per-locale typographic share card (src/app/og), carrying the page's title
 *  (Task 6). Absolute on `SITE_URL` so a scraper resolves it without a base — proven by grep, not left
 *  to `metadataBase`. The title is a public page title (never personal data), so a query param is fine. */
export function ogImageUrl(locale: Locale, title: string): string {
  const params = new URLSearchParams({l: locale, t: title});
  return `${SITE_URL}/og?${params.toString()}`;
}

/**
 * The full per-page metadata for a route (Task 5/6): title + description, reciprocal hreflang/canonical,
 * an absolute Open Graph + Twitter `summary_large_image` card, and (when `index: false`) a noindex.
 * One helper so EVERY route carries an absolute `og:image` + `twitter:image` — provable by grep, never
 * missed a page. `ogTitle` overrides the text baked into the card + `og:title` (the product page passes
 * a neutral brand title instead of a placeholder product slot, so no placeholder reaches a card).
 */
export function pageMetadata(opts: {
  href: Href;
  locale: Locale;
  title: string;
  description: string;
  ogTitle?: string;
  index?: boolean;
}): Metadata {
  const {href, locale, title, description, index = true} = opts;
  const ogTitle = opts.ogTitle ?? title;
  const url = SITE_URL + getPathname({href, locale});
  const image = ogImageUrl(locale, ogTitle);
  return {
    title,
    description,
    alternates: localeAlternates(href, locale),
    // Content routes stay indexable (default); Cart / Checkout / Styleguide pass index:false (Task 3).
    robots: index ? undefined : {index: false, follow: false},
    openGraph: {
      type: 'website',
      siteName: 'Trajanov',
      locale: locale === 'mk' ? 'mk_MK' : 'en_US',
      url,
      title: ogTitle,
      description,
      images: [{url: image, width: 1200, height: 630, alt: ogTitle}],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: [image],
    },
  };
}
