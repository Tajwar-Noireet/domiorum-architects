"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";

function subscribeMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: no-preference)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

const MotionContext = createContext({ enabled: true });
export const useHomeMotion = () => useContext(MotionContext);

function motionPreference() {
  return window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
}

export function HomeMotion({ children }: { children: ReactNode }) {
  const prefersMotion = useSyncExternalStore(
    subscribeMotion,
    motionPreference,
    () => false,
  );
  const enabled = prefersMotion;
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!enabled) return;
    let disposed = false;
    let revert: (() => void) | undefined;
    async function start() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const titleStyles = Array.from(
        root.current.querySelectorAll<HTMLElement>("[data-title-line]"),
        (line) => ({ line, style: line.getAttribute("style") }),
      );
      const context = gsap.context(() => {
        const scope = root.current!;
        scope
          .querySelectorAll<HTMLElement>("[data-scroll-title]")
          .forEach((title) => {
            const lines = title.querySelectorAll("[data-title-line]");
            // Pin refreshes can rewind a fromTo reveal before its starting position.
            gsap.set(lines, { yPercent: 112 });
            gsap.to(lines, {
              yPercent: 0,
              stagger: 0.12,
              ease: "none",
              scrollTrigger: {
                trigger: title,
                start: "top 96%",
                end: "top 55%",
                scrub: 0.45,
              },
            });
          });
        scope
          .querySelectorAll<HTMLElement>("[data-scroll-words]")
          .forEach((copy) => {
            gsap.fromTo(
              copy.querySelectorAll("[data-scroll-word]"),
              { color: "var(--muted)" },
              {
                color: "var(--ink)",
                stagger: 0.035,
                ease: "none",
                scrollTrigger: {
                  trigger: copy,
                  start: "top 88%",
                  end: "bottom 48%",
                  scrub: 0.4,
                },
              },
            );
          });
        scope
          .querySelectorAll<HTMLElement>("[data-scroll-frame]")
          .forEach((frame) => {
            const image = frame.querySelector("img");
            if (!image) return;
            const timeline = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: frame,
                start: "top 96%",
                end: "bottom 28%",
                scrub: 0.6,
              },
            });
            timeline
              .fromTo(
                frame,
                { clipPath: "inset(12% 8% 12% 8%)" },
                { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5 },
                0,
              )
              .fromTo(
                image,
                { scale: 1.22, yPercent: -4 },
                { scale: 1.04, yPercent: 2, duration: 1 },
                0,
              );
          });
        root
          .current!.querySelectorAll<HTMLElement>("[data-reveal]")
          .forEach((element) => {
            gsap.from(element, {
              y: 34,
              opacity: 0,
              duration: 0.85,
              ease: "power2.out",
              scrollTrigger: { trigger: element, start: "top 92%", once: true },
            });
          });
        root
          .current!.querySelectorAll<HTMLElement>("[data-image-reveal]")
          .forEach((element) => {
            gsap.fromTo(
              element,
              { clipPath: "inset(10% 7% 10% 7%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                ease: "none",
                scrollTrigger: {
                  trigger: element,
                  start: "top 94%",
                  end: "top 28%",
                  scrub: 0.7,
                },
              },
            );
          });
        root
          .current!.querySelectorAll<HTMLElement>("[data-parallax] img")
          .forEach((image) => {
            gsap.fromTo(
              image,
              { scale: 1.12, yPercent: -3 },
              {
                scale: 1.04,
                yPercent: 3,
                ease: "none",
                scrollTrigger: {
                  trigger: image.parentElement,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.8,
                },
              },
            );
          });
      }, root);
      revert = () => {
        context.revert();
        titleStyles.forEach(({ line, style }) => {
          if (style === null) line.removeAttribute("style");
          else line.setAttribute("style", style);
        });
      };
      await document.fonts.ready;
      if (!disposed) ScrollTrigger.refresh();
    }
    void start();
    return () => {
      disposed = true;
      revert?.();
    };
  }, [enabled]);

  return (
    <MotionContext.Provider value={{ enabled }}>
      <div
        ref={root}
        className="home-experience"
        data-motion={enabled ? "on" : "off"}
      >
        {children}
      </div>
    </MotionContext.Provider>
  );
}
