# Completion report — Part 2 Phase 05: Cutover to `trajanovv.com`

| | |
|---|---|
| **Phase** | 2.05 |
| **Name** | Cutover — real domain, branded email, published contact |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-22 |
| **Branch** | `phase-2.05-cutover` |
| **PR** | (opened this session → `main`) |
| **Brief** | Part 2 · Phase 05 · Code — Cutover to `trajanovv.com` |

---

## 1. What shipped

- **The site now emits its real domain everywhere.** `SITE_URL` flipped to `https://www.trajanovv.com`,
  so `/sitemap.xml`, `/robots.txt`, every `canonical` + `hreflang`, the OG image URLs, the Organization
  JSON-LD `@id`/`logo`, and `/llms.txt` links all point at the live domain — **grep-proven clean** of the
  old `trajanov-v2.vercel.app` and the single-v `trajanov.com`.
- **Order emails send from `info@trajanovv.com`** instead of `onboarding@resend.dev`.
- **The contact email is published** on the Contact page in both locales as a real `mailto:` — the last
  UI placeholder on a shipped page (#5) is gone.
- **Shipping & Returns states a real delivery time** ("3–5 business days" / „3–5 работни дена"); the
  courier placeholder now covers only courier + cost.
- **The 2.03 MK legal review is signed off**, and `facts.md` §5/§7/§9 now match reality (email published,
  delivery time verified, domain purchased).

The store is live, browsable, and honest on its real address. Nothing is buyable yet — no real drop is
scheduled (that is gated on Vladimir's content, 2.06/Y.01).

---

## 2. Decisions I made on my own

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| `D-2.05-6` | `SITE_URL = https://www.trajanovv.com` (the **www** canonical host), not the apex the brief named. | Follow the brief and use the apex `trajanovv.com`. | Diverges from the brief's / `D-2.05-1`'s literal "trajanovv.com" wording by the `www.` prefix. **Confirmed with Petar before proceeding** (see §3). |
| `D-2.05-7` | Reworded `ShippingReturns.deliveryBody` to scope "not confirmed yet" to **courier + cost** (delivery time is now VERIFIED and shown); and changed the **one** order-email from-address (no customer-confirmation email exists). | Leave `deliveryBody` unchanged; invent a customer-confirmation email to match the brief's "both … and …" wording. | `deliveryBody` copy changed beyond the brief's literal task list (humanizer + facts check run, voice unchanged); Task 3's "both" is satisfied by the single existing sender. |

`D-2.05-1…5` were provided verbatim in the brief and appended verbatim (domain, placeholder-register
override, `info@` routing, Turnstile rotation, analytics deferral).

---

## 3. Surprises and off-spec changes

- **Apex vs www — the brief was wrong against live reality (the big one).** The brief's Task 2 says set
  `SITE_URL` to the **apex** `https://trajanovv.com` ("apex, no trailing slash"). But live production
  canonicalises on **www**: `https://www.trajanovv.com/en` returns **200**, while the apex `trajanovv.com`
  **and** `trajanov-v2.vercel.app` both **308-redirect to www** (curl-verified this session). Setting the
  apex would have pointed every canonical/OG/JSON-LD/sitemap URL at a host that redirects — the exact
  Known-issue-#10 problem the cutover exists to fix. **I stopped and asked Petar**, who chose www (matching
  the state note written at the 2.04b merge). Logged as `D-2.05-6`. If the brand later wants the apex to be
  canonical, an operator must make the apex Vercel's **primary** domain (www→apex) first, then flip
  `SITE_URL` back — a one-line change.
- **There is no customer-confirmation email.** The brief's Task 3 says change the `from` for "both the
  Vladimir notification **and** the customer confirmation." The app collects no customer email (`D-Z.01-1`)
  and sends no customer confirmation — there is exactly one email (`order-notification.ts`). So Task 3 was a
  single `ORDER_FROM_ADDRESS` change, not two. (`D-2.05-7`.)
- **Turnstile asserts no hostname — Task 6 was a code no-op.** `src/lib/turnstile/verify.ts` checks
  `data.success` only; it never reads or allowlists `data.hostname`. Hostname allowlisting is enforced by
  the Cloudflare **widget** config (hostnames `trajanovv.com` + `www`, `D-2.05-4`), not our code. So no code
  change was needed to accept the new domain. The new **public** site key `0x4AAAAAAD6pSIvEa1p8GkZX` is
  recorded in the docs/decisions per the brief; it is not hardcoded in code (the widget reads it from
  `NEXT_PUBLIC_TURNSTILE_SITE_KEY`).
- **Adding the delivery time made the old delivery copy false.** `deliveryBody` said "we don't have **these**
  [courier/time/cost] confirmed yet" — true before, false once the time is shown. I narrowed it to
  courier + cost so the page doesn't contradict itself (`D-2.05-7`). The delivery-time strings themselves
  are used **verbatim** as the brief required.
- **`Placeholder.email` key removed.** With the email published, the `Placeholder.email` key was dead; I
  removed it from both catalogs (kept parity) and regenerated `string-inventory.md`.

---

## 4. Files touched

`file-map.md` updated: **yes** (only the stale `site.ts` `TODO(2.05)` note — no files added/moved/deleted).

| File | A/M/D |
|---|---|
| `src/lib/site.ts` | Modified — `SITE_URL` → `https://www.trajanovv.com` (+ comment) |
| `src/lib/email/order-notification.ts` | Modified — `ORDER_FROM_ADDRESS` → `info@trajanovv.com` |
| `src/lib/social.ts` | Modified — added `EMAIL` / `EMAIL_MAILTO` constants |
| `src/app/[locale]/contact/page.tsx` | Modified — real `mailto:` replaces the email `<Placeholder>`; dropped unused `Placeholder`/`tp` |
| `src/app/[locale]/shipping-returns/page.tsx` | Modified — renders `deliveryTime` line |
| `src/messages/mk.json` · `src/messages/en.json` | Modified — `+deliveryTime`, reworded `deliveryBody`, narrowed `Placeholder.courier`, removed `Placeholder.email` |
| `src/lib/seo/indexnow.ts` | Modified — stale single-v comment fixed |
| `tests/email/order-notification.test.ts` | Modified — asserts new from-address |
| `docs/i18n/string-inventory.md` | Modified — regenerated (214 keys) |
| `docs/i18n/mk-review-2.03.md` | Modified — sign-off blocks filled |
| `facts.md` | Modified — §5 email, §7 delivery time, §9 domain |
| `Decisions.md` | Modified — appended `D-2.05-1…7` |
| `src/_project-state/current-state.md` | Modified — line 1, Status, Built, both registers, Known issues, summary table |
| `src/_project-state/00_stack-and-config.md` | Modified — Email/Bot/Hosting/DNS/Analytics/Cost rows + change-log |
| `src/_project-state/file-map.md` | Modified — `site.ts` note |

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | ✅ pass (all routes compile; the four static SEO routes emit) |
| Types | `npx tsc --noEmit` | ✅ clean |
| Lint | `npm run lint` | ✅ clean |
| Unit / integration | `npm test` | ✅ **85 passed / 85** (incl. the updated email from-address assertion + i18n parity with the new `deliveryTime` key / removed `email` key) |

**Concurrency (frozen code, re-run — no `create_order`/`expire_reservations`/migration touched):**

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0` (passes in isolation and in the full run) |

**Grep gate (DoD):** across the emitted `/sitemap.xml`, `/robots.txt`, `/llms.txt`, and page HTML
(canonical/hreflang/OG/JSON-LD) — **`trajanov-v2.vercel.app` = 0**, **single-v `trajanov.com` = 0**,
**`www.trajanovv.com` = 180**. In code (excluding docs), no forbidden host in any URL/canonical/OG/schema.

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| `SITE_URL` = `https://www.trajanovv.com`; sitemap/robots/canonicals/OG/JSON-LD/llms.txt all emit it | ✅ (www, per `D-2.05-6` — see §3) |
| Grep gate: zero `trajanov-v2.vercel.app` / single-v `trajanov.com` in emitted URLs/canonicals/OG/schema | ✅ |
| Order-email `from` = `info@trajanovv.com` (notification); `ORDER_NOTIFICATION_EMAIL` unchanged; email tests pass | ✅ (no customer confirmation exists — §3) |
| Contact shows working `mailto:info@trajanovv.com` both locales; no `Placeholder.email` renders | ✅ (curl: MK „Е-пошта", EN "Email", both + mailto; removed key absent) |
| Shipping shows „3–5 работни дена" / "3–5 business days"; courier placeholder = courier + cost; returns-window unchanged | ✅ (rendered + curl both locales) |
| Server-side Turnstile accepts new hostname **or** report states no hostname assertion; site-key change noted | ✅ code does **not** assert hostname (no change); key `0x4AAAAAAD6pSIvEa1p8GkZX` noted |
| `docs/i18n/mk-review-2.03.md` sign-off filled (Lazar + Petar, 2026-07-21, incl. `Common.skipToContent`) | ✅ (owed #10 cleared) |
| `facts.md` §5/§7/§9 updated per Task 8; `Decisions.md` `D-2.05-1…5` verbatim; state files incl. line-1 `NEXT: 2.06` | ✅ |
| Standing gates green incl. 10-vs-3 oversell; no frozen file changed | ✅ |
| Secrets check (public repo) | ✅ (see §9) |

### Owed to Lazar (real device / open drop)

| # | Item | Steps | What "pass" looks like |
|---|---|---|---|
| 11 | OG/logo paste-test on the real domain | Paste MK+EN Home + Product `www.trajanovv.com` URLs into Instagram story/DM **and** Viber | Branded card renders — image + title, Cyrillic intact on MK |
| 12 | PageSpeed mobile re-check | PageSpeed Insights (mobile) on live `www.trajanovv.com` Catalog + Checkout | Performance ≥ 95, or residual noted + accepted |
| 14 | Register the IndexNow key in Bing Webmaster Tools | Now actionable (domain live) | Bing accepts key `78dec4b97e3fbb0f22d1c8df38050f74` |
| 15 | Live Turnstile captcha on real-domain checkout | 2.06 rehearsal: open a test drop, reach `/checkout` on `www.trajanovv.com` | Turnstile renders + a real order verifies server-side |
| 16 | Real order email from `info@` end to end | 2.06 rehearsal order | Notification arrives, `from: info@trajanovv.com` |

**These already deployed?** No — **2.05 is PR-open, not merged**; the flip/branded email take effect on the
merge-triggered redeploy. All rendered/curled checks above were run against a local `next` build of the
2.05 branch.

---

## 7. Placeholders shipped

**None new.** This phase **cleared** #5 (email published) and **narrowed** #6 (courier placeholder →
courier + cost). #2, #3, #4, #7 remain open — cutover proceeded with them open on Lazar's explicit
override (`D-2.05-2`); **the register must reach zero before the first REAL drop opens (2.06 gate)**, not
before cutover.

| Placeholder | Page | Waiting on | Owner |
|---|---|---|---|
| `[PLACEHOLDER: курир и цена на испорака — Владимир]` (narrowed) | Shipping & Returns | Courier + delivery cost | Vladimir |
| (#2 photos, #3 fabric, #4 names, #7 returns window — unchanged) | Catalog/Product/Shipping | Vladimir's content | Vladimir |

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED entry in `facts.md` | ✅ (email §5, delivery time §7, domain §9 — all updated to VERIFIED this phase) |
| `humanizer` pass run on user-facing copy | ✅ (the reworded `deliveryBody` — plain, present-tense, no filler) |
| No fashion-magazine filler | ✅ |
| No invented testimonials / reviews / counts / awards / partners / team / address | ✅ |
| Template-propagated strings verified once against `facts.md` | ✅ (delivery-time strings used verbatim as reviewed) |
| No AI-generated product imagery (`D-0-6`) | ✅ (no imagery touched) |
| No untranslated EN string in the MK build | ✅ (MK „Рок на достава…", „Е-пошта", narrowed MK placeholder — curl-verified `lang="mk"`) |

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, secret email, or credential in any committed file | ✅ — only the **public** Turnstile *site* key (in docs, per the brief) + the **public** `info@trajanovv.com` appear; no secret key / `RESEND_API_KEY` / `TURNSTILE_SECRET` value |
| `.env*` still gitignored | ✅ (only `.env.example` tracked) |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ✅ (no env var added) |
| No order PII (phone, address) in logs | ✅ (no logging changed) |

No secret was committed at any point on this branch.

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| Merge + redeploy (the flip takes effect on redeploy) | An operator merges the PR (`D-0-3`) | Petar / Lazar |
| Cloudflare Web Analytics beacon | Analytics token (deferred `D-2.05-5`) | Lazar (ops) |
| Owed #11/#12/#14/#15/#16 | Real device / open drop (2.06) | Lazar |
| Placeholders #2/#3/#4/#7 → zero before first real drop | Vladimir's content (Y.01) | Vladimir |

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ✅ (`NEXT: 2.06`) |
| `current-state.md` — owed-verification register | ✅ (#8/#9/#10 struck; #11/#12 re-pointed; +#15/#16) |
| `current-state.md` — placeholder register | ✅ (#5 struck, #6 narrowed) |
| `file-map.md` — matches disk | ✅ (site.ts note; no files added) |
| `00_stack-and-config.md` — deps / pins / config | ✅ (change-log row; no new dep) |
| `Decisions.md` — every §2 entry appended | ✅ (`D-2.05-1…7`) |

**`NEXT:` line I set:** `NEXT: 2.06 — Drop rehearsal + contingency.`
