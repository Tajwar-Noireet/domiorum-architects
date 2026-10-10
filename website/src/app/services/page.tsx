import { HoverText } from "@/components/ui/HoverText";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { services, process } from "@/content/services";
import { LinkButton } from "@/components/ui/LinkButton";
import { ProjectQuestions } from "@/components/home/ProjectQuestions";
import { DirectionalArrow } from "@/components/ui/DirectionalArrow";
export const metadata: Metadata = {
  title: "Our services",
  description:
    "Residential interiors, architecture, renovations and technical design support in Dhaka. Find the right scope for your home with Domiorum Architects.",
};
export default function Services() {
  return (
    <>
      <section className="section page-heading services-page-heading">
        <p className="eyebrow">Our services</p>
        <h1 data-folio-reveal>
          <HoverText>
            The big picture.
            <br />
            The small details.
          </HoverText>
        </h1>
        <p data-folio-reveal>
          Architecture and interiors, considered together. We agree the right
          scope for your project from the beginning.
        </p>
        <nav className="service-index" aria-label="Services on this page">
          {services.map((service, index) => (
            <a href={`#service-${index + 1}`} key={service.title}>
              <span className="service-index-number">0{index + 1}</span>
              <span>{service.title}</span>
              <DirectionalArrow direction="down" />
            </a>
          ))}
        </nav>
      </section>
      <div className="services-banner" data-folio-image>
        <Image
          src="/images/interiors/kitchen.webp"
          alt="Kitchen visualization with warm stone surfaces, integrated lighting and fitted cabinetry"
          fill
          sizes="100vw"
        />
        <span className="project-image-note">Design visualization</span>
      </div>
      <section className="section service-details">
        {services.map((service, index) => (
          <article
            id={`service-${index + 1}`}
            key={service.title}
            data-folio-reveal
          >
            <span className="eyebrow">0{index + 1}</span>
            <div className="service-title">
              <h2>
                <HoverText>{service.title}</HoverText>
              </h2>
              <p>{service.fit}</p>
              <Link className="text-link" href="/book-consultation">
                Discuss your project <DirectionalArrow />
              </Link>
            </div>
            <div className="service-description">
              <p>{service.description}</p>
              <ul>
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <dl className="service-scope">
                <dt>The scope we discuss</dt>
                <dd>{service.scope}</dd>
              </dl>
            </div>
          </article>
        ))}
      </section>
      <section
        className="section process-section services-process"
        data-process-track
      >
        <div className="section-heading" data-folio-reveal>
          <div>
            <p className="eyebrow">Working together</p>
            <h2>
              <HoverText>
                A clear path from
                <br />
                the first conversation.
              </HoverText>
            </h2>
          </div>
          <p className="section-aside">Your brief shapes each stage.</p>
        </div>
        <div className="process-rule" aria-hidden="true">
          <span data-process-progress />
        </div>
        <ol className="process-grid">
          {process.map((step, index) => (
            <li key={step.title} data-process-step>
              <span className="process-number">0{index + 1}</span>
              <h3>
                <HoverText>{step.title}</HoverText>
              </h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="consultation-prompt" data-folio-reveal>
          <div>
            <h3>
              <HoverText>Start with a consultation.</HoverText>
            </h3>
            <p>
              Discuss your space, priorities and the next steps before
              committing to a wider scope.
            </p>
          </div>
          <LinkButton href="/book-consultation">About consultations</LinkButton>
        </div>
      </section>
      <ProjectQuestions />
    </>
  );
}
