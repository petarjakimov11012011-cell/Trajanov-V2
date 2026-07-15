"use server";

import { headers } from "next/headers";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { verifyTurnstile, isRetryableTurnstile } from "@/lib/turnstile/verify";
import { hashIp, clientIpFromHeaders, recordAndCheckRateLimit } from "@/lib/rate-limit/ip";
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
  // Server-side re-validation of the basics (the client validates too, but must not be trusted).
  if (
    !input.customerName?.trim() ||
    !input.address?.trim() ||
    !input.city?.trim() ||
    input.items.length === 0
  ) {
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
  });
}
