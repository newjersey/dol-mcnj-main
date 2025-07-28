import { PageBanner } from "@components/blocks/PageBanner";
import globalOgImage from "@images/globalOgImage.jpeg";
import { TRAINING_PROVIDER_PAGE_DATA as pageData } from "@data/pages/training-provider-resources";
import { SupportedLanguages } from "@utils/types/types";
import { cookies } from "next/headers";
import { Article } from "@components/blocks/Article";
import { article } from "@data/mock/article";
import { PageHero } from "@components/blocks/PageHero";

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
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as SupportedLanguages) || "en";

  return (
    <div className="page trainingProviderResources">
      <PageHero {...pageData[lang].pageHero} />
      <Article content={article} />
    </div>
  );
}
