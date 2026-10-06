"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import { useHomeMotion } from "./HomeMotion";

const rooms = [
  {
    src: "/images/home/living-dining.webp",
    title: "Living & dining",
    text: "Spaces that bring people together.",
    alt: "Dining room visualization framed by an arched mirror, with a quiet living room beyond",
  },
  {
    src: "/images/interiors/bedroom.webp",
    title: "Private rooms",
    text: "A place to slow down.",
    alt: "Bedroom visualization with a timber bed, layered textiles and warm curtains",
  },
  {
    src: "/images/interiors/kitchen.webp",
    title: "Kitchens & storage",
    text: "Designed around everyday routines.",
    alt: "Kitchen visualization with fitted cabinetry, stone worktops and integrated lighting",
  },
];

export function InteriorGallery() {
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTriggerType | undefined>(undefined);
  const refresh = useRef<(() => void) | undefined>(undefined);
  const ready = useRef(false);
  const pendingRoom = useRef<number | null>(null);
  const { enabled } = useHomeMotion();

  useLayoutEffect(() => {
    if (!enabled) return;
    let disposed = false;
    let revert: (() => void) | undefined;
    async function start() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed || !section.current || !track.current) return;
      gsap.registerPlugin(ScrollTrigger);
      refresh.current = () => ScrollTrigger.refresh();
      const media = gsap.matchMedia();
      media.add(
        "(min-width: 900px)",
        () => {
          viewport.current!.scrollLeft = 0;
          const tween = gsap.to(track.current, {
            x: () =>
              -(track.current!.scrollWidth - viewport.current!.clientWidth),
            ease: "none",
            scrollTrigger: {
              trigger: section.current,
              start: "top top",
              end: () =>
                `+=${track.current!.scrollWidth - viewport.current!.clientWidth}`,
              pin: true,
              scrub: 0.7,
              invalidateOnRefresh: true,
            },
          });
          trigger.current = tween.scrollTrigger;
          return () => {
            trigger.current = undefined;
          };
        },
        section,
      );
      revert = () => media.revert();
      await document.fonts.ready;
      if (!disposed) {
        ScrollTrigger.refresh();
        ready.current = true;
        if (pendingRoom.current !== null && trigger.current) {
          const { start, end } = trigger.current;
          window.scrollTo({
            top:
              start +
              ((end - start) * pendingRoom.current) / (rooms.length - 1),
            behavior: "smooth",
          });
          pendingRoom.current = null;
        }
      }
    }
    void start();
    return () => {
      disposed = true;
      ready.current = false;
      refresh.current = undefined;
      revert?.();
    };
  }, [enabled]);

  function showRoom(index: number) {
    if (
      enabled &&
      window.innerWidth >= 900 &&
      (!ready.current || !trigger.current)
    ) {
      pendingRoom.current = index;
      return;
    }
    if (trigger.current) {
      refresh.current?.();
      const { start, end } = trigger.current;
      window.scrollTo({
        top: start + ((end - start) * index) / (rooms.length - 1),
        behavior: "smooth",
      });
    } else {
      const card = track.current?.children[index] as HTMLElement | undefined;
      if (card && viewport.current)
        viewport.current.scrollTo({
          left: card.offsetLeft - (track.current?.offsetLeft ?? 0),
          behavior: enabled ? "smooth" : "instant",
        });
    }
  }

  return (
    <section
      ref={section}
      className="interior-pin"
      aria-label="Explore interior spaces"
    >
      <div className="interior-heading">
        <div>
          <p className="eyebrow">02 / Inside the home</p>
          <h2>Life, room by room.</h2>
        </div>
        <p>
          Scroll through the spaces.
          <br />
          <span>Design visualizations</span>
        </p>
      </div>
      <div
        className="interior-viewport"
        ref={viewport}
        tabIndex={0}
        aria-label="Interior image gallery"
      >
        <div ref={track} className="interior-track">
          {rooms.map((room, index) => (
            <figure key={room.src} className="interior-room">
              <div className="interior-room-image">
                <Image
                  src={room.src}
                  alt={room.alt}
                  fill
                  sizes="(max-width: 899px) 90vw, 72vw"
                  quality={85}
                />
              </div>
              <figcaption>
                <span className="interior-room-number">0{index + 1}</span>
                <div>
                  <h3>{room.title}</h3>
                  <p>{room.text}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="interior-controls" aria-label="Choose an interior view">
        {rooms.map((room, index) => (
          <button
            key={room.title}
            type="button"
            onClick={() => showRoom(index)}
          >
            0{index + 1}
            <span>{room.title}</span>
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
    </section>
  );
}
