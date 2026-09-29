---
name: build-section
description: Build one website screen slice (A1 to C3) from its target PNG and the copy docs, compare screenshots, run the reviewers and commit. Run as /build-section A1.
argument-hint: "[screen-id A1..C3]"
disable-model-invocation: true
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash(pnpm lint)
  - Bash(pnpm typecheck)
  - Bash(pnpm test *)
  - Bash(git status *)
  - Bash(git diff *)
  - mcp__playwright__browser_navigate
  - mcp__playwright__browser_resize
  - mcp__playwright__browser_take_screenshot
  - mcp__playwright__browser_snapshot
  - mcp__playwright__browser_evaluate
  - mcp__playwright__browser_wait_for
---

# Build screen $0

Target: `docs/design/screens/$0.png` (desktop, 1440 px wide).
Which page, route, sections, copy and motion belong to this screen: [screens.md](screens.md).
Design rules: the `ngb-design-system` skill. Copy rules: the `ngb-copy` skill. Load both now.

Do the steps in order. Do not merge or skip steps. When a step says stop, stop and wait for me.

## Step 1. Read the target
1. Check that `$0` is in screens.md. If not, stop and list the valid IDs.
2. Open the PNG with Read and look at it. Write an inventory, top to bottom: each section, its layout (columns, alignment, what leans, what glows), every text element, every image, every control.
3. Open the copy named in screens.md. Match each text element in the image to a copy line.
   The copy doc wins over text in the image (generated images misspell). Missing lines become `TODO(copy)`.
4. List **deliberate differences**: anything in the image that breaks a rule (a second glow, a raw colour, an em dash, an invented stat, a stock-looking photo). The rule wins.

## Step 2. List the parts, then plan
1. Map every element to a `packages/ui` component or brand utility. Output a table: element · component · variant and props.
2. If a component or variant is missing: **stop**. Propose it (name, props, states, which board shows it) and wait.
   Building it is its own task: component, a story per state, a test, zero axe violations.
3. Plan the sections: folders in `apps/web/sections/<Name>/`, their props, which are Server Components, which leaf needs `"use client"`,
   where data comes from (CMS collection or `apps/web/content/{en,te}.json` keys), which analytics events fire.
4. Enter plan mode, show the plan, and wait for approval.

## Step 3. Build
- Sections only compose `packages/ui` components. `className` only for layout. No raw hex, px, shadows or z-index.
- Every visible and aria string comes from content keys, English and Telugu.
- Photos with `next/image` and `sizes`. A missing real photo gets a labelled placeholder, never a stock or AI-made person.
- Motion from tokens, with a reduced-motion version. GSAP only where screens.md says so.
- Add the section to its page in the order given in screens.md. Pages stay a list of sections.

## Step 4. Look at it
1. Make sure `pnpm dev` is running (start it in the background if not) and the route loads without console errors.
2. With the Playwright browser tools, for the English route and then the `/te` route:
   - `browser_resize` to 1440 x 900, open the route, wait for `document.fonts.ready`, take a full-page screenshot to `tmp/screens/$0-1440.png` (`$0-1440-te.png` for Telugu).
   - `browser_resize` to 360 x 800, take `tmp/screens/$0-360.png` (and `-te`). Check `document.documentElement.scrollWidth <= window.innerWidth`.
3. Open the target and your 1440 screenshot with Read. Compare region by region: grid and margins, spacing, type role (face, size, case), colour, shapes (chamfer, lean, radius), imagery, glow count.
   Write a table: region · target · build · fix. Fix and shoot again. At most 3 rounds, then list what is left and why.
4. 360 px has no target image yet. Check it against the rules instead: 4 columns, 16 px margins, mobile type sizes, 44 px targets,
   primary action in the thumb zone, sticky buy bar on selling pages, nothing clipped, Telugu headings not overflowing.

## Step 5. Review
Run the `design-reviewer` and `a11y-reviewer` subagents in parallel. Give each: the screen ID, the routes, the changed files (`git diff --name-only`), the screenshot paths and your deliberate-differences list.
If this screen touches a form that posts, OTP, checkout, `apps/web/server/**` or `apps/web/app/api/**`, also run `security-reviewer`.
Fix every Blocker and Major. For any Minor you leave, give the reason.

## Step 6. Finish
1. Run `pnpm lint`, `pnpm typecheck`, `pnpm test --filter web` (and `--filter ui` if `packages/ui` changed). Paste the summary lines.
2. Commit on branch `feat/section-$0`: `feat(sections): build $0 <screen name>`. Do not push.
3. Report in this order: what was built · screenshot paths · deliberate differences · reviewer results · TODO(copy), TODO(te), drafted microcopy, [CONFIRM] items · anything still open.
