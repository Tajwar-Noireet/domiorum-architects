import { HoverText } from "@/components/ui/HoverText";
import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/content/site";
export const metadata: Metadata = { title: "Careers" };
export default function Careers() {
  return (
    <section className="section page-section">
      <div className="page-heading">
        <p className="eyebrow">Careers</p>
        <h1>
          <HoverText>
            Care about spaces.
            <br />
            Care about people.
          </HoverText>
        </h1>
        <p>
          We’re building a practice around thoughtful design and open
          conversation.
        </p>
      </div>
      <div className="careers-grid">
        <div className="careers-image">
          <Image
            src="/images/home/living-dining.webp"
            alt="Residential interior design visualization with integrated joinery"
            fill
            sizes="(max-width: 700px) 100vw, 50vw"
          />
        </div>
        <div>
          <p className="eyebrow">Stay in touch</p>
          <h2>
            <HoverText>Introduce yourself.</HoverText>
          </h2>
          <p>
            We haven’t listed any open roles yet. If you’d like to work with
            Domiorum in the future, you’re welcome to email your CV and a link
            to your portfolio.
          </p>
          <a
            className="button"
            href={`mailto:${site.email}?subject=Career%20interest%20%E2%80%94%20Domiorum`}
          >
            <span>Email your portfolio</span>
            <span aria-hidden="true">↗</span>
          </a>
          <p className="small-note">
            Please share your area of interest and availability.
          </p>
        </div>
      </div>
    </section>
  );
}
