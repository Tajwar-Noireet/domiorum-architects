"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useProjectMotion } from "./ProjectMotion";
import type { Project } from "@/types/project";

export function ProjectScrollHero({ project }: { project: Project }) {
  const cover = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cover,
    offset: ["start end", "end start"],
    trackContentSize: true,
  });
  const aperture = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["inset(12% 15% 12% 15%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)"],
  );
  const scale = useTransform(scrollYProgress, [0, 1], [1.14, 1]);
  const drift = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
  const { enabled: animate } = useProjectMotion();

  return (
    <div
      ref={cover}
      className="project-hero-image project-scroll-hero"
      data-animated={animate}
    >
      <motion.div
        className="project-hero-aperture"
        style={{ clipPath: animate ? aperture : "inset(0%)" }}
      >
        <motion.div
          className="project-hero-photo"
          style={{ scale: animate ? scale : 1, y: animate ? drift : 0 }}
        >
          <Image
            src={project.cover}
            alt={project.coverAlt}
            fill
            sizes="100vw"
            preload
          />
        </motion.div>
        <span className="project-image-note">Design visualization</span>
      </motion.div>
    </div>
  );
}
