import Image from "next/image";
import Link from "next/link";
import { DirectionalArrow } from "@/components/ui/DirectionalArrow";
import { LinkButton } from "@/components/ui/LinkButton";
import type { Project } from "@/types/project";

export function FeaturedResidence({ project }: { project: Project }) {
  const details = [project.images[1], project.images[3]].filter(Boolean);

  return (
    <article className="featured-residence" aria-label={project.title}>
      <div className="residence-layout">
        <Link
          className="residence-image"
          href={`/projects/${project.slug}`}
          aria-label={`View ${project.title}`}
          data-image-reveal
        >
          <Image
            src={project.cover}
            alt={project.coverAlt}
            fill
            sizes="(max-width: 800px) 100vw, 60vw"
            quality={85}
          />
        </Link>
        <div className="residence-copy" data-reveal>
          <p className="eyebrow">{project.category} / Dhaka</p>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <dl className="residence-facts">
            <div>
              <dt>{project.areaLabel}</dt>
              <dd>{project.area}</dd>
            </div>
            <div>
              <dt>Image type</dt>
              <dd>Design visualizations</dd>
            </div>
          </dl>
          <LinkButton href={`/projects/${project.slug}`} light>
            Inside the residence
          </LinkButton>
        </div>
      </div>
      <div className="residence-details">
        {details.map((detail) => (
          <Link
            key={detail.src}
            href={`/projects/${project.slug}#rooms`}
            className="residence-detail"
          >
            <figure>
              <div className="residence-detail-image" data-image-reveal>
                <Image
                  src={detail.src}
                  alt={detail.alt}
                  fill
                  sizes="(max-width: 600px) 100vw, 35vw"
                />
              </div>
              <figcaption>
                {detail.caption}
                <DirectionalArrow direction="up-right" />
              </figcaption>
            </figure>
          </Link>
        ))}
        <div className="residence-observation" data-reveal>
          <h4>A home that works together.</h4>
          <p>{project.approach}</p>
          <Link href={`/projects/${project.slug}#rooms`} className="text-link">
            See the rooms <DirectionalArrow />
          </Link>
        </div>
      </div>
    </article>
  );
}
