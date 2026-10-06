import Image from "next/image";
import Link from "next/link";
import { ScrollHero } from "@/components/home/ScrollHero";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { LinkButton } from "@/components/ui/LinkButton";
import { projects, experienceCredit } from "@/content/projects";
import { services, process } from "@/content/services";

export default function Home() {
  return (
    <>
      <ScrollHero />
      <section id="introduction" className="section intro-section">
        <div className="section-label">
          <span className="eyebrow">01 / Our perspective</span>
          <span className="small-note">
            Architecture. Interiors. Everyday life.
          </span>
        </div>
        <div className="intro-grid">
          <h2>
            A home begins
            <br />
            with <span className="muted">you.</span>
          </h2>
          <div className="intro-copy">
            <p>
              The way you gather. The things you keep. The quiet moments in
              between.
            </p>
            <p>
              At Domiorum, we start with the people who will live in a space. We
              bring together architecture and interiors to shape homes that feel
              considered, personal and comfortable.
            </p>
            <Link href="/services" className="text-link">
              How we work <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="section selected-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">02 / Selected work & experience</p>
            <h2>
              Spaces with
              <br />a point of view.
            </h2>
          </div>
          <Link href="/projects" className="text-link">
            View all projects <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="featured-grid">
          {projects.slice(0, 2).map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
        <p className="portfolio-credit">
          {experienceCredit} Images shown are design visualizations.
        </p>
      </section>
      <section className="services-section section">
        <div className="services-intro">
          <p className="eyebrow">03 / What we do</p>
          <h2>
            From the whole
            <br />
            to the detail.
          </h2>
          <p>
            A new home, a different layout, or a room ready for change. Our
            scope starts with what your project needs.
          </p>
          <LinkButton href="/services">Explore our services</LinkButton>
        </div>
        <div className="service-list">
          {services.map((service, index) => (
            <Link href={`/services#service-${index + 1}`} key={service.title}>
              <span className="service-number">0{index + 1}</span>
              <div>
                <h3>{service.title}</h3>
                <p>{service.items[0]}</p>
              </div>
              <span className="service-link-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section id="studio" className="studio-section section">
        <div className="studio-photo">
          <Image
            src="/images/studio/zarin-nawar.webp"
            alt="Zarin Nawar, founder and CEO of Domiorum Architects"
            fill
            sizes="(max-width: 700px) 100vw, 40vw"
          />
          <span className="studio-photo-note">Zarin Nawar / Founder & CEO</span>
        </div>
        <div className="studio-copy">
          <p className="eyebrow">04 / The studio</p>
          <h2>
            A personal approach.
            <br />A considered home.
          </h2>
          <p>
            Domiorum Architects is a new architecture and interiors practice
            founded by Zarin Nawar, based in Bashundhara R/A, Dhaka.
          </p>
          <p>
            Zarin brings a background in residential architecture and interior
            design, with previous professional experience at Innova Architects.
            The studio begins each project with a conversation about the people,
            routines and ambitions behind it.
          </p>
          <Link href="/contact" className="text-link">
            Meet us over a conversation <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
      <section className="section process-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">05 / A shared process</p>
            <h2>
              Good design starts
              <br />
              with listening.
            </h2>
          </div>
          <p className="section-aside">
            Clear conversations.
            <br />
            Thoughtful decisions.
            <br />
            One step at a time.
          </p>
        </div>
        <ol className="process-grid">
          {process.map((step, index) => (
            <li key={step.title}>
              <span className="process-number">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
