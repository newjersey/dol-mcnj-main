import globalOgImage from "@images/globalOgImage.jpeg";
import { PRIVACY_POLICY_PAGE_DATA as pageData } from "@data/pages/privacy-policy";
import TermsOfServicePage from "app/(main)/terms-of-service/page";
import { SupportedLanguages } from "@utils/types/types";

export function metadata() {
  return {
    title: pageData.seo.title,
    description: pageData.seo.pageDescription,
    openGraph: {
      images: [globalOgImage.src],
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default async function EsTermsOfServicePage({
  params,
}: {
  params?: {
    lang?: SupportedLanguages;
  };
}) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";

  return TermsOfServicePage({ lang });
}
