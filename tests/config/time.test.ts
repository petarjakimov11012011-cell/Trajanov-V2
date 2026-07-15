import { describe, it, expect } from "vitest";
import { resolveWallClockToUtc, isWallClock } from "../../src/config/time";

// D-1.04-4: a naive Europe/Skopje wall-clock resolves to the correct absolute instant, DST-aware. BOTH
// cases are required — one alone does not prove DST handling. Skopje is UTC+2 in summer, UTC+1 in winter.
describe("resolveWallClockToUtc — Europe/Skopje, DST-resolved", () => {
  it("summer wall-clock 2026-08-15T20:00 → 18:00Z (UTC+2)", () => {
    expect(resolveWallClockToUtc("2026-08-15T20:00").toISOString()).toBe("2026-08-15T18:00:00.000Z");
  });

  it("winter wall-clock 2026-01-15T20:00 → 19:00Z (UTC+1)", () => {
    expect(resolveWallClockToUtc("2026-01-15T20:00").toISOString()).toBe("2026-01-15T19:00:00.000Z");
  });

  it("resolves both sides of the spring-forward boundary (2026-03-29) to the right offset", () => {
    // 01:30 is still winter (UTC+1) → 00:30Z; 03:30 is already summer (UTC+2) → 01:30Z.
    expect(resolveWallClockToUtc("2026-03-29T01:30").toISOString()).toBe("2026-03-29T00:30:00.000Z");
    expect(resolveWallClockToUtc("2026-03-29T03:30").toISOString()).toBe("2026-03-29T01:30:00.000Z");
  });

  it("rejects a string carrying an offset or bad shape (must be naive wall-clock)", () => {
    expect(isWallClock("2026-08-15T20:00")).toBe(true);
    expect(isWallClock("2026-08-15T20:00+02:00")).toBe(false);
    expect(isWallClock("2026-08-15 20:00")).toBe(false);
    expect(() => resolveWallClockToUtc("2026-08-15T20:00+02:00")).toThrow();
  });
});
