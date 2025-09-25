import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  env: {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL,
    REACT_APP_DELIVERY_API: process.env.REACT_APP_DELIVERY_API,
    REACT_APP_ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT,
    REACT_APP_PREVIEW_API: process.env.REACT_APP_PREVIEW_API,
    REACT_APP_SPACE_ID: process.env.REACT_APP_SPACE_ID,
    REACT_APP_FEATURE_CAREER_PATHWAYS:
      process.env.REACT_APP_FEATURE_CAREER_PATHWAYS,
    REACT_APP_FEATURE_MULTILANG: process.env.REACT_APP_FEATURE_MULTILANG,
    REACT_APP_FEATURE_PINPOINT: process.env.REACT_APP_FEATURE_PINPOINT,
    REACT_APP_FEATURE_SHOW_PINPOINT_SEGMENTS:
      process.env.REACT_APP_FEATURE_SHOW_PINPOINT_SEGMENTS,
    REACT_APP_SITE_NAME: process.env.REACT_APP_SITE_NAME,
    REACT_APP_SITE_URL: process.env.REACT_APP_SITE_URL,
  },
  images: {
    unoptimized: false,
    domains: ["images.ctfassets.net", "www.nj.gov"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/:path*",
      },
    ];
  },
  sassOptions: {
    // Silences the 'legacy-js-api' deprecation warning
    silenceDeprecations: ["legacy-js-api"],
  },
  async redirects() {
    return [
      // Root synonym -> canonical industry pathway
      {
        source: "/health",
        destination: "/career-pathways/healthcare",
        permanent: true,
      },
      // Enforce canonical slug under /career-pathways
      {
        source: "/career-pathways/health",
        destination: "/career-pathways/healthcare",
        permanent: true,
      },
      // Also normalize any nested paths (capture all after /health)
      {
        source: "/career-pathways/health/:path*",
        destination: "/career-pathways/healthcare/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
