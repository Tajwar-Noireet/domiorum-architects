import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { qualities: [75, 85] },
  redirects() {
    return [
      {
        source: "/contact",
        destination: "/book-consultation",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
