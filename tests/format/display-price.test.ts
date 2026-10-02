import { describe, it, expect } from "vitest";
import { createElement, type ComponentType, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { NextIntlClientProvider } from "next-intl";
import { DisplayPrice } from "@/components/system/DisplayPrice";
import { AmountDue } from "@/components/product/AmountDue";
import { formatMkd } from "@/lib/format";
import mk from "../../src/messages/mk.json";
import en from "../../src/messages/en.json";

// English prices in dollars (Phase Y.10, D-Y.10-2/3/4). On EN the approximate dollar figure IS the
// displayed price at the catalog card, the Home showcase and the product page — "≈ $22", in the exact
// class list the MKD figure had at that call site, never bare "$". On MK nothing changes: the rendered
// span is byte-identical to what `main` rendered before this phase.

// The price element's class list at each call site, exactly as it was on `main` at 206fe1c.
const CALL_SITES = {
  card: {
    file: "src/components/product/ProductCard.tsx",
    className: "text-foreground text-small font-semibold tabular",
  },
  showcase: {
    file: "src/components/home/HomeShowcase.tsx",
    className: "text-price tabular font-semibold text-foreground",
  },
  productPage: {
    file: "src/app/[locale]/catalog/[slug]/page.tsx",
    className: "text-foreground",
  },
} as const;

const read = (file: string) => readFileSync(resolve(__dirname, "../..", file), "utf8");

function render(amountMkd: number, locale: "mk" | "en", className: string) {
  const currency = (locale === "mk" ? mk : en).Common.currency;
  return renderToStaticMarkup(createElement(DisplayPrice, { amountMkd, currency, locale, className }));
}

describe.each(Object.entries(CALL_SITES))("DisplayPrice at the %s", (_name, site) => {
  it("EN renders ≈ $22 for 1199 in the old MKD figure's classes, with no MKD", () => {
    const html = render(1199, "en", site.className);
    expect(html).toBe(`<span class="${site.className}">≈ $22</span>`);
    expect(html).not.toContain("MKD");
  });

  it("EN never shows a bare dollar figure without ≈", () => {
    expect(render(1199, "en", site.className)).not.toMatch(/(^|[^≈] )\$\d/);
  });

  it("MK renders 1.199 ден with no $ — byte-identical to the markup on main", () => {
    const html = render(1199, "mk", site.className);
    const onMain = renderToStaticMarkup(
      createElement("span", { className: site.className }, formatMkd(1199, mk.Common.currency, "mk")),
    );
    expect(html).toBe(onMain);
    expect(html).toContain("1.199 ден");
    expect(html).not.toContain("$");
  });

  it("the call site uses DisplayPrice with exactly that class list, and no longer WithUsdApprox", () => {
    const src = read(site.file);
    expect(src).toMatch(new RegExp(`<DisplayPrice[^>]*className="${site.className}"`));
    expect(src).not.toContain("WithUsdApprox");
  });
});

// The provider's props type requires `children` as a prop, which the lint rule forbids in createElement;
// typed here so the child can be passed as the third argument.
const IntlProvider = NextIntlClientProvider as ComponentType<{
  locale: string;
  messages: typeof en;
  children?: ReactNode;
}>;

function renderAmountDue(locale: "mk" | "en", amountMkd = 1199) {
  return renderToStaticMarkup(
    createElement(
      IntlProvider,
      { locale, messages: locale === "mk" ? mk : en },
      createElement(AmountDue, { amountMkd, locale }),
    ),
  );
}

describe("AmountDue — the shirt price and the delivery cost, under the product-page price", () => {
  // Y.11 (brief Task 7): the line reads as the price of ONE shirt plus a separate delivery cost — never
  // as an all-in amount — and it now renders in both locales (MK informal „Плаќаш"). It supersedes the
  // Y.10 "EN only" rule in part (D-Y.10-4 → D-Y.11-n).
  it("EN: per shirt, cash on delivery, plus 200 MKD for delivery", () => {
    expect(renderAmountDue("en")).toContain(
      "You pay 1,199 MKD per shirt in cash on delivery, plus 200 MKD for delivery.",
    );
  });

  it("MK: informal „Плаќаш“, dot grouping, plus 200 ден за достава", () => {
    expect(renderAmountDue("mk")).toContain(
      "Плаќаш 1.199 ден по маица во готовина при преземање, плус 200 ден за достава.",
    );
  });

  it.each(["mk", "en"] as const)("%s renders it muted at text-small", (locale) => {
    expect(renderAmountDue(locale)).toMatch(/class="[^"]*text-muted-foreground[^"]*text-small|class="[^"]*text-small[^"]*text-muted-foreground/);
  });

  it("no dollar figure on the MK line", () => {
    expect(renderAmountDue("mk")).not.toContain("$");
  });

  it("only the product page renders it — the card and the showcase do not", () => {
    expect(read(CALL_SITES.productPage.file)).toMatch(/<AmountDue\b/);
    expect(read(CALL_SITES.card.file)).not.toMatch(/AmountDue|amountDue/);
    expect(read(CALL_SITES.showcase.file)).not.toMatch(/AmountDue|amountDue/);
  });

  it("Product.amountDue carries {amount} and {cost} in both catalogs", () => {
    for (const msg of [en.Product.amountDue, mk.Product.amountDue]) {
      expect(msg).toContain("{amount}");
      expect(msg).toContain("{cost}");
    }
  });
});
