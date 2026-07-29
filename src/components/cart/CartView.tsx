'use client';

import {useTranslations} from 'next-intl';
import {Minus, Plus, X} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/utils';
import {Placeholder} from '@/components/system/Placeholder';
import {useCart} from './cart-store';

const pad2 = (n: number) => String(n).padStart(2, '0');

function IconBtn({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      // 44×44 for real, not a pseudo-element (D-2.25-9): these controls have a visible border, so the
      // box IS the design — a hit area that did not match it would be a lie about where to press.
      // The cart is where a customer commits money on a phone; a 32px stepper next to a 32px stepper
      // is the worst place on the site to be stingy about the target.
      className={cn(
        'border-border-strong text-foreground inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] border transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
        disabled
          ? 'text-muted-foreground cursor-not-allowed opacity-50'
          : 'hover:border-foreground',
      )}
    >
      {children}
    </button>
  );
}

// The cart, wired to real client cart state (brief Task 5). Steppers, the cap notice, and the empty
// state are the 1.02 handover §7 — connected here, not redesigned. Prices are still OWED (facts.md §7),
// so the row/summary prices remain placeholders; the cart computes no total and holds no price.
export function CartView() {
  const t = useTranslations('Cart');
  const tp = useTranslations('Placeholder');
  const {cart, hydrated, setQty, remove, atCap} = useCart();
  const lines = cart.items;

  // Before the sessionStorage read has run, the cart is unknown. Hold the space rather than flash the
  // empty state and then the items.
  if (!hydrated) {
    return <div className="min-h-[40vh]" aria-busy aria-hidden />;
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-muted-foreground text-lg">{t('empty')}</p>
        <Link
          href="/catalog"
          className="text-mustard hover:text-mustard-hover font-display font-semibold underline-offset-4 hover:underline"
        >
          {t('backToDrop')}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
      {/* lines. `min-w-0` on the GRID ITEM is the one that actually unlocks the row (D-2.25-12): a
          grid item defaults to `min-width: auto`, so this list refused to size below its own
          content and held the single-column track at 322px inside a 288px container — the page
          scrolled sideways at 320px. Measured with it: track 288, row 288, document scrollWidth 320,
          no horizontal scroll. The summary panel beside it measures 192.7px of min-content against
          the same 288px, so it has headroom and is left alone. */}
      <ul className="flex min-w-0 flex-col divide-y divide-[var(--color-border)]">
        {lines.map((l) => (
          // `flex-wrap` is the adaptation, not decoration (D-2.25-12). Three things share the row: a
          // 64px thumbnail, the details, and the controls — and the controls are now 180px wide
          // (a 44px remove, a 12px gap, a 124px stepper cluster). ON ONE LINE at 320px that would
          // leave the details 68px, and the price `[PLACEHOLDER: …]` pill's 102px min-content would
          // sit across the minus button — that is the state this wrap EXISTS TO PREVENT, not the
          // state that ships. What ships at 320px, measured: the controls drop to their own
          // right-aligned line and the details get **208px**, nothing clipped. `basis-40` is the
          // content-driven flip point — the controls stay beside the details for as long as the
          // details can hold 160px, which is every width from roughly a large phone up.
          <li key={l.variantId} className="flex flex-wrap gap-4 py-4">
            <div
              className="bg-surface-2 h-20 w-16 shrink-0 rounded-[var(--radius-md)]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(135deg, color-mix(in srgb, var(--color-border) 60%, transparent) 0 1px, transparent 1px 12px)',
              }}
              aria-hidden
            />
            {/* `min-w-0` is load-bearing here too: a flex item defaults to `min-width: auto` and
                refuses to shrink below its content, and the names this column holds today are the
                placeholder "Производ 01" — a real product name from Y.01 is longer. `break-words`
                covers the other half, a single long word. `grow basis-40` (not `flex-1`, whose basis
                is 0) is what gives the wrap above something to measure against. */}
            <div className="flex min-w-0 grow basis-40 flex-col gap-1">
              <h3 className="font-display text-foreground font-semibold break-words">
                {tp('productName')} {pad2(l.productIndex)}
              </h3>
              <p className="text-muted-foreground text-small">
                {t('size')}: {l.size}
              </p>
              <div className="mt-1">
                <Placeholder>{tp('price')}</Placeholder>
              </div>
            </div>
            {/* Controls. Beside the details when they fit, on their own right-aligned line when they
                do not (`ml-auto` does the right-aligning in the wrapped case; it is inert otherwise).
                From `sm:` this is the shipped stack — remove at the top, steppers at the bottom —
                unchanged. Below `sm:` they sit on one horizontal line, which is the only shape that
                fits a wrapped row without doubling its height. */}
            {/* `sm:gap-4` is a safety gap, not spacing taste (D-2.25-16). With both controls at 44px
                the column's content is exactly as tall as the row, so `justify-between` had nothing
                left to distribute and the **destructive remove button ended up flush on top of the
                `+` stepper** — same x, remove's bottom edge at 250.9 and `+`'s top edge at 250.9,
                measured at 768px. Before this phase they were 16px and 32px tall in an 88px column,
                ~40px apart. A minimum gap restores the separation the growth ate. */}
            <div className="ml-auto flex items-center gap-3 sm:flex-col sm:items-end sm:justify-between sm:gap-4">
              {/* Remove — 44×44 for real (D-2.25-9). It is the one destructive control in the cart
                  and it used to be a bare 16px glyph with no box at all. */}
              <button
                type="button"
                aria-label={t('remove')}
                onClick={() => remove(l.variantId)}
                className="text-muted-foreground hover:text-foreground inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2">
                <IconBtn
                  label={t('decrease')}
                  disabled={l.qty <= 1}
                  onClick={() => setQty(l.variantId, l.qty - 1)}
                >
                  <Minus className="h-4 w-4" />
                </IconBtn>
                <span className="tabular text-foreground w-5 text-center font-semibold">
                  {l.qty}
                </span>
                <IconBtn
                  label={t('increase')}
                  disabled={atCap}
                  onClick={() => setQty(l.variantId, l.qty + 1)}
                >
                  <Plus className="h-4 w-4" />
                </IconBtn>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* summary */}
      <div className="bg-surface flex flex-col gap-4 rounded-[var(--radius-lg)] p-5 lg:sticky lg:top-20">
        {atCap && (
          <p className="border-border-strong bg-mustard-tint-6 text-foreground rounded-[var(--radius-md)] border px-3 py-2 text-small">
            {t('capNotice')}
          </p>
        )}
        <div className="flex items-center justify-between text-small">
          <span className="text-muted-foreground">{t('subtotal')}</span>
          <Placeholder>{tp('price')}</Placeholder>
        </div>
        <div className="flex items-center justify-between text-small">
          <span className="text-muted-foreground">{t('shipping')}</span>
          <span className="text-muted-foreground">{t('shippingValue')}</span>
        </div>
        <div className="border-border flex items-center justify-between border-t pt-4">
          <span className="font-display text-foreground font-bold">{t('total')}</span>
          <Placeholder>{tp('price')}</Placeholder>
        </div>
        <p className="text-muted-foreground text-small">{t('codNote')}</p>
        <Link
          href="/checkout"
          className="bg-mustard hover:bg-mustard-hover text-on-mustard font-display inline-flex w-full items-center justify-center rounded-[var(--radius-md)] px-5 py-3 font-bold transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ground"
        >
          {t('checkout')}
        </Link>
      </div>
    </div>
  );
}
