"use client";

import { useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useMotionValue,
  useScroll,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "framer-motion";
import { useProjectMotion } from "./ProjectMotion";
import { DirectionalArrow } from "@/components/ui/DirectionalArrow";
import type { Project } from "@/types/project";
import { scrollToPosition } from "@/lib/smooth-scroll";

type Scene = Project["images"];

function GalleryScene({
  images,
  index,
  count,
  progress,
  animate,
  active,
  loadAhead,
}: {
  images: Scene;
  index: number;
  count: number;
  progress: MotionValue<number>;
  animate: boolean;
  active: boolean;
  loadAhead: boolean;
}) {
  const steps = Math.max(count - 1, 1);
  const start = (index - 0.8) / steps;
  const end = index / steps;
  const reveal = useTransform(progress, [start, end], [0, 100]);
  const titleStart = (index - 0.7) / steps;
  const titleEnd = (index - 0.3) / steps;
  const titleY = useTransform(progress, [titleStart, titleEnd], [110, 0]);
  const copyOpacity = useTransform(
    progress,
    [titleStart, titleEnd, (index + 0.05) / steps, (index + 0.3) / steps],
    [0, 1, 1, index === count - 1 ? 1 : 0],
  );
  const secondaryClip = useTransform(
    reveal,
    (value) => `inset(${100 - value}% 0% 0% 0%)`,
  );
  const secondaryY = useTransform(
    progress,
    [start, (index + 0.8) / steps],
    [85, -35],
  );
  const imageScale = useTransform(
    progress,
    [start, (index + 0.8) / steps],
    [1.15, 1.02],
  );
  const layerOpacity = useTransform(
    progress,
    [(index + 0.85) / steps, (index + 1) / steps],
    [1, index === count - 1 ? 1 : 0],
  );

  return (
    <div
      className={`project-gallery-scene ${images.length === 1 ? "project-gallery-scene-single" : ""}`}
      data-scene={index}
      aria-hidden={animate && !active ? true : undefined}
      inert={animate && !active}
      style={{ zIndex: index + 1 }}
    >
      <motion.div
        className="project-gallery-copy"
        style={{ opacity: animate ? copyOpacity : 1 }}
      >
        <p className="project-gallery-number">
          ({String(index + 1).padStart(2, "0")})
        </p>
        <div className="project-gallery-title-mask">
          <motion.h2 style={{ y: animate ? titleY : 0 }}>
            {images[0].caption}
          </motion.h2>
        </div>
        <p className="project-gallery-image-type">Design visualization</p>
      </motion.div>
      {images.map((image, imageIndex) => (
        <motion.figure
          key={image.src}
          className={`project-gallery-layer ${imageIndex === 0 ? "project-gallery-primary" : "project-gallery-secondary"}`}
          style={
            imageIndex === 0
              ? ({
                  "--scene-reveal": animate ? reveal : 100,
                  opacity: animate ? layerOpacity : 1,
                } as MotionStyle)
              : {
                  clipPath: animate ? secondaryClip : "inset(0%)",
                  y: animate ? secondaryY : 0,
                  opacity: animate ? layerOpacity : 1,
                }
          }
        >
          <motion.div
            className="project-gallery-photo"
            style={{ scale: animate ? imageScale : 1 }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={
                imageIndex === 0
                  ? "(max-width: 700px) 74vw, 45vw"
                  : "(max-width: 700px) 46vw, 27vw"
              }
              quality={85}
              loading={loadAhead ? "eager" : "lazy"}
            />
          </motion.div>
          <figcaption className="sr-only">
            {image.caption} — Design visualization
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}

export function ProjectScrollGallery({
  project,
  credit,
}: {
  project: Project;
  credit?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const { enabled } = useProjectMotion();
  const scenes: Scene[] = [];
  for (let index = 0; index < project.images.length; index += 2) {
    scenes.push(project.images.slice(index, index + 2));
  }
  const animate = enabled && scenes.length > 1;
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const { scrollYProgress } = useScroll({
    target: root,
    offset: ["start start", "end end"],
    trackContentSize: true,
  });
  // Decouple native ScrollTimeline from transforms with ranges outside 0–1.
  const progress = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    progress.set(value);
    if (!animate) return;
    const next = Math.max(
      0,
      Math.min(scenes.length - 1, Math.round(value * (scenes.length - 1))),
    );
    if (next !== activeRef.current) {
      activeRef.current = next;
      setActive(next);
    }
  });

  function showScene(index: number) {
    if (!root.current) return;
    const sectionTop =
      root.current.getBoundingClientRect().top + window.scrollY;
    const travel = root.current.offsetHeight - window.innerHeight;
    scrollToPosition(
      sectionTop + (index / Math.max(scenes.length - 1, 1)) * travel,
    );
  }

  return (
    <>
      <section
        id="rooms"
        ref={root}
        className="project-scroll-gallery"
        aria-label="Project gallery"
        data-animated={animate}
        style={{ "--scene-count": scenes.length } as CSSProperties}
      >
        <div className="project-gallery-viewport">
          <div className="project-gallery-toolbar">
            <p className="project-gallery-kicker">
              {project.title} / Inside the project
            </p>
            {animate && (
              <div
                className="project-gallery-controls"
                aria-label="Choose a space"
              >
                {scenes.map((scene, index) => (
                  <button
                    key={scene[0].src}
                    aria-label={`Show ${scene[0].caption}, space ${index + 1}`}
                    aria-pressed={index === active}
                    onClick={() => showScene(index)}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            {animate
              ? `${scenes[active]?.[0].caption}, space ${active + 1} of ${scenes.length}`
              : "All project spaces"}
          </p>
          <div className="project-gallery-scenes">
            {scenes.map((scene, index) => (
              <GalleryScene
                key={scene[0].src}
                images={scene}
                index={index}
                count={scenes.length}
                progress={progress}
                animate={animate}
                active={active === index}
                loadAhead={index === 0 || (animate && index <= active + 1)}
              />
            ))}
          </div>
          {animate && (
            <div className="project-gallery-scroll-cue" aria-hidden="true">
              <span>Scroll through the spaces</span>
              <DirectionalArrow direction="down" />
            </div>
          )}
        </div>
      </section>
      {credit && <p className="section portfolio-credit">{credit}</p>}
    </>
  );
}
