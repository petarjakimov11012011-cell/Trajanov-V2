"use server";

import { headers } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { verifyTurnstile, isRetryableTurnstile } from "@/lib/turnstile/verify";
import { hashIp, clientIpFromHeaders, recordAndCheckRateLimit } from "@/lib/rate-limit/ip";
import { sendOrderNotification, type OrderNotificationLine } from "@/lib/email/order-notification";
import { processOrder, type OrderInput, type OrderOutcome } from "./process-order";
import { normalizeMkPhone } from "./phone";

// The order Server Action (Task 6). The checkout form calls this with a FRESH Turnstile token minted at
// submit (D-1.04-8). It re-validates on the server (never trusting the client), then runs the pipeline:
// Turnstile Siteverify → IP rate limit → create_order(). create_order() remains the only authority on the
// window, cap, price, and stock. No order PII is ever logged (CLAUDE.md).

export interface PlaceOrderInput {
  token: string;
  dropSlug: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
  items: { variantId: string; quantity: number }[];
}

export type PlaceOrderResult = OrderOutcome | { status: "invalid"; field: "phone" | "form" };

export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  // Server-side re-validation of the basics (the client validates too, but must not be trusted). The
  // empty-cart case is owned by processOrder (returns "empty" before create_order — brief Task 7).
  if (!input.customerName?.trim() || !input.address?.trim() || !input.city?.trim()) {
    return { status: "invalid", field: "form" };
  }
  const phoneNormalized = normalizeMkPhone(input.phone ?? "");
  if (!phoneNormalized) return { status: "invalid", field: "phone" };

  const h = await headers();
  const ip = clientIpFromHeaders(h);
  const supabase = createServiceRoleClient();

  // Per-drop rate-limit threshold (D-1.04-7); default if the drop row is somehow missing.
  const { data: drop } = await supabase
    .from("drops")
    .select("rate_limit_per_window")
    .eq("slug", input.dropSlug)
    .maybeSingle();
  const max = drop?.rate_limit_per_window ?? 20;
  const ipHash = hashIp(ip);

  const orderInput: OrderInput = {
    dropSlug: input.dropSlug,
    customerName: input.customerName.trim(),
    phone: input.phone.trim(),
    phoneNormalized,
    address: input.address.trim(),
    city: input.city.trim(),
    notes: input.notes?.trim() || null,
    items: input.items,
  };

  return processOrder(input.token, orderInput, {
    verifyTurnstile: async (token) => {
      const r = await verifyTurnstile(token);
      return { success: r.success, retryable: isRetryableTurnstile(r.errorCodes) };
    },
    checkRateLimit: () => recordAndCheckRateLimit(supabase, ipHash, max),
    createOrder: async (oi) => {
      const { data, error } = await supabase.rpc("create_order", {
        p_drop_slug: oi.dropSlug,
        p_customer_name: oi.customerName,
        p_phone: oi.phone,
        p_phone_normalized: oi.phoneNormalized,
        p_address: oi.address,
        p_city: oi.city,
        p_items: oi.items.map((i) => ({ variant_id: i.variantId, quantity: i.quantity })),
        p_notes: oi.notes ?? undefined,
      });
      if (error) return { ok: false, code: error.code ?? "unknown" };
      const row = Array.isArray(data) ? data[0] : data;
      return { ok: true, orderNumber: row.order_number as string };
    },
    // Best-effort order email (Z.01). Runs only after create_order() succeeds; sendOrderNotification
    // never throws and bounds itself, and processOrder wraps this again — so the order response never
    // depends on it (Plan §8). Enrichment (variant → product/size) is best-effort too: if it fails,
    // Vladimir still gets the order number and customer details and can pull the rest from Supabase.
    notifyOrder: async (oi, orderNumber) => {
      const lines = await resolveOrderLines(supabase, oi.items);
      await sendOrderNotification({
        orderNumber,
        customerName: oi.customerName,
        phone: oi.phone,
        city: oi.city,
        address: oi.address,
        notes: oi.notes ?? null,
        lines,
      });
    },
  });
}

// Shape of the variant→product embed used to name the ordered lines for Vladimir's email. Cast with
// `as unknown as` (the repo's convention for embedded selects — see src/lib/drop/state.ts).
interface RawVariantRow {
  id: string;
  size: string;
  products: { name_mk: string | null; name_en: string | null; slug: string } | null;
}

/**
 * Resolve the ordered variants to human-readable lines (product name/slug + size + quantity) for the
 * notification email. Best-effort: bounded by a short abort timeout and fully wrapped, so a slow or
 * failing lookup degrades to quantity-only lines rather than delaying or breaking the order path.
 */
async function resolveOrderLines(
  supabase: SupabaseClient<Database>,
  items: { variantId: string; quantity: number }[],
): Promise<OrderNotificationLine[]> {
  const detail = new Map<string, { productName: string | null; size: string }>();
  try {
    const { data } = await supabase
      .from("variants")
      .select("id, size, products(name_mk, name_en, slug)")
      .in(
        "id",
        items.map((i) => i.variantId),
      )
      .abortSignal(AbortSignal.timeout(4000));
    for (const row of (data ?? []) as unknown as RawVariantRow[]) {
      const p = Array.isArray(row.products) ? row.products[0] : row.products;
      detail.set(row.id, {
        productName: p?.name_mk ?? p?.name_en ?? p?.slug ?? null,
        size: row.size,
      });
    }
  } catch {
    // Lookup failed (timeout, transient error): fall through to quantity-only lines. The order number
    // and customer details still reach Vladimir; the DB remains the record (Plan §8).
  }
  return items.map((i) => {
    const d = detail.get(i.variantId);
    return { productName: d?.productName ?? null, size: d?.size ?? null, quantity: i.quantity };
  });
}
