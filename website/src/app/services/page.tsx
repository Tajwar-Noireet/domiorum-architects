import { HoverText } from "@/components/ui/HoverText";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { serviceDepartments, process } from "@/content/services";
import { LinkButton } from "@/components/ui/LinkButton";
import { ProjectQuestions } from "@/components/home/ProjectQuestions";
import { DirectionalArrow } from "@/components/ui/DirectionalArrow";
export const metadata: Metadata = {
  title: "Our services",
  description:
    "Interior design packages for homes and commercial spaces, and architecture consultancy from Domiorum Architects in Dhaka.",
};
export default function Services() {
  return (
    <>
      <section className="section page-heading services-page-heading">
        <h1 data-folio-reveal>
          <HoverText>Architecture & interiors</HoverText>
        </h1>
        <p data-folio-reveal>
          Interior design and architecture consultancy for homes and commercial
          spaces.
        </p>
        <nav className="service-index" aria-label="Services on this page">
          {serviceDepartments.map((department) => (
            <a href={`#${department.id}`} key={department.id}>
              <span>{department.title}</span>
              <DirectionalArrow direction="down" />
            </a>
          ))}
        </nav>
      </section>
      <div className="services-banner">
        <Image
          src="/images/interiors/kitchen.webp"
          alt="Kitchen visualization with warm stone surfaces, integrated lighting and fitted cabinetry"
          fill
          sizes="100vw"
        />
      </div>
      <div className="section service-details">
        {serviceDepartments.map((department) => (
          <section
            key={department.id}
            aria-labelledby={`${department.id}-title`}
          >
            <article id={department.id} data-folio-reveal>
              <div className="service-title">
                <h2 id={`${department.id}-title`}>
                  <HoverText>{department.title}</HoverText>
                </h2>
                <p>{department.description}</p>
                <Link className="text-link" href="/book-consultation">
                  Discuss your project <DirectionalArrow />
                </Link>
              </div>
              <div className="service-description">
                <ul>
                  {department.services.map((service) => (
                    <li id={service.id} key={service.title}>
                      {service.title}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
            {department.packages && (
              <div className="service-packages">
                <h3 data-folio-reveal>
                  <HoverText>Design packages</HoverText>
                </h3>
                <div className="service-package-grid">
                  {department.packages.map((plan) => (
                    <div
                      className="service-package"
                      data-featured={plan.id === "signature" ? "" : undefined}
                      key={plan.title}
                    >
                      <div className="service-package-heading">
                        <h4>
                          <HoverText>{plan.title}</HoverText>
                        </h4>
                        <p>{plan.description}</p>
                      </div>
                      <Link
                        className="service-package-enquiry"
                        aria-label={`Enquire about ${plan.title} for ${department.title}`}
                        href={`/book-consultation?department=${department.id}&package=${plan.id}#enquiry-form`}
                      >
                        Enquire <DirectionalArrow />
                      </Link>
                      <ul>
                        {plan.services.map((service) => (
                          <li key={service}>{service}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        ))}
      </div>
      <section
        className="section process-section services-process"
        data-process-track
      >
        <div className="services-process-chapters">
          <div className="section-heading">
            <div>
              <h2>
                <HoverText>
                  <span className="services-process-heading">
                    <span data-process-phase data-active>
                      A clear path from
                      <br />
                      the first conversation.
                    </span>
                    {process.map((step) => (
                      <span key={step.title} data-process-phase>
                        {step.heading}
                      </span>
                    ))}
                  </span>
                </HoverText>
              </h2>
            </div>
            <p className="section-aside">Your brief shapes each stage.</p>
          </div>
          <div className="process-rule" aria-hidden="true">
            <span data-process-progress />
          </div>
          <ol className="process-grid">
            {process.map((step) => (
              <li key={step.title} data-process-step>
                <h3>
                  <HoverText>{step.title}</HoverText>
                </h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
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
