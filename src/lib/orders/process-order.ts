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
}

export type OrderOutcome =
  | { status: "ok"; orderNumber: string }
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
  // 1. Turnstile — before anything else touches the rate-limit table or the database.
  if (!token) return { status: "turnstile", retry: true };
  const verdict = await deps.verifyTurnstile(token);
  if (!verdict.success) return { status: "turnstile", retry: verdict.retryable };

  // 2. IP rate limit.
  const allowed = await deps.checkRateLimit();
  if (!allowed) return { status: "rate_limited" };

  // 3. create_order() — the only path that decrements stock.
  const result = await deps.createOrder(input);
  if (result.ok) return { status: "ok", orderNumber: result.orderNumber };
  if (isOrderErrorCode(result.code)) return { status: "order_error", code: result.code };
  return { status: "error" };
}
