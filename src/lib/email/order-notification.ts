import { Resend } from "resend";

// Order-notification email — Phase Z.01. The moment a real order lands, Vladimir gets one email so he
// can phone the customer to confirm. It is a BEST-EFFORT SIDE CHANNEL, never the record: the database
// is the truth (D-0-5, Plan §8). A missing key, a Resend outage, a timeout, or a thrown error must
// never fail, roll back, or meaningfully delay the order — sendOrderNotification NEVER throws and
// bounds its own duration; the caller (the order path) treats its result as advisory.
//
// NO `import "server-only"` here on purpose: this module is unit-tested with a mocked Resend (never the
// real API), and `server-only` throws the moment it is imported outside a React Server build. It is
// only ever imported by the "use server" order action and by tests — it is never reachable from a
// client component, so the API key never ships to a browser. It reads env at call time, not load time.

/** From-address stays Resend's shared sender until `trajanov.com` is bought + verified (D-Z.01-2). */
export const ORDER_FROM_ADDRESS = "onboarding@resend.dev";

/** Hard ceiling on the Resend call so a hung request can never stall the customer's order response. */
const SEND_TIMEOUT_MS = 8000;

export interface OrderNotificationLine {
  /** Product name (MK preferred), or its slug when unnamed; null only if the DB lookup failed entirely. */
  productName: string | null;
  /** Variant size, or null if the DB lookup failed. */
  size: string | null;
  quantity: number;
}

export interface OrderNotification {
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes: string | null;
  lines: OrderNotificationLine[];
}

export type OrderNotificationResult =
  | { delivered: true }
  | { delivered: false; reason: "unconfigured" | "send_error" | "timeout" | "exception" };

/**
 * Compose the internal MK order-notification email (subject + plain-text body). Pure — no env, no I/O —
 * so it is trivially testable. This email goes only to Vladimir; it is an operations email, NOT part of
 * the site's next-intl UI catalogs.
 */
export function composeOrderNotification(order: OrderNotification): { subject: string; text: string } {
  const subject = `Нова нарачка ${order.orderNumber} — Trajanov`;

  const items = order.lines
    .map((l) => {
      const name = l.productName ?? "Производ (без назив)";
      const size = l.size ?? "непозната";
      return `• ${name} — величина ${size} — ${l.quantity} бр.`;
    })
    .join("\n");

  const note = order.notes && order.notes.trim() ? order.notes.trim() : "—";

  const text = [
    "Нова нарачка на Trajanov.",
    "",
    `Број на нарачка: ${order.orderNumber}`,
    "",
    "Нарачано:",
    items,
    "",
    "Купувач:",
    `  Име: ${order.customerName}`,
    `  Телефон: ${order.phone}`,
    `  Град: ${order.city}`,
    `  Адреса: ${order.address}`,
    `  Белешка: ${note}`,
    "",
    "Плаќање со готовина при преземање. Јави се на купувачот за да ја потврдиш нарачката.",
    "Целосните податоци се во Supabase — базата е записот, овој мејл е само известување.",
  ].join("\n");

  return { subject, text };
}

const TIMED_OUT = Symbol("order-email-timeout");

/** Resolve `p`, or resolve to TIMED_OUT after `ms`, whichever is first. A rejection of `p` rejects the
 *  wrapper (so the caller's try/catch sees it). The timer is unref'd/cleared so it never keeps a
 *  serverless function (or a test) alive. */
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
 * Send the order-notification email. Best-effort and non-blocking on the order (Plan §8): it reads
 * RESEND_API_KEY + ORDER_NOTIFICATION_EMAIL from env, and if either is unset it logs a warning and
 * degrades gracefully (the order still succeeds). Any Resend error, timeout, or thrown exception is
 * caught and logged WITHOUT PII — only the order number (not a name, phone, or address) ever reaches a
 * log line (CLAUDE.md). This function never throws.
 */
export async function sendOrderNotification(order: OrderNotification): Promise<OrderNotificationResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_NOTIFICATION_EMAIL;

  if (!apiKey || !to) {
    // Not an error: Z.01 can ship and be tested before the operator sets the keys (they land at 1.08).
    console.warn(
      `[order-email] ${order.orderNumber}: RESEND_API_KEY/ORDER_NOTIFICATION_EMAIL not set — notification skipped`,
    );
    return { delivered: false, reason: "unconfigured" };
  }

  const { subject, text } = composeOrderNotification(order);

  try {
    const result = await withTimeout(
      new Resend(apiKey).emails.send({ from: ORDER_FROM_ADDRESS, to, subject, text }),
      SEND_TIMEOUT_MS,
    );

    if (result === TIMED_OUT) {
      console.error(`[order-email] ${order.orderNumber}: send timed out after ${SEND_TIMEOUT_MS}ms`);
      return { delivered: false, reason: "timeout" };
    }
    if (result.error) {
      // Log the Resend error CODE + status only — never result.error.message, which can echo the
      // recipient address. No customer PII in any log line.
      console.error(
        `[order-email] ${order.orderNumber}: Resend rejected (${result.error.name}, status ${result.error.statusCode ?? "?"})`,
      );
      return { delivered: false, reason: "send_error" };
    }
    return { delivered: true };
  } catch (err) {
    const name = err instanceof Error ? err.name : "unknown";
    console.error(`[order-email] ${order.orderNumber}: send threw (${name})`);
    return { delivered: false, reason: "exception" };
  }
}
