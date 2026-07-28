# Part 2 · Phase 23 · Code — Contact page: message form + contact rail

**Why this matters —** today the Contact page is three links. This turns it into a real two-column
contact page: a message form on the left, the ways to reach Vladimir on the right — so someone who
is not ready to phone a stranger can still write to him. It also fixes the Privacy page, which
currently tells every visitor "there is no form" and "we don't collect your email" — both of which
stop being true the moment this form ships.

**Branch:** `phase-2.23-contact-form` · **PR:** one, to `main` · **Operator merges, not Code (`D-0-3`).**

---

## Context

### Read first, in this order

| Path | Why |
|---|---|
| `CLAUDE.md` | Repo standing rules — secrets, branches, state duties, content truth |
| `src/_project-state/current-state.md` | Live state. Line 1 is the `NEXT:` line — **this phase does not change it** |
| `facts.md` §5, §6, §10 | The only legal source for contact facts. §6: Instagram is the **only** social account |
| `brand.md` | The only source of design tokens. Never hardcode a colour, size, spacing or duration |
| `src/app/[locale]/contact/page.tsx` | What you are replacing |
| `src/app/[locale]/privacy/page.tsx` + the `Privacy` namespace in `src/messages/*.json` | Two strings there become false when this ships (see Decision 7) |
| `src/components/checkout/CheckoutForm.tsx`, `CheckoutField.tsx`, `Turnstile.tsx` | The form, field and captcha patterns to reuse — do not invent new ones |
| `src/lib/email/order-notification.ts` | The best-effort Resend sender pattern to mirror |
| `src/lib/turnstile/verify.ts` | `verifyTurnstile()` — generic, reuse as-is |
| `src/lib/social.ts` | `PHONE_DISPLAY`, `PHONE_TEL`, `EMAIL`, `EMAIL_MAILTO`, `INSTAGRAM_HANDLE`, `INSTAGRAM_URL` — never retype these values |

### What already exists

- Contact (`/kontakt`, `/en/contact`) is a **static** page: eyebrow → H1 → context line → three
  stacked links (phone, Instagram, email). No form, no address.
- `CheckoutField` already supports `textarea`, `required` (renders an accent `*`), `error`, and
  `disabled`, with the brand's default / focus / error / disabled treatments.
- `Turnstile.tsx` + `verifyTurnstile()` are live and proven in production on `www.trajanovv.com`
  with real keys.
- `order-notification.ts` sends from `info@trajanovv.com` through Resend on a verified domain, is
  best-effort, never throws, and bounds itself with an 8s timeout.
- `ORDER_NOTIFICATION_EMAIL` is set in Vercel and has delivered a real email to Vladimir's inbox.
- The footer (`SiteFooter.tsx`) is already columns → hairline → copyright + page links. **Untouched
  by this phase** (Decision 8).

### The reference the owner supplied

