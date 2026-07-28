import { Resend } from "resend";
import { ORDER_FROM_ADDRESS } from "./order-notification";

// Contact-form email — Phase 2.23. The visitor's message IS delivered by email only (brief Decision 2:
// no contact_messages table while "Auto-expose new tables" is ON, D-1.07-14) — so UNLIKE the order
// sender, this result is NOT advisory. For an order the DB is the record and the email a side channel;
// here the email is the record. The caller (the contact action) must show failure when this fails and
// may show success ONLY on { sent: true } (brief Task 5, hard stop 4).
//
// Same construction as order-notification.ts otherwise: reads env at call time, never throws, bounds
// itself with the same 8s ceiling, and no `import "server-only"` so it stays unit-testable with a
// mocked Resend. Never log the visitor's name, email, or message (CLAUDE.md) — only reason codes.

/** Hard ceiling on the Resend call, mirroring the order sender's SEND_TIMEOUT_MS. */
const SEND_TIMEOUT_MS = 8000;

/** Fixed, greppable subject prefix so contact messages sort away from order notifications
 *  („Нова нарачка …") in the same inbox (brief Decision 3). */
export const CONTACT_SUBJECT_PREFIX = "[Контакт]";

export interface ContactMessage {
  name: string;
  email: string;
  /** Optional subject the visitor typed; null when left empty. */
  subject: string | null;
  message: string;
  /** The locale the visitor was on — so Vladimir knows which language to reply in. */
  locale: "mk" | "en";
}

export type ContactSendResult =
  | { sent: true }
  | { sent: false; reason: "unconfigured" | "send_error" | "timeout" | "exception" };

/**
 * Compose the contact email (subject + plain-text body). Pure — no env, no I/O — so it is trivially
 * testable. Plain text only: no HTML template, no tracking, nothing from brand.md (brief Task 5).
 * Callers pass ALREADY-VALIDATED input: the action rejects \r/\n and control characters in name,
 * email and subject before this runs, so the subject header cannot be injected.
 */
export function composeContactMessage(msg: ContactMessage): { subject: string; text: string } {
  const subject = `${CONTACT_SUBJECT_PREFIX} ${msg.subject ?? "Нова порака од сајтот"}`;

  const text = [
    "Нова порака од контакт-формата на сајтот.",
    "",
    `Име: ${msg.name}`,
    `Е-пошта: ${msg.email}`,
    `Наслов: ${msg.subject ?? "—"}`,
    `Јазик на страницата: ${msg.locale === "mk" ? "македонски" : "англиски"}`,
    "",
    "Порака:",
    msg.message,
    "",
    "Одговори директно на овој мејл — Reply-To е адресата на испраќачот.",
    "Пораката не е зачувана никаде на сајтот — овој мејл е единствениот запис.",
  ].join("\n");

  return { subject, text };
}

const TIMED_OUT = Symbol("contact-email-timeout");

/** Resolve `p`, or resolve to TIMED_OUT after `ms`, whichever is first — the order sender's helper,
 *  mirrored (it is deliberately not exported from order-notification.ts). */
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | typeof TIMED_OUT> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(TIMED_OUT), ms);
    if (typeof timer.unref === "function") timer.unref();
    p.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

/**
 * Send the visitor's message to ORDER_NOTIFICATION_EMAIL, from the brand's own ORDER_FROM_ADDRESS
 * (imported, never retyped — brief Decision 3), with the VISITOR's address as replyTo so Vladimir can
 * answer straight from his inbox. Never throws; the discriminated result decides what the visitor
 * sees. No PII in any log line — reason codes only.
 */
export async function sendContactMessage(msg: ContactMessage): Promise<ContactSendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_NOTIFICATION_EMAIL;

  if (!apiKey || !to) {
    // Unlike the order sender this is not a silent degrade: the caller will show the failure state.
    console.warn("[contact-email] RESEND_API_KEY/ORDER_NOTIFICATION_EMAIL not set — message not sent");
    return { sent: false, reason: "unconfigured" };
  }

  const { subject, text } = composeContactMessage(msg);

  try {
    const result = await withTimeout(
      new Resend(apiKey).emails.send({
        from: ORDER_FROM_ADDRESS,
        to,
        replyTo: msg.email,
        subject,
        text,
      }),
      SEND_TIMEOUT_MS,
    );

    if (result === TIMED_OUT) {
      console.error(`[contact-email] send timed out after ${SEND_TIMEOUT_MS}ms`);
      return { sent: false, reason: "timeout" };
    }
    if (result.error) {
      // Log the Resend error CODE + status only — never result.error.message, which can echo an
      // address (the same rule as the order sender).
      console.error(
        `[contact-email] Resend rejected (${result.error.name}, status ${result.error.statusCode ?? "?"})`,
      );
      return { sent: false, reason: "send_error" };
    }
    return { sent: true };
  } catch (err) {
    const name = err instanceof Error ? err.name : "unknown";
    console.error(`[contact-email] send threw (${name})`);
    return { sent: false, reason: "exception" };
  }
}
