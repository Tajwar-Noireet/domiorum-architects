import type { Metadata } from "next";
import { ProjectBrowser } from "@/components/projects/ProjectBrowser";
import { projects, experienceCredit } from "@/content/projects";
export const metadata: Metadata = { title: "Selected work & experience" };
export default function Projects() {
  return (
    <div className="section page-section">
      <div className="page-heading">
        <p className="eyebrow">The portfolio</p>
        <h1>
          A closer look
          <br />
          at the work.
        </h1>
        <p>
          Residential interiors from Zarin Nawar’s previous professional
          experience.
        </p>
      </div>
      <ProjectBrowser projects={projects} />
      <div className="project-credit-panel">
        <p className="eyebrow">About this selection</p>
        <p>{experienceCredit}</p>
        <p>
          This interior project illustrates the founder’s experience before
          establishing Domiorum. All project images are design visualizations.
        </p>
      </div>
    </div>
  );
}
