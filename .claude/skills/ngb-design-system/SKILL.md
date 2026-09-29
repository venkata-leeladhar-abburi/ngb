---
name: ngb-design-system
description: NGB Evolve visual system in code. Covers the board map, semantic tokens, type roles and scale, grid, shapes, ember gradient, elevation, motion, icons, imagery and the component list. Use when creating or changing anything in packages/tokens, packages/ui or apps/web/sections, or when judging whether a screen matches the brand.
---

# NGB Evolve design system (in code)

## Order of authority
1. The images: `docs/design/boards/board-01..10.png` and `docs/design/screens/A1..C3.png`
2. `packages/tokens/src/tokens.json` (the only place values live)
3. This skill, then `CLAUDE.md` and `.claude/rules/ui.md`
4. The Taste skill (`design-taste-frontend`) and UI/UX Pro Max: use them for craft checks only (hierarchy, spacing rhythm, anti-slop, UX heuristics).
   Never take a palette, font, style or layout idea from them. The NGB look is locked.
   Never run UI/UX Pro Max's `--design-system` generator; a `design-system/` folder is not a source of truth for this repo.

If an image and a rule disagree (a second glow, a raw colour, an em dash), the rule wins. Say so in your report.

## Which board to open
| Task | Board |
| --- | --- |
| Logo, wordmark, overall mood | 01 Brand |
| Any colour choice or contrast question | 02 Colour |
| Ember gradient, surfaces, shadows, glow | 03 Ember gradient and depth |
| Font, size, case, line length | 04 Typography |
| Grid, spacing, corners, lean, touch | 05 Layout, spacing and shape |
| Icons, decoration, photos | 06 Icons and imagery |
| Buttons, forms, OTP, chips, toggle, nav, sticky bar | 07 Core components |
| Section title, stat strip, program/transformation/tool/video cards, FAQ, share card | 08 Content components |
| Motion, WCAG, UX laws | 09 Motion, access and UX laws |
| How it all combines on phones | 10 System in use |

Open the board with Read and look at it before building or reviewing that part.

## Colour: primitives and semantic tokens
Components use semantic tokens only. Primitives appear only inside `packages/tokens`.

| Semantic token | Primitive | Hex | Use |
| --- | --- | --- | --- |
| `color.bg.page` | ground | #0B0909 | Page background |
| `color.bg.alt` | carbon | #131010 | Alternate dark sections |
| `color.bg.card` | surface | #1C1717 | Cards, inputs, tool panels |
| `color.bg.brand` | studio-red | #C8080D | Red studio sections, programs backdrop |
| `color.bg.band` | oxblood | #42060A | Panels and stat strip on red |
| `color.text.primary` | bone | #EDE3D6 | Main text, also text on red |
| `color.text.muted` | bone-muted | #A89C92 | Secondary text (never on red) |
| `color.text.accent` | signal-red | #FF3B2F | Small red text, links, prices on dark |
| `color.border.subtle` | line | #2E2626 | Hairlines only |
| `color.border.strong` | line-strong | #7A6C64 | Input borders, UI edges (3:1) |
| `color.action.primary` | studio-red | #C8080D | Primary button fill |
| `color.action.pressed` | deep-red | #8E0308 | Pressed primary, vignette |
| `color.focus` | signal-red | #FF3B2F | Focus ring (bone ring on red grounds) |
| `color.tag.popular` | ember-gold | #FFB423 | The one "Most popular" tag |
| `color.status.good` | good | #7FD3A8 | Healthy result, always with icon + word |

Usage ratio per screen: blacks 60%, bone 25%, studio red 10%, signal red + gold + good 5%.

Approved contrast pairs (board 02): bone on ground 15.7:1; bone-muted on surface 6.6:1; signal red on ground 5.6:1;
bone on studio red 4.7:1; ground on ember gold 11.2:1; studio red on ground 3.3:1 (24 px+ text only); line-strong on surface 3.5:1 (borders).
Never: bone-muted on studio red (2.2:1); studio red text under 24 px on black; colour alone for status.
Any pair not on this list: compute the ratio and state it before using it.

