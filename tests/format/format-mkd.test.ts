import { describe, it, expect, vi, afterEach } from "vitest";
import { createElement } from "react";
import { formatMkd, formatUsdApprox, formatMkdWithApproxUsd } from "@/lib/format";
import { renderToHtml } from "../helpers/harness/render";
import { HomeShowcase } from "@/components/home/HomeShowcase";
import { DisplayPrice } from "@/components/system/DisplayPrice";
import type { DropView } from "@/lib/drop/state";

vi.mock("@/i18n/navigation", () => import("../helpers/harness/navigation"));

// Deterministic MKD formatting (Phase Y.11, Task 8). `toLocaleString("mk-MK")` depends on the ICU data
// of whatever runtime renders: Node on the server has full ICU and prints "1.199", a browser without
// Macedonian data falls back and prints "1,199" or "1199" — so a client component (the Home showcase)
// rendered one figure on the server and another while hydrating. formatMkd now groups by hand: dot for
// MK, comma for EN, no ICU anywhere. These tests break the runtime's number formatting on purpose and
// require the same output.

function breakIcu() {
  // What a browser with no Macedonian locale data would do: ignore the tag, print a plain number.
  vi.spyOn(Number.prototype, "toLocaleString").mockImplementation(function (this: number) {
    return String(this.valueOf());
  });
  vi.spyOn(Intl, "NumberFormat").mockImplementation(() => {
    throw new Error("Intl.NumberFormat must not be used for prices");
  });
}

afterEach(() => vi.restoreAllMocks());

describe("formatMkd groups thousands by hand", () => {
  it.each([
    [0, "0 ден"],
    [7, "7 ден"],
    [200, "200 ден"],
    [999, "999 ден"],
    [1000, "1.000 ден"],
    [1199, "1.199 ден"],
    [1500, "1.500 ден"],
    [12345, "12.345 ден"],
    [1234567, "1.234.567 ден"],
  ])("mk %i → %s", (amount, expected) => {
    expect(formatMkd(amount, "ден", "mk")).toBe(expected);
  });

  it.each([
    [200, "200 MKD"],
    [1199, "1,199 MKD"],
    [1234567, "1,234,567 MKD"],
  ])("en %i → %s", (amount, expected) => {
    expect(formatMkd(amount, "MKD", "en")).toBe(expected);
  });

  it("an unknown locale falls back to Macedonian grouping (the default language)", () => {
    expect(formatMkd(1199, "ден", "xx" as never)).toBe("1.199 ден");
  });
});

describe("no dependence on runtime ICU", () => {
  it("MK and EN prices are identical with the runtime's number formatting broken", () => {
    const before = [formatMkd(1199, "ден", "mk"), formatMkd(1199, "MKD", "en"), formatUsdApprox(100000, "en")];
    breakIcu();
    expect([formatMkd(1199, "ден", "mk"), formatMkd(1199, "MKD", "en"), formatUsdApprox(100000, "en")]).toEqual(
      before,
    );
    expect(formatMkdWithApproxUsd(200, "MKD", "en")).toBe("200 MKD (≈ $4)");
  });
});

function view(): DropView {
  return {
    slug: "test-drop",
    state: "ended",
    startsAtMs: 0,
    endsAtMs: null,
    serverNowMs: 0,
    remaining: 0,
    products: ["test-mustard-ochre", "test-off-white", "test-baby-blue"].map((slug, i) => ({
      slug,
      index: i + 1,
      nameMk: null,
      nameEn: null,
      priceMkd: 1199,
      stock: "in-stock" as const,
      remaining: 10,
      sizes: [],
    })),
    isPreview: false,
  };
}

describe("server and client render the same MK price", () => {
  it("Home showcase: identical markup with full ICU (server) and without MK data (browser)", async () => {
    const server = await renderToHtml(createElement(HomeShowcase, { view: view() }), "mk");
    breakIcu();
    const client = await renderToHtml(createElement(HomeShowcase, { view: view() }), "mk");
    expect(client).toBe(server);
    expect((server.match(/1\.199 ден/g) ?? []).length).toBe(3);
  });

  it("catalog card and product page price span (DisplayPrice): identical on both paths", async () => {
    const render = () =>
      renderToHtml(
        createElement(DisplayPrice, { amountMkd: 1199, currency: "ден", locale: "mk", className: "text-foreground" }),
        "mk",
      );
    const server = await render();
    breakIcu();
    expect(await render()).toBe(server);
    expect(server).toBe('<span class="text-foreground">1.199 ден</span>');
  });
});
