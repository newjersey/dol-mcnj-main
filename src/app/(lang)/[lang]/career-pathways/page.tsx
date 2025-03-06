import globalOgImage from "@images/globalOgImage.jpeg";
import { CAREER_PATHWAYS_PAGE_DATA as pageData } from "@data/pages/career-pathways";
import CareerPathwaysPage from "app/(main)/career-pathways/page";
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

export default async function EsCareerPathwaysPage({
  params,
}: {
  params?: {
    lang?: SupportedLanguages;
  };
}) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";

  return CareerPathwaysPage({ lang });
}
