---
paths:
  - "packages/ui/**"
  - "packages/tokens/**"
  - "apps/web/sections/**"
---

# UI, tokens and sections

## Tokens
- Three tiers in `packages/tokens/src/tokens.json`: primitive (`red-600`), semantic (`color.action.primary`), component (`button.primary.bg`).
- Components use semantic or component tokens only, never primitives.
- After editing tokens run `pnpm tokens:build` and update the Storybook Foundations page.
- Core values (for reference, never hard-code them):
  - Colours: ground #0B0909, carbon #131010, surface #1C1717, line #2E2626, line-strong #7A6C64,
    bone #EDE3D6, bone-muted #A89C92, studio-red #C8080D, deep-red #8E0308, oxblood #42060A,
    signal-red #FF3B2F, ember-gold #FFB423, good #7FD3A8
  - Ember gradient (radial, core at 36% / 24%): #FFE58A 0%, #FFA23A 15%, #FF5A1F 32%, #E3261B 52%, #A3110F 74%, #2A0605 100%
  - Space: 4 8 12 16 24 32 48 64 96 128. Section padding 128/144 desktop, 64/80 mobile.
  - Motion: 150 / 250 / 600 / 900 ms, ease-out cubic-bezier(0.16, 1, 0.3, 1)
  - Breakpoints: 360 768 1024 1280 1440; columns 4 / 8 / 12; content max 1248 px

## Component anatomy
- Folder per component: `Button/Button.tsx`, `Button.stories.tsx`, `Button.test.tsx`, `index.ts`.
- Props: `variant`, `size`, `state` only when visual; behaviour via standard HTML props. Forward refs. Accept `className` only for layout (margin, grid placement), never colour or type.
- Build behaviour on Radix primitives (Accordion, Dialog, Tabs, Select, RadioGroup, Switch, Checkbox). Do not re-implement focus management.
- Every interactive component: hover, pressed, focus-visible, disabled, loading states; errors where relevant.
- Shared brand utilities live in `packages/ui/src/brand/`: `ChamferBox`, `LeanFrame`, `EmberSurface`, `StudioBackdrop`, `HeartbeatLine`, `SectionTitle`. Use them instead of repeating clip-paths or gradients.

## Visual rules
- Match the target image in `docs/design/boards/` or `docs/design/screens/`. Screenshot at 1440 and 360 px and list differences before saying done.
- One glowing element per screen (the `sells` shadow). One marquee per page.
- Photos: `next/image`, explicit width/height or `fill` with `sizes`, AVIF/WebP, `alt` that describes the person and result.
- Section rhythm: never two consecutive sections with the same layout family.
- Eyebrow labels: at most one per three sections.

## Accessibility per component
- Buttons are `<button>` or `<a>`, never clickable `<div>`s. Icon-only buttons have `aria-label`.
- Accordion, tabs and dialogs follow the Radix keyboard model; test Tab, Shift+Tab, Enter, Space, Escape, arrows.
- Before/after slider: keyboard arrows move it; `aria-valuenow` announced.
- Every story runs the axe addon; zero violations.

## Stories and tests
- One story per variant and per state, plus an English and a Telugu story for any component with text.
- Tests: render, keyboard behaviour, disabled and loading behaviour, and anything conditional.
- Visual snapshots are approved by a human; never update a snapshot just to make CI pass.
