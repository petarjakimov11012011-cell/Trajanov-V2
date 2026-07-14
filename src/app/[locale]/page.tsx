import {useTranslations} from 'next-intl';

// Placeholder home so the scaffold builds and serves. Real home (countdown /
// live drop) is built in a later phase; no content is pulled from facts.md.
export default function HomePage() {
  const t = useTranslations('Home');

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">{t('title')}</h1>
      <p className="text-muted-foreground max-w-md text-lg">{t('tagline')}</p>
    </main>
  );
}
