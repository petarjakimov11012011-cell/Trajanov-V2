import {defineRouting} from 'next-intl/routing';

// MK is the default language and serves at `/`; EN serves at `/en/` (D-0-8).
//
// Localised route slugs land here in 2.01 via `pathnames` (D-2.01-1). The KEY of each entry is the
// INTERNAL route (the folder under src/app/[locale]/ — never renamed); the VALUE is the public,
// locale-specific slug WITHOUT the locale prefix (next-intl adds `/en` for EN under `as-needed`).
// So `/catalog` → MK `/katalog`, EN `/en/catalog`.
//
// MK slugs are Latin transliteration, not Cyrillic (D-2.01-1, decided by Lazar): links get shared in
// Viber/Instagram where a Cyrillic path percent-encodes into an unreadable string. Product-detail
// slugs are single and shared across both locales (D-2.01-2) — the product token is not localised.
// Slugs are provisional until 2.02 confirms them: changing one here is a one-line edit + one matching
// redirect row in next.config.ts (keep the two in lockstep).
export const routing = defineRouting({
  locales: ['mk', 'en'],
  defaultLocale: 'mk',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/catalog': {mk: '/katalog', en: '/catalog'},
    '/catalog/[slug]': {mk: '/katalog/[slug]', en: '/catalog/[slug]'},
    '/cart': {mk: '/kosnicka', en: '/cart'},
    '/checkout': {mk: '/naracka', en: '/checkout'},
    '/about': {mk: '/za-nas', en: '/about'},
    '/contact': {mk: '/kontakt', en: '/contact'},
    // Internal review aid, not a customer surface — not localised (D-2.01-4).
    '/styleguide': '/styleguide',
  },
});
