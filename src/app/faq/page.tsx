import { CtaBanner } from "@components/blocks/CtaBanner";
import { FaqSection } from "@components/blocks/FaqSection";
import { PageBanner } from "@components/blocks/PageBanner";
import { client } from "@utils/client";
import { FaqPageProps } from "@utils/types";
import { FAQ_PAGE_QUERY } from "queries/faqPage";
import globalOgImage from "@images/globalOgImage.jpeg";
import { FAQ_PAGE_DATA as pageData } from "@data/pages/faq";
import { SupportedLanguages } from "@utils/types/types";
import { cookies } from "next/headers";

async function getData() {
  const { faqCategories } = await client({
    query: FAQ_PAGE_QUERY,
  });

  return {
    faqCategories,
  };
}
export const revalidate = 86400;

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

export default async function FaqPage() {
  const { faqCategories } = (await getData()) as FaqPageProps;
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as SupportedLanguages) || "en";

  return (
    <div className="page faq">
      <PageBanner {...pageData[lang].banner} />
      <FaqSection items={faqCategories.categoriesCollection.items} />
      <CtaBanner {...pageData[lang].ctaBanner} />
      <CtaBanner {...pageData[lang].cta} />
    </div>
  );
}
