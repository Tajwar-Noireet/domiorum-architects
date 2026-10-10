# Studio upgrade review

10 October 2026. Upgrade and gallery repair based on `d513f1c`, prepared for the client's authorised commit and push to `main`.

## What changed

- Reworked page introductions into a consistent architectural folio layout. Services now has a four-part index, clearer service scopes, a large interior photograph and direct consultation links.
- Refined the homepage studio section, four-step process and footer. The founder remains on Discover us. Contact details and project records come from the existing content.
- Added route-scoped text entrances, subtle image movement and a scroll-linked process rule. Text remains fully opaque during its entrance. The hero is readable immediately after the brand film, with a shorter movement instead of a second text fade.
- Coalesced font, route and intro scroll measurements into one animation-frame refresh. Kept one Lenis instance and GSAP ticker, direct scroll scrubbing, native touch inertia and the client's full-motion preference.
- Added room-gallery keyboard navigation, active chapter feedback and a reading-progress rule. Project detail galleries keep only the current and adjacent scenes visible, reducing unnecessary painting without removing their images or no-JavaScript layout.
- Made the mobile menu more opaque, added active navigation states and retained its focus trap, animated controls and direct phone link.
- Preserved the cinematic hero, clickable glass project stack and five-card spread, exploded house, custom cursors, approved imagery and navy/ivory/gold palette.
- Reproduced the desktop room-gallery bug: horizontal gestures did not move the pinned track because Lenis accepted vertical input only while the gallery's native overflow was hidden. Horizontal-dominant wheel gestures now feed the existing Lenis animation at their original distance. Vertical wheel input and browser zoom retain their handling; touch input is unchanged.
- Enabled clipped overflow only when the GSAP pin is installed, fitted room photographs around the laptop caption/controls, and kept very short desktop windows in native horizontal flow. Breakpoint changes remove the pin marker with its animation context.
- Kept interactive controls out of text-entrance transforms. A repeatable small-laptop hover failure showed the Discover CTA moving above the pointer as its biography entered. Text within groups now animates independently of their links, buttons and inputs; the previously failing hover check passes.

## Verification

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed; 18 pages generated.
- `git diff --check`: passed. Git's LF/CRLF notices are line-ending notices, not whitespace errors.
- Full regression run before final corrections: 248 cases, 183 passed, 51 platform-specific skips and 14 failures. The failures comprised an entrance-opacity contrast issue, outdated home-link selectors after adding a footer logo link, and outdated focus expectations after adding the menu phone link. All 14 passed after correction.
- Expanded folio checks: 16/16 passed, covering service anchors, consultation navigation, gallery keyboard selection, progress state, process/footer visibility and fast forward/backward scene selection.
- Final run after shortening entrances: 68 passed, 8 intentional platform-specific skips, no failures or retries. Files: `brand-reveal.spec.ts`, `hero-title-motion.spec.ts`, `folio-upgrade.spec.ts`, `smooth-scroll.spec.ts`.
- Profiles: desktop Chrome, iPhone 13 WebKit, Pixel 7 Chromium and desktop with the OS reduced-motion preference. The last profile verifies the client's explicit full-motion choice. These are browser emulations, not physical-device tests.
- Browser inspection covered the services layout, service-anchor destination, homepage studio/process, desktop/mobile footer and mobile menu. Live Vercel inspection confirmed the previous version is still deployed; project selection worked during that inspection. No device-independent frame-rate or speed-percentage claim is made.
- Local 21st review: 57 files, 0 errors, 0 warnings and 82 informational colour-literal suggestions. Existing brand colours were retained.
- React review: server-rendered pages remain server components; animation effects clean up contexts, observers and listeners; scroll-driven React updates occur only on chapter changes; images retain responsive sizing and preload/lazy-loading behaviour.
- Gallery regression was demonstrated on the previous build before repair. The repaired production build passes forward/reverse horizontal and diagonal wheel input, vertical-wheel release, laptop control visibility, width/height breakpoint changes, route return, keyboard chapter selection and native Android touch swipes. Mobile WebKit checks exercise native horizontal scrolling via its browser API because Playwright does not provide iPhone swipe/wheel input.
- Production regression run after the gallery repair: 264 cases, 200 passed, 58 intentional platform-specific skips and six failures. One landscape test still expected a pin below the new 560px height threshold; three failures came from overlapping test runs deleting shared trace artifacts; one WebKit error came from an RSC prefetch cancelled by the test's explicit reload; one was the genuine small-laptop CTA hover issue described above. Landscape and trace-artifact cases passed sequential reruns. The hover issue was repaired in application code.
- The WebKit trace showed successful HTTP 200 RSC responses followed by the access-control message 40ms into the explicit page reload. The intro test now excludes only that WebKit RSC cancellation while its controlled reload is in progress, retaining other runtime-error checks.
- Final production run after the control-stability and test corrections: 27 passed, 9 intentional platform-specific skips, no failures or retries. The run covered room scrolling, laptop and mobile controls, service links, project scenes, process/footer visibility, CTA hover and the loading reveal. All six previously failing cases passed sequential reruns or this final run.

Screenshots: `../output/website-review/upgrade-services-desktop.png`, `upgrade-footer-desktop.png`, `upgrade-footer-mobile.png`, `interior-scroll-fixed-desktop.png`.

## Antislop delivery gate

Applied throughout, as requested. Scope: this upgrade and its integration with the existing website. Established user-approved copy, branding and interaction concepts are retained.

### 1. Hard gate

