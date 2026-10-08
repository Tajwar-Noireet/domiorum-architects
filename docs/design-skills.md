# Project design and motion skills

The project retains 21st-cli-use, 21st-ui-build, 21st-ui-review, antislop, antislop-ui, antislop-copywriting, antislop-human and antislop-layoutmobile.

Added gsap-motion and lenis-scroll as project-local skills grounded in the official GSAP and Lenis documentation. These repositories provide animation libraries, rather than ready-made Codex skills. GSAP was already installed; Lenis 1.3.26 was added to the website. Sources and retained folders are recorded in `.agents/skill-sources.json`.

Removed unused project-local 21st-ai, 21st-design-sync, 21st-registry, 21st-ui-explore and antislop-code. Global skills and shared plugins remain available to other projects.

The client explicitly chose full motion regardless of device reduced-motion settings on 8 October 2026. The website keeps keyboard navigation, intro dismissal, native touch inertia and no-JavaScript page access.

The animation audit found that the previous commit removed the motion toggle rather than the animation timelines. Reduced-motion detection disabled those timelines in the in-app browser, and a 700px minimum height excluded many laptop windows. The update removes that preference gate, lowers the stack threshold to 560px, enlarges project covers and shares one Lenis/GSAP ticker to avoid compounded smoothing.

Cleanup removed approximately 611 MiB of obsolete build cache, old browser reports and unused project-local skills. Build and test caches can be regenerated. The two unused components FeaturedResidence and ProjectBrowser and their orphaned CSS were removed. Original photographs, project folders, portfolio PDF and source records were preserved. Details are in `docs/motion-cleanup.json`.
