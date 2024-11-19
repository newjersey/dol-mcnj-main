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

  return {
    ...page,
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
  const { homePage } = (await getData()) as HomepageProps;

  const sliders = [
    {
      heading: "All Job Search Tools",
      theme: "blue",
      sectionId: "jobs",
      cards: homePage.jobSearchToolLinksCollection.items,
    },
    {
      heading: "All Training Tools",
      theme: "green",
      sectionId: "training",
      cards: homePage.trainingToolLinksCollection.items,
    },
    {
      heading: "All Career Exploration Resources",
      theme: "purple",
      sectionId: "explore",
      cards: homePage.careerExplorationToolLinksCollection.items,
    },
    {
      heading: "All Support and Assistance Resources",
      theme: "navy",
      sectionId: "support",
      cards: homePage.supportAndAssistanceLinksCollection.items,
    },
  ];

  return (
    <>
      <div className="page home">
        <FancyBanner
          title={homePage.title}
          theme="blue"
          buttonCopy={homePage.bannerButtonCopy}
          image={homePage.bannerImage}
          subHeading="The tools you need to find a job that works for you."
          message="The right job is out there— if you know where to look for it. MyCareerNJ is a great place to start, with job listings throughout the state of New Jersey. We can also help you discover career possibilities, learn new job skills, assist with career changes, and offer advice for new employees. See for yourself how MyCareerNJ can help you."
        />
        {homePage.introBlocks && <IntroBlocks {...homePage.introBlocks} />}

        <section className="tools" id="tools">
          <div className="container">
            {homePage.toolsCollection &&
              homePage.toolsCollection.items.length > 0 && (
                <SectionHeading heading="Explore Tools" strikeThrough />
              )}
            <div className="row">
              {homePage.toolsCollection &&
                homePage.toolsCollection.items.length > 0 &&
                homePage.toolsCollection.items.map((card) => {
                  return (
                    <IconCard
                      key={card.sys.id}
                      centered
                      systemIcon={card.sectionIcon as SectionIcons}
                      {...card}
                    />
                  );
                })}
            </div>
          </div>
        </section>

        {sliders.map((slider) => (
          <CardSlider
            key={slider.heading}
            heading={slider.heading}
            theme={slider.theme as ThemeColors}
            sectionId={slider.sectionId}
            cards={slider.cards}
          />
        ))}
      </div>
      {process.env.REACT_APP_FEATURE_PINPOINT === "true" && <UpdateNotifier />}
    </>
  );
}
