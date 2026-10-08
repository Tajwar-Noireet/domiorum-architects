---
name: gsap-motion
description: Build or repair GSAP and ScrollTrigger animation in the Domiorum Next.js portfolio, including image stacks, editorial reveals and pinned sequences. Use for scroll choreography or lifecycle bugs; use existing CSS and Framer Motion for simple hover interactions.
---

# GSAP motion

Use the installed `gsap` package and register ScrollTrigger in client code. Primary sources: https://github.com/greensock/gsap and https://gsap.com/docs/v3/Plugins/ScrollTrigger/ . Check installed types before adopting new APIs.

Read website/DESIGN.md and the target component before changing choreography. Preserve navy, ivory, gold, real project photography and accessible links. Doctors Residence has only its approved exterior cover. Avoid hiding meaningful content until it has a reliable animation owner.

Scope timelines with gsap.context or gsap.matchMedia and revert on unmount and breakpoint changes. Async imports need a disposed guard. Never kill all page triggers from one component. Keep JSX state updates to chapter changes; transforms and opacity should update outside React.

The root SmoothScroll component owns the ticker and Lenis instance. Use scrub: true for scroll-synchronized scenes; adding numeric scrub or a spring adds a second layer of lag. Use native sticky for project stacks. Reserve explicit travel for the existing pinned hero and room sequence, then refresh after fonts, layout changes and loading-screen release. Do not transform a sticky ancestor.

Animate large cover transitions and modest image scale rather than tiny card decorations. Provide ordinary page flow on phone/landscape layouts where a stack cannot fit, and without JavaScript. The client explicitly chose full motion regardless of operating-system reduced-motion settings; keep animation enabled for both preferences. A short laptop viewport is not a reason to disable the stack if its controls and photograph still fit.

Use scrollToPosition from website/src/lib/smooth-scroll.ts for chapter controls. Verify forward/reverse wheel movement, chapter selection, fan links, route changes, phone touch scrolling and live reduced-motion changes using real browser behavior. Existing Playwright tests and smooth-scroll.spec.ts cover these flows. Run lint, TypeScript, build and relevant browser profiles.
