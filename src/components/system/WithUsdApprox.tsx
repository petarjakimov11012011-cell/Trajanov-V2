import type {Locale} from 'next-intl';
import {formatUsdApprox} from '@/lib/format';

// A denar price plus its approximate US-dollar reference, EN only (Phase Y.09, D-Y.09-4).
//
// The MKD figure is the price and the amount paid, so it stays exactly as the caller styled it — same
// type, weight and position. The dollar figure follows it: muted, at the `text-small` token, regular
// weight, so it is never larger or heavier than the price at any call site (the card's price is itself
// text-small semibold; the product page and the showcase use text-price). The two sit on one line where
// they fit and the dollar figure wraps below where they don't; `whitespace-nowrap` keeps "≈ $22" whole.
//
// On MK (formatUsdApprox → null) this returns the price element UNTOUCHED — no wrapper — so the MK
// markup is byte-identical to what it was before Y.09.
export function WithUsdApprox({
  amountMkd,
  locale,
  children,
}: {
  amountMkd: number;
  locale: Locale;
  children: React.ReactNode;
}) {
  const usd = formatUsdApprox(amountMkd, locale);
  if (!usd) return children;
  return (
    <span className="flex flex-wrap items-baseline gap-x-2">
      {children}
      <span className="text-muted-foreground text-small whitespace-nowrap font-normal">{usd}</span>
    </span>
  );
}
