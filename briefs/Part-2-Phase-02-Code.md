# Part 2 · Phase 02 · Code — Native MK review

**Why this matters —** every Macedonian word a customer reads was written by a machine and
approved by nobody who speaks the language natively. This phase puts two native speakers in
front of all 150 strings and all 8 URLs, and fixes what they find. The seller is a minor
selling cash-on-delivery to an audience that starts at age 12; bad Macedonian is the first
thing that makes a real customer distrust the site on their doorstep.

---

## Context

**Read these first, in this order, by path:**

| Path | Why |
|---|---|
| `src/_project-state/current-state.md` | Live status. Line 1 is the `NEXT:` line. Nothing in this brief outranks it. |
| `src/_project-state/completions/Part-2-Phase-01-Completion.md` | What 2.01 shipped, and §3 "Surprises" + §10 "Blocked / carryover" — both feed this phase. |
| `docs/i18n/string-inventory.md` | **The review instrument.** 150 keys × MK / EN / where. Regenerate with `npm run i18n:inventory`. |
| `facts.md` | The only legal source for any factual claim on the site. |
| `brand.md` | Tokens. Copy changes must not break line lengths / layout at 390px. |
| `CLAUDE.md` (repo root) | Standing repo rules. |
| `src/i18n/routing.ts`, `next.config.ts` | The `pathnames` map and the 308 redirect table that must stay in lockstep with it. |
| `Decisions.md` | `D-2.01-1…12`. This phase appends `D-2.02-n`. |

**State you are inheriting:**

- 2.01 merged to `main` (PR `#10`, merge commit `a39cada`) and is **live** at
  `https://trajanov-v2.vercel.app`. MK slugs are serving; old English MK paths 308.
- `src/messages/mk.json` and `src/messages/en.json` hold **150 keys each, identical key
  sets**, enforced by `tests/i18n/catalog-parity.test.ts`.
- The MK route slugs shipped in 2.01 are **provisional pending this review** (`D-2.01-5`).
  They are Latin transliteration:

  | Route | MK slug (live) | EN slug (live) |
  |---|---|---|
  | Catalog | `/katalog` | `/en/catalog` |
  | Product | `/katalog/<slug>` | `/en/catalog/<slug>` |
  | Cart | `/kosnicka` | `/en/cart` |
  | Checkout | `/naracka` | `/en/checkout` |
  | About | `/za-nas` | `/en/about` |
  | Contact | `/kontakt` | `/en/contact` |

- Owed-verification register: **EMPTY**. Keep it empty. Anything this phase cannot verify
  itself goes on the register with a named verifier, and that is a regression to explain.
- Placeholder register: unchanged, **not empty** (product photos, composition/care, email).
  Placeholders are a launch blocker checked at 2.05 — not this phase's job to clear.

**The two reviewers are Lazar and Petar.** Both are native Macedonian speakers. Neither
writes code. Every instruction you give them must be plain language, step-by-step, with the
full path or the full URL, and must not assume they will run a terminal command.

---

## Scope

**In scope**

1. Producing a review pack the two reviewers can work through without you.
2. Collecting their verdicts on all 150 MK strings and all 8 MK URLs.
3. Applying **mechanical MK faults**: spelling, grammar, case, agreement, wrong or
   inconsistent terminology, punctuation that is wrong in Macedonian, an English word left
   in the MK build, a Macedonian word left in the EN build.
4. **Confirming or changing the six provisional MK route slugs**, and carrying any change
   through `routing.ts`, `next.config.ts`, the redirect table, the tests, and the live site.
5. Recording every verdict, including "no change", in a committed review record.

**Out of scope — do not touch**

- **Rewriting correct-but-awkward MK for tone or style.** If a string is correct
  Macedonian, it stays. Log the reviewer's stylistic note in the review record and move on.
  This phase fixes faults, not taste.
- **The ~12 apparently-dead message keys** flagged by 2.01 (`Home.title`, `Home.tagline`,
  `Product.details`, `Buy.viewProduct`, `Checkout.botCheck`, and the rest). They stay.
  Deleting a key that renders in an untriggered state is a live-site bug for no benefit.
  Review their MK text like any other key; do not remove them.
- `supabase/migrations/` — no file. `create_order`, `expire_reservations`,
  `check_order_rate_limit` — unchanged.
