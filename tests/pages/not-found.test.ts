import { describe, it, expect, vi, beforeEach } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { renderPage, renderToHtml, visibleText } from "../helpers/harness/render";
import { resetDropFixture } from "../helpers/harness/drop-state";
import type { TestLocale } from "../helpers/harness/intl-state";
import mk from "../../src/messages/mk.json";
import en from "../../src/messages/en.json";

vi.mock("server-only", () => ({}));
vi.mock("next-intl/server", () => import("../helpers/harness/next-intl-server"));
vi.mock("@/i18n/navigation", () => import("../helpers/harness/navigation"));
vi.mock("@/lib/drop/state", () => import("../helpers/harness/drop-state"));

import LocaleNotFound from "@/app/[locale]/not-found";
import CatchAll from "@/app/[locale]/[...rest]/page";
import RootNotFound from "@/app/not-found";
import ProductPage from "@/app/[locale]/catalog/[slug]/page";

// The localized 404 (Phase Y.11, Task 9). Any unknown path in either locale and any unknown product
// slug lands on a branded page in that locale, with a way back to Home and the Catalog. The 404 status
// and Next's automatic `noindex` are verified against the running server in the render matrix; here we
// pin what renders and that every route into it really calls notFound().

const NOT_FOUND_DIGEST = "NEXT_HTTP_ERROR_FALLBACK;404";

const HREFS = {
  mk: { home: "/", catalog: "/katalog" },
  en: { home: "/en", catalog: "/en/catalog" },
} as const;

beforeEach(() => resetDropFixture("ended"));

describe.each(["mk", "en"] as TestLocale[])("[locale]/not-found (%s)", (locale) => {
  const m = locale === "mk" ? mk : en;

  it("renders the localized heading and body", async () => {
    const text = visibleText(await renderToHtml(createElement(LocaleNotFound), locale));
    expect(text).toContain(m.NotFound.h1);
    expect(text).toContain(m.NotFound.body);
  });

  it("links to Home and the Catalog in this locale", async () => {
    const html = await renderToHtml(createElement(LocaleNotFound), locale);
    expect(html).toContain(`href="${HREFS[locale].home}"`);
    expect(html).toContain(`href="${HREFS[locale].catalog}"`);
  });

  it("has exactly one h1", async () => {
    const html = await renderToHtml(createElement(LocaleNotFound), locale);
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
  });

  it("an unknown product slug calls notFound()", async () => {
    await expect(renderPage(ProductPage, locale, { slug: "no-such-shirt" })).rejects.toMatchObject({
      digest: NOT_FOUND_DIGEST,
    });
  });
});

describe("the locale catch-all", () => {
  it("calls notFound() for any unmatched path", () => {
    let caught: unknown;
    try {
      CatchAll();
    } catch (err) {
      caught = err;
    }
    expect(caught).toMatchObject({ digest: NOT_FOUND_DIGEST });
  });
});

describe("root not-found fallback (outside any locale)", () => {
  const html = renderToStaticMarkup(createElement(RootNotFound));
  const text = visibleText(html);

  it("is a full document in Macedonian first, with the English beside it", () => {
    expect(html).toMatch(/^<html lang="mk"/);
    expect(text).toContain(mk.NotFound.h1);
    expect(text).toContain(en.NotFound.h1);
  });

  it("links to both homes and both catalogs", () => {
    for (const href of ["/", "/katalog", "/en", "/en/catalog"]) {
      expect(html).toContain(`href="${href}"`);
    }
  });

  it("renders no internal markers", () => {
    expect(html).not.toContain("[PLACEHOLDER");
  });
});

describe("catalog strings", () => {
  it("NotFound has the same keys in both catalogs", () => {
    expect(Object.keys(mk.NotFound).sort()).toEqual(Object.keys(en.NotFound).sort());
  });
});
