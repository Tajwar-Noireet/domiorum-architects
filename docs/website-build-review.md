# Website build review — 6 October 2026

The revised website gives the client's midnight navy, warm ivory and gold palette a stronger presence across the homepage and inner-page headings. Fourteen selected interior images are used after removing all building imagery and the rejected blue-chair living-room view. A full-screen expanding hero, directional scene transitions, a horizontal desktop room gallery and section reveals provide the requested scroll experience. UI/UX Pro Max guidance informed the motion and responsive implementation.

## Content used

- The homepage uses living-room overview `11a.png`, timber/seating detail `6.png` and open stair `201.png` in the three-scene hero. Living/dining, private-room and kitchen views form the room gallery. Other supplied images support the introduction, services and careers.
- Selim Residence uses the warm bedroom as its cover, with dining, shared-space, study and kitchen views in its gallery. The rejected living-room view and every Abed/Doctors building image are excluded from website assets and the export script. The portfolio has one interior project, displayed at full width. Its return link leads back to the portfolio; removed building project URLs return the branded 404.
- The Selim project is explicitly previous professional experience at Innova Architects, with Zarin Nawar's Associate Architect role and Ar Sanjida Shams's Project Architect credit. The founder portrait comes from page 2 of the supplied portfolio.
- Asset provenance is recorded in `website/src/content/asset-manifest.json`. Fourteen interior WebP copies, the founder portrait and banner logo total 2,489,312 bytes, approximately 2.37 MiB. Original client files remain untouched.

The previews establish the layout and content structure. The client's eventual six-project selection still needs final image mapping and content. The anonymous homepage room sequence does not invent project locations or client names.

## Functional scope

Responsive navigation, an interior project template, galleries and portfolio return navigation, services, contact and consultation email drafts, careers contact, privacy and a recoverable 404 remain available.

Forms have visible labels and native validation. Visitors prepare, review and send through their email app, with a copy fallback. This build has no submission backend, appointment calendar or payment flow. Motion preference is stored only in browser session storage, documented in the privacy page.

The site remains a client review build with search indexing disabled. Vercel setup instructions are in `website/README.md`; this revision has not deployed the site.

## Verification

- PASS: ESLint, TypeScript validation within the optimized production build and production compilation.
- The preceding motion revision passed 25 browser checks. This image-removal revision passes eight targeted production checks across desktop, phone and reduced motion, covering every remaining route, image loading, exclusion of rejected imagery, portfolio navigation, removed project URLs, narrow layouts and visual composition. Four device-inapplicable cases are intentionally skipped.
- PASS: eight content routes return 200, unknown projects return a recoverable 404, visible images load, and no runtime errors or horizontal overflow occur in tested routes. Direct original-asset requests also return 200, preventing cached Next.js image transformations from hiding missing source files.
- PASS: all remaining local image/brand references resolve to real files. Generated asset copies preserve their source provenance.
- PASS: opening image expands, both directional transitions complete, hero releases, route navigation cleans up pins, and viewport changes recalculate the sequence. Gallery buttons reach the requested room, including early selections while measurements initialize.
- PASS: portrait phone motion, ordinary short-landscape scrolling, reduced-motion defaults, explicit motion controls and preference persistence. Phone menu Escape/focus restoration, native form validation, draft contents, encoded mailto targets and portfolio navigation pass.
- PASS: visual composition reviewed at 375×812, 768×1024, 1024×768, 1440×900 and 844×390. Screenshots of these views and three scroll scenes are in `output/website-review/`.
- Automated WCAG A/AA checks on the animated stair scene report zero violations. Image-overlay contrast was also reviewed visually. This is not a complete accessibility certification.
- PASS: production dependency audit reports zero vulnerabilities. The existing development-toolchain advisories below remain documented.

## Dependency note

Next.js 16.3.8, React 19.2.8, Tailwind 4 and GSAP 3.15.0. axe-core 4.14.0 is an explicit development dependency for browser verification. The production dependency audit is separate from development tooling. The previously checked Next.js ESLint toolchain reported five high-severity transitive advisories linked to braces' handling of deeply nested patterns. The suggested older-major downgrade is not an appropriate automatic fix. Recheck for a compatible upstream patch before release.

## Before launch

Complete the final project selection and credits, image mapping, approved copy, publication permissions, domain and any added integrations. Configure Vercel with root `website`, then add domain-based metadata, sitemap and indexing when the launch is approved. Sequential renderings or a suitable model would be needed for a continuous 3D camera path.
