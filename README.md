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

## Checks (the same ones CI runs on every push to main)

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
| `pnpm visual`       | Screenshot of every Storybook story compared with its approved reference        |

First run of `test:stories` or `e2e`: `pnpm --filter @ngb/e2e exec playwright install chromium`.

### Visual snapshots

References live in `e2e/visual/__screenshots__/<platform>/` (fonts render differently on macOS and Linux, so each has its own).
When a component's look changes on purpose, review the diff, then approve it:

```bash
pnpm --filter @ngb/ui build-storybook && pnpm --filter @ngb/e2e visual:update
```

CI compares against the `linux` references. On its first run it creates them and uploads them as the `visual-references-linux` artifact: download it, check the images, and commit them to `e2e/visual/__screenshots__/linux/`. Never update references just to make CI pass.

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

Sources live in `apps/web/fonts/` (git-ignored). `pnpm --filter @ngb/web fonts` subsets them into small woff2 files in `apps/web/fonts/web/` (committed), reports any character the copy needs that a font lacks, and regenerates Storybook's `@font-face` file.
The GT America and Rush Driver files are trial versions without punctuation or ₹; replace the sources with licensed files and rerun the command.
