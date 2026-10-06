# Domiorum website direction

A residential architecture and interiors practice in Dhaka, introduced through its spaces, founder and direct enquiries.

The latest completed questionnaire, page 2, specifies midnight navy and warm ivory as primary colours, with warm gold as the accent. The supplied horizontal banner logo and the headline “Imagined with you. Built for you.” remain the basis of the design.

## Brand and composition

- Midnight navy `#08182E`: opening hero, room gallery, services, shared page headings and footer.
- Warm ivory `#F6F3ED`: reading surfaces and text on navy.
- Warm gold `#E1BF77`: headline emphasis, section labels, links and progress indicators on navy. Graphite `#29313A` supports body text on ivory.
- Jost provides the geometric sans-serif proportions requested by the client. Typography scales with the viewport; navigation and controls retain readable sizes.
- Large images, asymmetric placement and generous spacing draw on the inspected DSGN Interior reference. Project facts, reasoning and credits use one consistent template.
- The homepage alternates navy and ivory sections. The new practice's founder is introduced separately from her previous professional experience.

## Images and movement

Fourteen of the newly supplied `Pics/` images are used across the homepage, room gallery, Selim project gallery, services and careers. The three hero scenes show an overview, timber detail and open stair. Building imagery and the rejected living-room view are excluded. The remaining Selim project and founder portrait retain their source records. Asset provenance is recorded in `src/content/asset-manifest.json`; originals are preserved.

The opening uses a full-screen interior photograph with the approved headline spread across two opposing lines on desktop, stacked on phones. The photographic composition draws on the live DSGN Interior reference. Scrolling moves from the opening typography into the room scenes. Directional wipes, image movement and changing scene titles lead through three views. A second desktop pin moves through large room images horizontally. Other sections use image reveals and small parallax movements. Motion is concentrated in these spatial sequences.

The UI/UX Pro Max guidance informed native scroll binding, limited pinning, responsive fallbacks, reduced-motion handling, stable dimensions and cleanup. Generic palette suggestions from the skill do not replace the client's approved colours.

Portrait phones use a shorter hero sequence and a swipeable room gallery. Short landscape screens use an ordinary hero. Reduced-motion users initially get a static presentation; the visible motion control allows an explicit choice, stored for this browser session. Disabling motion restores ordinary scrolling. No wheel or touch input is intercepted.

These transitions animate supplied renderings. A continuous 3D camera path would require sequential renders or a suitable model. Enquiries still prepare email drafts for visitors to review and send.

References: `../docs/website-reference-research.md`. Implementation: `../docs/homepage-scroll-animation.md`.


## Flow buttons

The main CTAs use an independent recreation of Kain Xu's public FlowButton preview (https://21st.dev/@xubohuah/components/flow-button): rounded outline, expanding fill, outgoing right arrow and incoming left arrow, with a shifting label. Navy on ivory and gold on navy follow the approved palette. The shared link and native button variants preserve navigation and form semantics. Keyboard focus receives the same visual state; reduced-motion preferences and the homepage motion-off setting remove transitions. Navigation links and utility controls retain their existing styles. Component source was account-locked, so no source code was copied.


## Framer Motion text interactions

Framer Motion is installed for hover interactions. Shared HoverText spans give headings a 3px lift and a small spring scale, and key inline links a 4px shift. Text content and semantic heading/link elements stay intact. The inner spans keep hover transforms separate from GSAP's outer scroll reveals. Reduced-motion preferences suppress movement; the homepage's motion-off setting also disables these effects. Touch hover is handled by Motion's gesture recognition rather than CSS sticky hover.

The homepage services section includes an original SVG exploded axonometric house, inspired by the supplied services reference. Interior furniture, structural frames and roof rafters, adaptable extensions, and technical grids correspond to the four services. Service hover/focus and labelled touch controls highlight each layer. Framer Motion respects reduced-motion preferences and the homepage motion setting. This is a conceptual illustration, not a project construction drawing.

Original 48px SVG drafting cursors: a set square with pencil for browsing and a brass compass for links and controls. Native CSS cursors use precise tool-tip hotspots with browser fallbacks. Applied only to fine hover pointers; editable fields and disabled controls retain native cursors. Forced-colors mode uses native pointers. No pointer-following JavaScript or cursor trails.

Cursor revision: reference-guided transparent brass compass and articulated tool-hand assets replace the simplified vector icons. Source PNGs are preserved alongside self-contained 64px SVG cursor wrappers. Click hotspots are the compass needle (46,62) and hand crosshair centre (17,10). Generated with the built-in image tool from the client-supplied cursor sheet; artwork closely follows the reference, with small generated detail differences.
