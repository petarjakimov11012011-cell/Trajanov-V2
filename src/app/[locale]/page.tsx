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
      {/* Same server-computed `view` as the hero — no second query. Renders in every drop state,
          `live` included (D-2.25-23, owner 2026-07-29 — reversing the 2.21 live-hide), named per
          state on its heading: „Ова спуштање" while live, „Последно спуштање" otherwise
          (D-2.25-22). Self-hides only with no drop / no photographed product (src/lib/showcase.ts
          returns no slides). During live it sits BELOW the buyable grid — the grid keeps the top
          of the page in the hour that matters. */}
      <HomeShowcase view={view} />
      {/* Static content — renders identically in all three drop states and in preview; takes no props
          from `view` (Phase 2.11). Sits under the hero, above the dev-only preview switch. */}
      <HomeFaq />
      <DevPreviewSwitch current={previewState} />
    </>
  );
}
