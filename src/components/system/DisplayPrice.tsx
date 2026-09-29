import type {Locale} from 'next-intl';
import {formatMkd, formatUsdApprox} from '@/lib/format';

// The product price as a visitor sees it in their locale (Phase Y.10, D-Y.10-2/3/5). Renamed from
// `WithUsdApprox` (Y.09, D-Y.09-8): on EN the dollar figure no longer sits WITH the denar price, it IS
// the displayed price, so the old name would mislead.
//
// EN → "≈ $22" (formatUsdApprox) in the caller's own price classes — the same type size, weight,
// colour and `tabular` the MKD figure had at that call site. The "≈" always stays: it is a conversion
// at a hand-updated rate (src/config/currency.ts), not a dollar price (D-Y.10-3). The customer still
// pays the courier in denars; the EN product page states that amount under the price (AmountDue).
//
// MK → the denar price in the same span, so the MK markup is byte-identical to what each call site
// rendered on `main` before Y.10 (`<span class="…">1.199 ден</span>`). MK never shows a dollar figure.
export function DisplayPrice({
  amountMkd,
  currency,
  locale,
  className,
}: {
  amountMkd: number;
  currency: string;
  locale: Locale;
  className: string;
}) {
  return (
    <span className={className}>
      {formatUsdApprox(amountMkd, locale) ?? formatMkd(amountMkd, currency, locale)}
    </span>
  );
}
