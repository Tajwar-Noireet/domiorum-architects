"use client";

import { useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { services } from "@/content/services";
import { HoverText } from "@/components/ui/HoverText";
import { LinkButton } from "@/components/ui/LinkButton";
import { useHomeMotion } from "./HomeMotion";

type Point = [number, number, number];
const project = ([x, y, z]: Point) =>
  `${300 + (x - y) * 24},${610 + (x + y) * 11 - z * 27}`;
function line(a: Point, b: Point) {
  return `M${project(a)} L${project(b)}`;
}
function box(x: number, y: number, z: number, w: number, d: number, h: number) {
  const p: Point[] = [
    [x, y, z],
    [x + w, y, z],
    [x + w, y + d, z],
    [x, y + d, z],
  ];
  return (
    p.map((a, i) => line(a, p[(i + 1) % 4])).join(" ") +
    p
      .map(
        (a, i) =>
          line(
            [a[0], a[1], z + h],
            [p[(i + 1) % 4][0], p[(i + 1) % 4][1], z + h],
          ) + line(a, [a[0], a[1], z + h]),
      )
      .join(" ")
  );
}
const floor = (z: number) => box(0, 0, z, 10, 8, 0.22);
const columns = (z: number) =>
  [0, 5, 10]
    .flatMap((x) => [0, 8].map((y) => box(x, y, z, 0.2, 0.2, 3)))
    .join(" ");
const roof =
  Array.from(
    { length: 11 },
    (_, i) => line([i, 0, 17], [i, 4, 19.8]) + line([i, 4, 19.8], [i, 8, 17]),
  ).join(" ") +
  [0, 4, 8]
    .map((y) => line([0, y, y === 4 ? 19.8 : 17], [10, y, y === 4 ? 19.8 : 17]))
    .join(" ");
const beams =
  [5, 11].map((z) => box(0, 0, z + 3, 10, 8, 0.18)).join(" ") +
  Array.from({ length: 9 }, (_, i) => line([0, i, 11.1], [10, i, 11.1])).join(
    " ",
  );
const architecture =
  floor(5) + columns(5) + floor(11) + columns(11) + roof + beams;
const glazing =
  [1, 2, 3, 7, 8, 9]
    .map(
      (x) => line([x, 0, 5.2], [x, 0, 7.8]) + line([x, 8, 11.2], [x, 8, 13.8]),
    )
    .join(" ") +
  [2, 4, 6].map((y) => line([10, y, 5.2], [10, y, 7.8])).join(" ");
const interiors =
  box(1, 1, 5.25, 3, 1.4, 0.6) +
  box(1, 2.5, 5.25, 0.8, 2, 0.6) +
  box(2.5, 3, 5.25, 1.6, 1.2, 0.3) +
  box(6, 4, 5.25, 2.2, 1.5, 0.75) +
  box(6, 1, 11.25, 3, 2, 0.5) +
  box(6, 1, 11.75, 0.65, 2, 0.2) +
  box(1, 6.8, 11.25, 3, 0.8, 1.2) +
  line([5, 0, 11.3], [5, 5, 11.3]) +
  line([5, 5, 11.3], [10, 5, 11.3]);
const extension =
  box(11.4, 3, 5, 2.3, 4, 0.2) +
  box(11.4, 3, 5.2, 0.18, 0.18, 2.8) +
  box(13.5, 6.8, 5.2, 0.18, 0.18, 2.8) +
  box(11.4, 3, 8, 2.3, 4, 0.18) +
  box(-1.8, 1, 5.2, 0.12, 2.5, 2.8);
const technical =
  floor(0) +
  [-1, 2, 5, 8, 11].map((x) => line([x, -1, -0.2], [x, 9, -0.2])).join(" ") +
  [-1, 2, 5, 8, 9].map((y) => line([-1, y, -0.2], [11, y, -0.2])).join(" ");
const guides = [0, 10]
  .flatMap((x) => [0, 8].map((y) => line([x, y, 0], [x, y, 17])))
  .join(" ");
const labels = [
  "Interior spaces",
  "Structure & envelope",
  "Adaptable additions",
  "Plans & coordination",
];
function subscribe(callback: () => void) {
  const q = matchMedia("(prefers-reduced-motion: reduce)");
  q.addEventListener("change", callback);
  return () => q.removeEventListener("change", callback);
}
function reduced() {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ServicesExplodedHouse() {
  const [active, setActive] = useState(1);
  const prefersReduced = useSyncExternalStore(subscribe, reduced, () => true);
  const { enabled } = useHomeMotion();
  const animated = enabled && !prefersReduced;
  const paths = [interiors, architecture, extension, technical];
  return (
    <section className="section home-services exploded-services" id="services">
      <div className="home-services-heading" data-reveal>
        <p className="eyebrow">04 / What we do</p>
        <h2>
          <HoverText>
            One home.
            <br />
            <span>Every scale.</span>
          </HoverText>
        </h2>
      </div>
      <div className="exploded-intro" data-reveal>
        <p>
          From the building and its layout to the surfaces you touch every day.
        </p>
        <LinkButton href="/services" light>
          Explore our services
        </LinkButton>
      </div>
      <figure className="house-figure" data-reveal>
        <svg
          viewBox="0 35 680 825"
          role="img"
          aria-labelledby="house-title house-description"
        >
          <title id="house-title">Exploded axonometric house</title>
          <desc id="house-description">
            A skeletal house separated into roof rafters, structural frames,
            furnished rooms, an extension and a drawing grid. The highlighted
            layer corresponds to the selected service.
          </desc>
          <path d={guides} className="house-guides" />
          {paths.map((d, i) => (
            <motion.g
              key={i}
              data-house-layer={i}
              data-active={active === i}
              className={`house-layer ${active === i ? "is-active" : ""}`}
              initial={false}
              animate={{ y: active === i && animated ? -7 : 0 }}
              transition={{
                duration: animated ? 0.45 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <path d={d} />
              {i === 1 && <path d={glazing} className="house-glazing" />}
            </motion.g>
          ))}
          <g className="house-dimensions">
            <path
              d={line([0, -2, 0], [10, -2, 0]) + line([12, 0, 0], [12, 8, 0])}
            />
            {[0, 10].map((x) => (
              <path key={x} d={line([x - 0.2, -2.2, 0], [x + 0.2, -1.8, 0])} />
            ))}
            <text x="447" y="681" transform="rotate(25 447 681)">
              STRUCTURAL GRID
            </text>
          </g>
        </svg>
        <figcaption>
          <span className="eyebrow">Concept study / Exploded axonometric</span>
          <span className="house-active-label">
            0{active + 1} / {labels[active]}
          </span>
        </figcaption>
        <div className="house-layer-controls" aria-label="Explore house layers">
          {labels.map((label, i) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              aria-pressed={active === i}
              onClick={() => setActive(i)}
            >
              0{i + 1}
            </button>
          ))}
        </div>
      </figure>
      <div className="home-service-links">
        {services.map((service, index) => (
          <Link
            data-reveal
            href={`/services#service-${index + 1}`}
            key={service.title}
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            data-house-service={index}
            className={active === index ? "is-selected" : ""}
          >
            <span className="eyebrow">0{index + 1}</span>
            <div>
              <h3>
                <HoverText>{service.title}</HoverText>
              </h3>
              <p>{service.items[0]}</p>
            </div>
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
