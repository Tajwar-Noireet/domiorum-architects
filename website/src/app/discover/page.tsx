import type { Metadata } from "next";
import Image from "next/image";
import { HoverText } from "@/components/ui/HoverText";
import { LinkButton } from "@/components/ui/LinkButton";
import { team } from "@/content/team";

export const metadata: Metadata = {
  title: "Discover us",
  description:
    "Meet Zarin Nawar, co-founder and principal architect of Domiorum Architects.",
};

export default function Discover() {
  return (
    <div className="section page-section discover-page">
      <div className="page-heading">
        <p className="eyebrow">Discover us</p>
        <h1 data-folio-reveal>
          <HoverText>
            The people behind
            <br />
            the spaces.
          </HoverText>
        </h1>
        <p data-folio-reveal>
          Meet our co-founder and the perspective behind the practice.
        </p>
      </div>
      {team.map((person) => (
        <article key={person.slug} aria-labelledby={`${person.slug}-name`}>
          <div className="discover-profile">
            <figure className="discover-portrait" data-folio-image>
              <Image
                src={person.portrait}
                alt={`${person.name}, ${person.role} of Domiorum Architects`}
                fill
                sizes="(max-width: 700px) 260px, (max-width: 1000px) 32vw, 360px"
                preload
              />
              <figcaption>Domiorum Architects / Dhaka</figcaption>
            </figure>
            <div className="discover-bio" data-folio-reveal>
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
        </article>
      ))}
    </div>
  );
}
