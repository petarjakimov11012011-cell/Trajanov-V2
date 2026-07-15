# Completion report — Part 1 Phase 05: About + Contact

| | |
|---|---|
| **Phase** | 1.05 |
| **Name** | About + Contact, and the press story |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-15 |
| **Branch** | `phase-1.05-about-contact` |
| **PR** | #5 (pending push/open — see §10) |
| **Brief** | `briefs/Part-1-Phase-05-Code.md` (as provided) |

---

## 1. What shipped

- **`/about` (MK + EN), static.** The competition story sourced entirely from `facts.md` §1–§4/§7:
  eyebrow → H1 → three body paragraphs → one pull-quote → a coverage list of **all five** press
  outlets as links → a link to `/catalog`. The quote renders in Macedonian on MK and as a marked
  English translation on EN. The coverage is a bare list — no count, no adjective, no logos.
- **`/contact` (MK + EN), static.** Phone (`078 820 520` → `tel:+38978820520`), the single Instagram
  account, and a visible email `[PLACEHOLDER]`. A one-line context (Strumica · ships North Macedonia
  only · cash on delivery). **No form, no address.**
- **Footer** now links About + Contact on every page (locale-aware), and its location line is
  translated (it was a hard-coded English string leaking into the MK build — fixed, `D-1.05-10`).
- **Home** shows one quiet link to About in its **countdown** and **ended** states, and nothing in
  live/opening. No hero photo and no photo slot were added (`D-1.05-4`). The header is unchanged.
- **Plumbing:** the phone joined `src/lib/social.ts` as a shared constant (imported, never retyped);
  new `About` + `Contact` string namespaces in both catalogs (identical key sets); the completion
  template's filename instruction was corrected.

---

## 2. Decisions I made on my own

`D-1.05-1` … `D-1.05-7` are the orchestrator's, appended to `Decisions.md` **verbatim** before this
report. My own start at `D-1.05-8`:

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| D-1.05-8 | About/Contact are statically **prerendered** via `setRequestLocale`; they build as `●` (SSG), not the literal `○` the DoD names. | Force plain `○` (unavailable under a `[locale]` dynamic segment); omit `setRequestLocale` (ships them `ƒ` dynamic — forbidden). | Build marker is `●`, not `○`. `●` **is** static prerender — a DoD wording gap, not a miss. |
| D-1.05-9 | Added `PHONE_DISPLAY` + `PHONE_TEL` to `src/lib/social.ts`; footer + Contact import them. | A separate `src/lib/contact.ts` (brief names `social.ts`); leave phone hard-coded per page (typo-multiplies). | `social.ts` now holds a non-"social" fact; header comment broadened. |
| D-1.05-10 | Fixed the footer's hard-coded English "Strumica, North Macedonia" → translated `Nav.location`. | Leave it (a standing-rule EN-in-MK violation, now beside translated copy I added); defer to 2.02 (that's a *copy* review). | A footer change slightly beyond the brief's "add two links" scope (left block, not the phone/IG block). |
| D-1.05-11 | Coverage dates render via the next-intl formatter (long month); the pull-quote keeps its verbatim per-locale date. | Numeric everywhere (EN `6/12/2026` is ambiguous); hard-code date strings (not locale-aware); harmonise the quote's date (it is verbatim `facts.md` §3). | MK list dates carry Intl's "г." suffix and differ from the MK quote's numeric date; both valid MK. |
| D-1.05-12 | `About.quoteNote` is empty on MK, "Translated from Macedonian" on EN; rendered only when present. | Give MK a redundant note; branch on locale and omit the MK key (breaks identical-key-sets). | An intentionally-empty value in `mk.json` can read as an oversight; mitigated by a code comment + `D-1.05-12`. |

---

## 3. Surprises and off-spec changes

- **`●` (SSG) vs `○` (Static).** The DoD asks for `○`. Next.js marks a statically-prerendered route
  that sits under the `[locale]` **dynamic segment** and uses the layout's `generateStaticParams` as
  `●` (SSG) — "prerendered as static HTML" — not `○`. The build output lists `/mk/about`, `/en/about`,
  `/mk/contact`, `/en/contact` all prerendered at build. This is the outcome the DoD *wants* (no
  per-request compute); the letter differs. **Suggest the brief say "static — `○` or `●`" for
  localised routes.** (`D-1.05-8`)
- **`setRequestLocale` is required for static rendering.** Without it, next-intl opts a route **into
  dynamic rendering** — the existing `styleguide` route proves it (it builds `ƒ` with no
  `force-dynamic`). Both new pages call `setRequestLocale(locale)`. Worth adding to the brief for 1.06+
  static pages.
- **The phone was not in `src/lib/social.ts`.** The brief states the phone "comes from
  `src/lib/social.ts`", but `social.ts` held only the IG constants and the footer hard-coded the phone.
  I added the phone constants there so the brief's premise holds and the footer no longer retypes it.
  (`D-1.05-9`)
