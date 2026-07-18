// Formatting helpers. Kept tiny and dependency-free.

import type {Locale} from 'next-intl';

// Locale → BCP-47 tag for number grouping. MK groups thousands with a dot (1.199), EN with a comma
// (1,199). The AMOUNT and the CURRENCY are the same in both locales — the price is MKD, always; only
// the grouping and the currency LABEL differ (D-2.01, Task 8). Never a currency conversion.
const NUMBER_LOCALE: Record<string, string> = {mk: 'mk-MK', en: 'en-US'};

/**
 * Whole MKD with the given (already localised) currency label, grouped for the locale.
 *   formatMkd(1199, "ден", "mk") → "1.199 ден"
 *   formatMkd(1199, "MKD", "en") → "1,199 MKD"
 * The currency label comes from the message catalog (`Common.currency`); this only handles the number.
 */
export function formatMkd(amount: number, currency: string, locale: Locale): string {
  const tag = NUMBER_LOCALE[locale] ?? 'mk-MK';
  return `${amount.toLocaleString(tag)} ${currency}`;
}
