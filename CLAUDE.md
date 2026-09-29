# NGB Evolve

Coaching website for Nawin Golden Boy (NGB), a Telugu fitness creator with 1M+ Instagram followers.
Visitors: Telugu-speaking youth (17-30) in Andhra Pradesh and Telangana, on mid-range Android phones,
arriving from Instagram Reels inside the Instagram in-app browser, paying with UPI.
Business goal: sell 12-week programs. Free tools and videos exist to earn trust and lead to one program.

## Source of truth (read the file a task needs; do not guess)
- Strategy, audience, sitemap, flows: `docs/strategy/handoff.md`
- All copy: `docs/copy/home.md`, `docs/copy/pages.md`; voice + Telugu rules: `docs/copy/voice.md`
- Design system images: `docs/design/boards/board-01.png` ... `board-10.png`
- Screen targets: `docs/design/screens/A1.png` ... `C3.png` (desktop, 1440 px)
- Tokens: `packages/tokens/src/tokens.json` (the only place values are defined)
- Build plan and phases: `docs/strategy/build-playbook.md`
If a doc and the code disagree, stop and ask. Never invent copy, prices, numbers, names or photos.

## Stack
- Next.js 16.3 (App Router, React Server Components), TypeScript strict, React 19
- pnpm workspaces + Turborepo; Tailwind CSS v4 (tokens as CSS variables + `@theme`)
- UI: own `packages/ui` on Radix UI primitives; Motion for React; GSAP ScrollTrigger (2 pinned sections only)
- CMS: Payload (inside `apps/web`, Postgres, EN + TE localisation)
- Data: Postgres in Mumbai via Drizzle ORM; Redis for rate limits, cache, idempotency keys
- Auth: phone + OTP; Payments: Razorpay (UPI first); Jobs: durable queue; WhatsApp Business API
- Video: Mux/Bunny signed HLS; Monitoring: Sentry, Vercel Speed Insights; Analytics: GA4, Meta CAPI, PostHog
- Hosting: Vercel, functions pinned to `bom1` (Mumbai). Stay on the latest 16.3.x security patch.

