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
        <h1>
          <HoverText>
            It starts with
            <br />a conversation.
          </HoverText>
        </h1>
        <p>
          A new home, a renovation, or an idea you’re still exploring. We’d like
          to hear about it.
        </p>
      </div>
      <div className="contact-grid">
        <aside className="contact-details">
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
            Follow on Facebook <span aria-hidden="true">↗</span>
          </a>
        </aside>
        <EnquiryForm />
      </div>
    </section>
  );
}
