import {describe, it, expect} from "vitest";
import {faqJsonLd} from "../../src/lib/seo/faq-jsonld";
import {FAQ_ITEMS, FAQ_GROUPS} from "../../src/lib/faq";
import mk from "../../src/messages/mk.json";
import en from "../../src/messages/en.json";

// FAQPage JSON-LD (Phase 2.11, Task 7). The load-bearing rule: the structured data is built from the
// SAME key list as the visible section (src/lib/faq.ts), so the crawled answer and the rendered answer
// cannot drift (D-2.11-5). These guards assert exactly that: 8 questions, all non-empty, in faq.ts
// order, and every key faq.ts references exists in BOTH catalogs (a missing key would ship an empty
// answer or crash the render).

interface FaqNode {
  "@context": string;
  "@type": string;
  mainEntity: {
    "@type": string;
    name: string;
    acceptedAnswer: {"@type": string; text: string};
  }[];
}

const enFaq = (en as {Faq: Record<string, string>}).Faq;
const mkFaq = (mk as {Faq: Record<string, string>}).Faq;

const enNode = faqJsonLd((key) => enFaq[key]) as FaqNode;

describe("faqJsonLd — FAQPage node", () => {
  it("is a FAQPage carrying exactly 8 questions", () => {
    expect(enNode["@context"]).toBe("https://schema.org");
    expect(enNode["@type"]).toBe("FAQPage");
    expect(enNode.mainEntity).toHaveLength(8);
    expect(FAQ_ITEMS).toHaveLength(8);
  });

  it("gives every question a non-empty name and a non-empty answer text", () => {
    for (const q of enNode.mainEntity) {
      expect(q["@type"]).toBe("Question");
      expect(q.name.trim().length).toBeGreaterThan(0);
      expect(q.acceptedAnswer["@type"]).toBe("Answer");
      expect(q.acceptedAnswer.text.trim().length).toBeGreaterThan(0);
    }
  });

  it("emits questions in the exact order of src/lib/faq.ts", () => {
    // faq.ts is the intended garment/topic order (Ordering → Delivery → Pieces): q1…q8 / a1…a8.
    expect(FAQ_ITEMS.map((i) => i.questionKey)).toEqual(["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"]);
    expect(FAQ_ITEMS.map((i) => i.answerKey)).toEqual(["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8"]);
    // …and the node preserves that order.
    expect(enNode.mainEntity.map((q) => q.name)).toEqual(FAQ_ITEMS.map((i) => enFaq[i.questionKey]));
  });

  it("puts the catalog answer verbatim into the node (no drift between rendered and structured)", () => {
    enNode.mainEntity.forEach((q, i) => {
      expect(q.name).toBe(enFaq[FAQ_ITEMS[i].questionKey]);
      expect(q.acceptedAnswer.text).toBe(enFaq[FAQ_ITEMS[i].answerKey]);
    });
  });
});

// Every key faq.ts references — the three group labels plus the eight q/a pairs — must exist and be
// non-empty in BOTH catalogs; otherwise the section renders a blank answer or the render throws.
const referencedKeys = [
  ...FAQ_GROUPS.map((g) => g.labelKey),
  ...FAQ_ITEMS.flatMap((i) => [i.questionKey, i.answerKey]),
];

describe("every key referenced by src/lib/faq.ts exists in both catalogs", () => {
  it.each(referencedKeys)("Faq.%s is present and non-empty in mk and en", (key) => {
    expect(mkFaq[key], `mk.json is missing Faq.${key}`).toBeTruthy();
    expect(mkFaq[key].trim().length).toBeGreaterThan(0);
    expect(enFaq[key], `en.json is missing Faq.${key}`).toBeTruthy();
    expect(enFaq[key].trim().length).toBeGreaterThan(0);
  });
});