- `src/config/` (drop + product config), `scripts/sync-drop`, and **the hosted database**.
  Do not run `npm run sync:drop`. Do not write to `kmuocwmevyyuhcvwoebf`.
- Any new npm dependency.
- The English copy's *wording*, except where it is an outright error or leaks Macedonian.
  MK is the source language; EN is its translation.
- Design tokens, layout, components' structure. If a longer MK string breaks a layout at
  390px, shorten the string — do not change the component.
- The placeholder register. Do not clear, reword, hide, or "improve" any
  `[PLACEHOLDER: …]` string so it reads less like a placeholder. The marker text inside it
  may be corrected for Macedonian; the marker itself stays visible.

---

## Tasks

### 1. Build the review pack

Create `docs/i18n/mk-review-2.02.md`. It is written **for Lazar and Petar**, not for you.
It must contain, in this order:

1. **How to do this review** — three short paragraphs, plain language: what you are looking
   for (faults, not style), what to write in the verdict column, and roughly how long it
   takes.
2. **The URL walk** — all 8 pages in both locales, as clickable absolute links on
   `https://trajanov-v2.vercel.app`, in this order: Home, Catalog, Product, Cart, Checkout,
   About, Contact, Styleguide. Use a real product slug from the deployed drop
   (`test-mustard-ochre` or `test-off-white`) — check it resolves before you write it down.
   For each page: one line saying what to look at.
3. **The slug question**, stated once and plainly: for each of the six MK slugs, does a
   Macedonian speaker reading the address bar recognise the word, and is the Latin
   transliteration the right choice? Give them a **Keep / Change to ___** column. State
   explicitly that Cyrillic slugs are a valid answer and that changing a slug is cheap now
   and expensive after the domain is live.
4. **The full string table** — all 150 keys, copied from `docs/i18n/string-inventory.md`,
   with three added columns: **Verdict** (OK / Fault / Style note), **Corrected MK**, and
   **Reviewer** (L / P). Pre-fill nothing.
5. **The "intentionally not translated" list**, reproduced from the inventory, with a line
   telling reviewers these are correct by design and only need flagging if the *reason* is
   wrong.
6. A short closing section: **Reviewer sign-off** — name, date, and "I read every row" for
   each of the two reviewers.

Both reviewers work through the **same** file, one after the other, so the second sees the
first's verdicts. Second reviewer marks agreement or disagreement rather than starting fresh.

### 2. Hand it over and wait

Commit the review pack on the phase branch and tell the operator, in the handover message,
exactly which file to open and where it is. **Do not proceed to Task 3 until both sign-off
lines are filled in.** A review pack with one signature is not a native MK review.

### 3. Apply the string fixes

For every row marked **Fault**:

- Apply the corrected MK to `src/messages/mk.json`.
- Check the corresponding EN value. If the fault was a mistranslation, EN may now be the
  wrong translation of the corrected MK — fix EN too, and say so in the report.
- If the corrected string carries a **factual claim** (price, sizes, shipping, COD,
  competition, press, contact), re-verify it against `facts.md` and cite the section in the
  report. A corrected string that introduces an unverified fact does not ship — it ships as
  a `[PLACEHOLDER: …]` and goes on the placeholder register.
- Run a `humanizer` pass over every changed MK and EN string.

For every row marked **Style note**: record it in the review record, change nothing.

### 4. Resolve the slugs

If all six are **Keep**: log `D-2.02-n` recording that the provisional slugs are now
confirmed, and remove the "provisional" language from `routing.ts`'s comment and from
`current-state.md`.

If any slug is **Change**:

- Update `src/i18n/routing.ts` `pathnames` to the new slug.
- Update `next.config.ts` so that **both** the original English path *and* the now-retired
  2.01 slug 308 to the new slug. The 2.01 slugs have been live and publicly reachable since
  2026-07-19 — they must not start 404ing. Example, if `/kosnicka` became `/korpa`:
  `/cart → /korpa` **and** `/kosnicka → /korpa`.
- Update `tests/i18n/pathnames.test.ts` so route folders ⇔ `pathnames` still holds.
- Confirm no hand-written slug exists anywhere outside `routing.ts` / `next.config.ts`
  (`grep` and show the result in the report).
- Log the change as its own decision with the reviewers' reason.

### 5. Verify

