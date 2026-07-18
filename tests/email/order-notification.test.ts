import { describe, it, expect, vi, afterEach } from "vitest";
import {
  sendOrderNotification,
  composeOrderNotification,
  ORDER_FROM_ADDRESS,
  type OrderNotification,
} from "../../src/lib/email/order-notification";

// Z.01 — the order-notification sender. Resend is ALWAYS mocked; these tests never hit the real API.
// They prove the three best-effort guarantees the DoD names: a good order sends exactly one email to
// the right recipient with the right fields; a thrown Resend error and a missing env var both degrade
// silently (no throw); and no customer PII ever reaches a log line.

// Hoisted so the vi.mock factory (itself hoisted above the imports) can close over it. `Resend` must be
// a class/function so `new Resend()` works — an arrow-function mock cannot be constructed.
const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));
vi.mock("resend", () => ({
  Resend: class MockResend {
    emails = { send: sendMock };
  },
}));

const RECIPIENT = "vladimir@example.test";
const ORDER: OrderNotification = {
  orderNumber: "TRJ-0007",
  customerName: "Ана Ристова",
  phone: "+38978820520",
  city: "Струмица",
  address: "ул. Маршал Тито 1, влез 2",
  notes: "втор кат, лево",
  lines: [
    { productName: "test-tee-one", size: "M", quantity: 1 },
    { productName: "Производ", size: "L", quantity: 1 },
  ],
};

/** Every PII value that must NEVER appear in a log line (CLAUDE.md; brief scope). */
const PII = [ORDER.customerName, ORDER.phone, ORDER.address, ORDER.city, ORDER.notes!];

function configureEnv() {
  vi.stubEnv("RESEND_API_KEY", "re_test_key");
  vi.stubEnv("ORDER_NOTIFICATION_EMAIL", RECIPIENT);
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe("composeOrderNotification", () => {
  it("builds an MK subject with the order number and a body with every fulfilment field", () => {
    const { subject, text } = composeOrderNotification(ORDER);
    expect(subject).toBe("Нова нарачка TRJ-0007 — Trajanov");
    // Customer details Vladimir needs to phone + ship.
    for (const field of [ORDER.orderNumber, ORDER.customerName, ORDER.phone, ORDER.city, ORDER.address, ORDER.notes!]) {
      expect(text).toContain(field);
    }
    // Each ordered line: product, size, quantity.
    expect(text).toContain("test-tee-one — величина M — 1 бр.");
    expect(text).toContain("Производ — величина L — 1 бр.");
    // States COD, and that the DB — not this email — is the record.
    expect(text).toContain("готовина при преземање");
    expect(text).toContain("Supabase");
  });

  it("degrades a failed lookup (null product/size) without fabricating anything", () => {
    const { text } = composeOrderNotification({
      ...ORDER,
      lines: [{ productName: null, size: null, quantity: 2 }],
    });
    expect(text).toContain("Производ (без назив) — величина непозната — 2 бр.");
  });
});

describe("sendOrderNotification", () => {
  it("sends exactly one email to ORDER_NOTIFICATION_EMAIL from onboarding@resend.dev with the order fields", async () => {
    configureEnv();
    sendMock.mockResolvedValue({ data: { id: "e_1" }, error: null });

    const result = await sendOrderNotification(ORDER);

    expect(result).toEqual({ delivered: true });
    expect(sendMock).toHaveBeenCalledTimes(1);
    const payload = sendMock.mock.calls[0][0];
    expect(payload.from).toBe(ORDER_FROM_ADDRESS);
    expect(payload.from).toBe("onboarding@resend.dev");
    expect(payload.to).toBe(RECIPIENT);
    expect(payload.subject).toContain("TRJ-0007");
    expect(payload.text).toContain(ORDER.customerName);
    expect(payload.text).toContain(ORDER.phone);
    expect(payload.text).toContain("величина M");
  });

  it("leaves the order successful when Resend THROWS — resolves, never rethrows", async () => {
    configureEnv();
    sendMock.mockRejectedValue(new Error("network down"));
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Must not reject.
    await expect(sendOrderNotification(ORDER)).resolves.toEqual({ delivered: false, reason: "exception" });

    // Logged the order number for correlation, but NO PII.
    const logged = errSpy.mock.calls.map((c) => c.join(" ")).join("\n");
    expect(logged).toContain("TRJ-0007");
    for (const pii of PII) expect(logged).not.toContain(pii);
  });

  it("leaves the order successful when Resend returns an error object (no throw)", async () => {
    configureEnv();
    sendMock.mockResolvedValue({
      data: null,
      error: { name: "validation_error", message: `Invalid to: ${RECIPIENT}`, statusCode: 422 },
    });
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(sendOrderNotification(ORDER)).resolves.toEqual({ delivered: false, reason: "send_error" });

    // The Resend message can echo the recipient — we must log only the code, never the message.
    const logged = errSpy.mock.calls.map((c) => c.join(" ")).join("\n");
    expect(logged).toContain("validation_error");
    expect(logged).not.toContain(RECIPIENT);
  });

  it("degrades gracefully when RESEND_API_KEY / ORDER_NOTIFICATION_EMAIL are unset — never calls Resend, never throws", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("ORDER_NOTIFICATION_EMAIL", "");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    await expect(sendOrderNotification(ORDER)).resolves.toEqual({ delivered: false, reason: "unconfigured" });

    expect(sendMock).not.toHaveBeenCalled();
    const warned = warnSpy.mock.calls.map((c) => c.join(" ")).join("\n");
    expect(warned).toContain("TRJ-0007");
    for (const pii of PII) expect(warned).not.toContain(pii);
  });
});
