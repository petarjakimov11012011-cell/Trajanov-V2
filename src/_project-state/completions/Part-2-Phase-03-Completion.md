# Completion report — Part 2 Phase 03: Legal pages + full facts audit

| | |
|---|---|
| **Phase** | 2.03 |
| **Name** | Legal pages + full facts audit |
| **Executor** | Claude Code |
| **Operator** | Lazar / Petar |
| **Date** | 2026-07-19 |
| **Branch** | `phase-2.03-legal-facts` |
| **PR** | #12 |
| **Brief** | `briefs/Part-2-Phase-03-Code.md` |

---

## 1. What shipped

- **Three honest legal pages, both locales, static (`●` SSG):** Terms (`/uslovi` · `/en/terms`),
  Privacy (`/privatnost` · `/en/privacy`), Shipping & Returns (`/isporaka-i-vrakjanje` ·
  `/en/shipping-returns`) — built from the `/about`+`/contact` editorial pattern via a shared
  `LegalPage` shell. Every line traces to `facts.md`, shipped code, or a logged decision.
- **The customer can now find out, before paying cash at their door:** who they are buying from
  (Vladimir Trajanov, Струмица, alone), that it is cash-on-delivery inside North Macedonia only, that
  their order reserves stock for 48h and gets a confirming phone call, exactly what personal data is
  collected (name/phone/city/address/note — **no email**) and where it is stored (Frankfurt), that the
  raw IP is never kept, that there are no tracking cookies, and how to get their data deleted.
- **A full `facts.md` audit** (`docs/legal/facts-audit-2.03.md`) walks every rendered claim on the whole
  site back to a source. It found **2 things worth surfacing** (see §3) and left **zero UNSOURCED**.
- **Honest placeholders, not guesses:** the courier / delivery time / delivery cost and the
  returns/exchange window ship as visible `[PLACEHOLDER: …]` markers, because inventing a delivery cost
  on cash-on-delivery is money asked for at a doorstep on a promise nobody made.
- **`facts.md` §1 amended** so the file and the site agree on the displayed responsible party, with the
  open parental-confirmation flag kept. The owed-verification register is **no longer empty** (2 rows).

---

## 2. Decisions I made on my own

