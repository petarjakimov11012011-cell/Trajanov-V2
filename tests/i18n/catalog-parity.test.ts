import {describe, it, expect} from "vitest";
import mk from "../../src/messages/mk.json";
import en from "../../src/messages/en.json";

// Catalog parity (D-2.01, Task 11). next-intl requires MK and EN to carry the SAME key set; a key added
// to one file and forgotten in the other ships an untranslated (or missing) string. This suite is the
// guard: it fails the moment the two drift, and it fails on an empty value (an accidentally-blank
// translation). MK is the source language; EN mirrors its keys.

type Flat = Record<string, string>;

function flatten(obj: Record<string, unknown>, prefix = ""): Flat {
  const out: Flat = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") out[key] = v;
    else if (v && typeof v === "object") Object.assign(out, flatten(v as Record<string, unknown>, key));
  }
  return out;
}

// The ONE deliberately-empty value: the About pull-quote's "translated" note is empty on MK (the MK
// quote is the original — it needs no note) and set only on EN (D-1.05-6). The key must exist in both
// catalogs (parity), so the MK side is an intentional empty string, not a missing translation.
const ALLOWED_EMPTY = new Set(["About.quoteNote"]);

const flatMk = flatten(mk as Record<string, unknown>);
const flatEn = flatten(en as Record<string, unknown>);
const mkKeys = Object.keys(flatMk).sort();
const enKeys = Object.keys(flatEn).sort();

describe("catalog parity — mk.json ⇔ en.json", () => {
  it("has identical key sets (fails if a key exists in only one file)", () => {
    const onlyInMk = mkKeys.filter((k) => !(k in flatEn));
    const onlyInEn = enKeys.filter((k) => !(k in flatMk));
    expect(onlyInMk, "keys present only in mk.json").toEqual([]);
    expect(onlyInEn, "keys present only in en.json").toEqual([]);
    expect(mkKeys).toEqual(enKeys);
  });

  it("has no empty value in either catalog (except the deliberate About.quoteNote)", () => {
    const emptyMk = mkKeys.filter((k) => !ALLOWED_EMPTY.has(k) && flatMk[k].trim() === "");
    const emptyEn = enKeys.filter((k) => !ALLOWED_EMPTY.has(k) && flatEn[k].trim() === "");
    expect(emptyMk, "empty values in mk.json").toEqual([]);
    expect(emptyEn, "empty values in en.json").toEqual([]);
  });
});
