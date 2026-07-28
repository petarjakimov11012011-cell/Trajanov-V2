# Native MK review — Phase 2.23 (Contact form + Privacy corrections)

**For Lazar and Petar.** Phase 2.23 turned the Contact page into a real two-column page — a message
form on the left, the three ways to reach Vladimir on the right — and it **rewrote two live Privacy
strings** that a native reviewer already stamped in the 2.03 pack, because both became false the
moment a form with an email field exists. This pack covers **15 new `Contact` strings, 2 new
`Privacy` strings, the 2 rewritten `Privacy` strings, and 2 rewritten `Meta` descriptions** —
21 rows. Macedonian is the source language (the English is a translation of it), so this review is
the one that catches a fault before it ships.

> **Same job as the 2.02 / 2.03 / 2.11 / Y.03–Y.05 / 2.21 packs.** You are looking for **faults**
> (something *wrong* in Macedonian — spelling, grammar, case/agreement, a wrong or inconsistent
> word, wrong punctuation, an English word stuck in the Macedonian), **not taste**. Correct
> Macedonian you would have phrased differently stays. You do not touch code or run anything —
> just read, and fill in the three columns on the right.

**This file is UNSIGNED on purpose.** Doing the review is not part of the phase that wrote the
copy. Until both boxes in Section 4 are checked, nothing changes.

---

## 1. Four things to check specifically

- **The rewritten Privacy strings carry legal weight.** `Privacy.collectBody` and
  `Privacy.deleteBody` were stamped by you in the 2.03 pack and have now been *changed* — the old
  text said „Не собираме е-пошта — нема поле за е-пошта" and „Нема формулар и нема портал", both
  false once the form ships. Read the new versions as what they are: a public privacy statement on
  a site selling under a minor's name. Wrong here is worse than wrong anywhere else on the site.
- **„контакт-форма(та)" as the word for the form.** It appears in `Privacy.contactFormBody` and
  `Privacy.deleteBody`. Confirm the hyphenated compound reads as natural Macedonian (against e.g.
  „формулар за контакт") and that its definite forms are right.
- **The imperative „Испрати" and the progressive „Се испраќа…"** — a button label and its
  in-flight state. Confirm both forms are correct for a submit control.
- **„Побарај нè директно"** — the rail heading, rendered UPPERCASE („ПОБАРАЈ НЀ ДИРЕКТНО").
  Confirm the clitic „нè" (with grave) is right and survives the uppercase rendering correctly on
  screen (`/kontakt`, right column).

---

## 2. How to do this review

The full instructions are in `docs/i18n/mk-review-2.02.md` §1 and have not changed. In short:

- **Verdict** — one of `OK` (correct, leave it), `Fault` (wrong), or `Style` (correct, but you'd
  note a preference — recorded, not applied).
- **Corrected MK** — only if `Fault`: type the corrected Macedonian exactly as it should appear.
- **Reviewer** — your initial (`L` / `P`); add the second initial when you agree with the first.

To see them in place: open `/kontakt` (the form, the rail, the consent line), submit the empty form
(the two error strings), and open `/privatnost` (the two rewritten bodies and the new section). The
two `Meta` descriptions are visible in the page source (`<meta name="description">`) on `/kontakt`
and `/privatnost`.

---

## 3. The full string table — 21 rows

### New `Contact` strings (15)

| Key | МК (review this) | EN (meaning) | Where it renders | Verdict | Corrected MK | Reviewer |
|---|---|---|---|---|---|---|
| `Contact.intro` | Прати ни порака и ќе ти одговориме по е-пошта. | Send us a message and we'll reply by email. | Under the H1 on `/kontakt` |  |  |  |
| `Contact.requiredNote` | Задолжителните полиња се означени со *. | Required fields are marked with *. | Above the form fields |  |  |  |
| `Contact.formName` | Име | Name | Field label (required) |  |  |  |
| `Contact.formEmail` | Е-пошта | Email | Field label (required) |  |  |  |
| `Contact.formSubject` | Наслов (по избор) | Subject (optional) | Field label |  |  |  |
| `Contact.formMessage` | Порака | Message | Field label (required, textarea) |  |  |  |
| `Contact.errorEmail` | Внеси валидна е-пошта. | Enter a valid email address. | Under the email field on a malformed address |  |  |  |
| `Contact.errorTooLong` | Предолго — најмногу {max} знаци. | Too long — max {max} characters. | Under a field over its length cap — `{max}` is a number filled in by code |  |  |  |
| `Contact.send` | Испрати | Send | The submit button |  |  |  |
| `Contact.sending` | Се испраќа… | Sending… | The same button while the message is on its way |  |  |  |
| `Contact.consent` | Со испраќањето се согласуваш податоците да ги користиме само за одговор. Повеќе во <link>политиката за приватност</link>. | By sending, you agree we use your details only to reply. More in the <link>privacy policy</link>. | Under the button — `<link>` wraps the Privacy-page link |  |  |  |
| `Contact.success` | Пораката е испратена. Ќе ти одговориме на е-пошта. | Message sent. We'll reply to your email. | Status line, ONLY after Resend confirms the send |  |  |  |
| `Contact.sendFailed` | Пораката не се испрати. Јави се на {phone} или пиши на {email}. | The message didn't send. Call {phone} or write to {email}. | Status line on a failed send — `{phone}`/`{email}` filled in by code from `social.ts` |  |  |  |
| `Contact.railHeading` | Побарај нè директно | Reach us directly | The right-column H2, rendered UPPERCASE |  |  |  |
| `Contact.phoneNote` | Најбрзиот начин да добиеш одговор. | The fastest way to get an answer. | The quiet sub-line under the phone number |  |  |  |

