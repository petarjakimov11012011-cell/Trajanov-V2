import { describe, it, expect } from "vitest";
import mk from "../../src/messages/mk.json";
import en from "../../src/messages/en.json";

// Interpolation parity (Phase Y.11, Task 15). Key parity (catalog-parity.test.ts) is not enough: a key
// whose MK value says `{count}` while the EN value says `{n}` passes key parity and then renders a raw
// slot — or throws — in one language only. Every key must use the same ICU arguments and the same
// rich-text tags in both catalogs.

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

/**
 * ICU argument names at any depth: `{name}`, `{name, number}`, and `{name, plural|select|selectordinal,
 * sel {…} …}` whose branch bodies are parsed recursively. A small brace parser — a branch body such as
 * `{DAY}` is text, not an argument.
 */
function icuArguments(message: string): string[] {
  const names = new Set<string>();

  // Parse literal text (with nested arguments) until an unmatched `}` or the end; returns the index.
  function text(i: number): number {
    while (i < message.length) {
      if (message[i] === "{") i = argument(i + 1);
      else if (message[i] === "}") return i;
      else i++;
    }
    return i;
  }

  // Parse after an argument's `{`; returns the index after its closing `}`.
  function argument(i: number): number {
    const head = /^\s*([A-Za-z_]\w*)\s*(?:,\s*([A-Za-z]+)\s*)?(,|\})/.exec(message.slice(i));
    if (!head) return text(i) + 1;
    names.add(head[1]);
    i += head[0].length;
    if (head[3] === "}") return i;
    if (!/^(plural|select|selectordinal)$/.test(head[2] ?? "")) {
      // {n, number, …} / {d, date, …}: skip the style to the closing brace.
      return message.indexOf("}", i) + 1;
    }
    // Branches: `selector {body}` pairs, optionally `offset:n`, until the argument's `}`.
    while (i < message.length) {
      const sel = /^\s*(offset:\d+\s*)?(=\d+|[^\s{}]+)?\s*/.exec(message.slice(i))!;
      i += sel[0].length;
      if (message[i] === "}") return i + 1;
      if (message[i] !== "{") return i;
      i = text(i + 1) + 1;
    }
    return i;
  }

  text(0);
  return [...names].sort();
}

/** Rich-text tags such as `<link>…</link>`. */
function tags(message: string): string[] {
  return [...new Set([...message.matchAll(/<([A-Za-z][\w]*)>/g)].map((m) => m[1]))].sort();
}

const flatMk = flatten(mk as Record<string, unknown>);
const flatEn = flatten(en as Record<string, unknown>);

describe("icuArguments", () => {
  it("finds plain and plural arguments, but not plural branch keywords", () => {
    expect(icuArguments("{count, plural, one {# DAY} other {# DAYS}}")).toEqual(["count"]);
    expect(icuArguments("You pay {amount}, plus {cost}.")).toEqual(["amount", "cost"]);
    expect(icuArguments("{days, plural, one {# day} other {# days}}, {hours, plural, other {# h}}")).toEqual([
      "days",
      "hours",
    ]);
  });
});

describe("mk.json ⇔ en.json use the same interpolation", () => {
  const keys = Object.keys(flatMk).filter((k) => k in flatEn);

  it("every key has the same ICU arguments in both catalogs", () => {
    const mismatched = keys
      .filter((k) => icuArguments(flatMk[k]).join() !== icuArguments(flatEn[k]).join())
      .map((k) => `${k}: mk {${icuArguments(flatMk[k])}} vs en {${icuArguments(flatEn[k])}}`);
    expect(mismatched).toEqual([]);
  });

  it("every key has the same rich-text tags in both catalogs", () => {
    const mismatched = keys.filter((k) => tags(flatMk[k]).join() !== tags(flatEn[k]).join());
    expect(mismatched).toEqual([]);
  });
});
