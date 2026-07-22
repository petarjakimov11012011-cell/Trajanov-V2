# Part 2 · Phase 2.04b — SEO/GEO polish (llms.txt, logo, icons, IndexNow) — Code

**Role:** Claude Code · **Branch:** `phase-2.04b-seo-geo-polish` · **One PR to `main`.**
**Read before starting:** `CLAUDE.md`, `src/_project-state/current-state.md` (live), `facts.md`,
`brand.md`, `src/lib/seo/site-jsonld.ts`, `src/lib/metadata.ts`, `src/app/sitemap.ts`,
`src/app/robots.ts`, `src/lib/site.ts`, `src/lib/social.ts`.

> **Branch discipline:** confirm no other phase branch is open before cutting this one
> (`current-state.md` line 1 currently reads `NEXT: 2.05`). This is a small pre-cutover polish; it
> must merge **before** 2.05 flips `SITE_URL`, or rebase onto whatever 2.05 lands.

---

## Why this phase

2.04 shipped the SEO foundation (sitemap, robots, JSON-LD, OG cards, hreflang, Lighthouse SEO 100).
Three small gaps remain that improve how Trajanov appears in **Google's search result** and in **AI
answer engines (GEO)**, none of which touch commerce logic:

1. No `llms.txt` (the plain-language file some AI crawlers/agents read).
2. No brand **logo** — so the Organization JSON-LD deliberately omits `logo`, and Google/AI have no
   mark to show next to the brand name.
3. Only a `favicon.ico`; no modern icon set or web manifest.

Plus one cutover-adjacent item: an **IndexNow** key file so Bing/Yandex re-crawl instantly on change.

**Hard rules unchanged:** `facts.md` is the only source of factual claims; nothing hardcodes
`trajanov.com` (build every absolute URL from `SITE_URL`); do not touch `supabase/`, `create_order`,
`expire_reservations`, cart, stock, or `src/config/`; `npm test` (incl. the 10-vs-3 oversell gate),
`npm run build`, `npm run lint`, `npx tsc --noEmit` all green before the PR.

---

## Task 1 — `llms.txt` (route, not a static file)

Add `llms.txt` served at the site root, built **the same way `robots.ts`/`sitemap.ts` are** — a
route that reads `SITE_URL` and reuses the **same indexable-route list the sitemap already derives**
(next-intl `getPathname`). Do **not** hand-type slugs and do **not** hardcode the domain.

Content rules:
- Markdown format per the llms.txt convention: an `# H1` title, a one-paragraph `>` blockquote
  summary, then link sections.
- **Every factual claim traced to `facts.md`.** Permitted facts only: brand name *Trajanov*; from
  *Strumica, North Macedonia*; founded *2026*; founder *Vladimir Trajanov*, a secondary-school
  clothing-design student who **won first place** in a national t-shirt design competition
  (Kreativen den × EAM, June 2026); product = **oversized unisex t-shirts** sold in **limited drops**
  (3–5 products go live against real, limited stock when a countdown ends); **cash on delivery only**;
  **ships within North Macedonia**; **max 2 units per order**; Instagram **@trajanovv2026**; phone
  **078 820 520**.
- **Excluded** (unverified/owed — do not write): prices, sizes, fabric/composition, email, any
  address, review/rating/partner/award-beyond-the-one-win claims (`facts.md` §10).
- Link sections point to the **real indexable routes** (both `/…` MK and `/en/…`) as absolute URLs on
  `SITE_URL`: Home, About, Catalog, Terms, Privacy, Shipping & Returns, Contact. Pull these from the
  same source the sitemap uses so they stay correct automatically.
- State plainly that the site is bilingual **MK (default) / EN**. Write the file's prose in English
  (the practical lingua franca for LLM crawlers) but list both-locale URLs.
