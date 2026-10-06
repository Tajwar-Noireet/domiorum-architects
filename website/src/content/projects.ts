import type { Project } from "@/types/project";

export const experienceCredit =
  "Previous professional experience of Zarin Nawar as Associate Architect at Innova Architects. Project Architect: Ar Sanjida Shams.";

export const projects: Project[] = [
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
    cover: "/images/projects/selim/living-entry.webp",
    coverAlt:
      "Living room visualization with navy armchairs, pale sofas and decorative wall plates",
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
  {
    slug: "abed-residence",
    title: "Abed Residence",
    category: "Architecture",
    location: "Rangpur, Bangladesh",
    area: "2,260 sq ft",
    areaLabel: "Site area",
    summary: "A family home with the garden woven into its architecture.",
    description:
      "A three-storey residence for a couple who enjoy gardening. Planting at ground level and on the roof makes the landscape part of the home, with daylight and ventilation guiding the arrangement of spaces.",
    approach:
      "Balconies, openings and garden spaces create connections between indoors and outdoors. The proposal responds to the family's interest in planting while keeping the layout comfortable for everyday life.",
    cover: "/images/projects/abed/exterior.webp",
    coverAlt:
      "Architectural visualization of Abed Residence with planted balconies and a rooftop garden",
    images: [
      {
        src: "/images/projects/abed/side.webp",
        alt: "Side perspective of the residence showing garden areas and balconies",
        caption: "Architecture and planting",
      },
      {
        src: "/images/projects/abed/garden.webp",
        alt: "Garden perspective visualization of Abed Residence",
        caption: "A connection to the outdoors",
      },
    ],
  },
  {
    slug: "doctors-residence",
    title: "Doctors’ Residence",
    category: "Architecture",
    location: "Dinajpur, Bangladesh",
    area: "5,705 sq ft",
    areaLabel: "Site area",
    summary: "Private homes and shared life within one residential building.",
    description:
      "A five-storey residential proposal for five medical professionals. Each floor combines an owner's home with rental accommodation, balancing privacy, efficient planning and shared amenities.",
    approach:
      "Separate living arrangements give each household privacy. The rooftop provides a communal setting with a hall, pool and landscaped seating, bringing a shared outdoor space into a compact urban site.",
    cover: "/images/projects/doctors/exterior.webp",
    coverAlt:
      "Perspective visualization of Doctors’ Residence, a five-storey building with planted balconies",
    images: [
      {
        src: "/images/projects/doctors/roof.webp",
        alt: "Aerial visualization of the building's shared rooftop pool and garden",
        caption: "The shared rooftop",
      },
      {
        src: "/images/projects/doctors/facade.webp",
        alt: "Front elevation visualization with balconies and vertical facade details",
        caption: "The street-facing facade",
      },
    ],
  },
];
