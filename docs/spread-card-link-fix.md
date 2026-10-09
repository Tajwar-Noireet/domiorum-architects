# Spread-card navigation repair, 9 October 2026

The expanded project collection previously linked only the cover image area. Clicking its project title or glass frame did nothing; transparent decorative thumbnails could also cover part of a photograph's hit area.

Each card now has a native Next.js link covering its full surface while the collection is spread out. The image-only link becomes inert and hidden from accessibility APIs in that state, leaving one project navigation target per card. Normal stacked and mobile views retain their original cover links and CTAs. Decorative thumbnails no longer intercept pointer events. An inset gold outline marks full-card hover and keyboard focus without changing GSAP transforms or the glass treatment.

The new browser regression failed against the previous build when clicking the first card's title. After the fix, all five projects opened correctly from tested title, frame and photo positions on both the homepage and portfolio route, under both desktop motion preferences. The complete focused run passed 28 checks, with 20 skips for browser profiles where a desktop spread or hover does not apply. Existing project galleries, forward/reverse stacks, final spreads, no-JavaScript navigation, mobile index links, button spacing, hover, startup locks and gallery wheel scrolling also passed. Lint, TypeScript and production build passed.

Manual browser verification confirmed Tab focuses the full Mirpur DOHS card and Enter opens its detail page. Screenshot: `output/website-review/spread-card-links.jpg`.

Scoped design gate:

- Hard gate PASS: native links navigate to the existing projects; keyboard focus and Enter were verified. No content, assets, claims or external submission behavior were added.
- Purpose gate PASS: the full-card target matches the visual card boundary and the client's click expectation. The gold outline identifies hover/focus.
- Liveliness PASS: the existing navy, ivory and gold direction, photographic content, glass frames and scroll choreography remain intact.
- Craftsmanship PASS: actual clicks across all five project cards and both routes passed, alongside the existing portfolio and scrolling checks.

Local preview: http://127.0.0.1:3001/projects. Phone coverage uses browser emulation rather than physical devices.
