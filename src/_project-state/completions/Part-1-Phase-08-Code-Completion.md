# Completion report — Part 1 Phase 08: Verification gate (Code half)

> **Read this first:** this phase is a **"Code + Operator" gate**, and **only the Code half ran this
> session.** The operator directed (in chat) that the hosted verification proceed now, that the Z.01 email
> prereqs are **unconfirmed**, and that the **live phone order be skipped for now**. So the gate is **NOT
> passed** — the Code-verifiable half is done and evidenced against the live Frankfurt DB, and the operator
> half is packaged as a runbook (`Part-1-Phase-08-Operator-Runbook.md`). `NEXT:` stays `1.08` (`D-1.08-3`).

| | |
|---|---|
| **Phase** | 1.08 |
| **Name** | Verification gate (Code half) |
| **Executor** | Claude Code |
| **Operator** | Petar (this session) / Lazar (dashboard + human register items) |
| **Date** | 2026-07-18 |
| **Branch** | `phase-1.08-verification-gate` |
| **PR** | *(not opened yet — see §10; the operator half + email prereq are still open)* |
| **Brief** | Part 1 · Phase 1.08 · Code + Operator — Verification gate |

---

## 1. What shipped

- **The real price and sizes are now recorded facts.** `facts.md` §7 marks **1199 MKD**, currency **MKD**, and
  sizes **S/M/L/XL (off-white XL-only)** as VERIFIED (owner via Lazar, 2026-07-18); the old ~$65/3,700 MKD
  indicative ceiling is SUPERSEDED. `src/config/products.ts` prices the rehearsal drop's two verified
  colourways at 1199 MKD. Fabric/care + a per-size measurement chart stay OWED.
- **The order machine was re-proven against real infrastructure.** On the live Frankfurt DB: the full suite
  **56/56**, including the **10-vs-3 oversell gate** (exactly 3 succeed, 7 rejected, stock 0); reservation
  expiry driven by the **live pg_cron job** (not a manual call); **Turnstile enforcement with the real
  production secret**; and the **IP + phone rate limits**.
- **Hosted was left clean.** Every hosted write was a seed/test fixture, removed afterward. Final state:
  `orders/order_items/order_attempts = 0`, only the ended `test-drop`, **2 active cron jobs**,
  `order_number_seq` reset so the first **real** order is **TRJ-0001**.
- **The placeholder register moved:** #1 (price) **cleared**, #4 **narrowed to product-names-only** (sizes now
  real). Owed-verification register: **#5 cleared** (Turnstile enforcement), **#8 reclassified to 2.05**.
- **The human half is packaged**, not skipped: `Part-1-Phase-08-Operator-Runbook.md` is a step-by-step
  open→order→verify→close + design-signoff/IG/toggle/housekeeping runbook.

**What did NOT ship (deferred, operator):** publishing the buyable rehearsal drop; the one real phone order;
the notification email in Vladimir's inbox; the design sign-off; the IG click-test; the auto-expose toggle.

---

## 2. Decisions I made on my own

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| `D-1.08-3` | Run + evidence the gate's **Code half** against hosted this session; **defer** the live order + human register items to an operator runbook; prove Turnstile + rate limits at the **server-side calls the action makes** (Siteverify with the real secret; `check_order_rate_limit` RPC; `create_order` `TR005`), not by hand-driving the deployed Server Action; **`NEXT:` stays `1.08`**. | (a) Open a public buyable drop + synthesise an end-to-end order without a human; (b) set `NEXT: 2.01` and declare the register at zero; (c) hand-craft a `Next-Action` POST to the Server Action. | The gate does not fully pass this session; #1/#2/#6/#7 stay open; enforcement proven at the RPC/Siteverify layer, not a browser-driven end-to-end submit (that is the operator's live order). |

