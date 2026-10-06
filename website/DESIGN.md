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

Fifteen of the newly supplied `Pics/` images are used across the homepage, room gallery, Selim project gallery, services and careers. The three hero scenes show an overview, timber detail and open stair. Exterior project imagery and the founder portrait stay connected to their source records. Asset provenance is recorded in `src/content/asset-manifest.json`; originals are preserved.

The opening room expands from an inset into a full-screen scene as the visitor scrolls. Directional wipes, image movement and changing scene titles lead through three views. A second desktop pin moves through large room images horizontally. Other sections use image reveals and small parallax movements. Motion is concentrated in these spatial sequences.

The UI/UX Pro Max guidance informed native scroll binding, limited pinning, responsive fallbacks, reduced-motion handling, stable dimensions and cleanup. Generic palette suggestions from the skill do not replace the client's approved colours.

Portrait phones use a shorter hero sequence and a swipeable room gallery. Short landscape screens use an ordinary hero. Reduced-motion users initially get a static presentation; the visible motion control allows an explicit choice, stored for this browser session. Disabling motion restores ordinary scrolling. No wheel or touch input is intercepted.

These transitions animate supplied renderings. A continuous 3D camera path would require sequential renders or a suitable model. Enquiries still prepare email drafts for visitors to review and send.

References: `../docs/website-reference-research.md`. Implementation: `../docs/homepage-scroll-animation.md`.
