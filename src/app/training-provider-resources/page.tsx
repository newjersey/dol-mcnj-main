import { PageBanner } from "@components/blocks/PageBanner";
import { MainLayout } from "@components/global/MainLayout";
import { client } from "@utils/client";
import { TrainingProviderPageData } from "@utils/types";
import { TRAINING_PROVIDER_PAGE_QUERY } from "queries/trainingProviderPage";
import { Tabs } from "@components/blocks/Tabs";
import { getNav } from "@utils/getNav";
import globalOgImage from "@images/globalOgImage.jpeg";

async function getData() {
  const { globalNav, mainNav, footerNav1, footerNav2 } = await getNav();

  const { page } = await client({
    query: TRAINING_PROVIDER_PAGE_QUERY,
  });

  return {
    page,
    globalNav,
    mainNav,
    footerNav1,
    footerNav2,
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
  const { page, footerNav1, footerNav2, globalNav, mainNav } =
    (await getData()) as TrainingProviderPageData;

  const navs = {
    footerNav1,
    footerNav2,
    globalNav,
    mainNav,
  };

  return (
    <MainLayout {...navs}>
      <div className="page trainingProviderResources">
        <PageBanner {...page.pageBanner} />
        <Tabs items={page.tabs.items} />
      </div>
    </MainLayout>
  );
}
