"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Project } from "@/types/project";

export function ProjectLayoutGrid({
  project,
  credit,
}: {
  project: Project;
  credit?: string;
}) {
  const viewer = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<Project["images"][number] | null>(null);

  return (
    <section
      id="rooms"
      className="section project-layout"
      aria-labelledby="project-layout-title"
    >
      <h2 id="project-layout-title">
        {project.category === "Exteriors"
          ? "Exterior views"
          : "Inside the project"}
      </h2>
      <div className="project-layout-grid">
        {project.images.map((image) => (
          <figure key={image.src}>
            <button
              type="button"
              className="project-layout-tile"
              aria-label={`Enlarge ${image.caption}`}
              onClick={() => {
                setActive(image);
                viewer.current?.showModal();
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 700px) 100vw, 66vw"
              />
            </button>
            <figcaption>{image.caption}</figcaption>
          </figure>
        ))}
      </div>
      {credit && <p className="portfolio-credit">{credit}</p>}
      <dialog
        ref={viewer}
        className="project-layout-viewer"
        aria-label={active?.caption ?? "Project image"}
      >
        <form method="dialog">
          <button type="submit">Close image</button>
        </form>
        {active && (
          <div className="project-layout-preview">
            <Image src={active.src} alt={active.alt} fill sizes="94vw" />
          </div>
        )}
      </dialog>
    </section>
  );
}
