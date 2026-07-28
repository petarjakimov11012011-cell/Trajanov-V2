# Completion report — Part 2 Phase 23: Contact page — message form + contact rail

| | |
|---|---|
| **Phase** | 2.23 |
| **Name** | Contact page: message form + contact rail |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-28 |
| **Branch** | `phase-2.23-contact-form` |
| **PR** | opened to `main` — **not merged; an operator merges (`D-0-3`)** |
| **Brief** | `briefs/Part-2-Phase-23-Code.md` (delivered in-session) |

---

## 1. What shipped

- **The Contact page is a real two-column page** (`/kontakt` · `/en/contact`, still static SSG):
  a message form on the left, the three ways to reach Vladimir on the right — ~60/40 at `lg:`+
  (measured 624/416px), one stacked column below with the form first. Header is eyebrow → the one
  H1 → a new one-sentence intro; the old `context` line moved to the foot of the rail.
- **The form** (`src/components/contact/ContactForm.tsx`, modelled on CheckoutForm): Name\* →
  Email\* → Subject (optional) → Message\*, all `CheckoutField`; "Required fields are marked
  with \*." above; the checkout's Turnstile box + widget below the fields with the same
  "verifying" treatment; a left-aligned, not-full-width mustard submit (48px tall) that disables
  and relabels while sending; the consent line under it linking the **locale-aware** Privacy route
  via the i18n `Link` (MK `/privatnost`, EN `/en/privacy`).
- **The pipeline** (the `process-order.ts` convention): `sendContact` ("use server", thin) wires
  `processContact` (pure, injected deps) — **Turnstile → validate → send, failing closed at every
  step**. Server-side caps 100/200/150/4000 (rejection, never truncation; the client mirrors the
  same imported `CONTACT_CAPS`), the same exported email-shape regex both sides, and `\r`/`\n` +
  control characters **rejected** in name/email/subject (they reach email headers); the message
  body may contain newlines.
- **The sender** (`src/lib/email/contact-message.ts`, mirroring `order-notification.ts`): from
  `ORDER_FROM_ADDRESS` (imported, never retyped) to `ORDER_NOTIFICATION_EMAIL`, **`replyTo` = the
  visitor's address** so Reply goes straight back; subject prefixed **„[Контакт]"** (greppable,
  sorts away from „Нова нарачка"); plain-text body with name/email/subject/message + the visitor's
  locale; 8s ceiling; env read at call time; never throws. **Unlike the order sender the result is
  NOT advisory** — the email is the record, so the UI shows success only on `{sent: true}` and
  every failure branch renders the failure state pointing at the phone and the email.
- **The rail**: exactly three rows — Phone (`PHONE_DISPLAY`→`PHONE_TEL`, sub-line „Најбрзиот начин
  да добиеш одговор."), Email (`EMAIL`→`EMAIL_MAILTO`), Instagram (`INSTAGRAM_HANDLE`→
  `INSTAGRAM_URL`, `target="_blank" rel="noopener noreferrer"`, existing `instagramNote`) — all
  values imported from `src/lib/social.ts`, rows ≥44px (measured 91/70/111px at 320), `AtSign`
  standing in for Instagram (`D-2.07-2`), no invented rows, no address (facts.md §1).
