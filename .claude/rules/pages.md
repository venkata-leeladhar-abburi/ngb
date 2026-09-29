---
paths:
  - "apps/web/app/**"
  - "apps/web/content/**"
---

# Routes and pages

## Route groups
- `(marketing)`: home, `/start`, `/quiz`, `/programs`, `/programs/[slug]`, `/tools`, `/tools/[slug]`, `/workouts`, `/transformations`, `/about`, `/club`, `/coaching`, `/faq`. Static; revalidate on CMS publish via tags.
- `(checkout)`: `/checkout/[program]`, `/welcome`. Dynamic, `no-store`, never indexed.
- `(member)`: `/account/**`. Dynamic, authenticated, never cached, never indexed.
- Telugu mirrors every marketing route under `/te/...`; the language switch keeps the user on the same page.

## A page is only a list of sections
- Pages import from `apps/web/sections` and pass data; no JSX styling, no Tailwind classes except layout wrappers.
- Section order and copy follow `docs/copy/home.md` and `docs/copy/pages.md`.

## SEO and sharing (every marketing page)
- `generateMetadata` with title, description, canonical, `alternates.languages` (`en-IN`, `te-IN`).
- Open Graph image per page; tool pages generate one per result for sharing.
- JSON-LD: `Person` + `Organization` (home, about, with `sameAs` to the main Instagram and YouTube), `Product` + `Offer` (programs), `FAQPage` (faq), `VideoObject` (workouts), `WebApplication` (tools).
- Sitemaps for English and Telugu; checkout and member routes disallowed in robots.

## Links and deep links
- Instagram and WhatsApp links open the exact tool or program, with UTM tags: `utm_source=instagram&utm_medium=reel|story|bio|dm&utm_campaign=<series>`.
- Tool inputs and results live in the URL query so refresh and back work in the in-app browser.

## Analytics events (fire exactly these names)
`tool_start`, `tool_complete`, `share_card`, `lead_submit`, `quiz_complete`, `video_play`, `video_locked_click`,
`checkout_start`, `otp_verified`, `purchase`, `payment_failed`, `lang_switch`.
Purchase events are sent server-side (Meta Conversions API) from the payment webhook, not from the browser.

## Page checks before done
- Lighthouse mobile 90+, no axe violations, correct `lang`, one `<h1>`, headings in order.
- Works at 360 px in the Instagram in-app browser (Playwright `android` project).
