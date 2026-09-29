import {describe, it, expect} from "vitest";
import {formatMkd, formatUsdApprox, formatMkdWithApproxUsd} from "../../src/lib/format";
import {MKD_PER_USD, USD_RATE_DATE} from "../../src/config/currency";

// Approximate USD on the English site (Phase Y.09, D-Y.09-4). MKD stays the price and the amount the
// customer hands the courier; EN adds a rounded dollar REFERENCE next to it, MK shows none. These pin
// the brief's worked examples at the 2026-09-29 reference rate (1 USD = 54.3 MKD), whole dollars,
// rounded half-up, with the `≈` prefix that says "not a quote".

describe("formatUsdApprox — EN gets an approximate whole-dollar reference", () => {
  it("1199 MKD → ≈ $22 (the two rehearsal shirts)", () => {
    expect(formatUsdApprox(1199, "en")).toBe("≈ $22");
  });

  it("1999 MKD → ≈ $37 (Product 03)", () => {
    expect(formatUsdApprox(1999, "en")).toBe("≈ $37");
  });

  it("200 MKD → ≈ $4 (the delivery cost)", () => {
    expect(formatUsdApprox(200, "en")).toBe("≈ $4");
  });

  it("groups thousands the English way on a large amount", () => {
    // 100000 / 54.3 = 1841.6… → 1842 → "1,842"
    expect(formatUsdApprox(100000, "en")).toBe("≈ $1,842");
  });

  it("rounds half-up at an exact .5", () => {
    // 54.3 × 2.5 = 135.75 MKD → exactly $2.50 → $3 (half-up, not banker's rounding to $2)
    expect(formatUsdApprox(135.75, "en")).toBe("≈ $3");
  });
});

describe("formatUsdApprox — MK renders no dollar figure at all", () => {
  it.each([200, 1199, 1999, 100000])("mk + %i → null", (amount) => {
    expect(formatUsdApprox(amount, "mk")).toBeNull();
  });
});

describe("formatMkdWithApproxUsd — one inline string for prose ({cost} in copy)", () => {
  it("EN: MKD first, the approximate dollar figure in brackets after it", () => {
    expect(formatMkdWithApproxUsd(200, "MKD", "en")).toBe("200 MKD (≈ $4)");
  });

  it("MK: exactly formatMkd — no brackets, no dollar sign", () => {
    expect(formatMkdWithApproxUsd(200, "ден", "mk")).toBe("200 ден");
    expect(formatMkdWithApproxUsd(200, "ден", "mk")).toBe(formatMkd(200, "ден", "mk"));
  });
});

describe("formatMkd is unchanged by Y.09", () => {
  it("still groups per locale and never converts", () => {
    expect(formatMkd(1199, "ден", "mk")).toBe("1.199 ден");
    expect(formatMkd(1199, "MKD", "en")).toBe("1,199 MKD");
  });
});

describe("the reference rate", () => {
  it("is the 2026-09-29 mid-market rate the brief supplied (1 USD = 54.3 MKD)", () => {
    expect(MKD_PER_USD).toBe(54.3);
    expect(USD_RATE_DATE).toBe("2026-09-29");
  });
});