- **Privacy corrected in the same PR** (brief decision 7 — the hard stop): `collectBody` rewritten
  to be order-scoped and true again; a **new self-contained section** („Што собираме кога ни
  пишуваш" / "What we collect when you write to us") rendered through the existing `LegalSection`
  directly after the order-collect section; `deleteBody` rewritten (delete by phone **or** a reply
  in the email thread). Verified live in both locales: „Не собираме е-пошта" and „Нема формулар"
  have zero rendered occurrences.
- **`Trajanov-V2-Plan.md` §4 Contact row amended** with `D-2.23-1` — the old "No contact form"
  sentence is quoted inside the amendment, not deleted.
- **17 new strings MK+EN** (15 `Contact`, 2 `Privacy`), 4 rewrites (2 Privacy bodies + 2 Meta
  descriptions — see §3); identical key sets (parity suite); humanizer pass run — nothing fired;
  inventory regenerated **255→272**; `docs/i18n/mk-review-2.23.md` committed **unsigned**, 21 rows.
- **25 new unit tests** (154 total): validation (required, email shape, every cap edge one-over /
  at-cap, header-injection in each header field, newlines allowed in body), pipeline order
  (fail-closed at token/verify/validate; **no `sent:true` on any unconfirmed send**), and the
  sender's success / send_error / timeout / unconfigured / exception branches with Resend mocked
  and a no-PII scan of every log line.

## 2. Decisions I made on my own

`D-2.23-1` is the owner's (relayed through the brief; logged + Plan amended as instructed). On my
own I made six:

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| D-2.23-2 | Reuse five already-reviewed strings (`Checkout.errorRequired`/`verifying`, `Order.protected`/`turnstileFailed`/`genericError`) instead of minting Contact twins | Duplicate keys with identical text | Cross-namespace coupling — a checkout-motivated rewording reaches the contact form too |
| D-2.23-3 | Rewrite `Meta.privacyDescription` (said „без е-пошта"/"no email" — false once the form ships) **and** `Meta.contactDescription`, beyond Decision 7's literal list | Leave the meta strings and only report the finding | Two strings changed beyond the brief's list; two more review rows |
| D-2.23-4 | Pure pipeline module + thin "use server" wrapper that exports **only** the action — after the type re-export crashed every submit at runtime (see §3) | Validation inline in the action file; keeping the type re-export | One more file; types import from the sibling |
| D-2.23-5 | The form catches a rejected action call and shows the send-failed state — a deliberate divergence from CheckoutForm | Mirror CheckoutForm exactly | CheckoutForm's own latent stuck-submit defect stays (out of scope — surfaced in §3, not quietly fixed) |
| D-2.23-6 | Length caps validated at submit; `CheckoutField` ships unchanged (it has no `maxLength` passthrough and the brief forbids modifying it) | A local wrapper field re-implementing the input to add `maxLength` | A pasted over-cap message is flagged at submit, not while typing |
| D-2.23-7 | Verification maneuvers: axe served via a temporary `public/__axe-temp.js` (deleted before staging); computed-style reads taken with the element's transition disabled (the hidden pane freezes transitions at their start value); keyboard walk proven per-element via programmatic `:focus-visible` + CSSOM (the pane does not traverse focus on synthesized Tab) | Skipping axe; claiming a Tab walk the pane cannot perform | Keyboard evidence is simulation — the real-device read is owed row **#55** |

## 3. Surprises and off-spec changes

1. **A third false-once-this-ships statement existed, exactly as the brief's closing instruction
   predicted.** `Meta.privacyDescription` (both catalogs) said „без е-пошта" / "no email" — the
   privacy page's own meta description. Decision 7 named only `collectBody`/`deleteBody`. I
   corrected it (and `Meta.contactDescription`, which described a form-less page) rather than ship
   a false public statement, logged `D-2.23-3`, and put both in the review pack. **Also checked
   and clean:** `llms.txt` ("Reach Trajanov by Instagram or phone" — incomplete now but not false),
   `Terms.contactBody` („Најбрзо нè фаќаш по телефон…" — still true), the FAQ, and the OG strings.
   The orchestrator may still want `llms.txt`'s Contact note to mention the form in a future phase.
2. **The brief's "same submit shape as CheckoutForm" hid a runtime crash.** My first cut re-
   exported the input/result **types** from the "use server" file; tsc, lint and `next build` were
   all green, and every submit then 500'd — Next's server-actions loader compiles *every* export of
   an actions module into an action reference, and the type-only export (erased by TypeScript) hit
   `ReferenceError: ContactInput is not defined` at runtime. Found live in Task-9 verification,
   fixed (`D-2.23-4`). A build-green/runtime-dead server action is worth knowing about for every
   future action file.
3. **CheckoutForm has a latent stuck-submit defect this phase did NOT fix.** The same
   verification run showed what an action rejection does to the modelled pattern: `await
   placeOrder(...)` with no catch leaves checkout's button disabled on "verifying" forever if the
   action ever rejects (network drop mid-submit, a server crash). The contact form catches it
   (`D-2.23-5`); `CheckoutForm.tsx` is on this brief's byte-unchanged list, so it is surfaced
   here instead: **recommend a small follow-up phase to add the same try/catch to checkout.**
4. **The hidden preview pane freezes CSS transitions**, so the first computed-style read of the
   error border showed the *pre-error* colour (border-strong) — every colour measured through a
   `transition-colors` element in any past phase's pane run would have the same hazard if read
   mid-state-change. Worked around by disabling the element's transition for the read
   (`D-2.23-7b`); the real values follow in §6.
5. **No placeholder text renders on the page** — the brief's field list needed no fact we do not
   hold, so the "placeholder ratio" the a11y task asks to measure has no subject: no `placeholder`
   attribute is used on any of the four fields.

## 4. Files touched

**New:** `src/components/contact/ContactForm.tsx` · `src/lib/contact/process-contact.ts` ·
`src/lib/contact/actions.ts` · `src/lib/email/contact-message.ts` ·
`tests/contact/process-contact.test.ts` · `tests/email/contact-message.test.ts` ·
`docs/i18n/mk-review-2.23.md` · `briefs/Part-2-Phase-23-Code.md` · this report.

**Modified:** `src/app/[locale]/contact/page.tsx` (rebuilt) · `src/app/[locale]/privacy/page.tsx`
(new section render + comment) · `src/messages/mk.json` + `en.json` (+17 keys, 4 rewrites) ·
`Trajanov-V2-Plan.md` (§4 Contact row) · `docs/i18n/string-inventory.md` (regen, 272) ·
`Decisions.md` (`D-2.23-1…7`) · `src/_project-state/current-state.md` (status, Built, Components,
Resend row, owed #53–57 — **line 1 unchanged**) · `src/_project-state/file-map.md`.

**Proof the out-of-scope list is untouched** — `git diff main --name-only` (final, verbatim) is
pasted in §6; none of `SiteFooter.tsx`, `SiteHeader.tsx`, `HomeExperience.tsx`,
`HomeShowcase.tsx`, `src/config/`, `supabase/`, `src/lib/orders/`, `src/lib/drop/`,
`src/lib/cart/`, `src/components/cart/`, `CheckoutForm.tsx`, `CheckoutField.tsx`,
`Turnstile.tsx`, `product-images.ts`, `next.config.ts`, `package.json`, the lockfile,
`facts.md`, `brand.md`, or `src/lib/site.ts` appears in it.

## 5. Tests run + results

- `npm run build` — clean; `/[locale]/contact` and `/[locale]/privacy` both still `●` (SSG).
- `npx tsc --noEmit` — clean. `npm run lint` — clean.
- `npm test` — **154/154** (129 pre-phase + 25 new), including
  `✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0`.
- New suites: `tests/contact/process-contact.test.ts` (validation + pipeline order + the
  no-unconfirmed-success guarantee) and `tests/email/contact-message.test.ts` (compose + all five
  sender branches, Resend mocked, fake-timer timeout, PII scan of every warn/error line).
- Colour-literal gate: **zero** hex / `rgb(` / `hsl(` / raw-ms / raw-easing literals in the diff
  (the only new colour-adjacent strings are Tailwind token classes).

## 6. Definition of Done

Every "Verified by Code" box from the brief, with evidence:

- [x] Two-column at `lg:`+ (624/416px = 1.50 at 1024 + 1280), stacked form-first at 320/390/768 —
  measured in-pane, both locales, all five widths; zero horizontal overflow at every one.
- [x] Rail = exactly Phone / Email / Instagram, hrefs read back from the DOM:
  `tel:+38978820520` · `mailto:info@trajanovv.com` · `https://instagram.com/trajanovv2026` —
  matching `src/lib/social.ts` exactly; IG carries `rel="noopener noreferrer"`.
- [x] Fields Name\*/Email\*/Subject (optional)/Message\*, all `CheckoutField` (labels read back
  from the DOM in both locales).
- [x] Action order Turnstile → validate → send, fail-closed — unit-proven (verify not called
  without a token; send never called on failed verify or invalid input).
- [x] `\r`/`\n` + control chars rejected in name/email/subject — unit-proven per field, incl. a
  `Bcc:` injection string; newlines allowed in the body.
- [x] Caps 100/200/150/4000 server-side — one-over rejected, at-cap accepted, per field.
- [x] From `info@trajanovv.com` (asserted `=== ORDER_FROM_ADDRESS` **and** the literal), to
  `ORDER_NOTIFICATION_EMAIL`, `replyTo` = visitor — unit-proven against the mocked payload.
- [x] Failed send → failure state naming the phone + email; success impossible unconfirmed —
  unit-proven for all four failure reasons, **and** exercised live: with no local Resend key the
  real submit rendered „Пораката не се испрати. Јави се на 078 820 520 или пиши на
  info@trajanovv.com." in error tone, values preserved, no success message anywhere; server log
  shows only the no-PII `[contact-email]` reason line.
- [x] Privacy corrected both catalogs; live pages checked in both locales — zero occurrences of
  the old claims; the new section renders via `LegalSection`.
- [x] Plan §4 amended with `D-2.23-1`.
- [x] No new table / migration / order-path edit — `git diff main --name-only` (verbatim):
  ```
  Decisions.md
  Trajanov-V2-Plan.md
  briefs/Part-2-Phase-23-Code.md
  docs/i18n/mk-review-2.23.md
  docs/i18n/string-inventory.md
  src/_project-state/completions/Part-2-Phase-23-Completion.md
  src/_project-state/current-state.md
  src/_project-state/file-map.md
  src/app/[locale]/contact/page.tsx
  src/app/[locale]/privacy/page.tsx
  src/components/contact/ContactForm.tsx
  src/lib/contact/actions.ts
  src/lib/contact/process-contact.ts
  src/lib/email/contact-message.ts
  src/messages/en.json
  src/messages/mk.json
  tests/contact/process-contact.test.ts
  tests/email/contact-message.test.ts
  ```
- [x] Zero new npm dependencies (`package.json` + lockfile absent from the diff).
- [x] Zero colour/motion literals in the diff.
- [x] No email address or message body in any log, error string or fixture — unit-tested (PII scan
  of every captured log line) and the live server log carries only reason codes.
- [x] MK+EN parity (suite green); no English in the MK build — text-node scan of `/kontakt` found
  zero Latin-script strings beyond the brand name, values, and `EN` switch label; humanizer run.
- [x] `string-inventory.md` regenerated (272); `mk-review-2.23.md` committed unsigned.
- [x] axe: **zero violations of any impact** on `/kontakt` and `/en/contact` (real in-browser run).
  Measured contrast: labels/consent/rail sub-lines **7.85:1** · error text **7.49:1** · error
  border **6.32:1** vs field fill, **7.49:1** vs ground · default field border **3.01:1** vs fill /
  **3.57:1** vs ground (≥3 floor — the shipped 1.06 field treatment) · submit label on mustard
  **9.26:1** · rail values + consent link **15.42:1** · Turnstile-box text **7.31:1** · focus ring
  `#F2C55A` on ground **11.6:1** (ledger). No placeholder text exists on the page (§3.5).
- [x] One `<h1>`; the rail H2 is the only other heading; every control tabbable, unclipped, with
  the ring treatments verified per element class (field border / button box-shadow ring / global
  outline — `D-2.23-7`); zero overflow at 320px both locales.
- [x] build / tsc / lint / 154-test suite green incl. the 10-vs-3 gate.
- [x] `Decisions.md` (7 entries), `current-state.md` (line 1 untouched), `file-map.md` updated.

Also from the brief's Task 9: empty-required submit showed the three per-field errors and made
**zero network calls** (fetch-counter instrumented); a Turnstile-unresolved submit was refused
with the retry message, also zero calls; zero console errors across every page/width/locale
exercised (the known MK-price hydration warning did not appear on this route).

## 7. Placeholders shipped

**None.** No new placeholder row; the register is untouched (no row added, cleared, or moved).

## 8. Content truth check

- Every rendered fact on the page traces to `facts.md`: phone (§5), email (§5), Instagram + its
  "only account" status (§6), Strumica/NMK-only/COD (`context`, §1/§7). All three rail values are
  imports from `src/lib/social.ts` — nothing retyped.
- No response-time promise, no office hours, no address, no second social account, no "we usually
  reply within X" — nothing on the page needs a fact we do not hold.
- The Privacy page now *describes what the site actually does* — including that contact messages
  are **not** stored in the site's database, which is true by construction (no table exists;
  nothing in the diff touches Supabase).
- The consent line promises only what the code does: the details are used to reply, nothing else.

## 9. Secrets check

- No key, token, or recipient address in the diff — the recipient stays `ORDER_NOTIFICATION_EMAIL`
  (env-only, never written out), the from-address is the already-public `info@trajanovv.com`
  imported from the Z.01 module.
- No `console.log` of the visitor's name, email, or message anywhere; the sender logs reason codes
  only (unit-enforced). `.env*` untouched and gitignored.
- The temporary `public/__axe-temp.js` (a copy of node_modules axe) was deleted before staging —
  `git status` clean of it.

## 10. Blocked / carryover

Nothing blocked. Carryover for the orchestrator:

- **Owed #53–57** (register): real end-to-end delivery on production incl. the Reply-To check;
  live Turnstile on `/kontakt`; the page on a real phone; the 21-row MK review (the two rewritten
  Privacy strings carry legal weight); Lazar's sign-off that the form should exist at all.
- **Recommended follow-ups, not started:** (a) the CheckoutForm stuck-submit catch (§3.3);
  (b) `llms.txt`'s Contact note could mention the form (§3.1) — currently true but incomplete.

## 11. State updated

- `current-state.md`: 2.23 status block added; `NEXT:` line **byte-unchanged**; owed register
  +5 rows (#53–57); placeholder register untouched; Built/Components/Resend rows extended.
- `file-map.md`: tree + changelog row (also restored the missing `mk-review-2.21.md` tree line).
- `00_stack-and-config.md`: **no entry needed** — no dependency or config change.
- `Decisions.md`: `D-2.23-1…7`, append-only, no prior entry edited.
