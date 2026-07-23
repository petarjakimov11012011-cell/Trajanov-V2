import {FAQ_ITEMS} from '@/lib/faq';

// FAQPage structured data for Home (Phase 2.11, D-2.11-5). It is built by iterating the SAME single
// source as the visible section (src/lib/faq.ts) and resolving each key through the caller's translator,
// so the structured answer is identical to the rendered answer — the two cannot drift.
//
// JSON-LD is a factual-claim surface exactly like visible copy, so the same rules bind it: every
// question and answer here is one of the eight reviewed `Faq` strings, and nothing is invented. There
// is one node type (`FAQPage`) with one `Question` / `acceptedAnswer` per item, in the order faq.ts
// lists them.
//
// The translator is passed in rather than read here, so this stays a pure, unit-testable function: the
// component hands it next-intl's `t` scoped to the `Faq` namespace; the test hands it a catalog lookup.
export function faqJsonLd(t: (key: string) => string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: t(item.questionKey),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(item.answerKey),
      },
    })),
  };
}
