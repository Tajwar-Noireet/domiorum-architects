import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/project";

export function ProjectCard({
  project,
  index = 0,
  wide = false,
}: {
  project: Project;
  index?: number;
  wide?: boolean;
}) {
  return (
    <article className="project-card">
      <Link href={`/projects/${project.slug}`} className="project-card-link">
        <div className="project-card-image">
          <Image
            src={project.cover}
            alt={project.coverAlt}
            fill
            sizes={
              wide
                ? "89vw"
                : "(max-width: 700px) 100vw, (max-width: 1000px) 70vw, 50vw"
            }
          />
          <span className="project-image-note">Design visualization</span>
          <span className="project-arrow" aria-hidden="true">
            ↗
          </span>
        </div>
        <div className="project-card-meta">
          <span className="eyebrow">
            0{index + 1} / {project.category}
          </span>
          <span>{project.location.split(",")[0]}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
      </Link>
    </article>
  );
}
