"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

function subscribeMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: no-preference)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

const MotionContext = createContext({ enabled: false, toggle: () => {} });
export const useHomeMotion = () => useContext(MotionContext);

function motionPreference() {
  try {
    const choice = window.sessionStorage.getItem("domiorum-motion");
    if (choice === "on" || choice === "off") return choice === "on";
  } catch {}
  return window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
}

export function HomeMotion({ children }: { children: ReactNode }) {
  const prefersMotion = useSyncExternalStore(
    subscribeMotion,
    motionPreference,
    () => false,
  );
  const [override, setOverride] = useState<boolean | null>(null);
  const enabled = override ?? prefersMotion;
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
      const context = gsap.context(() => {
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
      revert = () => context.revert();
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
    <MotionContext.Provider
      value={{
        enabled,
        toggle: () => {
          setOverride(!enabled);
          try {
            window.sessionStorage.setItem(
              "domiorum-motion",
              enabled ? "off" : "on",
            );
          } catch {}
        },
      }}
    >
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
