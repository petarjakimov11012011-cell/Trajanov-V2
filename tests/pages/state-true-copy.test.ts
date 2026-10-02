import { describe, it, expect, vi } from "vitest";
import { createElement } from "react";
import mk from "../../src/messages/mk.json";
import en from "../../src/messages/en.json";
import { renderToHtml, visibleText } from "../helpers/harness/render";
import type { TestLocale } from "../helpers/harness/intl-state";

vi.mock("server-only", () => ({}));
vi.mock("next-intl/server", () => import("../helpers/harness/next-intl-server"));
vi.mock("@/i18n/navigation", () => import("../helpers/harness/navigation"));

import { HomeFaq } from "@/components/home/HomeFaq";
import { GET as llmsTxt } from "@/app/llms.txt/route";
import manifest from "@/app/manifest";

// State-true copy (Phase Y.11, Task 10). Copy that is read when no drop is open must not promise a timer
// or describe a drop as active; the drop size is "3 to 5 products" (facts.md §7); and llms.txt, which
// AI assistants read as fact, must not state the per-order limit removed by D-Y.06-3.

const HANDLE = "@trajanovv2026"; // facts.md §6

async function renderFaq(locale: TestLocale) {
  const html = await renderToHtml(createElement(HomeFaq), locale);
  const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? "{}";
  const ld = JSON.parse(json) as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
  return { html, ld, text: visibleText(html) };
}

describe.each(["mk", "en"] as TestLocale[])("FAQ (%s)", (locale) => {
  it("answer 1: ordering only during a drop, follow the Instagram handle — no timer promise", async () => {
    const { ld } = await renderFaq(locale);
    const a1 = ld.mainEntity[0].acceptedAnswer.text;
    expect(a1).toContain(HANDLE);
    expect(a1).not.toMatch(/timer|тајмер|countdown|одбројув/i);
    expect(a1).not.toMatch(/buyable|може да се купи/i);
  });

  it("every visible answer equals its FAQPage JSON-LD answer, with no raw {slot}", async () => {
    const { ld, text } = await renderFaq(locale);
    expect(ld.mainEntity).toHaveLength(8);
    for (const q of ld.mainEntity) {
      expect(text, q.name).toContain(q.name);
      expect(text, q.name).toContain(q.acceptedAnswer.text);
      expect(q.acceptedAnswer.text).not.toMatch(/\{[a-z]+\}/);
    }
  });
});

describe("drop size is 3 to 5 products (facts.md §7)", () => {
  it.each([
    ["Faq.a8", en.Faq.a8, mk.Faq.a8],
    ["About.body3", en.About.body3, mk.About.body3],
    ["Meta.homeDescription", en.Meta.homeDescription, mk.Meta.homeDescription],
  ])("%s", (_key, enValue, mkValue) => {
    expect(enValue).toContain("3 to 5 products");
    expect(mkValue).toContain("3 до 5 производи");
  });

  it("no catalog string says 3 to 5 pieces any more", () => {
    expect(JSON.stringify(en)).not.toContain("3 to 5 pieces");
    expect(JSON.stringify(mk)).not.toContain("3 до 5 парчиња");
  });
});

describe("MK agrees with the masculine „дроп“ (D-Y.11-5)", () => {
  it("the ended banner says „за следниот“ (the drop), not the neuter „следното“ left from „спуштање“", () => {
    expect(mk.Drop.endedFollow).toBe("Следи {handle} за следниот.");
  });

  it("no MK string still says „спуштање“", () => {
    expect(JSON.stringify(mk)).not.toMatch(/спушт|Спушт/);
  });
});

describe("catalog meta description", () => {
  it("does not describe a drop as active", () => {
    expect(en.Meta.catalogDescription).not.toMatch(/active/i);
    expect(mk.Meta.catalogDescription).not.toMatch(/активн/i);
  });
});

describe("llms.txt", () => {
  it("states no per-order unit limit and no timer promise", async () => {
    const body = await llmsTxt().text();
    expect(body).not.toMatch(/units? per order|maximum of \d|max(imum)? \d+ units?/i);
    expect(body).not.toMatch(/countdown|timer/i);
  });

  it("says ordering is closed between drops and names the Instagram handle", async () => {
    const body = await llmsTxt().text();
    expect(body).toMatch(/ordering is closed/i);
    expect(body).toContain(HANDLE);
    expect(body).toContain("3 to 5 products");
  });
});

describe("web app manifest", () => {
  it("is Macedonian and uses the MK home description", () => {
    const m = manifest();
    expect(m.lang).toBe("mk");
    expect(m.description).toBe(mk.Meta.homeDescription);
  });
});
