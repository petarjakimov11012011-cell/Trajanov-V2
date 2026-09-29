import {describe, it, expect} from "vitest";
import {createTranslator} from "next-intl";
import mk from "../../src/messages/mk.json";
import en from "../../src/messages/en.json";
import {DELIVERY_COST_MKD} from "../../src/config/shipping";
import {formatMkdWithApproxUsd} from "../../src/lib/format";
import {faqJsonLd} from "../../src/lib/seo/faq-jsonld";

// Delivery-cost copy (Phase Y.09, D-Y.09-2). The cost is a number in ONE constant; the catalogs only
// ever carry an ICU `{cost}` slot for it. These guards fail if someone types the figure into copy, if
// any string still tells a customer the cost is unknown, or if a `{cost}` slot reaches the page (or the
// FAQPage JSON-LD) un-interpolated.

type Flat = Record<string, string>;

function flatten(obj: Record<string, unknown>, prefix = ""): Flat {
  const out: Flat = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") out[key] = v;
    else if (v && typeof v === "object") Object.assign(out, flatten(v as Record<string, unknown>, key));
  }
  return out;
}

const catalogs = {mk: flatten(mk as Record<string, unknown>), en: flatten(en as Record<string, unknown>)};
const currency = {mk: mk.Common.currency, en: en.Common.currency};

// Every key that states the delivery cost, and so must carry the `{cost}` slot.
const COST_KEYS = ["ShippingReturns.deliveryBody", "Faq.a5", "Cart.shippingValue"] as const;

describe("the delivery cost is never typed into copy", () => {
  it.each(["mk", "en"] as const)("no %s string contains the literal 200", (locale) => {
    const offenders = Object.entries(catalogs[locale]).filter(([, v]) => /(^|\D)200(\D|$)/.test(v));
    expect(offenders, "type {cost}, not the number — it lives in src/config/shipping.ts").toEqual([]);
  });

  it.each(COST_KEYS)("%s carries the {cost} slot in both locales", (key) => {
    expect(catalogs.mk[key]).toContain("{cost}");
    expect(catalogs.en[key]).toContain("{cost}");
  });
});

describe("no string still says the delivery cost is unconfirmed", () => {
  // The phrases the pre-Y.09 copy used. Anywhere they appear next to delivery / courier / cost words
  // the customer is being told something that is no longer true.
  const UNCONFIRMED = {
    en: /aren't confirmed|aren’t confirmed|not confirmed/i,
    mk: /сè уште не се потврдени|сè уште ги немаме потврдено/i,
  };
  const DELIVERY_CONTEXT = {
    en: /deliver|courier|cost|shipping/i,
    mk: /достав|испорак|курир|цена|цената/i,
  };

  it.each(["mk", "en"] as const)("%s: none left", (locale) => {
    const offenders = Object.entries(catalogs[locale]).filter(
      ([, v]) => UNCONFIRMED[locale].test(v) && DELIVERY_CONTEXT[locale].test(v),
    );
    expect(offenders).toEqual([]);
  });
});

describe("{cost} interpolates to the formatted cost", () => {
  const EXPECTED = {en: "200 MKD (≈ $4)", mk: "200 ден"};

  it("the constant formats to the brief's figures", () => {
    expect(formatMkdWithApproxUsd(DELIVERY_COST_MKD, currency.en, "en")).toBe(EXPECTED.en);
    expect(formatMkdWithApproxUsd(DELIVERY_COST_MKD, currency.mk, "mk")).toBe(EXPECTED.mk);
  });

  it.each(["mk", "en"] as const)("%s: every cost key renders the cost and no literal {cost}", (locale) => {
    const t = createTranslator({locale, messages: locale === "mk" ? mk : en});
    const cost = formatMkdWithApproxUsd(DELIVERY_COST_MKD, currency[locale], locale);
    for (const key of COST_KEYS) {
      const out = t(key as never, {cost} as never) as string;
      expect(out, key).toContain(EXPECTED[locale]);
      expect(out, key).not.toContain("{cost}");
    }
  });

  it("renders the exact Shipping-page and FAQ lines the brief specifies", () => {
    const tEn = createTranslator({locale: "en", messages: en});
    const tMk = createTranslator({locale: "mk", messages: mk});
    const costEn = formatMkdWithApproxUsd(DELIVERY_COST_MKD, currency.en, "en");
    const costMk = formatMkdWithApproxUsd(DELIVERY_COST_MKD, currency.mk, "mk");
    expect(tEn("ShippingReturns.deliveryBody", {cost: costEn})).toBe("Delivery cost: 200 MKD (≈ $4).");
    expect(tMk("ShippingReturns.deliveryBody", {cost: costMk})).toBe("Цена на достава: 200 ден.");
    expect(tEn("Cart.shippingValue", {cost: costEn})).toBe("200 MKD (≈ $4)");
    expect(tMk("Cart.shippingValue", {cost: costMk})).toBe("200 ден");
  });
});

describe("the FAQPage JSON-LD receives the interpolated answer (D-2.11-5: one key, two outputs)", () => {
  it.each(["mk", "en"] as const)("%s: answer 5 in the structured data carries the cost", (locale) => {
    const t = createTranslator({locale, messages: locale === "mk" ? mk : en, namespace: "Faq"});
    const cost = formatMkdWithApproxUsd(DELIVERY_COST_MKD, currency[locale], locale);
    // The same translator shape HomeFaq hands to both the visible list and faqJsonLd.
    const node = faqJsonLd((key) => t(key as never, {cost} as never) as string) as {
      mainEntity: {acceptedAnswer: {text: string}}[];
    };
    const json = JSON.stringify(node);
    expect(json).not.toContain("{cost}");
    expect(node.mainEntity[4].acceptedAnswer.text).toContain(locale === "en" ? "200 MKD (≈ $4)" : "200 ден");
  });
});

describe("the MK catalog carries no dollar figure (USD is EN-only, D-Y.09-4)", () => {
  it("no mk string contains $ or USD", () => {
    const offenders = Object.entries(catalogs.mk).filter(([, v]) => /\$|USD/.test(v));
    expect(offenders).toEqual([]);
  });
});
