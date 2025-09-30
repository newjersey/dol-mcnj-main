import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.REACT_APP_SITE_URL || 'https://mycareer.nj.gov';
  
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/admin/",
          "/.well-known/"
        ]
      },
      // Allow important crawl paths explicitly
      {
        userAgent: "*",
        allow: [
          "/training*",
          "/occupation*", 
          "/career-pathways*",
          "/in-demand-occupations*",
          "/navigator*",
          "/support-resources*",
          "/training-provider-resources*",
          "/faq*",
          "/privacy-policy*",
          "/terms-of-service*"
        ]
      },
      // Special rules for media crawlers
      {
        userAgent: "Googlebot-Image",
        allow: [
          "/*.png",
          "/*.jpg", 
          "/*.jpeg",
          "/*.gif",
          "/*.svg",
          "/*.webp"
        ]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}