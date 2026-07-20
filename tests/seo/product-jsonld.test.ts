import {describe, it, expect} from "vitest";
import {productJsonLd, availabilityFor} from "../../src/lib/seo/product-jsonld";
import type {DropState, StockLevel} from "../../src/types/drop";

// Product JSON-LD (Part 2 · Phase 2.04, Task 5). The load-bearing rule: NO node while the name is a
// placeholder, and when a node IS emitted, price/currency/availability are real and image/description
// are omitted. This exercises the generator against a real-name fixture (the DoD's "test fixture is
// fine") since the live catalogue still has placeholder names (register #4).

const REAL_URL = "https://trajanov-v2.vercel.app/katalog/mustard";

describe("productJsonLd — the placeholder gate", () => {
  it("emits NO node while the name is a placeholder (null)", () => {
    const node = productJsonLd({
      name: null,
      priceMkd: 1199,
      stock: "in-stock",
      dropState: "live",
      url: REAL_URL,
    });
    expect(node).toBeNull();
  });

  it("never lets a neutral slot name reach structured data", () => {
    // The page computes `name` as the REAL name or null — never the slot string. Passing null (the slot
    // case) yields no node; passing a real name yields exactly that name and nothing invented.
    expect(productJsonLd({name: null, priceMkd: null, stock: "sold-out", dropState: "ended", url: REAL_URL})).toBeNull();
  });
});

describe("productJsonLd — a real-named product", () => {
  const node = productJsonLd({
    name: "Мустард",
    priceMkd: 1199,
    stock: "in-stock",
    dropState: "live",
    url: REAL_URL,
  }) as Record<string, unknown>;

  it("carries the real name, brand and offer", () => {
    expect(node["@type"]).toBe("Product");
    expect(node.name).toBe("Мустард");
    expect(node.brand).toEqual({"@type": "Brand", name: "Trajanov"});
    const offers = node.offers as Record<string, unknown>;
    expect(offers["@type"]).toBe("Offer");
    expect(offers.priceCurrency).toBe("MKD");
    expect(offers.price).toBe("1199"); // the REAL figure, as a string
    expect(offers.availability).toBe("https://schema.org/InStock");
    expect(offers.url).toBe(REAL_URL);
  });

  it("omits image and description while those are placeholders (#2/#3)", () => {
    expect(node).not.toHaveProperty("image");
    expect(node).not.toHaveProperty("description");
  });

  it("omits price entirely rather than emitting a fake one when unknown", () => {
    const noPrice = productJsonLd({
      name: "Мустард",
      priceMkd: null,
      stock: "in-stock",
      dropState: "live",
      url: REAL_URL,
    }) as Record<string, unknown>;
    const offers = noPrice.offers as Record<string, unknown>;
    expect(offers).not.toHaveProperty("price");
    expect(offers.priceCurrency).toBe("MKD");
  });
});

describe("availabilityFor — derived from server state, never hardcoded InStock", () => {
  const cases: [DropState, StockLevel, string][] = [
    ["live", "in-stock", "https://schema.org/InStock"],
    ["live", "low", "https://schema.org/InStock"],
    ["live", "sold-out", "https://schema.org/SoldOut"],
    ["countdown", "in-stock", "https://schema.org/PreOrder"],
    ["countdown", "sold-out", "https://schema.org/SoldOut"],
    ["ended", "in-stock", "https://schema.org/OutOfStock"],
    ["ended", "sold-out", "https://schema.org/SoldOut"],
  ];
  it.each(cases)("%s + %s → %s", (state, stock, expected) => {
    expect(availabilityFor(state, stock)).toBe(expected);
  });
});
