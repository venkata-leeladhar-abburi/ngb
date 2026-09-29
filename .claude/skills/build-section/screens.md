# Screen map (A1 to C3)

Targets are `docs/design/screens/<ID>.png`, 1440 px wide, dark theme.
"home.md §N" means the numbered section in `docs/copy/home.md`; "pages.md: X" means the heading X in `docs/copy/pages.md`.
Section names are suggestions; keep them if nothing better exists in `apps/web/sections`.
Telugu route for every marketing page: `/te` + the English route.

## Homepage `/` (build A1 to A7 in order; A1 is the master for nav, margins and type)

| ID | Sections (suggested names) | Copy | Layout family · motion | Watch |
| --- | --- | --- | --- | --- |
| A1 | `SiteNav`, `Hero`, `ProofStrip` | Nav: handoff §6 Navigation; home.md §1, §2 | Full-bleed red studio, giant word behind Nawin · word slides in on load (`motion.hero`); stats count up once when visible | Hero has 4 text elements only. No link active in nav. Play button 44 px, needs an aria label. The loader (home.md §0) is not in any image; build it last |
| A2 | `Journey`, `Manifesto` | home.md §3, §4 | Pinned horizontal pan of 5 leaning cards (GSAP, desktop only; swipe below 768) · Manifesto is the only centred section, lines reveal on scroll (GSAP) | Journey years and weights are [CONFIRM]. Tenglish quote is allowed here as a hook. Reduced motion: normal scroll, no pin |
| A3 | `GoalPicker`, `ToolsBento` | home.md §5, §6 | 4 photo tiles, lift 8 px on hover · bento 1 large + 7 small, hover only | Tile titles are links to routes, not buttons. Quiz link to `/quiz` |
| A4 | `WorkoutsPreview`, `TransformationsRow` | home.md §7, §8 | Split video left, muscle list right; muted preview on hover (desktop) · chips + swipe row of leaning ember cards with before/after slider | People in result cards are placeholders until real consented results exist in the CMS. Slider needs keyboard + a non-drag alternative |
| A5 | `ProgramsGrid` | home.md §9 | Red section, featured card raised 24 px, rises on enter | Only the featured card glows. Per-day price under every price. Prices and "pay once" are [CONFIRM] (pricing decision still open) |
| A6 | `PromiseFaq`, `CommunityMarquee` | home.md §10, §11 | Split: signed letter left, accordion right · the page's only marquee, pauses on hover and on focus | Marquee needs a pause control and a reduced-motion static row. Refund days are [CONFIRM] |
| A7 | `FinalCall`, `SiteFooter` | home.md §12, §13 | Left-aligned giant line, Nawin cropped right · ember glow breathes once | The final-call button carries the screen's only glow. Footer "EVOLVE" watermark is `aria-hidden` |

## Inner pages

| ID | Page · route | Sections (suggested) | Copy | Watch |
| --- | --- | --- | --- | --- |
| B1 | Programs · `/programs` | `PageHeaderRed`, `ProgramsGrid` (surface variant), `CompareTable`, `ClubCoachingCards` | pages.md: Programs | Nav "Programs" active. Reuse A5's `ProgramCard`; do not fork it. Compare table is a real `<table>` with header cells. Club price is [CONFIRM] |
| B2 | Program detail (top) · `/programs/mass-builder` | `ProgramHero`, `WhoItsFor`, `PhaseRoute` | pages.md: Program detail | Built as `/programs/[slug]` from CMS data; Mass Builder is only the example. Breadcrumb as `<nav aria-label>` |
| B3 | Program detail (bottom) · same route | `FoodPlanTabs`, `WhatsInside`, `ProgramResults`, `NawinNote`, `FaqAccordion`, `StickyBuyBar` | pages.md: Program detail | Sticky bar must not cover focused elements (add `scroll-padding-bottom`). Results are placeholders until real ones exist |
| B4 | Calorie calculator · `/tools/calorie-calculator` | `ToolLayout`, `CalorieForm`, `ToolResult`, `PlanRecommendation`, `WhatsAppLeadCard` | pages.md: Free tool page | Maths in `apps/web/lib/tools/` as pure functions with unit tests. Inputs and result in the URL query. Result announced with `aria-live="polite"`. Consent checkbox unticked by default |
| B5 | Telugu Plate · `/tools/telugu-plate` | `ToolLayout`, `PlateGrid`, `PlateSummary` | pages.md: Telugu Plate | Food values are [CONFIRM]; keep them in one data file. Steppers are buttons with labels ("Add one pappu"). Summary sticky only on desktop |
| B6 | Checkout · `/checkout/mass-builder` | `CheckoutHeader`, `CheckoutSteps`, `PaymentOptions`, `OrderSummary` | pages.md: Checkout | Dynamic, `no-store`, `noindex`. Price from the server only. Pay button label shows the amount. Run `security-reviewer`. OTP input allows paste and `autocomplete="one-time-code"` |
| B7 | About · `/about` | `AboutHero`, `StoryTimeline`, `ValuesRow`, `ClosingBand` | pages.md: About | JSON-LD `Person` + `Organization`. Timeline is an ordered list |
| B8 | Transformations · `/transformations` | `TransformationsGrid`, `QuoteCard`, `ShareCta` | pages.md: Transformations | All six people are placeholders. Fine print about results is required. Filters update the URL |
| C1 | Free workouts · `/workouts` | `VideoLibrary` (chips + grouped rows of `VideoCard`) | pages.md: Free workouts | Locked cards fire `video_locked_click` and link to the program. Captions note must be true before launch |
| C2 | Club + 1:1 · `/club` and `/coaching` | `ClubPricing`, `CoachingApply` | pages.md: NGB Evolve Club, 1:1 Coaching | Two routes, one image. Button labels here differ from "Start my plan": use what pages.md says and flag any conflict with CLAUDE.md. Prices are [CONFIRM]. Form posts, so run `security-reviewer` |
| C3 | FAQ + 404 · `/faq` and `not-found.tsx` | `FaqPage`, `NotFound` | pages.md: Full FAQ, 404 | JSON-LD `FAQPage`. Group list works as tabs or anchor links with the keyboard. 404 returns status 404 |
