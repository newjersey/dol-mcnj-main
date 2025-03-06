import globalOgImage from "@images/globalOgImage.jpeg";
import { FAQ_PAGE_DATA as pageData } from "@data/pages/faq";
import FaqPage from "app/(main)/faq/page";
import { SupportedLanguages } from "@utils/types/types";

export async function generateMetadata({}) {
  return {
    title: `${pageData.seo.title} | ${process.env.REACT_APP_SITE_NAME}`,
    description: pageData.seo.pageDescription,
    keywords: pageData.seo.keywords,
    openGraph: {
      images: [globalOgImage.src],
    },
  };
}

export default async function EsFaqPage({
  params,
}: {
  params?: {
    lang?: SupportedLanguages;
  };
}) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";

  return FaqPage({ lang });
}
