import { HoverText } from "@/components/ui/HoverText";
import type { Metadata } from "next";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
export const metadata: Metadata = { title: "Request a consultation" };
export default function Consultation() {
  return (
    <section className="section page-section">
      <div className="page-heading">
        <p className="eyebrow">The first step</p>
        <h1>
          <HoverText>
            Let’s understand
            <br />
            your space.
          </HoverText>
        </h1>
        <p>
          An initial consultation is a chance to talk through your needs,
          explore the possibilities and define the next steps.
        </p>
      </div>
      <div className="contact-grid">
        <aside className="consultation-details">
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
          <div className="consultation-note">
            <p className="eyebrow">Before we meet</p>
            <p>
              Consultations are paid. The studio will confirm the fee, duration,
              format and availability before you commit. Sending a request does
              not confirm a booking or take a payment.
            </p>
          </div>
        </aside>
        <EnquiryForm consultation />
      </div>
    </section>
  );
}
