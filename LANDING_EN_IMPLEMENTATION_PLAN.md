# Landing EN Implementation Plan

## Goal

Launch an English version of the marketing landing without breaking the current Spanish version, while minimizing duplicated code and keeping the content structure maintainable.

## Desired Routes

Spanish:

- `/`
- `/reglas/`

English:

- `/en/`
- `/en/rules/`

## Current State

- `landing/site/src/pages/index.astro` contains both structure and Spanish copy inline.
- `landing/site/src/pages/reglas.astro` contains both structure and Spanish rules copy inline.
- `landing/site/src/layouts/BaseLayout.astro` is currently Spanish-specific:
  - `lang="es"`
  - `og:locale="es_AR"`
  - `WebSite.inLanguage = "es"`
- No reusable landing i18n layer exists yet.

## Recommended Architecture

Do not add a full i18n framework.

Instead:

1. Extract language content into plain data modules.
2. Extract page rendering into shared Astro components.
3. Keep each route as a thin language wrapper.

This gives:

- minimal duplication
- easy copy editing
- safe rollout
- no CSS rewrite
- no unnecessary complexity

## Proposed File Structure

### New content files

- `landing/site/src/data/landing-content.ts`
- `landing/site/src/data/rules-content.ts`

Suggested exports:

- `landingContent.es`
- `landingContent.en`
- `rulesContent.es`
- `rulesContent.en`

### New shared page components

- `landing/site/src/components/LandingPage.astro`
- `landing/site/src/components/RulesPage.astro`

### Route wrappers

- `landing/site/src/pages/index.astro`
- `landing/site/src/pages/reglas.astro`
- `landing/site/src/pages/en/index.astro`
- `landing/site/src/pages/en/rules.astro`

Each route should only:

- import the right locale content
- pass props into shared components
- define localized SEO/meta behavior

## What Should Move Into Content

### Home page content

Extract:

- page title
- page description
- labels for countdown date/time
- prize cards
- steps
- FAQ items
- nav labels
- CTA labels
- trust row text
- section labels
- footer labels
- microcopy/meta strip copy

### Rules page content

Extract:

- page title
- page description
- payout table rows
- scoring rows
- winners rows
- match examples
- hero copy
- rules section headings
- all rule bullet copy
- footer labels

## What Should Stay In Shared Components

Do not duplicate:

- page structure
- Astro markup layout
- CSS classes
- poster/image usage
- countdown script
- waitlist script
- FAQ schema generation logic
- rules table rendering logic
- footer/header structure

## BaseLayout Changes

`BaseLayout.astro` should become locale-aware through props.

Suggested new props:

- `lang`
- `ogLocale`
- `structuredData`
- `alternates`

This should drive:

- `<html lang="...">`
- `og:locale`
- `WebSite.inLanguage`
- alternate language links
- `x-default`

## SEO / Internationalization

### Canonicals

- `/` canonical -> `/`
- `/reglas/` canonical -> `/reglas/`
- `/en/` canonical -> `/en/`
- `/en/rules/` canonical -> `/en/rules/`

### hreflang

Home pair:

- `hreflang="es"` -> `/`
- `hreflang="en"` -> `/en/`
- `hreflang="x-default"` -> `/`

Rules pair:

- `hreflang="es"` -> `/reglas/`
- `hreflang="en"` -> `/en/rules/`
- `hreflang="x-default"` -> `/reglas/`

### Metadata

Each locale must have:

- translated title
- translated description
- matching Open Graph and Twitter metadata

## Structured Data

### Home

Reuse `FAQPage` generation from locale content.

Spanish FAQ schema uses Spanish copy.
English FAQ schema uses English copy.

### Rules

Reuse `BreadcrumbList`, localized:

- ES: `Inicio` / `Reglas del Prode Mundial 2026`
- EN: `Home` / `World Cup 2026 Rules`

## Internal Linking

All internal links must become locale-aware.

Examples:

- ES home -> `/reglas`
- EN home -> `/en/rules`
- ES rules -> `/`
- EN rules -> `/en/`

Anchor links like `#faq`, `#premios`, `#waitlist` can remain unchanged.

## Copy Strategy For English

Do not do literal translation.

Adapt meaning and tone.

### Locked English decisions

- Use `World Cup Predictions 2026` as the SEO/title direction.
- Translate `cartón` as `entry`.
- Keep the Chiqui quote as a local wink rather than translating it literally.

### Recommended English conventions

- Use `ProDefi` as the brand.
- Prefer SEO-facing phrasing like `World Cup Predictions 2026`.
- Translate `cartón` as `entry` consistently.
- Keep `onchain`.
- Keep English clearer and more universal than the Spanish version.

### Brand/culture-sensitive copy

The Chiqui Tapia quote should stay as a wink, not as the main explanation of the product.

Recommended direction:

- keep the quote in Spanish
- contextualize it briefly in English

Example direction:

- `As Chiqui would say: "No trates de entenderla, disfrutala".`

## Recommended English Direction

### SEO / titles

Prefer:

- `World Cup Predictions 2026 | Prizes and Rules | ProDefi`

Do not force `Prode` into English SEO.

### Product wording

Prefer:

- `entry`
- `predictions`
- `leaderboard`
- `prize pool`
- `shared positions` when explaining ties

## Implementation Sequence

1. Create `landing-content.ts` and `rules-content.ts`.
2. Move all inline copy into locale objects.
3. Create `LandingPage.astro`.
4. Create `RulesPage.astro`.
5. Refactor existing Spanish routes to use shared components.
6. Add English route wrappers:
   - `/en/`
   - `/en/rules/`
7. Update `BaseLayout.astro` for locale props and alternates.
8. Localize schema output.
9. Verify links between languages.
10. Build and test all four routes.

## Verification Checklist

### Functional

- Spanish home still renders correctly.
- Spanish rules still render correctly.
- English home renders correctly.
- English rules render correctly.
- All CTAs and anchors work.
- Waitlist form behavior remains unchanged.

### SEO

- correct canonical per route
- correct `hreflang` per route
- correct `lang` per page
- correct localized titles/descriptions
- correct localized schema
- no Spanish metadata leaking into English pages

### UX

- no layout regressions due to longer English copy
- footer/header still fit cleanly
- countdown microcopy still works in both languages
- prize cards and FAQ remain visually balanced

## Risks

- duplicated markup if content extraction is not done first
- broken internal links between locales
- forgetting to localize schema and metadata
- English copy becoming too literal or too local
- oversized English text breaking section balance

## Recommended Output Quality Bar

- English should read as product copy, not translation copy.
- Keep the Spanish personality, but make the English version understandable for a global audience.
- Avoid overusing Argentina-specific references outside intentional brand moments.
