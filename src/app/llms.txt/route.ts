import {INDEXABLE_STATIC_HREFS, absoluteUrl} from '@/lib/seo/routes';
import {INSTAGRAM_HANDLE, INSTAGRAM_URL, PHONE_DISPLAY} from '@/lib/social';

// llms.txt (Task 1 of Phase 2.04b) — the plain-language file some AI crawlers/agents read to
// understand a site. Served at the root (`/llms.txt`), built like robots.ts/sitemap.ts: it reads
// `SITE_URL` and the SHARED indexable-route list (src/lib/seo/routes.ts, the same source the sitemap
// uses), so every URL is absolute and no slug or domain is hand-typed — a routing.ts change flows here.
//
// FACTS DISCIPLINE (facts.md is the only source). Everything below is traced:
//   • brand Trajanov, from Strumica / North Macedonia, founded 2026 ....... facts.md §1
//   • founder Vladimir Trajanov, secondary-school clothing-design student .. facts.md §2
//   • first place, national t-shirt design competition (Kreativen den + EAM, June 2026) .. facts.md §3
//   • oversized unisex t-shirts; limited drops; cash on delivery; NMK-only . facts.md §7
//   • Instagram @trajanovv2026; phone 078 820 520 ......................... facts.md §5/§6
// EXCLUDED (unverified / owed — must NOT appear, facts.md §7/§10): prices, sizes, fabric/composition,
// email, any address, and any review / rating / partner / award-beyond-the-one-win claim.
//
// This is NOT a page: it is absent from the sitemap and carries `X-Robots-Tag: noindex` so it never
// surfaces as a search result. The file's prose is English (the practical lingua franca for LLM
// crawlers) while the links list BOTH locales — the site itself is bilingual MK (default) / EN.

export const dynamic = 'force-static';

// English label + section + one-line note per shared route. Keyed by the shared list's members, so
// adding a route to INDEXABLE_STATIC_HREFS forces a label here (compile-time exhaustiveness) and it
// can never be silently omitted from llms.txt.
type StaticHref = (typeof INDEXABLE_STATIC_HREFS)[number];
const PAGE_META: Record<StaticHref, {label: string; section: 'pages' | 'legal'; note: string}> = {
  '/': {label: 'Home', section: 'pages', note: 'The current drop — a countdown to the next one, the live drop, or the ended state.'},
  '/catalog': {label: 'Catalog', section: 'pages', note: 'The products in the current drop.'},
  '/about': {label: 'About', section: 'pages', note: 'The brand and the 2026 competition win.'},
  '/contact': {label: 'Contact', section: 'pages', note: 'Reach Trajanov by Instagram or phone.'},
  '/terms': {label: 'Terms', section: 'legal', note: 'Terms of sale — cash on delivery, North Macedonia only.'},
  '/privacy': {label: 'Privacy', section: 'legal', note: 'What order data is collected, and why.'},
  '/shipping-returns': {label: 'Shipping & Returns', section: 'legal', note: 'How delivery and returns work.'},
};

// Both-locale links for one route, as absolute URLs on SITE_URL.
function links(href: StaticHref): string {
  const {label, note} = PAGE_META[href];
  return (
    `- [${label} — Macedonian](${absoluteUrl(href, 'mk')}): ${note}\n` +
    `- [${label} — English](${absoluteUrl(href, 'en')}): ${note}`
  );
}

function section(which: 'pages' | 'legal'): string {
  return INDEXABLE_STATIC_HREFS.filter((href) => PAGE_META[href].section === which)
    .map(links)
    .join('\n');
}

function buildLlmsTxt(): string {
  return `# Trajanov

> Trajanov is a clothing brand from Strumica, North Macedonia, founded in 2026 by Vladimir Trajanov — a secondary-school clothing-design student who won first place in a national t-shirt design competition organised by Kreativen den and EAM (June 2026). Trajanov makes oversized unisex t-shirts and sells them in limited drops: when a countdown ends, a small number of products go live against real, limited stock. Payment is cash on delivery only; orders ship within North Macedonia. The site is bilingual — Macedonian (default) and English.

Between drops the site is browsable but nothing is buyable, and a countdown marks the next one. Each drop is 3 to 5 products against real, limited stock, with a maximum of 2 units per order. There are no card payments — you pay the courier in cash on arrival — and delivery is within North Macedonia only.

## Pages
${section('pages')}

## Legal
${section('legal')}

## Contact
- Instagram: ${INSTAGRAM_HANDLE} (${INSTAGRAM_URL})
- Phone: ${PHONE_DISPLAY}
`;
}

export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      // Not a page — keep it out of the search index (it is also absent from the sitemap).
      'X-Robots-Tag': 'noindex',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
