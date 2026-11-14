export const homeServices = [
  {
    title: "Interior design",
    detail: "Residential interiors",
    anchor: "service-1",
  },
  {
    title: "Residential architecture",
    detail: "New residential design",
    anchor: "service-2",
  },
  {
    title: "Renovations & extensions",
    detail: "Apartment renovations",
    anchor: "service-3",
  },
  {
    title: "Technical & delivery support",
    detail: "Technical drawings",
    anchor: "service-4",
  },
];

type ServiceDepartment = {
  id: string;
  title: string;
  description: string;
  services: { title: string; id?: string }[];
  packages?: {
    id: string;
    title: string;
    description: string;
    services: string[];
  }[];
};

const interiorPackages = [
  {
    id: "essentia",
    title: "Essentia",
    description: "Basic design package",
    services: ["Concept design", "Layout planning", "Basic drawings"],
  },
  {
    id: "signature",
    title: "Signature",
    description: "Full architectural or interior design",
    services: [
      "Detailed drawings",
      "Material specifications for mid-tier products",
      "Project coordination",
    ],
  },
  {
    id: "prestige",
    title: "Prestige",
    description: "End-to-end service",
    services: [
      "Bespoke design",
      "Premium finishes",
      "Site supervision",
      "Sourcing and supply of premium materials",
      "Turnkey support",
    ],
  },
];

export const serviceDepartments: ServiceDepartment[] = [
  {
    id: "service-1",
    title: "Residential Interior",
    description:
      "Interior design for houses and apartments, from a new layout to a full renovation.",
    services: [
      { title: "Interior design" },
      { title: "Renovations & extensions", id: "service-3" },
      { title: "Technical & delivery support", id: "service-4" },
    ],
    packages: interiorPackages,
  },
  {
    id: "commercial-interior",
    title: "Commercial Interior",
    description:
      "Interior design, renovations and delivery support for commercial spaces.",
    services: [
      { title: "Interior design" },
      { title: "Renovations & extensions" },
      { title: "Technical & delivery support" },
    ],
    packages: interiorPackages,
  },
  {
    id: "service-2",
    title: "Architecture Consultancy",
    description:
      "Architectural design for residential and commercial projects.",
    services: [
      { title: "Residential architecture" },
      { title: "Commercial architecture" },
    ],
  },
];

export const process = [
  {
    title: "Listen",
    heading: "First, we listen.",
    text: "Tell us how you live, what you need and what you have in mind. We begin with your brief, site and budget.",
  },
  {
    title: "Explore",
    heading: "Then, we explore.",
    text: "We develop the spatial direction, share ideas and work through the decisions that will shape your project.",
  },
  {
    title: "Refine",
    heading: "We refine the design.",
    text: "Layouts, materials and details come together. You review the design as it becomes more specific.",
  },
  {
    title: "Prepare",
    heading: "We prepare for the next stage.",
    text: "With the design agreed, we define the drawings, coordination and support needed for the next stage.",
  },
];
