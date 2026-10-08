# Homepage scroll animation

Client reference, reviewed 5 October 2026: https://www.youtube.com/shorts/pZDguVNu-C0
Title: I Built a 3D Real Estate Website Using Claude AI — @codingwithmoji.

## Reference and adaptation

The clip shows an elevated house overview, closer facade/interior views and a terrace/pool view, with headings changing alongside the scene. The clip establishes the visual result; it does not establish whether the original uses WebGL, pre-rendered frames, video or scroll binding.

The 6 October revision uses the supplied interior renderings to create a sequence of spatial views. The inset living room expands to full screen, a horizontal wipe reveals timber and cabinetry, and a vertical wipe introduces the open stair. Image scale and position change with the scene. The opening headline exits and short scene titles appear. The header belongs to the opening layout and scrolls away; bottom motion and exploration controls remain available during the sequence.

## Components

- `website/src/components/home/HomeMotion.tsx`: motion preference, session storage and shared section reveals. Server-rendered page sections are passed through this small client boundary.
- `website/src/components/home/ScrollHero.tsx`: three scenes, pinned scrubbed GSAP timeline, directional image masks, changing captions and progress. Desktop travel is 2.2 viewport heights; portrait phone travel is 1.5 viewport heights. The section then releases into the introduction.
- `website/src/components/home/InteriorGallery.tsx`: second desktop pin translates the three room views horizontally. Room buttons move to the relevant position. Phone and static layouts use native horizontal scrolling and the same buttons.
- `website/src/styles/experience.css`: reserved visual dimensions, responsive composition and initial static states.

GSAP ScrollTrigger binds motion to native scroll: https://gsap.com/docs/v3/Plugins/ScrollTrigger/. At most two sections are pinned on desktop, one on portrait phones and none on short phone landscape screens. Scoped layout-effect cleanup restores the DOM before route removal. Font loading and viewport changes refresh measurements. Pending gallery selections are resolved after initial measurements.

## Accessibility and verification

The operating system's reduced-motion setting is respected by default. Visitors can enable or disable motion using the visible control; their explicit choice lasts for the browser session. Disabled motion restores ordinary scrolling, visible content and a native room gallery. There are no wheel or touch interception handlers.

Browser checks cover expansion, both scene transitions, release, navigation cleanup, resizing, motion preferences, preference persistence and room-button destinations. Visual checks cover phone, tablet, desktop and landscape widths. Screenshots of three scroll positions are saved under `output/website-review/`.

This is an animated sequence of supplied renderings. A continuous 3D camera path needs suitable sequential frames or an optimized model.


## 6 October: photographic hero and stable scroll layout

The opening is now full-screen interior imagery with offset headline lines, using the approved brand palette. The opening dissolves into the existing image wipes and detail scenes. No 21st component code was imported; the researched perspective-card component was unsuitable for the chosen composition.

The hero and desktop gallery each reserve their own scroll height in outer wrappers. GSAP pins use pinSpacing: false, and refresh initialization updates the reserved height for the viewport and gallery track. This prevents downstream offsets from collapsing while generated pin spacers are temporarily reverted. Match-media cleanup restores ordinary wrapper height when motion is disabled or the gallery switches to mobile. Regression checks cover initial loading, reload, responsive resizing and motion re-enabling; the affected gallery was also verified in the in-app browser.

## 8 October: Wiemer and Eladio Dieste references

Reviewed https://www.wiemer.store/ and https://www.eladiodieste.com/. Wiemer uses large masked headings and photographic zoom; Dieste combines opposing oversized title movement with progressive word reveals and layered images. The homepage adapts these patterns with the existing GSAP dependency and supplied assets.

- The opening headline lines drift in opposite directions during the existing exit, with smaller travel on phones.
- Introduction, selected-project, studio and process headings rise through individual line masks as they enter the viewport.
- Introduction and studio paragraphs move word by word from the readable muted token to graphite.
- Introduction photographs and the founder portrait expand through inset masks while their image crop eases from 1.22 to 1.04 scale.

`ScrollTypography.tsx` renders the complete text on the server, preserving heading semantics and whitespace. `HomeMotion.tsx` owns the new scroll timelines and restores original title styles during cleanup. Initial title offsets use a scoped set followed by a tween, so hero pin refreshes cannot rewind the title into an unmasked state on phones. Hover transforms remain on separate inner spans. No additional pins, input interception or copied external assets are introduced.

Regression coverage in `editorial-motion.spec.ts` and `hero-title-motion.spec.ts` checks native scroll progression, image scale, readable words, narrow and landscape layouts, reduced-motion defaults, explicit opt-in, disabling, and route cleanup. The website and portfolio regression suite also covers project navigation, image loading, forms and the existing room-gallery controls.
