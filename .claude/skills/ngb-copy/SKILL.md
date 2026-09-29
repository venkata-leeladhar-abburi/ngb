---
name: ngb-copy
description: NGB Evolve voice, word list, number and unit formats, English/Telugu/Tenglish rules, microcopy and ASCI claim rules. Use when writing, placing or editing any user-facing text - content JSON, CMS seed data, button labels, alt text, aria labels, form errors, meta titles, WhatsApp templates.
---

# NGB Evolve copy rules

## Where copy comes from (in this order)
1. `docs/copy/home.md` (homepage, sections numbered 0 to 13) and `docs/copy/pages.md` (inner pages)
2. `docs/copy/voice.md` (full voice guide) and the CMS
3. The microcopy library below

Your job is to place approved copy, not to write marketing copy.
- Headlines, body, claims, numbers, testimonials, prices: never invent. If missing, put a visible `TODO(copy)` and list it in your report.
- Functional microcopy that is not in the docs (a new field's range error, an aria label, placeholder alt text):
  draft it in English by copying the pattern of the library below, list every drafted line under "Drafted microcopy" in your report,
  and set the Telugu value to `TODO(te)`. Never machine-translate Telugu.
- A `[TE REVIEW]` marker in the docs means the Telugu line is not approved yet. Use it, and list it.
- A `[CONFIRM]` marker means the fact (price, date, refund days) is not confirmed. Use it, and list it.

## Voice: Nawin talking to a younger brother at the gym
1. **Anna, not guru.** First person from Nawin ("I", "my plan"); second person to the reader ("you"). No "we at NGB". The support team is "Team NGB".
2. **Short.** Headlines up to 8 words; Rush Driver lines up to 5. Sentences under 15 words where possible.
3. **Specific.** Kilos, weeks, rupees, grams, real foods. "Eat 3 eggs more" beats "boost your protein".
4. **Honest.** No guaranteed results, no 30-day miracles, no fake scarcity, no invented numbers.

If a line would sound odd coming out of Nawin's mouth in a Reel, it does not go on the site.

## Words
| Use | Avoid |
| --- | --- |
| plan, batch, day one, real food, Telugu food | journey to greatness, unlock your potential, transform your life |
| Start my plan (the only buy label) | Join now, Get started, Enroll, Explore programs, Buy now |
| Try free tools (the only free label) | Free resources, Discover, Learn more |
| skinny, belly, strong, lean | fat guy, weak, ugly, any body-shaming |
| 12 weeks, 4 days a week | fast, instant, guaranteed, miracle, hack |
| hostel, mess, pappu, perugu, rice | clean eating, macro jargon without explaining it |
| Team NGB | experts, gurus |

Buttons: verb first, 1 to 3 words. Approved set: Start my plan · Try free tools · Show my number · Send my plan · Count my plate.
The checkout pay button shows the amount ("Pay ₹1,999"). No two buttons on one screen with the same intent.

## Formats (use the helpers in `apps/web/lib/format.ts`; create them there if missing)
- Money: `₹1,999`, Indian grouping `₹1,00,000` via `Intl.NumberFormat('en-IN')`. Prices come from the database, stored in paise.
- Per-day price next to every program price: `round(price / (weeks × 7))`, e.g. ₹1,999 / 84 days = ₹24 a day; ₹1,499 / 56 days = ₹27 a day. Compute it, never type it.
- Units: kg, cm, kcal, g, L. Height input may offer ft + in; results always in cm and kg.
- Time: "12 weeks", never "3 months". Dates as "1 October".
- Casing: write sentence case in content; uppercase only through CSS, so screen readers read words, not letters.
- No em dashes anywhere in UI copy. Use a full stop, a comma or a middle dot (·).

## English, Telugu and Tenglish
- English is the default site. `/te` is the full Telugu-script version. Tenglish (Telugu in English letters) is allowed only as short supporting hooks in the English site, never for prices, legal text or instructions.
- Transcreate, don't translate. Telugu comes from the native copywriter. Machine translation is not allowed on the live site.
- Fitness words stay in English inside Telugu: protein, sets, reps, kcal, cardio, plan.
- Neutral Telugu in the UI. Regional slang ("mawa", "bava") stays in Reels.
- One script per headline, except English loanwords ("నీ Day One ఈరోజే").
- Telugu runs 20 to 30% longer and taller. Never cut a Telugu line to fit; tell me the layout needs room.
- Every key exists in both `apps/web/content/en.json` and `te.json`. Keys are `page.section.element` (e.g. `home.hero.headline`). A unit test compares the two key sets; add it if missing.

## Microcopy library (reuse these exact lines)
| Moment | Copy |
| --- | --- |
| Required field empty | Please enter your weight. |
| Number out of range | Enter a weight between 30 and 200 kg. |
| Invalid phone | Enter a 10-digit mobile number. |
| Loading a result | Calculating your number… |
| Lead saved | Done. Check WhatsApp in a minute. |
| WhatsApp consent | I agree to get my plan and fitness tips from NGB Evolve on WhatsApp. I can stop anytime. |
| Copy link | Link copied. |
| Video locked | This workout is inside Mass Builder. |
| Offline | You're offline. We'll save your check-in and send it when you're back. |
| Logout | You're logged out. See you tomorrow. |
| Cookie banner | We use cookies to measure what helps. Accept · Only essential |

New errors follow the same shape: say what to do, name the limit, end with a full stop. Never "Invalid input" or "Error".

## Alt text and labels
- Photos: describe the person and the result, not the file. "Arjun from Guntur after 12 weeks, 7 kg heavier." Names and numbers only from consented results in the CMS.
- Decorative words, speed lines, plate rings, heart-rate lines: `aria-hidden`, no alt.
- Icon-only buttons get an `aria-label` from content ("Play Chest at home, 12 minutes").
- Placeholder images: alt "Placeholder: <what the real photo will show>".

## Claims and compliance (ASCI)
- No guaranteed outcomes. Results show weeks and starting point; every before/after has written consent and is unedited.
- Health line on every program and tool page: "This is general fitness guidance, not medical advice. Check with a doctor if you have a medical condition."
- Supplements are never required to buy or finish a program. Label any paid brand collaboration.
- WhatsApp messages use only the approved templates in `docs/strategy/handoff.md` section 5.

## Before you say copy work is done
- [ ] Every string comes from content or the CMS, in both languages (or `TODO(te)` listed)
- [ ] Buy label is "Start my plan", free label is "Try free tools", nothing else
- [ ] Per-day price shown next to every program price
- [ ] `grep -rn "—" apps/web/content apps/web/sections packages/ui/src` returns nothing
- [ ] Report lists: TODO(copy), TODO(te), drafted microcopy, [CONFIRM] and [TE REVIEW] lines used
