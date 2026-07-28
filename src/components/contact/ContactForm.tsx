'use client';

import {useRef, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {ShieldCheck} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Link} from '@/i18n/navigation';
import {CheckoutField} from '@/components/checkout/CheckoutField';
import {Turnstile, type TurnstileHandle} from '@/components/checkout/Turnstile';
import {sendContact} from '@/lib/contact/actions';
import {CONTACT_CAPS, EMAIL_SHAPE, type ContactResult} from '@/lib/contact/process-contact';
import {EMAIL, PHONE_DISPLAY} from '@/lib/social';

type Field = 'name' | 'email' | 'subject' | 'message';
type Errors = Partial<Record<Field, string>>;

// The contact form (Phase 2.23) — modelled on CheckoutForm: same submit shape, same FRESH Turnstile
// token minted at submit (D-1.04-8), same error/success rendering discipline. Client validation here
// is UX only; the server action re-validates independently and is the authority. Success renders ONLY
// on {sent: true} — a send Resend did not confirm shows the failure state pointing at the phone and
// the email (hard stop 4), because the email IS the record (brief Decision 2).
export function ContactForm({siteKey}: {siteKey: string}) {
  const t = useTranslations('Contact');
  const tc = useTranslations('Checkout');
  const to = useTranslations('Order');
  const locale = useLocale();
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ContactResult | null>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);

  // Mirrors CheckoutForm.validate(): required-empty → errorRequired; a malformed email → errorEmail;
  // over a cap → errorTooLong. The caps come from CONTACT_CAPS so client and server can never drift.
  function validate(form: HTMLFormElement): Errors {
    const data = new FormData(form);
    const next: Errors = {};
    for (const key of ['name', 'email', 'message'] as const) {
      if (!String(data.get(key) ?? '').trim()) next[key] = tc('errorRequired');
    }
    const email = String(data.get('email') ?? '').trim();
    if (email && !EMAIL_SHAPE.test(email)) next.email = t('errorEmail');
    for (const key of ['name', 'email', 'subject', 'message'] as const) {
      if (!next[key] && String(data.get(key) ?? '').trim().length > CONTACT_CAPS[key]) {
        next[key] = t('errorTooLong', {max: CONTACT_CAPS[key]});
      }
    }
    return next;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult(null);
    const form = e.currentTarget;
    const next = validate(form);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const data = new FormData(form);
    setSubmitting(true);

    // Mint a fresh token now, at submit — not at page load (D-1.04-8).
    let token: string;
    try {
      token = await turnstileRef.current!.execute();
    } catch {
      setSubmitting(false);
      setResult({sent: false, reason: 'turnstile', retry: true});
      return;
    }

    // A rejected action (network drop, server crash) must never strand the form on "Sending…" —
    // nothing was sent, so the truthful state is the failure message pointing at phone + email.
    let res: ContactResult;
    try {
      res = await sendContact({
        token,
        name: String(data.get('name') ?? ''),
        email: String(data.get('email') ?? ''),
        subject: String(data.get('subject') ?? ''),
        message: String(data.get('message') ?? ''),
        locale,
      });
    } catch {
      res = {sent: false, reason: 'send_failed'};
    }
    setSubmitting(false);
    setResult(res);
    if (res.sent) form.reset();
  }

  const message = resultMessage(result, {
    success: t('success'),
    sendFailed: t('sendFailed', {phone: PHONE_DISPLAY, email: EMAIL}),
    turnstileFailed: to('turnstileFailed'),
    genericError: to('genericError'),
  });

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
      <p className="text-small text-muted-foreground">{t('requiredNote')}</p>

      <CheckoutField id="contact-name" name="name" label={t('formName')} required autoComplete="name" error={errors.name} disabled={submitting} />
      <CheckoutField id="contact-email" name="email" label={t('formEmail')} type="email" required autoComplete="email" error={errors.email} disabled={submitting} />
      <CheckoutField id="contact-subject" name="subject" label={t('formSubject')} error={errors.subject} disabled={submitting} />
      <CheckoutField id="contact-message" name="message" label={t('formMessage')} textarea required error={errors.message} disabled={submitting} />

      {/* Turnstile — same placement and "verifying" treatment as checkout (brief Task 3). The widget
          is invisible until it needs interaction; the check runs on submit. */}
      <div className="border-border bg-surface flex items-center gap-3 rounded-[var(--radius-md)] border px-4 py-3" aria-live="polite">
        {submitting ? (
          <>
            <span className="border-mustard h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" aria-hidden />
            <span className="text-muted-foreground text-small">{tc('verifying')}…</span>
          </>
        ) : (
          <>
            <ShieldCheck className="text-mustard h-5 w-5" strokeWidth={1.75} aria-hidden />
            <span className="text-muted-foreground text-small">{to('protected')}</span>
          </>
        )}
      </div>
      <Turnstile ref={turnstileRef} siteKey={siteKey} />

      {/* Left-aligned, not full width (brief Task 3) — otherwise the checkout button classes. */}
      <button
        type="submit"
        disabled={submitting}
        className={cn(
          'font-display inline-flex items-center justify-center self-start rounded-[var(--radius-md)] px-5 py-3 font-bold transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ground',
          submitting
            ? 'bg-surface-2 text-muted-foreground cursor-not-allowed'
            : 'bg-mustard hover:bg-mustard-hover text-on-mustard',
        )}
      >
        {submitting ? t('sending') : t('send')}
      </button>

      {/* Consent line — the locale-aware Privacy link (brief Decision 9), never a hand-typed href. */}
      <p className="text-small text-muted-foreground">
        {t.rich('consent', {
          link: (chunks) => (
            <Link
              href="/privacy"
              className="text-foreground underline underline-offset-4 transition-colors duration-[var(--motion-fast)] hover:text-mustard"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>

      {message && (
        <p
          className={cn(
            'text-small',
            message.tone === 'ok' && 'text-mustard',
            message.tone === 'error' && 'text-error',
          )}
          role="status"
        >
          {message.text}
        </p>
      )}
    </form>
  );
}

function resultMessage(
  res: ContactResult | null,
  texts: {success: string; sendFailed: string; turnstileFailed: string; genericError: string},
): {text: string; tone: 'ok' | 'error'} | null {
  if (!res) return null;
  if (res.sent) return {text: texts.success, tone: 'ok'};
  switch (res.reason) {
    case 'turnstile':
      return {text: texts.turnstileFailed, tone: 'error'};
    case 'invalid':
      // The client mirrors the server's checks, so this is the rare residue (e.g. a pasted control
      // character). Generic, and nothing was sent.
      return {text: texts.genericError, tone: 'error'};
    case 'send_failed':
      // The one state that matters most: NOT delivered, and the visitor is told exactly where to
      // go instead — the phone and the email (brief Task 9.5).
      return {text: texts.sendFailed, tone: 'error'};
  }
}
