import type { NextConfig } from "next";

// Handle non-standard NODE_ENV values
const nodeEnv = process.env.NODE_ENV as string;
const isProduction = nodeEnv === 'production' || 
                    nodeEnv?.startsWith('aws') || 
                    nodeEnv === 'awstest';

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  // Override NODE_ENV for Next.js to avoid warnings while preserving original value
  env: {
    ORIGINAL_NODE_ENV: process.env.NODE_ENV, // Preserve original for backend
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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
      {
        protocol: 'https',
        hostname: 'www.nj.gov',
      },
    ],
  },
  async rewrites() {
    const apiHost = process.env.API_HOST || "localhost";
    const apiPort = process.env.API_PORT || "8080";
    
    return [
      {
        source: "/api/:path*",
        destination: `http://${apiHost}:${apiPort}/api/:path*`,
      },
    ];
  },
  sassOptions: {
    // Silences the 'legacy-js-api' deprecation warning
    silenceDeprecations: ["legacy-js-api"],
  },
};

export default nextConfig;
