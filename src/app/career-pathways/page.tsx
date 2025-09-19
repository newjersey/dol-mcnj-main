import { CtaBanner } from "@components/blocks/CtaBanner";
import globalOgImage from "@images/globalOgImage.jpeg";
import { IndustrySelector } from "@components/blocks/IndustrySelector";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";
import { CAREER_PATHWAYS_PAGE_DATA as pageData } from "@data/pages/career-pathways";
import { SupportedLanguages } from "@utils/types/types";
import { cookies } from "next/headers";
import Image from "next/image";
import { PageHero } from "@components/blocks/PageHero";

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

export default async function CareerPathwaysPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as SupportedLanguages) || "en";

  return (
    <div className="careerPathwaysLanding">
      <PageHero {...pageData[lang].pageHero} />
      <IndustrySelector {...pageData[lang].industrySelector} />
      <section className="body-copy container">
        {pageData[lang].bodyContent.map((block, index) => (
          <div key={`body-copy-${index}`} className="contentContainer">
            <div className="image">
              <Image
                src={block.image.src}
                alt=""
                width={block.image.width}
                height={block.image.height}
                blurDataURL={block.image.blurDataURL}
                placeholder="blur"
              />
            </div>
            <div className="contentBlocks">
              {block.contentBlocks.map((content) => (
                <div
                  key={content.copy}
                  className={`content ${content.theme}`}
                  dangerouslySetInnerHTML={{
                    __html: parseMarkdownToHTML(content.copy),
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </section>
      <CtaBanner {...pageData[lang].cta} />
      <CtaBanner {...pageData[lang].ctaBanner} />
    </div>
  );
}