Logged in `Decisions.md`, `D-2.03-1` … `D-2.03-6`.

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| D-2.03-1 | **Responsible party displayed = Vladimir Trajanov, Струмица, alone** — no parent named. (Orchestrator/Lazar's call, logged here per the brief.) | Name a parent; "represented by parent/guardian [name]"; ship as `[PLACEHOLDER]` | The site names a **minor, alone**, as responsible for a COD consumer contract + customer PII; no adult named; no lawyer has read the pages. |
| D-2.03-2 | The audit treats operational commitments (48h, 2-per-order, COD, IP hash, field list) as **VERIFIED-via-shipped-code**, citing the file, not as UNSOURCED. | Mark them all UNSOURCED and either delete or push operational mechanics into `facts.md`; or mark NOT A CLAIM | "VERIFIED" spans two source types, so each row's citation must be read to know if a claim is fact- or code-backed. |
| D-2.03-3 | One shared `src/components/legal/LegalPage.tsx` shell for all three pages. | Inline the markup per page like About/Contact | Two editorial patterns now coexist (About/Contact inline vs legal via shell). |
| D-2.03-4 | Fixed, hand-maintained `LAST_UPDATED` date + shared `Common.lastUpdated` label. | Runtime `new Date()`; or per-namespace date keys | The date is hand-bumped and duplicated across three files. |
| D-2.03-5 | Courier / returns-window placeholders live in the existing `Placeholder` namespace. | Put them in the `ShippingReturns` namespace | The strings live in a different namespace than the page that renders them. |
| D-2.03-6 | The cart's "Shipping — calculated on delivery" (finding F-2) is **surfaced, not reworded** this phase. | Reword/remove the cart string now | Cart and shipping-returns describe the delivery cost slightly differently until a future cart-touching phase reconciles them. |

---

## 3. Surprises and off-spec changes

**F-1 — `facts.md` §1 and the site disagreed on the single most consequential identity claim.** §1 read
`Responsible party | Vladimir Trajanov and his parents | VERIFIED`, but the orchestrator's Decision 1
says the pages name **Vladimir alone**. Left unamended, the new Terms/Privacy pages would have
contradicted the only legal source. **Resolved** by amending §1 to hold both the displayed party and the
intake fact, with the open parental-confirmation flag kept (Task 7). This is exactly the kind of drift
the audit exists to catch.

**F-2 — the cart makes a claim about delivery cost that this phase simultaneously flags as unknown.** The
cart order-summary shows `Shipping: calculated on delivery` while `/shipping-returns` ships a visible
placeholder admitting we do **not** know the courier or delivery cost. The cart line is not false (the
app computes no shipping and everything settles at the door under COD, `facts.md` §7) and states **no
amount**, so it is not the dangerous case the brief warns about. But the two surfaces should say the same
true thing once Vladimir supplies courier terms. **Not fixed here** — the cart is out of scope, the
string passed the 2.02 native review, and the only correct rewrite depends on the owed fact.
**Recommendation:** revisit the cart shipping line in the same pass that fills placeholder #6 (`D-2.03-6`).

**Not a bug (worth recording):** the automated browser sends `Accept-Language: en`, so visiting a MK slug
(`/uslovi`) 307-redirects to `/en/terms` — **identical** to the existing `/za-nas`→`/en/about` behaviour
and standard next-intl locale detection. With no `Accept-Language`, all three MK slugs return **200**
directly. Verified by `curl` and by setting the `NEXT_LOCALE=mk` cookie in-browser.

**Brief was accurate everywhere else.** The Privacy field list matched the real `orders` schema exactly;
the IP-hash claim matched `hash.ts`; the 48h/COD/2-per-order operational facts matched shipped code.

---

## 4. Files touched

`file-map.md` updated: **yes**.

| File | Added / Modified / Deleted |
|---|---|
| `src/app/[locale]/terms/page.tsx` | Added |
| `src/app/[locale]/privacy/page.tsx` | Added |
| `src/app/[locale]/shipping-returns/page.tsx` | Added |
| `src/components/legal/LegalPage.tsx` | Added |
| `docs/legal/facts-audit-2.03.md` | Added |
| `docs/i18n/mk-review-2.03.md` | Added (unsigned) |
| `src/_project-state/completions/Part-2-Phase-03-Completion.md` | Added |
| `src/messages/mk.json` | Modified (+63 keys) |
| `src/messages/en.json` | Modified (+63 keys) |
| `src/i18n/routing.ts` | Modified (3 `pathnames` entries + comment) |
| `src/components/layout/SiteFooter.tsx` | Modified (3 legal links) |
| `facts.md` | Modified (§1 amendment + change-log row) |
| `tests/i18n/pathnames.test.ts` | Modified (explicit legal-route assertions) |
| `docs/i18n/string-inventory.md` | Modified (regenerated → 213 keys) |
| `Decisions.md` | Modified (`D-2.03-1…6`) |
| `src/_project-state/current-state.md` | Modified |
| `src/_project-state/file-map.md` | Modified |

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | **clean** — all 3 legal routes `●` (SSG) per locale; TypeScript passed |
| Types | `npx tsc --noEmit` | **clean** (exit 0) |
| Lint | `npm run lint` | **clean** (no output) |
| Unit / integration | `npm test` | **69 passed / 69** (63 + 6 new legal-route pathname assertions) |

**Concurrent-order test (re-run, unchanged by this phase — that is why it was re-run):**

| | |
|---|---|
| **10 simultaneous orders / 3 units** | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ tests/concurrency/oversell.test.ts > create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0 30ms` |

**Parity driven RED → GREEN** (removed `Terms.sellerHeading` from `en.json`, then restored):

- **RED:** `AssertionError: keys present only in mk.json: expected [ 'Terms.sellerHeading' ] to deeply equal []`
- **GREEN:** `Test Files  1 passed (1) / Tests  2 passed (2)`

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| All 6 URLs return 200 (`/uslovi`,`/privatnost`,`/isporaka-i-vrakjanje` + `/en/*`) | ☑ curl: MK slugs 200 (no `Accept-Language`); EN via 307 locale-redirect (as `/za-nas`) |
| All three render static (`●`/SSG per locale) | ☑ build route table |
| Terms + Privacy name Vladimir Trajanov, Струмица as responsible party | ☑ |
| No parent/guardian name anywhere in the diff | ☑ `grep` — only a code comment saying "no parent named" |
| No statute / article / directive / withdrawal period cited | ☑ `grep` clean (EN + MK) |
| No cookie banner / consent UI added | ☑ only the "no cookies" negations |
| Privacy field list matches the `orders` columns | ☑ vs `supabase/migrations/20260715021215_schema.sql` (name/phone/city/address/note, no email) |
| Privacy states raw IP not stored + one-way hash | ☑ matches `src/lib/rate-limit/hash.ts` |
| Contact email not published on the three pages | ☑ (placeholder #5 intact) |
| Each page carries a last-updated date | ☑ "19 July 2026" / "19 јули 2026 г." |
| Footer links all three, both locales, correct localised paths | ☑ `/uslovi`, `/privatnost`, `/isporaka-i-vrakjanje` |
| Rendered in-browser at 390px + 1180px, both locales | ☑ EN Terms + MK Terms/Privacy/Shipping (screenshots) |
| Audit committed, one row per claim, zero UNSOURCED | ☑ `docs/legal/facts-audit-2.03.md` |
| §10 "do-NOT-have" list absent | ☑ `grep`-confirmed (EAM = organiser only) |
| `facts.md` §1 amended; open flag kept; change-log row added | ☑ |
| Namespaces + Nav + Meta keys in both catalogs, identical key sets | ☑ 213 = 213 |
| Placeholders visible + registered (courier, returns window) | ☑ register #6, #7 |
| No existing placeholder cleared/reworded/removed | ☑ #2–#5 unchanged |
| `git diff --name-only main \| grep supabase/migrations` → nothing | ☑ |
| `package.json` dependencies unchanged | ☑ |

### Owed to Lazar (only he / a native speaker / a lawyer can confirm)

**Both go on the owed-verification register (now rows #9, #10).**

| # | Item | Steps | What "pass" looks like |
|---|---|---|---|
| 9 | **No human legal review of the three pages** | A lawyer reads Terms/Privacy/Shipping & Returns | A professional confirms they are adequate for a COD consumer contract run by a minor with no entity |
| 10 | **New MK legal copy unreviewed by a native speaker** | Lazar + Petar work `docs/i18n/mk-review-2.03.md` (63 rows + 3 slugs), sign both blocks | Both signed; faults (if any) applied; slugs resolved |

**In-browser render (done here, but a 5-item human check for Lazar after deploy):**
1. `/uslovi` + `/en/terms` — responsible party reads "Vladimir Trajanov, Струмица", no parent.
2. `/privatnost` + `/en/privacy` — collected fields match what the checkout actually asks; no cookie line beyond "no cookies".
3. `/isporaka-i-vrakjanje` + `/en/shipping-returns` — both `[PLACEHOLDER: …]` visible; NMK-only notice present.
4. Footer on any page — the three new links go to the right localised slugs.
5. Last-updated date shows on each page.

---

## 7. Placeholders shipped

| Placeholder | Page | Waiting on | Owner |
|---|---|---|---|
| `[PLACEHOLDER: курир, време и цена на испорака — Владимир]` | Shipping & Returns | Courier + delivery time + delivery **cost** | Vladimir |
| `[PLACEHOLDER: рок за враќање и замена — Владимир]` | Shipping & Returns | Returns/exchange **window** (no statutory period invented) | Vladimir |

Both added to the placeholder register (#6, #7). **No existing placeholder (#2–#5) was cleared, reworded
to hide it, or removed.** These were shipped as placeholders rather than guesses precisely because a wrong
delivery cost on cash-on-delivery is money asked for at a doorstep.

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to VERIFIED `facts.md` (or shipped code, per Decision 5) | ☑ audit, zero UNSOURCED |
| `humanizer` pass run on user-facing copy | ☑ cut a stiff "Here is exactly" and a self-praising "Short and honest:" opener |
| No fashion-magazine filler ("elevate", "curated", "essentials", "vibrant") | ☑ |
| No invented testimonials / reviews / counts / awards / partners / team / address | ☑ §10 `grep` clean |
| Template-propagated strings verified once against `facts.md` before generation | ☑ (audit is the record) |
| No AI-generated product imagery (`D-0-6`) | ☑ none added |
| No untranslated EN string in the MK build | ☑ parity + in-browser MK render |

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ☑ (the contact email stays env-var-only; not published) |
| `.env*` still gitignored | ☑ (untouched) |
| Nothing secret behind `NEXT_PUBLIC_` | ☑ (no env work this phase) |
| No order PII (phone, address) in logs | ☑ (no logging added) |

No secret was committed at any point in this branch's history.

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| Human legal review of the three pages | A lawyer (owed #9) | Lazar + Vladimir |
| Native MK review of the 63 new strings | `docs/i18n/mk-review-2.03.md` sign-off (owed #10) | Lazar + Petar |
| Courier / delivery time / delivery cost | Placeholder #6 | Vladimir |
| Returns / exchange window | Placeholder #7 | Vladimir |
| Legal responsibility confirmed with parents | `facts.md` §1 open flag | Vladimir + parents |
| Cart "calculated on delivery" reconciliation | A future cart-touching phase, once courier terms land (`D-2.03-6`) | Orchestrator |

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ☑ → `2.04 — Perf, a11y, SEO` |
| `current-state.md` — owed-verification register | ☑ +2 rows (#9, #10); note that it is no longer empty |
| `current-state.md` — placeholder register | ☑ +2 rows (#6, #7) |
| `file-map.md` — matches disk | ☑ 3 pages + legal shell + docs/legal + mk-review-2.03 + change-log row |
| `00_stack-and-config.md` — new deps / pins / config | ☑ n/a — no dependency, pin, or config changed |
| `Decisions.md` — every §2 entry appended | ☑ `D-2.03-1…6` |

**`NEXT:` line I set:** `NEXT: 2.04 — Perf, a11y, SEO (Lighthouse, schema.org, sitemap, robots, OG images …)`