### New and rewritten `Privacy` strings (4) — **the two rewrites were previously signed in the 2.03 pack**

| Key | МК (review this) | EN (meaning) | What changed | Verdict | Corrected MK | Reviewer |
|---|---|---|---|---|---|---|
| `Privacy.collectBody` **(rewritten)** | Име, телефонски број, град, адреса и белешката ако ја пополниш. Тоа е сè што собира нарачката — при нарачка нема поле за е-пошта. | Name, phone number, city, address, and your note if you leave one. That's everything an order collects — ordering has no email field. | Was: „…Тоа е сè. Не собираме е-пошта — нема поле за е-пошта." — false once the contact form exists; now scoped to orders only |  |  |  |
| `Privacy.contactFormHeading` **(new)** | Што собираме кога ни пишуваш | What we collect when you write to us | New section heading on `/privatnost`, directly after the order section |  |  |  |
| `Privacy.contactFormBody` **(new)** | Ако ја користиш контакт-формата: име, е-пошта, наслов ако внесеш и самата порака. Сето тоа му стигнува на Владимир како е-пошта за да ти одговори — тоа е единствената употреба. Не се чува во базата на сајтот. | If you use the contact form: your name, email address, the subject if you add one, and the message itself. It reaches Vladimir as an email so he can reply — that's the only use. It isn't stored in the site's database. | The new section body — this is the legal description of the form's data path |  |  |  |
| `Privacy.deleteBody` **(rewritten)** | Јави се телефонски и ќе ги избришеме. За порака пратена преку контакт-формата, доволен е и одговор во е-поштата. | Call us and we'll delete them. For a message sent through the contact form, a reply in the email thread works too. | Was: „…Нема формулар и нема портал — само телефонскиот број." — false once the form exists |  |  |  |

### Rewritten `Meta` descriptions (2) — a third place the old claims lived

| Key | МК (review this) | EN (meaning) | What changed | Verdict | Corrected MK | Reviewer |
|---|---|---|---|---|---|---|
| `Meta.contactDescription` | Стапи во контакт: прати порака или побарај нè по телефон и на Инстаграм. Струмица, Северна Македонија. | Get in touch: send a message, or reach us by phone and Instagram. Strumica, North Macedonia. | Was „…телефон и Инстаграм…" only — no mention of the form |  |  |  |
| `Meta.privacyDescription` | Што собираме кога нарачуваш или ни пишуваш, и зошто. Без рекламни колачиња. | What we collect when you order or write to us, and why. No advertising cookies. | Was „…без е-пошта, без рекламни колачиња." — the „без е-пошта" claim became false |  |  |  |

**Count check:** 21 rows above. `string-inventory.md` moved 255 → **272** (+15 `Contact`, +2
`Privacy`); the 4 rewrites changed existing keys, not the count. The field-required error reuses the
already-reviewed `Checkout.errorRequired` („Ова поле е задолжително."), the in-progress Turnstile
line reuses `Checkout.verifying`, and the bot-protection / check-failed / generic-error strings
reuse the reviewed `Order` keys — nothing else to review.

**Register check:** the `humanizer` pass was run over all 21 strings — nothing fired.

---

## 4. Reviewer sign-off

Both boxes must be filled before Claude applies any fixes. A review with one signature is not a
review. Replace the blanks with your name and date, and change `[ ]` to `[x]`.

**Reviewer 1 — Lazar**

- Name:
- Date:
- [ ] I read all 21 rows in context and confirm the Macedonian is correct — specifically the two
      rewritten Privacy strings I previously signed in the 2.03 pack.

**Reviewer 2 — Petar**

- Name:
- Date:
- [ ] I read all 21 rows (and Reviewer 1's verdicts) and agree.

**Result:** _(fill in when both boxes are checked — passed with no changes, or the list of faults)._

---

*When both sign-off boxes are checked, tell Claude "the 2.23 MK review is signed off" and it will
apply any fixes and re-run the checks. Until then, nothing in the code changes.*