- **Pre-existing EN-in-MK leak in the footer.** "Strumica, North Macedonia" rendered in English on the
  MK build (from 1.02/1.04). Since I was editing the footer and adding a *translated* Strumica line to
  Contact, I fixed it via `Nav.location` rather than leave a standing-rule violation next to new
  translated copy. (`D-1.05-10`) **Flagging in case the orchestrator wants footer copy frozen.**
- **No fact was missing to make either page look finished.** The competition story carries About on
  its own; Contact is honest with a visible email placeholder. Nothing was invented, and no section
  needed a fact we do not have. (Per the standing rule, if it had, I would have said so here.)

---

## 4. Files touched

`file-map.md` updated: **yes.**

| File | Added / Modified / Deleted |
|---|---|
| `src/app/[locale]/about/page.tsx` | Added |
| `src/app/[locale]/contact/page.tsx` | Added |
| `Trajanov-V2-Plan.md` (repo root) | Added (operator-provided, committed this branch — `D-1.05-1`) |
| `Trajanov-V2-Phase-Plan.md` (repo root) | Added (operator-provided, committed this branch — `D-1.05-1`) |
| `src/lib/social.ts` | Modified (phone constants + broadened header) |
| `src/components/layout/SiteFooter.tsx` | Modified (About/Contact links, phone import, translated location) |
| `src/components/home/HomeExperience.tsx` | Modified (Home→About link in countdown + ended) |
| `src/messages/mk.json` | Modified (About/Contact/Nav/Placeholder keys) |
| `src/messages/en.json` | Modified (parity) |
| `src/_project-state/completions/_TEMPLATE.md` | Modified (filename fix, Task 7) |
| `facts.md` | Modified — **operator's §4 rewrite** (working-tree change I did not author; committed this branch, Task 0) |
| `Decisions.md` | Modified (append-only: `D-1.05-1` … `D-1.05-12`) |
| `src/_project-state/current-state.md` | Modified (NEXT, Status, Built, both registers, parallel track, issue #6) |
| `src/_project-state/file-map.md` | Modified (new pages, planning docs, change log) |
| `src/_project-state/completions/Part-1-Phase-05-Completion.md` | Added (this file) |

**Not touched (confirmed):** anything under `src/lib/drop/`, `src/lib/orders/`, `src/config/`,
`supabase/`, `tests/`; the header; the Home live/opening/empty states; route slugs; `00_stack-and-config.md`
(no dependency or config changed).

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | **Pass.** 4 new routes prerendered static (`●`): `/mk/about`, `/en/about`, `/mk/contact`, `/en/contact`. |
| Types | `npx tsc --noEmit` | **Pass (exit 0).** |
| Lint | `npm run lint` | **Pass (exit 0), zero warnings.** |
| Unit / integration | `npm test` | **31 passed (10 files).** Unchanged from 1.04. |

**Concurrent-order test:** the mandatory concurrency section applies to Phases **1.03, 1.04, 1.08** —
1.05 is not one of them and touches **no** stock/order/DB code. The full suite (which includes the
`tests/concurrency/oversell.test.ts` 10-vs-3 gate) was re-run and **all 31 pass**, so the gate is
confirmed green even though this phase adds no tests and modifies none.

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| `/about`, `/en/about`, `/contact`, `/en/contact` render | ✅ (in-browser, 390px + 1180px) |
| Build shows the 4 routes as static (prerendered), not dynamic `ƒ` | ✅ `●` (SSG) — see §3 / `D-1.05-8` |
| Every factual claim on both pages is on the Task 1 permitted list | ✅ (walked claim-by-claim: 1–9, 11–13 on About; 1, 13 + phone/IG/email on Contact) |
| Nothing from the Task 1 forbidden list appears | ✅ (no "we"/team/atelier, no partner-framing of ЕАМ, no fabric claim, no address, no press count, no invented award) |
| Quote appears exactly once, About only, MK original + EN marked translation, name+outlet+date both | ✅ |
| About lists all five outlets; each URL matches `facts.md` §4 char-for-char (Cultural Chat Cyrillic, fbclid stripped) | ✅ (diffed — identical) |
| No press count, no characterisation of the coverage | ✅ (plain heading "Во печатот"/"In the press") |
| No image from any press article; no outlet logos / "as seen in" strip | ✅ (no images at all) |
| All five links load the competition article | ✅ (all HTTP 200; trn.mk + republika confirmed as the article; other three VERIFIED in `facts.md` §4 today) |
| Contact renders the email `[PLACEHOLDER]` visibly + logged in the register | ✅ |
| Contact has no form and no address | ✅ |
| Phone displays `078 820 520`, links `tel:+38978820520`; IG imported from `social.ts` (footer + Contact) | ✅ |
| Home About link in countdown + ended only; live/opening byte-for-byte unchanged | ✅ (verified: countdown ✓, ended ✓, live 0 links) |
| No photo/photo slot added to Home | ✅ |
| Header unchanged | ✅ |
| No new route other than `about/` + `contact/`; no localised slug | ✅ |
| No file under `src/lib/{drop,orders}`, `src/config`, `supabase`, `tests` modified | ✅ |
| All new strings in `messages/{mk,en}.json`; identical key sets (127); nothing hard-coded | ✅ |
| No hard-coded colour/size/spacing; no new colour pair outside the §3 ledger | ✅ |
| Tap targets: phone 63px, Instagram 87px on mobile (≥44px) | ✅ |
| `humanizer` pass run, both locales; no filler words | ✅ |
| build · tsc · lint · test all green | ✅ |
| Planning docs at root, committed, in `file-map.md` | ✅ |
| `facts.md` reads 2026-07-15, §4 lists five outlets | ✅ |
| `_TEMPLATE.md` line 3 → `Part-X-Phase-YY-Completion.md` | ✅ |
| No secret committed; `.env*` gitignored; nothing wrong behind `NEXT_PUBLIC_` | ✅ |
| `Decisions.md` carries `D-1.05-1` … `D-1.05-12` | ✅ |
| `current-state.md` (NEXT + both registers), `file-map.md` updated | ✅ |

### Owed to Lazar — both are **merge blockers** on this PR (`D-1.05-2`)

| # | Item | Steps | What "pass" looks like |
|---|---|---|---|
| 1 | **Design direction sign-off** (register #1, since 1.02). | Open the running site — `/`, `/catalog`, `/about`, `/contact` — on a phone and a laptop; approve the palette + type or name changes. | "Approved", or a change list. |
| 2 | **Instagram URL click-test** (register #2, since 1.02). Handle VERIFIED; URL renders/links correctly (checked in-browser), but "does it open Vladimir's real profile" needs a human. | Tap the Instagram link on a phone. | It opens Vladimir's actual profile. If it 404s, it is a fabricated link on every page — fix before merge. |

*I verified the pages render, the links are well-formed, and the five press URLs load — but the two
above need Lazar's eyes/device and cannot be self-cleared.*

---

## 7. Placeholders shipped

| Placeholder | Page | Waiting on | Owner |
|---|---|---|---|
| `[PLACEHOLDER: е-пошта — Владимир]` / `[PLACEHOLDER: email — Vladimir]` | Contact (`/contact`, both locales) | Vladimir's email (`facts.md` §5) | Lazar → Vladimir |

Logged as **register row #5** in `current-state.md`. It also gates the order-confirmation
sender/recipient (`facts.md` §5, Phase 1.08). No fact was invented to avoid a placeholder.

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED entry in `facts.md` | ✅ |
| `humanizer` pass run on user-facing copy | ✅ (softened one copula-flavoured line in `body1`; the rest kept plain/factual — the correct register for a facts-constrained About page) |
| No fashion-magazine filler ("elevate", "curated", "essentials", "vibrant", "crafted", "journey", "passion") | ✅ (grep-checked) |
| No invented testimonials/reviews/counts/awards/partners/team/address | ✅ |
| Template-propagated strings (phone, IG) verified once against `facts.md`, then imported | ✅ (`src/lib/social.ts`) |
| No AI-generated product imagery (`D-0-6`) | ✅ (no imagery) |
| No untranslated EN string in the MK build | ✅ (also **fixed** a pre-existing one in the footer — `D-1.05-10`) |

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ✅ (the email is a visible placeholder, not a real address) |
| `.env*` still gitignored | ✅ (unchanged) |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ✅ (no env changes) |
| No order PII (phone, address) in logs | ✅ (no logging added; the public phone is facts.md-VERIFIED for display) |

No secret was committed at any point on this branch.

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| **Push branch + open PR #5** | Operator approval (outward action to a public repo) | Petar |
| Merge blockers #1 (design sign-off) + #2 (IG click-test) | Lazar | Lazar |
| `1.06 — Catalog + Product` | **Blocked on Vladimir**: product photos (`D-0-6`), real MKD prices, sizes, fabric/care (`facts.md` §7/§8). 1.06 cannot close without them. | Vladimir |
| Contact email placeholder | Vladimir's email | Lazar → Vladimir |

`NEXT:` set to **`1.06 — Catalog + Product`**.

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ✅ (`1.06 — Catalog + Product`) |
| `current-state.md` — owed-verification register | ✅ (#3 removed/cleared at merge; #1/#2 flagged merge blockers) |
| `current-state.md` — placeholder register | ✅ (email = row #5) |
| `file-map.md` — matches disk | ✅ |
| `00_stack-and-config.md` — new deps / pins / config | n/a (no dependency or config changed) |
| `Decisions.md` — every § 2 entry appended | ✅ (`D-1.05-1` … `D-1.05-12`) |

**`NEXT:` line I set:** `NEXT: 1.06 — Catalog + Product`
