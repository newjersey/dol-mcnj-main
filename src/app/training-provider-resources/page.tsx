import { PageBanner } from "@components/blocks/PageBanner";
import { Tabs } from "@components/blocks/Tabs";
import globalOgImage from "@images/globalOgImage.jpeg";
import { TRAINING_PROVIDER_PAGE_DATA as pageData } from "@data/pages/training-provider-resources";

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

export default async function TrainingProviderResourcesPage() {
  return (
    <div className="page trainingProviderResources">
      <PageBanner {...pageData.banner} />
      <Tabs {...pageData.tabs} />
    </div>
  );
}
