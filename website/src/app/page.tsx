import { HoverText } from "@/components/ui/HoverText";
import Image from "next/image";
import Link from "next/link";
import { ScrollHero } from "@/components/home/ScrollHero";
import { HomeMotion } from "@/components/home/HomeMotion";
import { InteriorGallery } from "@/components/home/InteriorGallery";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { LinkButton } from "@/components/ui/LinkButton";
import { projects, experienceCredit } from "@/content/projects";
import { services, process } from "@/content/services";

export default function Home() {
  return (
    <HomeMotion>
      <ScrollHero />
      <section id="introduction" className="section home-perspective">
        <div className="section-label">
          <span className="eyebrow">01 / Our perspective</span>
          <span className="small-note">Architecture · Interiors · Dhaka</span>
        </div>
        <div className="perspective-grid">
          <h2 data-reveal>
            <HoverText>
              A home begins
              <br />
              with <span>you.</span>
            </HoverText>
          </h2>
          <div data-reveal>
            <p className="perspective-lead">How you live comes first.</p>
            <p>
              Where you gather, how you work, what you need to store. We begin
              with the everyday details and build the design around them.
            </p>
            <Link href="/services" className="text-link">
              <HoverText variant="link">
                How we work <span aria-hidden="true">↗</span>
              </HoverText>
            </Link>
          </div>
        </div>
        <div className="perspective-images">
          <figure className="perspective-wide" data-image-reveal data-parallax>
            <Image
              src="/images/interiors/dining.webp"
              alt="Interior visualization connecting dining, kitchen and fitted storage"
              fill
              sizes="(max-width: 600px) 100vw, 65vw"
              quality={85}
            />
          </figure>
          <figure
            className="perspective-detail"
            data-image-reveal
            data-parallax
          >
            <Image
              src="/images/interiors/bedroom-angle.webp"
              alt="Bedroom visualization with layered curtains, built-in timber shelving and a dressing area"
              fill
              sizes="(max-width: 600px) 65vw, 32vw"
              quality={85}
            />
            <figcaption>Space for the everyday.</figcaption>
          </figure>
        </div>
      </section>
      <InteriorGallery />
      <section className="section home-selected">
        <div className="section-heading" data-reveal>
          <div>
            <p className="eyebrow">03 / Selected work & experience</p>
            <h2>
              <HoverText>
                Designed for
                <br />
                everyday living.
              </HoverText>
            </h2>
          </div>
          <Link href="/projects" className="text-link">
            <HoverText variant="link">
              View all projects <span aria-hidden="true">↗</span>
            </HoverText>
          </Link>
        </div>
        <div className="featured-grid">
          {projects.slice(0, 2).map((project, index) => (
            <div key={project.slug} data-image-reveal>
              <ProjectCard
                project={project}
                index={index}
                wide={projects.length === 1}
              />
            </div>
          ))}
        </div>
        <p className="portfolio-credit">
          {experienceCredit} Images shown are design visualizations.
        </p>
      </section>
      <section className="section home-services">
        <div className="home-services-heading" data-reveal>
          <p className="eyebrow">04 / What we do</p>
          <h2>
            <HoverText>
              One home.
              <br />
              <span>Every scale.</span>
            </HoverText>
          </h2>
          <p>
            From the building and its layout to the surfaces you touch every
            day.
          </p>
          <LinkButton href="/services" light>
            Explore our services
          </LinkButton>
        </div>
        <div className="home-service-links">
          {services.map((service, index) => (
            <Link
              data-reveal
              href={`/services#service-${index + 1}`}
              key={service.title}
            >
              <span className="eyebrow">0{index + 1}</span>
              <div>
                <h3>
                  <HoverText>{service.title}</HoverText>
                </h3>
                <p>{service.items[0]}</p>
              </div>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
        <div className="home-service-image" data-image-reveal data-parallax>
          <Image
            src="/images/interiors/utility.webp"
            alt="Kitchen and utility visualization with concealed cabinetry and dark stone worktops"
            fill
            sizes="(max-width: 600px) 100vw, 75vw"
          />
        </div>
      </section>
      <section id="studio" className="studio-section section home-studio">
        <div className="studio-photo" data-image-reveal>
          <Image
            src="/images/studio/zarin-nawar.webp"
            alt="Zarin Nawar, founder and CEO of Domiorum Architects"
            fill
            sizes="(max-width: 700px) 100vw, 40vw"
          />
          <span className="studio-photo-note">Zarin Nawar / Founder & CEO</span>
        </div>
        <div className="studio-copy" data-reveal>
          <p className="eyebrow">05 / The studio</p>
          <h2>
            <HoverText>
              Let’s make
              <br />
              your home
              <br />
              <span>your own.</span>
            </HoverText>
          </h2>
          <p>
            Domiorum Architects is an architecture and interiors practice
            founded by Zarin Nawar, based in Bashundhara R/A, Dhaka.
          </p>
          <p>
            With a background in residential design and previous professional
            experience at Innova Architects, Zarin brings architecture,
            interiors and the way people live into one conversation.
          </p>
          <Link href="/contact" className="text-link">
            <HoverText variant="link">
              Meet the studio <span aria-hidden="true">↗</span>
            </HoverText>
          </Link>
        </div>
      </section>
      <section className="section process-section home-process">
        <div className="section-heading" data-reveal>
          <div>
            <p className="eyebrow">06 / Working together</p>
            <h2>
              <HoverText>First, we listen.</HoverText>
            </h2>
          </div>
          <p className="section-aside">
            A clear path from your first
            <br />
            idea to an agreed design.
          </p>
        </div>
        <ol className="process-grid">
          {process.map((step, index) => (
            <li key={step.title} data-reveal>
              <span className="process-number">0{index + 1}</span>
              <h3>
                <HoverText>{step.title}</HoverText>
              </h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </HomeMotion>
  );
}
