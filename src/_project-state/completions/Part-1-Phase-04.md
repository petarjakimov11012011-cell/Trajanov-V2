# Completion report — Part 1 Phase 04: Drop engine

| | |
|---|---|
| **Phase** | 1.04 |
| **Name** | Drop engine — config→DB sync, server drop-state, pg_cron, Turnstile, IP rate-limit |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-15 |
| **Branch** | `phase-1.04-drop-engine` |
| **PR** | #4 |
| **Brief** | `briefs/Part-1-Phase-04-Code.md` |

---

## 0. Task 0 — the state-file path defect (resolved)

- **Canonical path is `src/_project-state/`** — confirmed on disk and in git. The four state files are
  tracked (`git ls-files` lists `current-state.md`, `file-map.md`, `00_stack-and-config.md`, and the
  `completions/` folder) and present in `main`'s tree. `file-map.md` was right all along.
- **Why the orchestrator got a 404 on `main/src/_project-state/current-state.md`:** best read — the
  fetch happened before PR #3 merged, or hit a stale ref. The files have been tracked since 1.01
  (`git log --diff-filter=A` → `271ab2c`, Phase 1.01), so there is no path to fix. The `main` tree
  contains them now.
- **`Trajanov-V2-Plan.md` still does not exist**, and it is **referenced** in four tracked files:
  `Decisions.md`, `briefs/Part-1-Phase-03-Code.md`, `src/_project-state/current-state.md` (parallel-track
  section: "Canonical table with gates: `Trajanov-V2-Plan.md` § 13"), and
  `completions/Part-1-Phase-03-Completion.md`. I did **not** edit those — per Task 0 the orchestrator
  decides whether to commit the plan or drop the references. Flagging, not fixing.
- I did fix one stale internal pointer in `file-map.md` (its tree header said "Phase 1.01" and the
  status/change-log were 1.03) as part of the normal state-file update.

---

## 1. What shipped

- **A drop can now open and close on its own.** The countdown, catalogue, and buy button are driven by
  the **database, computed on the server** — `src/lib/demo.ts` is deleted. A 16-year-old with a changed
  system clock cannot move the drop: the countdown is anchored to the server's clock and re-validates
  with the server at T-0.
- **A typed drop config + a sync script** (`src/config/`, `npm run sync:drop`). Lazar edits two files and
  re-runs the sync; there is no admin UI (`D-0-4`). The sync **never resets stock** and **refuses to
  publish a priceless drop**.
- **Reservations actually expire.** `expire_reservations()` is scheduled by **pg_cron** every 5 minutes,
  with a nightly prune of the run log. A lapsed 48h hold now returns its unit to stock.
- **The order path is guarded.** Real Cloudflare **Turnstile** (server-side Siteverify, token minted at
  submit) + an **IP rate limit** (peppered SHA-256, 20 / 10 min, threshold on the drop row, no raw IP
  stored), both server-side and *before* `create_order()`. A full order was placed end-to-end in the
  browser (`TRJ-0001`).
- **It is now impossible to sell a shirt at a made-up price.** `create_order()` rejects a null-priced
  product with `TR006`; `price_mkd` and product names are nullable so nobody is forced to invent them.

---

## 2. Decisions I made on my own

