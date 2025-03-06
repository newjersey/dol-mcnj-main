import globalOgImage from "@images/globalOgImage.jpeg";
import { CONTACT_PAGE_DATA as pageData } from "@data/pages/contact";
import ContactPage from "app/(main)/contact/page";
import { SupportedLanguages } from "@utils/types/types";

export async function generateMetadata({}) {
  return {
    title: pageData.seo.title,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      images: [globalOgImage.src],
    },
  };
}

export default async function EsContactPage({
  params,
}: {
  params?: {
    lang?: SupportedLanguages;
  };
}) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";

  return ContactPage({ lang });
}
