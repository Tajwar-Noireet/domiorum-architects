import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/project";

export function ProjectShowcase({ projects }: { projects: Project[] }) {
  return (
    <ul className="project-showcase" aria-label="Project showcase">
      {projects.map((project) => (
        <li key={project.slug} className="showcase-project">
          <Link href={`/projects/${project.slug}`} className="showcase-panel">
            <span className="showcase-image">
              <Image
                src={project.cover}
                alt=""
                fill
                sizes="(max-width: 40rem) 48vw, (max-width: 64rem) 32vw, 34vw"
              />
            </span>
            <span className="showcase-label">{project.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
