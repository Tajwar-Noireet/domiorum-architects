"use client";

import { DirectionalArrow } from "@/components/ui/DirectionalArrow";

import { HoverText } from "@/components/ui/HoverText";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import { useHomeMotion } from "./HomeMotion";
import { scrollToPosition } from "@/lib/smooth-scroll";

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

const pinnedGalleryMedia = "(min-width: 900px) and (min-height: 560px)";

export function InteriorGallery() {
  const section = useRef<HTMLElement>(null);
  const scrollSpace = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTriggerType | undefined>(undefined);
  const refresh = useRef<(() => void) | undefined>(undefined);
  const ready = useRef(false);
  const pendingRoom = useRef<number | null>(null);
  const progressBar = useRef<HTMLSpanElement>(null);
  const activeRoom = useRef(0);
  const [active, setActive] = useState(0);
  const { enabled } = useHomeMotion();

  function updatePosition(progress: number) {
    const position = Math.max(0, Math.min(1, progress));
    const next = Math.round(position * (rooms.length - 1));
    if (next !== activeRoom.current) {
      activeRoom.current = next;
      setActive(next);
    }
    if (progressBar.current)
      progressBar.current.style.transform = `scaleX(${(1 + position * (rooms.length - 1)) / rooms.length})`;
  }

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
        pinnedGalleryMedia,
        () => {
          viewport.current!.scrollLeft = 0;
          gsap.set(viewport.current, { attr: { "data-pinned": "true" } });
          const reserve = () => {
            gsap.set(scrollSpace.current, {
              height:
                section.current!.offsetHeight +
                track.current!.scrollWidth -
                viewport.current!.clientWidth,
            });
          };
          reserve();
          const tween = gsap.to(track.current, {
            x: () =>
              -(track.current!.scrollWidth - viewport.current!.clientWidth),
            ease: "none",
            scrollTrigger: {
              trigger: section.current,
              start: "top top",
              end: () =>
                `+=${track.current!.scrollWidth - viewport.current!.clientWidth}`,
              refreshPriority: 1,
              pin: true,
              pinSpacing: false,
              onRefreshInit: reserve,
              scrub: true,
              invalidateOnRefresh: true,
              onUpdate: (self) => updatePosition(self.progress),
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
          scrollToPosition(
            start + ((end - start) * pendingRoom.current) / (rooms.length - 1),
          );
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
      window.matchMedia(pinnedGalleryMedia).matches &&
      (!ready.current || !trigger.current)
    ) {
      pendingRoom.current = index;
      return;
    }
    if (trigger.current) {
      refresh.current?.();
      const { start, end } = trigger.current;
      scrollToPosition(start + ((end - start) * index) / (rooms.length - 1));
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
    <div className="interior-scroll" ref={scrollSpace}>
      <section
        ref={section}
        className="interior-pin"
        aria-label="Explore interior spaces"
      >
        <div className="interior-heading">
          <div>
            <p className="eyebrow">02 / Inside the home</p>
            <h2>
              <HoverText>Life, room by room.</HoverText>
            </h2>
          </div>
          <p>
            Scroll through the spaces.
            <br />
            <span>Design visualizations</span>
          </p>
        </div>
        <div
          className="interior-viewport"
          id="interior-views"
          ref={viewport}
          tabIndex={0}
          aria-label="Interior image gallery"
          aria-describedby="interior-keyboard-help"
          onScroll={(event) => {
            if (trigger.current) return;
            const view = event.currentTarget;
            updatePosition(
              view.scrollLeft /
                Math.max(1, view.scrollWidth - view.clientWidth),
            );
          }}
          onKeyDown={(event) => {
            let next: number;
            if (event.key === "ArrowRight")
              next = Math.min(rooms.length - 1, activeRoom.current + 1);
            else if (event.key === "ArrowLeft")
              next = Math.max(0, activeRoom.current - 1);
            else if (event.key === "Home") next = 0;
            else if (event.key === "End") next = rooms.length - 1;
            else return;
            event.preventDefault();
            showRoom(next);
          }}
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
                    <h3>
                      <HoverText>{room.title}</HoverText>
                    </h3>
                    <p>{room.text}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
        <p id="interior-keyboard-help" className="sr-only">
          Use left and right arrow keys to choose a room, or Home and End for
          the first and last view.
        </p>
        <div className="interior-reading-progress" aria-hidden="true">
          <span ref={progressBar} />
        </div>
        <div className="interior-controls" aria-label="Choose an interior view">
          {rooms.map((room, index) => (
            <button
              key={room.title}
              type="button"
              aria-pressed={index === active}
              aria-controls="interior-views"
              onClick={() => showRoom(index)}
            >
              0{index + 1}
              <span>{room.title}</span>
              <DirectionalArrow />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
