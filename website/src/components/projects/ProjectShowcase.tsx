"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type CSSProperties,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useHomeMotion } from "@/components/home/HomeMotion";
import { FlowButtonContent } from "@/components/ui/FlowButton";
import { HoverText } from "@/components/ui/HoverText";
import type { Project } from "@/types/project";
import { scrollToPosition } from "@/lib/smooth-scroll";

const stackQuery = "(min-width: 900px) and (min-height: 560px)";
function subscribeStack(callback: () => void) {
  const query = matchMedia(stackQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export function ProjectShowcase({ projects }: { projects: Project[] }) {
  const section = useRef<HTMLDivElement>(null);
  const { enabled } = useHomeMotion();
  const wideScreen = useSyncExternalStore(
    subscribeStack,
    () => matchMedia(stackQuery).matches,
    () => false,
  );
  const stack = enabled && wideScreen;
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const travel = useRef<{
    start: number;
    end: number;
    duration: number;
  } | null>(null);

  useLayoutEffect(() => {
    if (!enabled) return;
    let disposed = false;
    let revert: (() => void) | undefined;
    async function start() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed || !section.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        const root = section.current!;
        const cards = Array.from(
          root.querySelectorAll<HTMLElement>(".showcase-project"),
        );
        if (!stack) {
          cards.forEach((card) => {
            gsap.fromTo(
              card.querySelector(".showcase-title-line"),
              { yPercent: 105 },
              {
                yPercent: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top 95%",
                  end: "top 65%",
                  scrub: true,
                },
              },
            );
            gsap.fromTo(
              card.querySelector(".showcase-cover img"),
              { scale: 1.08 },
              {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          });
          return;
        }
        const viewport = root.querySelector<HTMLElement>(".showcase-viewport")!;
        const scene = root.querySelector<HTMLElement>(".showcase-scenes")!;
        const fanStart = cards.length - 1 + 0.25;
        gsap.set(cards, {
          xPercent: -50,
          yPercent: -50,
          transformOrigin: "50% 50%",
          y: (index) => (index ? window.innerHeight + 300 : 0),
        });
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top 76px",
            end: () => `+=${root.clientHeight - viewport.clientHeight - 48}`,
            scrub: true,
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              travel.current = {
                start: self.start,
                end: self.end,
                duration: fanStart + 1.25,
              };
            },
          },
          onUpdate: () => {
            const next =
              timeline.time() >= fanStart + 0.12
                ? cards.length
                : Math.min(
                    cards.length - 1,
                    Math.floor(timeline.time() + 0.001),
                  );
            if (next !== activeRef.current) {
              activeRef.current = next;
              setActive(next);
            }
          },
        });
        cards.forEach((card, index) => {
          timeline.fromTo(
            card.querySelector(".showcase-cover img"),
            { scale: 1.12 },
            { scale: 1, duration: 1, immediateRender: false },
            Math.max(0, index - 1),
          );
          if (index) {
            timeline.fromTo(
              card,
              { y: () => window.innerHeight + 300 },
              { y: 0, duration: 1, immediateRender: false },
              index - 1,
            );
            cards.slice(0, index).forEach((previous, previousIndex) =>
              timeline.to(
                previous,
                {
                  scale: 1 - (index - previousIndex) * 0.035,
                  y: -(index - previousIndex) * 14,
                  duration: 1,
                },
                index - 1,
              ),
            );
          }
          const fanWidth = () =>
            (scene.clientWidth - (cards.length - 1) * 16) / cards.length;
          timeline.to(
            card,
            {
              x: () => (index - (cards.length - 1) / 2) * (fanWidth() + 16),
              y: () => Math.abs(index - (cards.length - 1) / 2) * 12,
              scale: () => fanWidth() / card.offsetWidth,
              duration: 1,
            },
            fanStart,
          );
          timeline.to(
            card.querySelectorAll(
              ".showcase-meta, .showcase-description, .showcase-detail",
            ),
            { opacity: 0, duration: 0.2 },
            fanStart,
          );
        });
        timeline.fromTo(
          root.querySelector(".showcase-stack-progress span"),
          { scaleX: 0 },
          { scaleX: 1, duration: fanStart + 1.25 },
          0,
        );
      }, section);
      revert = () => context.revert();
      await document.fonts.ready;
      if (!disposed) ScrollTrigger.refresh();
    }
    void start();
    return () => {
      disposed = true;
      revert?.();
      travel.current = null;
    };
  }, [enabled, stack, projects]);

  function navigate(event: MouseEvent<HTMLAnchorElement>, index: number) {
    if (!stack || !travel.current) return;
    event.preventDefault();
    const { start, end, duration } = travel.current;
    scrollToPosition(start + (index / duration) * (end - start));
  }

  return (
    <div
      className="project-showcase"
      ref={section}
      data-animated={enabled}
      data-stack={stack}
      data-fan={stack && active === projects.length}
      style={{ "--project-count": projects.length } as CSSProperties}
    >
      <div className="showcase-viewport">
        <div className="showcase-topline">
          <p className="showcase-kicker">
            Our projects / {String(projects.length).padStart(2, "0")}
          </p>
        </div>
        <nav className="showcase-index" aria-label="Project index">
          {projects.map((project, index) => (
            <a
              key={project.slug}
              href={`#selected-${project.slug}`}
              onClick={(event) => navigate(event, index)}
              aria-current={stack && active === index ? "true" : undefined}
            >
              <span>{String(index + 1).padStart(2, "0")}</span> {project.title}
            </a>
          ))}
        </nav>
        <div className="showcase-scenes">
          {projects.map((project, index) => {
            const detail = project.images.find(
              (image) => image.src !== project.cover,
            );
            return (
              <article
                key={project.slug}
                id={`selected-${project.slug}`}
                className={`showcase-project ${index % 2 ? "showcase-reverse" : ""}`}
                aria-labelledby={`selected-title-${project.slug}`}
                style={{ zIndex: index + 1 }}
                aria-hidden={
                  stack && active !== projects.length && active !== index
                    ? true
                    : undefined
                }
                inert={stack && active !== projects.length && active !== index}
              >
                <div className="showcase-project-heading">
                  <p className="showcase-meta">
                    <span>
                      {String(index + 1).padStart(2, "0")} / {project.category}
                    </span>
                    <span>{project.location || "Domiorum Architects"}</span>
                  </p>
                  <h2
                    className="showcase-title"
                    id={`selected-title-${project.slug}`}
                  >
                    <span className="showcase-title-line">
                      <HoverText>{project.title}</HoverText>
                    </span>
                  </h2>
                </div>
                <div
                  className={`showcase-stage ${detail ? "showcase-with-detail" : ""}`}
                >
                  <div className="showcase-cover">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="showcase-cover-link"
                      aria-label={`Open ${project.title}`}
                    >
                      <Image
                        src={project.cover}
                        alt={project.coverAlt}
                        fill
                        sizes={
                          stack
                            ? "(max-width: 1200px) 85vw, 1050px"
                            : "(max-width: 700px) 90vw, 80vw"
                        }
                        quality={85}
                      />
                    </Link>
                  </div>
                  {detail && (
                    <figure className="showcase-detail">
                      <div className="showcase-detail-image">
                        <Image
                          src={detail.src}
                          alt={detail.alt}
                          fill
                          sizes={
                            stack ? "220px" : "(max-width: 700px) 34vw, 25vw"
                          }
                          quality={85}
                        />
                      </div>
                      <figcaption>{detail.caption}</figcaption>
                    </figure>
                  )}
                </div>
                <div
                  className="showcase-description"
                  inert={stack && active === projects.length}
                  aria-hidden={
                    stack && active === projects.length ? true : undefined
                  }
                >
                  <p>{project.summary}</p>
                  <Link
                    className="button flow-button showcase-link"
                    href={`/projects/${project.slug}`}
                  >
                    <FlowButtonContent>View project</FlowButtonContent>
                  </Link>
                </div>
                <div className="showcase-rule" aria-hidden="true">
                  <span />
                </div>
              </article>
            );
          })}
        </div>
        {stack && (
          <div className="showcase-stack-footer">
            <p>
              {active === projects.length
                ? "Explore the collection"
                : `${String(active + 1).padStart(2, "0")} / ${projects.length} — Scroll to the next project`}
            </p>
            <div className="showcase-stack-progress" aria-hidden="true">
              <span />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
