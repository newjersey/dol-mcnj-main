import globalOgImage from "@images/globalOgImage.jpeg";
import { TRAINING_EXPLORER_PAGE_DATA as pageData } from "@data/pages/training";
import SearchPage from "app/(main)/training/search/page";
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

export default async function EsSearchPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{
    [key: string]: string;
  }>;
  params?: {
    lang?: SupportedLanguages;
  };
}) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";

  return SearchPage({ searchParams, lang });
}
