import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderPage, visibleText } from "../helpers/harness/render";
import { resetDropFixture } from "../helpers/harness/drop-state";

vi.mock("server-only", () => ({}));
vi.mock("next-intl/server", () => import("../helpers/harness/next-intl-server"));
vi.mock("@/i18n/navigation", () => import("../helpers/harness/navigation"));
vi.mock("@/lib/drop/state", () => import("../helpers/harness/drop-state"));

import ProductPage from "@/app/[locale]/catalog/[slug]/page";
import TermsPage from "@/app/[locale]/terms/page";

// Price wording near the buy decision (Phase Y.11, Task 7). On cash on delivery the customer must see,
// before ordering, that the shirt price and the delivery cost are two amounts — both on the product page
// beside the price, and in the Terms prices paragraph. The cost comes from DELIVERY_COST_MKD.

beforeEach(() => resetDropFixture("live"));

describe("product page states the delivery cost beside the price", () => {
  it("MK", async () => {
    const text = visibleText(await renderPage(ProductPage, "mk", { slug: "test-baby-blue" }));
    expect(text).toContain("1.199 ден Плаќаш 1.199 ден по маица во готовина при преземање, плус 200 ден за достава.");
  });

  it("EN", async () => {
    const text = visibleText(await renderPage(ProductPage, "en", { slug: "test-baby-blue" }));
    expect(text).toContain("≈ $22 You pay 1,199 MKD per shirt in cash on delivery, plus 200 MKD for delivery.");
  });

  it("in every drop state, not only live", async () => {
    for (const state of ["countdown", "ended"] as const) {
      resetDropFixture(state);
      const text = visibleText(await renderPage(ProductPage, "en", { slug: "test-off-white" }));
      expect(text, state).toContain("plus 200 MKD for delivery");
    }
  });
});

describe("Terms says delivery is paid on top of the shirt price", () => {
  it("MK", async () => {
    const text = visibleText(await renderPage(TermsPage, "mk"));
    expect(text).toContain("Доставата чини 200 ден и се додава на цената на маицата.");
  });

  it("EN", async () => {
    const text = visibleText(await renderPage(TermsPage, "en"));
    expect(text).toContain("Delivery costs 200 MKD (≈ $4) on top of the shirt price.");
  });
});
