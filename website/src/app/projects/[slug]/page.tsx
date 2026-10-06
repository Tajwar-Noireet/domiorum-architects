import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, experienceCredit } from "@/content/projects";
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return { title: project?.title || "Project", description: project?.summary };
}
export default async function Project({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <>
      <section className="section project-heading">
        <Link href="/projects" className="back-link">
          ← All projects
        </Link>
        <p className="eyebrow">
          {project.category} / {project.location}
        </p>
        <h1>{project.title}</h1>
        <p className="project-standfirst">{project.summary}</p>
      </section>
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
      <section className="section project-story">
        <dl className="project-facts">
          <div>
            <dt>Location</dt>
            <dd>{project.location}</dd>
          </div>
          <div>
            <dt>{project.areaLabel}</dt>
            <dd>{project.area}</dd>
          </div>
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
          <div>
            <dt>Image type</dt>
            <dd>Design visualizations</dd>
          </div>
        </dl>
        <div>
          <p className="eyebrow">The brief</p>
          <h2>{project.summary}</h2>
          <p>{project.description}</p>
          <div className="approach-copy">
            <p className="eyebrow">The approach</p>
            <p>{project.approach}</p>
          </div>
        </div>
      </section>
      <section className="section project-gallery" aria-label="Project gallery">
        {project.images.map((image) => (
          <figure key={image.src}>
            <div className="gallery-image">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 700px) 100vw, 85vw"
              />
            </div>
            <figcaption>
              {image.caption}
              <span>Design visualization</span>
            </figcaption>
          </figure>
        ))}
        <p className="portfolio-credit">{experienceCredit}</p>
      </section>
      <Link href={`/projects/${next.slug}`} className="next-project section">
        <div>
          <p className="eyebrow">Next project</p>
          <h2>{next.title}</h2>
        </div>
        <span aria-hidden="true">↗</span>
      </Link>
    </>
  );
}
