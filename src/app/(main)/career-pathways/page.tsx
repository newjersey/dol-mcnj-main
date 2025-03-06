import { CtaBanner } from "@components/blocks/CtaBanner";
import globalOgImage from "@images/globalOgImage.jpeg";
import { MinimalBanner } from "@components/blocks/MinimalBanner";
import { IndustrySelector } from "@components/blocks/IndustrySelector";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";
import { CAREER_PATHWAYS_PAGE_DATA as pageData } from "@data/pages/career-pathways";
import { SupportedLanguages } from "@utils/types/types";

export const revalidate = 86400;

export async function generateMetadata({}) {
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

export default async function CareerPathwaysPage({
  lang = "en",
}: {
  lang?: SupportedLanguages;
}) {
  return (
    <div className="careerPathwaysLanding">
      <MinimalBanner {...pageData[lang].banner} />
      <IndustrySelector {...pageData[lang].industrySelector} />
      <section className="body-copy container">
        {pageData[lang].bodyContent.map((copy, index) => (
          <div
            key={`body-copy-${index}`}
            dangerouslySetInnerHTML={{
              __html: parseMarkdownToHTML(copy),
            }}
          />
        ))}
      </section>
      <CtaBanner {...pageData[lang].cta} />
      <CtaBanner {...pageData[lang].ctaBanner} />
    </div>
  );
}
