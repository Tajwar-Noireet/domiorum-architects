"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useHomeMotion } from "@/components/home/HomeMotion";
import { FlowButtonContent } from "@/components/ui/FlowButton";
import { DirectionalArrow } from "@/components/ui/DirectionalArrow";
import type { Project } from "@/types/project";

const ease = [0.22, 1, 0.36, 1] as const;
function subscribeMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: no-preference)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

export function ProjectShowcase({ projects }: { projects: Project[] }) {
  const section = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start end", "end start"],
    trackContentSize: true,
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 32,
    mass: 0.5,
  });
  const sideDrift = useTransform(progress, [0, 1], [110, -110]);
  const centreDrift = useTransform(progress, [0, 1], [-55, 55]);
  const titleDrift = useTransform(progress, [0, 1], [65, -65]);
  const imageScale = useTransform(progress, [0, 0.5, 1], [1.16, 1.03, 1.1]);
  const [selected, setSelected] = useState(0);
  const motionAllowed = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: no-preference)").matches,
    () => false,
  );
  const { enabled } = useHomeMotion();
  const animate = enabled && motionAllowed;
  const project = projects[selected];
  const frames =
    project.images.length > 2
      ? [
          project.images[1],
          { src: project.cover, alt: project.coverAlt },
          project.images[2],
        ]
      : [{ src: project.cover, alt: project.coverAlt }];
  const change = (offset: number) =>
    setSelected(
      (current) => (current + offset + projects.length) % projects.length,
    );

  return (
    <div className="project-showcase" ref={section} data-animated={animate}>
      <div className="showcase-topline">
        <p className="showcase-kicker">(Our projects)</p>
        <div className="showcase-numbers" aria-label="Choose a project">
          {projects.map((item, index) => (
            <button
              key={item.slug}
              aria-label={`Show ${item.title}`}
              aria-pressed={index === selected}
              onClick={() => setSelected(index)}
            >
              ({String(index + 1).padStart(2, "0")})
            </button>
          ))}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {project.title}, project {selected + 1} of {projects.length}
      </p>
      <AnimatePresence initial={false} mode="wait">
        <motion.article
          key={project.slug}
          className={`showcase-project ${frames.length === 1 ? "showcase-single" : ""}`}
          initial={animate ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          exit={{ opacity: animate ? 0 : 1 }}
          transition={{ duration: animate ? 0.2 : 0 }}
        >
          <div className="showcase-stage">
            <motion.div
              className="showcase-title-drift"
              style={{ y: animate ? titleDrift : 0 }}
            >
              <motion.h2
                className="showcase-title"
                initial={animate ? { y: 28, opacity: 0 } : false}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: animate ? 0.8 : 0, ease }}
              >
                {project.category === "Architecture"
                  ? project.title.replace(/ Residence$/, "")
                  : project.title}
                <span>
                  {project.category === "Interiors" ? "Interiors" : "Residence"}
                </span>
              </motion.h2>
            </motion.div>
            {frames.map((frame, index) => (
              <motion.div
                key={`${project.slug}-${index}`}
                className={`showcase-frame showcase-frame-${index}`}
                style={{
                  y: animate ? (index === 1 ? centreDrift : sideDrift) : 0,
                }}
                initial={animate ? { clipPath: "inset(100% 0% 0% 0%)" } : false}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                transition={{
                  duration: animate ? 1 : 0,
                  delay: animate ? index * 0.12 : 0,
                  ease,
                }}
              >
                <motion.div
                  className="showcase-photo-drift"
                  style={{ scale: animate ? imageScale : 1 }}
                >
                  <Image
                    src={frame.src}
                    alt={frame.alt}
                    fill
                    sizes={
                      frames.length === 1
                        ? "90vw"
                        : "(max-width: 600px) 60vw, 34vw"
                    }
                    quality={85}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
          <div className="showcase-description">
            <p>{project.summary}</p>
            <Link
              className="button flow-button showcase-link"
              href={`/projects/${project.slug}`}
            >
              <FlowButtonContent>View project</FlowButtonContent>
            </Link>
          </div>
        </motion.article>
      </AnimatePresence>
      <div className="showcase-footer">
        <button
          className="showcase-step"
          aria-label="Previous project"
          onClick={() => change(-1)}
        >
          <DirectionalArrow direction="left" />
        </button>
        <div className="showcase-index" aria-label="Project index">
          {projects.map((item, index) => (
            <button
              key={item.slug}
              onClick={() => setSelected(index)}
              aria-pressed={selected === index}
            >
              {item.title}
            </button>
          ))}
        </div>
        <button
          className="showcase-step"
          aria-label="Next project"
          onClick={() => change(1)}
        >
          <DirectionalArrow direction="right" />
        </button>
      </div>
    </div>
  );
}
