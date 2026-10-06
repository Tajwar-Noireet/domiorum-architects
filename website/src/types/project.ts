export type Project = {
  slug: string;
  title: string;
  category: "Interiors" | "Architecture";
  location: string;
  area: string;
  areaLabel: string;
  summary: string;
  description: string;
  approach: string;
  cover: string;
  coverAlt: string;
  images: { src: string; alt: string; caption: string }[];
};
