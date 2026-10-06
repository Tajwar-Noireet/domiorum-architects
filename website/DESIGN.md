# Domiorum website direction

Design read: a Dhaka architecture and interiors practice; an editorial portfolio shaped around residential spaces, the founder and direct enquiries.

The client supplied the navy/ivory/gold palette, horizontal banner logo, geometric typography preference and the headline “Imagined with you. Built for you.” The client supplied the architecture references, direct competitors and scroll-animation reference. This document records their direction and the implementation choices based on it.

- Navy `#08182E`, ivory `#F6F3ED`, gold `#E1BF77`, graphite `#29313A`.
- Jost: a geometric sans-serif with proportions suited to the supplied wordmark and Century Gothic preference. Font files are served by Next.js after the build.
- Large full-screen images and two-line type draw on the inspected DSGN Interior reference.
- Asymmetric project image proportions and offset placement give the portfolio an editorial rhythm.
- Shared project templates expose location, area, design reasoning and credits, informed by local architecture reference research.
- GSAP ties three selected interior views to native desktop scrolling. Subtle scale changes and crossfades interpret the supplied video with available renders. These are image transitions, not an interactive 3D model or a continuous camera reconstruction.
- Phone layouts and reduced-motion users have an ordinary static hero. There is no scroll hijacking, loading screen or decorative cursor.
- The new studio's founder is introduced separately from her previous professional work.
- Enquiries prepare an email for review; no unconnected submission, booking or payment success state.

Working dials: ENERGY 2 / RHYTHM 3 / MOTION 2. Typography and image scale provide energy; project proportions and section composition provide rhythm; movement is concentrated in the homepage hero.

References and observations: `../docs/website-reference-research.md`. Motion rationale: `../docs/homepage-scroll-animation.md`.
