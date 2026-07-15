import type {Metadata} from 'next';
import {Rubik, Inter} from 'next/font/google';
import {notFound} from 'next/navigation';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {routing} from '@/i18n/routing';
import {SiteHeader} from '@/components/layout/SiteHeader';
import {SiteFooter} from '@/components/layout/SiteFooter';
import '../globals.css';

// Placeholder metadata for the design system. Real, localised metadata +
// hreflang + OG land in Phase 2.01.
export const metadata: Metadata = {
  title: 'Trajanov',
  description: 'Trajanov',
};

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
