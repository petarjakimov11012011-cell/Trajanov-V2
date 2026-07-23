import {getTranslations} from 'next-intl/server';
import {Plus} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {JsonLd} from '@/components/seo/JsonLd';
import {FAQ_GROUPS} from '@/lib/faq';
import {faqJsonLd} from '@/lib/seo/faq-jsonld';

// Home FAQ (Phase 2.11) — a SERVER component: no 'use client', no state, no effects, no handlers.
// Eight questions in three static group labels (D-2.11-2: no interactive tab row), rendered as native
// <details>/<summary> disclosures (D-2.11-3) so keyboard + screen-reader behaviour is correct with zero
// JS, the section stays server-rendered, and every answer stays in the DOM for crawlers. The shared
// `name="home-faq"` gives native one-open-at-a-time behaviour where the browser supports it.
//
// The visible copy and the FAQPage JSON-LD are both built by iterating the SAME key list
// (src/lib/faq.ts), so the rendered answer and the structured answer cannot drift (D-2.11-5). It renders
// identically in all three drop states and in preview — it takes no `view` prop.
export async function HomeFaq() {
  const t = await getTranslations('Faq');

  return (
    <section
      aria-labelledby="home-faq-heading"
      className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="mx-auto max-w-3xl">
        {/* MUST be h2, never h1: Home already renders exactly one h1 in all three drop states, and the
            a11y gate forbids a second one or a skipped level. Matches the hero's heading treatment. */}
        <h2
          id="home-faq-heading"
          className="font-display text-h2 text-foreground text-balance text-center font-bold"
        >
          {t('h2')}
        </h2>

        <div className="mt-10 flex flex-col gap-8">
          {FAQ_GROUPS.map((group) => (
            <div key={group.labelKey} className="flex flex-col gap-3">
              {/* Quiet eyebrow label — heading order stays h1 → h2 → h3 with no skips. */}
              <h3 className="text-muted-foreground text-eyebrow uppercase tracking-[0.14em]">
                {t(group.labelKey)}
              </h3>
              {group.items.map((item) => (
                <details key={item.questionKey} name="home-faq" className="faq-item">
                  <summary>
                    <span>{t(item.questionKey)}</span>
                    {/* Decoration only — <summary> already announces its own expanded state. */}
                    <Plus className="faq-icon" aria-hidden="true" />
                  </summary>
                  <div className="faq-answer">
                    <p>{t(item.answerKey)}</p>
                  </div>
                </details>
              ))}
            </div>
          ))}
        </div>

        {/* No email / phone here — the footer and Contact already carry them; a fourth copy is a fourth
            thing to keep in sync. This is a localised link to /contact, styled like Home.aboutLink. */}
        <p className="text-muted-foreground mt-10 text-center text-small">
          {t('moreQuestion')}{' '}
          <Link
            href="/contact"
            className="text-muted-foreground hover:text-foreground underline-offset-4 transition-colors duration-[var(--motion-fast)] hover:underline"
          >
            {t('moreLink')} →
          </Link>
        </p>
      </div>

      {/* FAQPage structured data, built from the same keys as the visible copy (D-2.11-5). */}
      <JsonLd data={faqJsonLd((key) => t(key))} />
    </section>
  );
}
