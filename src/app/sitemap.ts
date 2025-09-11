import { MetadataRoute } from "next";
import { client } from "@utils/client";
import { SITEMAP_QUERY } from "queries/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { resourceCategories, industries } = await client({
    query: SITEMAP_QUERY,
  });

  return [
    {
      url: `${process.env.REACT_APP_SITE_URL}/`,
      lastModified: "2024-10-08T11:36:39.205Z",
    },
    {
      url: `${process.env.REACT_APP_SITE_URL}/contact`,
      lastModified: "2024-10-08T11:36:39.205Z",
    },
    {
      url: `${process.env.REACT_APP_SITE_URL}/career-pathways`,
      lastModified: "2024-10-04T14:16:52.721Z",
    },
    {
      url: `${process.env.REACT_APP_SITE_URL}/privacy-policy`,
      lastModified: "2024-10-08T11:36:39.205Z",
    },

    {
      url: `${process.env.REACT_APP_SITE_URL}/faq`,
      lastModified: "2024-07-16T18:09:36.014Z",
    },

    {
      url: `${process.env.REACT_APP_SITE_URL}/training-provider-resources`,
      lastModified: "2024-07-16T18:09:27.035Z",
    },
    {
      url: `${process.env.REACT_APP_SITE_URL}/career-navigator`,
      lastModified: "2024-07-16T18:08:59.069Z",
    },

    {
      url: `${process.env.REACT_APP_SITE_URL}/search`,
      lastModified: "2024-10-08T11:36:39.205Z",
    },
    {
      url: `${process.env.REACT_APP_SITE_URL}/terms-of-service`,
      lastModified: "2024-10-08T11:36:39.205Z",
    },
    ...resourceCategories.items
      .filter((item: { slug: string }) => item.slug !== "audience")
      .map(
        (item: {
          sys: {
            publishedAt: string;
          };
          slug: string;
        }) => ({
          url: `${process.env.REACT_APP_SITE_URL}/support-resources/${item.slug}`,
          lastModified: item.sys.publishedAt,
        })
      ),
    ...industries.items.map(
      (item: {
        sys: {
          publishedAt: string;
        };
        slug: string;
      }) => ({
        url: `${process.env.REACT_APP_SITE_URL}/career-pathways/${item.slug}`,
        lastModified: item.sys.publishedAt,
      })
    ),
  ];
}
