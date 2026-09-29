import {describe, it, expect} from "vitest";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import mk from "../../src/messages/mk.json";
import en from "../../src/messages/en.json";

// The Shipping page after Y.09 (D-Y.09-2/3). The page is an async server component that needs the
// next-intl request context, so this is a SOURCE guard rather than a render: it pins what the page is
// allowed to contain. The rendered HTML is checked separately in the browser (Task 9) — this test is
// what keeps a placeholder or the removed returns content from quietly coming back.

const PAGE = resolve(__dirname, "../../src/app/[locale]/shipping-returns/page.tsx");
const src = readFileSync(PAGE, "utf8");

describe("Shipping page source", () => {
  it("renders no Placeholder element and does not import it", () => {
    expect(src).not.toMatch(/<Placeholder[\s>]/);
    expect(src).not.toMatch(/import\s*\{[^}]*\bPlaceholder\b[^}]*\}/);
  });

  it("has exactly four sections: where, payment, delivery time and cost, if something is wrong", () => {
    const headings = [...src.matchAll(/<LegalSection heading=\{t\('([A-Za-z]+)'\)\}/g)].map((m) => m[1]);
    expect(headings).toEqual(["whereHeading", "paymentHeading", "deliveryHeading", "problemHeading"]);
  });

  it("no longer references the removed returns / limits keys", () => {
    for (const key of ["limitsHeading", "limitsBody", "returnsHeading", "returnsBody", "courier", "returnsWindow"]) {
      expect(src, key).not.toContain(`'${key}'`);
    }
  });

  it("was last updated 2026-09-29", () => {
    expect(src).toContain("const LAST_UPDATED = '2026-09-29';");
  });
});

describe("the removed keys are gone from both catalogs", () => {
  const removed: [string, string][] = [
    ["ShippingReturns", "limitsHeading"],
    ["ShippingReturns", "limitsBody"],
    ["ShippingReturns", "returnsHeading"],
    ["ShippingReturns", "returnsBody"],
    ["Placeholder", "courier"],
    ["Placeholder", "returnsWindow"],
  ];
  it.each(removed)("%s.%s is absent from mk and en", (ns, key) => {
    expect((mk as Record<string, Record<string, string>>)[ns][key]).toBeUndefined();
    expect((en as Record<string, Record<string, string>>)[ns][key]).toBeUndefined();
  });
});

describe("the page is titled Shipping", () => {
  it("h1, nav label and meta title in both locales", () => {
    expect(en.ShippingReturns.h1).toBe("Shipping");
    expect(mk.ShippingReturns.h1).toBe("Испорака");
    expect(en.Nav.shipping).toBe("Shipping");
    expect(mk.Nav.shipping).toBe("Испорака");
    expect(en.Meta.shippingTitle).toBe("Shipping — Trajanov");
    expect(mk.Meta.shippingTitle).toBe("Испорака — Trajanov");
  });
});
