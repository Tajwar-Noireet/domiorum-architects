"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import dimensions from "@/content/gallery-dimensions.json";
import type { Project } from "@/types/project";

export function ProjectLayoutGrid({
  project,
  credit,
}: {
  project: Project;
  credit?: string;
}) {
  const viewer = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const active = project.images[index];
  const step = (delta: number) =>
    setIndex(
      (current) =>
        (current + delta + project.images.length) % project.images.length,
    );

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
        {project.images.map((image, position) => (
          <figure key={image.src}>
            <button
              type="button"
              className="project-layout-tile"
              aria-label={`Enlarge ${image.caption}`}
              onClick={() => {
                setIndex(position);
                setOpen(true);
                viewer.current?.showModal();
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={
                  dimensions[image.src as keyof typeof dimensions]?.[0] ?? 1600
                }
                height={
                  dimensions[image.src as keyof typeof dimensions]?.[1] ?? 1067
                }
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
        aria-label="Project image"
        onClose={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            step(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        <form method="dialog">
          <button type="submit">Close image</button>
        </form>
        {open && active && (
          <div className="project-layout-preview">
            <Image src={active.src} alt={active.alt} fill sizes="94vw" />
          </div>
        )}
        <div className="project-layout-viewer-controls">
          <button type="button" onClick={() => step(-1)}>
            Previous
          </button>
          <p aria-live="polite">
            {active?.caption} · {index + 1} / {project.images.length}
          </p>
          <button type="button" onClick={() => step(1)}>
            Next
          </button>
        </div>
      </dialog>
    </section>
  );
}