- Add `llms.txt` to `robots.txt`'s allowed paths implicitly (it's not disallowed) and **do not add it
  to the sitemap** (it's not a page). Consider `X-Robots-Tag: noindex` on the response so it doesn't
  surface as a search result.

Verify: `curl -s $SITE_URL/llms.txt` returns valid markdown with only facts.md-verified claims and
absolute URLs matching the sitemap's.

---

## Task 2 — Brand logo + Organization `logo` in JSON-LD  *(owner-level — see note)*

> **Owner-level decision (`D-0-…`): introduce a brand wordmark.** The 2.04 author correctly refused
> to *fabricate* a logo. This task adds a **real, minimal typographic wordmark** — the word
> "Trajanov" set in the brand display font and brand colours from `brand.md` — which is a legitimate
> brand mark, **not** the AI-generated *product* imagery barred by `D-0-6`. Recommended, because the
> Google search result and AI cards look unfinished without a logo. **Downside/accepted:** it's a
> visual-brand decision being made outside a Design phase; if Lazar wants a properly designed mark
> first, **skip Task 2 entirely** and ship Tasks 1, 3, 4. Log the outcome either way in `Decisions.md`.

If proceeding:
- Create a clean **SVG wordmark** `public/logo.svg` (and a `512×512` PNG `public/logo-512.png` on a
  solid brand background for platforms that require raster/square). Use **only** `brand.md` tokens for
  colour and font — no hardcoded hex or font name. Text-only; no invented emblem.
- Add `logo` to the Organization node in `src/lib/seo/site-jsonld.ts` as an **absolute URL on
  `SITE_URL`** (`${SITE_URL}/logo-512.png`). Update the file's header comment: the "NO `logo`" line no
  longer applies because a real mark now exists — say why, don't just delete it.
- Keep OG cards as they are (2.04 already ships typographic OG cards).

Verify: JSON-LD validates (Google Rich Results Test / schema.org validator); `logo` resolves to a real
200 image on the current origin.

---

## Task 3 — Icon set + web manifest

- Add `src/app/icon.svg` (or `icon.png` 512, and `apple-icon.png` 180) using the App Router icon
  convention, derived from the same wordmark/mark. If Task 2 is skipped, use the existing favicon
  glyph rather than inventing a new mark.
- Add a **web manifest** (`src/app/manifest.ts`) with `name: "Trajanov"`, `short_name`, the icons,
  `theme_color`/`background_color` **from `brand.md` tokens**, `lang: "mk"`, `start_url: "/"`. No
  screenshots, no invented description beyond the facts.md summary.

Verify: Lighthouse "PWA/Installable" icon checks pass; favicon renders crisp on a retina tab.

---

## Task 4 — IndexNow key file (cutover-ready)

- Generate an IndexNow key (a 32-char hex string is fine) and serve it as a static key file at the
  site root (`public/<key>.txt` containing the key, per the IndexNow spec). Record the key in the
  completion report so the operator can register it in Bing Webmaster Tools.
- Add a tiny server helper `pingIndexNow(urls: string[])` that POSTs changed URLs to the IndexNow
  endpoint using `SITE_URL` as host — **but do not wire it to fire automatically yet** (pinging is
  meaningless until the real domain is live). Leave it exported and documented for a post-2.05 hook.
- **Do not** put the key anywhere secret-sensitive; it's public by design (it's how the protocol
  proves ownership). This is not a secret under `D-0-1` — but say so explicitly in the report.

Verify: `curl -s $SITE_URL/<key>.txt` returns the bare key.

---

## Definition of Done

**Verifiable by you (Code):**
- `llms.txt` serves valid markdown, facts.md-clean, absolute URLs from `SITE_URL`, matches sitemap
  route set; `noindex` header present.
- If Task 2 ran: `logo.svg` + `logo-512.png` exist from brand tokens; Organization JSON-LD carries a
  resolving absolute `logo`; validates in a structured-data validator.
- Icon set + manifest present and correct; brand tokens only, no hardcoded values.
- IndexNow key file serves; helper exported, not auto-firing; key recorded in the report.
- `npm test` green (incl. the 10-vs-3 oversell gate), `npm run build && npm run lint && npx tsc
  --noEmit` clean. `SITE_URL` untouched; no `supabase/`, orders, cart, stock, or `src/config/` touched;
  no new npm dependency without recording it in `00_stack-and-config.md`.

**Owed to Lazar (register in `current-state.md`):**
- Human **OG/logo paste-test** after cutover (Instagram/Viber render).
- **Register the IndexNow key** in Bing Webmaster Tools (ops, post-domain).
- Confirm the wordmark is acceptable brand direction (if Task 2 ran) — flag for Lazar/Design sign-off.

**Process:** log every on-the-fly decision in `Decisions.md` (`D-2.04b-n`, each naming the rejected
alternative + accepted downside) — at minimum the Task 2 logo call and the Task 1 "add llms.txt
despite no proven ranking benefit" call. Update `current-state.md` (NEXT line, registers), `file-map.md`
(new files), and `00_stack-and-config.md` if anything changed. Open one PR; file the completion report
in `src/_project-state/completions/`. Surface all decisions for orchestrator ratification.

**No UI phase closes sight-unseen:** render the homepage and one content page; confirm the favicon,
the share/logo, and that `llms.txt` + the key file resolve. If you can't render, list the exact URLs
+ a 5-item checklist for Lazar.
