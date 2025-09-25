import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.REACT_APP_SITE_URL || "https://mycareer.nj.gov";
  const lastModified = new Date().toISOString();

  // Static sitemap for build environments where external APIs aren't available
  const staticSitemap = [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/career-pathways`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/training-provider-resources`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/career-navigator`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  // Try to fetch dynamic content if APIs are available
  try {
    const { client } = await import("@utils/client");
    const { SITEMAP_QUERY } = await import("queries/sitemap");
    
    const { resourceCategories, industries } = await client({
      query: SITEMAP_QUERY,
    });

    const dynamicSitemap = [
      ...staticSitemap,
      ...resourceCategories.items
        .filter((item: { slug: string }) => item.slug !== "audience")
        .map((item: {
          sys: { publishedAt: string };
          slug: string;
        }) => ({
          url: `${baseUrl}/support-resources/${item.slug}`,
          lastModified: item.sys.publishedAt,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        })),
      ...industries.items.map((item: {
        sys: { publishedAt: string };
        slug: string;
      }) => ({
        url: `${baseUrl}/career-pathways/${item.slug}`,
        lastModified: item.sys.publishedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
    ];

    return dynamicSitemap;
  } catch (error) {
    console.warn("Failed to fetch dynamic sitemap data, using static sitemap", error);
    return staticSitemap;
  }
}
