import { FancyBanner } from "@components/blocks/FancyBanner";
import { IconCard } from "@components/modules/IconCard";
import { SectionHeading } from "@components/modules/SectionHeading";
import { SectionIcons, ThemeColors } from "@utils/types";
import { CardSlider } from "@components/blocks/CardSlider";
import { IntroBlocks } from "@components/blocks/IntroBlocks";
import globalOgImage from "@images/globalOgImage.jpeg";
import { HOMEPAGE_DATA as pageData } from "@data/pages/home";
import { SupportedLanguages } from "@utils/types/types";
import { cookies } from "next/headers";

export const revalidate = 86400;

export async function generateMetadata({}) {
  return {
    title: process.env.REACT_APP_SITE_NAME,
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

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

export default async function Home() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as SupportedLanguages) || "en";

  return (
    <>
      <div className="page home">
        <FancyBanner {...pageData[lang].banner} />
        <IntroBlocks {...pageData[lang].introBlocks} />
        <section className="tools" id="tools">
          <div className="container">
            <SectionHeading {...pageData[lang].sectionHeading} />
            <div className="row">
              {pageData[lang].sections.map((card: any) => {
                return (
                  <IconCard
                    key={card.copy}
                    centered
                    systemIcon={card.sectionId as SectionIcons}
                    url={`#${card.sectionId}`}
                    sys={{ id: card.sectionId }}
                    copy={card.copy}
                    theme={card.theme as ThemeColors}
                  />
                );
              })}
            </div>
          </div>
        </section>
        {pageData[lang].sections.map((cardRow: any) => (
          <CardSlider key={cardRow.heading} {...cardRow} />
        ))}
      </div>
    </>
  );
}
