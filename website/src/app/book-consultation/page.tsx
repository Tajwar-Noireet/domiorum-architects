import { HoverText } from "@/components/ui/HoverText";
import type { Metadata } from "next";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { serviceDepartments } from "@/content/services";
import { site } from "@/content/site";
export const metadata: Metadata = { title: "Let’s talk" };
export default async function Consultation({
  searchParams,
}: {
  searchParams: Promise<{
    department?: string | string[];
    package?: string | string[];
  }>;
}) {
  const query = await searchParams;
  const department = serviceDepartments.find(
    ({ id }) => id === query.department,
  );
  const plan = department?.packages?.find(({ id }) => id === query.package);
  const packageSelection =
    department && plan
      ? { department: department.title, title: plan.title }
      : undefined;

  return (
    <section className="section page-section">
      <div className="page-heading">
        <h1 data-folio-reveal>
          <HoverText>
            Let’s understand
            <br />
            your space.
          </HoverText>
        </h1>
        <p data-folio-reveal>
          {packageSelection
            ? "Tell us about your project so we can discuss the package you selected."
            : "An initial consultation is a chance to talk through your needs, explore the possibilities and define the next steps."}
        </p>
      </div>
      <div className="contact-grid">
        <aside className="consultation-details" data-folio-reveal>
          <h2>
            <HoverText>
              A useful place
              <br />
              to begin.
            </HoverText>
          </h2>
          <p>
            Bring your ideas, questions and any floor plans or photographs you
            already have.
          </p>
          <ul>
            <li>Your space and how you use it</li>
            <li>Your priorities and preferred direction</li>
            <li>Your approximate budget and timeline</li>
            <li>The scope and next steps</li>
          </ul>
          {!packageSelection && (
            <div className="consultation-note">
              <p className="eyebrow">Before we meet</p>
              <p>
                Consultations are paid. The studio will confirm the fee,
                duration, format and availability before you commit. Sending a
                request does not confirm a booking or take a payment.
              </p>
            </div>
          )}
          <div className="consultation-contact">
            <p className="eyebrow">Speak with the studio</p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
            <p>{site.location}</p>
          </div>
        </aside>
        <EnquiryForm
          key={
            packageSelection
              ? `${query.department}/${query.package}`
              : "consultation"
          }
          consultation={!packageSelection}
          packageSelection={packageSelection}
        />
      </div>
    </section>
  );
}
