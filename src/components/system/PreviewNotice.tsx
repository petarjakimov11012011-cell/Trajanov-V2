import {useTranslations} from 'next-intl';
import {Info} from 'lucide-react';

// One honest banner on every data-driven page: the product data is placeholder,
// pending Vladimir. Keeps the design-system pass from reading as finished data.
export function PreviewNotice() {
  const t = useTranslations('Placeholder');
  return (
    <div className="border-border bg-surface text-muted-foreground flex items-start gap-2 rounded-[var(--radius-md)] border px-4 py-3 text-small">
      <Info className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
      <p>{t('notice')}</p>
    </div>
  );
}
