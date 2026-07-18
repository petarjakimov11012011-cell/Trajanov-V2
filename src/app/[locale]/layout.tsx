import type {Metadata} from 'next';
import {Rubik, Inter} from 'next/font/google';
import {notFound} from 'next/navigation';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {SITE_URL} from '@/lib/site';
import {SiteHeader} from '@/components/layout/SiteHeader';
import {SiteFooter} from '@/components/layout/SiteFooter';
import '../globals.css';

// Per-locale default title + description, from the message catalog (Meta namespace) — no metadata
// string is hardcoded here (D-2.01, Task 5). Each page overrides title/description with its own; this
// is the fallback. `metadataBase` anchors any relative metadata URL to the canonical origin (Task 6).
export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Meta'});
  return {
    metadataBase: new URL(SITE_URL),
    title: t('siteTitle'),
    description: t('siteDescription'),
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

  return (
    <html
      lang={locale}
      className={`${rubik.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="bg-ground text-foreground flex min-h-full flex-col">
        <NextIntlClientProvider>
          <SiteHeader />
          <main className="flex flex-1 flex-col">{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
