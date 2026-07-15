'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {Minus, Plus, X} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/utils';
import {Placeholder} from '@/components/system/Placeholder';

const MAX_UNITS = 2; // Hard cap: max 2 units per order (CLAUDE.md — COD abuse).
const pad2 = (n: number) => String(n).padStart(2, '0');

interface Line {
  id: string;
  index: number;
  size: string;
  qty: number;
}

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
      className={cn(
        'border-border-strong text-foreground inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] border transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
        disabled
          ? 'text-muted-foreground cursor-not-allowed opacity-50'
          : 'hover:border-foreground',
      )}
    >
      {children}
    </button>
  );
}

export function CartView({initial}: {initial: Line[]}) {
  const t = useTranslations('Cart');
  const tp = useTranslations('Placeholder');
  const [lines, setLines] = useState<Line[]>(initial);

  const totalUnits = lines.reduce((n, l) => n + l.qty, 0);
  const atCap = totalUnits >= MAX_UNITS;

  const setQty = (id: string, delta: number) =>
    setLines((prev) =>
      prev.map((l) =>
        l.id === id ? {...l, qty: Math.max(1, l.qty + delta)} : l,
      ),
    );
  const remove = (id: string) =>
    setLines((prev) => prev.filter((l) => l.id !== id));

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
      {/* lines */}
      <ul className="flex flex-col divide-y divide-[var(--color-border)]">
        {lines.map((l) => (
          <li key={l.id} className="flex gap-4 py-4">
            <div
              className="bg-surface-2 h-20 w-16 shrink-0 rounded-[var(--radius-md)]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(135deg, color-mix(in srgb, var(--color-border) 60%, transparent) 0 1px, transparent 1px 12px)',
              }}
              aria-hidden
            />
            <div className="flex flex-1 flex-col gap-1">
              <h3 className="font-display text-foreground font-semibold">
                {tp('productName')} {pad2(l.index)}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t('size')}: {l.size}
              </p>
              <div className="mt-1">
                <Placeholder>{tp('price')}</Placeholder>
              </div>
            </div>
            <div className="flex flex-col items-end justify-between">
              <button
                type="button"
                aria-label={t('remove')}
                onClick={() => remove(l.id)}
                className="text-muted-foreground hover:text-foreground transition-colors duration-[var(--motion-fast)]"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2">
                <IconBtn
                  label="−"
                  disabled={l.qty <= 1}
                  onClick={() => setQty(l.id, -1)}
                >
                  <Minus className="h-4 w-4" />
                </IconBtn>
                <span className="tabular text-foreground w-5 text-center font-semibold">
                  {l.qty}
                </span>
                <IconBtn label="+" disabled={atCap} onClick={() => setQty(l.id, +1)}>
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
          <p className="border-border-strong bg-mustard-tint-6 text-foreground rounded-[var(--radius-md)] border px-3 py-2 text-sm">
            {t('capNotice')}
          </p>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t('subtotal')}</span>
          <Placeholder>{tp('price')}</Placeholder>
        </div>
        <div className="flex items-center justify-between text-sm">
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
