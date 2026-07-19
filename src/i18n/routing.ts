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
// The 2.02 native-MK review confirmed all six original MK slugs unchanged (D-2.02-3): two native
// speakers read each one in the address bar and kept it. Changing one is still a one-line edit here +
// one matching redirect row in next.config.ts (keep the two in lockstep).
//
// The three legal slugs (/uslovi, /privatnost, /isporaka-i-vrakjanje) were ADDED in 2.03, same Latin
// transliteration as the six above (D-2.01-1). They need NO redirect in next.config.ts — these paths
// have never existed, so there is nothing to redirect from. Their MK wording is unreviewed by a native
// speaker until docs/i18n/mk-review-2.03.md is signed off (owed-verification register).
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
    '/terms': {mk: '/uslovi', en: '/terms'},
    '/privacy': {mk: '/privatnost', en: '/privacy'},
    '/shipping-returns': {mk: '/isporaka-i-vrakjanje', en: '/shipping-returns'},
    // Internal review aid, not a customer surface — not localised (D-2.01-4).
    '/styleguide': '/styleguide',
  },
});
