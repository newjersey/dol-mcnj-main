import { MetadataRoute } from "next";
import { client } from "@utils/client";
import { SITEMAP_QUERY } from "queries/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { pages, resourceCategories, industries } = await client({
    query: SITEMAP_QUERY,
  });

  const returnSlug = (item: { __typename: string }) => {
    switch (item.__typename) {
      case "CareerNavigatorPage":
        return "career-navigator";
      case "TrainingProviderResourcesPage":
        return "training-provider-resources";
      case "FaqPage":
        return "faq";
      case "TrainingExplorerPage":
        return "training";
      case "AllSupportPage":
        return "support-resources";
      case "CareerPathwaysPage":
        return "career-pathways";
      default:
        return ""; // Default case
    }
  };

  const getLatestDate = (
    items: {
      __typename: string;
      sys: {
        publishedAt: string;
      };
    }[],
  ) => {
    return items.reduce((latest: string, item) => {
      if (item.sys.publishedAt > latest) {
        return item.sys.publishedAt;
      }
      return latest;
    }, "");
  };

  return [
    ...pages.items.map(
      (item: {
        __typename: string;
        sys: {
          publishedAt: string;
        };
      }) => ({
        url: `${process.env.REACT_APP_SITE_URL}/${returnSlug(item)}`,
        lastModified: item.sys.publishedAt,
      }),
    ),
    {
      url: `${process.env.REACT_APP_SITE_URL}/search`,
      lastModified: getLatestDate(pages.items),
    },
    {
      url: `${process.env.REACT_APP_SITE_URL}/terms-of-service`,
      lastModified: getLatestDate(pages.items),
    },
    ...resourceCategories.items.map(
      (item: {
        sys: {
          publishedAt: string;
        };
        slug: string;
      }) => ({
        url: `${process.env.REACT_APP_SITE_URL}/support-resources/${item.slug}`,
        lastModified: item.sys.publishedAt,
      }),
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
      }),
    ),
  ];
}
