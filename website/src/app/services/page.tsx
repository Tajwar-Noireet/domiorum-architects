import { HoverText } from "@/components/ui/HoverText";
import type { Metadata } from "next";
import Image from "next/image";
import { services, process } from "@/content/services";
import { LinkButton } from "@/components/ui/LinkButton";
import { ProjectQuestions } from "@/components/home/ProjectQuestions";
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
        <h1>
          <HoverText>
            The big picture.
            <br />
            The small details.
          </HoverText>
        </h1>
        <p>
          Architecture and interiors, considered together. We agree the right
          scope for your project from the beginning.
        </p>
      </section>
      <div className="services-banner">
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
          <article id={`service-${index + 1}`} key={service.title}>
            <span className="eyebrow">0{index + 1}</span>
            <h2>
              <HoverText>{service.title}</HoverText>
            </h2>
            <div>
              <p>{service.description}</p>
              <ul>
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <dl className="service-scope">
                <dt>A good fit for</dt>
                <dd>{service.fit}</dd>
                <dt>The scope we discuss</dt>
                <dd>{service.scope}</dd>
              </dl>
            </div>
          </article>
        ))}
      </section>
      <section className="section process-section">
        <p className="eyebrow">Working together</p>
        <h2>
          <HoverText>
            A clear path
            <br />
            from the first conversation.
          </HoverText>
        </h2>
        <ol className="process-grid">
          {process.map((step, index) => (
            <li key={step.title}>
              <span className="process-number">0{index + 1}</span>
              <h3>
                <HoverText>{step.title}</HoverText>
              </h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="consultation-prompt">
          <h3>
            <HoverText>Start with a consultation.</HoverText>
          </h3>
          <p>
            Discuss your space, priorities and the next steps before committing
            to a wider scope.
          </p>
          <LinkButton href="/book-consultation">About consultations</LinkButton>
        </div>
      </section>
      <ProjectQuestions />
    </>
  );
}
