/**
 * The COMPLETE error vocabulary raised by create_order().
 *
 * Each distinct failure raises a distinct PostgreSQL SQLSTATE, which surfaces on the Supabase error
 * as `error.code`. Callers (the 1.04 server action, and the tests) switch on `error.code` — never on
 * the human-readable `error.message`. The message mirrors the identifier as a snake_case token for
 * logs. Keep this table in lockstep with the create_order migration.
 *
 * All five map to HTTP 400 via PostgREST (a custom non-`PT` SQLSTATE passes through untouched). We do
 * NOT use PostgREST's `PT<nnn>` convention because `nnn` is interpreted as the HTTP status, and a
 * status < 100 produces an invalid HTTP response (see the Phase 1.03 completion report, §3).
 */
export const ORDER_ERROR_CODES = {
  DROP_NOT_FOUND: "TR001",
  DROP_NOT_OPEN: "TR002",
  QUANTITY_CAP_VIOLATED: "TR003",
  INSUFFICIENT_STOCK: "TR004",
  DUPLICATE_PHONE: "TR005",
} as const;

export type OrderErrorCode = (typeof ORDER_ERROR_CODES)[keyof typeof ORDER_ERROR_CODES];

/** Reverse map: SQLSTATE → snake_case identifier (also the raised message). */
export const ORDER_ERROR_IDENTIFIER: Record<OrderErrorCode, string> = {
  TR001: "drop_not_found",
  TR002: "drop_not_open",
  TR003: "quantity_cap_violated",
  TR004: "insufficient_stock",
  TR005: "duplicate_phone",
};