- R-02 PASS: new prose uses ordinary punctuation; this upgrade introduces no em dashes in UI copy. Existing metadata/caption separators were not rewritten.
- R-03 PASS: browser checks found no document overflow in tested layouts; phone navigation, headings, service rows and footer were visually checked.
- R-17 PASS: no invented statistics added.
- R-18 PASS: no fabricated testimonials added.
- R-23 PASS: used existing approved logo, project photographs, pages and contact details. No new synthetic visual assets or fictional team members.
- R-24 PASS: service index targets exist; main/footer navigation and consultation routes are covered by browser checks.
- R-25 PASS: corrected the entrance-opacity contrast regression; accessibility checks passed after correction. New text remains fully opaque over the established contrasting surfaces.
- R-26 PASS: navigation, service links, project covers, gallery selectors, dropdowns, FAQ controls and enquiry validation have real behaviour. Contact submission retains its explicit email-draft flow.
- R-27 PASS: intro loading, failed autoplay, stalled playback, unavailable storage, failed hydration, no JavaScript and form validation states are covered.
- R-28 PASS: existing FAQ concerns the first conversation, apartment renovations, fee/timeline, construction scope and image provenance.
- R-32 PASS: keyboard menu focus, Escape dismissal, gallery arrow/Home/End controls and visible focus styles verified.
- R-33 PASS: changes are in the application source and CSS, without runtime source-patching scripts.
- R-34 PASS: one approved brand theme; no theme toggle or incomplete alternate theme introduced.
- R-35 PASS: production build and browser verification completed, with the results and click-through scope recorded above.
- R-36 PASS: no invented security, compliance, performance or customer claims.
- R-37 PASS: direction grounded in `website/DESIGN.md`, supplied architecture references and the instruction to upgrade the existing design without changing colours. Dials: ENERGY 2 / RHYTHM 3 / MOTION 3.
- R-38 PASS: real project records, service descriptions and contact details reused; no fabricated commercial content.

### 2. Purpose gate

- R-01 PASS: existing photo shading supports legible hero text; the card sheen identifies the requested glass surface. No new decorative colour gradients.
- R-04 PASS: existing directional arrows communicate movement or navigation; the architecture-specific house and cursor motifs are retained.
- R-06 PASS: Jost retains the studio's geometric identity; serif project titles distinguish portfolio work; small uppercase labels mark chapters.
- R-07 PASS: rules and chapter numbers act as a folio index. The existing house drawing grid belongs to the architectural illustration.
- R-08 PASS: arrows distinguish onward links and downward section navigation, with reserved spacing for their motion.
- R-09 PASS: no invented badges or promotional status labels.
- R-10 PASS: glass remains limited to existing navigation/selected-card contexts; the five-card fan stays lightweight. No new blurred full-page surfaces.
- R-12 PASS: card shadows communicate stack depth; service/process content uses ruled space instead of floating cards.
- R-13 PASS: no new glow effects.
- R-14 PASS: service index items are parallel navigation; service scope rows, imagery, studio copy and process chapters have distinct content-led layouts.
- R-19 PASS: scroll scrubbing explains spatial sequences; entrances mark reading order; progress rules provide location feedback; hover motion signals interactivity. No new pinned sections or delayed scroll springs.
- R-22 PASS: existing exploded house directly illustrates the services, with no unrelated stock illustration.

### 3. Liveliness

- Dials PASS: ENERGY 2 / RHYTHM 3 / MOTION 3, declared for the upgrade direction.
- Rhythm PASS: large image sequences, editorial reading areas, indexed service rows and a four-stage process create distinct compositions.
- Focal points PASS: page headlines, project photographs and the footer invitation provide a clear visual lead.
- Whitespace PASS: spacing separates chapters and reserves room for titles and controls; phone layouts reflow rather than shrinking the desktop grid.
- Accent PASS: warm gold remains the deliberate accent for chapter labels, active links and progress.
- Identity PASS: original project images, ruled folio labels, architectural illustration and drawing-tool cursors retain the studio's character.
- Design read PASS: existing brand direction and the user's preserve-and-upgrade instruction guided the work before implementation.

### 4. Craftsmanship and quality locks

- C-1 / R-31 PASS: visual choices have the purposes recorded above.
- C-2 PASS: new controls navigate or change a real gallery/menu state; tested routes and keyboard flows work.
- C-3 PASS: sections serve the supplied projects, services, studio, process or contact flow; no new filler sections.
- C-4 PASS: responsive, keyboard, loading/error and no-JavaScript flows were checked within the stated browser scope.
- C-5 PASS: no fictional claims or proof added.
- R-05 PASS: different content structures replace uniform section styling; the four process stages come from the existing practice description.
- R-11 PASS: controls retain the approved button shape; images, dividers, service rows and form controls retain distinct geometry.
- R-15 PASS: added links name their destination or action, including service titles, 'Discuss your project' and the real studio phone number.
- R-16 PASS: no promotional AI buzzwords added.
- R-20 PASS: original portfolio imagery and architectural motifs establish a recognisable studio identity.
- R-21 PASS: navy is the explicit client brand direction, balanced with existing ivory reading surfaces.
- R-29 PASS: navy, ivory, graphite and the gold accent remain the established palette.
- R-30 PASS: references inform scroll behaviour; the supplied studio assets and existing site structure define the implementation.

## Limits and handoff

The client has now authorised committing and pushing the complete pending upgrade and gallery repair. The local production preview uses port 3001. Physical device performance and every possible hardware/network combination are not certified by browser emulation. Enquiry delivery remains the existing email-draft flow, not a new booking or mail backend.
