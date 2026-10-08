import type { Metadata } from "next";
import Image from "next/image";
import { HoverText } from "@/components/ui/HoverText";
import { LinkButton } from "@/components/ui/LinkButton";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { allProjects, experienceCredit } from "@/content/projects";
import { team } from "@/content/team";

export const metadata: Metadata = {
  title: "Discover us",
  description:
    "Meet Zarin Nawar, founder and CEO of Domiorum Architects, and explore current studio projects and her separately credited previous work.",
};

export default function Discover() {
  return (
    <div className="section page-section discover-page">
      <div className="page-heading">
        <p className="eyebrow">Discover us</p>
        <h1>
          <HoverText>
            The people behind
            <br />
            the spaces.
          </HoverText>
        </h1>
        <p>Meet our founder and explore the work behind the practice.</p>
      </div>
      {team.map((person) => (
        <article key={person.slug} aria-labelledby={`${person.slug}-name`}>
          <div className="discover-profile">
            <figure className="discover-portrait">
              <Image
                src={person.portrait}
                alt={`${person.name}, ${person.role} of Domiorum Architects`}
                fill
                sizes="(max-width: 700px) 90vw, 40vw"
                preload
              />
              <figcaption>Domiorum Architects / Dhaka</figcaption>
            </figure>
            <div className="discover-bio">
              <p className="eyebrow">{person.role}</p>
              <h2 id={`${person.slug}-name`}>
                <HoverText>{person.name}</HoverText>
              </h2>
              <p>{person.bio}</p>
              <LinkButton href="/book-consultation">
                Talk to the studio
              </LinkButton>
            </div>
          </div>
          <section
            className="discover-work"
            aria-labelledby={`${person.slug}-studio`}
          >
            <div className="discover-work-heading">
              <p className="eyebrow">01 / Domiorum Architects</p>
              <h2 id={`${person.slug}-studio`}>
                <HoverText>Current studio projects</HoverText>
              </h2>
            </div>
            <div className="discover-projects">
              {allProjects
                .filter((project) =>
                  person.studioProjects.includes(project.slug),
                )
                .map((project, index) => (
                  <ProjectCard
                    key={project.slug}
                    project={project}
                    index={index}
                  />
                ))}
            </div>
          </section>
          <section
            className="discover-work discover-previous"
            aria-labelledby={`${person.slug}-previous`}
          >
            <div className="discover-work-heading">
              <p className="eyebrow">02 / Previous experience</p>
              <h2 id={`${person.slug}-previous`}>
                <HoverText>Work at Innova Architects</HoverText>
              </h2>
              <p className="discover-credit">{experienceCredit}</p>
            </div>
            <div className="discover-projects">
              {allProjects
                .filter((project) =>
                  person.previousProjects.includes(project.slug),
                )
                .map((project, index) => (
                  <ProjectCard
                    key={project.slug}
                    project={project}
                    index={index}
                  />
                ))}
            </div>
          </section>
        </article>
      ))}
      <p className="portfolio-credit">
        Project images shown are design visualizations.
      </p>
    </div>
  );
}
