import type { MetadataRoute } from "next";
// Keep the client review build out of search results until launch approval.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
