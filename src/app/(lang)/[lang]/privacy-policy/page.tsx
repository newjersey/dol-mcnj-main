import globalOgImage from "@images/globalOgImage.jpeg";
import { PRIVACY_POLICY_PAGE_DATA as pageData } from "@data/pages/privacy-policy";
import PrivacyPolicyPage from "app/(main)/privacy-policy/page";

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

export default async function EsPrivacyPolicyPage({
  params,
}: {
  params?: {
    lang?: "en" | "es";
  };
}) {
  const lang = params?.lang || "en";

  return PrivacyPolicyPage({ lang });
}
