import type {Metadata} from 'next';
import type {Locale} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {HomeExperience} from '@/components/home/HomeExperience';
import {DevPreviewSwitch} from '@/components/system/DevPreviewSwitch';
import {getActiveDropView, parsePreviewState} from '@/lib/drop/state';
import {localeAlternates} from '@/lib/metadata';

// Drop state is computed on the server from the DB on every request — never cached, never client-decided
// (D-1.04-9). A CDN-frozen home page would still say "countdown" after the drop opened.
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: Locale}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Meta'});
  return {
    title: t('homeTitle'),
    description: t('homeDescription'),
    alternates: localeAlternates('/', locale),
  };
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{preview?: string}>;
}) {
  const {preview} = await searchParams;
  const previewState = parsePreviewState(preview); // undefined in production
  const view = await getActiveDropView({preview: previewState});

  return (
    <>
      <HomeExperience view={view} />
      <DevPreviewSwitch current={previewState} />
    </>
  );
}
