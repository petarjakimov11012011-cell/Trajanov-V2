import { describe, it, expect, vi } from "vitest";
import {
  validateContact,
  processContact,
  CONTACT_CAPS,
  type ContactInput,
  type ContactDeps,
} from "../../src/lib/contact/process-contact";

// 2.23 — the contact pipeline's load-bearing guarantees, unit-tested pure (the process-order.ts
// convention): Turnstile closes the path BEFORE validation or the sender; the server-side validation
// is the authority (required, length caps, email shape, header-injection rejection); and success is
// impossible unless the injected sender confirmed the send (hard stop 4).

const VALID: ContactInput = {
  name: "Ана Ристова",
  email: "ana@example.com",
  subject: "Прашање за величини",
  message: "Дали XL е навистина оверсајз?\nПоздрав.",
  locale: "mk",
};

function deps(overrides: Partial<ContactDeps> = {}) {
  const verifyTurnstile = vi.fn().mockResolvedValue({ success: true, retryable: false });
  const send = vi.fn().mockResolvedValue({ sent: true });
  return { verifyTurnstile, send, ...overrides };
}

describe("validateContact", () => {
  it("accepts a valid message, trims it, and nulls an empty subject", () => {
    const r = validateContact({ ...VALID, name: "  Ана Ристова  ", subject: "  " });
    expect(r).toEqual({
      ok: true,
      value: {
        name: "Ана Ристова",
        email: "ana@example.com",
        subject: null,
        message: VALID.message,
        locale: "mk",
      },
    });
  });

  it("normalises any unknown locale to mk (the default language), keeps en", () => {
    const mk = validateContact({ ...VALID, locale: "de" });
    const en = validateContact({ ...VALID, locale: "en" });
    expect(mk.ok && mk.value.locale).toBe("mk");
    expect(en.ok && en.value.locale).toBe("en");
  });

  it.each(["name", "email", "message"] as const)("rejects a required-empty %s", (field) => {
    expect(validateContact({ ...VALID, [field]: "   " })).toEqual({ ok: false, field });
  });

  it("rejects a malformed email shape", () => {
    for (const bad of ["not-an-email", "a@b", "a b@c.com", "@c.com", "a@"]) {
      expect(validateContact({ ...VALID, email: bad })).toEqual({ ok: false, field: "email" });
    }
  });

  it("enforces each length cap as a rejection, not a truncation (100 / 200 / 150 / 4000)", () => {
    // One char over each cap fails; exactly at the cap passes.
    expect(validateContact({ ...VALID, name: "x".repeat(CONTACT_CAPS.name + 1) })).toEqual({
      ok: false,
      field: "name",
    });
    expect(validateContact({ ...VALID, name: "x".repeat(CONTACT_CAPS.name) }).ok).toBe(true);

    const overEmail = `${"a".repeat(CONTACT_CAPS.email - 11)}@example.com`; // 201 chars, valid shape
    expect(overEmail.length).toBe(CONTACT_CAPS.email + 1);
    expect(validateContact({ ...VALID, email: overEmail })).toEqual({ ok: false, field: "email" });
    const atEmail = `${"a".repeat(CONTACT_CAPS.email - 12)}@example.com`; // exactly 200
    expect(atEmail.length).toBe(CONTACT_CAPS.email);
    expect(validateContact({ ...VALID, email: atEmail }).ok).toBe(true);

    expect(validateContact({ ...VALID, subject: "x".repeat(CONTACT_CAPS.subject + 1) })).toEqual({
      ok: false,
      field: "subject",
    });
    expect(validateContact({ ...VALID, subject: "x".repeat(CONTACT_CAPS.subject) }).ok).toBe(true);

    expect(validateContact({ ...VALID, message: "x".repeat(CONTACT_CAPS.message + 1) })).toEqual({
      ok: false,
      field: "message",
    });
    expect(validateContact({ ...VALID, message: "x".repeat(CONTACT_CAPS.message) }).ok).toBe(true);
  });

  it.each(["name", "email", "subject"] as const)(
    "rejects \\r, \\n and control characters in %s — these reach email headers",
    (field) => {
      // \r / \n mid-value (a trailing one would be trimmed away — the injection vector is mid-value).
      expect(validateContact({ ...VALID, [field]: "a\rBcc: evil@x.com" })).toEqual({ ok: false, field });
      expect(validateContact({ ...VALID, [field]: "a\nBcc: evil@x.com" })).toEqual({ ok: false, field });
      expect(validateContact({ ...VALID, [field]: "a\u0000b" })).toEqual({ ok: false, field });
      expect(validateContact({ ...VALID, [field]: "a\u001Bb" })).toEqual({ ok: false, field });
    },
  );

  it("allows newlines in the message body but rejects other control characters", () => {
    expect(validateContact({ ...VALID, message: "line one\nline two\r\nline three" }).ok).toBe(true);
    expect(validateContact({ ...VALID, message: "a\u0000b" })).toEqual({ ok: false, field: "message" });
    expect(validateContact({ ...VALID, message: "a\u0007b" })).toEqual({ ok: false, field: "message" });
  });
});

describe("processContact", () => {
  it("refuses a missing token before Turnstile, validation, or the sender run", async () => {
    const d = deps();
    const r = await processContact("", VALID, d);
    expect(r).toEqual({ sent: false, reason: "turnstile", retry: true });
    expect(d.verifyTurnstile).not.toHaveBeenCalled();
    expect(d.send).not.toHaveBeenCalled();
  });

  it("closes the path on a failed Turnstile — the sender is never reached", async () => {
    const d = deps({
      verifyTurnstile: vi.fn().mockResolvedValue({ success: false, retryable: false }),
    });
    const r = await processContact("tok", VALID, d);
    expect(r).toEqual({ sent: false, reason: "turnstile", retry: false });
    expect(d.send).not.toHaveBeenCalled();
  });

  it("marks a retryable Turnstile failure (timeout-or-duplicate) as retry, still closed", async () => {
    const d = deps({
      verifyTurnstile: vi.fn().mockResolvedValue({ success: false, retryable: true }),
    });
    const r = await processContact("tok", VALID, d);
    expect(r).toEqual({ sent: false, reason: "turnstile", retry: true });
    expect(d.send).not.toHaveBeenCalled();
  });

  it("rejects invalid input after Turnstile, before the sender", async () => {
    const d = deps();
    const r = await processContact("tok", { ...VALID, email: "nope" }, d);
    expect(r).toEqual({ sent: false, reason: "invalid", field: "email" });
    expect(d.send).not.toHaveBeenCalled();
  });

  it("sends the normalised message and reports sent only after the sender confirms", async () => {
    const d = deps();
    const r = await processContact("tok", { ...VALID, name: "  Ана  ", subject: " " }, d);
    expect(r).toEqual({ sent: true });
    expect(d.send).toHaveBeenCalledTimes(1);
    expect(d.send).toHaveBeenCalledWith({
      name: "Ана",
      email: VALID.email,
      subject: null,
      message: VALID.message,
      locale: "mk",
    });
  });

  it("NEVER returns sent:true on an unconfirmed send (hard stop 4)", async () => {
    for (const reason of ["unconfigured", "send_error", "timeout", "exception"] as const) {
      const d = deps({ send: vi.fn().mockResolvedValue({ sent: false, reason }) });
      const r = await processContact("tok", VALID, d);
      expect(r).toEqual({ sent: false, reason: "send_failed" });
    }
  });
});
