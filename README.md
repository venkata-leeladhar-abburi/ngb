# NGB Evolve

Coaching website for Nawin Golden Boy. Static-first Next.js on Vercel's CDN, server code in Mumbai (`bom1`).
Project brief and rules: [`CLAUDE.md`](CLAUDE.md). Build plan: [`docs/strategy/build-playbook.md`](docs/strategy/build-playbook.md).

## Requirements

- Node 24 (`.nvmrc`)
- pnpm (any recent version; it switches to the version pinned in `package.json` automatically)

## Start

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
pnpm dev            # http://localhost:3000
pnpm storybook      # http://localhost:6006
```

## Checks (the same ones CI runs on every pull request)

| Command             | What it checks                                                                  |
| ------------------- | ------------------------------------------------------------------------------- |
| `pnpm format:check` | Prettier                                                                        |
| `pnpm lint`         | ESLint + Stylelint: types, React, accessibility, layering, no raw design values |
| `pnpm typecheck`    | TypeScript strict                                                               |
| `pnpm test`         | Vitest unit tests                                                               |
| `pnpm test:stories` | Every Storybook story in Chromium with axe                                      |
| `pnpm build`        | Production build                                                                |
| `pnpm e2e`          | Playwright on a 360 px Android phone and 1440 px desktop, with axe              |
| `pnpm lhci`         | Lighthouse mobile budgets (performance 90+, accessibility 100, LCP, CLS, JS)    |

First run of `test:stories` or `e2e`: `pnpm --filter @ngb/e2e exec playwright install chromium`.

## Layout

```text
apps/web/            Next.js site
  app/(marketing)/   static public pages (CDN)
  app/(checkout)/    dynamic, never cached or indexed
  app/(member)/      dynamic, logged in, never cached or indexed
  app/api/           OTP, leads, checkout, webhooks, health
  sections/          page blocks built only from @ngb/ui
  server/ db/ cms/   server-only code (Phase 7)
  content/           fallback copy (en, te)
  lib/tools/         free-tool maths (pure functions)
packages/ui/         components + Storybook
packages/tokens/     design tokens, the only place values live (Phase 3)
packages/config/     shared ESLint, Stylelint, Prettier, TypeScript config
e2e/                 Playwright journeys
docs/                strategy, copy, design boards and screens
```

Layering is one-way: tokens → ui → sections → pages. Lint enforces it.

## Fonts

GT America and Rush Driver in `apps/web/fonts/` are trial files and are git-ignored. Buy the web licences, replace the files, then remove the line from `.gitignore`.
