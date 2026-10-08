import type { Project } from "@/types/project";
import portfolio from "./portfolio.json";

export const experienceCredit =
  "Previous professional work of Zarin Nawar. Project Architect: Ar Sanjida Shams.";

export const projects: Project[] = portfolio as Project[];

export const legacyProjects: Project[] = [
  {
    slug: "selim-residence",
    title: "Selim Residence",
    category: "Interiors",
    location: "Dhaka, Bangladesh",
    area: "1,830 sq ft",
    areaLabel: "Apartment area",
    summary: "A considered balance of shared spaces and private corners.",
    description:
      "An apartment interior shaped around a family's everyday routines. Living, dining and private rooms are connected through a cohesive material palette, with space for gathering and practical storage throughout.",
    approach:
      "The design brings a clear sense of order to the apartment. Circulation, built-in storage and furniture placement work together, while warm timber and quieter surfaces give each room its own character.",
    cover: "/images/projects/selim/bedroom.webp",
    coverAlt:
      "Bedroom visualization with warm curtains, a layered neutral bed and fitted white wardrobes",
    images: [
      {
        src: "/images/projects/selim/shared.webp",
        alt: "Connected dining and living spaces with timber furniture, pale seating and warm curtains",
        caption: "Living and dining, connected",
      },
      {
        src: "/images/projects/selim/dining-view.webp",
        alt: "Dining room visualization with upholstered chairs and a circular pendant light",
        caption: "A place to gather",
      },
      {
        src: "/images/projects/selim/bedroom.webp",
        alt: "Bedroom visualization with timber detailing, a neutral bed and integrated storage",
        caption: "A quieter private space",
      },
      {
        src: "/images/projects/selim/study.webp",
        alt: "Bedroom study corner with a desk beside daylight and illuminated timber bookshelves",
        caption: "Storage and a place to work",
      },
      {
        src: "/images/projects/selim/kitchen.webp",
        alt: "Kitchen visualization with white cabinetry, marble walls and a dark worktop",
        caption: "A practical kitchen",
      },
    ],
  },
];
export const allProjects = [...projects, ...legacyProjects];
