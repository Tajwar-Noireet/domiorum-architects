"use client";

import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";

const scenes = [
  {
    src: "/images/home/space.webp",
    alt: "Residential living room design visualization with pale seating and warm timber details",
    name: "Space",
    caption: "Room for everyday life.",
  },
  {
    src: "/images/home/detail.webp",
    alt: "Interior visualization showing a marble counter, timber detailing and integrated lighting",
    name: "Detail",
    caption: "Considered, down to the detail.",
  },
  {
    src: "/images/home/quiet.webp",
    alt: "Quiet interior visualization with pale built-in storage and warm finishes",
    name: "Balance",
    caption: "A sense of balance.",
  },
];

const { props: mobileHero } = getImageProps({
  src: "/images/projects/selim/living.webp",
  alt: scenes[0].alt,
  width: 1920,
  height: 1080,
  sizes: "180vh",
  quality: 85,
});

export function ScrollHero() {
  const sectionRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    let disposed = false;
    let revert: (() => void) | undefined;
    const media = window.matchMedia(
      "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
    );
    let started = false;
    async function animate() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed || !sectionRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
        () => {
          const section = sectionRef.current!;
          const layers = section.querySelectorAll(".hero-scene");
          const captions = section.querySelectorAll(".scene-caption");
          const indicators = section.querySelectorAll(".scene-index");
          const line = section.querySelector(".hero-progress-fill");
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=150%",
              pin: true,
              scrub: 0.7,
              invalidateOnRefresh: true,
            },
          });
          tl.to(layers[0], { scale: 1.06, duration: 1.5, ease: "none" }, 0)
            .to(layers[1], { opacity: 1, duration: 0.35 }, 0.5)
            .to(captions[0], { opacity: 0, duration: 0.15 }, 0.5)
            .to(captions[1], { opacity: 1, duration: 0.15 }, 0.65)
            .to(indicators[0], { color: "#d5d9dd", duration: 0.15 }, 0.5)
            .to(indicators[1], { color: "#E1BF77", duration: 0.15 }, 0.65)
            .fromTo(
              layers[1],
              { scale: 1.02 },
              { scale: 1.08, duration: 1, ease: "none" },
              0.5,
            )
            .to(layers[2], { opacity: 1, duration: 0.35 }, 1.1)
            .to(captions[1], { opacity: 0, duration: 0.15 }, 1.1)
            .to(captions[2], { opacity: 1, duration: 0.15 }, 1.25)
            .to(indicators[1], { color: "#d5d9dd", duration: 0.15 }, 1.1)
            .to(indicators[2], { color: "#E1BF77", duration: 0.15 }, 1.25)
            .fromTo(
              layers[2],
              { scale: 1.02 },
              { scale: 1.07, duration: 0.55, ease: "none" },
              1.1,
            )
            .to(line, { scaleX: 1, duration: 1.65, ease: "none" }, 0);
        },
        sectionRef,
      );
      revert = () => mm.revert();
      ScrollTrigger.refresh();
    }
    const start = () => {
      if (media.matches && !started) {
        started = true;
        void animate();
      }
    };
    start();
    media.addEventListener("change", start);
    return () => {
      disposed = true;
      media.removeEventListener("change", start);
      revert?.();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="scroll-hero"
      aria-label="Imagined with you. Built for you."
    >
      <div className="hero-visual">
        {scenes.map((scene, i) => (
          <div
            className={`hero-scene hero-scene-${i}`}
            key={scene.src}
            aria-hidden={i > 0 ? true : undefined}
          >
            <picture>
              {i === 0 ? (
                <source
                  media="(max-width: 600px)"
                  srcSet={mobileHero.srcSet}
                  sizes={mobileHero.sizes}
                />
              ) : null}
              <Image
                src={scene.src}
                alt={scene.alt}
                fill
                sizes="100vw"
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                quality={85}
              />
            </picture>
          </div>
        ))}
      </div>
      <div className="hero-shade" />
      <div className="hero-content">
        <p className="eyebrow">Domiorum Architects / Dhaka</p>
        <h1>
          Imagined with you.
          <br />
          <span>Built for you.</span>
        </h1>
        <div className="hero-bottom">
          <p>
            Architecture & interiors
            <br />
            for the way you live.
          </p>
          <Link href="/projects" className="hero-link">
            Explore our work <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
      <div className="hero-notes">
        <div className="scene-captions" aria-hidden="true">
          {scenes.map((scene, i) => (
            <span className={`scene-caption caption-${i}`} key={scene.name}>
              {scene.caption}
            </span>
          ))}
        </div>
        <a href="#introduction" className="scroll-hint">
          Scroll to explore <span aria-hidden="true">↓</span>
        </a>
        <span className="hero-image-credit">Design visualization</span>
      </div>
      <div className="hero-progress" aria-hidden="true">
        <div className="hero-progress-fill" />
      </div>
      <div className="scene-indices" aria-hidden="true">
        {scenes.map((scene, i) => (
          <span key={scene.name} className={`scene-index index-${i}`}>
            0{i + 1} / {scene.name}
          </span>
        ))}
      </div>
    </section>
  );
}
