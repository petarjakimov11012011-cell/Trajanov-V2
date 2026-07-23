// Single source of truth for the Home FAQ (Phase 2.11). Both the visible section (HomeFaq.tsx) and the
// FAQPage JSON-LD (faq-jsonld.ts) iterate THIS list — neither hand-lists keys, so the rendered answer
// and the structured answer cannot drift (D-2.11-5). It holds message KEYS only, never translated
// strings: every value lives in src/messages/{mk,en}.json under the `Faq` namespace and is resolved
// per-locale at the render site. Kept free of `import "server-only"` so a plain vitest run can import it
// (the JSON-LD parity test does, mirroring src/lib/drop/size-order.ts — D-2.09-3).

/** A question/answer pair, referenced by its two next-intl keys (namespace `Faq`). */
export interface FaqItem {
  /** e.g. 'q1' — resolves to `Faq.q1`. */
  questionKey: string;
  /** e.g. 'a1' — resolves to `Faq.a1`. */
  answerKey: string;
}

/** A labelled group of questions — the three static labels of D-2.11-2 (no interactive tabs). */
export interface FaqGroup {
  /** e.g. 'groupOrdering' — the group's uppercase eyebrow label. */
  labelKey: string;
  /** The group's question/answer pairs, in display order. */
  items: FaqItem[];
}

/** The next-intl namespace every key below belongs to. */
export const FAQ_NAMESPACE = 'Faq';

/**
 * Three groups, eight questions, in display order (D-2.11-2, D-2.11-4): Ordering → Delivery → Pieces.
 * The `<details name="home-faq">` rows and the JSON-LD `mainEntity` array both walk this in order, so
 * the visible list and the structured data are guaranteed to match.
 */
export const FAQ_GROUPS: FaqGroup[] = [
  {
    labelKey: 'groupOrdering',
    items: [
      {questionKey: 'q1', answerKey: 'a1'},
      {questionKey: 'q2', answerKey: 'a2'},
      {questionKey: 'q3', answerKey: 'a3'},
    ],
  },
  {
    labelKey: 'groupDelivery',
    items: [
      {questionKey: 'q4', answerKey: 'a4'},
      {questionKey: 'q5', answerKey: 'a5'},
      {questionKey: 'q6', answerKey: 'a6'},
    ],
  },
  {
    labelKey: 'groupPieces',
    items: [
      {questionKey: 'q7', answerKey: 'a7'},
      {questionKey: 'q8', answerKey: 'a8'},
    ],
  },
];

/** Every Q/A pair, flattened in display order — for the JSON-LD builder and its parity test. */
export const FAQ_ITEMS: FaqItem[] = FAQ_GROUPS.flatMap((group) => group.items);
