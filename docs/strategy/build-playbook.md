# NGB Evolve — Build Playbook with Claude Code

Sep 29, 2026 · @Raja

## Summary

You can take NGB Evolve from the resources you have to a launch-ready site in about 9 weeks with Claude Code, aiming for batch 1 on 1 December 2026. The work runs in 9 phases, and each phase ends with a check that proves it works before the next one starts.

**Claude Code is not trained on your data.** It reads your project files at the start of every session. "Teaching" it means putting the right files in the repo: a short `CLAUDE.md`, a `docs/` folder with the strategy doc, copy and design-system images, rules per folder, and a few project skills. That setup is Phase 1 and it decides the quality of everything after it.

**The build order that works:**

1. Set up the repo and tools.
2. Load the project context (docs, CLAUDE.md, skills, reference images).
3. Turn the design system into code: tokens first, then fonts.
4. Build every component in isolation, in Storybook, with all states.
5. Assemble homepage sections from those components only.
6. Assemble the inner pages from the same sections and components.
7. Add the backend: login, payments, CMS, WhatsApp, tools logic.
8. Harden for millions: caching, security, load tests, monitoring.
9. Soft launch to a small audience, then launch with a Reel.

**Three rules keep it consistent at scale.** Pages may only use design-system components, never one-off styles. Every change passes the same automated checks (types, tests, accessibility, performance, visual diff). And the site is static-first, so a Reel that sends a million people in an hour hits a CDN, not a server.

## 1. How Claude Code learns your project