`D-1.08-1` and `D-1.08-2` are the **orchestrator's**, logged verbatim in `Decisions.md` as instructed by the
brief (machinery-gate-vs-real-catalog; #8 → 2.05).

---

## 3. Surprises and off-spec changes

- **The gate cannot be completed by Code alone, and the operator deferred its human half.** The brief's DoD
  assumes the live order + inbox check + human register items happen in-session. Given the operator's answers
  (email prereqs unconfirmed; skip the live order), the register **cannot reach zero this session**. I did the
  Code half and wrote a runbook rather than force a synthetic order. **The brief's "register to zero / NEXT =
  2.01 / one real order" items are therefore open, not done.**
- **Task 5 method.** "Submit an order request to production" via the deployed **Next Server Action** is not
  cleanly scriptable (needs the hashed action id + a browser-solved token, and an open drop). I proved Turnstile
  enforcement at the exact server call the action makes — Cloudflare **Siteverify with the real production
  secret** — matching the 1.07 methodology. Faithful, but not a browser-driven end-to-end submit. Flagged so
  the orchestrator can decide if the operator's live order (which *is* end-to-end) is considered the closing
  evidence for the bot-challenge nuance of #5.
- **Task 6 method.** Same reason: IP limit exercised via the `check_order_rate_limit` RPC and the phone limit
  via `create_order`'s `TR005` — the exact server-side calls, but not through a browser submit.
- **The priced config was deliberately NOT synced to hosted.** Because the live order is deferred, syncing the
  new priced products (and opening a buyable drop) would expose merchandise publicly for no verification gain.
  Hosted therefore still carries the OLD null-priced `test-piece-01..04`; the runbook's step 1a syncs the new
  config when the operator runs the order.
- **`src/config/products.ts` structure.** The brief says "set the price on the drop's products and the real
  per-product sizes (mustard/ochre → S,M,L,XL; off-white → XL only)." I modelled the rehearsal as exactly those
  **two verified colourways** (down from four placeholder `test-piece-*`), since those are the only real garment
  identities we have and they map 1:1 to the required sizes — including the single-variant XL-only path the
  brief calls out. Names stay `null` (colourway used only as an internal slug).

---

## 4. Files touched

`file-map.md` updated: **yes**.

| File | Added / Modified / Deleted |
|---|---|
| `facts.md` | Modified — §7 price/sizes VERIFIED; change-log row; header date |
| `src/config/products.ts` | Modified — rehearsal priced 1199 MKD; two verified colourways; sizes real; names null |
| `src/config/drops.ts` | Modified — rehearsal comment (no longer "priced null") |
| `Decisions.md` | Modified — `D-1.08-1`, `D-1.08-2` (verbatim), `D-1.08-3` |
| `src/_project-state/current-state.md` | Modified — `NEXT:`, status block, both registers, integrations, parallel track, direct-verified note |
| `src/_project-state/file-map.md` | Modified — rehearsal note + change-log row |
| `Part-1-Phase-08-Operator-Runbook.md` | Added (repo root) — the operator half |
| `src/_project-state/completions/Part-1-Phase-08-Code-Completion.md` | Added — this report |

**No `supabase/migrations/` file, `create_order`, `expire_reservations`, component, route, message-catalog, or
test file changed. No new npm dependency.** Hosted verification used scratchpad-only scripts (outside the
repo) + seed/test fixtures, all cleaned up.

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | **pass** (17 routes; drop-state routes dynamic) |
| Types | `npx tsc --noEmit` | **pass** (exit 0) |
| Lint | `npm run lint` | **pass** (clean) |
| Unit / integration (local) | `npm test` | **56 passed (56)**, 13 files |
| Unit / integration (**hosted Frankfurt**) | exported `.env.hosted` vars → `npm test` | **56 passed (56)**, 25 s, target `kmuocwmevyyuhcvwoebf.supabase.co` |

**Phase 1.08 — mandatory concurrent-order test (re-run against HOSTED):**

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ tests/concurrency/oversell.test.ts > create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0 726ms` |

**Live pg_cron reservation expiry (hosted, observed — not a manual call):**
```
[09:57:34Z] order created; stock 5 -> 3 (held 2); hold backdated
[09:57:55Z .. 09:59:56Z] poll: status=reserved, stock=3   (waiting for */5 cron)
[10:00:16Z] poll: status=expired, stock=5   ← returned by the scheduled job
cron.job_run_details: expire-reservations @ 2026-07-18T10:00:00Z  status=succeeded  return_message='1 row'
active cron jobs: 2
```

**Turnstile enforcement (hosted, real production secret):**
```
missing token → success:false  codes:[missing-input-response]
invalid token → success:false  codes:[invalid-input-response]
wrong secret  → success:false  codes:[invalid-input-secret]   (control — proves the real secret is validated)
hosted orders = 0  (no order row created; no stock change)
```

**Rate limits (hosted, the exact order-path calls):**
```
IP  check_order_rate_limit(max=5): attempts 1..7 allowed = [T,T,T,T,T,F,F]  → 5 allowed, 2 rejected
Phone create_order same phone/drop: 1st = ok, 2nd = TR005 (duplicate_phone); stock decremented only by the 1st
```

---

## 6. Definition of Done

### Verified here (by me, Code)

| Item | Result |
|---|---|
| `facts.md` §7 — price 1199 MKD, MKD, sizes S/M/L/XL + off-white XL-only VERIFIED; ceiling superseded; fabric OWED | ☑ |
| `src/config/products.ts` — real price + real per-product sizes (off-white XL-only); no USD | ☑ |
| Placeholder register — #1 cleared, #4 narrowed to names-only; #2/#3/#5 unchanged | ☑ |
| Concurrent oversell re-run **against hosted** — 10/3 → exactly 3, stock 0 (output pasted) | ☑ |
| Reservation expiry observed **live on hosted**; `cron.job` = 2; test rows cleaned | ☑ |
| Turnstile enforced server-side — missing/invalid token rejected; no order row; no stock change (#5) | ☑ (Siteverify/real-secret method; §3) |
| Rate limits (IP + phone) fire; excess rejected; test rows cleaned | ☑ (RPC/`TR005` method; §3) |
| Hosted returned known-clean via targeted deletes (no `db reset --linked`); TRJ reset to 0001 | ☑ |
| **Rehearsal drop published (buyable) then closed; one real order end to end** | ☐ **deferred — operator** |
| **Owed register to zero; `NEXT:` = 2.01** | ☐ **not met — #1/#2/#6/#7 open** |

### Owed to Lazar / a real device / Vladimir's inbox (all in the runbook)

| # | Item | Steps | What "pass" looks like |
|---|---|---|---|
| Prereq | Z.01 email keys live | Runbook §0 | Resend account under Vladimir's email; `RESEND_API_KEY` + `ORDER_NOTIFICATION_EMAIL` in Vercel (Prod+Preview, Sensitive); redeploy |
| #7 | Real order end to end + email in inbox | Runbook §1–3, `https://trajanov-v2.vercel.app` | Order row + atomic decrement + 48h reservation; on-screen COD + call-to-confirm + **1199 ден**; MK email in Vladimir's inbox |
| #1 | Design sign-off | Runbook §4 — review 7 pages | Tokens approved or exact changes logged |
| #2 | Instagram click-test | Runbook §4 — click `@trajanovv2026` | Opens Vladimir's real profile |
| #6 | Auto-expose toggle OFF | Runbook §4 — Supabase Settings → API | Toggle off |
| L1–L4, L7 | Housekeeping | Runbook §5 | Stray projects removed; password+pepper saved; token revoked; uptime monitor live |

---

## 7. Placeholders shipped

**No new placeholder shipped.** This phase **cleared** one and **narrowed** another:

| Placeholder | Page | Change | Owner |
|---|---|---|---|
| `[PLACEHOLDER: цена MKD]` (price) | Catalog/Product/Cart/Checkout | **CLEARED** — 1199 MKD VERIFIED + in config (clears on the site when the operator syncs) | — |
| Product **names** as neutral slots + sizes-as-sample | Catalog/Product | **NARROWED to names-only** — sizes now real (VERIFIED); measurements still owed | Vladimir |

Unchanged: #2 photo, #3 fabric/care, #5 contact email (`D-Z.01-3`).

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED `facts.md` entry | ☑ (1199 MKD + sizes now VERIFIED; names stay placeholder — not rendered as real) |
| `humanizer` pass run on user-facing copy | ☑ (no new user-facing copy this phase) |
| No fashion-magazine filler | ☑ |
| No invented testimonials / reviews / counts / awards / partners / team / address | ☑ |
| Template-propagated strings verified once against `facts.md` | ☑ (n/a — no generated copy) |
| No AI-generated product imagery (`D-0-6`) | ☑ (none) |
| No untranslated EN string in the MK build | ☑ (no string changes) |

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ☑ |
| `.env*` still gitignored | ☑ (`.env.hosted`/`.env.local` untouched, gitignored) |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ☑ |
| No order PII (phone, address) in logs | ☑ (test data only, on the isolated hosted fixtures, deleted) |

**No secret was committed at any point on this branch.** All hosted credentials were sourced from gitignored
`.env.hosted` into the shell only; helper scripts live in the session scratchpad (outside the repo) and print
only query results + the DB **host** (never the URL, user, or password). The real Turnstile secret was read
from env and never printed.

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| Z.01 email prereqs (Resend account + Vercel keys) | Confirmation / setup in the dashboards | Lazar |
| One real order end to end + email in Vladimir's inbox (#7) | The prereqs + a real phone order (runbook §1–3) | Lazar/Petar + Vladimir's inbox |
| Design sign-off (#1), IG click-test (#2), auto-expose toggle (#6) | Human review / dashboard | Lazar |
| Housekeeping L1–L4, L7 | Dashboards / password manager / uptime monitor | Lazar |
| Opening the PR + setting `NEXT: 2.01` + register-to-zero | The operator half completing | Whoever closes the gate |

**On the PR:** I have **not** opened it, because (a) my rules are to commit/push only when asked, and (b) the
phase is genuinely half-done — the PR should represent a closeable gate or be explicitly labelled the Code
half. The branch holds the Code work ready to commit whenever the operator says.

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ☑ (set to `1.08 (operator half)`, **not** 2.01 — the gate isn't passed) |
| `current-state.md` — owed-verification register | ☑ (#5 cleared, #8→2.05, #1/#2/#6/#7 open) |
| `current-state.md` — placeholder register | ☑ (#1 cleared, #4 narrowed) |
| `file-map.md` — matches disk | ☑ |
| `00_stack-and-config.md` — new deps / pins / config | ☑ n/a (no dependency/config change) |
| `Decisions.md` — every §2 entry appended | ☑ (`D-1.08-1/2/3`) |

**`NEXT:` line I set:** `NEXT: 1.08 (operator half) — Verification gate. The CODE half PASSED against hosted …
STILL OWED before Part 2 … The owed-verification register is NOT yet empty — do not start 2.01 until it is.`
