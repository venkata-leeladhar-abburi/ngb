# Voice, microcopy and bilingual rules

> Source: `docs/strategy/handoff.md` section 10, copied verbatim on 2026-09-29. The `ngb-copy` skill summarises these rules for Claude.

## 10. Voice, microcopy and bilingual rules

Write like Nawin talks to a younger brother at the gym: short, direct, specific, and never fake. If a line would sound odd coming out of his mouth in a Reel, it doesn't go on the site.

### Four voice rules

1. **Anna, not guru.** First person from Nawin ("I", "my plan"), second person to the reader ("you"). No "we at NGB".
2. **Short.** Headlines up to 8 words; hero headlines in Rush Driver up to 5. Sentences under 15 words where possible.
3. **Specific.** Kilos, weeks, rupees, grams, real foods. "Eat 3 eggs more" beats "boost your protein".
4. **Honest.** No guaranteed results, no 30-day miracles, no fake scarcity, no invented numbers.

### Words to use and avoid

| Use | Avoid |
| --- | --- |
| plan, batch, day one, real food, Telugu food | journey to greatness, unlock your potential, transform your life |
| Start my plan (the one buy label) | Join now, Get started, Enroll, Explore programs |
| skinny, belly, strong, lean (words they use) | fat guy, weak, ugly, any body-shaming |
| 12 weeks, 4 days a week | fast, instant, guaranteed, miracle, hack |
| hostel, mess, pappu, perugu, rice | clean eating, macros-only jargon without explaining it |
| Team NGB (for the support team) | experts, gurus |

### Formats

- **Rupees:** ₹1,999; Indian grouping for large numbers (₹1,00,000). Always show ₹ per day next to a program price.
- **Units:** kg, cm, kcal, g, L. Offer ft + in for height input only.
- **Time:** "12 weeks", never "3 months". Dates as "1 October".
- **Casing:** Rush Driver headlines are written in capitals in the design, but typed in sentence case in the code and uppercased with CSS so screen readers read words, not letters.
- **Buttons:** verb first, 1–3 words: Start my plan · Try free tools · Show my number · Send my plan · Count my plate.

### Bilingual rules

1. **Three registers, each with its job.** English is the default site. Telugu script is the full `తె` version. Tenglish (Telugu in English letters) appears only as short supporting hooks in the English version, never for prices, legal text or instructions.
2. **Transcreate, don't translate.** A native Telugu copywriter adapts each line to sound natural. Machine translation is not allowed on the live site.
3. **Fitness words stay in English inside Telugu:** protein, sets, reps, kcal, cardio, plan. That is how the audience speaks.
4. **Neutral Telugu in the UI.** Keep region-only slang ("mawa" in Telangana, "bava" in coastal Andhra) for Reels, not the website.
5. **Telugu needs its own fonts.** Rush Driver has no Telugu letters (checked in the font file). Use **Anek Telugu** (ExtraBold, condensed width, skewed −8° to match the brand lean) for Telugu headlines and **Noto Sans Telugu** (400–600) for Telugu body text. Both are on Google Fonts.
6. **Give Telugu room.** Telugu text runs taller and 20–30% longer. Body line-height 1.7; test every headline at 360 px.
7. **One script per headline**, except English loanwords ("నీ Day One ఈరోజే").

### Microcopy library

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

### Claims and compliance

- Follow ASCI (Advertising Standards Council of India) rules for health claims and influencer disclosures: no guaranteed outcomes, and label any paid brand collaboration.
- Every before/after has written consent, is unedited, and shows weeks and starting point.
- Health line on every program and tool page: *This is general fitness guidance, not medical advice. Check with a doctor if you have a medical condition.*
- Supplements are never required to buy or finish a program.
