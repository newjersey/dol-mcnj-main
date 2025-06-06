import { RouteComponentProps } from "@reach/router";
import { ReactElement, useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import {
  AllSupportPageProps,
  ResourceCategoryPageProps,
  ResourceItemProps,
  TagProps,
} from "../types/contentful";
import { usePageTitle } from "../utils/usePageTitle";
import { fetchContentful, useContentful } from "../utils/useContentful";
import pageImage from "../images/ogImages/supportAssistance.jpg";
import { ResourceList } from "../components/ResourceList";
import { HeroBanner } from "../components/HeroBanner";

interface Props extends RouteComponentProps {
  client: Client;
}

export const AllSupportPage = (props: Props): ReactElement => {
  const data: AllSupportPageProps = useContentful({
    path: `/all-support`,
  });
  const [categoryDetailsArray, setCategoryDetailsArray] = useState<
    { slug: string; data: ResourceCategoryPageProps }[]
  >([]);
  const [resourceItems, setResourceItems] = useState<ResourceItemProps[]>([]);

  useEffect(() => {
    if (!data?.categories?.items?.length) return;

    const fetchAllCategoryDetails = async () => {
      const results = await Promise.all(
        data.categories.items.map(async (category) => {
          const res = await fetchContentful<ResourceCategoryPageProps>(
            `/resource-category/${category.slug}`,
          );
          return { slug: category.slug, data: res };
        }),
      );
      setCategoryDetailsArray(results);
    };
    const fetchAllResources = async () => {
      const results = await fetchContentful<{
        resources: {
          items: ResourceItemProps[];
        };
      }>(`/resource-listing`);
      setResourceItems(results.resources.items);
    };

    fetchAllCategoryDetails();
    fetchAllResources();
  }, [data]);

  data?.categories.items.sort((a, b) => a.title.localeCompare(b.title));

  const filteredCategories: AllSupportPageProps["categories"]["items"] =
    data?.categories.items.filter((category) => category.title !== "Other Assistance");

  const otherAssistance = data?.categories.items.find(
    (category) => category.title === "Other Assistance",
  );

  if (otherAssistance) {
    filteredCategories.push(otherAssistance);
  }

  usePageTitle(`${data?.page.title} | ${process.env.REACT_APP_SITE_NAME}`);

  const seoObject = {
    title: data
      ? `${data?.page.title} | ${process.env.REACT_APP_SITE_NAME}`
      : `Support and Assistance Resources | ${process.env.REACT_APP_SITE_NAME}`,
    pageDescription:
      data?.page.pageDescription || "Browse support and assistance resources by category.",
    image: data?.page.ogImage?.url || pageImage,
    keywords: data?.page.keywords || [
      "New Jersey",
      "Support",
      "Assistance",
      "Resources",
      "Training",
      "Job",
      "Career",
      "My Career NJ",
    ],
    url: props.location?.pathname || "/support-resources",
  };

  const tags = Array.from(
    new Map(
      categoryDetailsArray.flatMap((cat) => cat.data.tags.items).map((item) => [item.sys.id, item]),
    ).values(),
  );

  type GroupedTag = {
    category: {
      title: string;
      slug: string;
    };
    tags: TagProps[];
  };

  const groupedTags: GroupedTag[] = Object.values(
    tags.reduce(
      (acc, tag) => {
        const key = tag.category.slug;

        if (!acc[key]) {
          acc[key] = {
            category: {
              title: tag.category.title,
              slug: tag.category.slug,
            },
            tags: [],
          };
        }

        acc[key].tags.push({
          ...tag,
        });

        return acc;
      },
      {} as Record<string, GroupedTag>,
    ),
  );

  const audience = Array.from(
    new Map(
      categoryDetailsArray
        .flatMap((cat) => cat.data.audience.items)
        .map((item) => [item.sys.id, item]),
    ).values(),
  );

  return (
    <>
      {data && (
        <Layout client={props.client} theme="support" seo={seoObject}>
          <HeroBanner
            eyebrow="Helpful Resources"
            heading="Helpful links to programs, resources, and services beyond My Career NJ"
            infoBar="The information on this page is for general purposes. This is not a complete list of all resources."
          />

          <ResourceList
            category="Title Goes Here!!!"
            tags={groupedTags}
            audience={audience}
            resources={resourceItems}
            cta={{
              footerCtaHeading: data.page.footerCtaHeading,
              footerCtaLink: data.page.footerCtaLink,
            }}
          />
        </Layout>
      )}
    </>
  );
};
