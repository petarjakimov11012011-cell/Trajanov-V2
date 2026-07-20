import type {Metadata} from 'next';
import type {Locale} from 'next-intl';
import {useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {Countdown} from '@/components/drop/Countdown';
import {DropLiveBanner, DropEndedBanner} from '@/components/drop/DropBanner';
import {StockBadge} from '@/components/drop/StockBadge';
import {ProductCard} from '@/components/product/ProductCard';
import {BuyButton} from '@/components/product/BuyButton';
import {SizePicker} from '@/components/product/SizePicker';
import {CheckoutField} from '@/components/checkout/CheckoutField';
import {pageMetadata} from '@/lib/metadata';
import type {ProductView} from '@/types/drop';

// Styleguide is an internal review aid, not a customer surface, and is not localised (D-2.01-4). It
// still emits its own metadata + reciprocal hreflang so every route carries alternates (Task 6).
export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: Locale}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Meta'});
  // Internal review aid — noindex + Disallowed in robots (Task 2/3), never a customer surface.
  return pageMetadata({
    href: '/styleguide',
    locale,
    title: t('styleguideTitle'),
    description: t('styleguideDescription'),
    index: false,
  });
}

// Local sample products — the styleguide is a design reference and needs each card state on demand
// (in-stock / low / sold-out), which real drop data cannot guarantee. Null names/prices render the
// neutral slot + price placeholder, exactly as a data-less real product would.
const SAMPLE_PRODUCTS: ProductView[] = [
  {
    slug: 'sg-in-stock',
    index: 1,
    nameMk: null,
    nameEn: null,
    priceMkd: null,
    stock: 'in-stock',
    remaining: 12,
    sizes: [
      {variantId: 'sg-in-s', label: 'S', available: true},
      {variantId: 'sg-in-m', label: 'M', available: true},
      {variantId: 'sg-in-l', label: 'L', available: true},
      {variantId: 'sg-in-xl', label: 'XL', available: false},
    ],
  },
  {
    slug: 'sg-low',
    index: 2,
    nameMk: null,
    nameEn: null,
    priceMkd: null,
    stock: 'low',
    remaining: 2,
    sizes: [
      {variantId: 'sg-low-s', label: 'S', available: false},
      {variantId: 'sg-low-m', label: 'M', available: true},
      {variantId: 'sg-low-l', label: 'L', available: true},
      {variantId: 'sg-low-xl', label: 'XL', available: false},
    ],
  },
  {
    slug: 'sg-sold-out',
    index: 3,
    nameMk: null,
    nameEn: null,
    priceMkd: null,
    stock: 'sold-out',
    remaining: 0,
    sizes: [
      {variantId: 'sg-out-s', label: 'S', available: false},
      {variantId: 'sg-out-m', label: 'M', available: false},
      {variantId: 'sg-out-l', label: 'L', available: false},
      {variantId: 'sg-out-xl', label: 'XL', available: false},
    ],
  },
];

const SWATCHES: {name: string; varName: string; note: string}[] = [
  {name: 'ground', varName: '--color-ground', note: 'page'},
  {name: 'surface', varName: '--color-surface', note: 'cards'},
  {name: 'surface-2', varName: '--color-surface-2', note: 'fills'},
  {name: 'foreground', varName: '--color-foreground', note: '15.4:1'},
  {name: 'muted-fg', varName: '--color-muted-foreground', note: '7.9:1'},
  {name: 'mustard', varName: '--color-mustard', note: '9.0:1'},
  {name: 'mustard-hover', varName: '--color-mustard-hover', note: 'hover'},
  {name: 'accent', varName: '--color-accent', note: '4.6:1'},
  {name: 'soldout', varName: '--color-soldout', note: '5.3:1'},
  {name: 'error', varName: '--color-error', note: '7.5:1'},
  {name: 'border-strong', varName: '--color-border-strong', note: '3.6:1'},
  {name: 'focus-ring', varName: '--color-focus-ring', note: '11.6:1'},
];

function Section({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <section className="border-border flex flex-col gap-4 border-t pt-8">
      <h2 className="text-eyebrow text-muted-foreground uppercase tracking-[0.14em]">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  const t = useTranslations('Styleguide');

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-h1 text-foreground font-extrabold">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('intro')}</p>
      </div>

      <Section title={t('colors')}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {SWATCHES.map((s) => (
            <div key={s.name} className="flex flex-col gap-1.5">
              <div
                className="border-border h-16 w-full rounded-[var(--radius-md)] border"
                style={{backgroundColor: `var(${s.varName})`}}
              />
              <span className="text-foreground text-xs font-medium">{s.name}</span>
              <span className="text-muted-foreground tabular text-[0.7rem]">
                {s.note}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t('type')}>
        <div className="flex flex-col gap-3">
          <p className="font-display text-foreground text-4xl font-extrabold">
            Трајанов — Trajanov
          </p>
          <p className="font-display text-mustard text-3xl font-bold tracking-wide">
            ѓ ќ љ њ џ ѕ ж ч ш
          </p>
          <p className="text-muted-foreground max-w-xl">
            Rubik display · Inter body. Cyrillic checked at display size — native
            forms, not fallbacks.
          </p>
        </div>
      </Section>

      <Section title={t('countdown')}>
        <div className="bg-surface flex justify-center rounded-[var(--radius-lg)] p-6">
          <Countdown offsetMs={40_000} />
        </div>
      </Section>

      <Section title={t('dropBanner')}>
        <div className="flex flex-col gap-3">
          <DropLiveBanner remaining={7} />
          <DropEndedBanner />
        </div>
      </Section>

      <Section title={t('stockBadge')}>
        <div className="flex flex-wrap items-center gap-4">
          <StockBadge level="in-stock" />
          <StockBadge level="low" remaining={2} />
          <StockBadge level="sold-out" />
        </div>
      </Section>

      <Section title={t('productCard')}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {SAMPLE_PRODUCTS.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </Section>

      <Section title={t('buyButton')}>
        <div className="grid max-w-xl gap-3 sm:grid-cols-2">
          <BuyButton state="default" />
          <BuyButton state="loading" />
          <BuyButton state="disabled" />
          <BuyButton state="sold-out" />
        </div>
      </Section>

      <Section title={t('sizePicker')}>
        <SizePicker
          sizes={[
            {variantId: 'sg-s', label: 'S', available: true},
            {variantId: 'sg-m', label: 'M', available: true},
            {variantId: 'sg-l', label: 'L', available: true},
            {variantId: 'sg-xl', label: 'XL', available: false},
          ]}
          initial="M"
        />
      </Section>

      <Section title={t('field')}>
        <div className="grid max-w-xl gap-4 sm:grid-cols-2">
          <CheckoutField id="sg-default" name="d" label="Default" />
          <CheckoutField id="sg-error" name="e" label="Error" error="This field is required." />
          <CheckoutField id="sg-disabled" name="x" label="Disabled" disabled defaultValue="—" />
          <CheckoutField id="sg-note" name="n" label="Note" textarea />
        </div>
      </Section>
    </div>
  );
}
