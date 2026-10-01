// Shared state for the page-render harness (Phase Y.11). The mocked `next-intl/server` and
// `@/i18n/navigation` read the locale from here, so a test sets it once per render.
import mk from "../../../src/messages/mk.json";
import en from "../../../src/messages/en.json";

export type TestLocale = "mk" | "en";

export const intlState: { locale: TestLocale } = { locale: "mk" };

export function messagesFor(locale: TestLocale) {
  return locale === "mk" ? mk : en;
}
