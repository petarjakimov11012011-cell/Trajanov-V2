// Formatting helpers. Kept tiny and dependency-free.

import type {Locale} from 'next-intl';
import {MKD_PER_USD} from '@/config/currency';

// MKD is the price and the amount the customer pays the courier, in both locales. Locale → BCP-47 tag
// for number grouping only: MK groups thousands with a dot (1.199), EN with a comma (1,199); the currency
// LABEL comes from the catalog (D-2.01-8). Since Y.09 the EN locale ALSO shows an approximate US-dollar
// reference next to the denar price (D-Y.09-4) — a guide at a fixed, hand-updated rate
// (src/config/currency.ts), never a quote and never the amount charged. MK shows MKD only.
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

/**
 * The approximate US-dollar reference for an MKD amount — EN only (D-Y.09-4).
 *   formatUsdApprox(1199, "en") → "≈ $22"
 *   formatUsdApprox(1199, "mk") → null   (the MK site never shows a dollar figure)
 * Whole dollars, rounded half-up, at MKD_PER_USD. Display only: nothing charged is ever computed here.
 */
export function formatUsdApprox(amountMkd: number, locale: Locale): string | null {
  if (locale !== 'en') return null;
  const dollars = Math.round(amountMkd / MKD_PER_USD);
  return `≈ $${dollars.toLocaleString('en-US')}`;
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
