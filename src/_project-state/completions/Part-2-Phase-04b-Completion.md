# Completion report — Part 2 Phase 2.04b: SEO/GEO polish (llms.txt, logo, icons, IndexNow)

| | |
|---|---|
| **Phase** | 2.04b |
| **Name** | SEO/GEO polish — `llms.txt`, brand logo, icon set + manifest, IndexNow key |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-22 |
| **Branch** | `phase-2.04b-seo-geo-polish` |
| **PR** | #14 — **MERGED to `main`** (merge `c562195`, 2026-07-22) on Petar's explicit instruction (`D-0-3`) |
| **Brief** | `briefs/Part-2-Phase-04b-SEO-GEO-Polish-Code.md` |

---

## 1. What shipped

- **`llms.txt`** now serves at `/llms.txt` — the plain-language file AI crawlers/agents read. A
  `noindex`, English-prose, `facts.md`-clean summary of the brand with **both-locale absolute URLs**
  (Home, About, Catalog, Terms, Privacy, Shipping & Returns, Contact) pulled from the same route list the
  sitemap uses, so they can't drift.
- **Trajanov has a real logo.** A typographic wordmark ("Trajanov" in the brand display font Rubik +
  brand colours) ships as `public/logo.svg` + `public/logo-512.png`, and the Organization JSON-LD now
  carries a resolving absolute `logo` — so Google's search result and AI answer cards have a mark to show
  next to the brand name. The 2.04 "no logo" refusal is resolved (a real mark now exists; it's typography,
  not the AI product imagery `D-0-6` bars).
- **A modern icon set + web manifest.** A "T"-monogram favicon (`src/app/icon.svg`), Apple touch icon,
  192/512 PNGs, and `src/app/manifest.ts` make the site installable and give it a crisp retina favicon
  instead of only a legacy `.ico`.
- **IndexNow is cutover-ready.** A public key file serves at the root and a `pingIndexNow()` helper is
  exported (but deliberately wired to nothing) so that, post-domain, Bing/Yandex can be told to recrawl on
  change.
- **Zero commerce logic touched**, no new npm dependency, and all four gates (build/tsc/lint/test incl.
  the 10-vs-3 oversell gate) are green.

---

