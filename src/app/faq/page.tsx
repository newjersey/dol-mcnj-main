import { CtaBanner } from "@components/blocks/CtaBanner";
import { FaqSection } from "@components/blocks/FaqSection";
import { PageBanner } from "@components/blocks/PageBanner";
import { client } from "@utils/client";
import { FaqPageProps } from "@utils/types";
import { FAQ_PAGE_QUERY } from "queries/faqPage";
import globalOgImage from "@images/globalOgImage.jpeg";
import { FAQ_PAGE_DATA as pageData } from "@data/pages/faq";

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

  return (
    <div className="page faq">
      <PageBanner {...pageData.banner} />
      <FaqSection items={faqCategories.categoriesCollection.items} />
      <CtaBanner {...pageData.ctaBanner} />
      <CtaBanner {...pageData.cta} />
    </div>
  );
}
