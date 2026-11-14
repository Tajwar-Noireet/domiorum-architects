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
          <h1 data-folio-reveal>
            <HoverText>Projects</HoverText>
          </h1>
          <p data-folio-reveal>
            Explore our residential interiors and architecture, one project at a
            time.
          </p>
        </div>
        <ProjectCollection projects={allProjects} />
      </div>
    </HomeMotion>
  );
}
