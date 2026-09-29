# Audience research

> Source: `docs/strategy/handoff.md` section 2 (personas, jobs, objections, market data), copied verbatim on 2026-09-29.

## 2. Audience research

The core buyer is a Telugu-speaking young man, 18–28, in Andhra Pradesh or Telangana, who found Nawin on Instagram Reels and opens the site inside Instagram on an Android phone. He wants to look strong, is short on money and time, and has quit a plan before. Everything on the site should be designed for that person first, then widened for women and Telugu NRIs.

The personas below are **proto-personas** built from public data and the category. Validate them in week 1 with Nawin's Instagram Insights export (top cities, age, gender) and 10 short DM interviews.

### What the market data says

| Signal | Figure | Why it matters for the site | Source |
| --- | --- | --- | --- |
| Instagram users in India | 550M; 69.2% men; 18–24 = 37.6%, 25–34 = 38.6% | Design for young men first; three in four users are 18–34 | [NapoleonCat, Aug 2026](https://stats.napoleoncat.com/instagram-users-in-india/2025/07/) |
| Telugu speakers | 81.1M native speakers in India (2011 census); about 96M total, 4th most spoken | A big market that national creators serve in Hindi or English | [Wikipedia: Telugu people](https://en.wikipedia.org/wiki/Telugu_people) |
| Regional-language preference | 98% of Tamil, Telugu and Malayalam internet users access content in their language | Telugu is not a nice-to-have; it is how they consume | [IBEF / IAMAI-Kantar](https://www.ibef.org/news/india-s-internet-users-to-exceed-900-million-in-2025-driven-by-indic-languages) |
| UPI | 83.4% of all payment volume in FY25 | Checkout must be UPI-first (intent + QR), cards second | [Business Standard / RBI](https://www.business-standard.com/finance/news/upi-s-contribution-to-payments-ecosystem-volume-grows-to-83-4-in-fy25-125052900871_1.html) |
| Price anchors | Budget apps ₹1,000–3,000/month; mid online coaches ₹5,000–8,000/month; gym PT in smaller cities ₹8,000–12,000/month | A ₹1,499–3,999 program feels cheap next to a trainer | [YourTrainer.in, 2026](https://www.yourtrainer.in/blog/is-a-personal-trainer-worth-it-india-2026) |
| Protein gap | Average intake about 47 g/day; about 60% of protein comes from cereals | Rice-heavy Telugu diets are the #1 problem to solve; a protein tool is a strong hook | [ORF](https://www.orfonline.org/expert-speak/indias-protein-deficiency-and-the-need-to-address-the-problem) |
| Market growth | Indian fitness market ₹16,200 crore (2024) to ₹37,700 crore by 2030 | The category is growing fast; the window to own "Telugu fitness" is now | [Health & Fitness Association](https://www.healthandfitness.org/india-fitness-market-report-2025/) |
| Cinema sets the goal | Tollywood transformations (Rana, Vijay Deverakonda, Adivi Sesh) shape what fans want, with real body-image risk | Use the aspiration, but promise honest timelines, never "hero body in 30 days" | [Outlook India](https://www.outlookindia.com/art-entertainment/decoding-celebrity-body-transformations-how-tollywood-actors-shape-up-for-their-roles-news-50238) |
| Telugu diaspora | 1M+ Telugu speakers in the US; fastest-growing language there | A premium NRI tier priced in USD is a real opportunity | [Wikipedia: Telugu people](https://en.wikipedia.org/wiki/Telugu_people) |

### Proto-personas

| Persona | Who | Goal | Money and time | Biggest fear | Best entry point |
| --- | --- | --- | --- | --- | --- |
| **Hostel Hari** (primary) | 19, B.Tech student, Guntur / Vijayawada / Hyderabad hostel, 55 kg | Gain weight and muscle, look good in photos | Pocket money; college gym or none; hostel mess food | "Hostel food lo protein ledu. Supplements afford cheyyalenu." | Weight-gain calculator + hostel diet video |
| **IT Kiran** (primary) | 26, software engineer, Gachibowli; desk job, weekend biryani | Lose the belly, look fit again | Pays by UPI easily; 45 min a day, late shifts | "I quit every plan after 3 weeks." | Calorie calculator + 12-week fat-loss program |
| **Town Teja** | 22, Warangal / Nellore / Kadapa; no good gym nearby | Build a physique at home | Very price-sensitive; prefers Telugu; trusts WhatsApp more than websites | "Online lo money pay cheste mosam avuthundi." (being cheated) | Free bodyweight videos + Telugu toggle + WhatsApp |
| **Sneha** | 24, working woman, Hyderabad or Vizag | Fat loss and toning, feel confident | Pays for value; wants a safe, respectful space | "Gym lo comfortable ga undadu." | Women's transformations + home plan |
| **NRI Naveen** | 31, Telugu IT worker in the US | Lose weight on Indian food abroad | Pays in USD; time zones | "US coaches don't get my food." | Diet plans with Telugu food + premium coaching tier |

### Jobs to be done

1. When I see Nawin's transformation reel, I want to know *if someone like me can do it*, so I can decide whether to try.
2. When I decide to start, I want *a plan for my food, my place and my budget*, so I don't waste months guessing.
3. When I lose motivation in week 3, I want *someone checking on me*, so I don't quit again.
4. When I'm about to pay, I want *proof this isn't a scam*, so my money is safe.

### Objections and how the site answers each

| Objection (in their words) | Answer on the site | Where |
| --- | --- | --- |
| "Is this a scam?" | Real client results with consent, GST invoice, Razorpay checkout, 7-day refund `[CONFIRM]`, business address | Transformations, checkout, footer |
| "I can't afford it" | Price per day ("₹1,999 for 12 weeks = ₹24 a day") next to a PT's ₹8,000+/month | Programs, pricing |
| "Hostel food, no protein" | Diets built on eggs, dal, curd, chicken, soya, peanuts, pesarattu; a hostel version of every plan | Program detail, protein tool |
| "No gym near me" | Every program has a home / bodyweight version | Programs filter |
| "I always quit" | Weekly check-ins, WhatsApp group, streaks, 12-week honest timeline | Program detail, FAQ |
| "English lo ardham kaadu" | Telugu toggle on every page; videos in Telugu | Header, videos |
| "Does it work for beginners / skinny guys / women?" | Filter transformations by goal and starting point | Transformations |

### Digital behaviour that shapes the build

- **Instagram in-app browser is the main door.** Most visits start from a bio link, story link or Reel. Pages must load fast on 4G, work without login, and survive the in-app browser's payment redirects.
- **Android, mid-range phones.** Design at 360–412 px wide first. Keep the hero image under 150 KB.
- **They read Tenglish.** Young Telugu users chat in Telugu written in English letters. Use it for hooks and buttons' supporting lines; keep fitness terms (protein, reps, sets) in English.
- **WhatsApp is trust.** A WhatsApp button (with a real human replying) converts hesitant buyers better than a contact form.
- **UPI and low round-number prices.** ₹999 / ₹1,499 / ₹2,999 read better than ₹1,853. Show the UPI logo at checkout.

### Research to run before design sign-off

- [ ] Export Instagram Insights: age, gender, top 10 cities, active hours
- [ ] 10 DM interviews (5 followers who bought something fitness-related, 5 who never did)
- [ ] Story poll: "Your #1 goal?" (gain weight / lose fat / six-pack / home workouts)
- [ ] Story poll: "How much would you pay for a 12-week plan?" (₹999 / ₹1,999 / ₹2,999 / ₹4,999)
- [ ] Pull the 20 most-asked DM questions; they become the FAQ