Every Claude Code session starts with a fresh context window, so you teach it with files in the repo, not with training ([memory docs](https://code.claude.com/docs/en/memory)). Five mechanisms do the job, each for a different kind of knowledge.

| Mechanism | Where it lives | What goes in it for NGB | When it loads |
| --- | --- | --- | --- |
| `CLAUDE.md` | repo root | What the project is, commands, stack, folder map, the 10 non-negotiable rules | Every session. Keep it under 200 lines |
| Path rules | `.claude/rules/*.md` with `paths:` | UI rules for `packages/ui/**`, page rules for `apps/web/app/**`, API rules for `apps/web/server/**` | Only when Claude opens matching files |
| Skills | `.claude/skills/<name>/SKILL.md` | Design-system usage, copy voice, the "build a section" procedure, Taste and UI/UX Pro Max | Only when relevant, or when you type `/name` |
| Subagents | `.claude/agents/<name>.md` | Design reviewer, accessibility reviewer, security reviewer | When you ask for a review; they run in their own context |
| Hooks | `.claude/settings.json` | Lint and format after every edit; typecheck before a turn ends; block edits to `.env` | Always, automatically. Hooks are enforced, CLAUDE.md is advice |

### Step 1: put your resources in `docs/`

```text
docs/
  strategy/handoff.md          # export of the agency handoff doc
  copy/home.md                 # homepage copy tables (section 8)
  copy/pages.md                # inner-page copy (section 9)
  copy/voice.md                # voice, microcopy, Telugu rules (section 10)
  design/boards/board-01..10.png   # ChatGPT design-system boards
  design/screens/A1..C3.png        # ChatGPT desktop screens
  design/tokens.json           # colours, type scale, spacing, shadows
  research/audience.md         # personas, objections, market data
```

Don't `@import` these into `CLAUDE.md`: imports load in full every session and flood the context. List the paths instead and let Claude open what each task needs.

### Step 2: write a short `CLAUDE.md`

```markdown
# NGB Evolve
Fitness coaching site for Nawin Golden Boy. Audience: Telugu youth in AP/Telangana,
Android, Instagram in-app browser, UPI. Goal: sell 12-week programs.

## Commands
- pnpm dev | pnpm build | pnpm test | pnpm e2e | pnpm storybook | pnpm lint

## Map
- packages/tokens: design tokens (source of truth)  - packages/ui: components
- apps/web: Next.js site  - docs/: strategy, copy, design images

## Rules (non-negotiable)
1. Pages use only components from packages/ui. No one-off styles.
2. Colours, sizes, spacing only from tokens. Never hard-code a hex value.
3. Copy comes from docs/copy/*.md or the CMS, never invented.
4. Buying CTA is always "Start my plan"; free CTA is "Try free tools".
5. No invented numbers, testimonials or client photos.
6. WCAG 2.2 AA: labels above fields, 44 px targets, visible focus.
7. Every page works on a 360 px Android in the Instagram browser.
8. Server data is fetched on the server; client JS only where interaction needs it.
9. Every change ships with a test or a Storybook story.
10. Before finishing: pnpm lint && pnpm typecheck && pnpm test.
```

### Step 3: add skills and reviewers

- **Install** Taste (`npx skills add Leonxlnx/taste-skill`) and UI/UX Pro Max into `.claude/skills/`.
- **Write 3 project skills:** `ngb-design-system` (component inventory, token names, do and don't), `ngb-copy` (voice rules, word list, Telugu rules), and `build-section` (the procedure in section 6, run as `/build-section A1`).
- **Write 3 subagents:** `design-reviewer` (compares a screenshot with the reference image in `docs/design/screens/`), `a11y-reviewer`, `security-reviewer`.
- **Give it eyes:** connect a browser tool (Playwright MCP or Claude in Chrome) so Claude can screenshot what it built and compare it with the ChatGPT screen ([best practices](https://code.claude.com/docs/en/best-practices)).

Run `/context` in a new session to confirm `CLAUDE.md` and the rules loaded. When Claude repeats a mistake twice, add one line to `CLAUDE.md` or a rule; when a rule must never be broken, turn it into a hook or a lint rule.

## 2. Tech stack

Use a static-first Next.js site on a global CDN, with its server code and database in Mumbai. Almost every visitor from a Reel gets a cached page in milliseconds; only login, checkout and the member area touch servers. Every choice below is mainstream, well documented, and something Claude Code writes fluently.

| Layer | Choice | Why it fits millions of Indian users | Alternative |
| --- | --- | --- | --- |
| Framework | [Next.js 16.3](https://nextjs.org/blog) (App Router, React Server Components), TypeScript strict | Pages render to static HTML at build and refresh on a timer or on CMS publish. Keep on the Active LTS line and apply the 30 September 2026 security release (16.3.7) | Astro for a marketing-only site |
| Monorepo | pnpm + Turborepo | Design system, site and config live in one repo, one set of checks | Nx |
| Styling | Tailwind CSS v4, tokens as CSS variables | Tokens become utilities automatically; tiny CSS output | CSS Modules |
| Components | Your own `packages/ui`, built on Radix UI primitives | Radix gives accessible accordions, dialogs, tabs and selects; you add the NGB look | React Aria |
| Motion | Motion for React + GSAP ScrollTrigger (2 pinned sections only) | Smooth on mid-range phones; honours reduced motion | CSS scroll-driven animations |
| Hosting | Vercel: static pages on its CDN, functions pinned to Mumbai (`bom1`) | 126 CDN points of presence; functions run next to the database ([regions](https://vercel.com/docs/regions)) | AWS CloudFront + Lambda in `ap-south-1` if costs rise |
| CMS | [Payload CMS](https://payloadcms.com/docs/getting-started/what-is-payload) inside the Next.js app | Team NGB edits copy, programs, results and Telugu versions; built-in localisation; your data in your Postgres | Sanity (hosted) |
| Database | Postgres in Mumbai (Neon or Supabase), Drizzle ORM | Users, orders, enrolments, check-ins, leads; pooled connections | Amazon RDS |
| Cache and limits | Redis near Mumbai (e.g. Upstash) | Rate-limits OTP and tools, caches hot reads, holds idempotency keys | Vercel KV |
| Login | Phone number + OTP (Indian SMS provider such as MSG91), WhatsApp OTP as fallback | No passwords; works for the whole audience | Email magic link for NRIs |
| Payments | Razorpay: UPI intent, QR, cards, netbanking, subscriptions for the Club; signed webhooks | UPI-first; one-time and recurring in one provider | Cashfree; Stripe for USD |
| Background jobs | A durable queue (Inngest, Trigger.dev or QStash) | WhatsApp sequences, receipts and retries never block a request | AWS SQS |
| WhatsApp | WhatsApp Business API through an approved provider (Interakt, AiSensy or Gupshup) | Starter plans, reminders, batch groups, with opt-in | Gupshup direct |
| Video | Mux or Bunny Stream (HLS, signed URLs) | Adaptive quality on 4G; paid videos can't be shared | Cloudflare Stream |
| Analytics | GA4 + Meta Pixel with server-side Conversions API; PostHog for funnels and A/B tests | Tracking survives the Instagram in-app browser | Plausible |
| Monitoring | Sentry, Vercel Speed Insights (real-user Core Web Vitals), uptime checks | You see errors and slow pages before users complain | Datadog |
| Testing | Vitest, Testing Library, Playwright, axe-core, Lighthouse CI, Storybook + Chromatic | Automated gates Claude Code runs itself (section 8) | Cypress |

Fonts: GT America (Grilli Type) and Rush Driver need **web licences** before launch; self-host them with `next/font/local`, subset to the characters used. Anek Telugu and Noto Sans Telugu load only on Telugu pages.

## 3. System architecture

A visitor from a Reel is served entirely by the CDN until they act. Logins, leads and payments go to the Next.js app in Mumbai, which talks to Postgres, Redis and a job queue; payment confirmations arrive by webhook, and messages leave through the queue so a slow provider never slows a page.

&#91;embedded content: system architecture · CDN, Mumbai app, data, services\]

How a purchase flows: the browser asks the API for a Razorpay order, the member pays in their UPI app, Razorpay calls the webhook, the webhook grants access in one database transaction and queues the WhatsApp receipt. The browser never decides whether a payment succeeded.

## 4. Repository structure

One monorepo with the design system as its own package. The site can only import components from `packages/ui`, and `packages/ui` can only use values from `packages/tokens`. That dependency direction is what keeps hundreds of screens consistent.

```text
ngb-evolve/
  CLAUDE.md                     # short project brief + rules (section 1)
  .claude/
    rules/ui.md                 # paths: packages/ui/**
    rules/pages.md              # paths: apps/web/app/**
    rules/server.md             # paths: apps/web/server/**
    skills/ngb-design-system/   # component inventory, token names, do and don't
    skills/ngb-copy/            # voice, word list, Telugu rules
    skills/build-section/       # /build-section A1 procedure
    agents/design-reviewer.md   # compares screenshots with docs/design/screens
    agents/a11y-reviewer.md
    agents/security-reviewer.md
    settings.json               # hooks: lint on edit, typecheck on stop
  docs/                         # strategy, copy, design images, tokens.json
  packages/
    tokens/                     # tokens.json -> CSS variables + Tailwind theme
    ui/                         # Button, Card, ProgramCard, ToolCard, SectionTitle...
      src/<Component>/          # Component.tsx, .stories.tsx, .test.tsx
    config/                     # shared eslint, tsconfig, tailwind preset
  apps/
    web/                        # Next.js site
      app/(marketing)/          # home, programs, tools, about... (static)
      app/(member)/             # account, today's workout (dynamic, logged in)
      app/(checkout)/           # checkout, welcome
      app/api/                  # webhooks (Razorpay, WhatsApp), OTP
      sections/                 # Hero, ProofStrip, Journey, ToolsBento... built from ui
      server/                   # db, payments, auth, jobs (server-only code)
      cms/                      # Payload collections: Programs, Tools, Results, Pages
      content/                  # fallback copy in en.json and te.json
  e2e/                          # Playwright journeys
```

- **`sections/`** sits between components and pages: a page is a list of sections, a section is a composition of `ui` components. Pages hold no styling.
- **Route groups** split the site by how it renders: `(marketing)` is static and cached, `(member)` and `(checkout)` are dynamic and never cached.
- **A lint rule** blocks raw hex colours and arbitrary pixel values in `apps/web`, so no one (human or Claude) can bypass the tokens.

## 5. Design system in code

The design system becomes three layers of code: **tokens** (every value), **components** (every piece of UI, built only from tokens) and **sections** (page blocks built only from components). The ChatGPT boards are the visual target; the token file is the source of truth.

### Tokens, in three tiers

| Tier | Example | Who uses it |
| --- | --- | --- |
| Primitive | `red-600 = #C8080D`, `bone = #EDE3D6`, `space-16 = 16px` | Only the semantic tier |
| Semantic | `color.action.primary`, `color.surface.card`, `color.text.muted`, `font.heading`, `shadow.sells` | Components |
| Component | `button.primary.bg`, `card.radius`, `programCard.featured.glow` | That one component |

One `tokens.json` compiles (with Style Dictionary or a small script) to CSS variables plus a Tailwind v4 `@theme`. Change studio red once and every screen follows.

| Family | What goes in |
| --- | --- |
| Colour | The 13 palette colours, the ember gradient stops, on-colour pairs with their checked contrast |
| Type | Rush Driver (display), GT America Compressed Black Italic (headings), Extended (labels), Standard (body), Mono (numbers), Anek Telugu + Noto Sans Telugu; the 11-step scale with desktop and mobile sizes |
| Space | 4, 8, 12, 16, 24, 32, 48, 64, 96, 128; section padding 128/144 desktop, 64/80 mobile |
| Shape | Card radius 4 px, button chamfer 14 px, tag chamfer 8 px, photo lean 8 degrees |
| Depth | Rest, hover and "sells" (red edge + glow) shadows |
| Motion | 150 / 250 / 600 / 900 ms; ease-out `cubic-bezier(0.16, 1, 0.3, 1)`; reduced-motion variants |
| Layout | Breakpoints 360 / 768 / 1024 / 1280 / 1440; 12 / 8 / 4 columns; 1248 px max content |

Fonts load through `next/font/local` with matching fallback metrics, so text doesn't jump when the web font arrives.

### Components, in build order

| Layer | Components | Visual target |
| --- | --- | --- |
| 1. Primitives | Text, Heading (display / heading / label variants), Icon (Phosphor), Button (primary, secondary, on-red; 6 states), Link, Tag, Chip, Input, Select, SegmentedControl, Toggle, Checkbox, Radio, OtpInput, Accordion, Dialog, Sheet, Tabs, Skeleton, Toast | Boards 4, 5, 7 |
| 2. Brand patterns | SectionTitle (slash + speed lines), ChamferBox, LeanFrame (8 degrees), EmberSurface, StudioBackdrop, HeartbeatLine, Marquee | Boards 3, 5, 8 |
| 3. Composites | NavBar, MobileMenu, LanguageSwitch, StatStrip, ProgramCard (standard, featured), TransformationCard (before/after slider), ToolCard, ResultCard, VideoCard (free, locked), QuoteCard, FaqList, ShareCard, StickyBuyBar, ProgressSteps, Footer | Boards 7, 8, 10 |
| 4. Sections | Hero, ProofStrip, Journey, Manifesto, GoalPicker, ToolsBento, WorkoutsSplit, Transformations, ProgramsGrid, ComparisonTable, PromiseFaq, Community, FinalCall | Screens A1 to C3 |

### A component is done when

- [ ] Every variant and state is a Storybook story (default, hover, pressed, focus, disabled, loading, error, empty).
- [ ] It works by keyboard and screen reader, and axe reports no violations.
- [ ] It looks right at 360 px and 1440 px, in English and in Telugu.
- [ ] A visual snapshot is recorded, so later changes that alter it are caught.
- [ ] Its docs page shows when to use it and when not to.
- [ ] It uses only tokens: no raw colours, sizes or shadows.

## 6. Step-by-step Claude Code workflow

Work in small, checked steps: one component, section or feature per session, planned first, verified by a test or a screenshot, then committed. The prompts below are ready to paste; adjust names as your repo grows.

### Habits for every session

- **Plan first for anything touching several files.** Press `Shift+Tab` into plan mode, ask for a plan, edit it (`Ctrl+G`), then approve.
- **Give it a target and a check.** Attach the reference image and say "screenshot the result at 1440 and 360 px, compare with the image, list differences and fix them".
- **One task per session.** `/clear` between unrelated tasks; after two failed corrections, `/clear` and write a sharper prompt.
- **Review with fresh eyes.** Ask "use the design-reviewer subagent on this diff" or run `/code-review` before you commit.
- **Commit after every green step**, one branch and pull request per feature, so you can always roll back.

### Phase 1: set up the repo and tools (days 1–2)

You do this part: create the GitHub repo, a Vercel project (functions region `bom1`), Neon or Supabase Postgres in Mumbai, Redis, Razorpay in test mode, Sentry, Mux or Bunny, and buy the GT America and Rush Driver web licences.

```text
Create a pnpm + Turborepo monorepo named ngb-evolve with apps/web (Next.js 16.3, App Router,
TypeScript strict, Tailwind v4), packages/tokens, packages/ui (React + Storybook) and
packages/config (eslint, prettier, tsconfig). Add Vitest, Playwright and axe-core.
Add scripts: dev, build, lint, typecheck, test, e2e, storybook. Add a GitHub Actions
workflow that runs lint, typecheck, test and build on every pull request. Run everything
and show me the passing output.
```

**Done when** a pull request with an empty page passes CI and deploys a preview on Vercel.

### Phase 2: load the project context (day 3)

Copy your resources into `docs/` (section 1), then:

```text
Read docs/strategy/handoff.md, docs/copy/voice.md and look at docs/design/boards/*.png.
Write CLAUDE.md under 150 lines with: what NGB Evolve is, commands, the folder map and
these 10 rules [paste the rules from section 1]. Then create .claude/rules/ui.md,
pages.md and server.md scoped with paths. Then create the skills ngb-design-system,
ngb-copy and build-section, and the subagents design-reviewer, a11y-reviewer and
security-reviewer. Keep each file short and specific. Show me every file before saving.
```

**Done when** `/context` in a fresh session lists `CLAUDE.md` and the rules, and `/build-section` appears as a command.

### Phase 3: turn the design system into code (days 4–5)

```text
[plan mode] Using docs/design/tokens.json and boards 2, 3, 4 and 5, build packages/tokens:
primitive, semantic and component tiers; output CSS variables and a Tailwind v4 @theme.
Load Rush Driver, GT America (Compressed, Standard, Extended, Mono), Anek Telugu and
Noto Sans Telugu with next/font/local and fallback metrics. Add a Storybook "Foundations"
page showing every colour with its contrast ratio, the type scale, spacing, shadows and
the ember gradient. Screenshot that page and compare it with the boards.
```

**Done when** the Foundations page matches boards 2 to 5, and every text/background pair on it passes WCAG AA.

### Phase 4: build every component (days 6–14)

One layer at a time from the table in section 5, a few components per session:

```text
[plan mode] Build Button in packages/ui following board 7: variants primary, secondary,
on-red; states default, hover, pressed, focus, disabled, loading; 52 px tall, 14 px
chamfer, label in GT America Extended. Use only tokens. Write stories for every state,
a Vitest test for keyboard and disabled behaviour, and an axe test. Screenshot the
stories and compare with docs/design/boards/board-07.png. Then run the a11y-reviewer.
```

**Done when** each component meets the checklist in section 5 and its visual snapshot is approved.

### Phase 5: build the homepage sections (days 15–22)

The `build-section` skill holds this procedure, so each section is one command: `/build-section A1`.

```text
Build section A1 (nav, hero, proof strip). Steps:
1. Open docs/design/screens/A1.png and the A1 copy in docs/copy/home.md.
2. List the packages/ui components you will use; if one is missing, stop and tell me.
3. Build apps/web/sections/Hero.tsx and ProofStrip.tsx from those components only.
4. Copy comes from the content file, English and Telugu.
5. Screenshot at 1440 and 360 px, compare with A1.png, fix every difference.
6. Run the design-reviewer and a11y-reviewer subagents; fix what they find.
7. Run lint, typecheck and tests, then commit.
```

**Done when** all 13 homepage sections exist and the full homepage screenshot matches screens A1 to A7.

### Phase 6: assemble the pages (days 23–28)

```text
Create the routes from the sitemap in docs/strategy/handoff.md section 6: /, /start,
/quiz, /programs, /programs/[slug], /tools, /tools/[slug], /workouts, /transformations,
/about, /club, /coaching, /faq, and English/Telugu versions under /te. Pages only compose
sections. Add metadata, Open Graph images, JSON-LD (Person, Organization, Product, FAQPage)
and hreflang. Make marketing routes static. Run Lighthouse on each page and report.
```

**Done when** every page renders statically, scores 90+ on Lighthouse mobile, and has no axe violations.

### Phase 7: add the backend (days 29–42)

One feature per session, in this order, each with tests:

1. **CMS:** Payload collections for Programs, Tools copy, Results (with a consent file field), FAQ and Pages, localised EN/TE; publishing refreshes the cached page.
2. **Tools logic:** calorie, BMI (Asian cut-offs), protein, one-rep max, Telugu Plate as pure functions with unit tests for known inputs.
3. **Login:** phone + OTP, rate-limited per number and per IP, sessions in secure cookies.
4. **Payments:** Razorpay order, checkout, and a signed webhook that grants access idempotently (the same event twice never double-grants).
5. **Member area:** today's workout, progress, weekly check-in upload.
6. **WhatsApp and jobs:** lead capture with consent, the 7-day sequence, receipts, all through the queue.
7. **Analytics:** the event list from the handoff doc, server-side Conversions API.

```text
[plan mode] Implement Razorpay checkout for programs. Create the order on the server,
never trust the amount from the browser. Verify the webhook signature, store events with
a unique key so retries are safe, grant the enrolment in a transaction, then queue the
WhatsApp receipt. Write tests for: success, failed payment, duplicate webhook, tampered
signature. Then run the security-reviewer subagent.
```

**Done when** a test purchase in Razorpay test mode goes from checkout to the welcome page to a WhatsApp receipt, and all failure tests pass.

### Phase 8: harden for millions (days 43–52)

Work through section 7. Ask Claude to write the k6 load test, the caching headers, the security headers and the monitoring alerts, and to run each and show the results.

**Done when** the load test passes the targets in section 7, the security review is clean, and Telugu copy has native sign-off.

### Phase 9: soft launch, then launch (days 53–63)

Ship to production behind a feature flag, send only the Instagram bio link to it for a week, watch errors, speed and the funnel, fix, then launch batch 1 with a Reel.

## 7. Built for millions

NGB's traffic will not be steady: it arrives in bursts minutes after each Reel. Design for the peak of a viral Reel, not the daily average. The rule that makes this cheap and safe is simple: anything a visitor only reads is served from the CDN; only actions that change data reach a server.

| Concern | What goes wrong without it | What we build |
| --- | --- | --- |
| Reel traffic spikes | Servers and database fall over in the first 10 minutes | Marketing pages are static and cached at the CDN; CMS publish refreshes them; tools calculate in the browser, so only "send my plan" hits a server |
| Slow phones on 4G | Visitors leave before the hero loads | Budgets: LCP under 2.5 s, JS under 200 KB, hero image under 150 KB, subsetted fonts, adaptive video |
| Instagram in-app browser | Logins drop, UPI apps don't return to the page | UPI intent and QR flows tested inside Instagram on Android and iPhone; no pop-ups; state kept in the URL |
| Database overload | Checkout slows for everyone | Pooled connections, indexes on every lookup, reads cached in Redis, slow work pushed to the queue, a read replica when needed |
| OTP abuse | SMS bills explode from bots (SMS-pumping fraud) | Limits per number, IP and device; a bot challenge after 3 tries; a daily SMS spend cap; WhatsApp OTP fallback |
| Payment edge cases | Paid users without access, or access without payment | Server-created orders, signed webhooks, idempotency keys, and an hourly job that reconciles Razorpay payments with enrolments |
| Bots and attacks | Scraping, credential stuffing, DDoS | Vercel firewall and bot protection, API rate limits, input validation with Zod on every endpoint |
| Security | Data leaks, hijacked accounts | OWASP Top 10 review, strict security headers and CSP, secure http-only cookies, secrets only in environment variables, least-privilege database roles, 2-factor login for CMS admins, weekly dependency updates |
| Personal data | Legal risk under India's DPDP Act, 2023 | Consent records for WhatsApp and photos, a privacy notice, delete-my-data and export flows, retention limits, progress photos in a private bucket with signed links |
| Paid content leaks | Videos shared freely | Signed, expiring video URLs; watermark with the member's phone number |
| Outages | Silent failures during a launch | Sentry alerts to a phone, uptime checks every minute, instant rollback, daily database backups with point-in-time restore |
| Cost | Surprise bills after a viral day | High CDN cache hit rate, spend alerts, image and video budgets |

### Load-test targets (starting points)

Agree these with Nawin after checking his past bio-link click spikes; Claude Code writes and runs the k6 scripts.

| Scenario | Starting target |
| --- | --- |
| Cached pages (home, programs, tools) | 5,000 requests per second with CDN hits, no errors |
| Lead capture ("send my plan") | 300 per second, 95% under 500 ms |
| OTP requests | 50 per second with limits holding |
| Checkout order creation | 100 per second, 95% under 800 ms |
| Payment webhooks | 200 per second, zero duplicate enrolments |

### Launch-day runbook

- [ ] No deploys in the 24 hours before the launch Reel.
- [ ] Warm the cache by visiting every public page after the final deploy.
- [ ] Raise database and Redis plan limits for the day; confirm spend alerts.
- [ ] Open the dashboards: errors, Core Web Vitals, checkout funnel, payment success rate.
- [ ] Team NGB on WhatsApp support for the first 6 hours.
- [ ] Rollback owner named; the previous deployment tested as a rollback target.

## 8. Quality gates

No change reaches production unless it passes the same automated checks, whether a person or Claude Code wrote it. GitHub branch protection enforces them; Claude runs the fast ones itself before it says a task is done.

| Gate | Tool | The pull request fails when |
| --- | --- | --- |
| Types and lint | TypeScript strict, ESLint | Any type error, or a raw hex colour or pixel value outside `packages/tokens` |
| Unit tests | Vitest | Any test fails, or tools, payments and auth logic drop below 90% line coverage |
| Component checks | Storybook + axe | Any accessibility violation in a story |
| Visual regression | Chromatic (or Playwright screenshots) | A component or section changes appearance without a reviewer approving it |
| End-to-end journeys | Playwright on 360 px Android and 1440 px desktop | Reel to tool to lead, quiz to checkout to welcome, OTP login, or the Telugu switch breaks |
| Performance | Lighthouse CI on the preview deploy | Mobile score under 90, LCP over 2.5 s, or JS over the budget |
| Security | Dependency audit, secret scanning, security-reviewer subagent on auth, payment and data changes | A high-severity issue or a committed secret |
| Human review | Vercel preview link | Nawin's team hasn't approved visible changes to copy, prices or photos |

**Hooks that make Claude do this automatically** (in `.claude/settings.json`):

- After every file edit: format and lint that file.
- Before a turn ends: run typecheck and the tests for changed packages; if they fail, Claude keeps working.
- Before any edit: block writes to `.env*`, lockfiles and applied database migrations.

## 9. Timeline, roles, open decisions and sources

The plan fits between 30 September and a 1 December launch if each phase passes its check on time. Backend work is the longest phase and the one to protect.

&#91;embedded content: build timeline · 9 phases to 1 December\]

Days are calendar days. Photos, program details and prices from Team NGB must arrive by the end of phase 4, or sections and pages will be built on placeholders.

### Who does what

| Role | Owns |
| --- | --- |
| You (product owner) | Priorities, running the Claude Code sessions, approving every preview link |
| One senior full-stack developer | Reviewing Claude's code for payments, auth, data and security; infrastructure and launch-day on-call. Strongly advised for a site that takes payments at this scale |
| Designer (part-time) | Approving visual snapshots, Telugu typesetting, photo selection |
| Telugu copywriter | Transcreating every page and message |
| Nawin and Team NGB | Real photos and videos, program content, prices, consented results, WhatsApp support |
| QA (part-time) | The device matrix: Instagram browser on Android and iPhone, low-end phones, slow networks |

### Open decisions

- [ ] Hosting plan: Vercel Pro or Enterprise (Enterprise adds automatic function failover), or AWS if load tests show high cost. Decide by Nov 10, 2026.
- [ ] CMS: Payload inside the repo (recommended) or hosted Sanity. Decide by Oct 2, 2026.
- [ ] Member area: build it in phase 7, or start on a creator course platform for v1. Decide by Oct 2, 2026.
- [ ] Pricing: one-time programs or monthly (still open in the handoff doc). Decide by Oct 13, 2026.
- [ ] Font licences: GT America web licence tier and Rush Driver commercial licence bought. Decide by Oct 2, 2026.
- [ ] Named reviewer for payment and security code. Decide by Oct 2, 2026.

### Sources

- [How Claude remembers your project (CLAUDE.md, rules, auto memory)](https://code.claude.com/docs/en/memory)
- [Extend Claude with skills](https://code.claude.com/docs/en/skills)
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)
- [Next.js blog (16.3, September 2026 security releases)](https://nextjs.org/blog)
- [Vercel global network and regions (Mumbai, bom1)](https://vercel.com/docs/regions)
- [What is Payload CMS](https://payloadcms.com/docs/getting-started/what-is-payload)
