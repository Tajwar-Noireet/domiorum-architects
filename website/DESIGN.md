# Domiorum website direction

A residential architecture and interiors practice in Dhaka, introduced through its spaces, founder and direct enquiries.

The latest completed questionnaire, page 2, specifies midnight navy and warm ivory as primary colours, with warm gold as the accent. The supplied horizontal banner logo and the headline “Imagined with you. Built for you.” remain the basis of the design.

## Brand and composition

The supplied four-second `public/brand/brand-reveal.mp4` opens the first visit in a tab session. Its gold mark is the focal point on a canvas matching the video navy. Portrait framing enlarges the logo without clipping the wordmark; softened video edges conceal letterbox colour differences. The existing FlowButton provides Skip intro, and Escape also dismisses the reveal. A short fade opens the underlying page without changing its scroll geometry. Repeat visits avoid downloading the video. The client explicitly requests the intro and full motion under every device preference. Startup, playback and pre-hydration timeouts fail open; the server-rendered website stays usable without JavaScript.

- Midnight navy `#08182E`: opening hero, room gallery, services, shared page headings and footer.
- Warm ivory `#F6F3ED`: reading surfaces and text on navy.
- Warm gold `#E1BF77`: headline emphasis, section labels, links and progress indicators on navy. Graphite `#29313A` supports body text on ivory.
- Jost provides the geometric sans-serif proportions requested by the client. Typography scales with the viewport; navigation and controls retain readable sizes.
- Large images, asymmetric placement and generous spacing draw on the inspected DSGN Interior reference. Project facts, reasoning and credits use one consistent template.
- The homepage alternates navy and ivory sections. The founder's profile lives on Discover us, where current studio projects and previous projects have separate credits. Previous employer names are omitted following the client's latest direction.

## Images and movement

Fourteen of the newly supplied `Pics/` images are used across the homepage, room gallery, Selim project gallery, services and careers. The three hero scenes show an overview, timber detail and open stair. Building imagery and the rejected living-room view are excluded. The remaining Selim project and founder portrait retain their source records. Asset provenance is recorded in `src/content/asset-manifest.json`; originals are preserved.

The opening uses a full-screen interior photograph with the approved headline spread across two opposing lines on desktop, stacked on phones. The photographic composition draws on the live DSGN Interior reference. Scrolling moves from the opening typography into the room scenes. Directional wipes, image movement and changing scene titles lead through three views. A second desktop pin moves through large room images horizontally. Other sections use image reveals and small parallax movements. Motion is concentrated in these spatial sequences.

The UI/UX Pro Max guidance informed native scroll binding, limited pinning, responsive fallbacks, reduced-motion handling, stable dimensions and cleanup. Generic palette suggestions from the skill do not replace the client's approved colours.

Portrait phones use a shorter hero sequence and a swipeable room gallery. Short landscape screens use an ordinary hero. Motion runs automatically with no on/off controls or saved pause preference; the client explicitly chose full motion regardless of device reduced-motion settings. Lenis eases desktop wheel input through the shared GSAP ticker; touch inertia remains native.

These transitions animate supplied renderings. A continuous 3D camera path would require sequential renders or a suitable model. Enquiries still prepare email drafts for visitors to review and send.

References: `../docs/website-reference-research.md`. Implementation: `../docs/homepage-scroll-animation.md`.

## Flow buttons

The main CTAs use an independent recreation of Kain Xu's public FlowButton preview (https://21st.dev/@xubohuah/components/flow-button): rounded outline, expanding fill, outgoing right arrow and incoming left arrow, with a shifting label. Navy on ivory and gold on navy follow the approved palette. The shared link and native button variants preserve navigation and form semantics. Keyboard focus receives the same visual state; transitions remain enabled under every device preference. Navigation links and utility controls retain their existing styles. Component source was account-locked, so no source code was copied.

Button hover and keyboard focus now add a 3px lift alongside the fill and arrow exchange. Button transitions remain available when homepage scroll animation is disabled; the client-selected full-motion policy keeps transitions and lift enabled.

## Framer Motion text interactions

Framer Motion is installed for hover interactions. Shared HoverText spans give headings a 3px lift and a small spring scale, and key inline links a 4px shift. Text content and semantic heading/link elements stay intact. The inner spans keep hover transforms separate from GSAP's outer scroll reveals. Movement follows the client-selected full-motion policy. Touch hover is handled by Motion's gesture recognition rather than CSS sticky hover.

The homepage services section includes an original SVG exploded axonometric house, inspired by the supplied services reference. Interior furniture, structural frames and roof rafters, adaptable extensions, and technical grids correspond to the four services. Service hover/focus and labelled touch controls highlight each layer. Framer Motion keeps the service-layer motion enabled under every device preference. This is a conceptual illustration, not a project construction drawing.

