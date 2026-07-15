> **Saved working copy of the Phase 1.03 Code brief** (per `D-1.01-5`). Faithful to the brief the
> executor received; if Lazar's canonical file diverges, overwrite this with the authoritative one.

# Part 1 · Phase 03 · Code — Data layer (Supabase schema + atomic stock)

**Why this matters —** this is the phase that makes "SOLD OUT" true. Right now stock is a number in
a throwaway demo file. After this phase, stock lives in Postgres and decrements atomically, so when
twelve people hit the last shirt in the same second, exactly one of them gets it and the other
eleven get a clean, honest rejection. Every other phase on this project is a page. This one is the
product.

---

## Context

### What already exists
- **Phase 1.01** — Next.js (App Router) + TypeScript + Tailwind + shadcn config scaffolded on
  `main`. Versions pinned in `src/_project-state/00_stack-and-config.md`. Note `D-1.01-1`: shadcn's
  default style here is Base UI (`base-nova`), not Radix.
- **Phase 1.02** — `brand.md` filled and wired into `src/app/globals.css`. All UI components and
  every route (home, catalog, product, cart, checkout, styleguide) exist and render, MK default +
  EN. **All product data on those pages is fake**, driven by `src/lib/demo.ts`, which is throwaway.
- **Nothing is deployed anywhere. There is no hosted Supabase project.** Both are deliberate — see
  `D-1.03-5` below.
- `npm test` has no script yet. You add one in this phase.

### Read first, in this order, by path
1. `src/_project-state/current-state.md` — live state. Line 1 is the `NEXT:` line.
2. `CLAUDE.md` — standing rules. The **Secrets** and **Stock & orders** sections are load-bearing here.
3. `Decisions.md` — in particular `D-0-1` (public repo), `D-0-3` (no automated PR review),
   `D-0-4` (no CMS), `D-0-5` (why this phase exists at all).
4. `Trajanov-V2-Plan.md` § 7 (the drop engine) and § 8 (orders and notification).
5. `src/_project-state/00_stack-and-config.md` — read before adding **any** dependency.
6. `src/_project-state/file-map.md` — read before creating **any** file.
7. `facts.md` — you will not render any fact this phase, but read § 7 so you understand why every
   price, size, and name in your seed data is fake and must be unmistakably so.

### Skills to use
- `test-driven-development` — the concurrent-order test is the deliverable. Write it first, watch it
  fail against a deliberately naive read-then-write implementation, then make it pass.
- `systematic-debugging` — if the concurrency test is flaky, do not paper over it. A flaky
  concurrency test is a real bug telling you the truth quietly.
- `logging-project-decisions` — **house conflict, resolved:** that skill specifies sequential
  `D-001` IDs. **This project uses phase-namespaced `D-1.03-n`.** Ignore the skill on ID format only.
- `verification-before-completion` — paste real command output into the report, never a summary of it.

---

## Scope

### In scope
- Local Supabase (Docker) running, migrations applied, seeded.
- Schema: `drops`, `products`, `variants`, `orders`, `order_items` + constraints + indexes.
- `create_order()` — a single Postgres function that is the **only** way an order is ever created.
- `expire_reservations()` — the function. **Not** its schedule.
- Row Level Security on every table.
- Typed Supabase client (generated types, browser client, server client).
- Dev/test seed data.
- Vitest + the three test suites below, committed and runnable with `npm test`.

### Out of scope — do not touch
- **Any UI. Any page. Any component. Any string in `src/messages/`.** This PR must contain zero
  visual change. `src/lib/demo.ts` stays exactly as it is; it dies in 1.04, not here.
- **Drop state computation** (countdown / live / ended from config) — 1.04.
- **The drop config file format** (`src/config/drops.ts`, `src/config/products.ts`) and any
  config→DB sync — 1.04.
- **Scheduling** `expire_reservations()` (pg_cron / Vercel cron) — 1.04.
- **Turnstile. IP rate limiting.** — 1.04.
- **Resend / any email.** — 1.07.
- **Creating a hosted Supabase project. Any deployment. Any real key.** — 1.07.
- An audit/events table, an admin view, order editing, soft deletes. None are asked for.

