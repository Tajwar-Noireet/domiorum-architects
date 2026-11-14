"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { CircularGallery } from "@/components/ui/CircularGallery";
import dimensions from "@/content/gallery-dimensions.json";
import type { Project } from "@/types/project";

export function ProjectLayoutGrid({
  project,
  credit,
}: {
  project: Project;
  credit?: string;
}) {
  const interior = project.category === "Interiors";
  const rail = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState(0);
  const move = (delta: number) => {
    if (
      interior &&
      rail.current?.previousElementSibling?.getAttribute("data-ready") ===
        "true"
    ) {
      setCenter((value) => wrap(value + delta));
      return;
    }
    const track = rail.current;
    if (!track) return;
    const next = Math.max(
      0,
      Math.min(project.images.length - 1, center + delta),
    );
    const card = track.children[next] as HTMLElement;
    track.scrollTo({
      left: card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2,
      behavior: "smooth",
    });
  };
  const wrap = (value: number) =>
    (value + project.images.length) % project.images.length;
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
      {interior && (
        <CircularGallery
          items={project.images}
          index={center}
          select={(value) => setCenter(wrap(value))}
        />
      )}
      <div
        ref={rail}
        className="project-carousel"
        role="group"
        aria-label="Project photos"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
        onScroll={(event) => {
          const track = event.currentTarget;
          const midpoint = track.scrollLeft + track.clientWidth / 2;
          let closest = 0;
          let distance = Infinity;
          Array.from(track.children).forEach((child, position) => {
            const card = child as HTMLElement;
            const offset = Math.abs(
              card.offsetLeft + card.offsetWidth / 2 - midpoint,
            );
            if (offset < distance) {
              distance = offset;
              closest = position;
            }
          });
          setCenter(closest);
        }}
      >
        {project.images.map((image, position) => (
          <figure
            key={image.src}
            data-side={
              position < center
                ? "left"
                : position > center
                  ? "right"
                  : "center"
            }
          >
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
                quality={85}
                sizes="(max-width: 700px) 100vw, 66vw"
              />
            </button>
            <figcaption>{image.caption}</figcaption>
          </figure>
        ))}
      </div>
      <div className="project-layout-viewer-controls project-carousel-controls">
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={!interior && center === 0}
        >
          Previous view
        </button>
        <span>
          {center + 1} / {project.images.length}
        </span>
        <button
          type="button"
          onClick={() => move(1)}
          disabled={!interior && center === project.images.length - 1}
        >
          Next view
        </button>
      </div>
      {interior && (
        <button
          type="button"
          className="project-circular-enlarge"
          onClick={() => {
            setIndex(center);
            setOpen(true);
            viewer.current?.showModal();
          }}
        >
          Enlarge image
        </button>
      )}
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
            <Image
              src={active.src}
              alt={active.alt}
              fill
              quality={85}
              sizes="94vw"
            />
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
