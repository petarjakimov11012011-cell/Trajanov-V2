import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createTranslator } from "next-intl";
import { renderToHtml, visibleText } from "../helpers/harness/render";
import { timerText } from "@/components/drop/Countdown";
import { DropLiveBanner } from "@/components/drop/DropBanner";
import mk from "../../src/messages/mk.json";
import en from "../../src/messages/en.json";

// Plurals on the countdown and the live banner (Phase Y.11, Task 11). The labels under the digits and
// the screen-reader text agree with the number: 1 DAY / 2 DAYS, 1 ДЕН / 2 ДЕНА, 1 ЧАС / 2 ЧАСА, and
// „Преостанува 1" / „Преостануваат 2". The aria text uses full words, not the visual abbreviations.

const t = {
  mk: createTranslator({ locale: "mk", messages: mk, namespace: "Drop" }),
  en: createTranslator({ locale: "en", messages: en, namespace: "Drop" }),
};

const parts = (n: number) => ({ days: n, hours: n, minutes: n, seconds: n });

describe("visual labels under the digits", () => {
  it("EN: 1 DAY / 2 DAYS, 1 HR / 2 HRS", () => {
    expect(timerText(t.en, parts(1)).days).toBe("DAY");
    expect(timerText(t.en, parts(2)).days).toBe("DAYS");
    expect(timerText(t.en, parts(1)).hours).toBe("HR");
    expect(timerText(t.en, parts(2)).hours).toBe("HRS");
  });

  it("MK: 1 ДЕН / 2 ДЕНА, 1 ЧАС / 2 ЧАСА", () => {
    expect(timerText(t.mk, parts(1)).days).toBe("ДЕН");
    expect(timerText(t.mk, parts(2)).days).toBe("ДЕНА");
    expect(timerText(t.mk, parts(1)).hours).toBe("ЧАС");
    expect(timerText(t.mk, parts(2)).hours).toBe("ЧАСА");
  });

  it("MK follows Macedonian plural rules past 10: 21 ДЕН, 11 ДЕНА", () => {
    expect(timerText(t.mk, { ...parts(0), days: 21 }).days).toBe("ДЕН");
    expect(timerText(t.mk, { ...parts(0), days: 11 }).days).toBe("ДЕНА");
  });

  it("minutes and seconds keep their abbreviations", () => {
    expect(timerText(t.en, parts(1)).minutes).toBe("MIN");
    expect(timerText(t.mk, parts(2)).seconds).toBe("СЕК");
  });
});

describe("screen-reader text — full words, agreeing with each number", () => {
  it("EN singular and plural", () => {
    expect(timerText(t.en, parts(1)).aria).toBe("1 day, 1 hour, 1 minute, 1 second");
    expect(timerText(t.en, parts(2)).aria).toBe("2 days, 2 hours, 2 minutes, 2 seconds");
  });

  it("MK singular and plural", () => {
    expect(timerText(t.mk, parts(1)).aria).toBe("1 ден, 1 час, 1 минута, 1 секунда");
    expect(timerText(t.mk, parts(2)).aria).toBe("2 дена, 2 часа, 2 минути, 2 секунди");
  });

  it("the Countdown component takes its labels and aria text from timerText", () => {
    const src = readFileSync(resolve(__dirname, "../../src/components/drop/Countdown.tsx"), "utf8");
    expect(src).toMatch(/timerText\(t, \{days, hours, minutes, seconds\}\)/);
    expect(src).not.toMatch(/t\('days'\)|t\('hours'\)/);
  });
});

describe("live banner remaining count", () => {
  it.each([
    ["mk", 1, "Преостанува 1"],
    ["mk", 2, "Преостануваат 2"],
    ["en", 1, "1 left"],
    ["en", 2, "2 left"],
  ] as const)("%s %i → %s", async (locale, remaining, expected) => {
    const html = await renderToHtml(createElement(DropLiveBanner, { remaining }), locale);
    expect(visibleText(html)).toContain(expected);
  });
});
