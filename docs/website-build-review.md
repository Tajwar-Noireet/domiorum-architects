# Website build review — 6 October 2026

The first website uses the client's brand palette, horizontal logo, geometric type preference, headline, residential audience and requested page list. Reference-informed decisions are recorded in `website/DESIGN.md`.

## Content used

- Desktop homepage: three supplied interior renders, chosen for material consistency. Their exact project attribution remains pending; they have no invented location or client label. The phone hero uses the supplied Selim living-room render, selected for a better portrait composition.
- Project previews: Selim Residence, Abed Residence and Doctors' Residence, identified from the supplied founder portfolio. All are explicitly previous professional experience at Innova Architects, with Zarin's Associate Architect role and Ar Sanjida Shams's Project Architect credit.
- Founder portrait extracted from page 2 of the supplied portfolio.
- Asset provenance is recorded in `website/src/content/asset-manifest.json`. Fourteen optimized WebP copies total approximately 3.5 MB. Original client files remain untouched.

These previews establish the layout and content structure. They do not replace the client's eventual six-project selection. Final image mapping, naming, ownership and publication permissions must be confirmed before a public launch.

## Functional scope

Homepage scroll scenes, responsive navigation with keyboard dismissal, portfolio filters, project galleries and next-project navigation, services, contact and consultation email drafts, careers contact, privacy and a recoverable 404.

Forms have visible labels and native validation. Visitors prepare, review and send through their email app; they can copy the prepared text. This build has no submission backend, appointment calendar or payment flow, and does not claim to complete those actions.

The site is a client review build with search indexing disabled. Vercel deployment instructions are in `website/README.md`; no deployment has been performed as part of this build.

## Verification

- PASS: ESLint, TypeScript and the optimized production build.
- PASS: 20 browser checks against the production build across desktop, phone and reduced motion; seven project-specific cases are intentionally excluded from irrelevant device profiles.
- PASS: all ten public content routes return 200; unknown projects return a recoverable 404. Visible images load; no runtime errors or horizontal overflow in tested routes, including a 320-pixel phone layout.
- PASS: desktop scenes advance and release, animation cleanup survives route changes, and resizing removes the pin. Reduced-motion and phone layouts use ordinary scrolling.
- PASS: project filters, project navigation, phone menu with Escape/focus restoration, native form validation, draft contents and encoded mailto targets.
- Automated WCAG A/AA checks on the homepage (desktop and phone) and contact report zero violations. Image-overlay contrast remains a manual visual check because automated tools cannot determine gradient/image backgrounds; this is not a complete accessibility certification.
- PASS: production dependency audit reports zero vulnerabilities. The development-toolchain advisories below remain documented.

## Dependency note

Next.js 16.3.8, React 19.2.8, Tailwind 4 and GSAP 3.15.0. The production dependency audit is checked separately from development tooling. The installed Next.js ESLint toolchain reports five high-severity transitive advisories linked to braces' handling of deeply nested patterns. npm suggests downgrading Next's ESLint configuration to an older major release; that is not an appropriate automatic fix. This tooling does not process visitor input and is excluded from the production dependency audit. Recheck for a compatible upstream patch before release.

## Before launch

Confirm project selection and credits, remaining image-to-project mapping, final copy, contact recipient, consultation fee/duration/provider, publication permissions, domain and privacy terms for any added integrations. Configure Vercel with root `website`, then add domain-based metadata, sitemap and indexing only once launch approval is in place.
