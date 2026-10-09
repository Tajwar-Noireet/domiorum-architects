# Glass surface review, 9 October 2026

Implemented the client's glassmorphism request within the existing navy, ivory and gold architecture portfolio. Direction: restrained material layering, ENERGY 2 / RHYTHM 3 / MOTION 3. Frosted frames separate the project stack, while small thumbnail panels and floating menus show their elevation over underlying content. Reflections and shadows indicate those layers; reading sections retain their established surfaces.

Changed `website/src/styles/portfolio.css`, `website/src/styles/discover-interactions.css` and `website/DESIGN.md`. Existing components, images, navigation and animation code are reused. No new dependencies or JavaScript listeners were added.

The active desktop project card has 12px backdrop blur and an 88% navy backing. Inactive cards and the final five-card spread have solid tinted frames without backdrop blur. Ordinary-flow thumbnails use a smaller frosted frame. Mobile navigation and form options use 94% navy and ivory backings. Unsupported filters retain solid surfaces; reduced-transparency and forced-color preferences remove blur. Existing full-motion behavior is preserved.

Validation: lint, TypeScript and the production build passed. The existing browser checks passed 25 cases, with 23 profile-specific skips. Coverage includes desktop Chrome, reduced-motion Chrome with full motion, iPhone WebKit and Android Chromium emulations. Checks verified forward/reverse card stacking, the final spread, project links, arrow spacing, hover/reset, gallery wheel scrolling, mobile gallery selectors, menu scrolling/focus, dropdown keyboard behavior, all-page image loading, overflow and runtime errors. Existing accessibility checks passed. No new tests were needed for these surface-only changes.

Visual inspection verified the desktop Mirpur DOHS card, mobile navigation and contact dropdown. Computed styles confirmed only one desktop stacked card applies backdrop blur. Photographs remain sharp and labels remain separate from arrows. Evidence: `output/website-review/glass-project-desktop.jpg` and `output/website-review/glass-mobile-menu.jpg`.

Scoped design gate:

- Hard gate PASS: tested navigation, focus, menus and galleries remain usable across the browser profiles. No copy, assets, business claims or data-submission behavior were introduced. Dense navy and ivory backings retain text contrast.
- Purpose gate PASS: the client explicitly requested glass. Reflections, blur and restrained shadows distinguish overlapping project frames and floating controls. They are limited to those surfaces.
- Liveliness PASS: the established brand palette, photographic focal points, varied section rhythm and requested scroll choreography remain. Glass frames clarify the stack without replacing its content.
- Craftsmanship PASS: existing interaction, responsive and accessibility checks passed; desktop and phone screenshots were reviewed. Unsupported-filter and transparency-preference fallbacks are defined in CSS.

The local preview runs at http://127.0.0.1:3001/projects. Browser emulations are not physical phone tests. These styling checks do not constitute a hardware performance benchmark.
