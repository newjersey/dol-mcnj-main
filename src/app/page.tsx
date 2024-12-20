import { FancyBanner } from "@components/blocks/FancyBanner";
import { IconCard } from "@components/modules/IconCard";
import { SectionHeading } from "@components/modules/SectionHeading";
import { SectionIcons, ThemeColors } from "@utils/types";
import { CardSlider } from "@components/blocks/CardSlider";
import { IntroBlocks } from "@components/blocks/IntroBlocks";
import { UpdateNotifier } from "@components/blocks/UpdateNotifier";
import globalOgImage from "@images/globalOgImage.jpeg";
import { HOMEPAGE_DATA as pageData } from "@data/pages/home";

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
  return (
    <>
      <div className="page home">
        <FancyBanner {...pageData.banner} />
        <IntroBlocks {...pageData.introBlocks} />
        <section className="tools" id="tools">
          <div className="container">
            <SectionHeading {...pageData.sectionHeading} />
            <div className="row">
              {pageData.sections.map((card: any) => {
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
        {pageData.sections.map((cardRow: any) => (
          <CardSlider
            key={cardRow.heading}
            heading={cardRow.heading}
            theme={cardRow.theme as ThemeColors}
            sectionId={cardRow.sectionId}
            cards={cardRow.cards}
          />
        ))}
      </div>
      {process.env.REACT_APP_FEATURE_PINPOINT === "true" && <UpdateNotifier />}
    </>
  );
}
