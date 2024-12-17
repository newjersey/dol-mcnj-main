import { CtaBanner } from "@components/blocks/CtaBanner";
import { FaqSection } from "@components/blocks/FaqSection";
import { PageBanner } from "@components/blocks/PageBanner";
import { client } from "@utils/client";
import { FaqPageProps } from "@utils/types";
import { FAQ_PAGE_QUERY } from "queries/faqPage";
import globalOgImage from "@images/globalOgImage.jpeg";

async function getData() {
  const { page } = await client({
    query: FAQ_PAGE_QUERY,
  });

  const pageData = await fetch(
    `${process.env.REACT_APP_SITE_URL}/api/pageData?slug=faq`
  );

  return {
    page,
    pageData: await pageData.json(),
  };
}
export const revalidate = 86400;

export async function generateMetadata({}) {
  const { pageData } = (await getData()) as FaqPageProps;

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
  const { page, pageData } = (await getData()) as FaqPageProps;

  return (
    <div className="page faq">
      <PageBanner {...pageData.banner} />
      <FaqSection items={page.categoriesCollection.items} />
      <CtaBanner {...pageData.ctaBanner} />
      <CtaBanner {...pageData.cta} />
    </div>
  );
}
