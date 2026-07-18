import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Permanent (308) redirects from the OLD English MK paths to the localised MK slugs (D-2.01-3). The
// store has been publicly reachable since 1.07, so these paths may already be linked; a dead link on a
// store that sells three times a year is expensive. These sources are the un-prefixed (MK) paths only —
// the EN paths (`/en/catalog`, `/en/cart`, …) are the canonical EN slugs and must NOT be caught here.
// next.config redirects run BEFORE the next-intl middleware, so the browser lands on the MK slug, which
// the middleware then resolves to the internal route.
//
// KEEP IN LOCKSTEP with `pathnames` in src/i18n/routing.ts: if a MK slug changes there, change the
// matching `destination` here (and add a row for the retired slug). One table, one obvious place.
const localizedRedirects: NextConfig['redirects'] = async () => [
  {source: '/catalog', destination: '/katalog', permanent: true},
  {source: '/catalog/:slug', destination: '/katalog/:slug', permanent: true},
  {source: '/cart', destination: '/kosnicka', permanent: true},
  {source: '/checkout', destination: '/naracka', permanent: true},
  {source: '/about', destination: '/za-nas', permanent: true},
  {source: '/contact', destination: '/kontakt', permanent: true},
];

const nextConfig: NextConfig = {
  redirects: localizedRedirects,
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
