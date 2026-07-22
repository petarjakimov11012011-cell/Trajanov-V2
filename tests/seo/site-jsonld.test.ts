import {describe, it, expect} from "vitest";
import {siteJsonLd} from "../../src/lib/seo/site-jsonld";
import {INSTAGRAM_URL} from "../../src/lib/social";
import {SITE_URL} from "../../src/lib/site";

// Organization + WebSite JSON-LD (Task 4; logo added 2.04b). JSON-LD is a factual-claim surface, so
// these guard the same facts.md rules the visible pages obey: no address, no SearchAction, no partner,
// `sameAs` = the ONE verified Instagram account, and a `logo` that is a REAL, absolute-on-SITE_URL
// wordmark asset (Phase 2.04b) — not a fabricated URL.

const graph = siteJsonLd() as {"@graph": Record<string, unknown>[]};
const json = JSON.stringify(graph);
const org = graph["@graph"].find((n) => n["@type"] === "Organization")!;
const site = graph["@graph"].find((n) => n["@type"] === "WebSite")!;

describe("siteJsonLd", () => {
  it("contains both an Organization and a WebSite node", () => {
    expect(org).toBeTruthy();
    expect(site).toBeTruthy();
    expect(org.name).toBe("Trajanov");
    expect(site.name).toBe("Trajanov");
    expect(site.inLanguage).toEqual(["mk", "en"]);
  });

  it("sameAs is the one verified Instagram account and nothing else", () => {
    expect(org.sameAs).toEqual([INSTAGRAM_URL]);
  });

  it("carries a real, absolute-on-SITE_URL logo (Phase 2.04b)", () => {
    expect(org.logo).toBe(`${SITE_URL}/logo-512.png`);
    expect(String(org.logo)).toMatch(/^https?:\/\//);
  });

  it("invents no address, no SearchAction, no partner", () => {
    expect(json).not.toContain("address");
    expect(json).not.toContain("SearchAction");
    expect(json).not.toContain("potentialAction");
    expect(json).not.toContain("EAM");
    expect(json.toLowerCase()).not.toContain("strumica");
    expect(json.toLowerCase()).not.toContain("струмица");
  });
});
