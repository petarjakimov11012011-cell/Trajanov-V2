import { describe, it, expect, vi, afterEach } from "vitest";
import {
  sendContactMessage,
  composeContactMessage,
  CONTACT_SUBJECT_PREFIX,
  type ContactMessage,
} from "../../src/lib/email/contact-message";
import { ORDER_FROM_ADDRESS } from "../../src/lib/email/order-notification";

// 2.23 — the contact-form sender. Resend is ALWAYS mocked; these tests never hit the real API. Unlike
// the order sender (a best-effort side channel), this result is THE record: every branch — success /
// send_error / timeout / unconfigured / exception — must resolve to the exact discriminated result the
// UI keys off, and `sent: true` must be impossible without Resend confirming. Same PII rule as Z.01:
// the visitor's name, email, and message never reach a log line.

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));
vi.mock("resend", () => ({
  Resend: class MockResend {
    emails = { send: sendMock };
  },
}));

const RECIPIENT = "vladimir@example.test";
const MSG: ContactMessage = {
  name: "Ана Ристова",
  email: "ana@example.test",
  subject: "Прашање за величини",
  message: "Дали XL е навистина оверсајз?\nПоздрав, Ана.",
  locale: "mk",
};

/** Every PII value that must NEVER appear in a log line (CLAUDE.md; brief hard stop 3). */
const PII = [MSG.name, MSG.email, MSG.subject!, MSG.message];

function configureEnv() {
  vi.stubEnv("RESEND_API_KEY", "re_test_key");
  vi.stubEnv("ORDER_NOTIFICATION_EMAIL", RECIPIENT);
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("composeContactMessage", () => {
  it("prefixes the subject with the fixed greppable marker + the visitor's subject", () => {
    const { subject } = composeContactMessage(MSG);
    expect(subject).toBe(`${CONTACT_SUBJECT_PREFIX} ${MSG.subject}`);
    expect(subject.startsWith("[Контакт]")).toBe(true);
    // Sortable away from order notifications, which are "Нова нарачка …".
    expect(subject.startsWith("Нова нарачка")).toBe(false);
  });

  it("falls back to a neutral subject when the visitor gave none", () => {
    const { subject } = composeContactMessage({ ...MSG, subject: null });
    expect(subject).toBe(`${CONTACT_SUBJECT_PREFIX} Нова порака од сајтот`);
  });

  it("builds a plain-text body with name, email, subject, message, and the visitor's locale", () => {
    const { text } = composeContactMessage(MSG);
    for (const field of [MSG.name, MSG.email, MSG.subject!, MSG.message]) {
      expect(text).toContain(field);
    }
    expect(text).toContain("македонски");
    expect(composeContactMessage({ ...MSG, locale: "en" }).text).toContain("англиски");
    // Message newlines survive into the body.
    expect(text).toContain("оверсајз?\nПоздрав");
  });
});

describe("sendContactMessage", () => {
  it("sends exactly one email: from the brand address, to ORDER_NOTIFICATION_EMAIL, replyTo the visitor", async () => {
    configureEnv();
    sendMock.mockResolvedValue({ data: { id: "e_1" }, error: null });

    const result = await sendContactMessage(MSG);

    expect(result).toEqual({ sent: true });
    expect(sendMock).toHaveBeenCalledTimes(1);
    const payload = sendMock.mock.calls[0][0];
    expect(payload.from).toBe(ORDER_FROM_ADDRESS);
    expect(payload.from).toBe("info@trajanovv.com");
    expect(payload.to).toBe(RECIPIENT);
    expect(payload.replyTo).toBe(MSG.email);
    expect(payload.subject).toContain("[Контакт]");
    expect(payload.text).toContain(MSG.name);
    expect(payload.text).toContain(MSG.message);
    expect(payload.html).toBeUndefined();
  });

  it("returns send_error when Resend rejects — and logs the code, never the visitor's data", async () => {
    configureEnv();
    sendMock.mockResolvedValue({
      data: null,
      error: { name: "validation_error", message: `Invalid to: ${RECIPIENT}`, statusCode: 422 },
    });
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(sendContactMessage(MSG)).resolves.toEqual({ sent: false, reason: "send_error" });

    const logged = errSpy.mock.calls.map((c) => c.join(" ")).join("\n");
    expect(logged).toContain("validation_error");
    expect(logged).not.toContain(RECIPIENT);
    for (const pii of PII) expect(logged).not.toContain(pii);
  });

  it("returns timeout when Resend hangs past the 8s ceiling", async () => {
    configureEnv();
    vi.useFakeTimers();
    sendMock.mockReturnValue(new Promise(() => {})); // never settles
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const pending = sendContactMessage(MSG);
    await vi.advanceTimersByTimeAsync(8000);

    await expect(pending).resolves.toEqual({ sent: false, reason: "timeout" });
    const logged = errSpy.mock.calls.map((c) => c.join(" ")).join("\n");
    for (const pii of PII) expect(logged).not.toContain(pii);
  });

  it("returns unconfigured when the env vars are unset — never calls Resend, never throws", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("ORDER_NOTIFICATION_EMAIL", "");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    await expect(sendContactMessage(MSG)).resolves.toEqual({ sent: false, reason: "unconfigured" });

    expect(sendMock).not.toHaveBeenCalled();
    const warned = warnSpy.mock.calls.map((c) => c.join(" ")).join("\n");
    for (const pii of PII) expect(warned).not.toContain(pii);
  });

  it("returns exception when Resend throws — resolves, never rethrows, no PII in the log", async () => {
    configureEnv();
    sendMock.mockRejectedValue(new Error("network down"));
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(sendContactMessage(MSG)).resolves.toEqual({ sent: false, reason: "exception" });

    const logged = errSpy.mock.calls.map((c) => c.join(" ")).join("\n");
    for (const pii of PII) expect(logged).not.toContain(pii);
  });
});