## 2. Decisions I made on my own

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| `D-2.04b-1` | **Proceed with Task 2** — ship a real typographic wordmark + wire it into the Organization `logo`. | Skip Task 2, leave the Organization node logo-less until a Design phase. | A visual-brand call made outside a Design phase — **flagged for Lazar/Design sign-off** (register #13). Replaceable in one regeneration + commit. |
| `D-2.04b-2` | **Ship `llms.txt`** despite no measured ranking/answer-engine benefit. | Don't ship it (young convention, unproven effect). | Another factual-claim surface to keep `facts.md`-clean; can go stale. It's `noindex` and not in the sitemap, so no SEO risk. |
| `D-2.04b-3` | **Extract one shared route module** (`src/lib/seo/routes.ts`) and refactor `sitemap.ts` onto it; `llms.txt` reads the same. | Copy the route list into `llms.txt`, leaving the sitemap as-is. | A 2.04 file (`sitemap.ts`) was refactored — a slightly bigger diff — to make "cannot drift" real rather than aspirational. |
| `D-2.04b-4` | The favicon/app icon is a **"T" monogram** derived from the wordmark, not the full wordmark. | Use the full wordmark as the favicon. | A tab glance reads "T", not "Trajanov". A wordmark is illegible at 16–32px; every brand derives a monogram. |
| `D-2.04b-5` | Generate the PNG marks with **`next/og`** (already in Next) in a committed manual script; mirror brand token **values** as literals in the asset files. | Add an image toolchain dep (`sharp`/`canvas`); or draw/AI-generate the marks. | Token values duplicated as literals (change `brand.md` first, then here — same as `globals.css`/OG, `D-2.04-2`); generator run by hand. **No new dependency.** |
| `D-2.04b-6` | Commit the IndexNow key as a **public** file + export `pingIndexNow()` **un-wired**. | Wire the ping now, or defer the key to 2.05. | No instant recrawl until a post-2.05 hook + Bing registration; helper ships as dead-but-typed code. The key is public by design, **not a `D-0-1` secret**. |

---

## 3. Surprises and off-spec changes

- **`next/og` runs fine in a standalone `tsx` script** (not just in a route handler), which is what let me
  generate the raster marks with **zero new dependency** — I de-risked this first before committing to the
  approach. It needs an async wrapper (top-level await fails under tsx's CJS output) and `tsx`, not bare
  `node` (which can't resolve `next/og`'s export map).
- **The brief said "no hardcoded hex or font name" for the logo, but an SVG/PNG/JSON asset physically
  cannot read a CSS custom property.** I read the intent as "no *invented* colours — every value traced to
  `brand.md`", and mirrored the token **values** as literals exactly like the existing OG route and
  `globals.css` do (`D-2.04-2`). Flagged here so nobody reads the literals as a token violation.
- **`llms.txt` is `force-static`, not `force-dynamic`.** The brief said "built the same way
  robots.ts/sitemap.ts are". `robots.ts` is static; `sitemap.ts` is dynamic *only because it reads the
  DB*. `llms.txt` reads no DB (it links the catalog page, not individual products), so static is correct
  and cacheable — same net behaviour, and it still rebuilds from `SITE_URL` at 2.05 cutover.
- **I refactored `sitemap.ts`** (a 2.04 file). Necessary to make "reuse the same list" literally true. No
  sitemap test exists to regress; the build + a curl of both surfaces confirm parity (sitemap still lists
  all routes; llms.txt matches its slugs).
- **`logo.svg` has a transparent background** (mustard wordmark), so it composits onto the dark brand
  ground and is only high-contrast on dark — by design, matching the dark-only brand. The **PNG**
  (`logo-512.png`, the JSON-LD asset) has the solid ground background the brief asked for.
- **⚠️ DOMAIN CHANGED — discovered at the merge (2026-07-22), reported to Petar, confirmed his.** While
  smoke-verifying the deploy, production `https://trajanov-v2.vercel.app` was found to **308-redirect to
  `https://www.trajanovv.com`** — a real custom domain (**`trajanovv.com`, double-v**, matching the IG
  handle `@trajanovv2026`) attached to the Vercel project **outside this repo**. Petar confirmed the
  domain is his and chose to **leave `SITE_URL` on the vercel.app origin until the full 2.05 cutover.**
  Consequences the orchestrator must carry into **2.05**: (a) `SITE_URL` (`src/lib/site.ts`) must flip to
  `https://www.trajanovv.com`, because **every** absolute URL this phase (and 2.04) emits — canonical,
  hreflang, JSON-LD `logo`/`@id`, sitemap, OG, llms.txt links — currently points at the redirecting
  vercel.app host; (b) **`facts.md` §9 is now STALE** — it records the target as `trajanov.com`
  **single-v**, "NOT YET PURCHASED"; the live domain is double-v and bought. **Code did NOT edit
  `facts.md` or `SITE_URL`** (owner/orchestrator call, and Petar deferred it). Logged in `current-state.md`
  (line 1, Domain row, Known issue #10, parallel track).

---

## 4. Files touched

`file-map.md` updated: **yes.**

| File | Added / Modified / Deleted |
|---|---|
| `src/app/llms.txt/route.ts` | Added |
| `src/lib/seo/routes.ts` | Added (shared indexable-route list + `absoluteUrl`) |
| `src/lib/seo/indexnow.ts` | Added (`INDEXNOW_KEY` + un-wired `pingIndexNow`) |
| `src/app/icon.svg` | Added ("T"-monogram favicon) |
| `src/app/apple-icon.png` | Added (180×180 monogram) |
| `src/app/manifest.ts` | Added (web manifest) |
| `public/logo.svg` | Added (wordmark, embedded Rubik) |
| `public/logo-512.png` | Added (wordmark on ground → JSON-LD `logo`) |
| `public/icon-192.png`, `public/icon-512.png` | Added (manifest icons) |
| `public/78dec4b97e3fbb0f22d1c8df38050f74.txt` | Added (IndexNow key file) |
| `scripts/generate-brand-assets.ts` | Added (`next/og` asset generator) |
| `src/app/sitemap.ts` | Modified (refactored onto `routes.ts`) |
| `src/lib/seo/site-jsonld.ts` | Modified (Organization `logo` + comment rewrite) |
| `tests/seo/site-jsonld.test.ts` | Modified (positive `logo` assertion; stale "no logo" removed) |
| `package.json` | Modified (`assets:brand` script only — **no dependency**) |
| `Decisions.md`, `current-state.md`, `file-map.md`, `00_stack-and-config.md` | Modified (state duties) |

**Untouched (asserted):** `supabase/`, `create_order`, `expire_reservations`, cart, stock, `src/config/`,
`src/types/database.ts`, `SITE_URL`. No file deleted.

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | ✅ Pass — `/llms.txt`, `/icon.svg`, `/apple-icon.png`, `/manifest.webmanifest` compiled as static routes |
| Types | `npx tsc --noEmit` | ✅ Pass (clean; `scripts/**` is in the tsc include and passes) |
| Lint | `npm run lint` | ✅ Pass (0 problems) |
| Unit / integration | `npm test` | ✅ **85 passed / 85** (84 + 1 new JSON-LD-logo assertion) |

**Concurrent-order gate (re-run as standing protection — not modified this phase):**

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/orders/create-order.concurrency.test.ts` (run via `npx vitest run -t "10 simultaneous orders"`) |
| Output | `✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0` — 1 passed |

Nothing in this phase touches order, stock, or reservation logic; the gate is re-run to prove that.

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| `llms.txt` serves valid markdown, `facts.md`-clean, absolute URLs from `SITE_URL`, matches sitemap route set | ✅ curl: `H1` + `>` blockquote + link sections; only permitted facts; slugs match sitemap |
| `llms.txt` `noindex` header present | ✅ `x-robots-tag: noindex` + `content-type: text/plain; charset=utf-8` |
| `llms.txt` absent from sitemap | ✅ `grep -c llms.txt` on `sitemap.xml` = 0 |
| `logo.svg` + `logo-512.png` exist, from brand tokens, text-only | ✅ generated via Rubik + brand values; wordmark only |
| Organization JSON-LD carries a resolving absolute `logo` | ✅ HTML: `"logo":"https://trajanov-v2.vercel.app/logo-512.png"`; `/logo-512.png` → 200 `image/png` |
| JSON-LD still valid (no address / SearchAction / partner; `sameAs` = one IG) | ✅ well-formed JSON, unit-tested; **live Rich Results Test owed to Lazar (#11)** |
| Icon set + manifest present, brand tokens only, no invented values | ✅ `/icon.svg`, `/apple-icon.png`, `/icon-{192,512}.png` 200; `/manifest.webmanifest` valid JSON; head `<link>`s injected |
| IndexNow key file serves the bare key; helper exported, not auto-firing | ✅ `/…​.txt` → bare 32-byte key; `pingIndexNow` exported, called by nothing (grep) |
| `npm test` / build / lint / tsc green; `SITE_URL` untouched; no forbidden dirs; no new dep | ✅ all green; asserted above |
| Homepage + one content page rendered; favicon/logo/llms.txt/key file resolve | ✅ Home + About render clean (no console errors); `logo.svg` wordmark eyeballed in-browser |

### Owed to Lazar (only he / a real device / a real account can confirm)

| # | Item | Exact URL / steps | What "pass" looks like |
|---|---|---|---|
| 13 | **Wordmark brand-direction sign-off** (`D-2.04b-1`) | Open `public/logo.svg` / `logo-512.png`; decide if this typographic mark is acceptable brand direction | Lazar/Design approves, or asks for a designed mark (swap the file + one commit) |
| 14 | **Register the IndexNow key in Bing Webmaster Tools** (`D-2.04b-6`) | After 2.05 domain is live: add key `78dec4b97e3fbb0f22d1c8df38050f74` (served at `${SITE_URL}/78dec4b97e3fbb0f22d1c8df38050f74.txt`) in Bing WMT | Bing accepts the key; a later `pingIndexNow()` submission is honoured |
| 11 (extended) | **OG + logo human paste-test** | After 2.04b deploys: paste MK+EN Home/Product URLs into Instagram/Viber; run Home through **Google Rich Results Test** | Card renders (image+title, Cyrillic intact) **and** the `logo` resolves/previews in the Rich Results Test |

**Sight-unseen check (satisfied):** I rendered the homepage (`/`) and the About page (`/za-nas`) in-browser
(no console errors), confirmed the "T" favicon marks and the wordmark render, and curl-verified that
`/llms.txt`, `/logo-512.png`, `/manifest.webmanifest`, the icon set, and the IndexNow key file all resolve.
5-item checklist for Lazar after deploy: (1) `${SITE_URL}/llms.txt` renders and reads honestly; (2)
`${SITE_URL}/logo-512.png` shows the wordmark; (3) the browser tab shows the "T" favicon crisply on retina;
(4) `${SITE_URL}/78dec4b97e3fbb0f22d1c8df38050f74.txt` returns the bare key; (5) the Instagram/Viber share
card + Google Rich Results `logo` look right.

---

## 7. Placeholders shipped

**None.** This phase shipped no `[PLACEHOLDER: …]` and cleared/reworded/hid none — the placeholder register
is byte-unchanged (#2–#7). The load-bearing rule held: **no placeholder value reaches `llms.txt`, the logo,
or the manifest.** `llms.txt` writes only `facts.md`-VERIFIED claims and links the catalog page (not
individual, still-unnamed products); the manifest description is a facts-clean one-liner; the marks are pure
brand typography.

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED entry in `facts.md` | ✅ `llms.txt` header carries the line-by-line trace; manifest description = §1/§7 |
| `humanizer` pass run on user-facing copy | ✅ `llms.txt` prose read for AI-tells; plain, present-tense, no filler |
| No fashion-magazine filler | ✅ none ("elevate"/"curated"/"vibrant" absent) |
| No invented testimonials / reviews / counts / awards / partners / team / address | ✅ excluded by design; only the one competition win, phrased once |
| Template-propagated strings verified once against `facts.md` before generation | ✅ the `PAGE_META` labels + summary checked against `facts.md` §1–§7 |
| No AI-generated product imagery (`D-0-6`) | ✅ marks are programmatic typography (the generator script is the proof), not generated pictures; no product imagery at all |
| No untranslated EN string in the MK build | ✅ n/a — `llms.txt` is deliberately English prose (LLM lingua franca), lists both-locale URLs; no MK UI string added |

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ✅ — the IndexNow key is **public by design, not a secret (`D-0-1`)**; no Supabase/Resend/Turnstile value committed |
| `.env*` still gitignored | ✅ unchanged |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ✅ n/a — no env var added |
| No order PII (phone, address) in logs | ✅ n/a — no order/log code touched |

**On the IndexNow key:** it is intentionally committed and printed here
(`78dec4b97e3fbb0f22d1c8df38050f74`). The IndexNow protocol **proves ownership by making the key publicly
fetchable** at `/<key>.txt` — a private key would defeat the mechanism. It grants no access, is not a
credential, and never needs rotating. This is **not** a `D-0-1` violation.

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| `pingIndexNow()` actually firing | The real domain (2.05) + a post-2.05 hook + Bing registration (#14) | Lazar (ops) |
| Branded from-address / final absolute URLs everywhere | 2.05 cutover flips `SITE_URL` → `trajanov.com`; this phase's files all rebuild from it | Lazar (2.05) |
| Wordmark as final brand direction | Lazar/Design sign-off (#13) | Lazar / Design |

Nothing is blocked on a parallel-track fact (photos/prices/sizes/fabric/email) — this phase needed none of
them.

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ✅ (stays `NEXT: 2.05`; 2.04b logged) |
| `current-state.md` — owed-verification register | ✅ (+#13, +#14; #11 extended) |
| `current-state.md` — placeholder register | ✅ (no change, noted) |
| `file-map.md` — matches what is actually on disk | ✅ |
| `00_stack-and-config.md` — new deps / pins / config | ✅ (no dep; `assets:brand` script + `next/og` reuse logged) |
| `Decisions.md` — every § 2 entry appended | ✅ (`D-2.04b-1…6`) |

**`NEXT:` line I set:** `NEXT: 2.05 — Cutover: buy trajanov.com, flip the SITE_URL constant, Cloudflare DNS
+ Web Analytics, and clear the placeholder + owed-verification registers before launch.`
