import { client } from "@utils/client";
import {
  RelatedCategoryProps,
  ResourceCardProps,
  TagProps,
} from "@utils/types";
import { ALL_SUPPORT_PAGE_QUERY } from "queries/allSupportPage";
import globalOgImage from "@images/globalOgImage.jpeg";
import { SUPPORT_RESOURCES_PAGE_DATA as pageData } from "@data/pages/support-resources";
import { ResourceList } from "./ResourceList";
import { PageHero } from "@components/blocks/PageHero";

export interface SupportResourcesPageProps {
  resources: {
    items: ResourceCardProps[];
  };
  categories: {
    items: RelatedCategoryProps[];
  };
  tags?: {
    items: TagProps[];
  };
}

async function getData() {
  const page: SupportResourcesPageProps = await client({
    query: ALL_SUPPORT_PAGE_QUERY,
  });

  return page;
}

export const revalidate = 86400;

export async function generateMetadata({}) {
  return {
    title: `${pageData.seo.title} | ${process.env.REACT_APP_SITE_NAME}`,
    description: pageData.seo.pageDescription,
    keywords: pageData.seo.keywords,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      images: [globalOgImage.src],
    },
  };
}

export default async function SupportResourcesPage() {
  const page = (await getData()) as SupportResourcesPageProps;

  // const cookieStore = await cookies();
  // const lang = (cookieStore.get("lang")?.value as SupportedLanguages) || "en";

  return (
    <div className="page supportResources">
      <PageHero
        heading="Helpful Resources"
        theme="blue"
        subheading="Helpful links to programs, resources, and services beyond My Career NJ"
        infoBar={{
          text: "The information on this page is for general purposes. This is not a complete list of all resources.",
          type: "info",
        }}
      />
      <ResourceList {...page} />
    </div>
  );
}
