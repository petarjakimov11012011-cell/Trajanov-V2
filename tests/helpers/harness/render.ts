// Page-render harness (Phase Y.11). Renders a real page component — async server components included —
// to static HTML with `react-dom/static`'s `prerender`, inside the real NextIntlClientProvider and the
// real catalogs. Test files wire the mocks with:
//
//   vi.mock("server-only", () => ({}));
//   vi.mock("next-intl/server", () => import("../helpers/harness/next-intl-server"));
//   vi.mock("@/i18n/navigation", () => import("../helpers/harness/navigation"));
//   vi.mock("@/lib/drop/state", () => import("../helpers/harness/drop-state"));
//
// What this proves is what the SERVER renders. Client effects (timers, the countdown's clock) do not
// run; the browser check in the render matrix covers those.
import { createElement, type ComponentType, type ReactNode } from "react";
import { prerender } from "react-dom/static";
import { NextIntlClientProvider } from "next-intl";
import { intlState, messagesFor, type TestLocale } from "./intl-state";

// The provider's props type requires `children` as a prop, which the lint rule forbids in
// createElement; typed here so the child can be passed as the third argument (display-price.test.ts).
const IntlProvider = NextIntlClientProvider as ComponentType<{
  locale: string;
  messages: ReturnType<typeof messagesFor>;
  timeZone: string;
  children?: ReactNode;
}>;

export async function renderToHtml(node: ReactNode, locale: TestLocale): Promise<string> {
  intlState.locale = locale;
  const tree = createElement(
    IntlProvider,
    { locale, messages: messagesFor(locale), timeZone: "UTC" },
    node,
  );
  const errors: unknown[] = [];
  const { prelude } = await prerender(tree, { onError: (e) => void errors.push(e) });
  if (errors.length > 0) throw errors[0];
  const reader = prelude.getReader();
  const decoder = new TextDecoder();
  let html = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    html += decoder.decode(value, { stream: true });
  }
  return html + decoder.decode();
}

/** Render a Next page component with its `params` / `searchParams` props. */
export async function renderPage(
  Page: (props: never) => unknown,
  locale: TestLocale,
  params: Record<string, string> = {},
): Promise<string> {
  const props = {
    params: Promise.resolve({ locale, ...params }),
    searchParams: Promise.resolve({}),
  };
  return renderToHtml(createElement(Page as unknown as ComponentType<typeof props>, props), locale);
}

/** Visible text only: tags stripped, JSON-LD and other scripts removed, entities for quotes decoded. */
export function visibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
