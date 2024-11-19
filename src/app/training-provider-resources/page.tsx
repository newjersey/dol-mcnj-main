import { PageBanner } from "@components/blocks/PageBanner";
import { client } from "@utils/client";
import { TrainingProviderPageData } from "@utils/types";
import { TRAINING_PROVIDER_PAGE_QUERY } from "queries/trainingProviderPage";
import { Tabs } from "@components/blocks/Tabs";
import globalOgImage from "@images/globalOgImage.jpeg";

async function getData() {
  const { page } = await client({
    query: TRAINING_PROVIDER_PAGE_QUERY,
  });

  return {
    page,
  };
}

export const revalidate = 86400;

export async function generateMetadata({}) {
  const { page } = (await getData()) as TrainingProviderPageData;

  return {
    title: `${page.title} | ${process.env.REACT_APP_SITE_NAME}`,
    description: page.pageDescription,
    keywords: page.keywords,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      images: [globalOgImage.src],
    },
  };
}

export default async function TrainingProviderResourcesPage() {
  const { page } = (await getData()) as TrainingProviderPageData;

  return (
    <div className="page trainingProviderResources">
      <PageBanner {...page.pageBanner} />
      <Tabs items={page.tabs.items} />
    </div>
  );
}