Logged in `Decisions.md`, `D-1.04-10` … `D-1.04-18` (the orchestrator's `D-1.04-1` … `D-1.04-9` were
appended verbatim first, before any code).

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| `D-1.04-10` | Nullable price/name applied to **`products`**, not `variants` (the brief's column does not exist); names also nullable. | Move price to `variants` to match the brief literally. | Deviates from the brief's literal text; flagged in §3. Names-nullable is scope beyond the enumerated "price". |
| `D-1.04-11` | Config→DB sync uses a **direct Postgres admin connection**, not the service-role client. | Grant `service_role` catalogue writes (re-opens a direct stock-write path — `D-1.03-9`). | The sync needs a superuser DB URL; hosted parity (1.07) must confirm the operator has it. |
| `D-1.04-12` | The committed rehearsal `test-drop` is an **ended** drop. | A future/live rehearsal — refused by the null-price preflight (`D-1.04-6`). | Default render is the "ended" state; obviousness comes from `test-` slugs + the placeholder banner + dev preview. |
| `D-1.04-13` | Server-computed state + a **dev-only `?preview`** override replace the 1.02 client preview switcher. | Keep the client switcher (a client-side lie about drop state). | Home loses its visible preview buttons in production (a small change to a design-system scaffold). |
| `D-1.04-14` | IP hashed **in Node** (pepper never in the DB); 10-min window is an app constant, only the count threshold is a DB column. | Hash in Postgres with pgcrypto (puts the pepper in the DB). | Count-then-insert is best-effort — a concurrent race can overshoot by one; ledger grows (noted for 1.07). |
| `D-1.04-15` | Added **`tsx`** (dev) to run the TS sync script. | Native Node TS (fails on the repo's extensionless imports); `"type":"module"` (project-wide change). | One dev dependency; `tsx` transpiles to CJS so the CLI wraps top-level `await`. |
| `D-1.04-16` | Order path wired + tested; **no product→cart→checkout item flow built** (out of scope). Checkout submits a stand-in item. | Build a full cart system (out of scope); disable checkout entirely (defeats Task 6). | In-browser checkout orders a stand-in, not a user-chosen item — a real cart flow is future work (carryover). |
| `D-1.04-17` | Turnstile in **execute/interaction-only** mode; Siteverify **omits `remoteip`**. | Checkbox at page load (`D-1.04-8` stale-token trap); send the raw IP to Cloudflare. | The "verifying" indicator now appears *after* submit, not before — the correct behaviour for a countdown. |
| `D-1.04-18` | `LOW_STOCK_THRESHOLD = 5` as a documented display constant. | Per-drop DB column; derive it from stock. | `5` is a guess about when "low" should shout; one-line change, not a stock-safety issue. |

---

## 3. Surprises and off-spec changes

- **The brief's `variants.price_mkd` is wrong — price lives on `products.price_mkd`.** Verified against
  the live schema and `create_order()` (which joins variant → product to read/snapshot the price).
  `variants` carry only `(product, size, stock)`. I applied the nullable change + CHECK + `TR006` to
  `products.price_mkd`, the column that actually exists (`D-1.04-10`). **The brief should be corrected**
  wherever it says `variants.price_mkd` (D-1.04-6, Task 2). This is the single most important thing for
  the orchestrator to fix before 1.05.
- **Task 1 and D-1.04-6 collide on the committed rehearsal drop.** Task 1 wants one committed drop priced
  `null`; D-1.04-6's preflight refuses to write any *open or future* drop with a null price. The only
  self-consistent committed rehearsal is therefore an **ended** drop (`D-1.04-12`). Worth naming so 1.05
  doesn't expect the site to show a live/countdown drop by default from the committed config alone.
- **The brief says the sync writes "via the service-role client", but `D-1.03-9` (from 1.03) made
  `service_role` SELECT-only on all tables.** Those two can't both hold without re-opening a direct
  `service_role` stock-write path. I used a direct Postgres admin connection instead (`D-1.04-11`),
  matching how the tests already arrange DB state.
- **`server-only` enforcement + a testing gotcha.** (a) A `server-only` module cannot be imported from a
  Vitest (Node) test — it throws at import. So the pure IP-hash and the order-pipeline core were split
  into non-server-only modules (`rate-limit/hash.ts`, `orders/process-order.ts`) to keep them testable,
  with the Supabase-touching parts staying server-only. (b) When proving the `src/lib/drop` guard, a
  temp client page under `_guard/` built **fine** — because App-Router folders prefixed with `_` are
  *private* and excluded from routing. Renamed to a real route → the build correctly failed with the
  `server-only` error. (Flagging in case a future guard-check silently "passes" for the same reason.)
- **The local seed competes with the committed config for "active drop".** `supabase db reset` always
  runs `seed.sql`, which seeds a **live, priced** `test-open-drop`. Because `getActiveDropView` prefers a
  live drop, the local site renders the *seed* drop (which is why the live-state screenshots show
  "ТЕСТ — Маица 01 · 999 ден"), not the ended committed `test-drop`. This is a **local-only** artifact —
  `seed.sql` never runs against a deployed DB (`D-1.03-5`), so in production only synced config drops
  exist. It was actually convenient: the seed's priced live drop let me prove real name+price rendering
  and a real end-to-end order in-browser.
- **`ends_at` nullability quirk in `create_order`, unchanged but worth noting:** an open-ended drop
  (`ends_at NULL`) is treated as perpetually open by the window check. Not touched this phase; fine for
  the current model (one drop, one direction).

---

## 4. Files touched

`file-map.md` updated: **yes**.

| File | A/M/D |
|---|---|
| `supabase/migrations/20260715120000_price_name_nullable.sql` | Added |
| `supabase/migrations/20260715120001_create_order_tr006.sql` | Added |
| `supabase/migrations/20260715120002_rate_limit.sql` | Added |
| `supabase/migrations/20260715120003_pg_cron.sql` | Added |
| `src/config/{schema,time,drops,products,index}.ts` | Added |
| `scripts/{sync-core,sync-drop}.ts` | Added |
| `src/lib/drop/state.ts` | Added (server-only) |
| `src/lib/orders/{process-order,actions,phone}.ts` | Added |
| `src/lib/rate-limit/{hash,ip}.ts` | Added |
| `src/lib/turnstile/verify.ts` | Added (server-only) |
| `src/lib/{social,format}.ts` | Added |
| `src/components/checkout/Turnstile.tsx`, `src/components/system/DevPreviewSwitch.tsx` | Added |
| `src/lib/orders/order-errors.ts` | Modified (+TR006, `isOrderErrorCode`) |
| `src/app/[locale]/{page,catalog/page,catalog/[slug]/page,checkout/page,styleguide/page}.tsx` | Modified (real data) |
| `src/components/home/HomeExperience.tsx` | Modified (props-driven, T-0 re-validate) |
| `src/components/drop/Countdown.tsx` | Modified (server-time anchor) |
| `src/components/drop/DropBanner.tsx`, `layout/SiteFooter.tsx` | Modified (import IG from `social.ts`) |
| `src/components/product/{ProductCard,SizePicker}.tsx`, `checkout/CheckoutForm.tsx` | Modified |
| `src/messages/{mk,en}.json` | Modified (Order namespace, `opening`, `Catalog.ended`; pruned dead preview keys) |
| `src/types/{drop,database}.ts` | Modified (ProductView/SizeOption; regenerated) |
| `package.json`, `package-lock.json` | Modified (`tsx` dev dep + `sync:drop` script) |
| `.env.example` | Modified (added `ORDER_IP_HASH_PEPPER` name; Turnstile notes) |
| `tests/config/{time,sync,cron}.test.ts`, `tests/orders/{price-missing,rate-limit,process-order}.test.ts` | Added |
| `src/lib/demo.ts`, `src/components/checkout/TurnstilePlaceholder.tsx` | **Deleted** |
| `src/config/.gitkeep`, `src/lib/drop/.gitkeep`, `src/lib/rate-limit/.gitkeep` | Deleted (dirs populated) |
| `Decisions.md`, `current-state.md`, `file-map.md`, `00_stack-and-config.md` | Modified (state) |
| `.env.local` | Modified — **gitignored**, not committed (added dummy Turnstile keys + local pepper) |

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | **exit 0** (13 routes; 4 drop-state routes `ƒ` Dynamic) |
| Types | `npx tsc --noEmit` | **exit 0** (0 errors) |
| Lint | `npm run lint` | **exit 0** (0 errors, 0 warnings) |
| Unit / integration | `npm test` | **exit 0 — 10 files, 31 tests passed** (13 prior + 18 new) |

New tests: DST resolver (summer 18:00Z + winter 19:00Z + spring-forward edge); sync no-reset-stock,
idempotent, refuses-null-price-naming-product, refuses-price-after-open; `TR006` no-decrement; rate
limit 20-ok/21-rejected + stored-value-is-a-hash; Turnstile/rate-limit gate `create_order`; both
pg_cron jobs present after `db reset`.

**`supabase db reset` from scratch produces a working pg_cron schedule:**

```
Applying migration 20260715120000_price_name_nullable.sql...
Applying migration 20260715120001_create_order_tr006.sql...
Applying migration 20260715120002_rate_limit.sql...
Applying migration 20260715120003_pg_cron.sql...
-- select jobname, schedule, active from cron.job:
expire-reservations     | */5 * * * * | t
prune-cron-run-details  | 17 3 * * *  | t
```

### Concurrent-order test — 10 simultaneous orders / 3 units — **MANDATORY**

| | |
|---|---|
| **exactly 3 succeeded, 7 rejected: YES** | all 7 carrying `TR004 insufficient_stock` |
| Test file | `tests/concurrency/oversell.test.ts` (unchanged; re-run against the modified `create_order`) |
| Distinct phone per attempt? | **YES** — 10 of 10 |

Raw output of the re-run gate (one-off script, not committed) — proving the added `TR006` guard did
not weaken the atomic decrement:

```
distinct phones    : 10 of 10
succeeded          : 3
failed             : 7
failure breakdown  : {"TR004 insufficient_stock":7}
final variant stock: 0
orders rows        : 3
sum(order_items.qty): 3
```

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| `supabase db reset` applies all migrations + seed from scratch, working pg_cron schedule (2 jobs) | ☑ |
| `npm run build`, `npx tsc --noEmit`, `npm run lint` — exit 0, zero warnings | ☑ |
| `npm test` — 13 prior + new tests pass (31 total) | ☑ |
| **10 orders / 3 units → exactly 3 succeed, 7 `TR004`, stock 0** (raw output above) | ☑ |
| Sync does not reset stock (`D-1.04-5`) | ☑ `tests/config/sync.test.ts` |
| Sync is idempotent (second run a no-op) | ☑ |
| Sync refuses a current-or-future drop with a null price, naming the product | ☑ |
| `create_order()` rejects a null price with `TR006` and does not decrement | ☑ `tests/orders/price-missing.test.ts` |
| Timezone: `2026-08-15T20:00`→18:00Z **and** `2026-01-15T20:00`→19:00Z, both | ☑ `tests/config/time.test.ts` |
| `expire_reservations()` still returns stock exactly once | ☑ `tests/concurrency/expiry.test.ts` (unchanged) |
| IP rate limit rejects the 21st, permits the 20th; stored value is a **hash, not an IP** | ☑ `tests/orders/rate-limit.test.ts` |
| No-token and invalid-token both rejected **before** `create_order()` | ☑ `tests/orders/process-order.test.ts` |
| `rg "demo"` finds no live import; `src/lib/demo.ts` deleted | ☑ |
| `src/lib/drop/` server-only — client import fails the build | ☑ (proven; see §3 on the `_`-folder gotcha) |
| No hardcoded colour/size/spacing (tokens from `brand.md`) | ☑ |
| No Vercel-specific dependency/config/service added | ☑ (Turnstile loads Cloudflare `api.js`) |
| `.env*` gitignored; `.env.example` names only; nothing secret behind `NEXT_PUBLIC_`; no order PII/IP logged | ☑ |
| Every `TR001`–`TR006` has MK + EN copy; no EN string in the MK build | ☑ |
| `humanizer` pass run on new copy | ☑ (removed em-dash overuse from the order messages) |
| `D-1.04-1…9` verbatim (orchestrator); mine from `D-1.04-10`, each with alt + downside | ☑ |
| State files updated (`NEXT:` line, both registers, `file-map`, `00_stack-and-config`) | ☑ |
| **Rendered the site in all three states + every page** against the 1.02 handover | ☑ (see below) |

**UI rendered (not sight-unseen).** Ran the dev server and checked in-browser against the 1.02
handover — all matched, and the only intended visual change is the retired client preview switcher
(now dev-only, `D-1.04-13`):

- Home **countdown** — eyebrow + ticking server-anchored timer + headline + browse link.
- Home **live** — mustard live banner + remaining count + product grid (real name + `999 ден` + in-stock).
- Home **ended** — quiet bar + `@trajanovv2026` follow link.
- **Catalog** — preview notice + state-aware subtitle + product grid.
- **Product** — real name/price/sizes, buy button state from the server drop state.
- **Cart** — unchanged (2-unit cap notice, steppers, placeholders).
- **Checkout** — fields + Turnstile box + place-order; **a full order succeeded in-browser** →
  "Нарачка TRJ-0001 е примена" (Turnstile mint → Cloudflare Siteverify → rate limit → `create_order`;
  DB confirmed: phone `078820520`→`+38978820520`, stock decremented, ledger row is a 64-char hash).
- **EN** locale — real EN names, no MK leakage.

### Owed to Lazar

| # | Item | Steps | "Pass" looks like |
|---|---|---|---|
| 1 | **Fresh-session review of PR #4** (`D-0-3`) — **a downgrade on a real review gate**, not an equal substitute. **Required for 1.04.** | A Claude Code session that did NOT write this reviews PR #4 vs the brief; must cover the modified `create_order()` (`TR006`) and the sync's stock behaviour. | Reviewer confirms no oversell path, the `TR006` guard is before the decrement, and the sync never resets stock. Clears at merge. |
| 2 | **Hosted-Supabase parity** (`D-1.03-5`, extended by `D-1.04-1`) — migrations, RLS, real keys, **pg_cron, and the rate-limit table** are unproven against hosted Supabase. **A paused free-tier project silently pauses pg_cron.** | In 1.07: create the hosted project, apply migrations, confirm `cron.job`, re-run the RLS + order assertions. | Both cron jobs active; anon still walled; an order succeeds via the server client. |
| 3 | **Real Turnstile keys** — dummy test keys only until 1.07/2.05. | Create the Cloudflare account + keys; set the env vars; confirm a real challenge. | A real bot challenge appears; dummy keys are gone from production. |

---

## 7. Placeholders shipped

No **new kinds** of placeholder — the four existing ones are unchanged, but their **source moved** from
`src/lib/demo.ts` (deleted) to the **DB via the typed config**: a null `price_mkd`/`name_*` renders the
price/name placeholder.

| Placeholder | Page | Waiting on | Owner |
|---|---|---|---|
| `[PLACEHOLDER: цена MKD]` | Catalog, Product, Cart, Checkout | Real MKD prices per drop | Vladimir |
| `[PLACEHOLDER: фотографија — Владимир]` | Catalog, Product | Real product photos (`D-0-6`) | Vladimir |
| `[PLACEHOLDER: состав и нега — од етикетата]` | Product | Fabric/care from the labels | Vladimir |
| Product **names** as neutral slots; sizes flagged **sample** | Catalog, Product | Real names + sizes | Vladimir |

Photo + fabric/care have **no DB column yet** (they arrive with 1.06 photos / a later phase); they are
pure UI placeholders. Filling `products.ts` price/name + `npm run sync:drop` clears the price/name
placeholders for a real drop. **No fact was invented to avoid a placeholder.**

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED `facts.md` entry | ☑ (IG handle §6; COD/shipping §7; no new claims) |
| `humanizer` pass run on user-facing copy | ☑ |
| No fashion-magazine filler | ☑ |
| No invented testimonials / reviews / counts / awards / partners / team / address | ☑ |
| Template-propagated strings verified once against `facts.md` | ☑ (n/a — no templated facts) |
| No AI-generated product imagery (`D-0-6`) | ☑ (photo slots stay placeholders) |
| No untranslated EN string in the MK build | ☑ (verified in-browser on `/`) |

MK copy: the new `Order.*` strings are the orchestrator/executor's best read and, like all MK copy, are
owed a **native review at 2.02** (`facts.md`). `TR004` reads "someone got there first" (not an error);
`TR006` is honest self-guard copy the customer should never see.

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ☑ |
| `.env*` still gitignored (`.env.local` present, ignored) | ☑ |
| Nothing secret behind `NEXT_PUBLIC_` | ☑ (only the Supabase URL/anon key + the Turnstile **sitekey**, all public by design) |
| No order PII (phone, address) or IP in any log | ☑ (nothing logs order data; the IP is hashed, never stored raw) |

**No secret was committed at any point in this branch.** `.env.local` holds Supabase's shared-default
local keys, Cloudflare's **published dummy** Turnstile keys, and a throwaway local pepper — none are
secrets, and the file is gitignored regardless. Real Turnstile keys + a real pepper are set in the
dashboards in 1.07, never committed. `npm audit`: unchanged from 1.03 (2 moderate build-time `postcss`
advisories, transitive via `next`, pre-existing; the "fix" downgrades Next catastrophically — not
applied).

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| Real product→cart→checkout **item flow** (checkout currently orders a stand-in item, `D-1.04-16`) | A future UI phase | — |
| Hosted Supabase project + real keys + hosted pg_cron/RLS parity | 1.07 (by `D-1.03-5`/`D-1.04-1`) | Lazar/Vladimir |
| Real Turnstile keys | 1.07 / 2.05 | Lazar |
| Real prices / names / sizes / fabric / photos (placeholders until then) | parallel track | Vladimir |

Nothing was left undone within 1.04's stated scope.

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — `NEXT:` on line 1 | ☑ |
| `current-state.md` — owed-verification register | ☑ (removed the now-resolved PR-#3 review; added PR-#4 review, Turnstile keys; extended hosted parity with pg_cron) |
| `current-state.md` — placeholder register | ☑ (source note: DB/config, not `demo.ts`) |
| `file-map.md` — matches disk | ☑ |
| `00_stack-and-config.md` — new deps / env / config | ☑ (`tsx`, `ORDER_IP_HASH_PEPPER`, Turnstile keys, pg_cron) |
| `Decisions.md` — `D-1.04-1…18` | ☑ |

**`NEXT:` line I set:** `NEXT: PR #4 fresh-session review (required, D-0-3) before merge → then Part 1 Phase 05`