Original 48px SVG drafting cursors: a set square with pencil for browsing and a brass compass for links and controls. Native CSS cursors use precise tool-tip hotspots with browser fallbacks. Applied only to fine hover pointers; editable fields and disabled controls retain native cursors. Forced-colors mode uses native pointers. No pointer-following JavaScript or cursor trails.

Cursor revision: reference-guided transparent brass compass and articulated tool-hand assets replace the simplified vector icons. Source PNGs are preserved alongside self-contained 64px SVG cursor wrappers. Click hotspots are the compass needle (46,62) and hand crosshair centre (17,10). Generated with the built-in image tool from the client-supplied cursor sheet; artwork closely follows the reference, with small generated detail differences.

## Competitor-informed refinements

The Shibori review is recorded in `../docs/shibori-competitor-review.md`. Services explain suitability and the scope to agree; five homeowner questions use native keyboard-accessible disclosures. Optional project area and timing are included in the reviewable email draft. No stock photographs, invented clients or numerical claims were added.

## Folder-based project showcase

The supplied Elyse Residence reference replaces the single residence feature with a five-project showcase on the homepage and portfolio page. Large serif project titles and three staggered images follow that reference, using the site's navy, ivory and gold palette throughout. Each folder has a project selector and a dedicated route. Four interior galleries use 39 curated images; Doctors Residence uses one exterior cover only, as explicitly requested. Framer Motion provides project transitions plus scroll-linked image parallax, zoom and title drift, with full motion under every device preference. Native touch scrolling remains intact. Original assets are preserved and exports are recorded in `src/content/portfolio-assets.json`. Further design and source details: `../docs/project-showcase.md`.

The latest 8 October revision follows the live Shibori service gallery: project photographs rise into a central desktop stack, shrink behind the next card, then spread horizontally into five clickable covers. A native CSS sticky viewport and one scoped GSAP timeline follow scroll position directly; transform and opacity changes replace delayed scrub and animated clip-path reveals in this section. Card elevation clarifies stacking order, while gold project labels and progress mark the current chapter. Desktop index links seek the selected card. Phones, very short desktop screens and no-JavaScript views keep large alternating covers and smaller interior details in ordinary page flow, with native index anchors. Static SSR, automatic full motion and cleanup retain access to every project. No extra GSAP pins are introduced. Lenis and ScrollTrigger share a ticker for desktop wheel smoothing. Desktop image requests match the card dimensions. The site's navy, ivory and gold palette stays intact.

The live Elyse reference informed the detail-page scroll sequence: the cover aperture expands, then room images appear in overlapping pairs inside a native sticky viewport. Horizontal-strip masks reveal the next large image while the smaller image drifts and its room title rises through a mask. These transitions let each supplied image pair hold the visitor's attention. Navy, ivory and gold retain the studio's identity. All source images stay in the gallery; Doctors Residence remains an exterior cover only. Without JavaScript, all scenes render in ordinary page flow. Motion is enabled automatically without on/off controls and stays active under every device preference. Native touch inertia is retained.

## Homepage typography and photographs

The Wiemer and Eladio Dieste references inform masked heading lines, opposing hero title drift, progressive paragraph colour and photo frames that open while their images ease out of a closer crop. These effects sit in the existing hero, introduction, selected-project heading, studio and process heading. Paragraph words remain readable in the muted brand colour before reaching graphite. Supplied photographs and semantic text stay intact. Static server-rendered content remains visible before animation loads. Live device reduced-motion changes preserve the active choreography, following the client’s explicit full-motion choice. The existing hero and room-gallery pins retain their travel and responsive behavior; these additions create no extra pins.

## GSAP and Lenis revision, 8 October 2026

One root Lenis instance (lerp 0.16, native touch inertia) uses GSAP’s ticker. Scrubbed sequences use scrub true rather than a second easing layer. Route restoration, loading and menu locks, nested controls and component-owned chapter seeks retain their own behavior. Same-page anchors calculate targets from the actual browser position, avoiding stale Lenis positions after native touch or focus scrolling. Large project covers remain stacked on laptop windows at least 900px wide and 560px high. Each cover zooms as it enters; the final spread completes before the sticky region releases. The project gallery decouples Framer Motion’s native ScrollTimeline from custom out-of-range mappings to avoid invalid keyframe offsets.

## Glass surfaces, 9 October 2026

The client requested glassmorphism on the project folder animations and applicable surfaces. Frosted navy frames with fine ivory highlights and warm gold borders express the layering of the project stack; photography stays sharp. Only the current desktop card applies backdrop blur, while the inactive cards and final spread use solid tinted frames. Small floating project thumbnails receive the same treatment in ordinary page flow. Floating mobile navigation and form option panels use highly opaque navy or ivory glass to separate controls from underlying content. Reading sections and image galleries retain their existing surfaces. Solid fallbacks cover unsupported backdrop filters, reduced-transparency preferences and forced colors. These are surface changes; card dimensions, button spacing, GSAP timelines and Lenis scrolling remain intact.
