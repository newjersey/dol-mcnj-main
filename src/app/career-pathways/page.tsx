import { CtaBanner } from "@components/blocks/CtaBanner";
import { CareerPathwaysPageProps } from "@utils/types";
import { notFound } from "next/navigation";
import globalOgImage from "@images/globalOgImage.jpeg";
import { MinimalBanner } from "@components/blocks/MinimalBanner";
import { IndustrySelector } from "@components/blocks/IndustrySelector";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";

async function getData() {
  const pageData = await fetch(
    `${process.env.REACT_APP_SITE_URL}/api/pageData?slug=career-pathways`
  );

  if (process.env.REACT_APP_FEATURE_CAREER_PATHWAYS === "false") {
    return notFound();
  }

  return {
    pageData: await pageData.json(),
  };
}
export const revalidate = 86400;

export async function generateMetadata({}) {
  const { pageData } = (await getData()) as CareerPathwaysPageProps;

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

export default async function CareerPathwaysPage() {
  const { pageData } = (await getData()) as CareerPathwaysPageProps;

  return (
    <div className="careerPathwaysLanding">
      <MinimalBanner {...pageData.banner} />
      <IndustrySelector {...pageData.industrySelector} />
      <section
        className="body-copy container"
        dangerouslySetInnerHTML={{
          __html: parseMarkdownToHTML(pageData.markdownSection),
        }}
      />
      <CtaBanner {...pageData.cta} />
      <CtaBanner {...pageData.ctaBanner} />
    </div>
  );
}
