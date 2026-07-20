import {describe, it, expect} from "vitest";
import {siteJsonLd} from "../../src/lib/seo/site-jsonld";
import {INSTAGRAM_URL} from "../../src/lib/social";

// Organization + WebSite JSON-LD (Task 4). JSON-LD is a factual-claim surface, so these guard the same
// facts.md rules the visible pages obey: no address, no fabricated logo, no SearchAction, no partner,
// and `sameAs` = the ONE verified Instagram account.

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

  it("invents no address, no logo, no SearchAction, no partner", () => {
    expect(json).not.toContain("address");
    expect(json).not.toContain("logo");
    expect(json).not.toContain("SearchAction");
    expect(json).not.toContain("potentialAction");
    expect(json).not.toContain("EAM");
    expect(json.toLowerCase()).not.toContain("strumica");
    expect(json.toLowerCase()).not.toContain("струмица");
  });
});
