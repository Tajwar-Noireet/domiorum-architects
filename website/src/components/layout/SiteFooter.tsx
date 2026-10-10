import { DirectionalArrow } from "@/components/ui/DirectionalArrow";
import { HoverText } from "@/components/ui/HoverText";
import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/ui/LinkButton";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer studio-footer">
      <div className="footer-invitation">
        <div className="footer-invitation-copy" data-folio-reveal>
          <p className="eyebrow">Your next chapter</p>
          <h2>
            <HoverText>
              Let’s make room
              <br />
              for <em>your ideas.</em>
            </HoverText>
          </h2>
          <LinkButton href="/contact" light>
            Tell us about your project
          </LinkButton>
        </div>
        <div className="footer-contact" data-folio-reveal>
          <p className="eyebrow">Speak with the studio</p>
          <p className="footer-contact-note">
            A new home, a space to rethink, or a question about where to begin.
          </p>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
          <div className="footer-location">
            <span className="eyebrow">Based in Dhaka</span>
            <p>{site.location}</p>
          </div>
        </div>
      </div>
      <div className="footer-directory">
        <Link
          href="/"
          className="footer-brand"
          aria-label="Domiorum Architects home"
        >
          <Image
            src="/brand/domiorum-banner.webp"
            alt="Domiorum Architects"
            width={1000}
            height={280}
            className="footer-logo"
          />
        </Link>
        <nav aria-label="Footer navigation">
          <Link href="/projects">Projects</Link>
          <Link href="/services">Services</Link>
          <Link href="/discover">Discover us</Link>
          <Link href="/careers">Careers</Link>
          <a href={site.facebook} target="_blank" rel="noreferrer">
            Facebook <DirectionalArrow direction="up-right" />
          </a>
        </nav>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Domiorum Architects</span>
        <span>Imagined with you. Built for you.</span>
        <Link href="/privacy">Privacy</Link>
      </div>
    </footer>
  );
}
