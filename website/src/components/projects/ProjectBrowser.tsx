"use client";
import { useState } from "react";
import type { Project } from "@/types/project";
import { ProjectCard } from "./ProjectCard";

export function ProjectBrowser({ projects }: { projects: Project[] }) {
  const categories = [
    "All work",
    ...new Set(projects.map((project) => project.category)),
  ];
  const [selected, setSelected] = useState<string>("All work");
  const visible = projects.filter(
    (project) => selected === "All work" || project.category === selected,
  );
  return (
    <>
      {categories.length > 2 && (
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
      )}
      <p className="sr-only" role="status">
        {visible.length} {visible.length === 1 ? "project" : "projects"} shown
      </p>
      <div className="projects-grid">
        {visible.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={projects.indexOf(project)}
            wide={projects.length === 1}
          />
        ))}
      </div>
    </>
  );
}