---

## Decisions already made — build to these, do not re-open

These are orchestrator decisions. **Append all seven to `Decisions.md` verbatim as `D-1.03-1` …
`D-1.03-7`, attributed to the orchestrator (Claude Chat), before you write code.** Number your own
decisions from `D-1.03-8`.

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| `D-1.03-1` | **Stock is per size, on a `variants` table** — not per product. | Stock column on `products`. | One more table before sizes are even VERIFIED in `facts.md`. If Vladimir says one-size-fits-all, `variants` is a table with one row per product. |
| `D-1.03-2` | **The order *is* the reservation.** `status` + `reserved_until` on `orders`. No separate `reservations` table, despite the Phase Plan naming one. | A separate `reservations` table. | A reservation cannot exist without a full order, so a future "hold in cart" feature needs a migration. |
| `D-1.03-3` | **Order creation is one `plpgsql` function called by RPC.** Never multi-statement application code. | Doing it in the server action with `supabase-js`. | Business logic lives in SQL, which neither operator can read, and is harder to unit-test than TypeScript. Accepted because `supabase-js` has no transaction support — multi-step order creation in app code *is* the oversell bug. |
| `D-1.03-4` | **"One live order per phone per drop" is a partial unique index in the database**, not app-level rate limiting. | App-level only, in 1.04. | A legitimate second order from the same phone is impossible until the first is cancelled or expires — and no cancel action exists yet. 1.04 still owes IP limiting and Turnstile; this does not replace them. |
| `D-1.03-5` | **This phase is 100% local (Supabase via Docker). No hosted project until 1.07.** | Create the hosted project now. | Migrations are unproven against hosted Supabase until 1.07; hosted settings and extensions may differ. Accepted because it defers all real secrets out of a public repo and costs Lazar nothing today. |
| `D-1.03-6` | **`expire_reservations()` ships here; only its schedule is 1.04.** | Both in 1.04. | 1.03 grows slightly past its Phase Plan line. Accepted because a function without a test is a guess, and the test harness is being built here anyway. |
| `D-1.03-7` | **`create_order()` itself enforces the drop window** (`now()` inside `[starts_at, ends_at]`) as the last line of defence. | Rely on 1.04's drop-state computation. | The window rule will exist in two places once 1.04 lands, and they must agree. Accepted because the browser must never be what decides whether a drop is open, and a client clock is a suggestion. |

---

## Tasks

