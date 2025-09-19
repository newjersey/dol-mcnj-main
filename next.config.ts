import type { NextConfig } from "next";

// Base image domains used in all non-test environments
const imageDomains = ["images.ctfassets.net", "www.nj.gov", "mycareer.nj.gov"] as string[];

// Allow legacy test fixtures that still point to example.com without widening prod/stage attack surface.
if (process.env.NODE_ENV === "test") {
  imageDomains.push("example.com");
}

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  env: {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL,
    REACT_APP_DELIVERY_API: process.env.REACT_APP_DELIVERY_API,
    REACT_APP_ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT,
    REACT_APP_PREVIEW_API: process.env.REACT_APP_PREVIEW_API,
    REACT_APP_SPACE_ID: process.env.REACT_APP_SPACE_ID,
    REACT_APP_FEATURE_CAREER_PATHWAYS: process.env.REACT_APP_FEATURE_CAREER_PATHWAYS,
    REACT_APP_FEATURE_MULTILANG: process.env.REACT_APP_FEATURE_MULTILANG,
    REACT_APP_FEATURE_PINPOINT: process.env.REACT_APP_FEATURE_PINPOINT,
    REACT_APP_FEATURE_SHOW_PINPOINT_SEGMENTS: process.env.REACT_APP_FEATURE_SHOW_PINPOINT_SEGMENTS,
    REACT_APP_SITE_NAME: process.env.REACT_APP_SITE_NAME,
    REACT_APP_SITE_URL: process.env.REACT_APP_SITE_URL,
  },
  images: {
    unoptimized: false,
    domains: imageDomains,
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
};

export default nextConfig;
