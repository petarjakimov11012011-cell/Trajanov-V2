import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderPage, renderToHtml, visibleText } from "../helpers/harness/render";
import { resetDropFixture } from "../helpers/harness/drop-state";
import type { TestLocale } from "../helpers/harness/intl-state";
import { createElement } from "react";

vi.mock("server-only", () => ({}));
vi.mock("next-intl/server", () => import("../helpers/harness/next-intl-server"));
vi.mock("@/i18n/navigation", () => import("../helpers/harness/navigation"));
vi.mock("@/lib/drop/state", () => import("../helpers/harness/drop-state"));

import HomePage from "@/app/[locale]/page";
import CatalogPage from "@/app/[locale]/catalog/page";
import ProductPage from "@/app/[locale]/catalog/[slug]/page";
import AboutPage from "@/app/[locale]/about/page";
import ContactPage from "@/app/[locale]/contact/page";
import TermsPage from "@/app/[locale]/terms/page";
import PrivacyPage from "@/app/[locale]/privacy/page";
import ShippingPage from "@/app/[locale]/shipping-returns/page";

// Honest public pages (Phase Y.11, brief decision 3, Task 5). Customer pages never show internal notes,
// the client's name as a task owner, "later phase", or `[PLACEHOLDER: …]` markup. Each listed page is
// rendered for real — both locales, every drop state — and its HTML is searched for the markers.

const LOCALES: TestLocale[] = ["mk", "en"];
const SLUGS = ["test-mustard-ochre", "test-off-white", "test-baby-blue"];

// Strings that must never reach a customer page, in either language. The notice and the size-sample
// line are spelled out literally: their catalog keys were deleted with them in Y.11, and this guard has
// to keep catching them if anyone ever brings them back.
const FORBIDDEN: string[] = [
  "[PLACEHOLDER",
  "Design-system preview. Product data (name, price, sizes, composition, photos) is placeholder",
  "Преглед на дизајн-системот. Податоците за производите",
  "sizes — sample",
  "величини — примерок",
  "pending Vladimir",
  "се чекаат од Владимир",
  "later phase",
  "подоцнежна фаза",
  "Design-system preview",
  "Преглед на дизајн-системот",
  "— Vladimir]",
  "— Владимир]",
];

function expectHonest(html: string, where: string) {
  for (const marker of FORBIDDEN) {
    expect(html.includes(marker), `${where} renders "${marker}"`).toBe(false);
  }
  expect(html, `${where} renders a data-placeholder element`).not.toContain("data-placeholder");
}

type PageCase = [name: string, render: (locale: TestLocale) => Promise<string>];

const STATIC_PAGES: PageCase[] = [
  ["about", (l) => renderPage(AboutPage, l)],
  ["contact", (l) => renderPage(ContactPage, l)],
  ["terms", (l) => renderPage(TermsPage, l)],
  ["privacy", (l) => renderPage(PrivacyPage, l)],
  ["shipping", (l) => renderPage(ShippingPage, l)],
];

const DROP_PAGES: PageCase[] = [
  ["home", (l) => renderPage(HomePage, l)],
  ["catalog", (l) => renderPage(CatalogPage, l)],
  ...SLUGS.map((slug): PageCase => [`product ${slug}`, (l) => renderPage(ProductPage, l, { slug })]),
];

beforeEach(() => resetDropFixture("ended"));

describe.each(LOCALES)("public pages render no internal markers (%s)", (locale) => {
  it.each(STATIC_PAGES)("%s", async (name, render) => {
    expectHonest(await render(locale), `${locale} ${name}`);
  });

  describe.each(["ended", "countdown", "live"] as const)("drop %s", (state) => {
    it.each(DROP_PAGES)("%s", async (name, render) => {
      resetDropFixture(state);
      expectHonest(await render(locale), `${locale} ${name} (${state})`);
    });
  });

  it("home and catalog with no drop at all", async () => {
    resetDropFixture(null);
    expectHonest(await renderPage(HomePage, locale), `${locale} home (no drop)`);
    expectHonest(await renderPage(CatalogPage, locale), `${locale} catalog (no drop)`);
  });

  it("the 404 page", async () => {
    const { default: NotFound } = await import("@/app/[locale]/not-found");
    const html = await renderToHtml(createElement(NotFound), locale);
    expectHonest(html, `${locale} 404`);
  });
});

describe("the product gallery shows real photos only (brief decision 8)", () => {
  it.each(LOCALES)("%s: mustard and off-white render one photograph and no empty slot", async (locale) => {
    for (const slug of ["test-mustard-ochre", "test-off-white"]) {
      const html = await renderPage(ProductPage, locale, { slug });
      expect((html.match(/<img /g) ?? []).length, slug).toBe(1);
      expect(visibleText(html), slug).not.toContain(
        locale === "mk" ? "фотографија" : "product photo",
      );
    }
  });

  it.each(LOCALES)("%s: baby blue keeps both photographs", async (locale) => {
    const html = await renderPage(ProductPage, locale, { slug: "test-baby-blue" });
    expect((html.match(/<img /g) ?? []).length).toBe(2);
  });
});
