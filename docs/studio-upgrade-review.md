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

## Unnumbered section labels, 13 October 2026

Removed decorative numbering from all section labels, hero scenes, service and process lists, portfolio metadata/index/progress, room captions and mobile navigation. Project-gallery selectors now use active dots; their descriptive accessible names, chapter positions and click handlers remain. Service and process layouts reclaim the removed number columns. No animation lifecycle, route, image or colour changes were made.

Verification: lint, TypeScript and the production build passed. All 16 existing folio browser checks passed across desktop Chrome, iPhone WebKit, Android Chromium and desktop with the reduced-motion preference (the client's full-motion policy still applies). All four service links reached their corresponding headings; Discuss your project opened the consultation page; room buttons and keyboard Home/End/arrows selected the appropriate room and progress; every project-scene selector worked in both directions; process content and the footer remained visible, and the footer invitation navigated to Contact. In-app visual inspection confirmed the unnumbered service index and mobile menu; Menu opened, Services closed it, and no console errors were logged. No physical-device testing is claimed.

Scoped delivery gate, using the existing full rule report above for preserved features:

- Hard gate PASS (R-02/03/17/18/23/24/25/26/27/28/32/33/34/35/36/37/38): source review found no remaining decorative section numbers; no new claims, assets, colours or routes; responsive service checks found no document overflow; accessible selector names/focus and existing state handling remain; production build and the click-through checks above passed.
- Purpose gate PASS (R-01/04/06/07/08/09/10/12/13/14/19/22): original brand typography, imagery, surfaces and motion retained; dots communicate gallery selection without numerical labels, and the removed grid columns prevent empty spacing. No new decorative effects.
- Liveliness PASS: existing ENERGY 2 / RHYTHM 3 / MOTION 3 retained; photographs, architectural illustration, navy/ivory contrast, gold active indicators and functioning spatial sequences remain. Desktop service screenshot: `../output/website-review/unnumbered-sections-desktop.png`.
- Craftsmanship and quality locks PASS (C-1 through C-5; R-05/11/15/16/20/21/29/30/31): requested labels removed directly from source, unused number styles/props removed, title-based links preserved, mobile grids reflow correctly, and gallery handlers/React keys remain stable. TypeScript and ESLint passed. The optional 21st CLI review was unavailable locally and registry resolution failed; no CLI-review pass is claimed for this change.

These changes are available in the local production preview on port 3001 and remain uncommitted.

## Portfolio categories and profile, 13 October 2026

Removed the hero frame note and its now-unused animation/CSS. Added one reusable ProjectCollection using the existing ProjectShowcase and ProjectCard components, with All, Interiors and Exteriors filter buttons. Home and Projects retain their animated stacks; filtering to the single exterior project uses ordinary page flow. Switching categories remounts the scoped showcase so its old animation context is cleaned up and the new scroll geometry is measured. Discover combines all six profile projects in one collection without current/previous studio headings. Project-specific authorship credits remain on the relevant detail page. Zarin's supplied role is now Co-founder & Principal Architect, including metadata, accessible image description and biography. Portrait width is capped at 360px desktop and 260px mobile.

Verification: lint, TypeScript and the production build passed. New filter/profile flows and existing accessibility checks: 20 passed across desktop, iPhone WebKit, Android Chromium and the full-motion desktop preference profile. Click-through: All shows the complete selection; Interiors excludes Doctors Residence; Exteriors shows its cover; its cover opens the correct detail route; Back then All restores the animated collection; desktop project-index links seek forward and backward after filter changes; Discover filters include the retained Selim project, and keyboard Enter restores All. Role, portrait dimensions and absence of old headings were checked. Axe checks passed for Discover, Contact with an open dropdown, and Projects. In-app inspection confirmed the new profile and Exteriors selection. Existing folio/portfolio checks cover stack reversal, fan cover/title/frame links, all service anchors, room keyboard controls, project-scene selection and no-JavaScript fallback. Browser profiles are emulations, not physical devices.

Scoped delivery gate (preserved features retain the full rule report above):

- Hard gate PASS (R-02/03/17/18/23/24/25/26/27/28/32/33/34/35/36/37/38): client-supplied role and existing project records; no invented people, images or claims; no overflow in the filter/profile browser checks; accessible names, keyboard buttons and real routes verified; all projects remain available without JavaScript, with disabled filters and an explanatory message; production build and click-through checks passed.
- Purpose gate PASS (R-01/04/06/07/08/09/10/12/13/14/19/22): existing typography, palette, image treatments and motion retained; outlined category buttons indicate selection using aria-pressed and a visible active state; no extra decoration, dependencies, glass surfaces or scroll pins.
- Liveliness PASS: ENERGY 2 / RHYTHM 3 / MOTION 3 retained; supplied project photographs, gold active accents, architectural motifs and the established stack-to-spread motion remain; portrait and biography stay proportionate after the requested reduction.
- Craftsmanship and quality locks PASS (C-1 through C-5; R-05/11/15/16/20/21/29/30/31): one shared filter component, stable project keys and scoped animation cleanup; existing React/Next boundaries preserved; no unrelated redesign; type-safe Interiors/Exteriors records; project-specific credits remain accurate. New layout screenshots: `../output/website-review/co-founder-profile-desktop.png`, `project-filters-desktop.png`.

The existing folio/portfolio regression run finished with 33 passed, 7 intentional platform skips and no failures. After the final accessible-status copy correction, the production build and all three desktop filter/profile flows passed again.

The local production preview remains on port 3001. These changes and the preceding section-number removal remain uncommitted.

## Latest client revision: Mirpur hero, profile-only Discover and Let’s talk

The hero now uses existing Mirpur DOHS exports `01.webp`, `02.webp` and `03.webp` for the living, dining and bedroom scenes. Their captions and alternative text match the photographs; the existing scroll timeline and responsive fallbacks remain. Discover contains only Zarin's smaller profile, biography and studio enquiry link. The six retained projects, including Selim Residence, are available under All, Interiors and Exteriors on the homepage and Projects route. This preserves the work previously reachable through the personal profile.

Deleted the duplicate Contact page and removed its navigation entry. The footer invitation now opens `/book-consultation`, whose Let’s talk page retains the consultation form and adds studio email, telephone and address. A permanent 308 redirect keeps existing `/contact` links and bookmarks usable. Paid-consultation and email-draft status text remain accurate; no email was sent or booking made. Removed the unused personal-project presentation branch/styles and the remaining house illustration numbers; named dot controls retain their functions.

Validation: lint, TypeScript and the production build passed, with 17 generated pages and no Contact page. Stale generated route types were cleared after deleting that route and regenerated successfully. The production browser run had 59 passes, 9 intentional platform skips and 4 failures: all four failures were the same outdated test click on the removed Contact form's heading. The test now clicks the actual consultation heading; all four corrected dropdown checks passed separately. The verified flow includes desktop Chrome, iPhone WebKit, Android Chromium and full-motion desktop under the OS reduced-motion preference. These are emulations, not physical-device claims.

Click-through evidence: Mirpur preview loads and all three scene image paths/alternative texts match the project; Discover has no project collection; All shows six projects, Interiors shows five, and Exteriors shows Doctors Residence; its cover opens the correct detail route; returning to All restores the stack; six final fan cards open through their titles, frames and photographs; forward/reverse stack movement works; Selim remains reachable with its original project-specific authorship; Contact returns 308 then opens Let’s talk; the footer invitation reaches the same form; empty submission shows validation and completed submission prepares the correct reviewable email draft; keyboard dropdown selection, Tab/Escape and native no-JavaScript selection work; phone menus trap focus and navigate; the room gallery and process/footer controls remain functional. In-app inspection confirmed the Mirpur hero, simplified navigation and unnumbered house-layer selection, with no console errors.

Scoped delivery gate, preserving the full rule evidence above for unchanged features:

- Hard gate PASS (R-02/03/17/18/23/24/25/26/27/28/32/33/34/35/36/37/38): existing supplied images, project records and contact facts reused; no invented content or assets; browser checks found no overflow; Axe checks passed for profile, open enquiry dropdown and portfolio; semantic names, keyboard controls, validation and no-JavaScript fallbacks remain; build and click-through evidence recorded above.
- Purpose gate PASS (R-01/04/06/07/08/09/10/12/13/14/19/22): brand colours, typography, contextual arrows, image shading and the original spatial animation retained. Mirpur photographs reflect the client's selected project; duplicate routes and personal-project content removed; no new effects or pins.
- Liveliness PASS: ENERGY 2 / RHYTHM 3 / MOTION 3 retained, with real interior photographs, opposing hero typography, gold accents and a functioning six-project stack. Screenshot: `../output/website-review/mirpur-hero-desktop.png`.
- Craftsmanship and quality locks PASS (C-1 through C-5; R-05/11/15/16/20/21/29/30/31): one portfolio collection, one enquiry destination and a working legacy redirect; accurate scene labels; project-specific credits retained; stable scoped animation cleanup; server-rendered profile and native phone flow preserved; no unrelated redesign or dependency changes.

All pending revisions remain local and uncommitted. Production preview: port 3001.

## Doctors Residence: seven exterior views

The client explicitly replaced the earlier cover-only restriction with all seven supplied exterior images. Doctors Residence remains Exteriors. Its existing `uuu.jpg` export is reused; six native-resolution WebP additions cover `22.jpg`, `31d.jpg`, `ooooo.jpg`, `rr22.jpg`, `ss.jpg` and `tttTTTTTT.jpg`. Original files are untouched, and the portfolio asset manifest records each source/export pair. The gallery uses four existing paired/single scenes with descriptive exterior captions and named dot selectors. The portrait front elevation uses contain framing. Aerial and landscape views request more pixels to match their cropped panel height; image loading remains limited to nearby scenes.

Verification: lint, TypeScript and the production build passed. All 20 targeted gallery/portfolio checks passed across desktop Chrome, iPhone WebKit, Android Chromium and the full-motion preference profile. They verify seven distinct gallery assets with HTTP 200 responses, four scene selectors moving forward and backward, loaded images in every scene, the original cover, portrait contain framing, Exteriors filtering, project detail links and no-JavaScript portfolio navigation. After correcting undersized landscape image requests, the production build and all four Doctors Residence browser checks passed again. In-app inspection confirmed the facade/portrait scene and exterior labels without console errors. The large landscape panel changed from a 324px intrinsic height displayed at 603px to 720px displayed at 603px; the secondary panel changed from the equivalent small request to 432px for a 362px display height. This verifies sampling adequacy for that inspected viewport, not a universal hardware performance claim.

Scoped delivery gate, retaining the full rule report for unchanged features:

- Hard gate PASS (R-02/03/17/18/23/24/25/26/27/28/32/33/34/35/36/37/38): supplied assets and explicit seven-image authorisation used; actual rendering content informs captions; no invented project facts or people; tested assets/routes/controls work; accessible view labels and selected states remain; no new colours or external services; build and responsive browser evidence recorded above.
- Purpose gate PASS (R-01/04/06/07/08/09/10/12/13/14/19/22): existing palette, spatial gallery motion and photography hierarchy retained; contain framing preserves the elevation; larger exterior image requests avoid magnification blur; no new visual effects, pins or dependencies.
- Liveliness PASS: ENERGY 2 / RHYTHM 3 / MOTION 3 retained; street, facade, roof and garden views add real project-specific variety through the established paired-image choreography. Screenshot: `../output/website-review/doctors-exteriors-desktop.png`.
- Craftsmanship and quality locks PASS (C-1 through C-5; R-05/11/15/16/20/21/29/30/31): all seven original views represented once in the gallery; original cover preserved; source provenance and dimensions recorded; no artificial enlargement during export; typed optional framing and accurate exterior labels; no unrelated redesign. Existing originals and other project galleries remain intact.

The expanded project is available locally at `/projects/doctors-residence`. All pending revisions remain uncommitted.
