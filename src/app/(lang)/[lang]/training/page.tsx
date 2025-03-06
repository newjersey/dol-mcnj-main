import globalOgImage from "@images/globalOgImage.jpeg";
import { TRAINING_EXPLORER_PAGE_DATA as pageData } from "@data/pages/training";
import TrainingExplorerPage from "app/(main)/training/page";
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

export default async function EsTrainingExplorerPage({
  params,
}: {
  params?: {
    lang?: SupportedLanguages;
  };
}) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";

  return TrainingExplorerPage({ lang });
}
