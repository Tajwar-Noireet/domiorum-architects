# Homepage scroll animation direction

Client reference, reviewed 5 October 2026: https://www.youtube.com/shorts/pZDguVNu-C0
Title: I Built a 3D Real Estate Website Using Claude AI — @codingwithmoji.

## Observed sequence

The clip shows an elevated exterior house overview, closer facade/interior views, a terrace/pool view, and an elevated overview again. Headings change with the scene; the top navigation remains present. A glowing path/line is visible in several frames. The clip demonstrates the visual result; it does not establish whether the original uses WebGL, pre-rendered frames, video, or actual scroll binding.

## Domiorum adaptation

Use one prominent scroll-controlled hero sequence. Pin its visual while normal page scrolling advances a short narrative: an overview, a closer spatial view, then a material/detail view. Synchronize short heading changes with the scene. Release the section into the ivory selected-projects area. Preserve the horizontal logo and visible navigation/consultation access.

Choose GSAP ScrollTrigger for pinning and a scrubbed timeline. Scope animations to a small client component and clean up on unmount. Keep the rest of the Next.js application server-rendered where appropriate. Official reference: https://gsap.com/docs/v3/Plugins/ScrollTrigger/.

Initial framework: use clearly labeled placeholders and modest image scale/position changes with crossfades. Do not represent static-photo crossfades as a true 3D walkthrough. The final cinematic treatment needs either approved sequential renders/frames from a single project, or a suitable optimized 3D model. Select the asset method after reviewing client materials; do not add Three.js merely to imitate the video's title.

## Accessibility and performance

Keep ordinary scrolling and navigable links; do not intercept wheel or touch input. Provide a static hero for reduced-motion users. Use a shorter/simpler mobile sequence, reserve visual dimensions, optimize and preload only essential assets, and avoid allocating a large frame sequence before it is needed. The content must remain readable when animation or assets are unavailable. Test forward/reverse scroll, touch, resize, reduced motion, slow loading, and transition into the project section.

Implemented 6 October 2026 in `website/src/components/home/ScrollHero.tsx`. Three supplied interior visualizations move from space to detail to balance. Desktop native scroll controls crossfades, subtle image scale and captions; the main client headline stays fixed. The hero releases after 1.5 viewport heights of scroll. Small screens and reduced-motion users have a static scene. Browser tests verify scene transitions, release, route cleanup and resizing. A true 3D camera path still requires suitable sequential renders or a model.
