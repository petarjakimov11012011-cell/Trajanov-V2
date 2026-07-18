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
