import globalOgImage from "@images/globalOgImage.jpeg";
import { PRIVACY_POLICY_PAGE_DATA as pageData } from "@data/pages/privacy-policy";
import CareerNavigatorPage from "app/(main)/navigator/page";
import { SupportedLanguages } from "@utils/types/types";

export async function generateMetadata({}) {
  return {
    title: pageData.seo.title,
    openGraph: {
      images: [globalOgImage.src],
    },
    description: pageData.seo.pageDescription,
  };
}

export default async function EsCareerNavigatorPage({
  params,
}: {
  params?: {
    lang?: SupportedLanguages;
  };
}) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";

  return CareerNavigatorPage({ lang });
}
