import { describe, it, expect } from "vitest";
import { firstInvalidField } from "../../src/lib/forms/first-invalid";

// 2.25 /harden (D-2.25-5) — a failed submit must move focus to the first invalid field the customer
// will REACH, not the first key that happens to be in the error map. Both forms build that map in a
// different order from the DOM, which is the whole reason this helper exists, so that mismatch is
// what these tests pin.

const CHECKOUT_ORDER = ["name", "phone", "city", "address"] as const;
const CONTACT_ORDER = ["name", "email", "subject", "message"] as const;

describe("firstInvalidField", () => {
  it("returns null when nothing failed", () => {
    expect(firstInvalidField({}, CHECKOUT_ORDER)).toBeNull();
  });

  it("picks the field that comes first in the DOM, not first in the error map", () => {
    // CheckoutForm.validate() fills name/city/address in one loop and phone afterwards, so an
    // address-and-phone failure arrives as {address, phone} — insertion order says `address`, the
    // DOM says `phone`.
    const errors = { address: "Задолжително поле", phone: "Внеси валиден број" };
    expect(Object.keys(errors)[0]).toBe("address"); // the wrong answer, pinned so the point survives
    expect(firstInvalidField(errors, CHECKOUT_ORDER)).toBe("phone");
  });

  it("returns the single failing field whatever its position", () => {
    expect(firstInvalidField({ name: "x" }, CHECKOUT_ORDER)).toBe("name");
    expect(firstInvalidField({ address: "x" }, CHECKOUT_ORDER)).toBe("address");
  });

  it("ignores keys that are present but carry no message", () => {
    // Partial<Record<K, string>> can legally hold an explicit undefined; that is not an error.
    expect(firstInvalidField({ name: undefined, city: "x" }, CHECKOUT_ORDER)).toBe("city");
  });

  it("ignores an empty-string message", () => {
    expect(firstInvalidField({ name: "", city: "x" }, CHECKOUT_ORDER)).toBe("city");
  });

  it("uses the contact form's own DOM order", () => {
    // ContactForm's cap check can fail `subject` while the required loop fails `message`; subject is
    // above message on the page.
    expect(
      firstInvalidField({ message: "Задолжително поле", subject: "Предолго" }, CONTACT_ORDER),
    ).toBe("subject");
  });

  it("ignores a field that is not in the declared order", () => {
    // A renamed or removed field degrades to "focus did not move", never to focusing something else.
    expect(firstInvalidField({ nickname: "x" } as Record<string, string>, CONTACT_ORDER)).toBeNull();
  });
});
