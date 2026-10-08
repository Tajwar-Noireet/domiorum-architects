import { DirectionalArrow } from "@/components/ui/DirectionalArrow";
import { HoverText } from "@/components/ui/HoverText";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, allProjects, experienceCredit } from "@/content/projects";
import { ProjectScrollHero } from "@/components/projects/ProjectScrollHero";
import { ProjectScrollGallery } from "@/components/projects/ProjectScrollGallery";
import {
  ProjectMotionProvider,
  ProjectMotionToggle,
} from "@/components/projects/ProjectMotion";
export function generateStaticParams() {
  return allProjects.map((project) => ({ slug: project.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = allProjects.find((p) => p.slug === slug);
  return { title: project?.title || "Project", description: project?.summary };
}
export default async function Project({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = allProjects.find((p) => p.slug === slug);
  if (!project) notFound();
  const isLegacy = project.slug === "selim-residence";
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <ProjectMotionProvider>
      <section className="section project-heading">
        <Link href="/projects" className="back-link">
          <DirectionalArrow direction="left" /> All projects
        </Link>
        {project.images.length > 0 && <ProjectMotionToggle />}
        <p className="eyebrow">
          {project.category}
          {project.location ? ` / ${project.location}` : ""}
        </p>
        <h1>
          <HoverText>{project.title}</HoverText>
        </h1>
        <p className="project-standfirst">{project.summary}</p>
      </section>
      {project.images.length > 0 ? (
        <ProjectScrollHero project={project} />
      ) : (
        <div className="project-hero-image">
          <Image
            src={project.cover}
            alt={project.coverAlt}
            fill
            sizes="100vw"
            preload
          />
          <span className="project-image-note">Design visualization</span>
        </div>
      )}
      <section className="section project-story">
        <dl className="project-facts">
          {project.location && (
            <div>
              <dt>Location</dt>
              <dd>{project.location}</dd>
            </div>
          )}
          {project.area && (
            <div>
              <dt>{project.areaLabel}</dt>
              <dd>{project.area}</dd>
            </div>
          )}
          {isLegacy && (
            <>
              <div>
                <dt>Practice</dt>
                <dd>Innova Architects</dd>
              </div>
              <div>
                <dt>Zarin’s role</dt>
                <dd>Associate Architect</dd>
              </div>
              <div>
                <dt>Project Architect</dt>
                <dd>Ar Sanjida Shams</dd>
              </div>
            </>
          )}
          <div>
            <dt>Image type</dt>
            <dd>Design visualizations</dd>
          </div>
        </dl>
        <div>
          <p className="eyebrow">The project</p>
          <h2>
            <HoverText>{project.summary}</HoverText>
          </h2>
          <p>{project.description}</p>
          <div className="approach-copy">
            <p className="eyebrow">The approach</p>
            <p>{project.approach}</p>
          </div>
        </div>
      </section>
      {project.images.length > 0 && (
        <ProjectScrollGallery
          project={project}
          credit={isLegacy ? experienceCredit : undefined}
        />
      )}
      <Link
        href={projects.length > 1 ? `/projects/${next.slug}` : "/projects"}
        className="next-project section"
      >
        <div>
          <p className="eyebrow">
            {projects.length > 1 ? "Next project" : "The portfolio"}
          </p>
          <h2>
            <HoverText>
              {projects.length > 1 ? next.title : "Back to selected work"}
            </HoverText>
          </h2>
        </div>
        <DirectionalArrow />
      </Link>
    </ProjectMotionProvider>
  );
}
