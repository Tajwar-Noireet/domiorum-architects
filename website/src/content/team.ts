import { projects, legacyProjects } from "./projects";

export const team = [
  {
    slug: "zarin-nawar",
    name: "Zarin Nawar",
    role: "Founder & CEO",
    portrait: "/images/studio/zarin-nawar.webp",
    bio: "Zarin founded Domiorum Architects in Bashundhara R/A, Dhaka. With a background in residential design, she brings architecture, interiors and the way people live into one conversation.",
    studioProjects: projects.map((project) => project.slug),
    previousProjects: legacyProjects.map((project) => project.slug),
  },
];