Two screenshots of a different website (an author's contact page). **What is being adopted is the
layout and structure only:**

- Big display H1 "Get in touch" + one intro sentence.
- "Required fields are marked with \*." above the form.
- Fields, stacked, full width: **Name\*** → **Email\*** → **Subject (optional)** → **Message\***.
- A solid filled submit button under the fields, left-aligned, not full width.
- Under the button: one small line of consent copy linking to the privacy policy.
- A narrower right-hand rail headed "Find … elsewhere": icon + label + a quiet sub-line per row.
- Two columns on desktop (roughly 60/40), stacked on mobile.

**What is NOT being adopted:** the reference site's cream/brown palette, its serif typefaces, its
rounded field radii, and its link inventory (Facebook, Booksa, Interviews 1–3). See Decisions 6 and 5.

---

## Orchestrator decisions — baked in, do not re-open

**1. The contact form ships. This reverses `Trajanov-V2-Plan.md` §4 ("No contact form — the phone
is the channel").** Owner's call, Lazar, 2026-07-28.
*Alternative rejected:* keep phone + email links only.
*Downside accepted:* a second inbox that must actually be read, a new PII surface on a site run by
a minor, free-to-send spam exposure, and a mandatory rewrite of two native-reviewed Privacy strings.
→ Log this as a decision, and **amend `Trajanov-V2-Plan.md` §4's Contact row** so the plan and the
repo do not disagree. Do not delete the old sentence; replace it and note the decision ID.

**2. The message is delivered by email only. No database table, no migration.**
*Alternative rejected:* a `contact_messages` table in Supabase.
*Downside accepted:* if Resend fails, the message is lost — which is why the UI must **never** show
a success state unless Resend confirms delivery (Task 5).
*Why:* Known Issue — Supabase "Auto-expose new tables" is still **ON** (`D-1.07-14`), so a new
table lands anon-readable/writable by default. A publicly writable table holding real names, email
addresses and free text is a worse outcome than a lost message.

**3. From `info@trajanovv.com`. To `ORDER_NOTIFICATION_EMAIL`. Reply-To = the visitor's email.**
No new environment variable, no new operator setup, no new domain verification. Reuse
`ORDER_FROM_ADDRESS` from `order-notification.ts` rather than retyping the address.
*Downside accepted:* contact messages arrive in the same inbox as order notifications. Mitigated by
a distinct, greppable subject prefix (Task 5).

**4. Turnstile yes. The order rate limiter no.**
*Alternative rejected:* reuse `recordAndCheckRateLimit` / `check_order_rate_limit()`.
*Why:* that ledger is the **order** rate limit. Writing contact attempts into `order_attempts` could
lock a real customer out of ordering on drop day — trading a spam nuisance for a lost sale.
*Downside accepted:* a determined human can send repeated messages. The blast radius is email, not
stock. Turnstile is the actual bot gate, and a hard length cap bounds the damage.

**5. The right-hand rail carries exactly three rows: Phone, Email, Instagram.** No Facebook, no
"Interviews", no invented channels — `facts.md` §6 records Instagram as the **only** account and
forbids icons for profiles that do not exist. The press coverage stays on About and is not
duplicated here.
*Downside accepted:* the rail is visibly sparser than the reference. That is the honest version;
three real rows beat five with two fabrications.

**6. The reference palette and typefaces are not adopted.** Every colour, size, spacing, radius and
duration comes from `brand.md` / `globals.css` tokens — the existing dark ground, Rubik display,
Inter body. Structure and hierarchy only are borrowed. **Zero hex, `rgb(`, `hsl(`, raw-ms or
raw-easing literals in the diff.**

**7. The Privacy page is corrected in this same PR. This is a hard stop, not a nicety.** Two live,
native-reviewed strings become false the instant a form with an email field exists:

| Key | Current (live, wrong once this ships) |
|---|---|
| `Privacy.collectBody` | MK: „…Не собираме е-пошта — нема поле за е-пошта." · EN: "…We don't collect your email — there is no email field." |
| `Privacy.deleteBody` | MK: „Нема формулар и нема портал — само телефонскиот број." · EN: "No form, no portal — just the phone number." |

Both must be rewritten so the page describes what the site actually does: order data as today,
**plus** name, email address, optional subject and message text sent through the contact form,
used only to reply, not stored in the database, and deletable by phone **or** by replying to the
email. Add a new sibling section rather than bending the order section out of shape if that reads
cleaner — the order paragraph must stay accurate about orders.

**8. The footer is out of scope.** It is already the reference's shape (columns → hairline rule →
copyright left, page links right), and the reference's "Writing" and "Interviews" columns have no
Trajanov equivalent that exists in `facts.md`. `SiteFooter.tsx` must be **byte-unchanged**.

**9. The consent line links to the Privacy page** using the locale-aware `Link` (MK `/privatnost`,
EN `/en/privacy`) — never a hand-typed href.

---

## Hard stops — if any of these is true, stop and report instead of shipping

1. The form ships while `Privacy.collectBody` or `Privacy.deleteBody` still says there is no form
   or no email field. Publishing a false privacy statement on a site selling to consumers under a
   minor's name is exactly the failure `CLAUDE.md` § Content truth exists to prevent.
2. A new Supabase table, migration, or any edit to `create_order`, `expire_reservations`,
   `supabase/migrations/`, `src/config/`, the cart, or the checkout order path.
3. The visitor's email address or message body appears in any `console.log`, error string, or
   committed fixture.
4. A success state renders on a send that Resend did not confirm.
5. Any new npm dependency. Everything needed is already installed.
6. Any invented fact on the page — a response time, an office hours line, a second social account,
   an address, a "we usually reply within X". If a row needs a fact not in `facts.md`, the row is
   wrong, not the facts.

---

## Scope

**In scope**

- Rebuild `src/app/[locale]/contact/page.tsx` as a two-column page (form + rail).
- New client component `src/components/contact/ContactForm.tsx`.
- New server action `src/lib/contact/actions.ts` (Turnstile → validate → send).
- New sender `src/lib/email/contact-message.ts`.
- New MK + EN strings for every visible string, in both catalogs, identical key sets.
- `Privacy` string corrections (Decision 7) and, if a new section is added, the matching render in
  `src/app/[locale]/privacy/page.tsx`.
- `Trajanov-V2-Plan.md` §4 Contact row amended (Decision 1).
- Unit tests for the action's validation and the sender, with Resend and Turnstile **mocked**.
- Docs + state files.

**Out of scope — must be byte-unchanged in the diff**

`SiteFooter.tsx` · `SiteHeader.tsx` · `HomeExperience.tsx` · `HomeShowcase.tsx` · `src/config/` ·
`supabase/` · `src/lib/orders/` · `src/lib/drop/` · `src/lib/cart/` · `src/components/cart/` ·
`src/components/checkout/CheckoutForm.tsx` · `product-images.ts` · `next.config.ts` ·
`package.json` + lockfile · `facts.md` · `brand.md` · `src/lib/site.ts`

`CheckoutField.tsx` and `Turnstile.tsx` may be **imported** but not modified. If either genuinely
cannot serve this page unchanged, do not fork it — report it in §3 of the completion report and use
a local wrapper.

---

## Tasks

### 1 — Page shell and layout

Rebuild the Contact page. Keep it **static** (`setRequestLocale`, no `force-dynamic`, no DB read) —
the form is a client island inside a static page.

- Widen the container from `max-w-2xl` to the site's wider content width so two columns have room.
- Header: existing eyebrow → H1 → **one** intro sentence (new string) explaining what the form is
  for. **Exactly one `<h1>` on the page.**
- Below the header: a two-column grid — form left, rail right, roughly 60/40 at `lg:` and above;
  one stacked column below that, form first, rail second.
- The existing `context` string (Strumica · ships NMK only · COD) stays on the page — put it at the
  foot of the rail, not in the header.

### 2 — The rail

Heading (H2) + three rows. Each row: a 16–20px Lucide line icon, a label, the value as the link
target, and a quiet sub-line where one is true.

| Row | Value | Sub-line |
|---|---|---|
| Phone | `PHONE_DISPLAY` → `PHONE_TEL` | new string: phoning is the fastest way to reach him |
| Email | `EMAIL` → `EMAIL_MAILTO` | none |
| Instagram | `INSTAGRAM_HANDLE` → `INSTAGRAM_URL` (`target="_blank"`, `rel="noopener noreferrer"`) | existing `instagramNote` |

All three values come from `src/lib/social.ts`. Every row ≥44px tall (WCAG 2.2 SC 2.5.8). Lucide has
no Instagram glyph in this version — use `AtSign`, the same honest substitution the footer already
makes (`D-2.07-2`). Do not ship a hand-drawn brand mark.

### 3 — The form

Client component, `'use client'`, modelled on `CheckoutForm.tsx` — same submit shape, same fresh
Turnstile token at submit, same error/success rendering discipline.

- Above the fields: "Required fields are marked with \*." (new string).
- Fields, in order, all `CheckoutField`:
  1. `name` — text, **required**
  2. `email` — `type="email"`, `autoComplete="email"`, **required**
  3. `subject` — text, optional (label carries "(optional)" in both languages)
  4. `message` — `textarea`, **required**
- Client-side validation mirroring `CheckoutForm.validate()`: required-empty → the existing
  `errorRequired` pattern; a malformed email → a new `errorEmail` string. Validation is UX only —
  the server validates independently and is the authority.
- Hard caps enforced **on the server** and reflected in the client: name ≤ 100, email ≤ 200,
  subject ≤ 150, message ≤ 4000 characters. Over the cap is a rejection, not a silent truncation.
- Turnstile widget below the fields, same placement and same "verifying" treatment as checkout.
- Submit button: brand mustard fill, the existing button classes, left-aligned, ≥44px tall,
  disabled + labelled while submitting.
- Under the button: the consent line with the locale-aware Privacy link (Decision 9).

### 4 — The server action

`src/lib/contact/actions.ts`, `'use server'`. Order of operations, no shortcuts:

1. `verifyTurnstile(token)` — fail closed. Reuse `isRetryableTurnstile()` so a
   `timeout-or-duplicate` tells the visitor to try again rather than accusing them of being a bot.
2. Validate and normalise: trim, enforce required, enforce the length caps, enforce a real email
   shape. Reject control characters and any `\r`/`\n` in `name`, `email` and `subject` — those three
   values reach email headers, so header injection is a real hazard. The message body may contain
   newlines.
3. Send via the new sender.
4. Return a discriminated result — `{sent: true}` or `{sent: false, reason}` — mirroring
   `PlaceOrderResult`. **Never return `sent: true` on a failed send.**

Nothing here writes to Supabase. Nothing here logs the email or the message.

### 5 — The sender

`src/lib/email/contact-message.ts`, mirroring `order-notification.ts`:

- From `ORDER_FROM_ADDRESS` (imported, not retyped). To `process.env.ORDER_NOTIFICATION_EMAIL`.
  **`replyTo` = the visitor's email** so Vladimir can reply straight from his inbox.
- Subject: a fixed greppable prefix + the visitor's subject when given, or a neutral fallback when
  not. The prefix must make contact messages sortable away from order notifications.
- Body: plain text — name, email, subject, message, and the locale the visitor was on. No HTML
  template, no tracking, nothing from `brand.md`.
- Same 8s timeout ceiling. Same "reads env at call time, not load time". Same no `import
  "server-only"` so it stays unit-testable.
- **Unlike the order sender, this one's result is NOT advisory.** For an order, email is a side
  channel and the DB is the record. Here the email **is** the record — so its result decides what
  the visitor sees.

### 6 — Privacy corrections (Decision 7)

Rewrite `Privacy.collectBody` and `Privacy.deleteBody` in **both** catalogs so the page is true, and
render any new section through the existing `LegalSection` shell. Do not touch the responsible-party
string (`D-2.03-1`) or any other legal copy.

### 7 — i18n

- Every new string in MK **and** EN. Identical key sets — assert it in a test if one does not
  already exist.
- MK is the default and the selling language. **No English string may render in the MK build.**
- Run a `humanizer` pass on all new user-facing copy. No fashion-magazine filler.
- Regenerate `docs/i18n/string-inventory.md` and commit it.
- Write `docs/i18n/mk-review-2.23.md` covering every new string **and** the two rewritten Privacy
  strings, and commit it **unsigned** — it is an owed item, not a done one.

### 8 — Accessibility

- One `<h1>`; the rail heading is an `<h2>`; no skipped levels.
- Real `<label for>` on every field (`CheckoutField` already does this) plus `aria-describedby` for
  errors and an `aria-live` region for the submit result — the checkout pattern, verified triggered.
- Keyboard: tab through every field, the Turnstile, the button and every rail link; the global
  `:focus-visible` ring must be visible on all of them, unclipped.
- **Measure contrast, do not assume it.** Report the actual ratios for: label text, placeholder
  text, the error text and error border, the submit button label on mustard, the consent line, and
  the rail sub-lines. Body text ≥4.5:1; borders and non-text indicators ≥3:1.
- `axe` on `/kontakt` and `/en/contact`: **zero serious or critical**.
- Zero horizontal overflow at 320px in both locales.

### 9 — Verification (render it — no UI phase closes sight-unseen)

Render `/kontakt` and `/en/contact` at **320, 390, 768, 1024, 1280** in both locales and check:

1. Two columns at `lg:`+, one stacked column below, form first.
2. Every rail value matches `src/lib/social.ts` exactly, and every link resolves.
3. Empty-required submit shows per-field errors and does **not** call the server.
4. A submit with Turnstile unresolved is blocked and says so.
5. With Resend mocked to fail, the UI shows the failure state and points the visitor at the phone
   and the email — **no success message**.
6. Zero console errors. (The known pre-existing MK-price hydration warning does not appear on this
   route; if anything else fires, report it.)

### 10 — Gates and state

- `npm run build`, `npx tsc --noEmit`, `npm run lint` — all clean.
- `npm test` — all existing tests still pass, **including**
  `10 simultaneous orders against 3 units → exactly 3 succeed`. Add tests for: required validation,
  email-shape validation, each length cap, header-injection rejection (`\r`/`\n` in name/email/
  subject), Turnstile failure closes the path, and the sender's success / send_error / timeout /
  unconfigured branches with Resend mocked.
- Prove the out-of-scope list is untouched: paste the output of `git diff main --name-only`.
- Log every judgement call in `Decisions.md` as `D-2.23-n`, each naming the alternative rejected and
  the downside accepted.
- Update `src/_project-state/current-state.md` (**leave line 1 unchanged** — this phase does not
  advance the critical path), `file-map.md`, and `00_stack-and-config.md` if anything changed there.
- File the completion report.

---

## Definition of Done

### Verified by Code

- [ ] `/kontakt` and `/en/contact` render form-left / rail-right at `lg:`+ and stacked below, form first
- [ ] Rail shows exactly three rows — Phone, Email, Instagram — all sourced from `src/lib/social.ts`
- [ ] Fields are Name\*, Email\*, Subject (optional), Message\*, built from `CheckoutField`
- [ ] Server action order is Turnstile → validate → send, and fails closed at every step
- [ ] `\r` / `\n` and control characters are rejected in name, email and subject
- [ ] Length caps enforced server-side: 100 / 200 / 150 / 4000
- [ ] Email sends from `info@trajanovv.com` to `ORDER_NOTIFICATION_EMAIL` with the visitor's address as `replyTo`
- [ ] A failed send renders a failure state pointing at the phone and the email — success is impossible without a confirmed send
- [ ] `Privacy.collectBody` and `Privacy.deleteBody` corrected in both catalogs; the live page no longer says "there is no form" or "we don't collect your email"
- [ ] `Trajanov-V2-Plan.md` §4 Contact row amended with the decision ID
- [ ] Zero new Supabase tables, migrations, or edits to the order path; `git diff main --name-only` proves the out-of-scope list untouched
- [ ] Zero new npm dependencies
- [ ] Zero hex / `rgb(` / `hsl(` / raw-ms / raw-easing literals in the diff
- [ ] No email address or message body in any log, error string or fixture
- [ ] MK + EN key sets identical; no English string in the MK build; `humanizer` pass run
- [ ] `string-inventory.md` regenerated; `docs/i18n/mk-review-2.23.md` committed **unsigned**
- [ ] axe: zero serious/critical on both locales; measured contrast ratios pasted in the report
- [ ] One `<h1>`; keyboard reaches every control with a visible focus ring; zero horizontal overflow at 320px
- [ ] build / tsc / lint clean; `npm test` green including the 10-vs-3 oversell gate
- [ ] `Decisions.md`, `current-state.md` (line 1 unchanged), `file-map.md` updated

### Owed to Lazar — goes on the owed-verification register

| # | Item | How to check | Pass looks like |
|---|---|---|---|
| 1 | A real message delivers end to end on production | Send one from `https://www.trajanovv.com/kontakt` | It lands in Vladimir's inbox, from `info@trajanovv.com`, and **Reply** goes back to the sender's address |
| 2 | Turnstile renders and solves on the real domain's Contact page | Load `/kontakt` on production | Widget appears and resolves; submitting without it is refused |
| 3 | The page on a real phone | Open `/kontakt` on an actual handset | Fields are tappable, the keyboard does not cover the submit button, nothing overflows |
| 4 | MK review of the new strings **and** the two rewritten Privacy strings | `docs/i18n/mk-review-2.23.md` | Signed by Lazar + Petar |
| 5 | Lazar's sign-off that a contact form is what he wants living on the site | Look at the live page | Confirmed, or reverted before the first real drop |

---

## Outputs & where they go

- Code on branch `phase-2.23-contact-form`, one PR to `main`. **Do not merge — an operator merges (`D-0-3`).**
- MK review pack → `docs/i18n/mk-review-2.23.md` (unsigned)
- Completion report → `src/_project-state/completions/Part-2-Phase-23-Completion.md`

**One more thing for the report §3.** This phase reverses a decision that was written into the Plan
at kickoff, and it corrects two legal strings that a native reviewer already stamped. If, while
building it, you find a third place where the site states or implies that no form exists — a legal
page, a meta description, `llms.txt`, a message string — **say so**. Missing one leaves the site
contradicting itself in public, which is the specific thing this phase exists to prevent.
