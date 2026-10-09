---
name: lenis-scroll
description: Integrate or troubleshoot Lenis smooth scrolling with Next.js routes, GSAP ScrollTrigger, loading overlays and nested controls. Use when scroll feels delayed, stalls, loses anchors or retains inertia after navigation; do not replace native touch behavior unnecessarily.
---

# Lenis scrolling

Primary source: https://github.com/darkroomengineering/lenis . The installed README and types in website/node_modules/lenis describe the exact version. Import lenis/dist/lenis.css in the root layout.

Maintain one root instance in SmoothScroll. With autoRaf false, feed lenis.raf(seconds * 1000) from GSAP's ticker and synchronize its scroll event with ScrollTrigger.update. Disable GSAP lag smoothing; unregister both callbacks and destroy Lenis on cleanup. Do not add a separate RAF loop or install an older @studio-freight package.

Use modest interpolation (the project uses lerp 0.16), no wheel amplification, and syncTouch false to retain native iOS/Android inertia. The client explicitly chose full motion for every device preference: set respectReducedMotion false and keep motion enabled when the OS requests reduced motion. Keep CSS/native no-JavaScript fallbacks.

Stop the instance while the supplied brand intro or mobile navigation is open. Observe the relevant attributes rather than polling; resume, resize and refresh when released. Only independently scrollable controls, such as dropdown lists, use data-lenis-prevent. The desktop interior gallery moves through GSAP from vertical page scrolling: do not prevent wheel input on its viewport or photos. Preserve native horizontal touch scrolling on phones.

Use anchors false and a document anchor listener that checks event.defaultPrevented before handling same-page links with the fixed-header offset. This preserves component-owned chapter navigation. Enable stopInertiaOnNavigate. Preserve Next's browser scroll restoration, synchronizing Lenis to the restored scrollY after route commit. Use scrollToPosition for exact chapter seeks so a pending smooth wheel frame cannot undo a selection.

Check startup video failure and dismissal, hash anchors, keyboard controls, dropdown scrolling, forward/back navigation, repeated route visits and live reduced motion. Compare actual wheel movement and scroll-driven image transforms; a lenis CSS class alone does not prove visible motion. Preserve normal page access if JavaScript is unavailable.
