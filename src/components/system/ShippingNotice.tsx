import {useTranslations} from 'next-intl';
import {Truck} from 'lucide-react';
import {cn} from '@/lib/utils';

// The MK-only shipping statement, from ONE shared message key (`Common.shippingNotice`) in BOTH the
// product buy panel and checkout, in both locales (D-2.01, Task 7). The claim traces to facts.md §7
// ("Shipping — North Macedonia only", VERIFIED). The EN copy is unambiguous that we do NOT deliver
// outside North Macedonia — a foreign visitor placing a cash-on-delivery order to an address nobody can
// reach is a real, cheap-to-prevent failure, and the footer alone was not preventing it.
//
// Styled from brand.md tokens, matching the existing PreviewNotice / COD notice boxes in the 1.02
// handover — a deliberate notice, not a redesign.
export function ShippingNotice({className}: {className?: string}) {
  const t = useTranslations('Common');
  return (
    <div
      className={cn(
        'border-border bg-surface text-muted-foreground flex items-start gap-2 rounded-[var(--radius-md)] border px-4 py-3 text-small',
        className,
      )}
    >
      <Truck className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
      <p>{t('shippingNotice')}</p>
    </div>
  );
}
