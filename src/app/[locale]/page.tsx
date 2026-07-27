import type {Metadata} from 'next';
import type {Locale} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {HomeExperience} from '@/components/home/HomeExperience';
import {HomeFaq} from '@/components/home/HomeFaq';
import {HomeShowcase} from '@/components/home/HomeShowcase';
import {DevPreviewSwitch} from '@/components/system/DevPreviewSwitch';
import {getActiveDropView, parsePreviewState} from '@/lib/drop/state';
import {pageMetadata} from '@/lib/metadata';

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
  return pageMetadata({
    href: '/',
    locale,
    title: t('homeTitle'),
    description: t('homeDescription'),
  });
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
      {/* Same server-computed `view` as the hero — no second query. It self-hides during a live
          drop (and with no drop / no photographed product): src/lib/showcase.ts returns no slides,
          so the buyable grid stays the whole page in the hour that matters (Phase 2.21). */}
      <HomeShowcase view={view} />
      {/* Static content — renders identically in all three drop states and in preview; takes no props
          from `view` (Phase 2.11). Sits under the hero, above the dev-only preview switch. */}
      <HomeFaq />
      <DevPreviewSwitch current={previewState} />
    </>
  );
}
