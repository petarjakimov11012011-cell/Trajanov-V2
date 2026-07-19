import type {ReactNode} from 'react';

// Shared shell for the three legal pages — Terms, Privacy, Shipping & Returns (2.03). Same editorial
// shape as /about + /contact (max-w-2xl, eyebrow → h1 → intro → sections → last-updated), built from
// brand.md tokens only, no hardcoded colour or size. Presentational and non-async: each page does its
// own translation + date formatting and passes finished strings, so this component stays trivial and
// carries no facts.md claim of its own.
export function LegalPage({
  eyebrow,
  h1,
  intro,
  lastUpdated,
  children,
}: {
  eyebrow: string;
  h1: string;
  intro: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-4 py-16 sm:px-6">
      <header className="flex flex-col gap-4">
        <p className="text-eyebrow text-muted-foreground uppercase tracking-[0.14em]">
          {eyebrow}
        </p>
        <h1 className="font-display text-h1 text-foreground font-extrabold text-balance">
          {h1}
        </h1>
        <p className="text-muted-foreground text-body">{intro}</p>
      </header>

      <div className="flex flex-col gap-8">{children}</div>

      <p className="text-small text-muted-foreground border-border border-t pt-6">
        {lastUpdated}
      </p>
    </div>
  );
}

// One heading + its body block. Heading uses the same quiet eyebrow treatment as About's section
// headings so the legal pages read as part of the same site, not a bolt-on.
export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-eyebrow text-muted-foreground uppercase tracking-[0.14em]">
        {heading}
      </h2>
      <div className="text-body text-foreground flex flex-col gap-3">{children}</div>
    </section>
  );
}
