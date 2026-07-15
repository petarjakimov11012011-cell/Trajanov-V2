'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {cn} from '@/lib/utils';

export type BuyState = 'default' | 'loading' | 'disabled' | 'sold-out';

const base =
  'font-display inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] px-5 py-3 text-base font-bold transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ground';

/**
 * Buy button — the six handover states.
 *  default | (hover / focus are CSS) | loading | disabled (pre-drop) | sold-out
 * Pass `state` to force one. Pass `onClick` to wire a real add-to-cart (the AddToCartPanel drives the
 * `loading` state itself). With no `onClick`, `default` runs a short fake loading transition on click
 * so the styleguide demo feels real.
 */
export function BuyButton({
  state = 'default',
  onClick,
  className,
}: {
  state?: BuyState;
  onClick?: () => void;
  className?: string;
}) {
  const t = useTranslations('Buy');
  const [busy, setBusy] = useState(false);
  const effective: BuyState = busy ? 'loading' : state;

  if (effective === 'disabled') {
    return (
      <button
        type="button"
        disabled
        className={cn(base, 'bg-surface-2 text-muted-foreground cursor-not-allowed', className)}
      >
        {t('comingSoon')}
      </button>
    );
  }

  if (effective === 'sold-out') {
    return (
      <button
        type="button"
        disabled
        aria-disabled
        className={cn(
          base,
          'text-soldout border-soldout cursor-not-allowed border bg-transparent',
          className,
        )}
      >
        {t('soldOut')}
      </button>
    );
  }

  if (effective === 'loading') {
    return (
      <button
        type="button"
        disabled
        aria-busy
        className={cn(base, 'bg-mustard text-on-mustard cursor-wait', className)}
      >
        <span
          className="border-on-mustard h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
          aria-hidden
        />
        {t('adding')}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={
        onClick ??
        (() => {
          // Demo fallback (styleguide): no real cart wired, so fake a short loading transition.
          setBusy(true);
          setTimeout(() => setBusy(false), 1200);
        })
      }
      className={cn(base, 'bg-mustard hover:bg-mustard-hover text-on-mustard', className)}
    >
      {t('add')}
    </button>
  );
}