## Ember gradient
Radial, core at 36% / 24%: #FFE58A 0%, #FFA23A 15%, #FF5A1F 32%, #E3261B 52%, #A3110F 74%, #2A0605 100%. Token: `gradient.ember`.
- Use for: transformation cards, the featured program, story share cards, the final-call glow.
- Never for: text backgrounds, buttons, icons, tool results.
- Text sits only on the dark lower zone (6.3:1). Text over the bright middle fails (3.6:1).
- The only gradient text allowed is the ghost word (e.g. "EVOLVE", #FFE27A to #FF8A3D, 70% opacity, `aria-hidden`).

## Elevation (board 03)
| Token | Value | Use |
| --- | --- | --- |
| `shadow.rest` | 0 24px 48px -20px #000000cc, 0 0 0 1px #2E2626 | Cards at rest |
| `shadow.hover` | 0 40px 80px -24px #000000e6, plus translateY(-8px) | Hovered cards, menus, sticky buy bar |
| `shadow.sells` | 0 0 0 1px #C8080D66, 0 24px 64px -12px #C8080D73 | The one thing that sells on this screen |
| `shadow.focus` | 0 0 0 2px #0B0909, 0 0 0 4px #FF3B2F | Keyboard focus (2 px gap, 2 px ring) |

Only one `shadow.sells` per screen (Von Restorff). If a design shows two, keep the one on the featured program or final call.

## Typography (board 04)
| Role | Face | Desktop / mobile | Notes |
| --- | --- | --- | --- |
| Mega | Rush Driver Italic | 200 / 96 | One per page, the word behind Nawin, `aria-hidden` if decorative |
| Hero | Rush Driver Italic | 120 / 64 | Max 5 words |
| Display | Rush Driver Italic | 72 / 44 | Section openers on red, final call |
| H1 | GT America Compressed Black Italic | 56 / 36 | Section titles after the red slash |
| H2 | GT America Extended Bold | 32 / 24 | Program names, sub-sections |
| H3 | GT America Standard Bold | 22 / 20 | Card and tool titles |
| Lead | GT America Standard | 20 / 18 | Intros, max 60 characters per line |
| Body | GT America Standard | 17 / 16 | Line height 1.65, 45 to 75 characters per line |
| Label | GT America Extended | 13 / 12 | Buttons, tags, nav; uppercase via CSS, wide tracking |
| Readout | GT America Mono | 28 / 24 | Results, prices per day, tabular numbers |

- Type all display and label text in sentence case; uppercase with `text-transform`. Rush Driver's lowercase draws small caps, so this is safe visually.
- No italics in body text. Max 2 typefaces per component. Body never below 16 px.
- Telugu: Anek Telugu ExtraBold (condensed width) for headings, skewed with `transform: skewX(-8deg)` because it has no italic; Noto Sans Telugu 400 to 600 for body, line height 1.75. Load both only on `/te`. Test every Telugu headline at 360 px: it runs 20 to 30% longer.
- Fonts via `next/font/local` from `apps/web/fonts/`, `display: swap`, subset to Latin + ₹. Preload only Rush Driver and GT America Standard Regular.

## Layout, spacing and shape (board 05)
- Grid: desktop 1440 = 12 columns, 96 px margins, 24 px gutters (content 1248 px). Tablet 768 = 8 columns, 32 px margins. Mobile 360 = 4 columns, 16 px margins.
- Breakpoints 360 / 768 / 1024 / 1280 / 1440. Spacing 4 8 12 16 24 32 48 64 96 128 only.
- Section padding: 128 top / 144 bottom desktop, 64 / 80 mobile.
- Buttons 52 px tall. Desktop nav 72 px, mobile header 56 px. Targets at least 44 x 44 px, 8 px apart.
- Chamfer (cut corners, top-right and bottom-left): 14 px buttons and tool cards, 8 px tags. Cards otherwise 4 px radius.
- Lean: photos and transformation cards `skewX(-8deg)`; counter-skew the text inside so it stays upright.
- Circles only for the 44 px play button.
- Primary actions sit in the thumb zone (bottom third) on phones.

### Chamfer gotcha
`clip-path` also clips `outline` and `box-shadow`. So `ChamferBox` must:
- put the fill on an inner clipped layer;
- draw shadows and the glow with `filter: drop-shadow()` on an unclipped wrapper;
- draw the focus ring as a chamfered layer behind the control (inset -4 px, `color.focus`) with a 2 px `color.bg.page` gap layer;
- add `@media (forced-colors: active) { outline: 2px solid CanvasText; }` on the wrapper.
Never hand-write `clip-path` in a component. Use `ChamferBox`.

## Motion (board 09)
| Token | ms | Use |
| --- | --- | --- |
| `motion.fast` | 150 | Hover, press |
| `motion.base` | 250 | Cards, accordions |
| `motion.slow` | 600 | Section reveal |
| `motion.hero` | 900 | Hero word sliding behind Nawin |
Easing `cubic-bezier(0.16, 1, 0.3, 1)`. Reduced motion: fades only, no pinning, no parallax.
GSAP ScrollTrigger only for the two scroll-driven home sections (Journey pan, Manifesto line reveal), both switched off below 768 px.
Everything else uses Motion or CSS. Per-section motion is listed in the build-section skill's `screens.md`.

## Icons and imagery (board 06)
- Phosphor icons, `regular` weight (1.5 px stroke at 24 px), sizes 16 / 20 / 24 / 32, bone. Only the flame may be signal red. Never inside circles.
- Fitness symbols (plate ring, heart-rate line) are decoration only, bone at 30%, `aria-hidden`, never buttons.
- Photos: hero on the red studio with hard top-left light; journey photos real archive in grayscale; food is real Telugu meals; results same light and same pose, before and after.
- Never stock gym photos, AI-made clients, or filters that change bodies. If a real photo is missing, use a labelled placeholder block.

## Components
Brand utilities (`packages/ui/src/brand/`): `ChamferBox`, `LeanFrame`, `EmberSurface`, `StudioBackdrop`, `HeartbeatLine`, `SectionTitle`.

Core (board 07):
- `Button`: variants `primary` (studio red), `secondary` (1.5 px bone border), `onRed` (bone fill, ground label). States: default, hover (lift 2 px), pressed (deep red), focus, disabled (surface fill, muted label), loading (three short bars). One line, uppercase label.
- `TextField` (label above, helper or error below with icon), `OtpInput` (6 boxes), `SegmentedControl`, `Chip`, `Toggle`, `LangSwitch` ("EN | తె").
- `NavBar` (desktop 72 px: wordmark, 5 links, language switch, primary button), `MobileHeader` (56 px), `StickyBuyBar` (program name + price left, primary button right).

Content (board 08):
- `SectionTitle` (three speed lines, red slash, compressed italic title), `StatStrip` (oxblood band, Rush Driver stats, heart-rate line).
- `ProgramCard` standard (oxblood) and featured (ground, red edge, `shadow.sells`, gold tag). Price in Rush Driver, per-day price in mono under it.
- `TransformationCard` (ember, 8 degree lean, before/after split, name + town, weeks and change in mono, "Shared with permission").
- `ToolCard`, `VideoCard` (free with play button, locked with lock icon), `FaqAccordion` (plus/minus), `ShareCard` (9:16, ember).

If a screen needs something not on this list, stop and propose it. Do not build one-off styled markup inside a section.

## Quick self-check before saying a UI task is done
- [ ] No raw hex, rgb, px sizes, shadows or z-index outside `packages/tokens`
- [ ] Each text element uses the right role from the type table
- [ ] One `shadow.sells` on the screen, one marquee on the page, at most one eyebrow per three sections
- [ ] Hero has 4 text elements or fewer; no two CTAs with the same intent
- [ ] Ember used only where allowed; text only on its dark zone
- [ ] Chamfers, lean and radii from the brand utilities
- [ ] Focus ring visible on every control, including chamfered ones
- [ ] Reduced-motion version exists
- [ ] Screenshots at 1440 and 360 compared with the target, differences listed
