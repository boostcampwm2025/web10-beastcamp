import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  turbopack: {
    root: "..",
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kopis.or.kr",
      },
      {
        protocol: "https",
        hostname: "www.kopis.or.kr",
      },
      {
        protocol: "http",
        hostname: "www.kopis.or.kr",
      },
      {
        protocol: "http",
        hostname: "kopis.or.kr",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },

  reactCompiler: true,
  output: "standalone",

  // 성능 최적화
  compress: true,
  poweredByHeader: false,

  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["recharts", "lucide-react"],
  },
};

export default nextConfig;
