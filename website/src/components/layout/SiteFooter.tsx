import { HoverText } from "@/components/ui/HoverText";
import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/ui/LinkButton";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <p className="eyebrow">Your next chapter</p>
        <div className="footer-title-row">
          <h2>
            <HoverText>
              Let’s make room
              <br />
              for your ideas.
            </HoverText>
          </h2>
          <LinkButton href="/contact" light>
            Tell us about your project
          </LinkButton>
        </div>
      </div>
      <div className="footer-grid">
        <div>
          <Image
            src="/brand/domiorum-banner.webp"
            alt="Domiorum Architects"
            width={1000}
            height={280}
            className="footer-logo"
          />
          <p>
            Architecture & interiors.
            <br />
            Imagined with you. Built for you.
          </p>
        </div>
        <div>
          <span className="eyebrow">Find us</span>
          <p>{site.location}</p>
          <a href={site.facebook} target="_blank" rel="noreferrer">
            Facebook ↗
          </a>
        </div>
        <div>
          <span className="eyebrow">Get in touch</span>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
        </div>
        <div>
          <span className="eyebrow">Explore</span>
          <Link href="/projects">Projects</Link>
          <Link href="/services">Services</Link>
          <Link href="/careers">Careers</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Domiorum Architects</span>
        <span>Based in Dhaka, Bangladesh</span>
        <Link href="/privacy">Privacy</Link>
      </div>
    </footer>
  );
}
