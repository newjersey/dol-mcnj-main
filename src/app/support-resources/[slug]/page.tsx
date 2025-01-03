import { PageBanner } from "@components/blocks/PageBanner";
import { client } from "@utils/client";
import {
  ContentfulRichTextProps,
  ResourceCategoryPageProps,
} from "@utils/types";
import { RESOURCE_CATEGORY_QUERY } from "queries/resourceCategory";
import { Filter } from "./Filter";
import { notFound } from "next/navigation";
import { RESOURCE_LISTING_QUERY } from "queries/resourceListing";
import globalOgImage from "@images/globalOgImage.jpeg";

async function getData(slug: string) {
  const { page, tags, audience, cta } = await client({
    query: RESOURCE_CATEGORY_QUERY,
    variables: {
      slug,
    },
  });

  if (slug === "audience" || page.items.length === 0) {
    notFound();
  }

  console.log({ page });

  const allTags = [...tags.items].map((tag) => tag.title);

  const listingItems = (await client({
    query: RESOURCE_LISTING_QUERY,
    variables: {
      tags: allTags,
    },
  })) as ResourceCategoryPageProps["listingItems"];

  const usedTags = listingItems.resources.items
    .map((resource) => resource.tagsCollection.items.map((tag) => tag.title))
    .flat()
    .filter((tag, index, self) => self.indexOf(tag) === index);

  const usedAudience = listingItems.resources.items
    .map((resource) => resource.tagsCollection.items.map((tag) => tag.title))
    .flat()
    .filter((tag, index, self) => self.indexOf(tag) === index);

  return {
    page,
    listingItems,
    tags: {
      items: [...tags.items].filter((tag) => usedTags.includes(tag.title)),
    },
    audience: {
      items: [...audience.items].filter((tag) =>
        usedAudience.includes(tag.title)
      ),
    },
    cta,
  };
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const data = (await getData(slug)) as ResourceCategoryPageProps;

  return {
    title: `${data.page.items[0].title} | Support Resources | ${process.env.REACT_APP_SITE_NAME}`,
    description: data.page.items[0].description,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      images: [globalOgImage.src],
    },
  };
};

export const revalidate = 1800;

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = (await getData(slug)) as ResourceCategoryPageProps;

  if (data.page.items.length === 0) {
    notFound();
  }

  const message = {
    json: {
      data: {},
      content: [
        {
          data: {},
          content: [
            {
              data: {},
              marks: [],
              value: data.page.items[0].description,
              nodeType: "text",
            },
          ],
          nodeType: "paragraph",
        },
      ],
      nodeType: "document",
    },
  } as ContentfulRichTextProps;

  return (
    <div className="page resourceDetail">
      <PageBanner
        theme="navy"
        title={data.page.items[0].title}
        message={message}
        breadcrumbsCollection={{
          items: [
            {
              copy: "Home",
              url: "/",
            },
            {
              copy: "Support Resources",
              url: "/support-resources",
            },
          ],
        }}
      />

      <Filter {...data} />
    </div>
  );
}
