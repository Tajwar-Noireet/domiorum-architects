import { HoverText } from "@/components/ui/HoverText";
import type { Metadata } from "next";
import { ProjectCollection } from "@/components/projects/ProjectCollection";
import { allProjects } from "@/content/projects";
import { HomeMotion } from "@/components/home/HomeMotion";
export const metadata: Metadata = { title: "Selected projects" };
export default function Projects() {
  return (
    <HomeMotion>
      <div className="section page-section">
        <div className="page-heading">
          <p className="eyebrow">The portfolio</p>
          <h1 data-folio-reveal>
            <HoverText>
              A closer look
              <br />
              at the work.
            </HoverText>
          </h1>
          <p data-folio-reveal>
            Explore our residential interiors and architecture, one project at a
            time.
          </p>
        </div>
        <ProjectCollection projects={allProjects} />
        <div className="project-credit-panel">
          <p className="eyebrow">About this selection</p>
          <p>
            All project images are design visualizations. Select a project to
            explore its spaces.
          </p>
        </div>
      </div>
    </HomeMotion>
  );
}
