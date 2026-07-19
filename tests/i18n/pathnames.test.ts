import {describe, it, expect} from "vitest";
import {readdirSync, type Dirent} from "node:fs";
import {join, relative, sep} from "node:path";
import {routing} from "../../src/i18n/routing";

// Pathname coverage (D-2.01, Task 11). Every page folder under src/app/[locale]/ must have a matching
// `pathnames` entry, and every entry must carry a slug for BOTH locales — so a new page added without a
// slug, or a slug pointing at a route that does not exist, fails the build's test gate rather than
// 404-ing (MK) or shipping an un-prefixed path in production.
//
// This checks the routing CONFIG (which the next-intl runtime consumes). The live `/en` prefixing and
// the actual localised URLs are exercised in-browser during the phase's render pass — importing the
// client navigation helpers here would pull `next/navigation` into the node test runner.

const LOCALE_DIR = join(import.meta.dirname, "..", "..", "src", "app", "[locale]");

type PathValue = string | Record<string, string>;
const pathnames = routing.pathnames as unknown as Record<string, PathValue>;

// Derive the INTERNAL pathname of every route folder (the folder tree, with [param] segments kept as-is,
// matching the keys in routing.pathnames): [locale]/page.tsx → "/", catalog/[slug]/page.tsx →
// "/catalog/[slug]".
function routePathnames(): string[] {
  const entries = readdirSync(LOCALE_DIR, {recursive: true, withFileTypes: true}) as Dirent[];
  const out: string[] = [];
  for (const entry of entries) {
    if (!entry.isFile() || entry.name !== "page.tsx") continue;
    const parent = (entry as unknown as {parentPath: string}).parentPath;
    const rel = relative(LOCALE_DIR, parent);
    const segments = rel.split(sep).filter(Boolean);
    out.push(segments.length === 0 ? "/" : "/" + segments.join("/"));
  }
  return out.sort();
}

function slugFor(entry: PathValue, locale: string): string | undefined {
  return typeof entry === "string" ? entry : entry[locale];
}

const pathnameKeys = Object.keys(pathnames).sort();
const routes = routePathnames();

describe("pathname coverage — routing.pathnames ⇔ src/app/[locale]", () => {
  it("finds the expected route folders (sanity: the scan sees real pages)", () => {
    expect(routes).toContain("/");
    expect(routes).toContain("/catalog/[slug]");
    expect(routes.length).toBeGreaterThanOrEqual(8);
  });

  it("every route folder has a pathnames entry", () => {
    const missing = routes.filter((r) => !pathnameKeys.includes(r));
    expect(missing, "route folders with no pathnames entry").toEqual([]);
  });

  it("every pathnames entry maps to a real route folder (no orphan slug)", () => {
    const orphans = pathnameKeys.filter((k) => !routes.includes(k));
    expect(orphans, "pathnames entries with no route folder").toEqual([]);
  });

  it("every pathnames entry carries a non-empty slug for both locales", () => {
    for (const key of pathnameKeys) {
      for (const locale of routing.locales) {
        const slug = slugFor(pathnames[key], locale);
        expect(typeof slug, `${key} @ ${locale} slug type`).toBe("string");
        expect((slug ?? "").startsWith("/"), `${key} @ ${locale} → ${slug}`).toBe(true);
      }
    }
  });

  it("dynamic entries keep the same [param] token in both locales", () => {
    for (const key of pathnameKeys) {
      const params = key.match(/\[[^\]]+\]/g);
      if (!params) continue;
      for (const locale of routing.locales) {
        const slug = slugFor(pathnames[key], locale) ?? "";
        for (const p of params) {
          expect(slug.includes(p), `${key} @ ${locale} must keep ${p}`).toBe(true);
        }
      }
    }
  });
});

// The three legal routes added in 2.03 (D-2.03, Task 9). Asserted by name and exact slug so a
// regression that drops one, or mistranslates a MK slug, fails the gate instead of shipping a dead
// customer link once the real domain is live. Kept in lockstep with routing.pathnames.
describe("legal routes (2.03) — /terms, /privacy, /shipping-returns in both locales", () => {
  const expected: Record<string, {mk: string; en: string}> = {
    "/terms": {mk: "/uslovi", en: "/terms"},
    "/privacy": {mk: "/privatnost", en: "/privacy"},
    "/shipping-returns": {mk: "/isporaka-i-vrakjanje", en: "/shipping-returns"},
  };

  for (const [route, slugs] of Object.entries(expected)) {
    it(`${route} maps to its localised slug in mk and en`, () => {
      const entry = pathnames[route];
      expect(entry, `${route} missing from routing.pathnames`).toBeDefined();
      expect(slugFor(entry, "mk"), `${route} @ mk`).toBe(slugs.mk);
      expect(slugFor(entry, "en"), `${route} @ en`).toBe(slugs.en);
    });

    it(`${route} has a real route folder under src/app/[locale]`, () => {
      expect(routes, `no page folder for ${route}`).toContain(route);
    });
  }
});
