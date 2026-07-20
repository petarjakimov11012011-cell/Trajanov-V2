import {SITE_URL} from '@/lib/site';
import {INSTAGRAM_URL} from '@/lib/social';

// Site-wide Organization + WebSite structured data (Task 4). JSON-LD is a factual-claim surface exactly
// like visible copy, so the same rules bind it (facts.md is the only source):
//   • NO `address` — the brand has no public address (facts.md §1); inventing one in schema is the same
//     lie as putting one in the footer.
//   • NO `logo` — no real logo asset exists in the repo (the favicon is not a brand logo); a fabricated
//     logo URL is a fabricated fact.
//   • NO SearchAction / sitelinks search box — there is no search on this site; claiming one is false.
//   • NO EAM / press / partner in `sameAs` — EAM manufactured the prize shirts and is not a partner
//     (facts.md §10). `sameAs` is the ONE verified Instagram account (facts.md §6), from src/lib/social.
export function siteJsonLd(): object {
  const organization = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Trajanov',
    url: SITE_URL,
    sameAs: [INSTAGRAM_URL],
  };
  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Trajanov',
    url: SITE_URL,
    inLanguage: ['mk', 'en'],
    publisher: {'@id': `${SITE_URL}/#organization`},
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [organization, website],
  };
}
