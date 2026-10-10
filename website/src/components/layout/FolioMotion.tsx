"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scheduleScrollRefresh } from "@/lib/scroll-refresh";

const interactive = "a, button, input, select, textarea, summary, [tabindex]";

function revealTargets(element: HTMLElement): HTMLElement[] {
  if (element.matches(interactive)) return [];
  if (!element.querySelector(interactive)) return [element];
  // Moving a control's ancestor can carry it away from a hovering pointer.
  return Array.from(element.children).flatMap((child) =>
    child instanceof HTMLElement ? revealTargets(child) : [],
  );
}

/** Motion for ordinary page content. The hero and project scenes own their timelines. */
export function FolioMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const shell = document.getElementById("site-shell");
    if (!shell) return;
    gsap.registerPlugin(ScrollTrigger);
    let context: gsap.Context | undefined;
    let observer: IntersectionObserver | undefined;
    let started = false;
    let disposed = false;
    const arrivals = new Map<HTMLElement, gsap.core.Tween>();

    function start() {
      if (started || document.documentElement.hasAttribute("data-brand-intro"))
        return;
      started = true;
      introObserver.disconnect();
      context = gsap.context(() => {
        observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              arrivals.get(entry.target as HTMLElement)?.play();
              observer?.unobserve(entry.target);
            }
          },
          { rootMargin: "0px 0px -5% 0px", threshold: 0 },
        );
        Array.from(
          shell!.querySelectorAll<HTMLElement>(
            "[data-folio-reveal], [data-process-step]",
          ),
        )
          .flatMap(revealTargets)
          .forEach((element) => {
            // Restored browser positions must not make earlier content disappear.
            if (element.getBoundingClientRect().bottom <= 0) return;
            const siblings = element.hasAttribute("data-process-step")
              ? Array.from(element.parentElement!.children).indexOf(element)
              : 0;
            const tween = gsap.fromTo(
              element,
              { y: 28 },
              {
                y: 0,
                duration: 0.65,
                delay: siblings * 0.06,
                ease: "power3.out",
                paused: true,
                onComplete: () => {
                  element.style.removeProperty("transform");
                },
              },
            );
            arrivals.set(element, tween);
            observer!.observe(element);
          });

        shell!
          .querySelectorAll<HTMLElement>("[data-folio-image]")
          .forEach((frame) => {
            const image = frame.querySelector("img");
            if (!image) return;
            gsap.fromTo(
              image,
              { scale: 1.07, yPercent: -2 },
              {
                scale: 1.02,
                yPercent: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: frame,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          });

        shell!
          .querySelectorAll<HTMLElement>("[data-process-track]")
          .forEach((section) => {
            const line = section.querySelector("[data-process-progress]");
            if (!line) return;
            gsap.fromTo(
              line,
              { scaleX: 0 },
              {
                scaleX: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: section.querySelector(".process-grid"),
                  start: "top 88%",
                  end: "bottom 55%",
                  scrub: true,
                },
              },
            );
          });
      }, shell!);
      void document.fonts.ready.then(() => {
        if (!disposed) scheduleScrollRefresh();
      });
    }

    const introObserver = new MutationObserver(start);
    introObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-brand-intro"],
    });
    const frame = requestAnimationFrame(start);
    const revealFocused = (event: FocusEvent) => {
      if (!(event.target instanceof Node)) return;
      for (const [element, tween] of arrivals) {
        if (element.contains(event.target)) tween.progress(1).pause();
      }
    };
    shell.addEventListener("focusin", revealFocused);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      introObserver.disconnect();
      observer?.disconnect();
      shell.removeEventListener("focusin", revealFocused);
      context?.revert();
    };
  }, [pathname]);

  return null;
}
