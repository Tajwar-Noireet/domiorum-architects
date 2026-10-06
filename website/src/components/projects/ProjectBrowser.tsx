"use client";
import { useState } from "react";
import type { Project } from "@/types/project";
import { ProjectCard } from "./ProjectCard";

const categories = ["All work", "Interiors", "Architecture"] as const;
export function ProjectBrowser({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<string>("All work");
  const visible = projects.filter(
    (project) => selected === "All work" || project.category === selected,
  );
  return (
    <>
      <div className="project-filters" aria-label="Filter projects">
        {categories.map((category) => (
          <button
            key={category}
            aria-pressed={selected === category}
            onClick={() => setSelected(category)}
          >
            {category}
            <span>
              {category === "All work"
                ? projects.length
                : projects.filter((p) => p.category === category).length}
            </span>
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">
        {visible.length} projects shown
      </p>
      <div className="projects-grid">
        {visible.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={projects.indexOf(project)}
          />
        ))}
      </div>
    </>
  );
}
