import type { Metadata } from "next";
import { site } from "@/content/site";
export const metadata: Metadata = { title: "Privacy" };
export default function Privacy() {
  return (
    <section className="section page-section legal-page">
      <p className="eyebrow">Privacy</p>
      <h1>
        Your enquiry,
        <br />
        your choice.
      </h1>
      <h2>Enquiry forms</h2>
      <p>
        The forms on this website prepare an email draft in your browser. The
        website does not submit or store the information you enter. You can
        review the draft before sending it through your own email service.
      </p>
      <h2>Contacting the studio</h2>
      <p>
        When you send an email, the studio receives the details you choose to
        share and uses them to respond to your enquiry. For questions about your
        information, contact <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
      <h2>Website services</h2>
      <p>
        Your motion preference is kept in your browser for the current tab’s
        session. It contains no personal information and is not sent to the
        studio.
      </p>
      <p>
        This version uses no advertising trackers or analytics cookies. Hosting
        infrastructure may process technical request data to deliver the
        website. If online booking, payments or analytics are added, this page
        will be updated to describe them.
      </p>
    </section>
  );
}
