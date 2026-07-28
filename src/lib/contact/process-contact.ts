import type { ContactMessage, ContactSendResult } from "@/lib/email/contact-message";

// The contact pipeline, as pure orchestration with injected dependencies — the process-order.ts
// convention: no Turnstile/Resend/next imports, so the load-bearing guarantees are UNIT-TESTABLE.
// Order of operations, no shortcuts (brief Task 4): Turnstile FIRST (fail closed — a bot never
// reaches validation or Resend), then validate + normalise, then send. The client's validation is
// UX only; THIS validation is the authority. The result is discriminated and the send result is NOT
// advisory: `sent: true` is returned ONLY when the sender confirmed delivery (hard stop 4).

export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** The locale the visitor was on. Anything but "en" normalises to "mk" (the default language). */
  locale: string;
}

/** Hard length caps, enforced server-side (brief Task 3). Over the cap is a rejection, never a
 *  silent truncation. The client mirrors these numbers for UX. */
export const CONTACT_CAPS = {
  name: 100,
  email: 200,
  subject: 150,
  message: 4000,
} as const;

export type ContactField = keyof typeof CONTACT_CAPS;

export type ContactResult =
  | { sent: true }
  | { sent: false; reason: "turnstile"; retry: boolean }
  | { sent: false; reason: "invalid"; field: ContactField }
  | { sent: false; reason: "send_failed" };

// name, email and subject reach EMAIL HEADERS (From-name, Reply-To, Subject), so any CR/LF or other
// control character is a header-injection hazard and is rejected outright — never stripped, because
// silently rewriting what the visitor typed hides an attack instead of refusing it.
const HEADER_UNSAFE = /[\u0000-\u001F\u007F]/;
// The message body may contain newlines (and tabs); every other control character is rejected.
const BODY_UNSAFE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
// Pragmatic email shape: one @, no whitespace, a dot in the domain. The mailbox's true validity is
// proven only by Vladimir's reply arriving — this just refuses obvious non-addresses. Exported so the
// client's UX validation uses the SAME shape — one source, no drift (the server stays the authority).
export const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ValidContact {
  name: string;
  email: string;
  subject: string | null;
  message: string;
  locale: "mk" | "en";
}

/**
 * Trim, enforce required + the length caps + the email shape, and reject header-unsafe input.
 * Returns the normalised message, or the first offending field. Pure and exported for unit tests.
 */
export function validateContact(
  input: ContactInput,
): { ok: true; value: ValidContact } | { ok: false; field: ContactField } {
  const name = (input.name ?? "").trim();
  const email = (input.email ?? "").trim();
  const subject = (input.subject ?? "").trim();
  const message = (input.message ?? "").trim();

  if (!name || name.length > CONTACT_CAPS.name || HEADER_UNSAFE.test(name)) {
    return { ok: false, field: "name" };
  }
  if (
    !email ||
    email.length > CONTACT_CAPS.email ||
    HEADER_UNSAFE.test(email) ||
    !EMAIL_SHAPE.test(email)
  ) {
    return { ok: false, field: "email" };
  }
  // Subject is optional — but when given it must fit the cap and stay header-safe.
  if (subject.length > CONTACT_CAPS.subject || HEADER_UNSAFE.test(subject)) {
    return { ok: false, field: "subject" };
  }
  if (!message || message.length > CONTACT_CAPS.message || BODY_UNSAFE.test(message)) {
    return { ok: false, field: "message" };
  }

  return {
    ok: true,
    value: {
      name,
      email,
      subject: subject || null,
      message,
      locale: input.locale === "en" ? "en" : "mk",
    },
  };
}

export interface ContactDeps {
  /** Server-side Turnstile Siteverify. `retryable` drives whether the visitor is invited to retry. */
  verifyTurnstile: (token: string) => Promise<{ success: boolean; retryable: boolean }>;
  /** The email sender — the ONLY delivery channel (brief Decision 2). Its result decides the outcome. */
  send: (msg: ContactMessage) => Promise<ContactSendResult>;
}

/** Gate the send: Turnstile → validate → send, failing closed at every step. */
export async function processContact(
  token: string,
  input: ContactInput,
  deps: ContactDeps,
): Promise<ContactResult> {
  // 1. Turnstile — before validation or Resend. A missing token is an immediate, retryable refusal.
  if (!token) return { sent: false, reason: "turnstile", retry: true };
  const verdict = await deps.verifyTurnstile(token);
  if (!verdict.success) return { sent: false, reason: "turnstile", retry: verdict.retryable };

  // 2. Validate + normalise. The server is the authority; the client's checks are UX only.
  const validated = validateContact(input);
  if (!validated.ok) return { sent: false, reason: "invalid", field: validated.field };

  // 3. Send. `sent: true` ONLY on a confirmed send — the email is the record (hard stop 4).
  const result = await deps.send(validated.value);
  if (!result.sent) return { sent: false, reason: "send_failed" };
  return { sent: true };
}
