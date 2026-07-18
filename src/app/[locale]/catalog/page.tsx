import type {Metadata} from 'next';
import type {Locale} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {ProductCard} from '@/components/product/ProductCard';
import {PreviewNotice} from '@/components/system/PreviewNotice';
import {DevPreviewSwitch} from '@/components/system/DevPreviewSwitch';
import {getActiveDropView, parsePreviewState} from '@/lib/drop/state';
import {localeAlternates} from '@/lib/metadata';

// Catalog grid — the active drop's pieces, read from the DB on every request (D-1.04-9).
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: Locale}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Meta'});
  return {
    title: t('catalogTitle'),
    description: t('catalogDescription'),
    alternates: localeAlternates('/catalog', locale),
  };
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{preview?: string}>;
}) {
  const {preview} = await searchParams;
  const previewState = parsePreviewState(preview);
  const view = await getActiveDropView({preview: previewState});
  const t = await getTranslations('Catalog');

  const subtitle =
    view === null
      ? t('empty')
      : view.state === 'live'
        ? t('live')
        : view.state === 'ended'
          ? t('ended')
          : t('countdownIntro');

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6">
      <PreviewNotice />
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-h1 text-foreground font-extrabold">
          {t('title')}
        </h1>
        <p className="text-muted-foreground max-w-xl">{subtitle}</p>
      </div>
      {view && view.products.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {view.products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
      <DevPreviewSwitch current={previewState} />
    </div>
  );
}
