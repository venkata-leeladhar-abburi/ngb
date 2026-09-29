# @ngb/config

Shared tooling config. Every package extends these; change a rule here once and it applies everywhere.

| Export                  | Used by                 | Notes                                                                                          |
| ----------------------- | ----------------------- | ---------------------------------------------------------------------------------------------- |
| `eslint/base`           | all TS packages         | Type-aware typescript-eslint strict + stylistic                                                |
| `eslint/react`          | `packages/ui`           | + React, hooks, jsx-a11y strict, Storybook, token guard                                        |
| `eslint/next`           | `apps/web`              | + Next.js rules and the layering rules (pages use sections; UI code never imports server code) |
| `eslint/token-guard.js` | react, next             | Blocks raw hex, colour functions, px, Tailwind arbitrary values and literal style values       |
| `stylelint`             | root `.stylelintrc.mjs` | Same guard for CSS; `packages/tokens` is exempt                                                |
| `prettier`              | root `.prettierrc.mjs`  | Includes the Tailwind class sorter                                                             |
| `tsconfig/*`            | all packages            | Strict: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`       |
