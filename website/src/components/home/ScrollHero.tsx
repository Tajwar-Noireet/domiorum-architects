"use client";

import { DirectionalArrow } from "@/components/ui/DirectionalArrow";

import { HoverText } from "@/components/ui/HoverText";
import Image from "next/image";
import { LinkButton } from "@/components/ui/LinkButton";
import { useLayoutEffect, useRef } from "react";
import { useHomeMotion } from "./HomeMotion";

const scenes = [
  {
    src: "/images/home/living-overview.webp",
    alt: "Living room visualization with a pale sofa, warm timber and illuminated shelving",
    title: "Room to gather.",
    label: "01 / Living",
    position: "60% 65%",
  },
  {
    src: "/images/home/living-detail.webp",
    alt: "A closer living room view of timber panelling, integrated storage and soft seating",
    title: "Every detail, considered.",
    label: "02 / Material",
    position: "55% 65%",
  },
  {
    src: "/images/home/stair.webp",
    alt: "Open stair and double-height interior with white steps, glass balustrade and timber cabinetry",
    title: "A new perspective.",
    label: "03 / Connection",
    position: "65% 60%",
  },
];

export function ScrollHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { enabled, toggle } = useHomeMotion();
  useLayoutEffect(() => {
    if (!enabled) return;
    let disposed = false;
    let revert: (() => void) | undefined;
    async function start() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed || !sectionRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add(
        {
          desktop: "(min-width: 900px)",
          small: "(max-width: 899px) and (min-height: 600px)",
        },
        (context) => {
          const section = sectionRef.current!;
          const desktop = context.conditions?.desktop;
          const frames = section.querySelectorAll(".cinema-scene");
          const labels = section.querySelectorAll(".cinema-scene-copy");
          const reserve = () => {
            gsap.set(scrollRef.current, {
              height:
                section.offsetHeight + innerHeight * (desktop ? 2.2 : 1.5),
            });
          };
          reserve();
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: desktop ? "+=220%" : "+=150%",
              // The outer wrapper preserves travel while GSAP reverts pins during refresh.
              refreshPriority: 2,
              pin: true,
              pinSpacing: false,
              onRefreshInit: reserve,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });
          tl.fromTo(
            section.querySelector(".cinema-frame"),
            {
              clipPath: "inset(0% 0% 0% 0%)",
            },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9 },
            0,
          )
            .to(
              section.querySelector(".cinema-frame"),
              { autoAlpha: 1, duration: 0.4 },
              0.05,
            )
            .to(
              section.querySelector(".cinema-preview"),
              { scale: 1.16, autoAlpha: 0, duration: 0.55 },
              0,
            )
            .to(
              section.querySelector(".cinema-frame-note"),
              { autoAlpha: 0, duration: 0.15 },
              0.05,
            )
            .to(
              section.querySelector(".cinema-opening"),
              {
                xPercent: desktop ? -12 : 0,
                y: desktop ? 0 : 45,
                autoAlpha: 0,
                duration: 0.5,
              },
              0.15,
            )
            .fromTo(
              section.querySelector(".hero-line-first"),
              { xPercent: 0 },
              { xPercent: desktop ? -8 : -3, duration: 0.5 },
              0.15,
            )
            .fromTo(
              section.querySelector(".hero-line-second"),
              { xPercent: 0 },
              { xPercent: desktop ? 8 : 3, duration: 0.5 },
              0.15,
            )
            .fromTo(
              frames[0].querySelector("img"),
              { scale: 1.08 },
              { scale: 1, duration: 1.5 },
              0,
            )
            .to(labels[0], { autoAlpha: 1, y: 0, duration: 0.35 }, 0.65)
            .fromTo(
              frames[1],
              { clipPath: "inset(0% 0% 0% 100%)", opacity: 1 },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 0.65 },
              1.2,
            )
            .fromTo(
              frames[1].querySelector("img"),
              { scale: 1.18, xPercent: 3 },
              { scale: 1, xPercent: 0, duration: 1.3 },
              1.2,
            )
            .to(labels[0], { autoAlpha: 0, y: -25, duration: 0.2 }, 1.2)
            .to(labels[1], { autoAlpha: 1, y: 0, duration: 0.35 }, 1.5)
            .fromTo(
              frames[2],
              { clipPath: "inset(100% 0% 0% 0%)", opacity: 1 },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 0.65 },
              2.5,
            )
            .fromTo(
              frames[2].querySelector("img"),
              { scale: 1.14, yPercent: 3 },
              { scale: 1, yPercent: 0, duration: 1.25 },
              2.5,
            )
            .to(labels[1], { autoAlpha: 0, y: -25, duration: 0.2 }, 2.5)
            .to(labels[2], { autoAlpha: 1, y: 0, duration: 0.35 }, 2.85)
            .to(
              section.querySelector(".cinema-progress-fill"),
              { scaleX: 1, duration: 3.75 },
              0,
            );
        },
        sectionRef,
      );
      revert = () => media.revert();
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
    <div ref={scrollRef} className="cinema-scroll">
      <section
        ref={sectionRef}
        className="cinema-hero"
        aria-label="Architecture and interiors by Domiorum"
      >
        <div className="cinema-preview">
          <Image
            src={scenes[0].src}
            alt=""
            fill
            sizes="100vw"
            preload
            quality={85}
          />
        </div>
        <div className="cinema-frame">
          {scenes.map((scene, i) => (
            <div
              className={`cinema-scene cinema-scene-${i}`}
              key={scene.src}
              aria-hidden={i > 0 ? true : undefined}
            >
              <Image
                src={scene.src}
                alt={scene.alt}
                fill
                sizes="100vw"
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                quality={85}
                style={{ objectPosition: scene.position }}
              />
            </div>
          ))}
          <div className="cinema-shade" />
        </div>
        <div className="cinema-opening">
          <p className="eyebrow">Domiorum Architects · Dhaka</p>
          <h1>
            <HoverText>
              <span className="hero-line hero-line-first">
                Imagined with you.
              </span>
              <span className="hero-line hero-line-second">Built for you.</span>
            </HoverText>
          </h1>
          <div className="cinema-intro-bottom">
            <p>
              Architecture & interiors <br />
              for the way you live.
            </p>
            <LinkButton href="/projects" light>
              Explore our work
            </LinkButton>
          </div>
        </div>
        <div className="cinema-scene-titles" aria-hidden="true">
          {scenes.map((scene) => (
            <div className="cinema-scene-copy" key={scene.label}>
              <span className="eyebrow">{scene.label}</span>
              <p>{scene.title}</p>
            </div>
          ))}
        </div>
        <span className="cinema-frame-note">01 - A closer look at home</span>
        <div className="cinema-controls">
          <a href="#introduction" className="cinema-scroll-link">
            Scroll to explore <DirectionalArrow direction="down" />
          </a>
          <button
            type="button"
            onClick={toggle}
            aria-pressed={enabled}
            aria-label={
              enabled
                ? "Motion on: Disable scroll animation"
                : "Enable motion: Enable scroll animation"
            }
          >
            <span className="motion-symbol" aria-hidden="true">
              {enabled ? "Ⅱ" : "▷"}
            </span>
            {enabled ? "Motion on" : "Enable motion"}
          </button>
          <span className="cinema-credit">Design visualizations</span>
        </div>
        <div className="cinema-progress" aria-hidden="true">
          <div className="cinema-progress-fill" />
        </div>
      </section>
    </div>
  );
}
