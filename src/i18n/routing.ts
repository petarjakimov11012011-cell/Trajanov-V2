import {defineRouting} from 'next-intl/routing';

// MK is the default language and serves at `/`; EN serves at `/en/` (D-0-8).
// Localised path slugs (katalog|catalog, …) land in Phase 2.01 — not here.
export const routing = defineRouting({
  locales: ['mk', 'en'],
  defaultLocale: 'mk',
  localePrefix: 'as-needed',
});
