import type {Metadata} from 'next';
import type {Locale} from 'next-intl';
import {setRequestLocale, getTranslations, getFormatter} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {pageMetadata} from '@/lib/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: Locale}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Meta'});
  return pageMetadata({
    href: '/about',
    locale,
    title: t('aboutTitle'),
    description: t('aboutDescription'),
  });
}

// About is a static page: no drop state, no DB read, nothing to recompute per request. It does NOT
// carry the drop pages' `force-dynamic` (D-1.05, Task 3). setRequestLocale enables static rendering
// per locale under next-intl.

// Press coverage — sourced verbatim from facts.md §4 (all five VERIFIED 2026-07-15). URLs are copied
// exactly; Cultural Chat's path is Cyrillic and its fbclid stays stripped. This is DATA, like the
// phone/IG constants — not translatable copy. It renders as a bare list of links: no count, no
// adjective, no logos, no characterisation of the coverage (D-1.05-5).
const PRESS = [
  {
    name: 'Трн.мк',
    url: 'https://trn.mk/vladimir-trajanov-pobednik-kreativen-den-eam-konkurs-dizajn-maica/',
    date: '2026-06-12',
  },
  {
    name: 'Струмица Денес',
    url: 'https://strumicadenes.mk/opstini/strumica/vladimir-trajanov-od-strumica-pobednik-na-konkursot-na-kreativen-den-i-eam/',
    date: '2026-06-12',
  },
  {
    name: 'Бизнис Вести',
    url: 'https://biznisvesti.mk/vladimir-trajanov-od-strumitsa-pobednik-na-konkursot-na-kreativen-den-i-eam/',
    date: '2026-06-11',
  },
  {
    name: 'Cultural Chat',
    url: 'https://culturalchat.org/mk/владимир-трајанов-од-струмица-победн/',
    date: '2026-06-11',
  },
  {
    name: 'Република',
    url: 'https://republika.mk/zhivot/moda-i-ubavina/kreativen-den-odrzha-mladinski-kreativen-konkurs-za-dizajn-na-maicza-najdobar-beshe-vladimir-trajanov-od-strumicza/',
    date: '2026-06-12',
  },
] as const;

export default async function AboutPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('About');
  const format = await getFormatter();
  // Empty on MK (the quote is the original) — non-empty only on EN, where it marks the translation
  // (D-1.05-6). Rendered only when present, so MK shows no note.
  const quoteNote = t('quoteNote');

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-16 sm:px-6">
      <header className="flex flex-col gap-4">
        <p className="text-eyebrow text-muted-foreground uppercase tracking-[0.14em]">
          {t('eyebrow')}
        </p>
        <h1 className="font-display text-h1 text-foreground font-extrabold text-balance">
          {t('h1')}
        </h1>
      </header>

      <div className="text-body text-foreground flex flex-col gap-4">
        <p>{t('body1')}</p>
        <p>{t('body2')}</p>
        <p>{t('body3')}</p>
      </div>

      {/* The quote text is rendered in the page's own language — the MK original on MK, the marked EN
          translation on EN (D-1.05-6). `lang` states that explicitly for assistive tech (Task 8). */}
      <blockquote lang={locale} className="border-mustard flex flex-col gap-3 border-l-2 pl-6">
        <p className="font-display text-h2 text-foreground font-semibold text-balance">
          {t('quote')}
        </p>
        <cite className="text-small text-muted-foreground not-italic">
          — {t('quoteAttribution')}
          {quoteNote ? (
            <span className="text-muted-foreground"> · {quoteNote}</span>
          ) : null}
        </cite>
      </blockquote>

      <section className="flex flex-col gap-3">
        <h2 className="text-eyebrow text-muted-foreground uppercase tracking-[0.14em]">
          {t('pressHeading')}
        </h2>
        <ul className="flex flex-col">
          {PRESS.map((p) => (
            <li key={p.url}>
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex flex-wrap items-baseline gap-x-2 py-2 transition-colors duration-[var(--motion-fast)]"
              >
                <span className="text-foreground group-hover:text-mustard underline-offset-4 group-hover:underline">
                  {p.name}
                </span>
                <span className="text-small text-muted-foreground tabular">
                  {format.dateTime(new Date(p.date), {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    timeZone: 'UTC',
                  })}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div>
        <Link
          href="/catalog"
          className="text-mustard hover:text-mustard-hover font-display font-semibold underline-offset-4 transition-colors duration-[var(--motion-fast)] hover:underline"
        >
          {t('toCatalog')} →
        </Link>
      </div>
    </div>
  );
}
