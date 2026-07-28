"use server";

import { verifyTurnstile, isRetryableTurnstile } from "@/lib/turnstile/verify";
import { sendContactMessage } from "@/lib/email/contact-message";
import { processContact, type ContactInput, type ContactResult } from "./process-contact";
// NOTE: no `export type` re-exports here. Next's server-actions loader compiles EVERY export of a
// "use server" module into an action reference, and a type-only export (erased by TypeScript) then
// crashes the module at runtime with a ReferenceError. Types are imported from ./process-contact.

// The contact Server Action (Phase 2.23, Task 4) — the thin wrapper over the unit-tested pipeline,
// the placeOrder/processOrder convention. The form calls this with a FRESH Turnstile token minted at
// submit (D-1.04-8). Pipeline: Siteverify → validate → send, failing closed at every step; the
// send result decides the outcome, because the email IS the record (brief Decision 2, hard stop 4).
// Nothing here touches Supabase, and no PII — not the visitor's email, not the message — is logged.
// Deliberately NOT the order rate limiter: writing contact attempts into order_attempts could lock a
// real customer out of ordering on drop day (brief Decision 4). Turnstile is the bot gate; the
// length caps bound the damage.

export async function sendContact(
  input: ContactInput & { token: string },
): Promise<ContactResult> {
  return processContact(input.token, input, {
    verifyTurnstile: async (token) => {
      const r = await verifyTurnstile(token);
      // timeout-or-duplicate & friends invite a retry rather than accusing the visitor of being a
      // bot (isRetryableTurnstile, D-1.04-8).
      return { success: r.success, retryable: isRetryableTurnstile(r.errorCodes) };
    },
    send: sendContactMessage,
  });
}