- `npm run i18n:inventory` — regenerate `docs/i18n/string-inventory.md` and commit it, so
  the inventory reflects the corrected MK.
- `npm run build`, `npx tsc --noEmit`, `npm run lint` — all clean.
- `npm test` — all green against the **local** Colima stack, including the
  **10-simultaneous-orders-against-3-units** gate. Paste the oversell line verbatim in the
  report. This phase does not touch the order path; the gate is re-run because it is the
  standing protection and it is never skipped.
- Prove the parity test still bites: remove one key from `en.json`, watch the test go RED,
  restore it, watch it go GREEN. Paste both outputs.
- Render every changed page in-browser at **390px and 1180px, both locales**, and confirm
  no corrected string overflows, wraps badly, or breaks a button.

### 6. Close the phase

Follow `writing-completion-reports` and `syncing-project-state`. Open a PR from the phase
branch to `main`. **Lazar merges Petar's PRs and Petar merges Lazar's** — do not merge your
own work, and there is no GitHub Action and no CodeRabbit on this project (`D-0-3`).

---

## Definition of Done

**Review pack**

- [ ] `docs/i18n/mk-review-2.02.md` committed, containing all six required sections.
- [ ] All 150 keys present as rows with Verdict / Corrected MK / Reviewer columns.
- [ ] All 8 pages × 2 locales listed as working absolute links on the deployed site.
- [ ] Both reviewer sign-off lines filled in with a name and a date.
- [ ] Every one of the 150 rows carries a verdict — no blank rows.

**Fixes applied**

- [ ] Every row marked **Fault** is fixed in `mk.json`, and its EN counterpart checked.
- [ ] No row marked **Style note** was changed; each is recorded in the review record.
- [ ] No message key added or removed. Key count is still identical between `mk.json` and
      `en.json` and the parity test passes.
- [ ] Every corrected string carrying a factual claim cites a VERIFIED `facts.md` section
      in the report.
- [ ] `humanizer` pass run on every changed string.
- [ ] No `[PLACEHOLDER: …]` string was cleared, reworded to hide it, or removed.

**Slugs**

- [ ] Each of the six MK slugs is recorded in the report as Keep or Change, with the
      reviewers' reason.
- [ ] If changed: `routing.ts` and `next.config.ts` agree; the old English path **and** the
      retired 2.01 slug both 308 to the new one, proven by `curl` status + `Location` for
      each.
- [ ] `grep` shows no hand-written localised slug outside `routing.ts` / `next.config.ts`.
- [ ] All 8 MK URLs and all 8 `/en/` URLs return **200**, proven by `curl`.
- [ ] If unchanged: the word "provisional" is gone from `routing.ts` and `current-state.md`,
      and a decision records the confirmation.

**Quality gates**

- [ ] `npm run build`, `npx tsc --noEmit`, `npm run lint` all clean.
- [ ] `npm test` green; the 10-vs-3 oversell line pasted verbatim.
- [ ] Parity test proven RED then GREEN, both outputs pasted.
- [ ] `docs/i18n/string-inventory.md` regenerated and committed.
- [ ] `git diff --name-only main | grep supabase/migrations` returns nothing;
      `create_order` and `expire_reservations` unchanged.
- [ ] No new npm dependency; `package.json` dependencies unchanged.
- [ ] Nothing written to the hosted DB; `sync:drop` not run.
- [ ] Every changed page rendered in-browser at 390px + 1180px in both locales.

**State**

- [ ] Owed-verification register still **EMPTY**.
- [ ] Placeholder register unchanged.
- [ ] `NEXT:` line on line 1 of `current-state.md` updated.
- [ ] `Decisions.md` appended with `D-2.02-n` for every decision, including the slug verdict
      and any decision you made on your own that this brief did not specify.

---

## Outputs & where they go

| Output | Path |
|---|---|
| Review pack (the reviewers' working file) | `docs/i18n/mk-review-2.02.md` |
| Regenerated inventory | `docs/i18n/string-inventory.md` |
| This brief | `briefs/Part-2-Phase-02-Code.md` |
| Completion report | `src/_project-state/completions/Part-2-Phase-02-Completion.md` |
| Branch | `phase-2.02-mk-review` → PR to `main` |

Report the review pack's location to the operator as soon as Task 1 is committed. That
handoff is the long pole in this phase — everything after it is fast.
