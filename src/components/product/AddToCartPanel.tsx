'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {useCart} from '@/components/cart/cart-store';
import {SizePicker} from './SizePicker';
import {BuyButton, type BuyState} from './BuyButton';
import type {SizeOption} from '@/types/drop';

// Wires the product page's buy cluster to the cart (brief Task 4). Owns the selected variant and
// coordinates the SizePicker (available / selected / unavailable) with the BuyButton (the six handover
// states — no new ones). A size must be chosen before Add does anything; the whole-order cap is
// enforced here too. Nothing here touches the database — the cart is a suggestion, create_order() is
// the fact. Returns a fragment so the parent's `gap-5` column spacing is unchanged.

type Feedback = {kind: 'chooseSize' | 'cap' | 'added'} | null;

export function AddToCartPanel({
  sizes,
  dropSlug,
  productSlug,
  productIndex,
  buyState,
}: {
  sizes: SizeOption[];
  dropSlug: string;
  productSlug: string;
  productIndex: number;
  buyState: BuyState;
}) {
  const t = useTranslations('Product');
  const tb = useTranslations('Buy');
  const tp = useTranslations('Placeholder');
  const {add, atCap} = useCart();
  const [selected, setSelected] = useState<SizeOption | undefined>();
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  function handleAdd() {
    // Only the live/default state adds. sold-out and pre-drop render disabled buttons, so their onClick
    // never fires — this guard is defence-in-depth.
    if (buyState !== 'default') return;
    if (atCap) {
      setFeedback({kind: 'cap'});
      return;
    }
    if (!selected) {
      setFeedback({kind: 'chooseSize'});
      return;
    }
    setBusy(true);
    add({variantId: selected.variantId, dropSlug, productSlug, productIndex, size: selected.label});
    // Short loading flash so the handover's `loading` state is exercised on the real add, then confirm.
    window.setTimeout(() => {
      setBusy(false);
      setFeedback({kind: 'added'});
    }, 400);
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <span className="text-small text-muted-foreground font-medium">{t('size')}</span>
        <SizePicker
          sizes={sizes}
          selected={selected?.label}
          onSelect={(size) => {
            setSelected(size);
            if (feedback?.kind === 'chooseSize') setFeedback(null);
          }}
        />
        <span className="text-muted-foreground text-xs">{tp('sizesSample')}</span>
      </div>

      <div className="flex flex-col gap-2">
        <BuyButton state={busy ? 'loading' : buyState} onClick={handleAdd} />
        <p className="text-small min-h-[1.25rem]" aria-live="polite">
          {feedback?.kind === 'added' ? (
            <span className="text-mustard">
              {tb('added')}{' '}
              <Link
                href="/cart"
                className="hover:text-mustard-hover font-semibold underline underline-offset-4"
              >
                {tb('viewCart')}
              </Link>
            </span>
          ) : feedback?.kind === 'chooseSize' ? (
            <span className="text-foreground">{t('chooseSize')}</span>
          ) : feedback?.kind === 'cap' ? (
            <span className="text-foreground">{t('oneUnitLimit')}</span>
          ) : null}
        </p>
      </div>

      <p className="text-muted-foreground text-small">{t('oneUnitLimit')}</p>
    </>
  );
}
