# Motion update, 8 October 2026

Implemented a root Lenis scroll engine synchronized with the existing GSAP ticker. Full motion stays enabled under every OS preference, as explicitly requested. The brand video plays once per tab session with Skip intro, Escape, playback-error and hydration timeout fallbacks.

Desktop project covers now use large landscape cards. The stack remains enabled in windows at least 900px wide and 560px high; covers zoom into place and finish their horizontal spread before the sticky region releases. Phones and smaller windows use image zoom and title reveals in normal page flow. The detail gallery retains the Elyse-inspired image wipes, paired imagery and masked titles. Native touch inertia, keyboard chapter selection and no-JavaScript access are retained.

Fixed invalid native ScrollTimeline offsets, anchor interception, stale mobile anchor positions, hover motion outside the homepage and overlapping cards in the final spread. Animation effects are scoped and reverted on unmount; React state updates only when a chapter changes.

Validation: the complete 220-case browser run initially passed 168 cases, skipped 43 cases that do not apply to their browser profile, and exposed nine failures. All nine passed after repairs. A final focused rerun passed 87 applicable motion and interaction checks across Chrome desktop, mobile WebKit, Android Chromium and a desktop reduced-motion profile, with 21 profile-specific skips. Lint, TypeScript and production build passed. These are browser/device emulations rather than physical phone tests.

Cleanup: project-local 21st-ai, 21st-design-sync, 21st-registry, 21st-ui-explore and antislop-code were removed. Added project-local gsap-motion and lenis-scroll skills grounded in official library documentation. Removed unused FeaturedResidence and ProjectBrowser components, orphaned CSS and approximately 611 MiB of obsolete cache and reports. Original project assets and shared global skills were preserved. Exact cleanup sizes are recorded in motion-cleanup.json.

The result is available locally on http://127.0.0.1:3001/. Production deployment status must be verified separately from the GitHub push.
