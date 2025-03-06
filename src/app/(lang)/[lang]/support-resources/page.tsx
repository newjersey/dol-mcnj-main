import globalOgImage from "@images/globalOgImage.jpeg";
import { HOMEPAGE_DATA as pageData } from "@data/pages/home";
import SupportResourcesPage from "app/(main)/support-resources/page";
import { SupportedLanguages } from "@utils/types/types";

export async function generateMetadata({}) {
  return {
    title: process.env.REACT_APP_SITE_NAME,
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

export default async function EsSupportResourcesPage({
  params,
}: {
  params?: {
    lang?: SupportedLanguages;
  };
}) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";

  return SupportResourcesPage({ lang });
}
