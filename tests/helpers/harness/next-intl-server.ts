// Stand-in for `next-intl/server` in the page-render harness (Phase Y.11). The real module needs the
// Next request context; this one resolves the same catalogs through next-intl's own `createTranslator`,
// so every server-rendered string is the real message, formatted by the real ICU path.
import { createFormatter, createTranslator } from "next-intl";
import { intlState, messagesFor, type TestLocale } from "./intl-state";

type Arg = string | { locale?: string; namespace?: string } | undefined;

export async function getTranslations(arg?: Arg) {
  const namespace = typeof arg === "string" ? arg : arg?.namespace;
  const locale = ((typeof arg === "object" && arg?.locale) || intlState.locale) as TestLocale;
  return createTranslator({
    locale,
    messages: messagesFor(locale),
    // Cast: the translator's namespace type is a union of literal keys; tests pass plain strings.
    namespace: namespace as never,
    timeZone: "UTC",
  });
}

export async function getFormatter(arg?: { locale?: string }) {
  return createFormatter({ locale: (arg?.locale as TestLocale) ?? intlState.locale, timeZone: "UTC" });
}

export async function getLocale() {
  return intlState.locale;
}

export async function getMessages(arg?: { locale?: string }) {
  return messagesFor(((arg?.locale as TestLocale) ?? intlState.locale));
}

export function setRequestLocale() {}

export function getRequestConfig<T>(fn: T): T {
  return fn;
}
