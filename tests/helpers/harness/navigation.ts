// Stand-in for `@/i18n/navigation` in the page-render harness (Phase Y.11). `Link` renders a plain <a>
// whose href is built from the REAL routing table (src/i18n/routing.ts) — MK unprefixed, EN under
// `/en`, localised slugs — so the HTML carries the URLs production emits. (next-intl's own navigation
// build imports `next/navigation` in a way plain Node ESM cannot resolve outside Next, so the path is
// computed here from the same `pathnames` map.) Router hooks are inert: there is no router in a test.
import { createElement, type ReactNode } from "react";
import { routing } from "../../../src/i18n/routing";
import { intlState, type TestLocale } from "./intl-state";

type Href = string | { pathname: string; params?: Record<string, string> };

export function getPathname({ href, locale }: { href: Href; locale: string }): string {
  const internal = typeof href === "string" ? href : href.pathname;
  const params = typeof href === "string" ? {} : (href.params ?? {});
  const entry = (routing.pathnames as Record<string, string | Record<string, string>>)[internal];
  let path = entry === undefined ? internal : typeof entry === "string" ? entry : entry[locale];
  for (const [key, value] of Object.entries(params)) path = path.replace(`[${key}]`, value);
  if (locale === routing.defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export function Link({
  href,
  locale,
  children,
  ...rest
}: {
  href: Href;
  locale?: string;
  children?: ReactNode;
  [key: string]: unknown;
}) {
  const path = getPathname({ href, locale: (locale ?? intlState.locale) as TestLocale });
  return createElement("a", { ...rest, href: path }, children);
}

export function usePathname() {
  return "/";
}

export function useRouter() {
  return { push() {}, replace() {}, refresh() {}, prefetch() {}, back() {}, forward() {} };
}

export function redirect(): never {
  throw new Error("redirect() is not expected in a page-render test");
}
