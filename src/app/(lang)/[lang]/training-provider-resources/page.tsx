import globalOgImage from "@images/globalOgImage.jpeg";
import { TRAINING_PROVIDER_PAGE_DATA as pageData } from "@data/pages/training-provider-resources";
import TrainingProviderResourcesPage from "app/(main)/training-provider-resources/page";
import { SupportedLanguages } from "@utils/types/types";

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

export default async function EsTrainingProviderResourcesPage({
  params,
}: {
  params?: {
    lang?: SupportedLanguages;
  };
}) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";

  return TrainingProviderResourcesPage({ lang });
}
