import { FancyBanner } from "@components/blocks/FancyBanner";
import { IconCard } from "@components/modules/IconCard";
import { SectionHeading } from "@components/modules/SectionHeading";
import { client } from "@utils/client";
import { HomepageProps, SectionIcons, ThemeColors } from "@utils/types";
import { HOMEPAGE_QUERY } from "queries/homePage";
import { CardSlider } from "@components/blocks/CardSlider";
import { IntroBlocks } from "@components/blocks/IntroBlocks";
import { UpdateNotifier } from "@components/blocks/UpdateNotifier";
import globalOgImage from "@images/globalOgImage.jpeg";

async function getData() {
  const page = await client({
    query: HOMEPAGE_QUERY,
  });

  const pageData = await fetch(
    `${process.env.REACT_APP_SITE_URL}/api/pageData?slug=home`
  );

  return {
    ...page,
    pageData: await pageData.json(),
  };
}

export const revalidate = 86400;

export async function generateMetadata({}) {
  const { homePage } = (await getData()) as HomepageProps;
  return {
    title: process.env.REACT_APP_SITE_NAME,
    description: homePage.pageDescription,
    keywords: homePage.keywords,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      images: [globalOgImage.src],
    },
  };
}

export default async function Home() {
  const { pageData } = (await getData()) as HomepageProps;

  return (
    <>
      <div className="page home">
        <FancyBanner {...pageData.banner} />

        {pageData.introBlocks && <IntroBlocks {...pageData.introBlocks} />}

        <section className="tools" id="tools">
          <div className="container">
            <SectionHeading heading="Explore Tools" strikeThrough />

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
