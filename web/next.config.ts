import type { NextConfig } from "next";

const WEEK = 60 * 60 * 24 * 7;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Screenshots and photos rarely change: keep optimised copies for a week.
    // (There is no cache invalidation, so rename a file if you replace it.)
    minimumCacheTTL: WEEK,
  },
  async headers() {
    const cache = [{ key: "Cache-Control", value: `public, max-age=${WEEK}, stale-while-revalidate=${WEEK}` }];
    return [
      { source: "/projects/:path*", headers: cache },
      { source: "/:file(hesham.jpeg|hesham-cutout.webp|Hesham_Mosad_Resume.pdf)", headers: cache },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