### 1. Prerequisites
Docker Desktop is installed and running (Lazar's step, done before you start). Confirm with
`docker info`. If it is not running, stop and say so — do not work around it.

Install the Supabase CLI if absent, `supabase init` if needed, then `supabase start`. Record the CLI
version in `00_stack-and-config.md`.

Local Supabase's default anon/service keys go in `.env.local` (gitignored). Add their **names only**
to `.env.example`. **No real key exists yet and none may be created this phase.**

### 2. Schema — `supabase/migrations/`
One migration, or a small ordered set. Every table gets a comment explaining what it is for.

**`drops`** — `id` uuid pk · `slug` text unique · `starts_at` timestamptz not null ·
`ends_at` timestamptz · `created_at`. Check: `ends_at is null or ends_at > starts_at`.

**`products`** — `id` uuid pk · `drop_id` → `drops` · `slug` text unique · `name_mk` · `name_en` ·
`price_mkd` integer not null, check `> 0` (MKD денари, whole units, no subunit) · `sort_order` ·
`created_at`.

**`variants`** — `id` uuid pk · `product_id` → `products` · `size` text not null · `stock` integer
not null, **check `stock >= 0`** · unique `(product_id, size)`.
> The `stock >= 0` check is a backstop, not the mechanism. If it ever fires, the atomic decrement is
> broken and you have found a real bug. Say so in the report rather than relaxing the check.

**`orders`** — `id` uuid pk · `order_number` text unique · `drop_id` → `drops` · `customer_name` ·
`phone` · `phone_normalized` · `address` · `city` · `notes` nullable · `status` (Postgres enum
`order_status`: `reserved` · `confirmed` · `fulfilled` · `cancelled` · `expired`, default
`reserved`) · `reserved_until` timestamptz not null · `total_mkd` integer not null · `created_at` ·
`updated_at` (kept current by trigger).
- `order_number`: from a sequence, format `TRJ-0001`. **A sequence advances on rollback, so numbers
  will have gaps.** That is correct and intended — gapless numbering requires contention, which is
  the thing we are removing. Note it in the report so nobody "fixes" it later.
- `phone_normalized`: check constraint `^\+389\d{8}$`. **This pattern is my best read of Macedonian
  numbering and is not a VERIFIED fact.** Vladimir's number, `078820520`, normalises to
  `+38978820520` and must pass. Add a `TODO(2.02)` comment on the constraint: the native reviewers
  confirm or loosen it. If it ever rejects a real number, loosening it is the fix.

**Partial unique index** — one live order per phone per drop:
```
unique (drop_id, phone_normalized) where status in ('reserved','confirmed','fulfilled')
```

**Index for the expiry sweep** — on `(status, reserved_until) where status = 'reserved'`.

**`order_items`** — `id` uuid pk · `order_id` → `orders` on delete cascade · `variant_id` →
`variants` · `quantity` integer check `between 1 and 2` · `unit_price_mkd` integer not null ·
unique `(order_id, variant_id)`.
> `unit_price_mkd` is a **price snapshot**, not a join. On cash on delivery the courier collects a
> specific number from a real doorstep. The order must remember the price the customer agreed to,
> even if the config changes the next day.

### 3. `create_order()` — the heart of the phase
A `plpgsql` function. **The only path that creates an order.** Signature takes the drop slug,
customer fields, pre-normalised phone, an items array (`variant_id` + `quantity`), and
`p_hold_hours integer default 48`.
> `p_hold_hours` is a parameter, not a hardcoded interval, for exactly one reason: the expiry test
> must not wait 48 hours. The 48-hour figure also appears in customer-facing copy in
> `src/messages/` — if you ever change the default, those strings must change with it.

It must, in one transaction:
1. Resolve the drop by slug. Not found → fail.
2. **Assert the drop is open**: `starts_at <= now()` and (`ends_at is null` or `now() <= ends_at`).
   Not open → fail (`D-1.03-7`).
3. Assert total quantity across all items is between 1 and 2. Otherwise → fail.
4. For each item, **sorted deterministically by `variant_id`**, decrement stock with a **single
   conditional UPDATE**:
   ```
   update variants set stock = stock - <qty>
   where id = <variant_id> and stock >= <qty>
   ```
   Zero rows affected → insufficient stock → fail, rolling the whole transaction back.
   > **Two non-negotiables here.**
   >
   > **Never read-then-write.** `SELECT stock` then `UPDATE stock = 3 - 1` is the bug this entire
   > project's review gate exists to catch (`D-0-3`). The conditional UPDATE is safe because
   > Postgres re-evaluates the `WHERE` clause under the row lock after the blocking transaction
   > commits. A `SELECT` before it does not participate in that lock and is a lie by the time you
   > act on it.
   >
   > **The sort is not cosmetic.** Two orders touching the same two variants in opposite orders
   > deadlock. Postgres detects it and aborts one — which is a 500 served to a real customer at the
   > only moment that matters. Sorting by `variant_id` makes the deadlock impossible by construction.
5. Compute `total_mkd` from each variant's product price × quantity, **read inside the transaction**.
6. Insert the order (`status = 'reserved'`, `reserved_until = now() + p_hold_hours * interval '1 hour'`)
   and its items, snapshotting `unit_price_mkd`.
7. Return `order_id`, `order_number`, `total_mkd`.

**Error vocabulary.** Each distinct failure raises a distinct, documented identifier the TypeScript
client can switch on **without string-matching a human-readable message**: drop not found · drop not
open · quantity cap violated · insufficient stock · duplicate phone for this drop. Catch the unique
violation from the phone index and re-raise it as the duplicate-phone identifier so callers see one
consistent vocabulary. Document the full list in the migration and in the completion report.

### 4. `expire_reservations()`
Returns the count of orders expired. For every order with `status = 'reserved'` and
`reserved_until < now()`: return each item's quantity to `variants.stock` and set `status = 'expired'`.

**The invariant that matters: stock must never be returned twice.** Use the same conditional-update
pattern as the decrement — flip the status with
`update orders set status='expired' where id = ... and status='reserved' returning ...`, and return
the stock **only** if that update actually claimed the row. The function must be safe to run
concurrently with itself. Prove it (see tests).

### 5. Row Level Security
**The anon key is public. It ships to every browser by design. RLS is the only thing standing
between the internet and this database.** Get this exactly right.
- Enable RLS on **all five** tables.
- `drops`, `products`, `variants` → a `SELECT` policy for `anon` and `authenticated`. **`SELECT`
  only.** No insert, update, or delete policy — an anon `UPDATE` on `variants` would let anybody on
  the internet set stock to whatever they like.
- `orders`, `order_items` → **RLS enabled and zero policies.** Deny-all. Additionally
  `revoke all ... from anon, authenticated` as belt and braces. These rows hold real customers'
  names, phone numbers, and home addresses.
- `create_order()` and `expire_reservations()` → `revoke execute ... from anon, authenticated`.
  Only `service_role` calls them, from a server action, behind Turnstile once 1.04 lands.

### 6. Typed client
- Generate types from the local DB → `src/types/database.ts`. Add the generation command as an npm
  script and record it in `00_stack-and-config.md`.
- `src/lib/supabase/client.ts` — browser client, anon key.
- `src/lib/supabase/server.ts` — server client, service role key. **First line: `import 'server-only';`**
  That turns "server only" from a convention into a build error. `file-map.md` already reserves both
  paths.
- The service role key never appears behind a `NEXT_PUBLIC_` prefix. Never.

### 7. Seed — `supabase/seed.sql`
Dev and test only. Never runs against a deployed database.

Every product slug is prefixed `test-`, so that if one of these rows ever appears in production it is
instantly obvious rather than plausible. Prices, names, and sizes here are **invented test fixtures**
and that is fine *only* because nothing in this phase renders them. Real values are owed by Vladimir
and arrive in 1.04/1.06.

Seed at minimum: one open drop, one product, and variants including one with `stock = 3` for the
concurrency test to attack.

### 8. Tests — the actual deliverable
Add Vitest. Add `"test": "vitest run"`. Record the dependency in `00_stack-and-config.md`.

**`tests/concurrency/oversell.test.ts`** — the one that matters.
- Reset to a known state: one variant, `stock = 3`.
- Fire **10 `create_order` RPCs concurrently** via `Promise.all`.
- **Each of the 10 must use a distinct phone number.** If they share one, the phone unique index
  from `D-1.03-4` rejects nine of them and the test passes for entirely the wrong reason. This is
  the single easiest way to ship a test that lies.
- Assert **all** of:
  - exactly **3** succeed;
  - the other **7** fail, and **every one of the 7 carries the insufficient-stock identifier** — a
    rejection for any other reason is a failure, not a pass;
  - `variants.stock = 0`;
  - `count(orders) = 3` and `sum(order_items.quantity) = 3`.

**`tests/concurrency/expiry.test.ts`**
- An order created with a hold that has already elapsed is expired by `expire_reservations()` and
  its stock returns exactly once.
- **Two concurrent `expire_reservations()` calls must not double-return stock.** Assert the final
  stock, not just that both calls returned without error.

**`tests/rls/anon-access.test.ts`** — using the **anon** key, assert:
- `select * from orders` returns no rows or errors;
- `select * from order_items` returns no rows or errors;
- `select * from variants` **does** return rows (the catalog must stay readable);
- `update variants set stock = 999` fails;
- `rpc('create_order', ...)` is denied.

**One more, cheap and worth it:** an order attempted **before** `starts_at` is rejected by the
database (`D-1.03-7`).

### 9. State and close
Per `CLAUDE.md`: update `current-state.md` (**including the `NEXT:` line on line 1**), both
registers, `file-map.md`, `00_stack-and-config.md`, append every decision to `Decisions.md`, and
file the completion report.

Branch `phase-1.03-data-layer`. PR to `main`. **Do not merge your own PR** — `D-0-3` requires a
fresh Claude Code session to review it first.

---

## Definition of Done

### Verified by you
- [ ] `docker info` succeeds and `supabase start` brings the local stack up.
- [ ] `supabase db reset` applies every migration and the seed from scratch, cleanly, with no manual step.
- [ ] `npm run build` passes.
- [ ] `npx tsc --noEmit` passes with zero errors.
- [ ] `npm run lint` passes with zero errors and zero warnings.
- [ ] `npm test` passes.
- [ ] **Concurrent-order test: 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected, all 7 with the insufficient-stock identifier, final stock 0.** Raw output pasted into the report — not a summary of it.
- [ ] The 10 concurrent orders each used a **distinct** phone number. Stated explicitly in the report.
- [ ] Expiry returns stock exactly once, including when `expire_reservations()` runs concurrently with itself.
- [ ] An order attempted before `starts_at` is rejected by the database.
- [ ] With the **anon** key: `orders` and `order_items` are unreadable; `variants` is readable; `update variants` fails; `create_order` is denied. All five asserted in a committed test.
- [ ] `create_order()` contains **no read-then-write on stock**. Confirm by quoting the actual decrement statement in the report.
- [ ] Variant updates inside `create_order()` are applied in deterministic `variant_id` order.
- [ ] `src/lib/supabase/server.ts` begins with `import 'server-only';` and importing it from a client component fails the build. State how you checked.
- [ ] Nothing secret sits behind `NEXT_PUBLIC_`.
- [ ] `git status` is clean of `.env*`; `.env.example` contains key **names** only.
- [ ] **Zero UI change.** `git diff --stat main` shows no file under `src/app/`, `src/components/`, or `src/messages/`. Paste the stat.
- [ ] `D-1.03-1` … `D-1.03-7` appended to `Decisions.md` verbatim, attributed to the orchestrator; your own decisions numbered from `D-1.03-8`.
- [ ] The full `create_order` error vocabulary is documented in the migration and the report.

### Owed to Lazar
Every item here goes on the owed-verification register in `current-state.md`.
- [ ] **Fresh-session review of PR #2** (`D-0-3`) — a Claude Code session that did not write this
      code reviews the PR against the brief before merge. **This is a downgrade on a real review
      gate and should be described as one in the report.**
- [ ] Anything you could not verify locally that only a hosted Supabase project can confirm — name
      it precisely and route it to 1.07.

---

## Outputs & where they go
- Migrations → `supabase/migrations/`
- Seed → `supabase/seed.sql`
- Client → `src/lib/supabase/{client,server}.ts`
- Types → `src/types/database.ts`
- Tests → `tests/concurrency/`, `tests/rls/`
- Completion report → `src/_project-state/completions/Part-1-Phase-03-Completion.md`, using the
  template in that directory.

---

## Two things worth saying plainly

**The test is the deliverable, not the schema.** A schema that looks right and a test that proves it
are not the same artifact, and only one of them survives drop day. This project waived its automated
review gate (`D-0-3`); the concurrent-order test is the thing standing in its place. It cannot be
replaced by manual testing, deferred to 1.04, or "covered by careful review" — one person cannot
click twice at once. If you run out of room, cut the seed, cut the comments, cut anything. Not the test.

**A report with an empty "surprises" section and an empty "decisions I made on my own" section is a
report nobody believes.** 1.02's report was honest about a handover referencing files that did not
exist, and that honesty is why this brief could be written correctly. If something in here is wrong
— and something usually is — say so in § 3 rather than quietly building around it.