## Commands
- `pnpm dev` - run the site (http://localhost:3000); `pnpm storybook` - components (http://localhost:6006)
- `pnpm lint` / `pnpm typecheck` / `pnpm test` - run before saying any task is done
- `pnpm test --filter <pkg> -- <pattern>` - run one test file; prefer this over the full suite while working
- `pnpm e2e` - Playwright journeys; `pnpm e2e --project=android` for 360 px
- `pnpm tokens:build` - regenerate CSS variables after editing `tokens.json`
- `pnpm db:generate` then `pnpm db:migrate` - schema changes (never edit an applied migration)
- `pnpm lhci` - Lighthouse CI against the local production build

## Repo map
- `packages/tokens` - tokens.json -> CSS variables + Tailwind theme
- `packages/ui` - components, one folder each: `Component.tsx`, `.stories.tsx`, `.test.tsx`, `index.ts`
- `packages/config` - shared eslint, tsconfig, tailwind preset
- `apps/web/app/(marketing)` - static public pages; `(checkout)` and `(member)` - dynamic, never cached
- `apps/web/app/api` - OTP, leads, checkout, webhooks
- `apps/web/sections` - page blocks (Hero, ProofStrip, ToolsBento...), built only from `packages/ui`
- `apps/web/server` - server-only code: db, auth, payments, jobs, whatsapp
- `apps/web/cms` - Payload collections; `apps/web/content` - fallback copy `en.json`, `te.json`
- `e2e/` - Playwright; `docs/` - everything a human wrote for this project

## Architecture rules
- Layering is one-way: tokens -> ui -> sections -> pages. Pages hold no styling, only sections.
- Marketing pages are static; they revalidate on CMS publish. Never make a public page dynamic for convenience.
- Free tools calculate in the browser as pure functions in `apps/web/lib/tools/`; only lead capture hits the server.
- Server data is fetched in Server Components or route handlers. Add `"use client"` only to leaf components that need interaction.
- Code in `apps/web/server/**` imports `server-only`. Secrets never reach the client bundle.
- Slow or third-party work (WhatsApp, receipts, emails) always goes through the job queue, never inside a request.

## Design system rules
- Use only components from `packages/ui`. If one is missing, stop and propose it; do not style inline in a page.
- Use only tokens. No raw hex, rgb, px sizes, shadows or z-index outside `packages/tokens` (lint enforces this).
- Typefaces by role, never swapped:
  - Rush Driver Italic: poster words, big numbers, prices only. Capitals. Max 5 words. No Telugu glyphs.
  - GT America Compressed Black Italic: section titles, uppercase, with the red slash.
  - GT America Extended: buttons, tags, labels, program names (uppercase, tracked).
  - GT America Standard: all reading text, 16 px minimum (17 px desktop), line height 1.65.
  - GT America Mono: numbers, results, prices per day.
  - Telugu: Anek Telugu (headings), Noto Sans Telugu (body, line height 1.75), loaded only on `/te`.
- Colour roles: studio red = brand + primary action; signal red = small red text and focus; ember gold = the one "Most popular" tag; good green = healthy results with an icon.
- Ember gradient only on: transformation cards, featured program, share cards, final-call glow. Text sits only on its dark lower zone.
- Only one glowing element per screen. Shapes: 14 px chamfer on buttons, 8 px on tags, 4 px card radius, 8 degree photo lean, circles only for play buttons.
- Icons: Phosphor, 1.5 px stroke, never inside circles.
- Visual target for any UI work: the matching board or screen PNG in `docs/design/`. Full rules: the `ngb-design-system` skill.
- Taste and UI/UX Pro Max skills are for craft checks only. Never let them pick colours, fonts or styles, and never generate a `design-system/` folder.

## Copy and language rules
- Copy comes from `docs/copy/*` or the CMS. If text is missing, leave a visible `TODO(copy)` and tell me.
- One buying label everywhere: "Start my plan". One free label: "Try free tools". No other variants.
- No invented statistics, testimonials, client names, photos or ratings. Placeholders must look like placeholders.
- Money: `₹1,999` with Indian grouping (`₹1,00,000`); always show the per-day price next to a program price.
- Units: kg, cm, kcal, g, L. Durations as "12 weeks", never "3 months".
- No em dashes in UI copy. Sentence case in code; uppercase only through CSS.
- Every string exists in English and Telugu. Telugu comes from the native copywriter; never machine-translate.
- Health line on program and tool pages; no guaranteed results (ASCI rules).

## Accessibility (WCAG 2.2 AA, no exceptions)
- Text contrast 4.5:1 (3:1 at 24 px+); UI borders and focus 3:1. Pairs are listed in board 2.
- Visible focus ring on every interactive element; full keyboard use; logical heading order.
- Labels above inputs, errors below with icon + words, `inputmode` on number and phone fields.
- Touch targets at least 44 x 44 px, 8 px apart. Status never by colour alone.
- Every animation has a `prefers-reduced-motion` version. Decorative giant words are `aria-hidden`.
- `lang="te"` on Telugu pages. Videos have Telugu and English captions.

## Performance budgets (mobile, 4G, mid-range Android)
- LCP < 2.5 s, INP < 200 ms, CLS < 0.1; JS on marketing pages < 200 KB compressed.
- Hero image < 150 KB (AVIF/WebP via `next/image`, correct `sizes`); fonts subset and preloaded.
- No new dependency without saying why and its size. Prefer the platform and existing packages.

## Security and payments (non-negotiable)
- Validate every input on the server with Zod. Never trust amounts, prices or program IDs from the browser.
- Razorpay: create orders on the server; verify webhook signatures; store event IDs so a retried webhook never grants twice; grant access inside one transaction.
- OTP: rate-limit per phone, IP and device; bot challenge after 3 attempts; daily SMS spend cap.
- Secure, http-only, same-site cookies. No secrets in code, logs or client bundles.
- Personal data (DPDP Act 2023): record consent for WhatsApp and photos; progress photos in a private bucket with signed URLs.
- Changes to auth, payments, data or webhooks must be reviewed by the `security-reviewer` subagent.

## Testing and definition of done
A task is done only when all of these hold, and you have shown me the evidence:
1. `pnpm lint`, `pnpm typecheck` and the relevant tests pass (paste the output summary).
2. New components: stories for every state, a test, no axe violations.
3. UI changes: screenshots at 1440 px and 360 px compared with the target PNG; differences listed and fixed.
4. Logic: unit tests with real example values (tools, payments, auth). Payment paths also test failure and duplicate webhooks.
5. English and Telugu both render without overflow or clipped glyphs.

## How to work in this repo
- Multi-file work: start in plan mode, show the plan, wait for approval.
- One feature per session. Small commits. Branch per feature: `feat/<area>-<thing>`, `fix/<area>-<thing>`.
- Conventional commits: `feat(ui): add ProgramCard featured variant`.
- Sections: use `/build-section <id>` (skill) with the screen PNG as the target.
- Before finishing UI work, run the `design-reviewer` and `a11y-reviewer` subagents on the diff.
- Ask before: adding a dependency, changing tokens, changing a database schema, touching `.env*`, or changing prices.

## Gotchas
- Most visitors are in Instagram's in-app browser: no pop-ups, keep state in the URL, test UPI return flows there.
- Rush Driver has no Telugu glyphs; Telugu headings must switch to Anek Telugu.
- Check that the GT America build includes the ₹ glyph; fall back per glyph if not.
- BMI uses Asian cut-offs (18.5 to 22.9 healthy). Protein target is about 1.6 g per kg.
- Rush Driver and GT America require paid web licences; font files live in `apps/web/fonts/` (private repo only).
