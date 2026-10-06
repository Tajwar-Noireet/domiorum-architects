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
