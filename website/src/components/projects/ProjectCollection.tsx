"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { ProjectShowcase } from "./ProjectShowcase";
import type { Project } from "@/types/project";

const filters = ["All", "Interiors", "Exteriors"] as const;
type Filter = (typeof filters)[number];
const subscribeHydration = () => () => {};

export function ProjectCollection({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  );
  const selection = useMemo(
    () =>
      projects.filter(
        (project) => filter === "All" || project.category === filter,
      ),
    [projects, filter],
  );

  return (
    <div className="project-collection">
      <div
        className="portfolio-filters"
        role="group"
        aria-label="Filter projects"
      >
        {filters.map((category) => (
          <button
            key={category}
            type="button"
            disabled={!hydrated}
            aria-pressed={filter === category}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
        <noscript>
          <p>
            All projects are shown. Enable JavaScript to filter the collection.
          </p>
        </noscript>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {filter === "All"
          ? "Showing all projects"
          : `Showing ${filter === "Interiors" ? "interior" : "exterior"} projects`}
      </p>
      {selection.length === 0 ? (
        <p className="portfolio-empty">No projects in this category yet.</p>
      ) : (
        <ProjectShowcase key={filter} projects={selection} />
      )}
    </div>
  );
}
