import {useTranslations} from 'next-intl';
import {Countdown} from '@/components/drop/Countdown';
import {DropLiveBanner, DropEndedBanner} from '@/components/drop/DropBanner';
import {StockBadge} from '@/components/drop/StockBadge';
import {ProductCard} from '@/components/product/ProductCard';
import {BuyButton} from '@/components/product/BuyButton';
import {SizePicker} from '@/components/product/SizePicker';
import {CheckoutField} from '@/components/checkout/CheckoutField';
import {DEMO_PRODUCTS} from '@/lib/demo';

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
          {DEMO_PRODUCTS.slice(0, 3).map((p) => (
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
            {label: 'S', available: true},
            {label: 'M', available: true},
            {label: 'L', available: true},
            {label: 'XL', available: false},
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
