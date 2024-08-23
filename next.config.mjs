/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
    ],
  },
};

export default nextConfig;
