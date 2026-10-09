# Gallery and project button fixes, 9 October 2026

Compact project CTAs now reserve space for both arrows. The previous 14px padding put the outgoing arrow 32px over the label. The corrected padding leaves a visible gap in the resting, hover and keyboard focus states while retaining the existing arrow exchange and project navigation.

The homepage interior gallery no longer declares `data-lenis-prevent`. Its desktop images move through GSAP in response to vertical page scrolling, so wheel input must reach Lenis. Independently scrollable dropdowns and mobile navigation retain their prevention rules. The local Lenis skill now documents this distinction.

Both new regression checks failed against the previous build, reproducing the overlapping label and stationary wheel position. After the fixes, the focused browser run passed 20 tests, with 12 skips for interactions that do not apply to a browser profile. Coverage includes Chrome desktop, reduced-motion Chrome with the requested full motion, iPhone WebKit and Android Chromium emulations. Checks cover arrow separation, hover/reset, keyboard focus, project navigation, forward/reverse wheel over photos, release beyond the pinned gallery, gallery selectors, menu scrolling and dropdown keyboard behavior. Lint, TypeScript and the production build passed.

Scoped design gate:

- Hard gate PASS: the tested controls navigate and support keyboard focus; no assets, copy, claims, navigation or forms were introduced. Existing loading/error behavior is unaffected.
- Purpose gate PASS: arrow exchange communicates project navigation; wheel-driven horizontal movement continues the existing room sequence. No new effects were added.
- Liveliness PASS: the existing navy, ivory and gold architectural portfolio direction and motion remain; the changes restore usable whitespace and the established gallery choreography.
- Craftsmanship PASS: actual label/arrow geometry, project navigation and wheel input passed browser checks. Phone gallery controls and independently scrolling menus also passed.

Visual evidence: `../output/website-review/project-button-spacing.png`. Local preview: http://127.0.0.1:3001/. Browser emulation does not substitute for physical device testing.
