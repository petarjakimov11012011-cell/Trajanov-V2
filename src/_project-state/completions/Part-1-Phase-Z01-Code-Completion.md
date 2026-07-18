# Completion report — Part 1 Phase Z.01 (Code): Order notification email (Resend)

| | |
|---|---|
| **Phase** | Z.01 |
| **Name** | Order notification email (Resend) |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-18 |
| **Branch** | `phase-Z01-order-email` |
| **PR** | [#8](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/8) → `main` |
| **Brief** | Part 1 · Phase Z.01 · Code — Order notification email (Resend) |

---

## 1. What shipped

- **The moment a real order succeeds, Vladimir gets an email.** When `create_order()` returns success,
  the order path now fires a Macedonian order-notification email to `ORDER_NOTIFICATION_EMAIL` via Resend
  (`onboarding@resend.dev`), carrying the order number, each product/size/quantity, and the customer's
  name, phone, city, address, and notes — everything he needs to phone and confirm.
- **The email can never break, delay, or roll back an order.** A missing key, a Resend outage, a timeout
  (bounded at 8s), a thrown error, or an error response all degrade silently — the order still succeeds and
  the customer still sees success. The database remains the record; the email is a side channel (Plan §8,
  `D-0-5`). Proven by unit tests.
- **No customer email is collected or sent** (`D-Z.01-1`); the on-screen success state now tells the
  customer, in both locales, that it's cash on delivery and that we'll call to confirm.
- New dependency `resend 6.17.2`; sender in `src/lib/email/order-notification.ts`. `create_order()`,
  `expire_reservations()`, and every migration are untouched.

---

## 2. Decisions I made on my own

Logged in `Decisions.md`. `D-Z.01-1..4` were handed down by the orchestrator in the brief (logged verbatim);
`D-Z.01-5..7` are mine.

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| D-Z.01-5 | Notification is an optional `notifyOrder` dep on the pure `processOrder`, awaited-but-guarded after `create_order()` succeeds | Fire-and-forget after the action returns (needs `waitUntil`, Vercel-specific → portability rule); or trigger only in `actions.ts` (moves the guarantee out of the tested core) | On a *rare* Resend hang the customer's success screen waits up to ~8s (+≤4s enrichment). Normal path adds <1s. |
| D-Z.01-6 | Email names each line via a bounded, best-effort `service_role` SELECT (variant→product/size), degrading to quantity-only | Put only variant UUIDs + qty in the email (unreadable); modify `create_order()` to return lines (out of scope) | One extra bounded read on the order path after success; product name only as good as config (null → `name_en` → slug, never fabricated). |
| D-Z.01-7 | Folded the COD + call-to-confirm copy into the existing `Order.success` string (both locales), no new key | Add a separate key/banner component | COD now stated in two places (summary panel + success line); harmless, keeps the success line self-contained. |

---

## 3. Surprises and off-spec changes

- **The "phone-call-to-confirm" copy did not exist** — Task 5 says "if that copy already exists, leave it",
  but it did not. COD was stated (`Checkout.codSummary`), the reservation was stated (`reserveNote`), but
  nothing told the customer they'd be **called** to confirm. I added it by extending `Order.success` in both
  locales (`D-Z.01-7`). So Task 5 was a small *build*, not just a *verify*.
- **The email needed product/size names the order path doesn't carry.** `OrderInput` carries only
  `variant_id` + quantity (`D-1.06-7`); `create_order()` returns only id/number/total and is out of scope.
  So the email must resolve names with an extra read after success (`D-Z.01-6`). The brief's Task 3 ("passing
  the order details … product/variant/size/quantity") implies this enrichment without naming it — flagging so
  a future brief can say so explicitly.
- **I could not confirm the operator prerequisites (steps 1–3) are done.** I have no independent signal that
  the Resend account exists, the API key was created, or the two env vars are set in Vercel. The brief
  explicitly permits this path ("the wiring can still be written and unit-tested against a mocked Resend"),
  so I built + unit-tested against a mocked Resend and recorded real delivery as **owed to 1.08** (register
  #7). If the prereqs are *not* done, nothing here is invalidated — only the 1.08 live proof is blocked.
- **`facts.md` §5 was edited by Code, on the brief's explicit instruction.** `facts.md`'s own header says
  executors *propose* additions and don't silently add. This was not silent — the brief's Task 8 directed the
  exact edit (mark VERIFIED, source "owner via Lazar, 2026-07-18", env-var-only, not the literal), and it is
  surfaced here and in the `facts.md` change log. I did **not** see the address value (correctly — it is
  env-var-only), so this records provenance, not something I verified myself.

---

## 4. Files touched

`file-map.md` updated: **yes**.

| File | Added / Modified / Deleted |
|---|---|
| `src/lib/email/order-notification.ts` | **Added** (composer + best-effort sender; `.gitkeep` removed) |
| `tests/email/order-notification.test.ts` | **Added** (Resend mocked) |
| `src/lib/orders/process-order.ts` | Modified (optional `notifyOrder` dep, awaited best-effort after success) |
| `src/lib/orders/actions.ts` | Modified (enrichment `resolveOrderLines` + wire the sender) |
| `src/messages/mk.json`, `src/messages/en.json` | Modified (`Order.success` copy — COD + call-to-confirm) |
| `tests/orders/process-order.test.ts` | Modified (+4 notify-wiring cases) |
| `package.json`, `package-lock.json` | Modified (`resend 6.17.2`) |
| `Decisions.md` | Modified (`D-Z.01-1..7`) |
| `facts.md` | Modified (§5 email → VERIFIED, env-var-only; change log) |
| `src/_project-state/{current-state,file-map,00_stack-and-config}.md` | Modified (state duties) |

**Untouched, deliberately:** `create_order()`, `expire_reservations()`, every `supabase/migrations/` file,
all stock/reservation/Turnstile/rate-limit logic, every route and component, the Contact page placeholder.

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | **Pass** — compiled + TS + 17 static pages, clean |
| Types | `npx tsc --noEmit` | **Pass** — clean |
| Lint | `npm run lint` | **Pass** — 0 problems |
| Unit / integration | `npm test` | **56 passed (13 files)** — 46 prior + 6 email (Resend mocked) + 4 notify-wiring |

New tests prove the three DoD guarantees: a successful order sends exactly one email to
`ORDER_NOTIFICATION_EMAIL` from `onboarding@resend.dev` with the right fields; a thrown Resend error and a
missing env var both leave the order successful (no throw); and **no PII appears in any log line** (asserted
directly by spying on `console.error`/`console.warn`). Resend is always mocked — the real API is never called.

**Re-run concurrent-order gate (this code sits in the order path):**

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0 120ms` |

*(Note per `D-0-3`: the standalone fresh-session review and the mandatory concurrent-order gate are formal
requirements for 1.03/1.04 only; Z.01 does not require the review. The full suite — which re-runs the gate —
is green, as required.)*

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| `resend` SDK added, pinned (`6.17.2`), recorded in `00_stack-and-config.md` | ✅ |
| Sender in `src/lib/email/`, reads `RESEND_API_KEY` + `ORDER_NOTIFICATION_EMAIL` from env; no literal email/key in the repo (grep clean) | ✅ |
| Notification sent after `create_order()` succeeds, best-effort: a mocked Resend failure leaves the order successful (test proves it) | ✅ |
| Test proves a successful order calls the sender once with the correct recipient + order fields | ✅ |
| Missing env var does not crash the order path (order succeeds, warning logged, no PII) | ✅ |
| Full suite green incl. the re-run 10-vs-3 oversell gate | ✅ (56) |
| `npm run build && npm run lint && npx tsc --noEmit` all clean | ✅ |
| `create_order()`, `expire_reservations()`, `supabase/migrations/` untouched; no PII in any log line | ✅ |
| On-screen customer confirmation states COD + phone-call-to-confirm in both locales | ✅ |
| `Decisions.md`, `file-map.md`, `00_stack-and-config.md`, `current-state.md` (Built + `NEXT: 1.08` + register), `facts.md` §5 updated; report filed | ✅ |

### Owed to Lazar / 1.08

| # | Item | Steps | What "pass" looks like |
|---|---|---|---|
| 7 | A real order actually sends a notification email that arrives in Vladimir's inbox | Confirm operator prereqs (Resend account under Vladimir's email + confirmation-link click, API key, `RESEND_API_KEY`/`ORDER_NOTIFICATION_EMAIL` in Vercel Prod+Preview, Sensitive); open a live priced drop; place a real order end to end | Vladimir receives the MK notification with the order details |
| 8 | Branded from-address on `trajanov.com` | After the domain is bought + verified (2.05), change `ORDER_FROM_ADDRESS` | Notifications send from a `@trajanov.com` address |

Both added to the owed-verification register in `current-state.md` (as #7 and #8).

---

## 7. Placeholders shipped

**None new.** The Contact-page email placeholder (register #5) is **left in place deliberately** (`D-Z.01-3`)
— the email now exists but is not published publicly without Vladimir's sign-off. No other placeholder was
added or cleared.

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED entry in `facts.md` | ✅ (the only new user-facing copy is `Order.success`; COD/48h/call-to-confirm all match Plan §8 + `facts.md` §7 COD) |
| `humanizer` pass run on user-facing copy | ✅ (present tense, direct address, no filler) |
| No fashion-magazine filler | ✅ |
| No invented testimonials / reviews / counts / awards / partners / team / address | ✅ |
| Template-propagated strings verified once against `facts.md` | ✅ (n/a — one string, both locales) |
| No AI-generated product imagery (`D-0-6`) | ✅ (n/a) |
| No untranslated EN string in the MK build | ✅ (MK/EN key sets identical at 130; both `Order.success` translated) |

*The order-notification email body is in Macedonian and goes only to Vladimir — it is an internal ops email,
deliberately **not** part of the `next-intl` UI catalogs (per the brief).*

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ✅ (diff grepped: no email literal beyond `onboarding@resend.dev`/`example.test` in tests, no `re_` key, no PII) |
| `.env*` still gitignored | ✅ (`git check-ignore`: `.env.local`, `.env.hosted` both hit `.gitignore:34 .env*`) |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ✅ (no env var added; `RESEND_API_KEY`/`ORDER_NOTIFICATION_EMAIL` are server-only reads) |
| No order PII (phone, address) in logs | ✅ (log lines carry only the order number + Resend error code; asserted by test) |

No secret was committed at any point on this branch.

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| Real email delivery to Vladimir's inbox (register #7) | Operator prereqs done + a live priced drop + a real order (1.08) | Lazar → Vladimir |
| Branded from-address (register #8) | `trajanov.com` purchase + verification (2.05) | Lazar |
| Confirmation that operator prereqs 1–3 are done | Lazar (dashboards) | Lazar |

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ✅ |
| `current-state.md` — owed-verification register (#7, #8 added) | ✅ |
| `current-state.md` — placeholder register (#5 note updated) | ✅ |
| `file-map.md` — matches disk | ✅ |
| `00_stack-and-config.md` — `resend 6.17.2` + change-log row | ✅ |
| `Decisions.md` — `D-Z.01-1..7` appended | ✅ |

**`NEXT:` line I set:** `NEXT: 1.08 — Verification gate (real order end to end; owed-verification register
must be empty). Z.01 (order email) SHIPPED …`
