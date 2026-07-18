import { describe, it, expect, vi } from "vitest";
import { processOrder, type OrderInput, type ProcessDeps } from "../../src/lib/orders/process-order";

// The order pipeline ORDER of operations (Task 6, DoD): a request with no token, and one with a failed
// Turnstile, are both rejected BEFORE create_order() is reached. Pure test — injected dependencies, no DB.
const INPUT: OrderInput = {
  dropSlug: "d",
  customerName: "x",
  phone: "078820520",
  phoneNormalized: "+38978820520",
  address: "a",
  city: "c",
  items: [{ variantId: "v1", quantity: 1 }],
};

function makeDeps(over: Partial<ProcessDeps> = {}) {
  // createOrder is always wrapped in a spy so tests can assert it was (or was not) reached.
  const createOrder = vi.fn(
    over.createOrder ?? (async () => ({ ok: true as const, orderNumber: "TRJ-0001" })),
  );
  return {
    verifyTurnstile: over.verifyTurnstile ?? (async () => ({ success: true, retryable: false })),
    checkRateLimit: over.checkRateLimit ?? (async () => true),
    createOrder,
  };
}

describe("processOrder — Turnstile gates create_order", () => {
  it("rejects an EMPTY cart before create_order() is reached (brief Task 7)", async () => {
    // A valid token, so it is the emptiness — not the token — that rejects it.
    const deps = makeDeps();
    const out = await processOrder("good", { ...INPUT, items: [] }, deps);
    expect(out).toEqual({ status: "empty" });
    expect(deps.createOrder).not.toHaveBeenCalled();
  });

  it("rejects a MISSING token before create_order() is reached", async () => {
    const deps = makeDeps();
    const out = await processOrder("", INPUT, deps);
    expect(out).toEqual({ status: "turnstile", retry: true });
    expect(deps.createOrder).not.toHaveBeenCalled();
  });

  it("rejects an INVALID token before create_order() is reached", async () => {
    const deps = makeDeps({ verifyTurnstile: async () => ({ success: false, retryable: false }) });
    const out = await processOrder("bad-token", INPUT, deps);
    expect(out).toEqual({ status: "turnstile", retry: false });
    expect(deps.createOrder).not.toHaveBeenCalled();
  });

  it("rejects when over the rate limit before create_order() is reached", async () => {
    const deps = makeDeps({ checkRateLimit: async () => false });
    const out = await processOrder("good", INPUT, deps);
    expect(out).toEqual({ status: "rate_limited" });
    expect(deps.createOrder).not.toHaveBeenCalled();
  });

  it("reaches create_order() only after Turnstile AND the rate limit pass", async () => {
    const deps = makeDeps();
    const out = await processOrder("good", INPUT, deps);
    expect(out).toEqual({ status: "ok", orderNumber: "TRJ-0001" });
    expect(deps.createOrder).toHaveBeenCalledOnce();
  });

  it("maps a create_order TR00x code to an order_error outcome", async () => {
    const deps = makeDeps({
      createOrder: vi.fn(async () => ({ ok: false as const, code: "TR004" })),
    });
    const out = await processOrder("good", INPUT, deps);
    expect(out).toEqual({ status: "order_error", code: "TR004" });
  });
});

describe("processOrder — best-effort order notification (Z.01)", () => {
  it("calls notifyOrder exactly once, AFTER a successful order, with the input and order number", async () => {
    const notifyOrder = vi.fn(async () => {});
    const out = await processOrder("good", INPUT, { ...makeDeps(), notifyOrder });
    expect(out).toEqual({ status: "ok", orderNumber: "TRJ-0001" });
    expect(notifyOrder).toHaveBeenCalledOnce();
    expect(notifyOrder).toHaveBeenCalledWith(INPUT, "TRJ-0001");
  });

  it("does NOT notify when the order fails with a TR00x code (no order = no email)", async () => {
    const notifyOrder = vi.fn(async () => {});
    const deps = {
      ...makeDeps({ createOrder: vi.fn(async () => ({ ok: false as const, code: "TR004" })) }),
      notifyOrder,
    };
    const out = await processOrder("good", INPUT, deps);
    expect(out).toEqual({ status: "order_error", code: "TR004" });
    expect(notifyOrder).not.toHaveBeenCalled();
  });

  it("does NOT notify on an empty cart (rejected before create_order)", async () => {
    const notifyOrder = vi.fn(async () => {});
    const out = await processOrder("good", { ...INPUT, items: [] }, { ...makeDeps(), notifyOrder });
    expect(out).toEqual({ status: "empty" });
    expect(notifyOrder).not.toHaveBeenCalled();
  });

  it("still returns order success when notifyOrder THROWS — the order never depends on the email", async () => {
    const notifyOrder = vi.fn(async () => {
      throw new Error("resend exploded");
    });
    const out = await processOrder("good", INPUT, { ...makeDeps(), notifyOrder });
    expect(out).toEqual({ status: "ok", orderNumber: "TRJ-0001" });
    expect(notifyOrder).toHaveBeenCalledOnce();
  });
});
