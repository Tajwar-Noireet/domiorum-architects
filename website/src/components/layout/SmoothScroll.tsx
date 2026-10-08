"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setScrollEngine } from "@/lib/smooth-scroll";

export function SmoothScroll() {
  const pathname = usePathname();
  const engine = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.16,
      smoothWheel: true,
      syncTouch: false,
      anchors: false,
      respectReducedMotion: false,
      stopInertiaOnNavigate: true,
      prevent: (node) => node.hasAttribute("data-lenis-prevent"),
    });
    engine.current = lenis;
    setScrollEngine(lenis);
    const anchorClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href]")
          : null;
      if (!link || link.target || link.hasAttribute("download")) return;
      const url = new URL(link.href);
      if (
        url.origin !== location.origin ||
        url.pathname !== location.pathname ||
        !url.hash
      )
        return;
      let target: HTMLElement | null;
      try {
        target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      } catch {
        return;
      }
      if (!target) return;
      event.preventDefault();
      history.pushState(history.state, "", url.hash);
      // Native touch and focus scrolling can lead Lenis by one frame.
      const top = target.getBoundingClientRect().top + window.scrollY - 100;
      lenis.scrollTo(top, {
        onComplete: () => {
          if (target.hasAttribute("tabindex"))
            target.focus({ preventScroll: true });
        },
      });
    };
    document.addEventListener("click", anchorClick);
    const tick = (seconds: number) => lenis.raf(seconds * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const root = document.documentElement;
    const header = document.querySelector(".site-header");
    const syncLock = () => {
      const locked =
        root.hasAttribute("data-brand-intro") ||
        header?.querySelector('.menu-trigger[aria-expanded="true"]');
      if (locked) lenis.stop();
      else if (lenis.isStopped) {
        lenis.start();
        lenis.resize();
        ScrollTrigger.refresh();
      }
    };
    const observer = new MutationObserver(syncLock);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-brand-intro"],
    });
    if (header)
      observer.observe(header, {
        attributes: true,
        subtree: true,
        attributeFilter: ["aria-expanded"],
      });
    syncLock();

    return () => {
      observer.disconnect();
      document.removeEventListener("click", anchorClick);
      gsap.ticker.remove(tick);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      engine.current = null;
      setScrollEngine(undefined);
    };
  }, []);

  useEffect(() => {
    // Let Next finish its route scroll restoration before clearing wheel inertia.
    const frame = requestAnimationFrame(() => {
      const lenis = engine.current;
      lenis?.resize();
      lenis?.scrollTo(window.scrollY, { immediate: true });
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
