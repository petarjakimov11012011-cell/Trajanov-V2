// Formatting helpers. Kept tiny and dependency-free.

import type {Locale} from 'next-intl';
import {MKD_PER_USD} from '@/config/currency';

// MKD is the price and the amount the customer pays the courier, in both locales. MK groups thousands
// with a dot (1.199), EN with a comma (1,199); the currency LABEL comes from the catalog (D-2.01-8).
// Since Y.09 the EN locale ALSO shows an approximate US-dollar figure (D-Y.09-4, D-Y.10-2) — a guide at
// a fixed, hand-updated rate (src/config/currency.ts), never a quote and never the amount charged. MK
// shows MKD only.
//
// Grouping is done BY HAND, not with toLocaleString / Intl (Y.11, Task 8). ICU data differs by runtime:
// Node prints "1.199" for mk-MK, but a browser without Macedonian data prints "1,199" or "1199" — so a
// client component (the Home showcase) rendered one figure on the server and another while hydrating.
// Whole numbers and a fixed separator per locale are all a price here needs.
const GROUP_SEPARATOR: Record<string, string> = {mk: '.', en: ','};

/** Whole number with a thousands separator, independent of the runtime's locale data. */
function groupThousands(value: number, separator: string): string {
  const sign = value < 0 ? '-' : '';
  const digits = String(Math.abs(Math.trunc(value)));
  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

/**
 * Whole MKD with the given (already localised) currency label, grouped for the locale.
 *   formatMkd(1199, "ден", "mk") → "1.199 ден"
 *   formatMkd(1199, "MKD", "en") → "1,199 MKD"
 * The currency label comes from the message catalog (`Common.currency`); this only handles the number.
 * An unknown locale gets Macedonian grouping — MK is the default language.
 */
export function formatMkd(amount: number, currency: string, locale: Locale): string {
  return `${groupThousands(amount, GROUP_SEPARATOR[locale] ?? GROUP_SEPARATOR.mk)} ${currency}`;
}

/**
 * The approximate US-dollar reference for an MKD amount — EN only (D-Y.09-4).
 *   formatUsdApprox(1199, "en") → "≈ $22"
 *   formatUsdApprox(1199, "mk") → null   (the MK site never shows a dollar figure)
 * Whole dollars, rounded half-up, at MKD_PER_USD. Display only: nothing charged is ever computed here.
 */
export function formatUsdApprox(amountMkd: number, locale: Locale): string | null {
  if (locale !== 'en') return null;
  const dollars = Math.round(amountMkd / MKD_PER_USD);
  return `≈ $${groupThousands(dollars, GROUP_SEPARATOR.en)}`;
}

/**
 * One inline string for prose that interpolates a cost (`{cost}` in the catalogs).
 *   formatMkdWithApproxUsd(200, "MKD", "en") → "200 MKD (≈ $4)"
 *   formatMkdWithApproxUsd(200, "ден", "mk") → "200 ден"
 * Price displays (cards, product page, showcase) render the two figures as separate elements instead,
 * so the dollar figure can be styled quieter than the price.
 */
export function formatMkdWithApproxUsd(amountMkd: number, currency: string, locale: Locale): string {
  const mkd = formatMkd(amountMkd, currency, locale);
  const usd = formatUsdApprox(amountMkd, locale);
  return usd ? `${mkd} (${usd})` : mkd;
}
