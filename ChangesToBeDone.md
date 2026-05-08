# Changes To Be Done

## Priority Rework

- [ ] Replace placeholder metadata in [index.html](index.html):
  - [ ] Replace `description` placeholder text with final production copy.
  - [ ] Replace `keywords` placeholder text with targeted keyword set.
- [ ] Align branding and entity naming across all structured and social metadata:
  - [ ] Ensure one canonical brand name is used consistently (currently mixed references exist).
  - [ ] Update JSON-LD `WebSite.name` to match the production brand.
- [ ] Replace social preview image strategy for crawler reliability:
  - [ ] Add PNG/JPG social preview asset (recommended `1200x630`) under [assets/images](assets/images).
  - [ ] Update `og:image` to use the new PNG/JPG asset.
  - [ ] Update `twitter:image` to use the new PNG/JPG asset.
  - [ ] Add optional `og:image:width`, `og:image:height`, and `og:image:alt`.

## SEO Rework

- [ ] Finalize canonical and alternate language strategy:
  - [ ] Confirm canonical URL format (with or without trailing slash) and enforce one variant.
  - [ ] Verify all `hreflang` entries point to valid language-specific URLs.
  - [ ] Confirm `x-default` target URL behavior.
- [ ] Add technical SEO support files:
  - [ ] Create `robots.txt`.
  - [ ] Create `sitemap.xml`.
- [ ] Improve metadata quality:
  - [ ] Refine title and meta description for intent and CTR.
  - [ ] Add locale-aware Open Graph tags if required (`og:locale`, alternates).

## AEO Rework (Answer Engine Optimization)

- [ ] Expand structured data coverage beyond current basics:
  - [ ] Validate and refine `WebSite` schema.
  - [ ] Validate and refine `FAQPage` schema against on-page FAQ content.
  - [ ] Add `Organization` schema with official brand profile links if available.
  - [ ] Add `WebPage` schema for clearer page intent.
- [ ] Ensure all structured data values match visible page content exactly.
- [ ] Run structured data validation (Google Rich Results + Schema Validator) and fix warnings/errors.

## Content + Internationalization Rework

- [ ] Review and polish EN/AR/RU/ZH copy for brand tone consistency.
- [ ] Ensure all user-visible strings are fully localized where needed.
- [ ] Recheck RTL rendering details in Arabic for layout and spacing edge cases.

## UI/UX Rework

- [ ] Decide whether the first body image should remain logo-only or be replaced by a dedicated hero image.
- [ ] If using hero image:
  - [ ] Add a production image in [assets/images](assets/images).
  - [ ] Update alt text for meaningful accessibility context.

## Validation + Launch Checklist

- [ ] Re-run accessibility checks (keyboard flow, focus order, contrast audit).
- [ ] Test social card previews in platform validators.
- [ ] Test responsive behavior across key breakpoints and devices.
- [ ] Test language switching and URL parameter behavior (`?lang=`).
- [ ] Final QA pass before deployment.

## Copy & Brand Updates

- [ ] Tab/Page Titles: The translations in `script.js` currently set the document.title to "HK Studio | Multilingual Editorial Website" (for EN, AR, RU, ZH). These need to be rewritten to reflect "Hainan Infrastructure Partners".
- [ ] Schema / Script: The `index.html` file includes JSON-LD schema referencing `"name": "HK Studio"`.
- [ ] Translations Text: Several translated text chunks in `script.js` (like `brand` and `metaDescription`) refer to "HK Studio" and need to be fully localized for Hainan Infrastructure Partners.
