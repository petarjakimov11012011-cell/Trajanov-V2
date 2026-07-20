import type {Metadata} from 'next';
import {Rubik, Inter} from 'next/font/google';
import {notFound} from 'next/navigation';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {SITE_URL} from '@/lib/site';
import {ogImageUrl} from '@/lib/metadata';
import {siteJsonLd} from '@/lib/seo/site-jsonld';
import {JsonLd} from '@/components/seo/JsonLd';
import {SiteHeader} from '@/components/layout/SiteHeader';
import {SiteFooter} from '@/components/layout/SiteFooter';
import '../globals.css';

// Per-locale default title + description, from the message catalog (Meta namespace) — no metadata
// string is hardcoded here (D-2.01, Task 5). Each page overrides title/description with its own; this
// is the fallback. `metadataBase` anchors any relative metadata URL to the canonical origin (Task 6).
// A default Open Graph + Twitter card is set here too so any route that somehow omitted its own still
// shares a branded card (every content route sets its own via pageMetadata; Task 6).
export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Meta'});
  const isMk = locale === 'mk';
  const image = ogImageUrl(isMk ? 'mk' : 'en', t('siteTitle'));
  return {
    metadataBase: new URL(SITE_URL),
    title: t('siteTitle'),
    description: t('siteDescription'),
    openGraph: {
      type: 'website',
      siteName: 'Trajanov',
      locale: isMk ? 'mk_MK' : 'en_US',
      title: t('siteTitle'),
      description: t('siteDescription'),
      images: [{url: image, width: 1200, height: 630, alt: t('siteTitle')}],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('siteTitle'),
      description: t('siteDescription'),
      images: [image],
    },
  };
}

// Display face — boxy, confident. Cyrillic subset requested so the build
// fails loudly if the family ever drops MK glyph coverage (brand.md §4).
const rubik = Rubik({
  variable: '--font-rubik',
  subsets: ['latin', 'cyrillic'],
  weight: ['600', '700', '800'],
  display: 'swap',
});

// Body — neutral, tabular numerals for prices and the countdown.
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const tc = await getTranslations({locale, namespace: 'Common'});

  return (
    <html
      lang={locale}
      className={`${rubik.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="bg-ground text-foreground flex min-h-full flex-col">
        {/* Skip-to-content link (WCAG 2.2 — Task 8): visually hidden until focused, then the first
            Tab lands a keyboard user on it and jumps them past the header nav. */}
        <a
          href="#main-content"
          className="bg-surface text-foreground sr-only rounded-[var(--radius-md)] px-4 py-2 font-medium focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
        >
          {tc('skipToContent')}
        </a>
        {/* Site-wide Organization + WebSite structured data (Task 4) — no address, no logo, no
            SearchAction, no partner claim; sameAs is the one verified Instagram account. */}
        <JsonLd data={siteJsonLd()} />
        <NextIntlClientProvider>
          <SiteHeader />
          <main id="main-content" className="flex flex-1 flex-col">
            {children}
          </main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
