# Boilerplate & Placeholders to Replace

This document serves as a checklist for all the placeholder elements, structural dummy text, and missing assets that still need to be swapped with final production content.

## 1. Legal Documents
- [ ] **Hong Kong Business Registration Number**: Replace `[XXXXXXXX]` with the actual Business Registration Number for the Hong Kong entity in the following places:
  - `privacy.html` (First paragraph under the heading)
  - `regulatory.html` (First paragraph under the heading)
- [ ] **Contact Email**: Verify if `headquarters@hainan-infra.com` in `privacy.html` is the operational email address or if a separate legal/compliance address is required.

## 2. Meta Data & SEO configuration 
- [ ] **Meta Description (`<meta name="description">`)**: Currently set to `"Hainan Infrastructure Partners …"` in the head of `index.html`, `privacy.html`, `terms.html`, and `regulatory.html`. Replace with a robust, complete paragraph for search engines.
- [ ] **Meta Keywords (`<meta name="keywords">`)**: Currently set to `"…"` across all HTML files. Replace with actual targeted keyword strings.
- [ ] **Dynamic Meta Description in `script.js`**: Update the `metaDescription` string in the translation dictionaries for all configured languages (`en`, `ar`, `ru`, `zh`).

## 3. Structural Copy Updates (`script.js`)
Currently, `script.js` retains placeholder/template copy from the original layout setup detailing "Editorial Systems for Public-Facing Platforms". This copy powers the localized site, so it needs to be updated with final Hainan Infrastructure Partners product and platform offerings for all translations:
- [ ] `heroKicker` 
- [ ] `heroTitle`
- [ ] `heroBody`
- [ ] `intakeTitle`, `intakeText`, and bullet points (`intakePoint1`, etc.)
- [ ] `institutionalTitle`, `institutionalText`, and bullet points (`institutionalPoint1`, etc.)

## 4. Media & Assets
- [ ] **Missing Video**: The background video file (`assets/videos/cover.mp4`) does not physically exist in the directory. You need to upload the actual `.mp4` content. 
*(Note: As implemented recently, the Play button dynamically hides itself so the site won't look broken in the meantime, but the video needs replacing).*
- [ ] **Favicon**: The favicon line `<!-- <link rel="icon" type="image/svg+xml" href="assets/images/logo.svg" /> -->` in the HTML files is currently commented out. Once the final logo is approved, uncomment this line or replace it with the correct `.ico`/`.png` file reference.