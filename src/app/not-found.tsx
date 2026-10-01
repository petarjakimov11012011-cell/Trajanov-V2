import mk from '@/messages/mk.json';
import en from '@/messages/en.json';
import {rubik, inter} from './fonts';
import './globals.css';

// Root 404 fallback (Phase Y.11, Task 9). Reached only by a URL that never enters a locale — e.g. a
// path with a file extension the middleware does not match (`/missing.png`), where `[locale]` would
// otherwise be "missing.png" and its layout calls notFound(). With no locale to go on it is a full
// document in Macedonian (the default language) with the English directly under it, both read from
// the catalogs — no hardcoded copy. Next answers with HTTP 404 and adds `noindex` itself.
//
// Plain <a> links on purpose: there is no locale context here for the localized Link.
const ctaBase =
  'font-display inline-flex items-center justify-center rounded-[var(--radius-md)] px-5 py-3 font-bold transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ground';
const ctaPrimary = `${ctaBase} bg-mustard hover:bg-mustard-hover text-on-mustard`;
const ctaSecondary = `${ctaBase} border-border-strong text-foreground hover:border-foreground border bg-transparent`;

const VERSIONS = [
  {lang: 'mk', t: mk.NotFound, home: '/', catalog: '/katalog'},
  {lang: 'en', t: en.NotFound, home: '/en', catalog: '/en/catalog'},
] as const;

export default function RootNotFound() {
  return (
    <html lang="mk" className={`${rubik.variable} ${inter.variable} h-full antialiased`}>
      <body className="bg-ground text-foreground flex min-h-full flex-col">
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-12 px-4 py-16 text-center sm:px-6">
          <span className="text-eyebrow text-muted-foreground font-medium uppercase tracking-[0.14em]">
            {mk.NotFound.eyebrow}
          </span>
          {VERSIONS.map(({lang, t, home, catalog}, i) => (
            <section key={lang} lang={lang} className="flex flex-col items-center gap-4">
              {/* One h1 for the document: the Macedonian heading. The English one is an h2. */}
              {i === 0 ? (
                <h1 className="font-display text-h1 text-foreground max-w-xl font-extrabold text-balance">
                  {t.h1}
                </h1>
              ) : (
                <h2 className="font-display text-h2 text-foreground max-w-xl font-bold text-balance">
                  {t.h1}
                </h2>
              )}
              <p className="text-muted-foreground max-w-md text-balance">{t.body}</p>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <a href={catalog} className={ctaPrimary}>
                  {t.catalog}
                </a>
                <a href={home} className={ctaSecondary}>
                  {t.home}
                </a>
              </div>
            </section>
          ))}
        </main>
      </body>
    </html>
  );
}
