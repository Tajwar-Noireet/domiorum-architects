import { DirectionalArrow } from "@/components/ui/DirectionalArrow";
import { HoverText } from "@/components/ui/HoverText";
import type { Metadata } from "next";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { site } from "@/content/site";
export const metadata: Metadata = { title: "Contact the studio" };
export default function Contact() {
  return (
    <section className="section page-section">
      <div className="page-heading">
        <p className="eyebrow">Contact</p>
        <h1 data-folio-reveal>
          <HoverText>
            It starts with
            <br />a conversation.
          </HoverText>
        </h1>
        <p data-folio-reveal>
          A new home, a renovation, or an idea you’re still exploring. We’d like
          to hear about it.
        </p>
      </div>
      <div className="contact-grid">
        <aside className="contact-details" data-folio-reveal>
          <div>
            <p className="eyebrow">The studio</p>
            <h2>
              <HoverText>
                Dhaka,
                <br />
                Bangladesh.
              </HoverText>
            </h2>
            <p>{site.location}</p>
            <p className="small-note">
              Please contact us to arrange a meeting.
            </p>
          </div>
          <div>
            <p className="eyebrow">Email & phone</p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
          </div>
          <a
            href={site.facebook}
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            Follow on Facebook <DirectionalArrow direction="up-right" />
          </a>
        </aside>
        <EnquiryForm />
      </div>
    </section>
  );
}
