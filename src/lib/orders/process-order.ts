import { isOrderErrorCode, type OrderErrorCode } from "./order-errors";

// The order pipeline, as pure orchestration with injected dependencies (Task 6). Keeping it dependency-
// free (no Turnstile/Supabase/next imports) makes the load-bearing guarantee UNIT-TESTABLE: that a
// request with no token or a failed Turnstile is rejected BEFORE create_order() is ever reached
// (a DoD item). The server action (actions.ts) wires the real dependencies to this.

export interface OrderInput {
  dropSlug: string;
  customerName: string;
  phone: string;
  phoneNormalized: string;
  address: string;
  city: string;
  notes?: string | null;
  items: { variantId: string; quantity: number }[];
}

export interface ProcessDeps {
  /** Server-side Turnstile Siteverify. `retryable` drives whether the customer is invited to try again. */
  verifyTurnstile: (token: string) => Promise<{ success: boolean; retryable: boolean }>;
  /** Records the attempt and returns whether it is under the IP rate limit. */
  checkRateLimit: () => Promise<boolean>;
  /** Calls create_order(); resolves the order number or the TR00x code it raised. */
  createOrder: (
    input: OrderInput,
  ) => Promise<{ ok: true; orderNumber: string } | { ok: false; code: string }>;
  /**
   * Best-effort order-notification side channel (Z.01, Plan §8). Invoked ONLY after create_order()
   * succeeds — the order and its reservation are already written. Optional, and contracted to never
   * throw or meaningfully block; it is wrapped below regardless, so the order outcome can never depend
   * on it. The database is the record; the email is a notification (D-0-5, Plan §8).
   */
  notifyOrder?: (input: OrderInput, orderNumber: string) => Promise<void>;
}

export type OrderOutcome =
  | { status: "ok"; orderNumber: string }
  | { status: "empty" } // nothing in the cart — never reaches create_order (brief Task 7)
  | { status: "turnstile"; retry: boolean } // verification missing/failed
  | { status: "rate_limited" }
  | { status: "order_error"; code: OrderErrorCode } // a documented TR00x from create_order
  | { status: "error" }; // an unexpected failure

/**
 * Gate order creation. Order matters: Turnstile FIRST (a bot must not even consume a rate-limit slot or
 * reach the database), then the IP rate limit, and only then create_order() — which is, and remains, the
 * sole authority on the drop window, the unit cap, price, and stock.
 */
export async function processOrder(
  token: string,
  input: OrderInput,
  deps: ProcessDeps,
): Promise<OrderOutcome> {
  // 0. Empty cart — nothing to order. Reject before Turnstile, the rate limit, or create_order (brief
  // Task 7). This became reachable the moment the stand-in item was deleted; the client's own empty
  // state should prevent it, so this is the load-bearing backstop.
  if (input.items.length === 0) return { status: "empty" };

  // 1. Turnstile — before anything else touches the rate-limit table or the database.
  if (!token) return { status: "turnstile", retry: true };
  const verdict = await deps.verifyTurnstile(token);
  if (!verdict.success) return { status: "turnstile", retry: verdict.retryable };

  // 2. IP rate limit.
  const allowed = await deps.checkRateLimit();
  if (!allowed) return { status: "rate_limited" };

  // 3. create_order() — the only path that decrements stock.
  const result = await deps.createOrder(input);
  if (result.ok) {
    // 4. Best-effort notification (Z.01). The order is committed; whatever happens here — a Resend
    // outage, a timeout, a thrown error — the customer still sees success. The sender logs its own
    // cause (no PII). Never let the side channel change the record (Plan §8, D-0-5).
    if (deps.notifyOrder) {
      try {
        await deps.notifyOrder(input, result.orderNumber);
      } catch {
        // Intentionally swallowed: the order already succeeded and must report success regardless.
      }
    }
    return { status: "ok", orderNumber: result.orderNumber };
  }
  if (isOrderErrorCode(result.code)) return { status: "order_error", code: result.code };
  return { status: "error" };
}
