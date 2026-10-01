import { describe, it, expect, vi, beforeEach } from "vitest";
import { createElement } from "react";
import { renderPage, renderToHtml, visibleText } from "../helpers/harness/render";
import { dropFixture, resetDropFixture } from "../helpers/harness/drop-state";
import type { TestLocale } from "../helpers/harness/intl-state";

vi.mock("server-only", () => ({}));
vi.mock("next-intl/server", () => import("../helpers/harness/next-intl-server"));
vi.mock("@/i18n/navigation", () => import("../helpers/harness/navigation"));
vi.mock("@/lib/drop/state", () => import("../helpers/harness/drop-state"));

import HomePage from "@/app/[locale]/page";
import CatalogPage from "@/app/[locale]/catalog/page";
import ProductPage from "@/app/[locale]/catalog/[slug]/page";
import { ProductCard } from "@/components/product/ProductCard";

// Ended vs sold out, rendered (Phase Y.11, brief decision 7, Task 6). Between drops the store is
// browsable but not buyable: no stock badge, no per-size counts, and the button says ordering is
// closed — never "Sold out". "Sold out" appears only when a product's stock is 0 in a LIVE drop.

const S = {
  mk: {
    closed: "Нарачките се затворени",
    soldOut: "Распродадено",
    inStock: "На залиха",
    low: "Уште 2",
    comingSoon: "Наскоро",
    add: "Додај во кошничка",
  },
  en: {
    closed: "Ordering is closed",
    soldOut: "Sold out",
    inStock: "In stock",
    low: "2 left",
    comingSoon: "Coming soon",
    add: "Add to cart",
  },
} as const;

const LOCALES: TestLocale[] = ["mk", "en"];

beforeEach(() => resetDropFixture("ended"));

describe.each(LOCALES)("ended drop (%s)", (locale) => {
  const s = S[locale];

  it("product page: 'Ordering is closed' on a disabled button, no stock line, never 'Sold out'", async () => {
    for (const slug of ["test-mustard-ochre", "test-off-white", "test-baby-blue"]) {
      // Even a product whose stock really is 0 reads as closed once the drop is over.
      dropFixture.stock = { "test-baby-blue": "sold-out" };
      const html = await renderPage(ProductPage, locale, { slug });
      const text = visibleText(html);
      expect(html, slug).toMatch(new RegExp(`<button[^>]*disabled=""[^>]*>${s.closed}</button>`));
      for (const word of [s.soldOut, s.inStock, s.low, s.add]) {
        expect(text.includes(word), `${slug} shows "${word}"`).toBe(false);
      }
    }
  });

  it("product page: sizes are listed but not struck through (no per-size availability)", async () => {
    dropFixture.stock = { "test-mustard-ochre": "sold-out" };
    const html = await renderPage(ProductPage, locale, { slug: "test-mustard-ochre" });
    const sizeButtons = html.match(/<button[^>]*>(S|M|L|XL)<\/button>/g) ?? [];
    expect(sizeButtons).toHaveLength(4);
    for (const b of sizeButtons) {
      expect(b).not.toContain("line-through");
      expect(b).toContain('disabled=""');
    }
  });

  it("catalog: no stock badge or count on any card; cards stay links", async () => {
    dropFixture.stock = { "test-baby-blue": "sold-out" };
    const html = await renderPage(CatalogPage, locale);
    const text = visibleText(html);
    for (const word of [s.soldOut, s.inStock, s.low]) {
      expect(text.includes(word), `catalog shows "${word}"`).toBe(false);
    }
    expect(html).not.toContain("aria-disabled");
    expect(html).not.toContain("grayscale");
  });

  it("home showcase: no stock badge on the slides", async () => {
    // Scoped to the showcase section: the FAQ below it quotes "Sold out" on purpose (answer 8).
    const html = await renderPage(HomePage, locale);
    const start = html.indexOf('aria-labelledby="home-showcase-heading"');
    expect(start).toBeGreaterThan(-1);
    const text = visibleText(html.slice(start, html.indexOf("</section>", start)));
    expect(text).toContain(locale === "mk" ? "Последниот дроп" : "Last drop");
    for (const word of [s.soldOut, s.inStock, s.low]) {
      expect(text.includes(word), `home shows "${word}"`).toBe(false);
    }
  });
});

describe.each(LOCALES)("live drop (%s)", (locale) => {
  const s = S[locale];

  it("a product with stock: 'In stock' and Add to cart", async () => {
    resetDropFixture("live");
    const text = visibleText(await renderPage(ProductPage, locale, { slug: "test-mustard-ochre" }));
    expect(text).toContain(s.inStock);
    expect(text).toContain(s.add);
    expect(text).not.toContain(s.closed);
  });

  it("a product at 0 stock: 'Sold out' — the only state that says it", async () => {
    resetDropFixture("live");
    dropFixture.stock = { "test-mustard-ochre": "sold-out" };
    const html = await renderPage(ProductPage, locale, { slug: "test-mustard-ochre" });
    expect(html).toMatch(new RegExp(`<button[^>]*disabled=""[^>]*>${s.soldOut}</button>`));
    expect(visibleText(html)).not.toContain(s.closed);
  });

  it("catalog card at 0 stock reads 'Sold out'; a low one shows the count", async () => {
    resetDropFixture("live");
    dropFixture.stock = { "test-mustard-ochre": "sold-out" };
    const text = visibleText(await renderPage(CatalogPage, locale));
    expect(text).toContain(s.soldOut);
    expect(text).toContain(s.low);
  });
});

describe.each(LOCALES)("countdown (%s)", (locale) => {
  it("product page says Coming soon, not closed and not sold out", async () => {
    resetDropFixture("countdown");
    dropFixture.stock = { "test-mustard-ochre": "sold-out" };
    const text = visibleText(await renderPage(ProductPage, locale, { slug: "test-mustard-ochre" }));
    expect(text).toContain(S[locale].comingSoon);
    expect(text).not.toContain(S[locale].closed);
    expect(text).not.toContain(S[locale].soldOut);
  });
});

describe.each(LOCALES)("a missing fact is omitted, never marked (%s, brief decision 3)", (locale) => {
  const noPhoto = locale === "mk" ? "Сè уште нема фотографија" : "No photo yet";

  it("product page with no price, no photo and no care copy", async () => {
    resetDropFixture("live");
    dropFixture.withUnfilled = true;
    const html = await renderPage(ProductPage, locale, { slug: "test-unfilled" });
    const text = visibleText(html);
    expect(html).not.toContain("[PLACEHOLDER");
    expect(html).not.toContain("data-placeholder");
    expect(text).toContain(noPhoto);
    // No care copy → no Composition & care section at all.
    expect(text).not.toContain(locale === "mk" ? "Состав и нега" : "Composition & care");
  });

  it("catalog card with no price and no photo", async () => {
    const html = await renderToHtml(
      createElement(ProductCard, {
        product: {
          slug: "test-unfilled",
          index: 4,
          nameMk: null,
          nameEn: null,
          priceMkd: null,
          stock: "in-stock",
          remaining: 12,
          sizes: [],
        },
        dropState: "live",
      }),
      locale,
    );
    expect(html).not.toContain("[PLACEHOLDER");
    expect(html).not.toContain("data-placeholder");
    expect(visibleText(html)).toContain(noPhoto);
  });
});
