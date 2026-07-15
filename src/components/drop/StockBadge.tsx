import {useTranslations} from 'next-intl';
import {cn} from '@/lib/utils';
import type {StockLevel} from '@/types/drop';

// Stock badge — never decorative.
//  • in-stock: a quiet muted line with a mustard dot (or nothing when hidden)
//  • low:      accent(red) fill, near-black label — urgency
//  • sold-out: soldout fill, near-black label — permanent
export function StockBadge({
  level,
  remaining,
  className,
}: {
  level: StockLevel;
  remaining?: number;
  className?: string;
}) {
  const t = useTranslations('Stock');

  if (level === 'in-stock') {
    return (
      <span
        className={cn(
          'text-muted-foreground inline-flex items-center gap-1.5 text-sm',
          className,
        )}
      >
        <span className="bg-mustard h-1.5 w-1.5 rounded-full" aria-hidden />
        {t('inStock')}
      </span>
    );
  }

  if (level === 'low') {
    return (
      <span
        className={cn(
          'bg-accent text-on-accent inline-flex items-center rounded-[var(--radius-sm)] px-2 py-0.5 text-xs font-bold uppercase tracking-wide tabular',
          className,
        )}
      >
        {t('low', {count: remaining ?? 0})}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'bg-soldout text-on-accent inline-flex items-center rounded-[var(--radius-sm)] px-2 py-0.5 text-xs font-bold uppercase tracking-wide',
        className,
      )}
    >
      {t('soldOut')}
    </span>
  );
}
