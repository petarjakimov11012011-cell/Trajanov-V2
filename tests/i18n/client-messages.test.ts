import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { CLIENT_NAMESPACES, pickClientMessages } from "../../src/i18n/client-namespaces";
import mk from "../../src/messages/mk.json";
import en from "../../src/messages/en.json";

// 2.25 /optimize (D-2.25-7) — the layout hands the browser only CLIENT_NAMESPACES instead of the whole
// message catalog. A namespace a client component needs but that is missing from that list does not
// fail the build; it fails in the customer's browser as a MISSING_MESSAGE. So the list is re-derived
// here from the source tree on every run.
//
// The derivation walks OUT from every `'use client'` file through its local imports, because a module
// with no directive of its own (DropBanner, StockBadge, ProductCard, ShippingNotice, product-images)
// becomes client code the moment a client component imports it. Within each reachable module we count
// a namespace as required if it is named in `useTranslations('Ns')` OR appears as a dotted key literal
// (`'Ns.key'`) — the second form covers HomeShowcase, which calls `useTranslations()` at the root and
// resolves keys like `Product.photoAltOchre` that are stored in a separate module.

const SRC = resolve(__dirname, "../../src");
const REPO = resolve(__dirname, "../..");
const ALL_NAMESPACES = Object.keys(mk);

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?)$/.test(p)) out.push(p);
  }
  return out;
}

function resolveImport(fromFile: string, spec: string): string | null {
  let base: string;
  if (spec.startsWith("@/")) base = join(SRC, spec.slice(2));
  else if (spec.startsWith(".")) base = resolve(dirname(fromFile), spec);
  else return null; // a package, not our source
  const candidates = [
    `${base}.tsx`,
    `${base}.ts`,
    `${base}.jsx`,
    `${base}.js`,
    join(base, "index.tsx"),
    join(base, "index.ts"),
  ];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) ?? null;
}

function clientReachableModules(): string[] {
  const files = walk(SRC);
  const roots = files.filter((f) => /^\s*['"]use client['"]/m.test(readFileSync(f, "utf8")));
  expect(roots.length, "no 'use client' files found — the scan is broken, not the app").toBeGreaterThan(0);

  const seen = new Set<string>();
  const queue = [...roots];
  while (queue.length) {
    const f = queue.pop()!;
    if (seen.has(f)) continue;
    seen.add(f);
    for (const m of readFileSync(f, "utf8").matchAll(/from\s+['"]([^'"]+)['"]/g)) {
      const r = resolveImport(f, m[1]);
      if (r && !seen.has(r)) queue.push(r);
    }
  }
  return [...seen];
}

function requiredNamespaces(): Map<string, string[]> {
  const required = new Map<string, string[]>();
  const note = (ns: string, file: string) => {
    const rel = file.replace(`${REPO}/`, "");
    const list = required.get(ns) ?? [];
    if (!list.includes(rel)) list.push(rel);
    required.set(ns, list);
  };

  for (const file of clientReachableModules()) {
    const src = readFileSync(file, "utf8");
    for (const m of src.matchAll(/useTranslations\(\s*['"]([A-Za-z0-9_]+)['"]\s*\)/g)) {
      note(m[1], file);
    }
    for (const ns of ALL_NAMESPACES) {
      if (new RegExp(`['"\`]${ns}\\.[A-Za-z0-9_]`).test(src)) note(ns, file);
    }
  }
  return required;
}

describe("client message scoping", () => {
  it("ships every namespace a client component can reach", () => {
    const required = requiredNamespaces();
    const missing = [...required.entries()]
      .filter(([ns]) => !(CLIENT_NAMESPACES as readonly string[]).includes(ns))
      .map(([ns, files]) => `${ns} (needed by ${files.join(", ")})`);
    expect(
      missing,
      "add these to CLIENT_NAMESPACES in src/i18n/client-namespaces.ts — otherwise they fail as MISSING_MESSAGE in the browser, not at build time",
    ).toEqual([]);
  });

  it("lists no namespace that does not exist in the catalog", () => {
    const unknown = CLIENT_NAMESPACES.filter((ns) => !ALL_NAMESPACES.includes(ns));
    expect(unknown, "typo in CLIENT_NAMESPACES, or a namespace was renamed in src/messages").toEqual([]);
  });

  it("actually withholds the server-only namespaces", () => {
    // The point of the exercise: the biggest catalogs — legal bodies, the FAQ, the metadata strings —
    // must NOT be on the list. If this ever passes trivially the optimisation has been undone.
    const withheld = ALL_NAMESPACES.filter((ns) => !(CLIENT_NAMESPACES as readonly string[]).includes(ns));
    expect(withheld).toContain("Terms");
    expect(withheld).toContain("Privacy");
    expect(withheld).toContain("ShippingReturns");
    expect(withheld).toContain("Faq");
    expect(withheld).toContain("About");
    expect(withheld).toContain("Meta");
  });

  it("picks the same namespaces out of both locale catalogs", () => {
    const pickedMk = Object.keys(pickClientMessages(mk as Record<string, unknown>)).sort();
    const pickedEn = Object.keys(pickClientMessages(en as Record<string, unknown>)).sort();
    expect(pickedMk).toEqual([...CLIENT_NAMESPACES].sort());
    expect(pickedEn).toEqual(pickedMk);
  });

  it("drops a namespace the catalog does not have rather than serializing undefined", () => {
    const picked = pickClientMessages({ Nav: { brand: "Trajanov" } });
    expect(picked).toEqual({ Nav: { brand: "Trajanov" } });
    expect(Object.keys(picked)).not.toContain("Cart");
  });
});
